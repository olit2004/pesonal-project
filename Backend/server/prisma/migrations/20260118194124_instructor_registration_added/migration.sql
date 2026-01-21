/*
  Warnings:

  - You are about to drop the column `applicationStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "amountPaid" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "applicationStatus";

-- DropEnum
DROP TYPE "ApplicationStatus";
