import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { SIDEBAR_WIDTH } from "../ui/dashboard"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"
import api from "gpt-tokenizer/encoding/cl100k_base"
import { useRouter } from "next/navigation"

interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
  const router = useRouter()
  return (
    <TabsContent
      className="m-0 w-full space-y-2"
      style={{
        // Sidebar - SidebarSwitcher
        minWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        maxWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        width: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px"
      }}
      value={contentType}
    >
      <div className="flex h-full flex-col p-3">
        {(() => {
          switch (contentType) {
            case "schema":
              router.push("/dashboard/schema")
            case "apikeys":
              router.push("/dashboard/apikeys")
            case "dash":
              router.push("/dashboard")
            default:
              return null
          }
        })()}
      </div>
    </TabsContent>
  )
}
