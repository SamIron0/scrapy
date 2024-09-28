import requests
import os
import json
from typing import Dict, Any, Optional

DEEPINFRA_API_TOKEN = os.getenv("DEEPINFRA_API_TOKEN")
API_URL = "https://api.deepinfra.com/v1/openai/chat/completions"
MODEL_ID = "meta-llama/Meta-Llama-3.1-70B-Instruct"

def _make_api_call(messages: list, response_format: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPINFRA_API_TOKEN}",
    }
    payload = {
        "model": MODEL_ID,
        "messages": messages,
    }
    if response_format:
        payload["response_format"] = response_format

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise APIError(f"Request failed: {str(e)}")
    except Exception as e:
        raise APIError(f"Unexpected error: {str(e)}")

def call_llm_with_json(prompt: str) -> Dict[str, Any]:
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant that converts text to JSON. Always return a valid JSON object.",
        },
        {"role": "user", "content": prompt},
    ]
    try:
        result = _make_api_call(messages, response_format={"type": "json_object"})
        content = result["choices"][0]["message"]["content"]
        return json.loads(content)
    except json.JSONDecodeError:
        raise APIError("Invalid JSON received", content=content)

def call_llm(prompt: str) -> str:
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant that answers questions based on the provided context.",
        },
        {"role": "user", "content": prompt},
    ]
    result = _make_api_call(messages)
    return result["choices"][0]["message"]["content"]

class APIError(Exception):
    def __init__(self, message, content=None):
        self.message = message
        self.content = content
        super().__init__(self.message)
