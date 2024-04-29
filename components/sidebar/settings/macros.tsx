import { FC, useEffect, useState } from "react"
import { Slider } from "../../ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface MacrosProps {
  protein: number
  setProtein: Function
  carbs: number
  setCarbs: Function
  fat: number
  calories: number
  setCalories: Function
  setFat: Function
  workouts: number
  setWorkouts: Function
}
export const Macros: FC<MacrosProps> = ({
  protein,
  setProtein,
  carbs,
  setCarbs,
  fat,
  calories,
  setCalories,
  setFat,
  workouts,
  setWorkouts
}) => {
  const [fatInGram, setFatInGram] = useState(
    Math.round((fat * 0.01 * calories) / 9)
  )
  const [proteinInGram, setProteinInGram] = useState(
    Math.round((protein * 0.01 * calories) / 4)
  )
  const [carbsInGram, setCarbsInGram] = useState(
    Math.round((carbs * 0.01 * calories) / 4)
  )

  useEffect(() => {
    const proteinInGram = (protein * 0.01 * calories) / 4
    setProteinInGram(Math.round(proteinInGram))
    const carbsInGram = (carbs * 0.01 * calories) / 4
    setCarbsInGram(Math.round(carbsInGram))
    const fatInGram = (fat * 0.01 * calories) / 9
    setFatInGram(Math.round(fatInGram))
  }, [calories])
  const onChangeFat = (value: number) => {
    setFat(value)
    const fatInGram = (value * 0.01 * calories) / 9
    setFatInGram(Math.round(fatInGram))
  }
  const onChangeCarbs = (value: number) => {
    setCarbs(value)
    const carbsInGram = (value * 0.01 * calories) / 4
    setCarbsInGram(Math.round(carbsInGram))
  }
  const onChangeProtein = (value: number) => {
    setProtein(value)
    const proteinInGram = (value * 0.01 * calories) / 4
    setProteinInGram(Math.round(proteinInGram))
  }
  return (
    <>
      <div className="mt-6 space-y-1">
        <Label className="flex items-center">
          <div>Calories(kcal): </div>
        </Label>

        <Input
          type="number"
          value={calories}
          onChange={e => setCalories(Number(e.target.value))}
          className="text-[16px]"
        />
      </div>

      <div className="mt-8 space-y-3">
        <div className="mb-1  flex   items-center space-x-1">
          <div className="text-sm font-semibold text-muted-foreground">
            Protein:
          </div>

          <div className=" text-sm">{proteinInGram}g</div>
          <div className="flex w-full justify-end text-sm text-muted-foreground">
            {Math.round(protein)}%
          </div>
        </div>

        <Slider
          value={[protein]}
          onValueChange={values => {
            onChangeProtein(values[0])
          }}
          min={10}
          max={100}
          step={1}
        />
      </div>
      <div className="mt-6 space-y-3">
        <div className="mb-1 flex  items-center  space-x-1">
          <div className="text-sm font-semibold text-muted-foreground">
            Carbs:
          </div>

          <div className=" text-sm">{carbsInGram}g</div>
          <div className="flex w-full justify-end text-sm text-muted-foreground">
            {Math.round(carbs)}%
          </div>
        </div>

        <Slider
          value={[carbs]}
          onValueChange={values => {
            onChangeCarbs(values[0])
          }}
          min={10}
          max={100}
          step={1}
        />
      </div>
      <div className="mt-6 space-y-3">
        <div className="mb-1 flex  items-center  space-x-1">
          <div className="text-sm font-semibold text-muted-foreground">
            Fat:
          </div>

          <div className=" text-sm">{fatInGram}g</div>
          <div className="flex w-full justify-end text-sm text-muted-foreground">
            {Math.round(fat)}%
          </div>
        </div>

        <Slider
          value={[fat]}
          onValueChange={values => {
            onChangeFat(values[0])
          }}
          min={10}
          max={100}
          step={1}
        />
      </div>
      <div className="mt-5 space-y-3">
        <div className="mb-1 flex items-center  space-x-1">
          <div className="text-sm  font-semibold text-muted-foreground">
            Workouts/week:
          </div>{" "}
          <div className=" text-sm">{workouts}</div>
        </div>

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
    </>
  )
}
