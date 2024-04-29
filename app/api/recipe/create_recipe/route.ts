import { ServerRuntime } from "next"
import { createRecipe, urlExists } from "@/db/recipes"
import { TablesInsert } from "@/supabase/types"
export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { recipe, tags, url } = json as {
    recipe: TablesInsert<"recipes">
    tags: string[]
    url: string
  }
  const exists: boolean = await urlExists(url)
  if (exists) {
    return new Response(JSON.stringify({ error: "url already exists" }))
  }
  try {
    const res = await createRecipe(recipe, tags)
    return new Response(JSON.stringify(res))
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error }))
  }
}
