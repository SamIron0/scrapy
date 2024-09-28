from flask import Flask, request, jsonify
from app import get_page_content, clean_html, convert_to_json
from embedding_service import create_vector_store, get_conversational_chain

app = Flask(__name__)


@app.route("/scrape", methods=["POST"])
def scrape():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    html_content = get_page_content(url)
    cleaned_text = clean_html(html_content)
    json_data = convert_to_json(cleaned_text)
    return jsonify({"data": json_data})


@app.route("/chat", methods=["POST"])
def chat():
    question = request.json.get("question")
    context = request.json.get("context")
    if not question or not context:
        return jsonify({"error": "Question and context are required"}), 400

    vector_store = create_vector_store(context)
    chain = get_conversational_chain(vector_store)
    response = chain({"question": question, "chat_history": []})

    return jsonify({"answer": response["answer"]})


if __name__ == "__main__":
    app.run(debug=True)
