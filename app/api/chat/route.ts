import { oneLine, stripIndent } from "common-tags"
import { retrieveEmbedding } from "@/components/sidebar/settings/embeddings"
import { Database, Tables } from "@/supabase/types"
import { ChatSettings } from "@/types"
import { createClient } from "@supabase/supabase-js"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, customModelId, settings } = json as {
    chatSettings: ChatSettings
    messages: any[]
    customModelId: string
    settings: Tables<"settings">
  }

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const API_KEY = process.env.DEEPINFRA_API_KEY

    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-70B-Instruct",
          messages: messages,
          stream: true,
          top_p: 0.8
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${API_KEY}`
        }
      }
    )

    const stream = OpenAIStream(response)
    // Respond with the stream
    return new StreamingTextResponse(stream)
    //   return new Response("Not implemented")
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Custom API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "Custom API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
