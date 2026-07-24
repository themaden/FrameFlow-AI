import os
import json
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("llm_service")

class LLMService:
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.gemini_key = os.getenv("GEMINI_API_KEY", "").strip()

    def generate_json(self, system_prompt: str, user_prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Attempts to query configured LLM (OpenAI/Gemini). If API key is missing or call fails,
        returns structured fallback data designed for instant execution & demonstration.
        """
        if self.openai_key:
            try:
                import langchain_openai
                from langchain_core.messages import SystemMessage, HumanMessage
                
                llm = langchain_openai.ChatOpenAI(
                    model="gpt-4o-mini",
                    temperature=0.7,
                    api_key=self.openai_key,
                    model_kwargs={"response_format": {"type": "json_object"}}
                )
                messages = [
                    SystemMessage(content=system_prompt + "\nIMPORTANT: Return ONLY valid JSON format."),
                    HumanMessage(content=user_prompt)
                ]
                response = llm.invoke(messages)
                parsed = json.loads(response.content)
                logger.info("Successfully received LLM JSON output from OpenAI")
                return parsed
            except Exception as e:
                logger.warning(f"OpenAI invocation failed: {e}. Switching to high-quality procedural fallback.")

        # Fallback generator logic
        return fallback_data

llm_service = LLMService()
