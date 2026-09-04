/*
  Warnings:

  - Made the column `providerModelId` on table `ModelProviderMapping` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ModelProviderMapping" ALTER COLUMN "providerModelId" SET NOT NULL;
