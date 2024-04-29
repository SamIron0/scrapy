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
  const handleScrapeUrl = async () => {
    if (!url) {
      toast.error("Please enter a valid URL")
      return
    }
    const toastId = toast.loading("Scraping...")
    try {
      const data = await fetch(
        "https://e558-2604-3d09-aa7a-95e0-e006-b4c3-7148-61bd.ngrok-free.app/scrape",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url,
            description
          })
        }
      )
      const res = await data.json()

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
      <div className="w-full items-center   space-y-4 md:flex md:space-x-4   md:space-y-0 ">
        <div className=" flex size-full h-[180px] flex-col rounded-lg border-2 p-4 ">
          <Label className="text-md pb-4 pt-8">Url</Label>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full max-w-2xl"
            placeholder={"Enter url"}
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className=" flex h-[180px] w-full flex-col rounded-lg border-2 p-4">
          <Label className="text-md pb-1 pt-8">Description (optional)</Label>
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
        <Button
          onClick={handleScrapeUrl}
          className="text-md mt-4 bg-purple-600 px-10 py-3 text-white"
        >
          Scrape
        </Button>
      </div>

      <Label className="flex w-full flex-col pt-11 text-2xl ">Results</Label>
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
