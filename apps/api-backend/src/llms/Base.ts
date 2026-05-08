import { Messages } from "../types";

export type LlmResponse = {
    completions: {
        choices: {
            message: {
            content: string
          }
        }[]
    },
    inputTokenConsumed: number,
    outputTokenConsumed: number
}
export class BaseLlm {
    static chat(model: string, messages: Messages): Promise<LlmResponse> {
        throw new Error("chat function not implemented")
    }
}