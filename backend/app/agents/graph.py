from langgraph.graph import StateGraph, END
from app.agents.state import AgentState, GeneratedImage
from app.agents.idea_agent import idea_agent
from app.agents.storyboard_agent import storyboard_agent
from app.agents.prompt_agent import prompt_agent
from app.services.image_service import image_service
import logging

logger = logging.getLogger("workflow_graph")

def image_generation_node(state: AgentState) -> AgentState:
    """
    4. Image Generation Step: Generates artwork for each scene using image_service.
    """
    image_prompts = state.get("image_prompts", [])
    style = state.get("style", "Cinematic")
    
    logs = list(state.get("logs", []))
    logs.append(f"🖼️ [Image Service]: Rendering artwork for {len(image_prompts)} scenes...")

    generated_images = []

    for item in image_prompts:
        scene_num = item.get("scene_number", 1)
        prompt_text = item.get("prompt", "")
        
        logs.append(f"⚡ [Image Service]: Rendering Scene {scene_num} artwork...")
        
        res = image_service.generate_image(
            scene_number=scene_num,
            prompt=prompt_text,
            style=style
        )
        generated_images.append(res)

    logs.append(f"✨ [Image Service]: All {len(generated_images)} visual assets rendered successfully!")

    return {
        **state,
        "generated_images": generated_images,
        "logs": logs,
        "current_step": "completed"
    }

def create_workflow_graph():
    """
    Assembles the complete LangGraph StateGraph pipeline.
    """
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("idea_agent", idea_agent)
    workflow.add_node("storyboard_agent", storyboard_agent)
    workflow.add_node("prompt_agent", prompt_agent)
    workflow.add_node("image_generation", image_generation_node)

    # Set Entry Point & Edges
    workflow.set_entry_point("idea_agent")
    workflow.add_edge("idea_agent", "storyboard_agent")
    workflow.add_edge("storyboard_agent", "prompt_agent")
    workflow.add_edge("prompt_agent", "image_generation")
    workflow.add_edge("image_generation", END)

    return workflow.compile()

# Instantiated workflow graph instance
campaign_graph = create_workflow_graph()
