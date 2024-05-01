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

export const createOrSaveSchema = async (
  schema: TablesInsert<"schemas">,
  uid: string
) => {
  const { data: updatedSchema, error } = await supabase
    .from("schemas")
    .select("*")
    .eq("uid", uid)

  if (error) {
    throw new Error(error.message)
  }

  return updatedSchema
}
