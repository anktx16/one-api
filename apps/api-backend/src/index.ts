import bearer from "@elysiajs/bearer";
import { prisma } from "db"
import { Elysia, t } from "elysia";
import { Conversation } from "./types";
import { Gemini } from "./llms/Gemini";

const app = new Elysia()
  .use(bearer())
  .post("/api/v1/chat/completions", async ({status, bearer: apiKey, body}) => {
    const model = body.model;
    const providerModelName = model.split("/")[1]
    const apiKeyDb = await prisma.apiKey.findFirst({
      where: {
        apiKey,
        disabled: false,
        deleted: false
      },
      select: {
        user: true
      }
    })

    if(!apiKeyDb){
      return status(403, {
        message: "invalid api key"
      })
    }

    const modelDb = await prisma.model.findFirst({
      where: {
        slug: model
      }
    })

    if(!modelDb){
      return status(403, {
        message: "model not found"
      })
    }

    const providers = await prisma.modelProviderMapping.findMany({
      where: {
        modelId: modelDb.id
      },
      include: {
        provider: true
      }
    })

    const provider = providers[Math.floor(Math.random() * providers.length)]

    if(apiKeyDb.user.credits <= 0){
      return status(403, {
        message: "you don't have enough credits"
      })
    }

    if(provider.provider.name === "Google API"){
      const response = await Gemini.chat(providerModelName, body.messages)
      return response
    }

    
  }, {
    body: Conversation
  })
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
