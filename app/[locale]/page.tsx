"use client"

import Navbar from "@/components/ui/Navbar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

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
  return (
    <div className="flex w-full  flex-col">
      {" "}
      <Navbar />
      <div className="mt-20 flex max-w-3xl flex-col items-center justify-center p-4 text-4xl md:p-10">
        <p className="text-3xl">Powerful web scraper for developers</p>
        <p className="text-md mt-6 text-zinc-400">
          The best way to get data from any website to your code through an API
        </p>
      </div>
      <Link href="/login" className="mt-8 rounded-lg px-10 ">
        Try it out
      </Link>
    </div>
  )
}
