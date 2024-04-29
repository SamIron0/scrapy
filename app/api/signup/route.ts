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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
        // emailRedirectTo: `${origin}/auth/callback`
      }
    })

    //console.log("sign", error)
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
    } else {
      return new Response(JSON.stringify("signed up"))
    }
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error }))
  }
}
