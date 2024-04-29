import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Slider } from "../ui/slider"
import { set } from "date-fns"

interface MacrosStepProps {
  protein: number
  setProtein: (value: number) => void
  carbs: number
  setCarbs: (value: number) => void
  fat: number
  setFat: (value: number) => void
  calories: number
  setCalories: (value: number) => void
  height: number
  setHeight: (value: number) => void
  weight: number
  setWeight: (value: number) => void
  age: number
  setAge: (value: number) => void
  gender: string
  setGender: (value: string) => void
  activityLevel: number
  setActivityLevel: (value: number) => void
}

export const MacrosStep: FC<MacrosStepProps> = ({
  protein,
  setProtein,
  carbs,
  setCarbs,
  fat,
  setFat,
  calories,
  setCalories,
  height,
  weight,
  setHeight,
  setWeight,
  age,
  setAge,
  gender,
  setGender,
  activityLevel,
  setActivityLevel
}) => {
  const [proteinInGrams, setProteinInGrams] = useState(0)
  const [carbsInGrams, setCarbsInGrams] = useState(0)
  const [fatInGrams, setFatInGrams] = useState(0)

  useEffect(() => {
    setProteinInGrams(Math.round((protein * 0.01 * calories) / 4))
    setCarbsInGrams(Math.round((carbs * 0.01 * calories) / 4))
    setFatInGrams(Math.round((fat * 0.01 * calories) / 9))
  }, [calories])
  const onChangeCarbs = (value: number) => {
    setCarbs(value)
    setCarbsInGrams(Math.round((carbs * 0.01 * calories) / 4))
  }
  const onChangeProtein = (value: number) => {
    setProtein(value)
    setProteinInGrams(Math.round((protein * 0.01 * calories) / 4))
  }
  const onChangeFat = (value: number) => {
    setFat(value)
    setFatInGrams(Math.round((fat * 0.01 * calories) / 9))
  }
  return (
    <div className="mb-4 flex flex-col">
      <div className="space-y-1 ">
        <Label className="flex items-center">
          <div>Calories(kcal): </div>
        </Label>

        <Input
          value={calories}
          onChange={e => setCalories(Number(e.target.value))}
          placeholder="e.g 2000"
          className="text-[16px]"
        />
      </div>

      <div className="mt-5 space-y-2">
        <Label className="flex items-center">
          <div className="mr-2">Protein: {"  "}</div>{" "}
          <div className=" text-sm">{Math.round(proteinInGrams)}g</div>
          <div className="flex w-full justify-end text-sm text-muted-foreground">
            {Math.round(protein)}%
          </div>
        </Label>

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

      <div className=" space-y-2">
        <Label className="flex items-center">
          <div className="mr-2">Carbs: {"  "}</div>{" "}
          <div className=" text-sm">{Math.round(carbsInGrams)}g</div>
          <div className="flex w-full justify-end text-sm text-muted-foreground">
            {Math.round(carbs)}%
          </div>
        </Label>

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
      <div className=" space-y-2">
        <Label className="flex items-center">
          <div className="mr-2">Fats: {"  "}</div>{" "}
          <div className=" text-sm">{Math.round(fatInGrams)}g</div>
          <div className="flex w-full justify-end text-sm text-muted-foreground">
            {Math.round(fat)}%
          </div>
        </Label>

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
    </div>
  )
}
