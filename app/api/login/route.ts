import { ServerRuntime } from "next"
import { createRecipe } from "@/db/recipes"
import { TablesInsert } from "@/supabase/types"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { email, password } = json as {
    email: string
    password: string
  }
  //const recipeJson = JSON.stringify(recipe)
  try {
    ;("use server")

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return new Response(
        JSON.stringify({
          errors: {
            status: "401",
            title: "Authentication failed",
            detail: error.message
          }
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      return new Response(
        JSON.stringify({
          errors: [
            {
              status: "404",
              title: "Home workspace not found",
              detail: homeWorkspaceError?.message
            }
          ]
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    return new Response(JSON.stringify(homeWorkspace))
  } catch (error) {
    return new Response(JSON.stringify({ error: error }))
  }
}
