import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FontPreloader } from "@/components/font-preloader"

export const metadata: Metadata = {
  title: "Novle Reader",
  description: "A minimal novel reader for text, EPUB, and PDF files",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FontPreloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
