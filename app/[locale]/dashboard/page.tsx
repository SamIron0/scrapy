"use server"
import { createClient } from "@/lib/supabase/server"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Dash from "@/components/adminDashboard/dash"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { urlExists } from "@/db/recipes"
import axios from "axios"
import { TablesInsert } from "@/supabase/types"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"
import { url } from "inspector"

export default async function Dashboard() {
  return <Dash />
}
