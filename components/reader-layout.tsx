"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ChapterNavigation } from "@/components/chapter-navigation"
import { TextReader } from "@/components/readers/text-reader"
import { EpubReader } from "@/components/readers/epub-reader"
import { PdfReader } from "@/components/readers/pdf-reader"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"
import { OptionsSidebar } from "@/components/options-sidebar"

interface ReaderLayoutProps {
  file: File
  fileType: "text" | "epub" | "pdf" | null
}

export function ReaderLayout({ file, fileType }: ReaderLayoutProps) {
  const [chapters, setChapters] = useState<{ title: string; href: string }[]>([])
  const [currentChapter, setCurrentChapter] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<{ cfi: string; title: string; timestamp: number }[]>([])
  const [readerOptions, setReaderOptions] = useState({
    fontSize: 16,
    brightness: 100,
    contrast: 150, // Changed from 150 to a more moderate default
    padding: 16,
    fontFamily: "Inter",
  })

  const { theme } = useTheme()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleChapterChange = (chapterId: string) => {
    setCurrentChapter(chapterId)
  }

  const addBookmark = (cfi: string, title: string) => {
    setBookmarks([...bookmarks, { cfi, title, timestamp: Date.now() }])
  }

  const removeBookmark = (timestamp: number) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.timestamp !== timestamp))
  }

  const updateReaderOptions = (options: Partial<typeof readerOptions>) => {
    setReaderOptions({ ...readerOptions, ...options })
  }

  // Different styles based on reader type
  const getReaderContentStyles = () => {
    if (fileType === "epub") {
      // For EPUB, minimal styling as the renderer handles it
      return {
        display: "flex",
        flexDirection: "column" as const,
        height: "100%",
        filter: `brightness(${readerOptions.brightness}%) contrast(${readerOptions.contrast}%)`
      }
    } else {
      // For text and PDF
      return {
        fontSize: `${readerOptions.fontSize}px`,
        filter: `brightness(${readerOptions.brightness}%) contrast(${readerOptions.contrast}%)`,
        fontFamily: readerOptions.fontFamily,
        textAlign: "left" as const,
        padding: `${readerOptions.padding}px`,
        maxWidth: "800px",
        margin: "0 auto",
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <OptionsSidebar
                  options={readerOptions}
                  onOptionsChange={updateReaderOptions}
                  bookmarks={bookmarks}
                  onBookmarkRemove={removeBookmark}
                />
              </DialogContent>
            </Dialog>
            <h1 className="ml-2 text-xl font-semibold">Novel Reader</h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Chapter List Panel */}
            <div className="w-64 h-[90vh] ml-4 border rounded-lg bg-background p-2 flex-shrink-0 my-4">
            <h2 className="text-lg font-semibold mb-4">Chapters</h2>
            <ChapterNavigation
              chapters={chapters}
              currentChapter={currentChapter}
              onChapterChange={handleChapterChange}
            />
            </div>

          {/* Reader Content Area */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={getReaderContentStyles()}
          >
            {/* Reader Components */}
            {fileType === "text" && (
              <TextReader
                file={file}
                onChaptersFound={setChapters}
                currentChapter={currentChapter}
                onAddBookmark={addBookmark}
              />
            )}
            {fileType === "epub" && (
              <EpubReader
                file={file}
                onChaptersFound={setChapters}
                currentChapter={currentChapter}
                onAddBookmark={addBookmark}
                theme={theme}
              />
            )}
            {fileType === "pdf" && (
              <PdfReader
                file={file}
                onChaptersFound={setChapters}
                currentChapter={currentChapter}
                onAddBookmark={addBookmark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
