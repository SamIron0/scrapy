import { ServerRuntime } from "next"
import { createRecipe, getRecipesByTags } from "@/db/recipes"
import { TablesInsert } from "@/supabase/types"
import { Tags } from "@/types/tags"
export const runtime: ServerRuntime = "edge"

export async function GET(request: Request) {
  const json = await request.json()
  const { tags } = json as {
    tags: Tags[]
  }
  try {
    const res = await getRecipesByTags(tags)
    return new Response(JSON.stringify(res))
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error }))
  }
}
