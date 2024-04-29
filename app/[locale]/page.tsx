"use client"
import Dash from "@/components/adminDashboard/dash"
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
  const supabase = createClient()

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()
  if (error) {
    console.error("Error getting session:", error)
  } else {
  }
  return <Dash />
}
