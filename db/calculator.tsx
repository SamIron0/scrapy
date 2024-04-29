import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getCalculatorById = async (presetId: string) => {
  const { data: calculator, error } = await supabase
    .from("calculator")
    .select("*")
    .eq("id", presetId)
    .single()

  if (!calculator) {
    throw new Error(error.message)
  }

  return calculator
}
export const getCalculatorWorkspacesByCalculatorId = async (
  presetId: string
) => {
  const { data: calculator, error } = await supabase
    .from("calculator")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", presetId)
    .single()

  if (!calculator) {
    throw new Error(error.message)
  }

  return calculator
}

export const createCalculator = async (
  calculator: TablesInsert<"calculator">,
  workspace_id: string
) => {
  const { data: createdCalculator, error } = await supabase
    .from("calculator")
    .insert([calculator])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createCalculatorWorkspace({
    user_id: calculator.user_id,
    preset_id: createdCalculator.id,
    workspace_id: workspace_id
  })

  return createdCalculator
}

export const createCalculatorWorkspace = async (item: {
  user_id: string
  preset_id: string
  workspace_id: string
}) => {
  const { data: createdCalculatorWorkspace, error } = await supabase
    .from("preset_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdCalculatorWorkspace
}

export const createWorkspaces = async (
  items: { user_id: string; preset_id: string; workspace_id: string }[]
) => {
  const { data: createdCalculatorWorkspaces, error } = await supabase
    .from("preset_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdCalculatorWorkspaces
}

export const updateCalculator = async (
  presetId: string,
  calculator: TablesUpdate<"calculator">
) => {
  const { data: updatedCalculator, error } = await supabase
    .from("calculator")
    .update(calculator)
    .eq("id", presetId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedCalculator
}

export const deleteCalculator = async (presetId: string) => {
  const { error } = await supabase
    .from("calculator")
    .delete()
    .eq("id", presetId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deleteCalculatorWorkspace = async (
  presetId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("preset_workspaces")
    .delete()
    .eq("preset_id", presetId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}
