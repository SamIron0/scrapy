"use client"
import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

import { createClient } from "@/lib/supabase/client"

import { useRouter } from "next/navigation"
import { ChatbotUIContext } from "@/context/context"

interface Props {}

export default function ApiKeys() {
  const supabase = createClient()
  const { apikeys, schema } = useContext(ChatbotUIContext)
  const [copied, setCopied] = useState(false)

  const router = useRouter()
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      const session = (await supabase.auth.getSession()).data.session
      if (!session) {
        return router.push("/login")
      }
    }

    checkUser()
  }, [])

  const handleCopyClick = () => {
    if (apikeys) {
      navigator.clipboard
        .writeText(apikeys.id.toString())
        .then(() => {
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 1000)
        })
        .catch(error => {
          console.error("Error copying text to clipboard:", error)
        })
    }
  }

  return (
    <div className="mt-10 flex w-full flex-col items-center  overflow-y-auto p-6 sm:mt-0 sm:p-16">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center">
        <p className="mb-2 w-full text-2xl">API KEYS</p>

        <div className="flex  flex-col items-center justify-center rounded-lg border border-input p-4">
          <span className="flex flex-row">
            <p className="mr-6">{apikeys?.id}</p>
            <svg
              fill={copied ? "#66d37e" : "none"}
              stroke={copied ? "currentColor" : "none"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              onClick={handleCopyClick}
            >
              <path
                d="M11 9 H20 A2 2 0 0 1 22 11 V20 A2 2 0 0 1 20 22 H11 A2 2 0 0 1 9 20 V11 A2 2 0 0 1 11 9 z"
                className={copied ? "copied" : ""}
              />
              <path
                d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                opacity={copied ? 0.5 : 1}
                className={copied ? "copied" : ""}
              />
            </svg>
          </span>
        </div>
        <p className="mb-2 w-full pt-12  text-2xl">SCHEMA KEYS</p>

        <div className="flex  flex-col items-center justify-center rounded-lg border border-input p-4">
          <span className="flex flex-row">
            <p className="mr-6">{schema?.id}</p>
            <Button size={"sm"} className="ml-auto">
              copy
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}
