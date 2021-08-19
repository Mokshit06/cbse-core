/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socialId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User.socialId_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
DROP COLUMN "socialId";

-- DropEnum
DROP TYPE "SocialProvider";
