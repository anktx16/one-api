import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";

export class NvidiaNim extends BaseLlm {
    static async chat(
        model: string,
        messages: Messages
    ): Promise<LlmResponse> {

        const response = await fetch(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,

                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: model,

                    messages: messages.map((message) => ({
                        role: message.role,
                        content: message.content
                    }))
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();

            throw new Error(
                `NVIDIA NIM API Error: ${response.status} - ${error}`
            );
        }

        const data = await response.json();

        return {
            inputTokenConsumed:
                data.usage?.prompt_tokens ?? 0,

            outputTokenConsumed:
                data.usage?.completion_tokens ?? 0,

            completions: {
                choices: [
                    {
                        message: {
                            content:
                                data.choices?.[0]?.message?.content ?? ""
                        }
                    }
                ]
            }
        };
    }
}