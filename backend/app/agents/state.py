from typing import TypedDict, List, Dict, Any, Optional

class CampaignConcept(TypedDict, total=False):
    title: str
    tagline: str
    mood: str
    target_audience: str
    core_theme: str
    brand_voice: str
    color_palette: List[str]

class Scene(TypedDict, total=False):
    scene_number: int
    title: str
    duration: str
    narrative: str
    visual_description: str
    camera_angle: str
    key_elements: List[str]

class ImagePrompt(TypedDict, total=False):
    scene_number: int
    prompt: str
    negative_prompt: str
    aspect_ratio: str
    lighting: str
    aesthetic_tags: List[str]

class GeneratedImage(TypedDict, total=False):
    scene_number: int
    image_url: str
    prompt_used: str
    status: str

class AgentState(TypedDict, total=False):
    user_prompt: str
    style: str
    num_scenes: int
    concept: CampaignConcept
    scenes: List[Scene]
    image_prompts: List[ImagePrompt]
    generated_images: List[GeneratedImage]
    logs: List[str]
    current_step: str
    error: Optional[str]
