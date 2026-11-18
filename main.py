import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)

# Create app
app = FastAPI()

# models = genai.list_models()
# for m in models:
#     print(m.name)


# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8090"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use supported model
chat_model = genai.GenerativeModel("gemini-1.5-pro")
chat_session = chat_model.start_chat()

# === Schemas ===
class QuizRequest(BaseModel):
    topic: str
    level: str

class ConversationRequest(BaseModel):
    message: str

# === Endpoints ===

@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    try:
        prompt = f"""
        Generate a {request.level} level quiz question on the topic '{request.topic}'.
        The question should be suitable for a Computer Engineering undergraduate student.
        Provide 4 multiple choice options and mention the correct answer.
        """
        response = chat_model.generate_content(prompt)
        return {"question": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/conversation")
async def conversation_chat(req: ConversationRequest):
    try:
        response = chat_session.send_message(req.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))