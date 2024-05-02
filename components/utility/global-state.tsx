// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId } from "@/db/profile"
import { supabase } from "@/lib/supabase/browser-client"
import { Tables } from "@/supabase/types"
import { FC, useEffect, useState } from "react"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  // PROFILE STORE
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null)
  const [schema, setSchema] = useState<Tables<"schemas"> | null>(null)
  const [apikeys, setApikeys] = useState<Tables<"apikeys"> | null>(null)

  useEffect(() => {
    ;(async () => {
      const profile = await fetchStartingData()
    })()
  }, [])

  const fetchStartingData = async () => {
    const session = (await supabase.auth.getSession()).data.session

    if (session) {
      const user = session.user

      const profile = await getProfileByUserId(user.id)
      setProfile(profile)

      return profile
    }
  }

  return (
    <ChatbotUIContext.Provider
      value={{
        profile,
        setProfile,
        schema,
        setSchema,
        apikeys,
        setApikeys
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  )
}
