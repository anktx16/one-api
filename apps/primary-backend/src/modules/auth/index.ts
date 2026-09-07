import { Elysia, status } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "auth" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )

    .post("/sign-up", async ({ body, status }) => {
        try {
            console.log("log 1")
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
            400: AuthModel.signUpFailedResponseSchema
        }
    })
    .post("/sign-in", async ({ jwt, body, status, cookie: { auth } }) => {
        const { correctCredentials, userId } = await AuthService.signin(body.email, body.password);

        if (correctCredentials && userId) {
            const token = await jwt.sign({ userId })

            auth.set({
                value: token,
                httpOnly: true,
                maxAge: 7 * 86400,
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
    }, {
        body: AuthModel.signInSchema,
        response: {
            200: AuthModel.signInResponseSchema,
            400: AuthModel.signInFailedResponseSchema
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