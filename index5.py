# ======================= remove duplicates in recipes2
import os
from supabase import create_client, Client


def main():
    recipes = supabase.table("recipes2").select("*").execute()
    import os


from supabase import create_client, Client

supabase_url = "https://nrmhfqjygpjiqcixhpvn.supabase.co"
supabase_key = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(supabase_url, supabase_key)


def main():
    recipes = supabase.table("recipes2").select("*").execute().data
    if not recipes:
        print("No recipes found.")
        return

    unique_urls = {}
    duplicates = []

    for recipe in recipes:
        url = recipe["url"]
        if url not in unique_urls:
            unique_urls[url] = recipe["id"]
        else:
            duplicates.append(recipe["id"])

    if duplicates:
        
        for duplicate_id in duplicates:
            supabase.table("recipes2").delete().eq("id", duplicate_id).execute()
        print(f"Removed {len(duplicates)} duplicate(s).")
    else:
        print("No duplicates found.")


if __name__ == "__main__":
    main()
