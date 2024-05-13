"use client"
import { Key, useContext, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Tables, TablesInsert } from "@/supabase/types"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { Label } from "@/components/ui/label"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  dark,
  vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism"
import { useRouter } from "next/navigation"
import { ChatbotUIContext } from "@/context/context"
import { createOrSaveSchema } from "@/db/schema"
import hljs from "highlight.js/lib/core"
import javascript from "highlight.js/lib/languages/javascript"

// Then register the languages you need
hljs.registerLanguage("javascript", javascript)
interface Props {}

function replaceInnermostValuesWithNull(json: any): any {
  if (Array.isArray(json)) {
    return json.map(replaceInnermostValuesWithNull)
  } else if (typeof json === "object") {
    for (const key in json) {
      if (typeof json[key] === "object" || Array.isArray(json[key])) {
        json[key] = replaceInnermostValuesWithNull(json[key])
      } else {
        json[key] = null
      }
    }
    return json
  } else {
    return null
  }
}

export default function Dash() {
  const supabase = createClient()
  const { schema, setSchema } = useContext(ChatbotUIContext)
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState(schema?.url || "")
  const [uid, setUid] = useState("")
  const router = useRouter()
  const [schema_json_copied, setSchema_json_copied] = useState(false)
  const [api_call_copied, setApi_call_copied] = useState(false)

  const js_api_code = `
    fetch(
      "https://db90-142-165-127-227.ngrok-free.app/scrape",
      {
        method: "POST",
        headers: {
          "X-API-KEY": "<API_KEY>",
          "Content-Type": "application/json"
        },
        body:  JSON.stringify({
          keys: ${Object.keys(schema?.json || [])[1]},
          schema_id: "<SCHEMA_ID>"
        })
      }
    )
  `
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      const session = (await supabase.auth.getSession()).data.session
      if (!session) {
        return router.push("/login")
      }
      setUid(session.user?.id)
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
        "https://db90-142-165-127-227.ngrok-free.app/getSchema",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "b16d92ad-f340-4f45-a27e-98e0570fad8e"
          },
          body: JSON.stringify({
            url,
            description
          })
        }
      )
      const res = await data.json()

      console.log()
      toast.dismiss(toastId)
      setSchema({
        url,
        json: JSON.stringify(res.body, null, 2),
        id: uuidv4(),
        uid
      })

      toast.success("Done")
      console.log("z", schema)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.dismiss(toastId)
      toast.error("Error scraping data in catch")
    }
  }

  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const handleSave = async () => {
    if (!schema?.json) return
    const toastId = toast.loading("Saving...")
    setIsLoading(true)
    try {
      const json = replaceInnermostValuesWithNull(JSON.parse(schema.json))
      const nulledJson = JSON.stringify(json, null, 2)
      const nulledSchema: TablesInsert<"schemas"> = {
        ...schema,
        json: nulledJson
      }
      const res = await createOrSaveSchema(nulledSchema, uid)
      toast.dismiss(toastId)
      toast.success("Saved")
      setIsLoading(false)
    } catch (error) {
      toast.dismiss(toastId)
      toast.error("Error saving")
    }
  }
  const handleCopySchema = () => {
    if (schema) {
      navigator.clipboard
        .writeText(schema.json)
        .then(() => {
          toast.success("Copied to clipboard")
          setSchema_json_copied(true)
          setTimeout(() => {
            setSchema_json_copied(false)
          }, 1000)
        })
        .catch(error => {
          console.error("Error copying text to clipboard:", error)
        })
    }
  }
  const handleCopyApiCall = () => {
    if (schema) {
      navigator.clipboard
        .writeText(js_api_code)
        .then(() => {
          toast.success("Copied to clipboard")
          setApi_call_copied(true)
          setTimeout(() => {
            setApi_call_copied(false)
          }, 1000)
        })
        .catch(error => {
          console.error("Error copying text to clipboard:", error)
        })
    }
  }

  return (
    <div className="flex w-full flex-col items-center overflow-y-auto">
      <div className="mt-10 flex w-full max-w-4xl flex-col p-6 sm:mt-0 sm:p-16">
        <div className="w-full items-center   space-y-4 md:flex md:space-x-4   md:space-y-0 ">
          <div className=" flex h-[180px] w-full flex-col rounded-lg border border-input bg-background p-4 ">
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
            <Label className="pb-2 text-xl ">Description(required)</Label>
            <p className="pb-2 text-sm text-zinc-400">
              {" "}
              Describe the data you want to receive
            </p>
            <TextareaAutosize
              placeholder={`List the project names and descriptions.`}
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
            <div className="flex items-center space-x-2">
              <Button
                variant={"outline"}
                disabled={!schema?.id}
                onClick={handleSave}
                className="px-4"
              >
                Save
              </Button>

              <label className="themeSwitcherThree relative inline-flex cursor-pointer select-none items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />

                <div className="flex h-[46px] w-[82px] items-center justify-center rounded-md bg-background shadow-card">
                  <span
                    className={`flex size-9 items-center justify-center rounded ${
                      !isChecked
                        ? "bg-white text-purple-600"
                        : "text-body-color"
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
                      height="16"
                      width="16"
                      viewBox="0 0 1792 1792"
                      fill={"currentColor"}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M553 1399l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23t-10 23l-393 393 393 393q10 10 10 23t-10 23zm591-1067l-373 1291q-4 13-15.5 19.5t-23.5 2.5l-62-17q-13-4-19.5-15.5t-2.5-24.5l373-1291q4-13 15.5-19.5t23.5-2.5l62 17q13 4 19.5 15.5t2.5 24.5zm657 651l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23t-10 23z"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                    <span className="text-small ml-2 font-medium">API</span>
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="max-h-[600px] w-full flex-col justify-center overflow-y-auto ">
            {schema?.json ? (
              !isChecked ? (
                <div className="relative">
                  <button
                    className="absolute right-2 top-2 p-2"
                    onClick={handleCopySchema}
                  >
                    {schema_json_copied ? (
                      <svg
                        className="size-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="size-5 text-gray-500 hover:text-gray-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />{" "}
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}{" "}
                  </button>
                  <SyntaxHighlighter
                    className="w-full rounded-lg border border-input pt-6"
                    language="json"
                    style={vscDarkPlus}
                  >
                    {schema?.json}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="relative">
                  <button
                    className="absolute right-2 top-2 p-2"
                    onClick={handleCopyApiCall}
                  >
                    {api_call_copied ? (
                      <svg
                        className="size-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="size-5 text-gray-500 hover:text-gray-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />{" "}
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}{" "}
                  </button>

                  <SyntaxHighlighter
                    className="w-full rounded-lg border border-input pt-6"
                    language="json"
                    style={vscDarkPlus}
                  >
                    {js_api_code}
                  </SyntaxHighlighter>
                </div>
              )
            ) : (
              <div className="flex h-[200px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-5 text-center">
                  <span>🤖</span>
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
    </div>
  )
}
