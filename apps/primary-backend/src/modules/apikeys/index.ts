import jwt from "@elysiajs/jwt";
import Elysia, { status } from "elysia";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./model";

export const app = new Elysia({ prefix: "api-keys"})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )
    .resolve(async ({cookie: { auth }, status, jwt}) => {
        if (!auth?.value) {
            return status(401, {
                message: "Unauthorized"
            });
        }
        
        const decoded = await jwt.verify(auth.value as string)

        if(!decoded || !decoded.userId){
            return status(401)
        }

        return {
            userId: decoded.userId
        }
    })
    .post("/",async ({userId, body}) => {
        try {
            const { apiKey, id} = await ApiKeyService.createApiKey(body.name, Number(userId))
            return {
                apiKey,
                id
            }
        } catch(e) {
            return status(400, {
                message: "failed to create api key"
            })
        }
    }, {
        body: ApiKeyModel.createApiKeySchema,
        response: {
            200: ApiKeyModel.createApiKeyResponseSchema,
            400: ApiKeyModel.createApiKeyFailedResponseSchema
        }
    })
    .get("/",async ({userId})=>{
        try {
             console.log("User ID:", userId);
            const apiKeys = await ApiKeyService.getApiKeys(Number(userId))
            return {
                apiKeys: apiKeys
            }
        } catch(e) {
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
    .put("/",async ({body, userId, status})=>{
        try {
            const disabled = await ApiKeyService.updateApiKeyDisabled(Number(body.id), Number(userId), body.disabled)
        return {
            message: "updated Api key status successfully"
        }
        } catch(e){
            return status(411, {
                message: "updating Api key status unsuccessfull"
            })
        }
    },{
        body: ApiKeyModel.updateApiKeySchema,
        response: {
            200: ApiKeyModel.updateApiKeyResponseSchema,
            411: ApiKeyModel.updateApiKeyFailedResponseSchema
        }
    })
    .delete("/:id",async ({params: {id}, userId})=>{
        try {
            await ApiKeyService.delete(Number(userId), Number(id))
        return {
            message: "Deleted Api key successfully"
        }
        } catch(e){
            return status(411,{
                message: "Deletion of Api key failed"
            })
        }
    },{
        response: {
            200: ApiKeyModel.deleteApiKeyResponseSchema,
            411: ApiKeyModel.deleteApiKeyFailedResponseSchema
        }
    })