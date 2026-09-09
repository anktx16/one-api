import jwt from "@elysiajs/jwt";
import Elysia, { status } from "elysia";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./model";
import { checkRateLimit } from "../../rateLimit";
import { AuthModel } from "../auth/model";

export const app = new Elysia({ prefix: "api-keys" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )
    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth?.value) {
            return status(401, {
                message: "Unauthorized"
            });
        }

        const decoded = await jwt.verify(auth.value as string)

        if (!decoded || !decoded.userId) {
            return status(401)
        }

        return {
            userId: decoded.userId
        }
    })
    .post("/", async ({ userId, body, status, set }) => {

        const rateLimit = await checkRateLimit(
            `primary:apikey:create:user:${userId}`,
            10,
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

            const { apiKey, id } = await ApiKeyService.createApiKey(body.name, Number(userId))
            return {
                apiKey,
                id
            }
        } catch (e) {
            return status(400, {
                message: "failed to create api key"
            })
        }
    }, {
        body: ApiKeyModel.createApiKeySchema,
        response: {
            200: ApiKeyModel.createApiKeyResponseSchema,
            400: ApiKeyModel.createApiKeyFailedResponseSchema,
            429: AuthModel.rateLimitResponseSchema
        }
    })
    .get("/", async ({ userId }) => {
        try {
            console.log("User ID:", userId);
            const apiKeys = await ApiKeyService.getApiKeys(Number(userId))
            return {
                apiKeys: apiKeys
            }
        } catch (e) {
            console.error("Failed to get api key: ", e);
            return status(400, {
                message: "failed to get api key"
            })
        }
    }, {
        response: {
            200: ApiKeyModel.getApiKeyResponseSchema,
            400: ApiKeyModel.getApiKeyFailedResponseSchema
        }

    })
    .put("/", async ({ body, userId, status, set }) => {

        const rateLimit = await checkRateLimit(
            `primary:apikey:update:user:${userId}`,
            20,
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

            const disabled = await ApiKeyService.updateApiKeyDisabled(Number(body.id), Number(userId), body.disabled)
            return {
                message: "updated Api key status successfully"
            }
        } catch (e) {
            return status(411, {
                message: "updating Api key status unsuccessfull"
            })
        }
    }, {
        body: ApiKeyModel.updateApiKeySchema,
        response: {
            200: ApiKeyModel.updateApiKeyResponseSchema,
            411: ApiKeyModel.updateApiKeyFailedResponseSchema,
            429: AuthModel.rateLimitResponseSchema
        }
    })
    .delete("/:id", async ({ params: { id }, userId, status, set }) => {

        const rateLimit = await checkRateLimit(
            `primary:apikey:delete:user:${userId}`,
            20,
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

            await ApiKeyService.delete(Number(userId), Number(id))
            return {
                message: "Deleted Api key successfully"
            }
        } catch (e) {
            return status(411, {
                message: "Deletion of Api key failed"
            })
        }
    }, {
        response: {
            200: ApiKeyModel.deleteApiKeyResponseSchema,
            411: ApiKeyModel.deleteApiKeyFailedResponseSchema,
            429: AuthModel.rateLimitResponseSchema
        }
    })