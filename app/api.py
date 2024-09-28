from flask import Blueprint, request, jsonify
from .scraper import get_page_content, clean_html, verify_url
from .embedding_service import create_vector_store, get_conversational_chain
from .llm_service import call_llm_with_json

api = Blueprint('api', __name__)

@api.route("/scrape", methods=["POST"])
def scrape():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    if not verify_url(url):
        return jsonify({"error": "Invalid URL format"}), 400

    try:
        html_content = get_page_content(url)
        cleaned_text = clean_html(html_content)
        json_data = call_llm_with_json(cleaned_text)
        return jsonify({"data": json_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/chat", methods=["POST"])
def chat():
    question = request.json.get("question")
    context = request.json.get("context")
    if not question or not context:
        return jsonify({"error": "Question and context are required"}), 400

    try:
        vector_store = create_vector_store(context)
        chain = get_conversational_chain(vector_store)
        response = chain({"question": question, "chat_history": []})
        return jsonify({"answer": response["answer"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
