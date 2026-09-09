import bearer from "@elysiajs/bearer";
import { prisma } from "db"
import { Elysia, t } from "elysia";
import { Conversation, Messages } from "./types";
import { Gemini } from "./llms/Gemini";
import { Groq } from "./llms/Groq";
import { NvidiaNim } from "./llms/NvidiaNim";
import { LlmResponse } from "./llms/Base";
import { checkRateLimit } from "./rateLimit";

async function getLlmResponse(
  providerModelId: string,
  providerName: string,
  messages: Messages
): Promise<LlmResponse> {

  switch (providerName) {

    case "Google API":
      return await Gemini.chat(
        providerModelId,
        messages
      );

    case "NVIDIA NIM":
      return await NvidiaNim.chat(
        providerModelId,
        messages
      );

    case "Groq":
      return await Groq.chat(
        providerModelId,
        messages
      );

    default:
      throw new Error(
        `Unsupported provider: ${providerName}`
      );
  }
}

const app = new Elysia()
  .use(bearer())
  .post("/api/v1/chat/completions", async ({ status, bearer: apiKey, body, set }) => {
    const model = body.model;

    const apiKeyDb = await prisma.apiKey.findFirst({
      where: {
        apiKey,
        disabled: false,
        deleted: false
      },
      include: {
        user: true
      }
    })

    if (!apiKeyDb) {
      return status(403, {
        message: "invalid api key"
      })
    }

    const rateLimit = await checkRateLimit(apiKey || "");

    set.headers["X-RateLimit-Limit"] = String(rateLimit.limit);
    set.headers["X-RateLimit-Remaining"] = String(rateLimit.remaining);
    set.headers["X-RateLimit-Reset"] = String(rateLimit.reset);

    if (!rateLimit.allowed) {
      set.headers["Retry-After"] = String(rateLimit.reset);

      return status(429, {
        message: "Too many requests. Please try again later."
      });
    }

    const modelDb = await prisma.model.findFirst({
      where: {
        slug: model
      }
    })

    if (!modelDb) {
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

    // 5. Check if any provider exists
    if (providers.length === 0) {
      return status(503, {
        message: "No provider available for this model"
      });
    }

    const selectedProvider = providers[Math.floor(Math.random() * providers.length)]

    if (apiKeyDb.user.credits <= 0) {
      return status(403, {
        message: "you don't have enough credits"
      })
    }

    let response: LlmResponse;

    try {

      response = await getLlmResponse(
        selectedProvider.providerModelId, selectedProvider.provider.name, body.messages
      );

    } catch (error) {

      console.error(
        "LLM provider error:",
        error
      );

      return status(500, {
        message:
          "Failed to get response from provider"
      });
    }

    const cost = response.inputTokenConsumed * selectedProvider.inputTokenCost + response.outputTokenConsumed * selectedProvider.outputTokenCost;

    if (apiKeyDb.user.credits < cost) {
      return status(403, {
        message: "you don't have enough credits"
      });
    }

    try {

      await prisma.$transaction([

        // Deduct user credits
        prisma.user.update({
          where: {
            id: apiKeyDb.user.id
          },
          data: {
            credits: {
              decrement: cost
            }
          }
        }),

        // Update API key
        prisma.apiKey.update({
          where: {
            id: apiKeyDb.id
          },
          data: {
            creditsConsumed: {
              increment: cost
            },
            lastUsed: new Date()
          }
        }),

        // Save conversation
        prisma.conversation.create({
          data: {
            userId: apiKeyDb.userId,
            apiKeyId: apiKeyDb.id,
            modelProviderMappingId: selectedProvider.id,

            input: JSON.stringify(body.messages),

            output: response.completions
              .choices[0]
              .message.content,

            inputTokenCount: response.inputTokenConsumed,

            outputTokenCount: response.outputTokenConsumed
          }
        })
      ]);

    } catch (error) {
      console.error("Database transaction error:", error);

      return status(500, {
        message: "Failed to save conversation and update credits"
      });
    }

    return response;

  }, {
    body: Conversation
  })
  .listen(Number(process.env.PORT) || 4000);
