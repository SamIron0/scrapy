import pytest
from app.main import create_app
from app.scraper import get_page_content, clean_html
from app.llm_service import call_llm_with_json
from app.embedding_service import create_vector_store, get_conversational_chain


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_scrape_endpoint(client):
    response = client.post("/api/scrape", json={"url": "https://news.ycombinator.com"})
    assert response.status_code == 200
    assert "data" in response.json


def test_chat_endpoint(client):
    context = "This is a test context for the chat endpoint."
    initial_history = [("What is this about?", "This is a test context.")]
    response = client.post(
        "/api/chat",
        json={
            "question": "Can you elaborate?",
            "context": context,
            "chat_history": initial_history,
        },
    )
    assert response.status_code == 200
    assert "answer" in response.json
    assert "chat_history" in response.json
    assert len(response.json["chat_history"]) == len(initial_history) + 1


def test_full_pipeline():
    url = "https://news.ycombinator.com"
    try:
        html_content = get_page_content(url)
        cleaned_text = clean_html(html_content)
        json_data = call_llm_with_json(cleaned_text)
        assert isinstance(json_data, dict)

        vector_store = create_vector_store(cleaned_text)
        chain = get_conversational_chain(vector_store)
        result = chain.invoke(
            {"question": "What is this website about?", "chat_history": []}
        )
        assert "answer" in result
    except Exception as e:
        pytest.fail(f"Test failed with exception: {str(e)}")
