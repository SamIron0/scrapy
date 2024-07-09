import isodate

from datetime import timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import json
import requests
from playwright.sync_api import sync_playwright
import os
from supabase import Client, create_client
import uuid

headers = {"Authorization": f"Bearer {api_key}"}

supabase_url: str = "https://nrmhfqjygpjiqcixhpvn.supabase.co"
supabase_key: str = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(supabase_url, supabase_key)


async def create_embedding(query):
    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    payload = {
        "inputs": query,
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def convert_iso8601_to_hours_minutes(duration_str):
    if duration_str == "":
        return 0, 0
    try:
        # Parse the ISO 8601 duration string
        duration = isodate.parse_duration(duration_str)

        # Extract hours and minutes from the duration
        total_minutes = int(duration.total_seconds() / 60)
        hours = total_minutes // 60
        minutes = total_minutes % 60
    except Exception as e:
        print(e)
        hours = 0
        minutes = 0
    return hours, minutes


def extract_recipe_info(script_content):
    data = json.loads(script_content)
    recipe_data = data[0]
    prep_hours, prep_minutes = convert_iso8601_to_hours_minutes(
        recipe_data.get("prepTime", "")
    )
    cook_hours, cook_minutes = convert_iso8601_to_hours_minutes(
        recipe_data.get("cookTime", "")
    )
    total_hours, total_minutes = convert_iso8601_to_hours_minutes(
        recipe_data.get("totalTime", "")
    )
    recipe = {
        "id": str(uuid.uuid4()),
        "name": recipe_data.get("name", ""),
        "portions": recipe_data.get("recipeYield", ""),
        "prep_time": [prep_hours, prep_minutes],
        "cook_time": [cook_hours, cook_minutes],
        "total_time": [total_hours, total_minutes],
        "description": recipe_data.get("description", ""),
        "calories": recipe_data.get("nutrition", {}).get("calories", ""),
        "protein": recipe_data.get("nutrition", {}).get("proteinContent", ""),
        "fats": recipe_data.get("nutrition", {}).get("fatContent", ""),
        "carbs": recipe_data.get("nutrition", {}).get("carbohydrateContent", ""),
        "category": ", ".join(recipe_data.get("recipeCategory", [])),
        "servings": recipe_data.get("recipeYield", ""),
        "ingredients": recipe_data.get("recipeIngredient", ""),
        "instructions": " ".join(
            [step["text"] for step in recipe_data.get("recipeInstructions", [])]
        ),
        "cuisine": ", ".join(recipe_data.get("recipeCuisine", [])),
        "imgUrl": recipe_data.get("image", {}).get("url", ""),
        "rating_count": int(
            recipe_data.get("aggregateRating", {}).get("ratingCount", 0)
        ),
        "rating_value": float(
            recipe_data.get("aggregateRating", {}).get("ratingValue", 0)
        ),
        "url": "",
        "kw_search_text": "",
    }
    return recipe


def scrape_recipe(page, url):
    page.goto(url)
    script_content = page.query_selector("script#allrecipes-schema_1-0").text_content()
    recipe_info = extract_recipe_info(script_content)
    recipe_info["url"] = url
    return recipe_info


def fetch_sitemap_urls(sitemap_url):
    # Set up Chrome options to run headless (no GUI)
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )

    # Set up the webdriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Navigate to the homepage first
    driver.get("https://www.allrecipes.com")
    time.sleep(2)  # wait for a couple of seconds to mimic natural browsing

    # Fetch the sitemap URL
    driver.get(sitemap_url)
    content = driver.page_source

    # Parse the XML with BeautifulSoup
    soup = BeautifulSoup(content, "lxml")  # Use 'lxml' as the parser
    # Extract the first 20 URLs containing '/recipe/'
    urls = []
    for url_element in soup.find_all("loc"):
        url = url_element.text
        if "/recipe/" in url:
            urls.append(url)

    # Clean up
    driver.quit()

    return urls


def construct_text_from_recipe(recipe):
    parts = []
    time = recipe["total_time"]
    time_str = f"{ time[0]}hrs {time[1]}mins"
    if recipe.get("name"):
        parts.append(f"Dish: {recipe['name']}")
    if recipe.get("category") != None:
        parts.append(f"Category: {recipe['category']}")
    if recipe.get("ingredients"):
        parts.append(f"Ingredients: {recipe['ingredients']}")
    if recipe.get("cuisine") != None:
        parts.append(f"Cuisine: {recipe['cuisine']}")
    if recipe.get("total_time") != None:
        parts.append(f"Cooking Time: {time_str}")
    if recipe.get("instructions") != None:
        parts.append(f"Instructions: {recipe['instructions']}")
    if recipe.get("description") != None:
        parts.append(f"Description: {recipe['description']}")

    return "\n".join(parts)


def main():
    sitemap_url = "https://www.allrecipes.com/sitemap_1.xml"
    recipe_urls = fetch_sitemap_urls(sitemap_url)
    print("Fetched urls")
    recipes = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        count = 0
        for url in recipe_urls[7403:7425]:
            # for url in recipe_urls[6:]:
            count += 1
            if count % 100 == 0:
                print(count, "done\n")
            try:
                recipe_info = scrape_recipe(page, url)
                if (
                    recipe_info["rating_count"] > 200
                    and recipe_info["rating_value"] > 4.5
                ):
                    # recipes.append(recipe_info)
                    text = construct_text_from_recipe(recipe_info)
                    # print("text", text)
                    # recipe_info["embedding"] = create_embedding(text)
                    recipe_info["kw_search_text"] = text
                    recipe_info["embedding"] = create_embedding(text)
                    print(recipe_info)
                    supabase.table("recipes2").insert(recipe_info).execute()
            except Exception as e:
                print("Error ", e)
        browser.close()
    return


def create_embedding(query):
    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    payload = {
        "inputs": query,
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    print(response.json())

    return response


if __name__ == "__main__":
    main()
