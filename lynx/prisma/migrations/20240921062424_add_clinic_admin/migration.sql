-- CreateTable
CREATE TABLE "_ClinicAdmin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicAdmin_AB_unique" ON "_ClinicAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicAdmin_B_index" ON "_ClinicAdmin"("B");

-- AddForeignKey
ALTER TABLE "_ClinicAdmin" ADD CONSTRAINT "_ClinicAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicAdmin" ADD CONSTRAINT "_ClinicAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
