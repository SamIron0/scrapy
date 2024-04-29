"use client"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import {
  IconBolt,
  IconCirclePlus,
  IconPlayerStopFilled,
  IconSend
} from "@tabler/icons-react"
import Image from "next/image"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { ChatCommandInput } from "./chat-command-input"
import { ChatFilesDisplay } from "./chat-files-display"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { useChatHistoryHandler } from "./chat-hooks/use-chat-history"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { useSelectFileHandler } from "./chat-hooks/use-select-file-handler"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LoginDrawer } from "../login/login-drawer"
interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = ({}: ChatInputProps) => {
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)
  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
      } else {
        setSession(session)
        // Do something with the session
      }
    }

    getSession()
  }, []) // Run the effect only once, when the component mounts

  const { t } = useTranslation()

  const [isTyping, setIsTyping] = useState<boolean>(false)

  const {
    userInput,
    isGenerating,
    setIsGenerating,
    setUserInput,
    setGeneratedRecipes
  } = useContext(ChatbotUIContext)

  const { chatInputRef, handleStopMessage } = useChatHandler()
  const [input, setInput] = useState<string>("")
  const generateMeals = async () => {
    setIsGenerating(true)
    const recipes = await fetch("/api/recipe/get_recipes", {
      method: "POST",
      body: JSON.stringify({ input: userInput })
    })

    if (!recipes.ok) {
      console.error("Error retrieving:", recipes)
    }
    setGeneratedRecipes(await recipes.json())
    setIsGenerating(false)
  }
  const handleInputChange = (value: string) => {
    setInput(value)
    setUserInput(value)
  }
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center gap-2">
        <ChatFilesDisplay />
      </div>

      <div className="relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2 border-input">
        <div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
          <ChatCommandInput />
        </div>
        <TextareaAutosize
          textareaRef={chatInputRef}
          className="text-md flex w-full resize-none rounded-md border-none bg-transparent py-2 pl-3 pr-14 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={t(
            // `Ask anything. Type "@" for assistants, "/" for prompts, "#" for files, and "!" for tools.`
            `Asian Dinner ideas`
          )}
          onValueChange={handleInputChange}
          value={input}
          minRows={1}
          maxRows={18}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-3 flex cursor-pointer justify-center hover:opacity-50">
          {isGenerating ? (
            <IconPlayerStopFilled
              className="animate-pulse rounded bg-transparent p-1 hover:bg-background"
              onClick={handleStopMessage}
              size={30}
            />
          ) : session ? (
            <IconSend
              className={cn(
                "rounded bg-primary p-1 text-secondary",
                !userInput ? "cursor-not-allowed opacity-50" : ""
              )}
              onClick={() => {
                if (!userInput) {
                  return
                }
                generateMeals()
              }}
              size={30}
            />
          ) : (
            <LoginDrawer>
              {" "}
              <IconSend
                className={cn("rounded bg-primary p-1 text-secondary")}
                size={30}
              />
            </LoginDrawer>
          )}{" "}
        </div>
      </div>
    </>
  )
}
