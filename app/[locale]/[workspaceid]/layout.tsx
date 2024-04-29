"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantWorkspacesByWorkspaceId } from "@/db/assistants"
import { getChatsByWorkspaceId } from "@/db/chats"

import { getCollectionWorkspacesByWorkspaceId } from "@/db/collections"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"
import { getFoldersByWorkspaceId } from "@/db/folders"
import { getModelWorkspacesByWorkspaceId } from "@/db/models"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { getAssistantImageFromStorage } from "@/db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "@/db/tools"
import { getWorkspaceById } from "@/db/workspaces"
import { getSettingsByWorkspaceId } from "@/db/settings"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { supabase } from "@/lib/supabase/browser-client"
import { LLMID } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"
import { stripIndent, oneLine } from "common-tags"
import { TablesUpdate } from "@/supabase/types"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const workspaceId = params.workspaceid as string

  const {
    setChatSettings,
    setAssistants,
    setSubscription,
    setAssistantImages,
    setChats,
    setSettings,
    setCollections,
    setFolders,
    setFiles,
    setPresets,
    setPrompts,
    setTools,
    setModels,
    selectedWorkspace,
    setSelectedWorkspace,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatFiles,
    setChatImages,
    setNewMessageFiles,
    setNewMessageImages,
    setShowFilesDisplay,
    isGenerating
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        await fetchWorkspaceData(workspaceId)
      }
    })()
  }, [])

  const fetchWorkspaceData = async (workspaceId: string) => {
    //!isGenerating ? setLoading(true) : null

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .maybeSingle()

    if (error) {
      console.log(error)
    }
    if (subscription) {
      console.log(subscription)
      const sub = setSubscription(subscription)
    }
    const workspace = await getWorkspaceById(workspaceId)
    setSelectedWorkspace(workspace)

    const chats = await getChatsByWorkspaceId(workspaceId)
    setChats(chats)

    const settings = await getSettingsByWorkspaceId(workspaceId)
    setSettings(settings)

    const collectionData =
      await getCollectionWorkspacesByWorkspaceId(workspaceId)
    setCollections(collectionData.collections)

    const folders = await getFoldersByWorkspaceId(workspaceId)
    setFolders(folders)

    const fileData = await getFileWorkspacesByWorkspaceId(workspaceId)
    setFiles(fileData.files)

    const presetData = await getPresetWorkspacesByWorkspaceId(workspaceId)
    setPresets(presetData.presets)

    const promptData = await getPromptWorkspacesByWorkspaceId(workspaceId)
    setPrompts(promptData.prompts)

    const toolData = await getToolWorkspacesByWorkspaceId(workspaceId)
    setTools(toolData.tools)

    const modelData = await getModelWorkspacesByWorkspaceId(workspaceId)
    setModels(modelData.models)

    const updatedSettings: TablesUpdate<"settings"> = {
      ...settings,
      protein: Math.round((settings.protein * 0.01 * settings.calories) / 4),
      fat: Math.round((settings.fat * 0.01 * settings.calories) / 9),
      carbs: Math.round((settings.carbs * 0.01 * settings.calories) / 4) //+ settings.carbs * 0.01 * settings.calories
    }
    const default_prompt = stripIndent`${oneLine`
    You are a very enthusiastic conversational fitness assistant who loves
    to help people! Given the following context about the user and all previous
    chat messages, continue the conversation.
    If you are asked questions not relating to fitness, say
    "Sorry, I don't know how to help with that." DO NOT MENTION THIS CONTEXT IN YOUR ANSWER.
    
    Context sections:
    ${JSON.stringify(updatedSettings)}`}`

    setChatSettings({
      model: (workspace?.default_model || "gpt-4-1106-preview") as LLMID,
      prompt: default_prompt,
      temperature: workspace?.default_temperature || 0.5,
      contextLength: workspace?.default_context_length || 4096,
      includeProfileContext: workspace?.include_profile_context || true,
      includeWorkspaceInstructions:
        workspace?.include_workspace_instructions || true,
      embeddingsProvider:
        (workspace?.embeddings_provider as "openai" | "local") || "openai",
      contextIsOutdated: false
    })

    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  return <Dashboard>{children}</Dashboard>
}
