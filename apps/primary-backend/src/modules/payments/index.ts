import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PaymentsService } from "./service";
import { PaymentsModel } from "./model";
import { checkRateLimit } from "../../rateLimit";
import { AuthModel } from "../auth/model";

export const app = new Elysia({ prefix: "payments" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!
        })
    )
    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) return status(401);

        const decoded = await jwt.verify(auth.value as string);

        if (!decoded || !decoded.userId) return status(401);

        return {
            userId: decoded.userId as string
        }
    })
    .post("/onramp", async ({ userId, status, set }) => {

        const rateLimit = await checkRateLimit(
            `primary:payments:onramp:user:${userId}`,
            5,
            60
        );

        set.headers["X-RateLimit-Limit"] = String(rateLimit.limit);
        set.headers["X-RateLimit-Remaining"] = String(rateLimit.remaining);
        set.headers["X-RateLimit-Reset"] = String(rateLimit.reset);

        if (!rateLimit.allowed) {
            set.headers["Retry-After"] = String(rateLimit.reset);

            return status(429, {
                message: "Too many attempts. Please try again later."
            });
        }

        try {
            const credits = await PaymentsService.onramp(Number(userId))
            return {
                message: "onramp successfull",
                credits
            }
        } catch (e) {
            return status(411, {
                message: "onramp failed"
            })
        }
    }, {
        response: {
            200: PaymentsModel.onrampResponseSchema,
            411: PaymentsModel.onrampFailedResponseSchema,
            429: AuthModel.rateLimitResponseSchema
        }
    })