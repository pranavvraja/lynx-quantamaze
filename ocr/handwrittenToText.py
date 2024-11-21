import google.generativeai as genai
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from io import BytesIO
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

app = FastAPI()

GOOGLE_API_KEY = "API_KEY"

if not GOOGLE_API_KEY:
    logger.error("API Key is missing. Please set the GOOGLE_API_KEY environment variable.")
    raise ValueError("API Key is missing. Please set the GOOGLE_API_KEY environment variable.")

try:
    genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    logger.error(f"Error configuring the generative model: {e}")
    raise HTTPException(status_code=500, detail="Error configuring the generative model")

MODEL_CONFIG = {
    "temperature": 0.2,
    "top_p": 1,
    "top_k": 32,
    "max_output_tokens": 4096,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=MODEL_CONFIG,
    safety_settings=safety_settings
)

class ImageRequest(BaseModel):
    image_url: str

def image_from_url(image_url):
    """Downloads image from URL and converts it to the format required by the model."""
    try:
        response = requests.get(image_url)
        response.raise_for_status()  
        img_data = BytesIO(response.content) 
        image_parts = [
            {
                "mime_type": "image/png",  
                "data": img_data.read()
            }
        ]
        return image_parts
    except requests.exceptions.RequestException as e:
        logger.error(f"Error downloading image from URL: {e}")
        raise HTTPException(status_code=400, detail=f"Error downloading image from URL: {str(e)}")

def gemini_output(image_input, system_prompt):
    """Generates output from the model by providing image and prompts."""
    try:
        input_prompt = [system_prompt] + image_input
        response = model.generate_content(input_prompt)
        return response.text
    except Exception as e:
        logger.error(f"Error generating output from model: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating output: {str(e)}")

@app.post("/upload")
async def upload_image(request: ImageRequest):
    """Handles the image URL and generates output."""
    try:
        system_prompt = """
                       You are a specialist in comprehending receipts.
                       Input images in the form of receipts will be provided to you,
                       and your task is to summarize it and give the list of medication.
                       """
        image_input = image_from_url(request.image_url)
        output = gemini_output(image_input, system_prompt)
        return {"response": output}
    except Exception as e:
        logger.error(f"Error in /upload route: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
