# Web Scraper with Entity Extraction and RAG-based Chat

## What is this?

This codebase allows you to scrape any website, extract relevant data points using OpenAI Functions and LangChain, and then chat with the extracted data using RAG (Retrieval-Augmented Generation).

## Setup

1. Create a new Python virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root and add your API keys:
   ```
   DEEPINFRA_API_TOKEN=your_deepinfra_api_token
   ```

## Running the App

For development:
```
flask run
```

For production:
```
gunicorn wsgi:app
```


## API Endpoints

1. `/api/scrape` (POST)
   - Input: JSON with `url` field
   - Output: JSON data extracted from the webpage

2. `/api/chat` (POST)
   - Input: JSON with `question` and `context` fields
   - Output: Answer based on the provided context

## Running Tests

```
pytest
```

## Additional Information

- This project now uses embeddings and FAISS for efficient retrieval of relevant information.
- The chat functionality uses a conversational retrieval chain from LangChain to provide context-aware responses.