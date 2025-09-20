/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ServiceCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ServiceCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "activeFrom" TIMESTAMP(3),
ADD COLUMN     "activeTo" TIMESTAMP(3),
ADD COLUMN     "allowUnpaidForB2B" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "appointmentRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "areaCoverage" JSONB,
ADD COLUMN     "cityConstraint" TEXT,
ADD COLUMN     "defaultDurationMins" INTEGER,
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "isOnsite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRemote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWeb" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "payFirst" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quoteRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresLogin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ServicePrice" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "compareAt" DECIMAL(12,2),
ADD COLUMN     "features" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");
