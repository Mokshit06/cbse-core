/*
  Warnings:

  - Added the required column `ended` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "ended" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
