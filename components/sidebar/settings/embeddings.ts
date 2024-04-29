import { supabase } from "@/lib/supabase/browser-client"
import { pipeline } from "@xenova/transformers"
import { FC } from "react"

export const genereateEmbeddings = async () => {
  return true
}

export const updateEmbeddings = async (
  title: string,
  body: string,
  workspace_id: string
) => {
  const generateEmbedding = await pipeline(
    "feature-extraction",
    "Supabase/gte-small"
  )

  //const title = "First post!"
  //const body = "Hello world!"

  // Generate a vector using Transformers.js
  const output = await generateEmbedding(body, {
    pooling: "mean",
    normalize: true
  })

  // Extract the embedding output
  const embedding = Array.from(output.data)

  // Store the vector in Postgres
  const { data, error } = await supabase
    .from("documents")
    .update({
      workspace_id,
      title,
      body,
      embedding
    })
    .eq("workspace_id", workspace_id || "")

  return data
}
export const retrieveEmbedding = async (workspace_id: string) => {
  const { data, error } = await supabase
    .from("documents")
    .select("embedding")
    .eq("workspace_id", workspace_id)
  return data
}
