import { ServerRuntime } from "next"
import { createRecipe } from "@/db/recipes"
import { TablesInsert } from "@/supabase/types"
export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { query } = json as {
    query: string
  }
  //const recipeJson = JSON.stringify(recipe)
  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-70B-Instruct",
          messages: [
            {
              role: "user",
              content:
                "Using the following query, generate a list of tags. " + query
            }
          ],
          stream: true,
          top_p: 0.8
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`
        }
      }
    )

    const tags = []

    return new Response(JSON.stringify("res"))
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error }))
  }
}
