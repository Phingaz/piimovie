/*
  Warnings:

  - A unique constraint covering the columns `[accountId,providerId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "movie_id_idx";

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "account_accountId_idx" ON "account"("accountId");

-- CreateIndex
CREATE INDEX "account_providerId_idx" ON "account"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "account_accountId_providerId_key" ON "account"("accountId", "providerId");

-- CreateIndex
CREATE INDEX "filter_userId_idx" ON "filter"("userId");

-- CreateIndex
CREATE INDEX "filter_userId_isFavorite_idx" ON "filter"("userId", "isFavorite");

-- CreateIndex
CREATE INDEX "filter_userId_lastUsed_idx" ON "filter"("userId", "lastUsed");

-- CreateIndex
CREATE INDEX "filter_type_idx" ON "filter"("type");

-- CreateIndex
CREATE INDEX "movie_userId_idx" ON "movie"("userId");

-- CreateIndex
CREATE INDEX "movie_userId_type_idx" ON "movie"("userId", "type");

-- CreateIndex
CREATE INDEX "movie_userId_createdAt_idx" ON "movie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "movie_type_createdAt_idx" ON "movie"("type", "createdAt");

-- CreateIndex
CREATE INDEX "movie_title_idx" ON "movie"("title");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");

-- CreateIndex
CREATE INDEX "session_token_idx" ON "session"("token");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "verification_value_idx" ON "verification"("value");

-- CreateIndex
CREATE INDEX "verification_expiresAt_idx" ON "verification"("expiresAt");
