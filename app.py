import os
import uvicorn
import asyncio
import pprint
from ai_extractor import extract
from scrape import ascrape_playwright
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client, Client


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url: str = "https://nrmhfqjygpjiqcixhpvn.supabase.co"
supabase_key: str = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(supabase_url, supabase_key)


async def scrape_with_playwright(url: str, tags, **kwargs):
    html_content = await ascrape_playwright(url, tags)

    print("finished scraping, extracting...\n\n\n")
    extracted_content = await extract(url, content=html_content, retries=2)
    return extracted_content


def check_url(url):
    res = supabase.table("recipes").select("*").eq("url", url).execute()

    if len(res.data) > 0:
        return False
    else:
        return True


@app.post("/scrape")
async def scrape(request: Request):
    
    # Allow all origins for CORS (you might want to restrict this in production)
    data = await request.json()
    # Extract origin and destination from the JSON data
    url = data.get("url", {})
    # check url
    if not check_url(url):
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
            "body": "url already exists",
        }

    try:

        # Scrape and Extract with LLM
        result = await scrape_with_playwright(
            url=url,
            tags=["h1", "h2", "h3", "span", "table", "ol"],
        )
    except Exception as e:
        print("failed to scrape, " + str(e))

        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
            "body": "failed to scrape",
        }
        
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
        },
        "body": result,
    }


# TESTING
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
