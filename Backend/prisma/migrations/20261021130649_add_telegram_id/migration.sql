/*
  Warnings:

  - A unique constraint covering the columns `[telegramId]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "telegramId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "members_telegramId_key" ON "members"("telegramId");

-- CreateIndex
CREATE INDEX "members_telegramId_idx" ON "members"("telegramId");
