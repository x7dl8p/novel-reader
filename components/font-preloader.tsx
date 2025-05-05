"use client"

import { useEffect } from "react"
import { preloadDefaultFonts } from "@/lib/font-loader"

export function FontPreloader() {
  useEffect(() => {
    preloadDefaultFonts()
  }, [])

  return null
}
