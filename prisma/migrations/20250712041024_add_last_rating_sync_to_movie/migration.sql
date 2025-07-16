-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "lastRatingSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "movie_lastRatingSync_idx" ON "movie"("lastRatingSync");
