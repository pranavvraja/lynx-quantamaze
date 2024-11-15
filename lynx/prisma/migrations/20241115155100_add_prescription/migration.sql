-- CreateTable
CREATE TABLE "prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "prescriptionUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);
