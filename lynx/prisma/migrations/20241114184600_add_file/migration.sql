/*
  Warnings:

  - You are about to drop the column `bookedByUserId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientAge` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientGender` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Appointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_bookedByUserId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "bookedByUserId",
DROP COLUMN "patientAge",
DROP COLUMN "patientGender",
DROP COLUMN "patientName",
DROP COLUMN "phone",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
