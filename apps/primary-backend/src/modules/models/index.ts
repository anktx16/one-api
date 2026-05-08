import Elysia from "elysia";
import { ModelsService } from "./service";
import { ModelsModel } from "./model";

export const app = new Elysia({ prefix: "models" })
    .get("/", async () => {
        const models = await ModelsService.getModels()
        return {
            models
        }
    }, {
        response: {
            200: ModelsModel.getModelResponseSchema
        }
    })
    .get("/providers", async () => {
        const providers = await ModelsService.getProviders()

        return {
            providers
        }
    }, {
        response: {
            200: ModelsModel.getProvidersResponseSchema
        }
    })
    .get("/:id/providers", async ({ params: { id } }) => {
        const modelProviders = await ModelsService.getModelProviders(Number(id))

        return {
            modelProviders
        }
    }, {
        response: {
            200: ModelsModel.getModelProvidersResponseSchema
        }
    })