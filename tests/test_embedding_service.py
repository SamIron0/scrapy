import pytest
from app.embedding_service import create_vector_store, get_conversational_chain
from unittest.mock import patch, MagicMock
from langchain.schema import BaseRetriever

@pytest.fixture
def mock_sentence_transformer():
    with patch('app.embedding_service.SentenceTransformer') as mock:
        mock_model = MagicMock()
        mock_model.encode.return_value = [[0.1, 0.2, 0.3]]
        mock.return_value = mock_model
        yield mock

def test_create_vector_store(mock_sentence_transformer):
    text = "This is a test text for creating a vector store."
    vector_store = create_vector_store(text, batch_size=1)
    assert vector_store is not None

@pytest.fixture
def mock_faiss():
    with patch('app.embedding_service.FAISS') as mock:
        mock_vector_store = MagicMock()
        mock.from_embeddings.return_value = mock_vector_store
        yield mock

def test_get_conversational_chain(mock_faiss):
    mock_vector_store = MagicMock()
    mock_retriever = MagicMock(spec=BaseRetriever)
    mock_vector_store.as_retriever.return_value = mock_retriever
    chain = get_conversational_chain(mock_vector_store)
    assert chain is not None
