-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "portfolio_items" ADD COLUMN     "duration" INTEGER DEFAULT 5000,
ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "videoUrl" TEXT;
