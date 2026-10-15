from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

@app.post("/chat")
async def chat(message: str):
    """Send message to Groq, get response"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": message}],
            model="openai/gpt-oss-20b",
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
