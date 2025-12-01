/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `travelInterests` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `visitedCountries` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TravelPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_travelPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "TravelPlan" DROP CONSTRAINT "TravelPlan_userId_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "currentLocation",
DROP COLUMN "fullName",
DROP COLUMN "isVerified",
DROP COLUMN "profileImage",
DROP COLUMN "subscriptionExpiry",
DROP COLUMN "subscriptionStatus",
DROP COLUMN "travelInterests",
DROP COLUMN "visitedCountries",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "TravelPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "TravelType";

-- DropEnum
DROP TYPE "UserRole";
