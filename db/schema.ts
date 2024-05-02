import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getSchemaByUserId = async (userId: string) => {
  const { data: schema, error } = await supabase
    .from("schemas")
    .select("*")
    .eq("uid", userId)

  if (error) {
    throw new Error(error.message)
  }

  return schema[0]
}
export const createOrSaveSchema = async (
  schema: TablesInsert<"schemas">,
  uid: string
) => {
  const { data: existingSchema, error } = await supabase
    .from("schemas")
    .select("*")
    .eq("uid", uid)

  if (error) {
    throw new Error(error.message)
  }

  if (existingSchema[0]) {
    console.log("updating schema")
    // Update the schema if it exists
    const { data, error } = await supabase
      .from("schemas")
      .update({ ...schema })
      .eq("uid", uid)

    if (error) {
      throw new Error(error.message)
    }

    return data
  } else {
    console.log("creating schema")
    // Create the schema if it doesn't exist
    const { data, error } = await supabase
      .from("schemas")
      .insert({ ...schema, uid })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}
