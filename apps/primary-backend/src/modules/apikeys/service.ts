import { prisma } from "db";

const APIKEY_LENGTH = 20;
const ALPHABET_SET = "qwertyuiopasdfghklzxcvbnm1234567890QEWYRSUYTQWOIKJSAXBM"

export abstract class ApiKeyService {

    static createRandomApiKey(){
        let suffixKey = "";
        for(let i = 0; i < APIKEY_LENGTH; i++){
            suffixKey += ALPHABET_SET[Math.floor(ALPHABET_SET.length * Math.random())]
        }
        return `sk-or-v1-${suffixKey}`
    }

    static async createApiKey(name: string, userId: number):Promise<{
        id: string,
        apiKey: string
    }>{
         const apiKey = ApiKeyService.createRandomApiKey()
         const apiKeyDb = await prisma.apiKey.create({
            data: {
                name,
                userId,
                apiKey,
            }
         })

         return {
            id: apiKeyDb.id.toString(),
            apiKey
         }
    }

    static async getApiKeys(userId: number){
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId: userId,
                deleted: false
            }
        })

        return apiKeys.map(apiKey=>({
            id: apiKey.id.toString(),
            apiKey: apiKey.apiKey,
            name: apiKey.name,
            lastUsed: apiKey.lastUsed,
            creditsConsumed: apiKey.creditsConsumed,
            disabled: apiKey.disabled
        }))
    }

    static async updateApiKeyDisabled(apiKeyid: number, userId: number, disabled: boolean){
        const response = await prisma.apiKey.update({
            where: {
                id: apiKeyid,
                userId
            },
            data: {
                disabled
            }
        })
    }

    static async delete(userId: number, id: number){
        await prisma.apiKey.update({
            where: {
                id,
                userId
            },
            data: {
                deleted: true
            }
        })
    }
}