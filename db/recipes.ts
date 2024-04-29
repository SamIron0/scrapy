import { createClient } from "@/lib/supabase/client"
import { TablesInsert } from "@/supabase/types"
import { v4 as uuidv4 } from "uuid"

export const createRecipe = async (
  recipes: TablesInsert<"recipes">,
  tags: string[]
) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      id: recipes.id || uuidv4(),
      name: recipes.name,
      description: recipes.description,
      ingredients: recipes.ingredients,
      cooking_time: recipes.cooking_time,
      imgurl: recipes.imgurl,
      protein: recipes.protein,
      fats: recipes.fats,
      carbs: recipes.carbs,
      calories: recipes.calories,
      instructions: recipes.instructions,
      portions: recipes.portions,
      url: recipes.url
    })
    .select("*")

  const res = data ? [0] : null
  for (var i = 0; i < tags.length; i++) {
    const { data, error } = await supabase
      .from("recipe_tags")
      .select("recipes,id")
      .eq("name", tags[i])

    if (data && data?.length > 0) {
      // const recipeArr: string[] = data[0].recipes
      data[0].recipes.push(recipes.id)
      const { data: updateData, error: updateError } = await supabase
        .from("recipe_tags")
        .update({ recipes: data[0].recipes })
        .eq("id", data[0].id)

      if (updateError) {
        throw new Error(updateError.message)
      }
      //console.log("data: " + updateData)
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from("recipe_tags")
        .insert({ name: tags[i], id: uuidv4(), recipes: [recipes.id] })
    }
  }

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const getRecipesByTags = async (tags: string[]) => {
  console.log("tags: " + tags)
  const supabase = createClient()
  const recipeIds: any[] = [] // use a Set to ensure uniqueness
  const recipes: any[] = []

  for (var i = 0; i < tags.length; i++) {
    const { data: tagData, error } = await supabase
      .from("recipe_tags")
      .select("recipes")
      .eq("name", tags[i])

    if (error) {
      throw new Error(error.message)
    }
    // append recipe id to recipeIds set

    if (tagData && tagData[0]) {
      tagData[0].recipes.forEach((id: number) => recipeIds.push(id))
    }
  }
  const ids = most_common_recipes(recipeIds)

  //console.log("retrieving recipes...")
  // retrieve recipes for each unique id
  for (const id of ids) {
    const { data: recipeData, error } = await supabase
      .from("recipes")
      .select("id,imgurl,name")
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }
    if (recipeData[0]?.id) {
      const result: TablesInsert<"recipes"> = {
        id: recipeData[0].id,
        name: recipeData[0].name,
        imgurl: recipeData[0].imgurl,
        description: null,
        ingredients: null,
        cooking_time: null,
        protein: null,
        fats: null,
        carbs: null,
        calories: null,
        instructions: null,
        portions: null,
        url: null
      }

      recipes.push(result)
    }
  }

  return recipes
}
const most_common_recipes = (recipes_list: string[]) => {
  const recipe_count: { [key: string]: number } = {}
  for (let recipe of recipes_list) {
    if (recipe_count[recipe]) {
      recipe_count[recipe] += 1
    } else {
      recipe_count[recipe] = 1
    }
  }
  const sorted_recipes = Object.keys(recipe_count).sort(
    (a, b) => recipe_count[b] - recipe_count[a]
  )
  console.log("sorted_recipes: " + sorted_recipes)
  return sorted_recipes
}

export const getCompleteRecipe = async (recipe: TablesInsert<"recipes">) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "description,ingredients,cooking_time,protein,fats,carbs,calories,instructions,portions,url"
    )
    .eq("id", recipe.id)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  const result: TablesInsert<"recipes"> = {
    id: recipe.id,
    name: recipe.name,
    description: data.description,
    ingredients: data.ingredients,
    cooking_time: data.cooking_time,
    imgurl: recipe.imgurl,
    protein: data.protein,
    fats: data.fats,
    carbs: data.carbs,
    calories: data.calories,
    instructions: data.instructions,
    portions: data.portions,
    url: data.url
  }

  return result
}
export const urlExists = async (url: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("recipes")
    .select("url")
    .eq("url", url)
  if (error) {
    throw new Error(error.message)
  }
  return data[0]?.url === url
}
