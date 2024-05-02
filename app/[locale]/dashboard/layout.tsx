"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { supabase } from "@/lib/supabase/browser-client"
import { LLMID } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"
import { getSchemaByUserId } from "@/db/schema"
import { getApiKeysByUserId } from "@/db/apikeys"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const workspaceId = params.workspaceid as string

  const { setSchema, setApikeys } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  //get user schema

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        await fetchDashboardData(session.user.id)
      }
    })()
  }, [])
  const fetchDashboardData = async (id: string) => {
    setLoading(true)
    setSchema(await getSchemaByUserId(id))
    const apikeys = await getApiKeysByUserId(id)
    setApikeys(apikeys)
    // set api key and schema
    setLoading(false)
  }
  if (loading) {
    return <Loading />
  }

  return <Dashboard>{children}</Dashboard>
}
