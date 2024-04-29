import { LLM } from "@/types"
import { FC } from "react"
import { DietIcon } from "./diet-icon"
import { IconInfoCircle } from "@tabler/icons-react"
import { WithTooltip } from "../ui/with-tooltip"
import { DietProvider } from "@/types/diet"

interface DietOptionProps {
  diet: string
  onSelect: () => void
}

export const DietOption: FC<DietOptionProps> = ({ diet, onSelect }) => {
  return (
    <WithTooltip
      display={<></>}
      side="bottom"
      trigger={
        <div
          className="hover:bg-accent flex w-full cursor-pointer justify-start space-x-3 truncate rounded p-2 hover:opacity-50"
          onClick={onSelect}
        >
          <div className="flex items-center space-x-2">
            <DietIcon provider={diet as DietProvider} />
            <div className="text-sm font-semibold">{diet}</div>
          </div>
        </div>
      }
    />
  )
}
