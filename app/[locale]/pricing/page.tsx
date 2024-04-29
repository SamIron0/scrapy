import { createClient } from "@/lib/supabase/client"
import { cookies } from "next/headers"
import Offers from "@/components/offers/offers"
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

export default async function Pricing() {
  //const { subscription } = useContext(ChatbotUIContext)
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" })

  return <Offers user={user} products={products} />
}
