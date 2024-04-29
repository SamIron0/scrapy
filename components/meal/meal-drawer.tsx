"use client"
import { IconSend } from "@tabler/icons-react"
import { Button } from "../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer"
import { cn } from "@/lib/utils"
import { Brand } from "../ui/brand"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { getCompleteRecipe } from "@/db/recipes"
import { ChatbotUIContext } from "@/context/context"
import { TablesInsert } from "@/supabase/types"

interface MealDrawerProps {
  children?: React.ReactNode
  recipe?: any
  isOpen?: string
}
export const MealDrawer = ({ children, recipe, isOpen }: MealDrawerProps) => {
  //get full recipe

  const { generatedRecipes, setGeneratedRecipes } = useContext(ChatbotUIContext)
  const [updatedRecipe, setUpdatedRecipe] =
    useState<TablesInsert<"recipes">>(recipe)
  useEffect(() => {
    //console.log(recipe.id)

    if (isOpen !== recipe.id) return
    console.log("after", recipe.id)
    console.log(isOpen)
    const getRecipe = async () => {
      const completeRecipe: TablesInsert<"recipes"> =
        await getCompleteRecipe(recipe)
      const updatedGeneratedRecipes = generatedRecipes.map(r =>
        r.id === recipe.id ? completeRecipe : r
      )
      setGeneratedRecipes(updatedGeneratedRecipes as any)
      setUpdatedRecipe(completeRecipe)
    }
    getRecipe()
  }, [isOpen])

  return (
    <Drawer>
      <DrawerTrigger className="flex justify-center  ">
        {" "}
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex h-[70vh] flex-col overflow-y-auto">
          <div className="mt-8 flex w-full flex-col p-6 ">
            <div className="w-full justify-end">
              <img
                src={"/images/" + updatedRecipe.imgurl}
                className="mb-2 w-1/2 rounded-lg object-cover"
                alt={updatedRecipe.name || "updatedRecipe Image"}
              />
            </div>
            <div className="w-full">
              <p className="pb-3 text-3xl font-semibold">
                {updatedRecipe.name}
              </p>
              <p className="text-md">{updatedRecipe.description}</p>
            </div>
            <div className="w-full">
              <p className="text-2xl font-semibold">Ingredients</p>
              <div className="w-full">
                {updatedRecipe?.ingredients?.map(
                  (ingredient: any, index: number) => (
                    <div
                      key={index}
                      className="text-md flex w-full items-center justify-between"
                    >
                      <p>•{ingredient}</p>
                    </div>
                  )
                )}
              </div>

              <h2 className="pt-3 text-2xl font-semibold">Directions</h2>
              <ul className="w-full">
                {updatedRecipe?.instructions?.map(
                  (direction: any, index: number) => (
                    <li
                      key={index}
                      className="text-md flex w-full items-center justify-between"
                    >
                      •{direction}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="flex flex-row items-center pt-3">
              <h2 className=" text-2xl font-semibold">Nutrition Facts</h2>
              <p className="text-md pl-1">(per serving)</p>
            </div>
            <div className="w-full space-y-2 pb-6">
              <p className="text-md flex w-full items-center justify-between">
                Protein: {updatedRecipe.protein}g
              </p>
              <p className=" text-md flex w-full items-center justify-between">
                Fat: {updatedRecipe.fats}g
              </p>
              <p className="text-md flex w-full items-center justify-between">
                Carbs: {updatedRecipe.carbs}g
              </p>
              <p className="text-md flex w-full items-center justify-between">
                Calories: {recipe.calories}kcal
              </p>
            </div>
          </div>
          <DrawerTrigger className="mb-12 flex items-center justify-center p-6 ">
            {" "}
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DrawerTrigger>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
