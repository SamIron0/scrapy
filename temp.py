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
import cohere
import os
from supabase import Client, create_client

co = cohere.Client(os.getenv("COHERE_API_KEY"))  # This is your trial API key

supabase_url: str = "https://nrmhfqjygpjiqcixhpvn.supabase.co"
supabase_key: str = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def convert_iso8601_to_hours_minutes(duration_str):
    # Parse the ISO 8601 duration string
    duration = isodate.parse_duration(duration_str)
    
    # Extract hours and minutes from the duration
    total_minutes = int(duration.total_seconds() / 60)
    hours = total_minutes // 60
    minutes = total_minutes % 60
    
    return hours, minutes

def extract_recipe_info(script_content):
    # print("extracting from ", script_content)
    data = json.loads(script_content)
    recipe_data = data[0]
    prep_hours, prep_minutes = convert_iso8601_to_hours_minutes(recipe_data.get("prepTime", ""))
    cook_hours, cook_minutes = convert_iso8601_to_hours_minutes(recipe_data.get("cookTime", ""))
    total_hours, total_minutes = convert_iso8601_to_hours_minutes(recipe_data.get("totalTime", ""))
    recipe = {
        "name": recipe_data.get("name", ""),
        "portions": recipe_data.get("recipeYield", ""),
        "prep_time": [prep_hours, prep_minutes],
        "cook_time": [cook_hours, cook_minutes],
        "total_time": [total_hours, total_minutes],
        "yield": recipe_data.get("recipeYield", ""),
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
        "rating_count": int(
            recipe_data.get("aggregateRating", {}).get("ratingCount", 0)
        ),
        "rating_count": int(
            recipe_data.get("aggregateRating", {}).get("ratingCount", 0)
        ),
        "rating_value": float(
            recipe_data.get("aggregateRating", {}).get("ratingValue", 0)
        ),
    }

    return recipe


def scrape_recipe(page, url):
    page.goto(url)
    script_content = page.query_selector("script#allrecipes-schema_1-0").text_content()
    return extract_recipe_info(script_content)

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
    count = 0
    # Extract the first 20 URLs containing '/recipe/'
    urls = []
    for url_element in soup.find_all("loc"):
        url = url_element.text
        if "/recipe/" in url:
            urls.append(url)
            count += 1

    # Clean up
    driver.quit()

    return urls
def construct_text_from_recipe(recipe):
    parts = []
    if recipe.get("name"):
        parts.append(f"Dish: {recipe['name']}")
    if recipe.get("category") != None:
        parts.append(f"Category: {recipe['category']}")
    if recipe.get("ingredients"):
        parts.append(f"Ingredients: {recipe['ingredients']}")
    if recipe.get("cuisine") != None:
        parts.append(f"Cuisine: {recipe['cuisine']}")
    if recipe.get("cooking_method") != None:
        parts.append(f"Cooking Method: {recipe['cooking_method']}")
    if recipe.get("course_type") != None:
        parts.append(f"Course Type: {recipe['course_type']}")

    print("finished constructing recipe text for embedding: \n".join(parts), "\n\n\n")
    return "\n".join(parts)


def main():
    sitemap_url = "https://www.allrecipes.com/sitemap_1.xml"
    recipe_urls = fetch_sitemap_urls(sitemap_url)
    print("Fetched urls")
    recipes = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        count = 800
        for url in recipe_urls:
            if(count%100 == 0):
                print(count, "left\n\n\n")
            try:
                recipe_info = scrape_recipe(page, url)
                # print(recipe_info["rating_count"]>2000)
                # print(type(recipe_info["rating_count"], recipe_info["rating_value"])
                if recipe_info["rating_count"]>200 and recipe_info["rating_value"] > 4.5:
                    print("over", recipe_info["rating_count"],'\n\n\n')
                    recipes.append(recipe_info)
                    if len(recipes) > 5 or count == 0:
                        print("break")
                        break
                count -= 1

            except Exception as e:
                print("Error ", e)

        browser.close()
    # Print the collected recipes
    # print(recipe_info)
    print(json.dumps(recipes, indent=2))


def create_embedding(text):

    response = co.embed(
        model="embed-english-v3.0",
        texts=[text],
        input_type="classification",
        truncate="NONE",
    )
    return response.embeddings[0]


if __name__ == "__main__":
    main()
