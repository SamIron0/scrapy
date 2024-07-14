# ======================= fix recipe naming in supabase
import os
from supabase import create_client, Client

supabase_url = "https://nrmhfqjygpjiqcixhpvn.supabase.co"
supabase_key = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

import html


def main():
    recipes = supabase.table("recipes2").select("*").execute()
    print ("got recipes from supabase", len(recipes.data))
    for recipe in recipes.data:
        recipe_name = recipe["name"]
        cleaned_name = html.unescape(
            recipe_name
        )  # Converts HTML entities to normal characters
        count = 0
        if cleaned_name != recipe_name:
            count += 1
            if(count > 1):
                break
            # Update the recipe name in the database
            supabase.table("recipes2").update({"name": cleaned_name}).eq(
                "id", recipe["id"]
            ).execute()
            print(recipe_name, "=>", cleaned_name)


if __name__ == "__main__":
    main()
