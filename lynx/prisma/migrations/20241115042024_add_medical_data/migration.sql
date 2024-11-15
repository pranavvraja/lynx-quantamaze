-- CreateTable
CREATE TABLE "medicalData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "medicalData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medicalData" ADD CONSTRAINT "medicalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
