from app.agents.state import AgentState
from app.services.llm_service import llm_service

def idea_agent(state: AgentState) -> AgentState:
    """
    1. Idea Agent: Takes user prompt and style to generate brand creative direction & concept.
    """
    user_prompt = state.get("user_prompt", "AI Campaign")
    style = state.get("style", "Cinematic")
    
    logs = list(state.get("logs", []))
    logs.append(f"🧠 [Idea Agent]: Analyzing prompt '{user_prompt}' with '{style}' aesthetic style...")

    system_prompt = (
        "You are an elite Creative Director at a world-class advertising agency. "
        "Create a compelling campaign concept based on the user's brief."
    )
    
    user_msg = f"User Request: {user_prompt}\nAesthetic Style: {style}"

    # Default procedural fallback tailored to user prompt
    fallback_concept = {
        "title": f"{user_prompt.title()} - Visual Campaign",
        "tagline": "Step Into the Next Era of Innovation",
        "mood": f"High-octane, immersive, futuristic {style.lower()} atmosphere",
        "target_audience": "Tech enthusiasts, early adopters, design aficionados, urban trendsetters",
        "core_theme": f"Exploring the boundary between reality and imagination through {user_prompt}",
        "brand_voice": "Bold, visionary, mysterious, premium",
        "color_palette": ["#0F172A", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"]
    }

    # Customization based on keywords in prompt
    prompt_lower = user_prompt.lower()
    if "cyberpunk" in prompt_lower or "siberpunk" in prompt_lower or "coffee" in prompt_lower:
        fallback_concept.update({
            "title": "NEO-BREW 2088: Cyberpunk Coffee Launch",
            "tagline": "Awaken Your Cybernetic Soul",
            "mood": "Neon-drenched synthwave, rainy asphalt, glowing holographic neon, gritty luxury",
            "target_audience": "Night owls, tech geeks, digital nomads, futuristic coffee lovers",
            "core_theme": "High-caffeine quantum roasted coffee brewed in the heart of Neo-Tokyo",
            "brand_voice": "Edgy, rebellious, hyper-energized, sleek",
            "color_palette": ["#090D16", "#00F0FF", "#FF0055", "#7000FF", "#FFE600"]
        })
    elif "watch" in prompt_lower or "luxury" in prompt_lower:
        fallback_concept.update({
            "title": "AETHERIA: Timeless Precision",
            "tagline": "Mastery Beyond Chronos",
            "mood": "Minimalist luxury, golden hour shimmer, obsidian reflections",
            "target_audience": "Luxury collectors, executives, design connoisseurs",
            "core_theme": "The harmony of aerospace titanium engineering and haute horlogerie",
            "brand_voice": "Sophisticated, understated, powerful, timeless",
            "color_palette": ["#0B0C10", "#C5A059", "#1F2833", "#E5E5E5", "#45A29E"]
        })
    elif "eco" in prompt_lower or "green" in prompt_lower or "nature" in prompt_lower:
        fallback_concept.update({
            "title": "VERDANT: Organic Tech Ecosystem",
            "tagline": "Technology Living in Symbiosis",
            "mood": "Lush biophilic design, sunlight filtering through leaves, clean glass architecture",
            "target_audience": "Eco-conscious innovators, sustainability advocates",
            "core_theme": "Merging AI smart materials with self-sustaining moss networks",
            "brand_voice": "Inspiring, organic, serene, forward-thinking",
            "color_palette": ["#064E3B", "#10B981", "#A7F3D0", "#D97706", "#ECFDF5"]
        })

    concept = llm_service.generate_json(system_prompt, user_msg, fallback_concept)

    logs.append(f"✅ [Idea Agent]: Concept '{concept.get('title')}' successfully created.")
    
    return {
        **state,
        "concept": concept,
        "logs": logs,
        "current_step": "idea_generation"
    }
