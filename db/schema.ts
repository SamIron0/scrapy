import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getSchemaByUserId = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from("schemas")
    .select("*")
    .eq("user_id", userId)

  if (!profile) {
    throw new Error(error.message)
  }

  return profile
}

export const updateSchema = async (
  schemaId: string,
  schema: TablesUpdate<"schemas">
) => {
  const { data: updatedProfile, error } = await supabase
    .from("schemas")
    .update(schema)
    .eq("id", schemaId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedProfile
}
