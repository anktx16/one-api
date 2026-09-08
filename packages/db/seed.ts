import "dotenv/config";
import { prisma } from "./index";

async function main() {
  console.log("Seeding database...");

  // Companies
  const companies = [
    { id: 1, name: "moonshotai", website: "https://www.moonshot.ai" },
    { id: 2, name: "DeepSeek AI", website: "https://www.deepseek.com" },
    { id: 3, name: "Alibaba Cloud", website: "https://www.alibabacloud.com" },
    { id: 4, name: "OpenAI", website: "https://openai.com" },
    { id: 5, name: "Groq", website: "https://groq.com" },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: company,
      create: company,
    });
  }

  // Providers
  const providers = [
    { id: 1, name: "NVIDIA NIM", website: "https://build.nvidia.com" },
    { id: 2, name: "Groq", website: "https://groq.com" },
  ];

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { id: provider.id },
      update: provider,
      create: provider,
    });
  }

  // Models
  const models = [
    { id: 1, name: "kimi K3", companyId: 1, slug: "moonshotai/kimi-k3" },
    { id: 2, name: "DeepSeek-V4-Pro-0813", companyId: 2, slug: "deepseek-ai/deepseek-v4-pro-0813" },
    { id: 3, name: "DeepSeek-V4-Flash-0731", companyId: 2, slug: "deepseek-ai/deepseek-v4-flash-0731" },
    { id: 4, name: "Qwen3.6-27B", companyId: 3, slug: "qwen/qwen3.6-27b" },
    { id: 5, name: "Qwen3.8-27B", companyId: 3, slug: "qwen/qwen3.8-27b" },
    { id: 6, name: "GPT-OSS-120B", companyId: 4, slug: "openai/gpt-oss-120b" },
    { id: 7, name: "GPT-OSS-20B", companyId: 4, slug: "openai/gpt-oss-20b" },
    { id: 8, name: "Groq Compound Mini", companyId: 5, slug: "groq/compound-mini" },
  ];

  for (const model of models) {
    await prisma.model.upsert({
      where: { id: model.id },
      update: model,
      create: model,
    });
  }

  // Model Provider Mappings
  const mappings = [
    {
      id: 1,
      modelId: 1,
      providerId: 1,
      providerModelId: "moonshotai/kimi-k3",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 2,
      modelId: 2,
      providerId: 1,
      providerModelId: "deepseek-ai/deepseek-v4-pro-0813",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 3,
      modelId: 3,
      providerId: 1,
      providerModelId: "deepseek-ai/deepseek-v4-flash-0731",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 4,
      modelId: 4,
      providerId: 2,
      providerModelId: "qwen/qwen3.6-27b",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 5,
      modelId: 5,
      providerId: 2,
      providerModelId: "qwen/qwen3.8-27b",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 6,
      modelId: 6,
      providerId: 2,
      providerModelId: "openai/gpt-oss-120b",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 7,
      modelId: 7,
      providerId: 2,
      providerModelId: "openai/gpt-oss-20b",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    {
      id: 8,
      modelId: 8,
      providerId: 2,
      providerModelId: "groq/compound-mini",
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
  ];

  for (const mapping of mappings) {
    await prisma.modelProviderMapping.upsert({
      where: { id: mapping.id },
      update: {
        modelId: mapping.modelId,
        providerId: mapping.providerId,
        providerModelId: mapping.providerModelId,
        inputTokenCost: mapping.inputTokenCost,
        outputTokenCost: mapping.outputTokenCost,
      },
      create: mapping,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });