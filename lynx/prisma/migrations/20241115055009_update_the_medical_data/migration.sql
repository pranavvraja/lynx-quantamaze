/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `medicalData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicalData_userId_key" ON "medicalData"("userId");
