import os
import json
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

logger = logging.getLogger("llm_service")

class LLMService:
    def _get_keys(self):
        load_dotenv(override=True)
        return {
            "openai": os.getenv("OPENAI_API_KEY", "").strip(),
            "gemini": os.getenv("GEMINI_API_KEY", "").strip(),
            "deepseek": os.getenv("DEEPSEEK_API_KEY", "").strip()
        }

    def generate_json(self, system_prompt: str, user_prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Attempts to query configured LLM (DeepSeek / Gemini / OpenAI). If keys are missing or calls fail,
        returns structured fallback data designed for instant execution & demonstration.
        """
        keys = self._get_keys()
        
        # 1. Try DeepSeek API if key is present
        if keys["deepseek"]:
            try:
                import httpx
                url = "https://api.deepseek.com/chat/completions"
                headers = {
                    "Authorization": f"Bearer {keys['deepseek']}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": system_prompt + "\nIMPORTANT: Return ONLY valid JSON format."},
                        {"role": "user", "content": user_prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.7
                }
                response = httpx.post(url, json=payload, headers=headers, timeout=15.0)
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    logger.info("Successfully received LLM JSON output from DeepSeek API")
                    return parsed
                else:
                    logger.warning(f"DeepSeek API error status {response.status_code}: {response.text}")
            except Exception as e:
                logger.warning(f"DeepSeek invocation failed: {e}. Switching to next handler.")

        # 2. Try Gemini API if key is present
        if keys["gemini"]:
            try:
                import httpx
                for model_name in ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"]:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={keys['gemini']}"
                    payload = {
                        "contents": [{
                            "parts": [{"text": f"{system_prompt}\n\nIMPORTANT: Return ONLY valid JSON output.\n\nUser Input: {user_prompt}"}]
                        }],
                        "generationConfig": {
                            "response_mime_type": "application/json",
                            "temperature": 0.7
                        }
                    }
                    response = httpx.post(url, json=payload, timeout=12.0)
                    if response.status_code == 200:
                        data = response.json()
                        text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                        parsed = json.loads(text_content)
                        logger.info(f"Successfully received LLM JSON output from Gemini API ({model_name})")
                        return parsed
            except Exception as e:
                logger.warning(f"Gemini API invocation failed: {e}. Switching to procedural fallback.")

        # 3. Try OpenAI if key is present
        if keys["openai"] and keys["openai"].startswith("sk-") and len(keys["openai"]) > 35:
            try:
                # pyrefly: ignore [missing-import]
                import langchain_openai
                from langchain_core.messages import SystemMessage, HumanMessage
                
                llm = langchain_openai.ChatOpenAI(
                    model="gpt-4o-mini",
                    temperature=0.7,
                    api_key=keys["openai"],
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
                logger.warning(f"OpenAI invocation failed: {e}. Switching to fallback.")

        # 4. Fallback generator logic
        return fallback_data

llm_service = LLMService()
