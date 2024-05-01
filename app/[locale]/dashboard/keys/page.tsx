"use client"
import { Key, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { TablesInsert } from "@/supabase/types"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { Label } from "@/components/ui/label"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  dark,
  vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism"
import { useRouter } from "next/navigation"

interface Props {}

export default function ApiKeys() {
  const supabase = createClient()
  const [data, setData] = useState({} as any)
  const [results, setResults] = useState()
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
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
    <div className="flex w-full flex-col items-center overflow-y-auto p-16">
      API KEYS
    </div>
  )
}
