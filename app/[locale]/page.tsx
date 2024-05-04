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
    <div className="flex w-full flex-col items-center">
      {" "}
      <Navbar />
      <div className="mt-28 flex max-w-3xl flex-col items-center justify-center p-4 sm:mt-24 md:p-10">
        <p className="text-5xl">Powerful web scraper for developers</p>
        <p className=" mt-6 text-zinc-400">
          The best way to get data from any website to your code through an API
        </p>
        <Link
          href={"/login"}
          className="group mt-6 flex scale-100 items-center justify-center rounded-md bg-[#f5f7f9] px-10 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline transition-all duration-75 active:scale-95"
          style={{
            boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724"
          }}
        >
          {" "}
          Try it out
        </Link>
      </div>
    </div>
  )
}
