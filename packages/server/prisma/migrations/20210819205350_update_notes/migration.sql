/*
  Warnings:

  - You are about to drop the column `userId` on the `Note` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[participantId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "userId",
ADD COLUMN     "participantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Note_participantId_unique" ON "Note"("participantId");

-- AddForeignKey
ALTER TABLE "Note" ADD FOREIGN KEY ("participantId") REFERENCES "MeetingParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
