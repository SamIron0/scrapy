import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { SIDEBAR_WIDTH } from "../ui/dashboard"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"

interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
  const { folders, chats, presets, calculator } = useContext(ChatbotUIContext)

  const presetFolders = folders.filter(folder => folder.type === "presets")
  const calculatorFolders = folders.filter(
    folder => folder.type === "calculator"
  )

  const renderSidebarContent = (
    contentType: ContentType,
    folders: Tables<"folders">[],
    data?: any[]
  ) => {
    return (
      <SidebarContent
        contentType={contentType}
        data={data || []}
        folders={folders}
      />
    )
  }

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
            case "presets":
              return renderSidebarContent("presets", presetFolders, presets)

            case "calculator":
              return renderSidebarContent("calculator", calculatorFolders)

            default:
              return null
          }
        })()}
      </div>
    </TabsContent>
  )
}
