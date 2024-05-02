import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getApiKeysByUserId = async (userId: string) => {
  const { data: keys, error } = await supabase
    .from("apikeys")
    .select("*")
    .eq("uid", userId)

  if (error) {
    throw new Error(error.message)
  }

  return keys[0]
}
