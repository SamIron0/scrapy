# Web Scraper with Entity Extraction and RAG-based Chat

## What is this?

This codebase allows you to scrape any website, extract relevant data points using OpenAI Functions and LangChain, and then chat with the extracted data using RAG (Retrieval-Augmented Generation).

## Setup

### 1. Create a new Python virtual environment

`python -m venv virtual-env` or `python3 -m venv virtual-env` (Mac)
`py -m venv virtual-env` (Windows 11)

### 2. Activate virtual environment

`.\virtual-env\Scripts\activate` (Windows)
`source virtual-env/bin/activate` (Mac)

### 3. Install dependencies

Run `pip install -r requirements.txt`

### 4. Install playwright

### 5. Create a new `.env` file to store API keys

OPENAI_API_KEY=XXXXXX
DEEPINFRA_API_TOKEN=XXXXXX

## Usage

### Run locally

```bash
python app.py
```

1. Enter the URL of the website you want to scrape.
2. The program will extract and display the JSON data from the website.
3. You can then ask questions about the website content, and the program will use RAG to provide answers based on the extracted information.

## Additional Information

- This project now uses embeddings and FAISS for efficient retrieval of relevant information.
- The chat functionality uses a conversational retrieval chain from LangChain to provide context-aware responses.