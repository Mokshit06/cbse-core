/*
  Warnings:

  - Added the required column `grade` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "section" TEXT NOT NULL;
