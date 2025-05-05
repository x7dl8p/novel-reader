"use client"

import React, { useEffect, useRef, useState } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book, Rendition } from "epubjs"

interface EpubReaderProps {
  file: File
  onChaptersFound: (chapters: { title: string; href: string }[]) => void
  currentChapter: string | null
  onAddBookmark: (cfi: string, title: string) => void
  theme?: string // Add theme prop
}

export function EpubReader({ file, onChaptersFound, currentChapter, onAddBookmark, theme }: EpubReaderProps) {
  const readerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<Book | null>(null)
  const renditionRef = useRef<Rendition | null>(null)
  const [loading, setLoading] = useState(true)

  // Define theme styles
  const themes = {
    light: {
      body: { color: "#000", background: "#fff" },
      "*::selection": { background: "rgba(0, 123, 255, 0.3)" }, // Example selection style
    },
    dark: {
      body: { color: "#fff", background: "#18181b" }, // Use a dark background
      "*::selection": { background: "rgba(255, 255, 255, 0.3)" }, // Example selection style for dark
    },
  }

  useEffect(() => {
    if (!file || !readerRef.current) return

    let isMounted = true
    const readerElement = readerRef.current

    const loadEpub = async () => {
      setLoading(true)
      try {
        const EpubJS = (await import("epubjs")).default

        const fileReader = new FileReader()
        fileReader.onload = async (event) => {
          if (!event.target?.result || !isMounted) return

          const arrayBuffer = event.target.result as ArrayBuffer

          const newBook = EpubJS(arrayBuffer)
          bookRef.current = newBook

          await newBook.ready

          if (!isMounted) return

          // Get the navigation content from the book
          await newBook.loaded.navigation
          const toc = newBook.navigation.toc
          if (isMounted) {
            onChaptersFound(toc.map((item) => ({ title: item.label.trim(), href: item.href })))
          }

          const newRendition = newBook.renderTo(readerElement, {
            width: "100%",
            height: "100%",
            flow: "paginated",
            spread: "none", // Force single page view
          })
          renditionRef.current = newRendition

          // Register themes
          Object.entries(themes).forEach(([name, styles]) => {
            newRendition.themes.register(name, styles)
          })

          // Select initial theme
          newRendition.themes.select(theme === "dark" ? "dark" : "light")

          await newRendition.display(currentChapter || undefined)

          if (isMounted) {
            newRendition.on("selected", async (cfiRange: string, contents: any) => {
              const range = await newBook.getRange(cfiRange)
              if (range) {
                // You might want a button or context menu to trigger this
                // onAddBookmark(cfiRange, range.toString().substring(0, 50) + "...");
              }
            })
          }
        }

        fileReader.onerror = (error) => {
          if (isMounted) {
            console.error("Error reading file:", error)
            setLoading(false)
          }
        }

        fileReader.readAsArrayBuffer(file)
      } catch (error) {
        if (isMounted) {
          console.error("Error loading EPUB:", error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadEpub()

    return () => {
      isMounted = false
      renditionRef.current?.destroy()
      bookRef.current?.destroy()
      renditionRef.current = null
      bookRef.current = null
    }
  }, [file])

  useEffect(() => {
    if (renditionRef.current && currentChapter) {
      renditionRef.current.display(currentChapter)
    }
  }, [currentChapter])

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.select(theme === "dark" ? "dark" : "light")
    }
  }, [theme])

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <p>Loading EPUB...</p>
        </div>
      )}
      <div ref={readerRef} className="w-full h-full epub-container"></div>
    </div>
  )
}
