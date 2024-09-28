import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPINFRA_API_TOKEN = os.getenv("DEEPINFRA_API_TOKEN")
MODEL_ID = "meta-llama/Meta-Llama-3.1-70B-Instruct"
API_URL = "https://api.deepinfra.com/v1/openai/chat/completions"
