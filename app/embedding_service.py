from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import DeepInfra
from sentence_transformers import SentenceTransformer
import os
from typing import List

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def create_vector_store(texts: str, batch_size: int = 64) -> FAISS:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(texts)

    embeddings = model.encode(chunks[:batch_size])
    text_embeddings = list(zip(chunks[:batch_size], embeddings))
    vector_store = FAISS.from_embeddings(text_embeddings, model.encode)

    for i in range(batch_size, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        batch_embeddings = model.encode(batch)
        batch_text_embeddings = list(zip(batch, batch_embeddings))
        vector_store.add_embeddings(batch_text_embeddings)

    return vector_store

def get_conversational_chain(vector_store: FAISS) -> ConversationalRetrievalChain:
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    llm = DeepInfra(model_id="meta-llama/Meta-Llama-3.1-70B-Instruct")
    return ConversationalRetrievalChain.from_llm(llm, retriever=retriever)

__all__ = ["create_vector_store", "get_conversational_chain"]
