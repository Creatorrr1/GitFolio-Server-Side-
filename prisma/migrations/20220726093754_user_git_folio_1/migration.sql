/*
  Warnings:

  - You are about to drop the column `userName` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userName";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userName" TEXT NOT NULL;
