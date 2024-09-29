import pytest
from app.main import create_app
from app.scraper import verify_url
from app.llm_service import APIError

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_invalid_url(client):
    response = client.post('/api/scrape', json={'url': 'invalid_url'})
    assert response.status_code == 400
    assert 'error' in response.json

def test_missing_url(client):
    response = client.post('/api/scrape', json={})
    assert response.status_code == 400
    assert 'error' in response.json

def test_missing_question_or_context(client):
    response = client.post('/api/chat', json={'question': 'Test question', 'chat_history': []})
    assert response.status_code == 400
    assert 'error' in response.json

    response = client.post('/api/chat', json={'context': 'Test context', 'chat_history': []})
    assert response.status_code == 400
    assert 'error' in response.json

    response = client.post('/api/chat', json={'question': 'Test question', 'context': 'Test context'})
    assert response.status_code == 200
    assert 'answer' in response.json
    assert 'chat_history' in response.json

def test_api_error_handling():
    with pytest.raises(APIError):
        raise APIError("Test API Error")
