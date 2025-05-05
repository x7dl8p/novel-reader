"use client"

import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TextReaderProps {
  file: File
  onChaptersFound: (chapters: { title: string; href: string }[]) => void
  currentChapter: string | null
  onAddBookmark: (cfi: string, title: string) => void
}

export function TextReader({ file, onChaptersFound, currentChapter, onAddBookmark }: TextReaderProps) {
  const [content, setContent] = useState<string>("")
  const [chapters, setChapters] = useState<{ title: string; href: string; content: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const readFile = async () => {
      try {
        setLoading(true)
        const text = await file.text()
        setContent(text)

        // Simple chapter detection based on common patterns
        // This is a basic implementation and might need refinement
        const chapterRegex = /^(Chapter|CHAPTER)\s+(\d+|[IVXLCDM]+)(?:\s*[:.-]\s*(.+))?$/gm
        const matches = [...text.matchAll(chapterRegex)]

        if (matches.length > 0) {
          // Create chapters based on regex matches
          const detectedChapters = matches.map((match, index) => {
            const chapterNum = match[2]
            const chapterTitle = match[3] ? match[3].trim() : `Chapter ${chapterNum}`
            const startPos = match.index || 0
            const endPos = index < matches.length - 1 ? matches[index + 1].index : text.length
            const chapterContent = text.substring(startPos, endPos)

            return {
              title: chapterTitle,
              href: `chapter-${index}`,
              content: chapterContent,
            }
          })

          setChapters(detectedChapters)
          onChaptersFound(detectedChapters.map(({ title, href }) => ({ title, href })))
        } else {
          // If no chapters detected, treat the whole text as one chapter
          const singleChapter = {
            title: file.name.replace(/\.[^/.]+$/, ""),
            href: "chapter-0",
            content: text,
          }
          setChapters([singleChapter])
          onChaptersFound([{ title: singleChapter.title, href: singleChapter.href }])
        }
      } catch (error) {
        console.error("Error reading text file:", error)
      } finally {
        setLoading(false)
      }
    }

    readFile()
  }, [file, onChaptersFound])

  const getCurrentChapterContent = () => {
    if (!currentChapter && chapters.length > 0) {
      return chapters[0].content
    }

    const chapter = chapters.find((c) => c.href === currentChapter)
    return chapter ? chapter.content : content
  }

  const handleAddBookmark = () => {
    const chapter = chapters.find((c) => c.href === currentChapter) || chapters[0]
    if (chapter) {
      onAddBookmark(chapter.href, chapter.title)
    }
  }

  return (
    <div className="relative">
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Loading content...</p>
        </div>
      ) : (
        <>
          <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={handleAddBookmark}>
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">Add bookmark</span>
          </Button>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {getCurrentChapterContent()
              .split("\n")
              .map((line, index) => (
                <p key={index} className={cn(line.trim() === "" && "h-4")}>
                  {line}
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
