import GroqClient from "groq-sdk";
import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";

const groq = new GroqClient({
    apiKey: process.env.GROQ_API_KEY
});

export class Groq extends BaseLlm {
    static async chat(
        model: string,
        messages: Messages
    ): Promise<LlmResponse> {

        const response = await groq.chat.completions.create({
            model: model,

            messages: messages.map((message) => ({
                role: message.role,
                content: message.content
            })),

            max_tokens: 1000
        });

        return {
            inputTokenConsumed:
                response.usage?.prompt_tokens ?? 0,

            outputTokenConsumed:
                response.usage?.completion_tokens ?? 0,

            completions: {
                choices: [
                    {
                        message: {
                            content:
                                response.choices[0]?.message?.content ?? ""
                        }
                    }
                ]
            }
        };
    }
}