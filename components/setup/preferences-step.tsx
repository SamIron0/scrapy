import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC } from "react"
import { Slider } from "../ui/slider"
import { DietSelect } from "../diet/diet-select"
import { DietProvider } from "@/types/diet"

interface PreferencesStepProps {
  allergies: string[]
  setAllergies: (value: string[]) => void
  diet: string
  setDiet: (value: string) => void
  workouts: number
  setWorkouts: (value: number) => void
}

export const PreferencesStep: FC<PreferencesStepProps> = ({
  allergies,
  setAllergies,
  diet,
  setDiet,
  workouts,
  setWorkouts
}) => {
  return (
    <div className="mb-4 flex flex-col">
      <div className=" space-y-1">
        <Label className="flex items-center">
          <div>Diet {"  "}</div>
        </Label>

        <DietSelect onSelect={setDiet} selectedDiet={diet as DietProvider} />
      </div>
      <div className="space-y-1 py-2">
        <Label className="mb-3 flex items-center">
          <div className="mr-2">Workouts: {"  "}</div>
          <div className="text-muted-foreground">{workouts} / week</div>
        </Label>

        <Slider
          value={[workouts]}
          onValueChange={values => {
            setWorkouts(values[0])
          }}
          min={0}
          max={7}
          step={1}
        />
      </div>
      <div className=" space-y-1">
        <Label className="flex items-center">
          <div>Allergies(comma separated)</div>
        </Label>

        <Input
          value={allergies}
          onChange={e => setAllergies(e.target.value.split(","))}
          placeholder="eg. milk, eggs, nuts"
          className="text-[16px]"
        />
      </div>
    </div>
  )
}
