"use client"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/utility/providers"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ReactNode, useContext } from "react"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { supabase } from "@/lib/supabase/browser-client"
import { getApiKeysByUserId } from "@/db/apikeys"
import { ChatbotUIContext } from "@/context/context"

const inter = Inter({ subsets: ["latin"] })
const APP_NAME = "Fitpal AI"
const APP_DEFAULT_TITLE = "Fitpal AI"
const APP_TITLE_TEMPLATE = "%s - Fitpal AI"
const APP_DESCRIPTION = "Chabot UI PWA!"

interface RootLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export const viewport: Viewport = {
  themeColor: "#000000"
}

const i18nNamespaces = ["translation"]

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  const { setApikeys, apikeys } = useContext(ChatbotUIContext)
  const session = (await supabase.auth.getSession()).data.session
  if (session) {
    const apik = await getApiKeysByUserId(session?.user.id)
    setApikeys(apik)
    console.log("d", apikeys)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DM7XC7YDQT"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-DM7XC7YDQT');
              `
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="dark">
          <Toaster richColors position="top-center" duration={3000} />
          <div className="flex flex-col items-center overflow-x-hidden text-foreground">
            {children}
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
