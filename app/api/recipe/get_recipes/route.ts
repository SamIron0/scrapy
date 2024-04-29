import { ServerRuntime } from "next"
export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { url, description } = json as {
    url: string
    description: string
  }
  try {
    //const tags = ["African", "dinner"]

    const data = await fetch(
      "https://e558-2604-3d09-aa7a-95e0-e006-b4c3-7148-61bd.ngrok-free.app/scrape",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          description
        })
      }
    )
    const res = await data.json()

    if (!res) {
      return new Response(JSON.stringify({ error: "None" }))
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
