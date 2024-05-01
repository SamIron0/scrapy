import { ServerRuntime } from "next"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { createOrSaveSchema } from "@/db/schema"
import { TablesInsert } from "@/supabase/types"
export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { url, schema } = json as {
    url: string
    schema: TablesInsert<"schemas">
  }
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    //const tags = ["African", "dinner"]
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      return new Response(JSON.stringify({ error: "not logged in" }))
    }
    const uid = session?.user.id
    const res = await createOrSaveSchema(schema, uid)
    if (!res) {
      return new Response(JSON.stringify({ error: "something went wrong" }))
    }
    return new Response(JSON.stringify(res))
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error }))
  }
}

/*const apiKey = "YyUzxAyn6O6r9ZLUgLTLnarp27Rh5WsW5U0XeXhs"
const apiUrl =
"https://0dab1tpzjk.execute-api.us-east-1.amazonaws.com/default/scrape"

const headers = new Headers({
"Content-Type": "application/json",
"x-api-key": apiKey
})*/
