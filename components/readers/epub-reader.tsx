"use client"

import { useState, useEffect, useRef } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book } from "epubjs"

interface EpubReaderProps {
  file: File
  onChaptersFound: (chapters: { title: string; href: string }[]) => void
  currentChapter: string | null
  onAddBookmark: (cfi: string, title: string) => void
}

export function EpubReader({ file, onChaptersFound, currentChapter, onAddBookmark }: EpubReaderProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [rendition, setRendition] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true)

        // Import epubjs dynamically to avoid SSR issues
        const epubjs = await import("epubjs")
        const Book = epubjs.default

        // Create a blob URL for the file
        const url = URL.createObjectURL(file)
        const newBook = Book(url)

        await newBook.ready
        setBook(newBook)

        // Get the table of contents
        const navigation = await newBook.navigation
        const toc = navigation.toc

        // Format chapters for the navigation component
        const chapters = toc.map((item: any) => ({
          title: item.label,
          href: item.href,
        }))

        onChaptersFound(chapters)

        // Create rendition
        if (viewerRef.current) {
          const newRendition = newBook.renderTo(viewerRef.current, {
            width: "100%",
            height: "100%",
            spread: "none",
          })

          setRendition(newRendition)

          // Display the first page
          await newRendition.display()
        }
      } catch (error) {
        console.error("Error loading EPUB:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBook()

    return () => {
      // Clean up
      if (book) {
        book.destroy()
      }
    }
  }, [file, onChaptersFound])

  // Handle chapter navigation
  useEffect(() => {
    if (rendition && currentChapter) {
      rendition.display(currentChapter)
    }
  }, [rendition, currentChapter])

  const handleAddBookmark = () => {
    if (rendition) {
      const currentLocation = rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      const chapter = book?.navigation?.get(currentLocation.start.href)
      const title = chapter?.label || "Bookmark"

      onAddBookmark(cfi, title)
    }
  }

  return (
    <div className="relative h-full">
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Loading EPUB...</p>
        </div>
      ) : (
        <>
          <Button variant="ghost" size="icon" className="absolute top-0 right-0 z-10" onClick={handleAddBookmark}>
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">Add bookmark</span>
          </Button>
          <div ref={viewerRef} className="epub-viewer h-[calc(100vh-200px)] overflow-hidden" />
        </>
      )}
    </div>
  )
}
