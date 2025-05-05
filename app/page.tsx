"use client"

import { useState } from "react"
import { ReaderLayout } from "@/components/reader-layout"
import { FileOpener } from "@/components/file-opener"
import { NoFileSelected } from "@/components/no-file-selected"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<"text" | "epub" | "pdf" | null>(null)

  const handleFileOpen = (selectedFile: File) => {
    setFile(selectedFile)

    const extension = selectedFile.name.split(".").pop()?.toLowerCase()
    if (extension === "epub") {
      setFileType("epub")
    } else if (extension === "pdf") {
      setFileType("pdf")
    } else {
      setFileType("text")
    }
  }

  return (
    <main className="min-h-screen">
      {file ? (
        <ReaderLayout file={file} fileType={fileType} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <NoFileSelected />
          <FileOpener onFileOpen={handleFileOpen} />
        </div>
      )}
    </main>
  )
}
