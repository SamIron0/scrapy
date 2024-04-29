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
  const [data, setData] = useState({} as any)
  const [variables, setVariables] = useState(data.variables || [])
  const [url, setUrl] = useState("")

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      const session = (await supabase.auth.getSession()).data.session
    }

    checkUser()
  }, [])

  const handleScrapeUrl = async (url: string) => {
    const toastId = toast.loading("Scraping...")
    if (!url) {
      toast.dismiss(toastId)
      toast.error("Please enter a valid URL")
      return
    }
    try {
      const apiKey = "YyUzxAyn6O6r9ZLUgLTLnarp27Rh5WsW5U0XeXhs"
      const apiUrl =
        "https://0dab1tpzjk.execute-api.us-east-1.amazonaws.com/default/scrape"

      const headers = new Headers({
        "Content-Type": "application/json",
        "x-api-key": apiKey
      })

      const data = { url } // replace with your request data

      fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
      toast.dismiss(toastId)
      toast.success("Scraped data: " + JSON.stringify(data))
    } catch (error) {
      console.log(error)
      toast.dismiss(toastId)
      toast.error("Error scraping data in catch")
    }
    toast.dismiss(toastId)
  }

  return (
    <div className="my-12 flex w-full flex-col items-center p-4">
      <div className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in">
        <div className="my-12 flex w-full flex-col items-center p-4">
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full max-w-3xl"
            placeholder={"Enter url"}
            style={{ fontSize: "16px" }}
          />
          <Button onClick={() => handleScrapeUrl(url)} className="mt-6 px-20">
            Scrape
          </Button>
        </div>
      </div>
      {data?.variables ? (
        <>
          <Button className="mb-3 bg-primary px-6">Get data</Button>
          <div className="mt-8 flex w-full max-w-3xl  flex-col justify-center rounded-md border-2 p-2"></div>
        </>
      ) : null}
    </div>
  )
}
