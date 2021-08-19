-- CreateTable
CREATE TABLE "session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");
