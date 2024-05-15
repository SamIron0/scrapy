"use client"
import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

import { createClient } from "@/lib/supabase/client"

import { useRouter } from "next/navigation"
import { ChatbotUIContext } from "@/context/context"
import { toast } from "sonner"

interface Props {}

export default function ApiKeys() {
  const supabase = createClient()
  const { apikeys, schema } = useContext(ChatbotUIContext)
  const [api_key_copied, set_api_key_copied] = useState(false)
  const [schema_key_copied, setSchema_key_copied] = useState(false)
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

  const handleCopyApiKeyClick = () => {
    if (apikeys) {
      navigator.clipboard
        .writeText(apikeys.id.toString())
        .then(() => {
          toast.success("Copied to clipboard")
          set_api_key_copied(true)
          setTimeout(() => {
            set_api_key_copied(false)
          }, 1000)
        })
        .catch(error => {
          console.error("Error copying text to clipboard:", error)
        })
    }
  }
  const handleCopySchemaClick = () => {
    if (schema) {
      navigator.clipboard
        .writeText(schema.id.toString())
        .then(() => {
          toast.success("Copied to clipboard")
          setSchema_key_copied(true)
          setTimeout(() => {
            setSchema_key_copied(false)
          }, 1000)
        })
        .catch(error => {
          console.error("Error copying text to clipboard:", error)
        })
    }
  }
  return (
    <div className="mt-10 flex w-full flex-col items-center  overflow-y-auto p-6 sm:mt-0 sm:p-16">
      <div className="flex w-full max-w-3xl flex-col p-2 ">
        <p className="mb-2 w-full text-2xl">API KEYS</p>

        <div className="flex w-full max-w-xl flex-row items-center justify-center rounded-lg border border-input p-2">
          <p className="mr-6">{apikeys?.id}</p>
          <div className="relative">
            <button className=" p-2" onClick={handleCopyApiKeyClick}>
              {api_key_copied ? (
                <svg
                  className="size-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="size-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />{" "}
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}{" "}
            </button>
          </div>
        </div>
        <p className="mb-2 w-full pt-12  text-2xl">SCHEMA ID</p>
        <div className="flex w-full max-w-xl flex-row items-center justify-center rounded-lg border border-input p-2">
          {schema?.id ? (
            <div className="flex w-full max-w-xl flex-row items-center justify-center rounded-lg border border-input p-2">
              <p className="mr-6">{schema?.id}</p>
              <div className="relative">
                <button className="p-2" onClick={handleCopySchemaClick}>
                  {schema_key_copied ? (
                    <svg
                      className="size-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="size-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      />{" "}
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}{" "}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full max-w-xl flex-row items-center justify-center rounded-lg border border-input p-2">
              <p> Auto generated when you save a schema</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
