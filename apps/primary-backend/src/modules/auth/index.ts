import { Elysia, status } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { checkRateLimit } from "../../rateLimit";

export const app = new Elysia({ prefix: "auth" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )

    .post("/sign-up", async ({ body, status, request, set }) => {

        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        const rateLimit = await checkRateLimit(
            `primary:auth:signup:ip:${ip}`,
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

            const userId = await AuthService.signup(body.email, body.password);
            return {
                id: String(userId)
            }
        } catch (e) {
            console.error("SIGNUP ERROR:", e);
            return status(400, {
                message: "Error while signing up"
            })
        }

    }, {
        body: AuthModel.signUpSchema,
        response: {
            200: AuthModel.signUpResponseSchema,
            400: AuthModel.signUpFailedResponseSchema,
            429: AuthModel.rateLimitResponseSchema
        }
    })
    .post("/sign-in", async ({ jwt, body, status, cookie: { auth }, request, set }) => {

        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        const rateLimit = await checkRateLimit(
            `primary:auth:signin:ip:${ip}`,
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

            const { correctCredentials, userId } = await AuthService.signin(body.email, body.password);

            if (correctCredentials && userId) {
                const token = await jwt.sign({ userId })

                auth.set({
                    value: token,
                    httpOnly: true,
                    maxAge: 7 * 86400,
                    path: "/",
                    sameSite: "none",
                    secure: true,
                })

                return {
                    message: "signed in successfully"
                }
            } else {
                return status(400, {
                    message: "Invalid username or password"
                })
            }

        } catch (e) {
            console.error("Error: ", e);
            return status(400, {
                message: "Invalid username or password"
            })
        }
    }, {
        body: AuthModel.signInSchema,
        response: {
            200: AuthModel.signInResponseSchema,
            400: AuthModel.signInFailedResponseSchema,
            429: AuthModel.rateLimitResponseSchema
        }
    })
    .post("/sign-out", ({ cookie: { auth } }) => {
        try {
            // Cookie attributes must match the ones used when signing in. In
            // particular, an explicit path makes the browser replace the
            // existing auth cookie instead of creating a second, expired one.
            auth.set({
                value: "",
                expires: new Date(0),
                maxAge: 0,
                path: "/",
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            return { message: "signed out successfully" }
        } catch (e) {
            console.error("Error: ", e);
            return status(400, {
                message: "sign out failed"
            })
        }
    }, {
        response: {
            200: AuthModel.signOutResponseSchema,
            400: AuthModel.signOutFailedResponseSchema
        }
    })
    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) return status(401);

        const decoded = await jwt.verify(auth.value as string)

        if (!decoded || !decoded.userId) {
            return status(401)
        }

        return {
            userId: decoded.userId
        }
    })
    .get("/profile", async ({ userId, status }) => {
        const userData = await AuthService.getProfileDetails(Number(userId))
        if (!userData) {
            return status(400, {
                message: "error while fetching user details"
            })
        }
        return userData
    }, {
        response: {
            200: AuthModel.profileResponseSchema,
            400: AuthModel.profileResponseFailedSchema
        }
    })
