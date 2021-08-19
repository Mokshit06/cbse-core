/*
  Warnings:

  - Added the required column `meetingId` to the `MeetingParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingParticipant" ADD COLUMN     "meetingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
