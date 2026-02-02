from huggingface_hub import AsyncInferenceClient
from typing import Dict, Optional
import logging
import os

logger = logging.getLogger(__name__)

class HuggingFaceClient:
    def __init__(self):
        api_token = os.getenv("HUGGINGFACE_API_KEY")
        if not api_token:
            logger.warning("HUGGINGFACE_TOKEN not set - using free tier with rate limits")
        
        self.client = AsyncInferenceClient(token=api_token, timeout=600)
        logger.info("HuggingFace async client initialized")
    
    async def query_model(
        self,
        model: str,
        prompt: str,
        region: Optional[str] = None
    ) -> Dict:
        """
        Query a model on HuggingFace asynchronously using chat completions
        """
        try:
            logger.info(f"Querying model: {model}")
            logger.debug(f"Prompt: {prompt[:100]}...")
            
            # Build messages list
            messages = []
            
            # Add system message with region context if provided
            if region:
                messages.append({
                    "role": "system",
                    "content": f"You are responding from the perspective of someone in {region}. Consider regional context, brands, and preferences relevant to {region}."
                })
            
            # Add user prompt
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # Use async chat completions API
            completion = await self.client.chat_completion(
                messages=messages,
                model=model
            )
            
            # Extract the generated text from response
            if not completion or not completion.choices:
                logger.warning(f"Model {model} returned no choices")
                return {
                    "model": model,
                    "response": "",
                    "error": "Model returned empty response",
                    "status": "empty"
                }
            
            generated_text = completion.choices[0].message.content
            
            if not generated_text or generated_text.strip() == "":
                logger.warning(f"Model {model} returned empty text")
                return {
                    "model": model,
                    "response": "",
                    "error": "Model returned empty text",
                    "status": "empty"
                }
            
            logger.info(f"Model {model} responded with {len(generated_text)} characters")
            
            return {
                "model": model,
                "response": generated_text.strip(),
                "status": "success"
            }
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Error querying {model}: {error_msg}")

            return {
                "model": model,
                "response": "",
                "error": error_msg,
                "status": "error"
            }