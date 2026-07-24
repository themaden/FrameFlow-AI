from app.agents.state import AgentState, Scene
from app.services.llm_service import llm_service
from typing import List

def storyboard_agent(state: AgentState) -> AgentState:
    """
    2. Storyboard Agent: Takes concept and splits into cinematic scenes.
    """
    concept = state.get("concept", {})
    num_scenes = state.get("num_scenes", 4)
    user_prompt = state.get("user_prompt", "")
    
    logs = list(state.get("logs", []))
    logs.append(f"📝 [Storyboard Agent]: Breaking down campaign concept into {num_scenes} sequential scenes...")

    system_prompt = (
        "You are an expert film director and storyboard creator. "
        "Split the campaign concept into visual storyboard scenes. "
        "Return a JSON object with a key 'scenes' containing a list of scene objects."
    )

    user_msg = f"Campaign Title: {concept.get('title')}\nConcept Mood: {concept.get('mood')}\nNumber of Scenes: {num_scenes}"

    # Rich procedural fallback generator for scenes
    title = concept.get("title", "Campaign")
    prompt_lower = user_prompt.lower()

    if "cyberpunk" in prompt_lower or "siberpunk" in prompt_lower or "coffee" in prompt_lower:
        fallback_scenes: List[Scene] = [
            {
                "scene_number": 1,
                "title": "The Rainy Neon Alley",
                "duration": "0:05",
                "narrative": "A solitary cyber-punk barista stands outside a steam-shrouded alleyway under glowing holographic signs in a futuristic Neo-Tokyo skyline.",
                "visual_description": "Establishing shot of a glowing neon alleyway at night with rain slicked pavement reflecting holographic billboards.",
                "camera_angle": "Wide angle, low-level dolly tracking shot",
                "key_elements": ["Neon signs", "Cyberpunk barista", "Steam vents", "Rainy reflections"]
            },
            {
                "scene_number": 2,
                "title": "Quantum Roasting Process",
                "duration": "0:08",
                "narrative": "Inside the high-tech lab, raw coffee beans float suspended in a blue plasma containment field during the quantum roasting cycle.",
                "visual_description": "Extreme macro close-up of dark roasted coffee beans hovering inside a glowing cyan energy grid with micro sparks.",
                "camera_angle": "Macro lens 85mm, shallow depth of field",
                "key_elements": ["Levitating beans", "Blue plasma light", "Holographic telemetry display"]
            },
            {
                "scene_number": 3,
                "title": "The First Syphon Extraction",
                "duration": "0:07",
                "narrative": "Rich dark liquid pours into an illuminated glass visor mug, emitting a glowing violet aroma cloud.",
                "visual_description": "Medium shot of glowing dark coffee pouring from an intricate glass syphon vessel into a sleek matte black futuristic thermal mug.",
                "camera_angle": "Over the shoulder, medium close-up",
                "key_elements": ["Glass syphon", "Violet steam", "Matte black mug"]
            },
            {
                "scene_number": 4,
                "title": "Cybernetic Awakening",
                "duration": "0:10",
                "narrative": "A protagonist takes a sip, their cybernetic eye overlay glowing as pure energy ripples through the city around them.",
                "visual_description": "Hero shot of a stylish cybernetic protagonist with glowing eye implants standing on a high-rise rooftop overlooking Neo-Tokyo at night.",
                "camera_angle": "Hero low angle shot looking up, dynamic camera roll",
                "key_elements": ["Cybernetic eyes", "Futuristic city view", "High-octane energetic aura"]
            }
        ]
    elif "watch" in prompt_lower or "luxury" in prompt_lower:
        fallback_scenes: List[Scene] = [
            {
                "scene_number": 1,
                "title": "Cosmic Titanium Genesis",
                "duration": "0:05",
                "narrative": "A single block of aerospace grade titanium is sculpted by precision laser light beams.",
                "visual_description": "Macro shot of titanium metal casing reflecting golden rays against dark velvet backdrop.",
                "camera_angle": "Slow cinematic orbit",
                "key_elements": ["Titanium casing", "Laser beams", "Gold lighting"]
            },
            {
                "scene_number": 2,
                "title": "The Mechanical Heart",
                "duration": "0:07",
                "narrative": "Hundreds of micro gears mesh seamlessly inside the sapphire crystal skeleton movement.",
                "visual_description": "Super close-up of ruby bearings and skeletonized mechanical gears in slow motion.",
                "camera_angle": "Extreme macro 100mm",
                "key_elements": ["Ruby jewels", "Skeleton movement", "Sapphire crystal"]
            },
            {
                "scene_number": 3,
                "title": "Horizon Silhouette",
                "duration": "0:08",
                "narrative": "An executive silhouette adjusts the watch on their wrist while looking over a sunlit architectural skyline.",
                "visual_description": "Medium shot of wrist detail with luxury watch glinting in golden hour sunlight.",
                "camera_angle": "Side profile low angle",
                "key_elements": ["Sun flare", "Tailored suit", "Golden hour glow"]
            },
            {
                "scene_number": 4,
                "title": "Timeless Perfection",
                "duration": "0:10",
                "narrative": "The timepiece displayed floating gracefully above black obsidian water.",
                "visual_description": "Symmetrical centerpiece shot of watch hovering over still dark water with subtle ripple reflections.",
                "camera_angle": "Frontal eye-level hero shot",
                "key_elements": ["Obsidian water", "Symmetrical floating watch", "Pure luxury reflections"]
            }
        ]
    else:
        # Generic multi-scene generator
        fallback_scenes: List[Scene] = []
        for i in range(1, num_scenes + 1):
            fallback_scenes.append({
                "scene_number": i,
                "title": f"Scene {i}: {title} Core Moment",
                "duration": "0:06",
                "narrative": f"Exploring key aspect {i} of {user_prompt} with dynamic visual emphasis.",
                "visual_description": f"Cinematic visual composition for scene {i} highlighting {user_prompt} elements.",
                "camera_angle": "Cinematic 35mm perspective shot",
                "key_elements": [user_prompt, f"Element {i}", "Atmospheric lighting"]
            })

    result = llm_service.generate_json(system_prompt, user_msg, {"scenes": fallback_scenes})
    scenes = result.get("scenes", fallback_scenes)

    logs.append(f"✅ [Storyboard Agent]: Generated {len(scenes)} visual scenes for the campaign.")

    return {
        **state,
        "scenes": scenes,
        "logs": logs,
        "current_step": "storyboard_creation"
    }
