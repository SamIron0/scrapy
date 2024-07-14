# ======================= embed recipes
import asyncio
import re
import requests
from supabase import create_client, Client
import os
import cohere

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

supabase_url = "https://nrmhfqjygpjiqcixhpvn.supabase.co"
supabase_key = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

api_key = os.getenv("HUGGINGFACE_API_KEY")

headers = {"Authorization": f"Bearer {api_key}"}


async def create_embedding(query):
    response = co.embed(
        model="embed-english-v3.0",
        texts=[query],
        input_type="classification",
        truncate="NONE",
    )
    res = response.embeddings[0]
    return res


async def main():
    await run()


async def run():
    try:
        recipes = (
            supabase.table("recipes2")
            .select("*")
            .limit(1000)
            .is_("embeddings", None)
            .execute()
        )

        count = 0
        for i, recipe in enumerate(recipes.data):
            response = await create_embedding(recipe["kw_search_text"])
            res = (
                supabase.table("recipes2")
                .update({"embeddings": response})
                .eq("id", recipe["id"])
                .execute()
            )
            count += 1

            # Sleep for 1 minute after every 40 insertions
            if (i + 1) % 100 == 0:
                print(f"Inserted {i + 1} embeddings, sleeping for 1 minute...")
                await asyncio.sleep(60)

        print(count, "done\n")
        return {"status": "OK"}

    except Exception as e:
        print(f"Error inserting embeddings into Supabase: {e}")
        print("count", count)
        return {"error": str(e)}


if __name__ == "__main__":
    asyncio.run(main())

"""
@app.route("/", methods=["GET", "POST"])
def home():
    return jsonify({"status": "OK"})

@app.route("/", methods=["GET", "POST"])
def embed():
    res = asyncio.run(main())
    return res
"""
