import { ChatbotUIContext } from "@/context/context"
import { IconChevronDown } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownOption } from "./dropdown-option"
interface DropDownSelectProps {
  onSelect: (value: string) => void
  selectedValue: any
  values: any[]
}

export const DropDownSelect: FC<DropDownSelectProps> = ({
  onSelect,
  selectedValue,
  values
}) => {
  const { profile, setProfile } = useContext(ChatbotUIContext)

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(selectedValue)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])

  const handleSelectValue = (value: string) => {
    setSelected(value)
    onSelect(value)
    setIsOpen(false)
  }
  if (!profile) return null

  return (
    <>
      {" "}
      <DropdownMenu
        open={isOpen}
        onOpenChange={isOpen => {
          setIsOpen(isOpen)
        }}
      >
        <DropdownMenuTrigger
          className="w-full justify-start border-2 bg-background px-3 py-5"
          asChild
          disabled={false}
        >
          {
            <Button
              ref={triggerRef}
              className="flex items-center justify-between"
              variant="ghost"
            >
              <div className="flex items-center">
                {selected ? (
                  <>
                    <div className="ml-2 flex items-center">{selected}</div>
                  </>
                ) : (
                  <div className="flex items-center">Select Age</div>
                )}
              </div>

              <IconChevronDown />
            </Button>
          }
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="flex flex-col space-y-2 overflow-auto p-2"
          style={{ width: triggerRef.current?.offsetWidth }}
          align="start"
        >
          {values.map(value => (
            <DropdownOption
              key={value}
              value={value}
              onSelect={() => handleSelectValue(value)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
