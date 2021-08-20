/*
  Warnings:

  - Added the required column `address` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
