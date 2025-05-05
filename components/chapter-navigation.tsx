"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChapterNavigationProps {
  chapters: { title: string; href: string }[]
  currentChapter: string | null
  onChapterChange: (chapterId: string) => void
}

export function ChapterNavigation({ chapters, currentChapter, onChapterChange }: ChapterNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleChapterClick = (href: string) => {
    onChapterChange(href)
    setIsOpen(false)
  }

  const currentChapterTitle = currentChapter
    ? chapters.find((c) => c.href === currentChapter)?.title || "Unknown Chapter"
    : chapters.length > 0
      ? chapters[0].title
      : "No Chapters"

  return (
    <div className="relative">
      <Button variant="outline" className="w-full justify-between" onClick={toggleOpen}>
        <span className="truncate">{currentChapterTitle}</span>
        {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
      </Button>

      {isOpen && chapters.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-md">
          <ScrollArea className="max-h-60">
            <div className="p-1">
              {chapters.map((chapter) => (
                <Button
                  key={chapter.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    chapter.href === currentChapter && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleChapterClick(chapter.href)}
                >
                  {chapter.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
