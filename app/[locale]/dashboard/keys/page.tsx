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

  const handleApiKeyClick = () => {
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
      <div className="flex w-full max-w-3xl flex-col items-center justify-center">
        <p className="mb-2 w-full text-2xl">API KEYS</p>

        <div className="flex  flex-col items-center justify-center rounded-lg border border-input p-4">
          <span className="flex flex-row">
            <p className="mr-6">{apikeys?.id}</p>
            <Button size={"sm"} onClick={handleApiKeyClick}>
              {api_key_copied ? "copied" : "copy"}
            </Button>
          </span>
        </div>
        <p className="mb-2 w-full pt-12  text-2xl">SCHEMA KEYS</p>

        <div className="flex  flex-col items-center justify-center rounded-lg border border-input p-4">
          <span className="flex flex-row">
            <p className="mr-6">{schema?.id}</p>
            <Button
              size={"sm"}
              className="ml-auto"
              onClick={handleCopySchemaClick}
            >
              {schema_key_copied ? "copied" : "copy"}
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}
