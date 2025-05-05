"use client"

import { useState, useEffect, useRef } from "react"
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfReaderProps {
  file: File
  onChaptersFound: (chapters: { title: string; href: string }[]) => void
  currentChapter: string | null
  onAddBookmark: (cfi: string, title: string) => void
}

export function PdfReader({ file, onChaptersFound, currentChapter, onAddBookmark }: PdfReaderProps) {
  const [pdf, setPdf] = useState<any>(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true)

        // Import PDF.js dynamically
        const pdfjs = await import("pdfjs-dist")
        // Set worker path
        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

        // Load the PDF
        const url = URL.createObjectURL(file)
        const loadingTask = pdfjs.getDocument(url)
        const pdfDoc = await loadingTask.promise

        setPdf(pdfDoc)
        setNumPages(pdfDoc.numPages)

        // Create chapters based on page numbers
        const chapters = Array.from({ length: pdfDoc.numPages }, (_, i) => ({
          title: `Page ${i + 1}`,
          href: `page-${i + 1}`,
        }))

        onChaptersFound(chapters)

        // Render the first page
        renderPage(1, pdfDoc)
      } catch (error) {
        console.error("Error loading PDF:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPdf()
  }, [file, onChaptersFound])

  // Handle chapter navigation
  useEffect(() => {
    if (pdf && currentChapter) {
      const pageMatch = currentChapter.match(/page-(\d+)/)
      if (pageMatch && pageMatch[1]) {
        const page = Number.parseInt(pageMatch[1])
        setPageNum(page)
        renderPage(page, pdf)
      }
    }
  }, [pdf, currentChapter])

  const renderPage = async (num: number, pdfDoc: any) => {
    if (!canvasRef.current) return

    const page = await pdfDoc.getPage(num)
    const viewport = page.getViewport({ scale: 1.5 })

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    await page.render(renderContext).promise
  }

  const changePage = (offset: number) => {
    const newPage = pageNum + offset
    if (newPage >= 1 && newPage <= numPages) {
      setPageNum(newPage)
      renderPage(newPage, pdf)

      // Update the current chapter
      const newChapter = `page-${newPage}`
      if (currentChapter !== newChapter) {
        onChaptersFound([{ title: `Page ${newPage}`, href: newChapter }])
      }
    }
  }

  const handleAddBookmark = () => {
    onAddBookmark(`page-${pageNum}`, `Page ${pageNum}`)
  }

  return (
    <div className="relative">
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Loading PDF...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => changePage(-1)} disabled={pageNum <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pageNum} of {numPages}
              </span>
              <Button variant="outline" size="icon" onClick={() => changePage(1)} disabled={pageNum >= numPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={handleAddBookmark}>
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">Add bookmark</span>
            </Button>
          </div>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </>
      )}
    </div>
  )
}
