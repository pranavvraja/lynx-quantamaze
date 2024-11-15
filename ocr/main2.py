import requests
import fitz  # PyMuPDF, for converting PDF pages to images
from paddleocr import PaddleOCR
from groq import Groq
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict

# Initialize FastAPI
app = FastAPI()

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')  # You can change 'en' to the appropriate language

# Pydantic model for request body
class PDFRequest(BaseModel):
    pdf_url: str  # URL to the PDF document
    data: Optional[Dict] = {}  # Optional field for JSON data, defaults to empty dictionary

# Function to download PDF
def download_pdf(pdf_url, output_path="temp.pdf"):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        print(response.status_code)
        raise HTTPException(status_code=400, detail="Failed to download PDF")
    with open(output_path, "wb") as pdf_file:
        pdf_file.write(response.content)
    return output_path

# Function to convert PDF pages to images
def pdf_to_images(pdf_path):
    pdf_document = fitz.open(pdf_path)
    images = []
    
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        pix = page.get_pixmap()
        image_path = f"page_{page_num}.png"
        pix.save(image_path)
        images.append(image_path)
    
    pdf_document.close()
    return images

# Function to extract text from images using PaddleOCR
def extract_text_from_images(image_paths):
    text = []
    for image_path in image_paths:
        result = ocr.ocr(image_path, cls=True)
        page_text = "\n".join([line[1][0] for line in result[0]])
        text.append(page_text)
    return "\n".join(text)

# FastAPI route to process the PDF and interact with Groq
@app.post("/process-pdf")
async def process_pdf(pdf_request: PDFRequest):
    pdf_url = pdf_request.pdf_url
    data = pdf_request.data
    
    try:
        # Step 1: Download PDF
        pdf_path = download_pdf(pdf_url)
        
        # Step 2: Convert PDF pages to images
        image_paths = pdf_to_images(pdf_path)
        
        # Step 3: Extract text from images
        extracted_text = extract_text_from_images(image_paths)

        # Step 4: Interact with Groq API
        api_key = "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"
        if not api_key:
            raise HTTPException(status_code=500, detail="API key is missing")
        
        client = Groq(api_key=api_key)

        # Define system instructions and user message
        messages = [
            {"role": "system", "content": "From the given medical report and the previous data of the patient, update them into the new report data in json format if the previous data exists, otherwise return only the contents of the report in key-pair value in json format, nothing else. Do not format the json either, no \n and so on "},
            # {"role": "user", "content": extracted_text}
             {"role": "user", "content": f"Data: {data}\nExtracted Text: {extracted_text}"}

        ]

        # Call the Groq API
        completion = client.chat.completions.create(
            model="llama-3.2-90b-text-preview",
            messages=messages,
            temperature=0,
            max_tokens=1024,
            top_p=0,
            stream=False,
            stop=None,
        )

        # Get the Groq API response content
        # response_content = completion['choices'][0]['message']['content']

        # Update the provided data with extracted text or add new key
        data['extracted_text'] = extracted_text
        data['groq_response'] = completion
        # response_content

        # Return the updated data
        return {"updated_data": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

