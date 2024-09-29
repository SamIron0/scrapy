import pytest
from app.llm_service import call_llm_with_json, call_llm, APIError
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_api_response():
    return {
        "choices": [
            {
                "message": {
                    "content": '{"key": "value"}'
                }
            }
        ]
    }

def test_call_llm_with_json(mock_api_response):
    with patch('app.llm_service._make_api_call', return_value=mock_api_response):
        result = call_llm_with_json("Convert this to JSON")
        assert result == {"key": "value"}

def test_call_llm_with_json_invalid_json():
    invalid_response = {
        "choices": [
            {
                "message": {
                    "content": 'Invalid JSON'
                }
            }
        ]
    }
    with patch('app.llm_service._make_api_call', return_value=invalid_response):
        with pytest.raises(APIError):
            call_llm_with_json("Convert this to JSON")

def test_call_llm():
    mock_response = {
        "choices": [
            {
                "message": {
                    "content": "This is a test response"
                }
            }
        ]
    }
    with patch('app.llm_service._make_api_call', return_value=mock_response):
        result = call_llm("Test prompt")
        assert result == "This is a test response"
