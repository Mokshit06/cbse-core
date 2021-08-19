/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `School` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Meeting.code_unique" ON "Meeting"("code");

-- CreateIndex
CREATE UNIQUE INDEX "School.code_unique" ON "School"("code");
