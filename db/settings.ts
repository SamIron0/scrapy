import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getSettingsById = async (settingsId: string) => {
  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", settingsId)
    .single()

  if (!settings) {
    throw new Error(error.message)
  }

  return settings
}

export const getSettingsByWorkspaceId = async (workspaceId: string) => {
  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .eq("workspace_id", workspaceId)
  if (!settings) {
    throw new Error(error.message)
  }

  return settings[0]
}

export const getSettingsWorkspacesBySettingsId = async (settingsId: string) => {
  const { data: settings, error } = await supabase
    .from("settings")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", settingsId)
    .single()

  if (!settings) {
    throw new Error(error.message)
  }

  return settings
}

export const updateSettings = async (
  settingsId: string,
  settings: TablesUpdate<"settings">
) => {
  const { data: updatedSettings, error } = await supabase
    .from("settings")
    .update(settings)
    .eq("id", settingsId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedSettings
}
