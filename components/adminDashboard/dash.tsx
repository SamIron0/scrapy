"use client"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import axios from "axios"
import { TablesInsert } from "@/supabase/types"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { urlExists } from "@/db/recipes"

interface Props {}

export default function Dash() {
  const supabase = createClient()
  const router = useRouter()
  const [recipe, setRecipe] = useState({} as TablesInsert<"recipes">)
  const [url, setUrl] = useState("")

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      const session = (await supabase.auth.getSession()).data.session

      if (session?.user.email !== "ekaronke@gmail.com") {
        console.log("session", session?.user.email)
        router.push("/")
      }
    }

    checkUser()
  }, [])

  const handleScrapeUrl = async (url: string) => {
    if (!url) {
      toast.error("Please enter a valid URL")
      return
    }
    const toastId = toast.loading("Scraping...")
    try {
      const endpoint =
        "https://46f5-2604-3d09-aa7a-95e0-5130-b4ed-87b7-557d.ngrok-free.app/scrape"
      const response = await axios.post(endpoint, { url })
      const data = response.data.body
      const recipe: TablesInsert<"recipes"> = {
        id: uuidv4(),
        name: data.name,
        description: data.description,
        ingredients: data.ingredients,
        imgurl: data.imgurl,
        protein: data.protein,
        fats: data.fats,
        carbs: data.carbs,
        calories: data.calories,
        instructions: data.instructions,
        portions: data.portions,
        cooking_time: data.cooking_time,
        url: url
      }

      const createRecipeResponse = await fetch("api/recipe/create_recipe", {
        method: "POST",
        body: JSON.stringify({ recipe: recipe, tags: data.tags, url: url }),
        headers: { "Content-Type": "application/json" }
      })

      if (createRecipeResponse.status === 200) {
        toast.dismiss(toastId)
        setRecipe(recipe)
        toast.success("Recipe scraped successfully")
      } else {
        toast.dismiss(toastId)
        toast.error("Error scraping recipe")
      }
    } catch (error) {
      console.log(error)
      toast.dismiss(toastId)
      toast.error("Error scraping recipe in catch")
    }
  }

  return (
    <div className="my-12 flex w-full flex-col items-center p-4">
      <div className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in">
        <div className="my-12 flex w-full flex-col items-center p-4">
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={"url"}
            style={{ fontSize: "16px" }}
          />
          <Button onClick={() => handleScrapeUrl(url)} className="mt-6 px-20">
            Scrape
          </Button>
        </div>
      </div>
      {recipe ? (
        <div className="mt-8 flex w-full max-w-3xl  flex-col justify-center rounded-md border-2 p-2">
          <div>Name:{recipe.name}</div>
          <div>Description: {recipe.description}</div>
          <ul>
            Ingredients:
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <div> protein:{recipe.protein}</div>
          <div> fats:{recipe.fats}</div>
          <div> carbs:{recipe.carbs}</div>
          <div> calories:{recipe.calories}</div>
          <ul>
            instructions:
            {recipe.instructions?.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <div> portions:{recipe.portions}</div>
          <div> cooking_time:{recipe.cooking_time}</div>
        </div>
      ) : null}
    </div>
  )
}
