import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup


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


def main():
    url = input("Enter the URL of the website you want to scrape: ")
    html_content = get_page_content(url)
    cleaned_text = clean_html(html_content)
    print(cleaned_text)


if __name__ == "__main__":
    main()
