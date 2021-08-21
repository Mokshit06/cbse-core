-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "chapterId" TEXT;

-- AddForeignKey
ALTER TABLE "Meeting" ADD FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
