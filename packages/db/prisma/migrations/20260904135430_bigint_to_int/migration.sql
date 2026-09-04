/*
  Warnings:

  - You are about to alter the column `creditsConsumed` on the `ApiKey` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `inputTokenCount` on the `Conversation` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `outputTokenCount` on the `Conversation` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `inputTokenCost` on the `ModelProviderMapping` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `OutputTokenCost` on the `ModelProviderMapping` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `credits` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "creditsConsumed" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "inputTokenCount" SET DATA TYPE INTEGER,
ALTER COLUMN "outputTokenCount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ModelProviderMapping" ALTER COLUMN "inputTokenCost" SET DATA TYPE INTEGER,
ALTER COLUMN "OutputTokenCost" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DATA TYPE INTEGER;
