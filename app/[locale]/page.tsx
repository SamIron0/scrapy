"use client"

import Navbar from "@/components/ui/Navbar"
import { createClient } from "@/lib/supabase/client"

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
  return
}
