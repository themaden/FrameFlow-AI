import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.routes import router as api_router

load_dotenv()

app = FastAPI(
    title="AI Creative Studio API",
    description="End-to-End Multi-Agent Visual Campaign & Storyboard Orchestrator",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "AI Creative Studio Backend API is running.",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"🚀 Starting AI Creative Studio server on http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
