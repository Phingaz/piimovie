/*
  Warnings:

  - You are about to drop the column `sendAlways` on the `webhook_config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."webhook_config" DROP COLUMN "sendAlways";
