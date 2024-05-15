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
      {/* Hero content */}
      <div className="mt-28 flex max-w-3xl flex-col items-center justify-center p-4 sm:mt-24 md:p-10">
        {/* Section header */}
        <div className="pb-12 text-center md:pb-16">
          <h1
            className="leading-tighter mb-6 text-5xl font-extrabold tracking-tighter text-white md:text-6xl"
            data-aos="zoom-y-out"
          >
            <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text pr-2 text-transparent">
              Powerful
            </span>
            web scraper for developers
          </h1>
          <div className="mx-auto max-w-3xl">
            <p
              className="mb-8 text-xl text-zinc-400"
              data-aos="zoom-y-out"
              data-aos-delay="150"
            >
              The best way to get data from any website to your code through an
              API
            </p>{" "}
          </div>
        </div>
        <Link
          href={"/login"}
          className="group mt-6 flex scale-100 items-center justify-center rounded-md bg-[#f5f7f9] px-20 py-3 text-lg font-semibold text-[#1E2B3A] no-underline transition-all duration-75 active:scale-95"
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
