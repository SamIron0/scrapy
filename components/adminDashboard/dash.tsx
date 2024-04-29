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
import { Label } from "../ui/label"
import { TextareaAutosize } from "../ui/textarea-autosize"

interface Props {}

export default function Dash() {
  const supabase = createClient()
  const router = useRouter()
  const [data, setData] = useState({} as any)
  const [variables, setVariables] = useState([])
  const [description, setDescription] = useState("")
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
  const handleScrapeUrl = async (url: string, description = "") => {
    const toastId = toast.loading("Scraping...")
    if (!url) {
      toast.dismiss(toastId)
      toast.error("Please enter a valid URL")
      return
    }
    try {
      const response = await fetch("api/scrape", {
        method: "POST",
        body: JSON.stringify({ url, description })
      })
      const res = await response.json()
      console.log(res)
      setVariables(res)
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
    <div className="my-12 flex w-full flex-col items-center p-6">
      <div className="flex w-full  grid-cols-2 items-center space-x-4 p-4">
        <div className="mb-4 flex w-full  flex-col border-2  p-4">
          <Label className="text-md pt-4" htmlFor="weight">
            Url
          </Label>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full max-w-2xl"
            placeholder={"Enter url"}
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="mb-4 flex w-full flex-col rounded-md border-2 p-4">
          <Label className="text-md pt-8" htmlFor="weight">
            Description (optional)
          </Label>
          <TextareaAutosize
            placeholder={`Improve the accuracy of the scraper by describing the data you want to receive.`}
            value={description}
            onValueChange={value => {
              setDescription(value)
            }}
            minRows={3}
            maxRows={5}
            className="w-full"
          />{" "}
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button className="text-md mt-4 bg-purple-600 px-10 py-3 text-white">
          Scrape
        </Button>
      </div>

      <Label className="flex w-full flex-col pt-8 text-2xl ">Results</Label>
      <div className="w-full max-w-3xl  flex-col justify-center rounded-md border-2 p-2">
        {variables?.map((variable: any) => (
          <div
            key={uuidv4()}
            className="w-full flex-col justify-center rounded-md border-2 p-2"
          >
            {variable}
          </div>
        ))}
      </div>
      {variables?.length > 0 ? (
        <>
          <Button className="mb-3 bg-primary px-6">Get data</Button>
          <div className="mt-8 flex w-full max-w-3xl  flex-col justify-center rounded-md border-2 p-2"></div>
        </>
      ) : null}
    </div>
  )
}
