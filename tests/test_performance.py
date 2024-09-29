import pytest
import time
from app.main import create_app
from concurrent.futures import ThreadPoolExecutor, as_completed


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_scrape_endpoint_performance(client):

    url = "https://ironkwe.site/about/"
    start_time = time.time()
    response = client.post("/api/scrape", json={"url": url})
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Scraping took {elapsed_time:.2f} seconds")
    assert response.status_code == 200
    assert elapsed_time < 200


def test_chat_endpoint_performance(client):
    context = "This is a test context for the chat endpoint performance test."
    start_time = time.time()
    response = client.post(
        "/api/chat",
        json={
            "question": "What is this about?",
            "context": context,
            "chat_history": []
        }
    )
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Chat took {elapsed_time:.2f} seconds")
    assert response.status_code == 200
    assert "answer" in response.json
    assert "chat_history" in response.json
    assert elapsed_time < 10
