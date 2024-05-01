import { Tables } from "@/supabase/types"
import {
  ChatFile,
  ChatMessage,
  ChatSettings,
  LLM,
  MessageImage,
  OpenRouterLLM,
  WorkspaceImage
} from "@/types"
import { AssistantImage } from "@/types/images/assistant-image"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { Dispatch, SetStateAction, createContext } from "react"
import { number } from "zod"

interface ChatbotUIContext {
  // PROFILE STORE
  profile: Tables<"profiles"> | null
  setProfile: Dispatch<SetStateAction<Tables<"profiles"> | null>>
  schema: Tables<"schemas"> | null
  setSchema: Dispatch<SetStateAction<Tables<"schemas"> | null>>
  apikeys: Tables<"apikeys"> | null
  setApikeys: Dispatch<SetStateAction<Tables<"apikeys"> | null>>
}

export const ChatbotUIContext = createContext<ChatbotUIContext>({
  // PROFILE STORE
  profile: null,
  setProfile: () => {},
  schema: null,
  setSchema: () => {},
  apikeys: null,
  setApikeys: () => {}
})
