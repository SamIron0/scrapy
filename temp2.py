from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time


def get_first_20_recipe_urls_from_sitemap(sitemap_url):
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
            # urls.append(url)
            count += 1

    # Clean up
    driver.quit()

    return urls


if __name__ == "__main__":
    sitemap_url = "https://www.allrecipes.com/sitemap_1.xml"
    urls = get_first_20_recipe_urls_from_sitemap(sitemap_url)
    for url in urls:
        print(url)
