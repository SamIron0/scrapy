import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from llm_service import call_llm_with_json
from embedding_service import create_vector_store, get_conversational_chain
import json
import re
import os


def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver


def get_page_content(url):
    driver = setup_driver()
    driver.get(url)
    time.sleep(5)
    page_source = driver.page_source
    driver.quit()
    return page_source


def clean_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    for script in soup(["script", "style"]):
        script.decompose()

    for elem in soup(["header", "footer", "nav"]):
        elem.decompose()

    text = soup.get_text()

    lines = (line.strip() for line in text.splitlines())

    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

    text = "\n".join(chunk for chunk in chunks if chunk)

    return text


def convert_to_json(cleaned_text):
    prompt = f"Convert the following text into a JSON object with appropriate keys and values:\n\n{cleaned_text}"
    return call_llm_with_json(prompt)


def verify_url(url):
    pattern = re.compile(
        r"^(?:http|ftp)s?://"
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|"  # domain...
        r"localhost|"
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        r"(?::\d+)?"
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )

    return re.match(pattern, url) is not None


def main():
    while True:
        url = input(
            "Enter the URL of the website you want to scrape (or type 'quit' to exit): "
        )
        if url.lower() == "quit":
            break
        if verify_url(url):
            html_content = get_page_content(url)
            cleaned_text = clean_html(html_content)
            json_data = convert_to_json(cleaned_text)

            vector_store = create_vector_store(cleaned_text)
            chain = get_conversational_chain(vector_store)

            chat_history = []
            while True:
                query = input(
                    "Ask a question about the website content (or type 'back' to enter a new URL): "
                )
                if query.lower() == "back":
                    break
                result = chain({"question": query, "chat_history": chat_history})
                print("Answer:", result["answer"])
                chat_history.append((query, result["answer"]))
        else:
            print("Invalid URL format. Please enter a valid URL.")

if __name__ == "__main__":
    main()
