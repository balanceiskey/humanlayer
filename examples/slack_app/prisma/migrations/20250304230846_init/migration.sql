-- CreateTable
CREATE TABLE "SlackToken" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "channelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlackToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlackToken_teamId_key" ON "SlackToken"("teamId");
