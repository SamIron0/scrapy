import uuid
import asyncio
from data_types import (
    cuisines,
    cooking_methods,
    meal_types,
    diet_restrictions,
    courses,
    allergies,
)
import json
import os
from openai import OpenAI
import cohere

model = "meta-llama/Meta-Llama-3-70B-Instruct"
co = cohere.Client(os.getenv("COHERE_API_KEY"))  # This is your trial API key


def construct_text_from_recipe(recipe):

    parts = []
    if recipe.get("name"):
        parts.append(f"Dish: {recipe['name']}")
    if recipe.get("meal_type") != None:
        parts.append(f"Meal Type: {recipe['meal_type']}")
    if recipe.get("ingredients"):
        parts.append(f"Ingredients: {recipe['ingredients']}")
    if recipe.get("cuisine_type") != None:
        parts.append(f"Cuisine Type: {recipe['cuisine_type']}")
    if recipe.get("cooking_method") != None:
        parts.append(f"Cooking Method: {recipe['cooking_method']}")
    if recipe.get("course_type") != None:
        parts.append(f"Course Type: {recipe['course_type']}")

    # print("finished constructing recipe text for embedding: \n\n", "\n".join(parts))
    return "\n".join(parts)


def create_embedding(text):

    response = co.embed(
        model="embed-english-v3.0",
        texts=[text],
        input_type="classification",
        truncate="NONE",
    )
    return response.embeddings[0]


async def extract_recipe(url, content):

    # print("Extracting from", content)

    # Create an OpenAI client with your deepinfra token and endpoint
    openai = OpenAI(
        api_key="w1AR31Otuf40scz3WjfmQ0mQLEjpTl0Q",
        base_url="https://api.deepinfra.com/v1/openai",
    )

    recipe_format = {
        "name": 0,
        "protein": 0,
        "fats": 0,
        "carbs": 0,
        "calories": 0,
        "ingredients": [],
        "instructions": [],
        "portions": 0,
        "tags": [],
    }
    try:
        llm_extract = openai.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": f"Your are a jSON formatter with predictable output format. RETURN OONLY THE JSON. do not include any extra text before or after json. JSON:\n {recipe_format}",
                },
                {
                    "role": "user",
                    "content": "Pick out the name(return the officially generally recognized name, not the listed name e.g Mac and Cheese, instead of Aunt Kate's mac and cheese),protein,fats,carbs,total_calories,ingredients(leave as is, for example, do not change \"5 cloves garlic, crushed\" to garlic),instructions,portions, from the given text, ignore everything else. Only return the json. Text:\n'''"
                    + content
                    + "'''",
                },
            ],
            response_format={"type": "json_object"},
        )

        extract = json.loads(llm_extract.choices[0].message.content)

        tasks = [
            tagRecipe({"name": "cooking_methods", "data": cooking_methods}, extract),
            tagRecipe({"name": "meal_types", "data": meal_types}, extract),
            tagRecipe({"name": "cuisines", "data": cuisines}, extract),
            tagRecipe(
                {"name": "diet_restrictions", "data": diet_restrictions}, extract
            ),
            tagRecipe({"name": "course_types", "data": courses}, extract),
            tagRecipe({"name": "allergies", "data": allergies}, extract),
        ]

        results = await asyncio.gather(*tasks)
        recipe = {
            "url": url,
            "id": str(uuid.uuid4()),
            "name": extract["name"],
            "portions": extract["portions"],
            "calories": extract["calories"],
            "protein": extract["protein"],
            "fats": extract["fats"],
            "carbs": extract["carbs"],
            "meal_type": results[1],
            "servings": extract["portions"],
            "ingredients": extract["ingredients"],
            "instructions": extract["instructions"],
            "cooking_method": results[0],
            "cuisine_type": results[2],
            "dietary_restrictions": results[3],
            "course_type": results[4],
            "allergies": results[5],
        }
        # generate embedding
        print("Generating Embedding")
        t = construct_text_from_recipe(recipe)
        embedding = create_embedding(t)

        print("Embedding Generated")

        # add embedding to recipe
        final_recipe = {
            **recipe,
            "embedding": embedding,
        }

        return final_recipe

    except Exception as e:
        print("failed to extract, " + str(e))

        return


async def tagRecipe(tag_type, recipe, retries=3):
    openai = OpenAI(
        api_key="w1AR31Otuf40scz3WjfmQ0mQLEjpTl0Q",
        base_url="https://api.deepinfra.com/v1/openai",
    )
    res = openai.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": f"You are a recipe classifier, available {tag_type['name']} are \n{tag_type['data']}\n. Pick zero or more. Response in JSON format only, where key is {tag_type['name']} and value is text array or None. NO EXTRA TEXT",
            },
            {
                "role": "user",
                "content": f"{recipe}",
            },
        ],
        response_format={"type": "json_object"},
    )
    try:
        result = json.loads(res.choices[0].message.content)
        return result[tag_type["name"]]
    except:
        print("failed to tag", tag_type["name"], "retrying...")
        if retries == 0:
            return
        await tagRecipe(tag_type, recipe, retries - 1)
    return


async def extract(url: str, content: str, retries, **kwargs):

    try:
        retries = retries - 1
        recipe = await extract_recipe(url, content)
    except:

        print("Failed to extract, retrying...")
        recipe = await extract_recipe(content)

    return recipe


if __name__ == "__main__":
    print(extract(""))
