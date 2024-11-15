import requests
import fitz  # PyMuPDF, for converting PDF pages to images
from paddleocr import PaddleOCR
from groq import Groq
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict

load_dotenv()

app = FastAPI()

ocr = PaddleOCR(use_angle_cls=True, lang='en') 

class PDFRequest(BaseModel):
    pdf_url: str 
    data: Optional[Dict] = {}  

def download_pdf(pdf_url, output_path="temp.pdf"):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        print(response.status_code)
        raise HTTPException(status_code=400, detail="Failed to download PDF")
    with open(output_path, "wb") as pdf_file:
        pdf_file.write(response.content)
    return output_path

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

@app.post("/process-pdf")
async def process_pdf(pdf_request: PDFRequest):
    pdf_url = pdf_request.pdf_url
    data = pdf_request.data
    
    try:
 
        pdf_path = download_pdf(pdf_url)
        image_paths = pdf_to_images(pdf_path)
        extracted_text = extract_text_from_images(image_paths)
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key is missing")
        
        client = Groq(api_key=api_key)

        messages = [
            # {"role": "system", "content": "From the given medical report and the previous data of the patient, update them into the new report data in json file format if the previous data exists, otherwise return only the contents of the report in key-pair value in  json file format, nothing else. Do not format the json either, no \n and so on "},
            {
                "role": "system", "content": "Return the updated medical report data strictly in raw JSON format. Include only key-value pairs for each metric, updating values if previous data exists. If no previous data exists, return only the contents of the report in raw JSON format. Add a field of report_date for each metric. Strictly do not add any explanations, labels, code snippets, formatting instructions, or extra text—return JSON data only and nothing else."
            },
            {
                "role": "user", "content": f"Data: {data}\nExtracted Text: {extracted_text}"
            }
        ]

        completion = client.chat.completions.create(
            model="llama-3.2-90b-text-preview",
            messages=messages,
            temperature=0,
            max_tokens=1024,
            top_p=0,
            stream=False,
            stop=None,
        )

        data['extracted_text'] = extracted_text
        data['groq_response'] = completion
        # response_content

        # print(data['groq_response'].choices[0])

        # print(completion.choices[0].message)

        # return {"updated_data": data['groq_response'].choices[0]}
        return completion.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

