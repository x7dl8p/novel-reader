"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes" // Import useTheme
import { Button } from "@/components/ui/button"
import { OptionsSidebar } from "@/components/options-sidebar"
import { ChapterNavigation } from "@/components/chapter-navigation"
import { TextReader } from "@/components/readers/text-reader"
import { EpubReader } from "@/components/readers/epub-reader"
import { PdfReader } from "@/components/readers/pdf-reader"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface ReaderLayoutProps {
  file: File
  fileType: "text" | "epub" | "pdf" | null
}

export function ReaderLayout({ file, fileType }: ReaderLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chapters, setChapters] = useState<{ title: string; href: string }[]>([])
  const [currentChapter, setCurrentChapter] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<{ cfi: string; title: string; timestamp: number }[]>([])
  const [readerOptions, setReaderOptions] = useState({
    fontSize: 16,
    brightness: 100,
    contrast: 100,
    padding: 16,
    fontFamily: "Inter",
  })

  const { theme } = useTheme() // Get the current theme
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }, [isDesktop])

  const toggleSidebar = () => {
    console.log("toggleSidebar clicked, sidebarOpen:", !sidebarOpen);
    setSidebarOpen(!sidebarOpen)
  }

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Options Sidebar */}
      <aside
        className={cn(
          "h-full transition-all duration-200 ease-in-out border-r border-border bg-background overflow-y-auto",
          sidebarOpen ? "w-64 p-4" : "w-0 p-0 border-none",
          !sidebarOpen && "hidden md:block md:w-0 md:p-0 md:border-none"
        )}
      >
        {sidebarOpen && (
          <OptionsSidebar
            options={readerOptions}
            onOptionsChange={updateReaderOptions}
            bookmarks={bookmarks}
            onBookmarkRemove={removeBookmark}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex flex-col flex-1 h-full" // Removed overflow-hidden
      )}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="ml-2 text-xl font-semibold">Novle Reader</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Reader Area (including Chapters and Content) */}
        <div className="flex flex-1 overflow-hidden"> {/* Re-added overflow-hidden */}
          {/* Chapter List Panel (New) */}
          <div className="w-64 h-full border-r border-border bg-background p-4 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-4">Chapters</h2>
            <ChapterNavigation
              chapters={chapters}
              currentChapter={currentChapter}
              onChapterChange={handleChapterChange}
            />
          </div>

          {/* Reader Content Area */}
          <div
            className="flex-1 overflow-auto overflow-x-hidden"
            style={{
              fontSize: `${readerOptions.fontSize}px`,
              filter: `brightness(${readerOptions.brightness}%) contrast(${readerOptions.contrast}%)`,
              padding: `${readerOptions.padding}px`,
              fontFamily: readerOptions.fontFamily,
            }}
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
                theme={theme} // Pass theme as a prop
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
