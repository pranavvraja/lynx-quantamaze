/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

const MaskPDF = ({}) => {
  const [maskedPDF, setMaskedPDF] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Load the uploaded PDF
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);

      // Iterate through all pages
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { height } = page.getSize();

        // Example: Adding masking rectangles manually
        // You can extract text and calculate coordinates for masking dynamically
        const masks = [
          { x: 100, y: height - 150, width: 200, height: 20 }, // Example mask 1
          { x: 300, y: height - 200, width: 150, height: 20 }, // Example mask 2
        ];

        masks.forEach((mask) => {
          page.drawRectangle({
            x: mask.x,
            y: mask.y,
            width: mask.width,
            height: mask.height,
            color: rgb(0, 0, 0), // Black rectangle to mask
          });
        });
      }

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setMaskedPDF(pdfUrl);
    } catch (error) {
      console.error("Error while processing PDF:", error);
    }
  };

  return (
    <div>
      <h1>Mask Text in PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {maskedPDF && (
        <a href={maskedPDF} download="masked.pdf">
          Download Masked PDF
        </a>
      )}
    </div>
  );
};

export default MaskPDF;
