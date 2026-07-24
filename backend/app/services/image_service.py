import os
import urllib.parse
import logging
from typing import Dict, Any, List

logger = logging.getLogger("image_service")

class ImageService:
    def __init__(self):
        self.replicate_key = os.getenv("REPLICATE_API_KEY", "").strip()
        self.openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    def generate_image(self, scene_number: int, prompt: str, style: str) -> Dict[str, Any]:
        """
        Generates an image from prompt and style.
        Returns dict with scene_number, image_url, prompt_used, and status.
        """
        # If Replicate API key is present
        if self.replicate_key:
            try:
                import requests
                headers = {"Authorization": f"Token {self.replicate_key}", "Content-Type": "application/json"}
                payload = {
                    "version": "black-forest-labs/flux-schnell",
                    "input": {
                        "prompt": f"{prompt}, {style} style, cinematic lighting, 8k resolution",
                        "aspect_ratio": "16:9"
                    }
                }
                res = requests.post("https://api.replicate.com/v1/predictions", json=payload, headers=headers, timeout=10)
                if res.status_code == 201:
                    data = res.json()
                    # In real async replicate we can poll or get get output url
                    if "urls" in data and "get" in data["urls"]:
                        image_url = data.get("output", [None])[0] or data["urls"]["get"]
                        return {
                            "scene_number": scene_number,
                            "image_url": image_url,
                            "prompt_used": prompt,
                            "status": "success"
                        }
            except Exception as e:
                logger.warning(f"Replicate generation failed: {e}. Falling back to visual generator.")

        # High quality dynamic artwork endpoint (Pollinations AI / Styled visual art)
        encoded_prompt = urllib.parse.quote(f"{prompt}, high quality {style} style, dramatic lighting, detailed")
        # Direct generation URL for Pollinations AI (free high quality real AI image API)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=576&nologo=true&seed={scene_number * 42 + 7}"

        return {
            "scene_number": scene_number,
            "image_url": image_url,
            "prompt_used": prompt,
            "status": "success"
        }

image_service = ImageService()
