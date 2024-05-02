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

  return (
    <div className="mt-10 flex w-full flex-col items-center  overflow-y-auto p-6 sm:mt-0 sm:p-16">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center">
        <p className="mb-2 w-full text-2xl">API KEYS</p>

        <div className="flex w-full flex-col items-center rounded-lg border border-input p-4">
          <span className="flex flex-row">
            <p className="mr-6">{apikeys?.id}</p>
            <Button size={"sm"} className="ml-auto">
              copy
            </Button>
          </span>
        </div>
        <p className="mb-2 w-full pt-12  text-2xl">SCHEMA KEYS</p>

        <div className="flex w-full flex-col rounded-lg border border-input p-4">
          <span className="flex flex-row">
            <p className=" ">Name</p>
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
