"use client"
import { Key, useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import axios from "axios"
import { TablesInsert } from "@/supabase/types"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { Label } from "../ui/label"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  dark,
  vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism"

interface Props {}

export default function Dash() {
  const supabase = createClient()
  const [data, setData] = useState({} as any)
  const [results, setResults] = useState()
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
  const [isLoading, setIsLoading] = useState(false)
  const handleScrapeUrl = async () => {
    setIsLoading(true)
    if (!url) {
      toast.error("Please enter a valid URL")
      setIsLoading(false)

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

      console.log(res.body)
      setResults(res.body)
      toast.dismiss(toastId)
      setIsLoading(false)

      toast.success("Done")
    } catch (error) {
      console.log(error)
      toast.dismiss(toastId)
      toast.error("Error scraping data in catch")
    }
    toast.dismiss(toastId)
  }
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  const json = JSON.stringify(results, null, 2)

  return (
    <div className="my-12 flex w-full max-w-4xl flex-col items-center p-6">
      <div className="w-full items-center   space-y-4 md:flex md:space-x-4   md:space-y-0 ">
        <div className=" flex size-full h-[180px] flex-col rounded-lg border border-input bg-background p-4 ">
          <Label className="pb-2 text-xl">Enter url</Label>
          <p className="pb-2 text-sm text-zinc-400">
            Enter the url of the website you want to scrape
          </p>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full max-w-2xl"
            placeholder={"https://example.com"}
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className=" flex h-[180px] w-full flex-col rounded-lg border border-input bg-background p-4">
          <Label className="pb-2 text-xl ">Description (optional)</Label>
          <p className="pb-2 text-sm text-zinc-400">
            {" "}
            Describe the data you want to receive
          </p>
          <TextareaAutosize
            placeholder={`Reviews and prices.`}
            value={description}
            onValueChange={value => {
              setDescription(value)
            }}
            minRows={3}
            maxRows={5}
            className="w-full text-[16px]"
          />{" "}
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          disabled={isLoading}
          onClick={handleScrapeUrl}
          className="text-md mt-4 bg-purple-600 px-16 py-3 text-white hover:bg-purple-600/90"
        >
          Scrape
        </Button>
      </div>
      <div className=" mt-16 flex w-full flex-col items-center rounded-lg  border border-input bg-background p-4">
        <div className="flex w-full flex-row items-center justify-between pb-3">
          <Label className="  text-2xl ">Results</Label>
          <label className="themeSwitcherThree relative inline-flex cursor-pointer select-none items-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="sr-only"
            />

            <div className="flex h-[46px] w-[82px] items-center justify-center rounded-md bg-black shadow-card">
              <span
                className={`flex size-9 items-center justify-center rounded ${
                  !isChecked ? "bg-white text-purple-600" : "text-body-color"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 19H16C17.1046 19 18 18.1046 18 17V14.5616C18 13.6438 18.6246 12.8439 19.5149 12.6213L21.0299 12.2425C21.2823 12.1794 21.2823 11.8206 21.0299 11.7575L19.5149 11.3787C18.6246 11.1561 18 10.3562 18 9.43845V5H14"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M10 5H8C6.89543 5 6 5.89543 6 7V9.43845C6 10.3562 5.37541 11.1561 4.48507 11.3787L2.97014 11.7575C2.71765 11.8206 2.71765 12.1794 2.97014 12.2425L4.48507 12.6213C5.37541 12.8439 6 13.6438 6 14.5616V19H10"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </span>
              <span
                className={`flex size-9 items-center justify-center rounded ${
                  isChecked ? "bg-white text-purple-600" : "text-body-color"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.0547 1.67334C8.18372 1.90227 8.16622 2.18562 8.01003 2.39693C7.44055 3.16737 7.16651 4.11662 7.23776 5.07203C7.30901 6.02744 7.72081 6.92554 8.39826 7.60299C9.07571 8.28044 9.97381 8.69224 10.9292 8.76349C11.8846 8.83473 12.8339 8.5607 13.6043 7.99122C13.8156 7.83502 14.099 7.81753 14.3279 7.94655C14.5568 8.07556 14.6886 8.32702 14.6644 8.58868C14.5479 9.84957 14.0747 11.0512 13.3002 12.053C12.5256 13.0547 11.4818 13.8152 10.2909 14.2454C9.09992 14.6756 7.81108 14.7577 6.57516 14.4821C5.33925 14.2065 4.20738 13.5846 3.312 12.6892C2.41661 11.7939 1.79475 10.662 1.51917 9.42608C1.24359 8.19017 1.32569 6.90133 1.75588 5.71038C2.18606 4.51942 2.94652 3.47561 3.94828 2.70109C4.95005 1.92656 6.15168 1.45335 7.41257 1.33682C7.67423 1.31264 7.92568 1.44442 8.0547 1.67334ZM6.21151 2.96004C5.6931 3.1476 5.20432 3.41535 4.76384 3.75591C3.96242 4.37553 3.35405 5.21058 3.00991 6.16334C2.66576 7.11611 2.60008 8.14718 2.82054 9.13591C3.04101 10.1246 3.5385 11.0301 4.25481 11.7464C4.97111 12.4627 5.87661 12.9602 6.86534 13.1807C7.85407 13.4012 8.88514 13.3355 9.8379 12.9913C10.7907 12.6472 11.6257 12.0388 12.2453 11.2374C12.5859 10.7969 12.8536 10.3081 13.0412 9.78974C12.3391 10.0437 11.586 10.1495 10.8301 10.0931C9.55619 9.99813 8.35872 9.44907 7.45545 8.5458C6.55218 7.64253 6.00312 6.44506 5.90812 5.17118C5.85174 4.4152 5.9575 3.66212 6.21151 2.96004Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
          </label>
        </div>

        <div className="h-[600px] w-full max-w-4xl flex-col justify-center overflow-y-auto ">
          {results ? (
            !isChecked ? (
              <SyntaxHighlighter
                className="w-full rounded-lg border border-input"
                language="json"
                style={vscDarkPlus}
              >
                {json}
              </SyntaxHighlighter>
            ) : (
              <div className="bg-black"></div>
            )
          ) : (
            <div className="flex h-[200px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center py-5 text-center">
                <span>☕</span>
                <h3 className="mt-4 text-lg font-semibold">
                  Nothing to see here
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You data will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
