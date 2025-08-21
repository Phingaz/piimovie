-- CreateTable
CREATE TABLE "public"."webhook_config" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "sendAlways" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "webhook_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webhook_config_userId_idx" ON "public"."webhook_config"("userId");

-- AddForeignKey
ALTER TABLE "public"."webhook_config" ADD CONSTRAINT "webhook_config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
