/*
  Warnings:

  - A unique constraint covering the columns `[inchargeId]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inchargeId` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SCHOOL_INCHARGE';

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "inchargeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "School_inchargeId_unique" ON "School"("inchargeId");

-- AddForeignKey
ALTER TABLE "School" ADD FOREIGN KEY ("inchargeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
