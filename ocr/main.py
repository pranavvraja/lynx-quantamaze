from paddleocr import PaddleOCR, draw_ocr
from pdf2image import convert_from_path
import numpy as np
import re
import os
from PIL import ImageDraw

def pdf_to_images(pdf_path, output_folder):
    # Convert PDF to images, one per page
    images = convert_from_path(pdf_path)

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    return images

def mask_pii_on_image(image, ocr_result):
    # Define PII patterns
    pii_patterns = [
        re.compile(r'\b(Name:?\s*)\w+\b', re.I),          # Name pattern
        re.compile(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'), # Date pattern (e.g., 01/02/2022)
        re.compile(r'\b\d{6,}\b'),                        # ID numbers (6 or more digits)
        re.compile(r'\b\d{10}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b') # Phone numbers
    ]

    # Draw object to edit the image
    draw = ImageDraw.Draw(image)

    # Loop through OCR results and mask PII
    for line in ocr_result[0]:
        text = line[1][0].strip()
        for pattern in pii_patterns:
            if pattern.search(text):
                # Get bounding box coordinates for the PII text
                bbox = line[0]
                
                # Calculate the top-left and bottom-right corners of the bounding box
                x_min = min(point[0] for point in bbox)
                y_min = min(point[1] for point in bbox)
                x_max = max(point[0] for point in bbox)
                y_max = max(point[1] for point in bbox)
                
                # Draw a filled rectangle over the PII region
                draw.rectangle([(x_min, y_min), (x_max, y_max)], fill="black")

    return image

def process_pdf(pdf_path, output_folder, text_output_path):
    # Initialize PaddleOCR
    ocr = PaddleOCR()

    # Convert PDF to images
    images = pdf_to_images(pdf_path, output_folder)

    # Create text output file
    with open(text_output_path, "w", encoding="utf-8") as text_file:
        for i, image in enumerate(images):
            # Convert image to NumPy array for OCR
            image_np = np.array(image)
            # Run OCR to get text and bounding boxes
            ocr_result = ocr.ocr(image_np, cls=True)

            # Mask PII directly on the image
            masked_image = mask_pii_on_image(image, ocr_result)

            # Save the masked image
            masked_image_path = os.path.join(output_folder, f"masked_page_{i + 1}.png")
            masked_image.save(masked_image_path, "PNG")

            # Extract and save text to file (optional)
            page_text = [line[1][0] for line in ocr_result[0]]
            text_file.write(f"Page {i + 1}:\n" + "\n".join(page_text) + "\n\n")

# Main code
pdf_path = 'pdf1.pdf'
output_folder = 'masked_images'
text_output_path = 'extracted_text.txt'

# Process the PDF, mask PII on images, and save text output
process_pdf(pdf_path, output_folder, text_output_path)

print("PII masking on images complete. Masked images saved to folder:", output_folder)
print("Text output saved to:", text_output_path)
