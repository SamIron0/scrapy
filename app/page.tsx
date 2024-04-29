"use client"
import { ChatInput } from "@/components/chat/chat-input"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import { getGuestForYou } from "@/db/for-you"
import { createClient } from "@/lib/supabase/client"
import { TablesInsert } from "@/supabase/types"
import axios from "axios"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default async function ChatPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const supabase = createClient()

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()
  if (error) {
    console.error("Error getting session:", error)
  } else {
    const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session?.user.id)
      .eq("is_home", true)
      .single()

    if (homeWorkspace) {
      router.push(`/${homeWorkspace.id}/chat`)
    } // Do something with the session
  }
  const recipes = await getGuestForYou()
  return (
    <div className="relative flex h-full flex-col items-center overflow-y-auto px-4 sm:px-6">
      <div className="top-50% left-50%  -translate-x-50% -translate-y-50% mb-9  mt-32">
        <Brand theme={theme === "dark" ? "dark" : "light"} />
      </div>

      <div className="w-full max-w-md items-end  pb-3 pt-0  sm:pb-8 sm:pt-5">
        <ChatInput />
      </div>

      <div className="w-full max-w-4xl py-28">
        <p className="mb-5 text-3xl font-semibold">For You</p>
        <div
          role="status"
          className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {recipes?.map(recipe => (
            <div key={recipe.name} className="flex flex-col ">
              {recipe.imgurl ? (
                <img
                  src={"/images/" + recipe.imgurl}
                  className="border-1 mb-2 w-full rounded-lg border-gray-300 object-cover"
                  alt={recipe.name || "Recipe Image"}
                />
              ) : (
                <div className="border-1 mb-2 rounded-lg border-gray-300 bg-gray-600 p-2 py-10 text-black"></div>
              )}

              <p className="text-md w-full text-left">{recipe.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
