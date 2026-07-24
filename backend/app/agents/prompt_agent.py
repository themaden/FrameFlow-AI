from app.agents.state import AgentState, ImagePrompt
from app.services.llm_service import llm_service
from typing import List

def prompt_agent(state: AgentState) -> AgentState:
    """
    3. Prompt Agent: Translates scene visual descriptions into optimized AI Image Prompts (Flux / Midjourney / DALL-E 3).
    """
    scenes = state.get("scenes", [])
    concept = state.get("concept", {})
    style = state.get("style", "Cinematic")
    
    logs = list(state.get("logs", []))
    logs.append(f"🎨 [Prompt Agent]: Crafting optimized visual AI prompts for {len(scenes)} scenes...")

    image_prompts: List[ImagePrompt] = []

    for scene in scenes:
        scene_num = scene.get("scene_number", 1)
        v_desc = scene.get("visual_description", "")
        camera = scene.get("camera_angle", "Cinematic shot")
        key_elem = ", ".join(scene.get("key_elements", []))

        # Build precision AI art prompt
        prompt_text = (
            f"{v_desc}, {camera}, key subjects: {key_elem}, "
            f"style: {style}, ultra-detailed 8k resolution, octane render quality, volumetric lighting, photorealistic color grading"
        )

        negative_prompt = "blurry, low quality, distorted anatomy, pixelated, watermark, signatures, cropped frame"
        
        image_prompts.append({
            "scene_number": scene_num,
            "prompt": prompt_text,
            "negative_prompt": negative_prompt,
            "aspect_ratio": "16:9",
            "lighting": "Cinematic volumetric backlight with vibrant ambient reflections",
            "aesthetic_tags": [style, "8K", "Octane Render", "Unreal Engine 5", "Photorealistic"]
        })

    logs.append(f"✅ [Prompt Agent]: Created {len(image_prompts)} optimized visual AI prompts.")

    return {
        **state,
        "image_prompts": image_prompts,
        "logs": logs,
        "current_step": "prompt_optimization"
    }
