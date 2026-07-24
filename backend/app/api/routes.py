import uuid
import asyncio
import json
import logging
from typing import Dict, Any
from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.agents.state import AgentState
from app.agents.graph import campaign_graph

router = APIRouter()
logger = logging.getLogger("api_routes")

# In-memory store for campaign tasks
tasks_db: Dict[str, Dict[str, Any]] = {}

class GenerateRequest(BaseModel):
    user_prompt: str = Field(..., description="Campaign text prompt or brand brief")
    style: str = Field(default="Cinematic", description="Aesthetic visual style")
    num_scenes: int = Field(default=4, ge=1, le=10, description="Number of scenes to generate")

def run_campaign_workflow(task_id: str, request: GenerateRequest):
    """
    Executes the multi-agent LangGraph workflow for a given task_id.
    """
    initial_state: AgentState = {
        "user_prompt": request.user_prompt,
        "style": request.style,
        "num_scenes": request.num_scenes,
        "concept": {},
        "scenes": [],
        "image_prompts": [],
        "generated_images": [],
        "logs": [f"🚀 [System]: Task {task_id} initialized. Starting LangGraph workflow..."],
        "current_step": "started",
        "error": None
    }

    tasks_db[task_id] = {
        "status": "processing",
        "state": initial_state
    }

    try:
        # Run graph execution
        final_state = campaign_graph.invoke(initial_state)
        tasks_db[task_id] = {
            "status": "completed",
            "state": final_state
        }
    except Exception as e:
        logger.error(f"Error executing campaign workflow: {e}")
        initial_state["logs"].append(f"❌ [Error]: {str(e)}")
        initial_state["current_step"] = "failed"
        initial_state["error"] = str(e)
        tasks_db[task_id] = {
            "status": "failed",
            "state": initial_state
        }

@router.post("/generate")
def generate_campaign(request: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Triggers campaign generation workflow. Returns task_id for streaming / polling.
    """
    task_id = str(uuid.uuid4())
    background_tasks.add_task(run_campaign_workflow, task_id, request)
    
    return {
        "task_id": task_id,
        "status": "queued",
        "message": "Campaign workflow initiated successfully."
    }

@router.get("/tasks/{task_id}")
def get_task_status(task_id: str):
    """
    Fetches status & current state for a campaign task.
    """
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return tasks_db[task_id]

@router.get("/stream/{task_id}")
async def stream_task_progress(task_id: str):
    """
    Server-Sent Events (SSE) endpoint to stream live step logs and state updates.
    """
    async def event_generator():
        last_log_count = 0
        while True:
            if task_id in tasks_db:
                task_data = tasks_db[task_id]
                state = task_data.get("state", {})
                logs = state.get("logs", [])
                
                # If new logs exist
                if len(logs) > last_log_count:
                    new_logs = logs[last_log_count:]
                    last_log_count = len(logs)
                    
                    payload = {
                        "status": task_data.get("status"),
                        "current_step": state.get("current_step"),
                        "new_logs": new_logs,
                        "concept": state.get("concept", {}),
                        "scenes": state.get("scenes", []),
                        "image_prompts": state.get("image_prompts", []),
                        "generated_images": state.get("generated_images", [])
                    }
                    yield f"data: {json.dumps(payload)}\n\n"

                if task_data.get("status") in ["completed", "failed"]:
                    break

            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Creative Studio API"}
