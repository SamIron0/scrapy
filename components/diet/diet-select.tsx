import { ChatbotUIContext } from "@/context/context"
import { DietProvider } from "@/types/diet"
import { IconChevronDown } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { DietIcon } from "./diet-icon"
import { DietOption } from "./diet-option"

interface DietSelectProps {
  onSelect: (diet: DietProvider) => void
  selectedDiet: DietProvider
}

export const DietSelect: FC<DietSelectProps> = ({ onSelect, selectedDiet }) => {
  const { profile, setProfile } = useContext(ChatbotUIContext)

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<DietProvider>(selectedDiet)
  const diets: DietProvider[] = [
    "anything",
    "paleo",
    "vegan",
    "gluten-free",
    "ketogenic",
    "pescatarian",
    "mediterranean",
    "vegetarian"
  ]
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])

  const handleSelectDiet = (diet: DietProvider) => {
    setSelected(diet)
    onSelect(diet)
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
          className="bg-background w-full justify-start border-2 px-3 py-5"
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
                    <DietIcon provider={selected} />
                    <div className="ml-2 flex items-center">{selected}</div>
                  </>
                ) : (
                  <div className="flex items-center">Select a diet</div>
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
          {diets.map(diet => (
            <DietOption
              key={diet}
              diet={diet}
              onSelect={() => handleSelectDiet(diet)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
