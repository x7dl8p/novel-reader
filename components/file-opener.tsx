"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface FileOpenerProps {
  onFileOpen: (file: File) => void
}

export function FileOpener({ onFileOpen }: FileOpenerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (isValidFileType(file)) {
        onFileOpen(file)
        setIsDialogOpen(false)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (isValidFileType(file)) {
        onFileOpen(file)
        setIsDialogOpen(false)
      }
    }
  }

  const isValidFileType = (file: File) => {
    const validTypes = [".txt", ".epub", ".pdf"]
    const fileName = file.name.toLowerCase()
    return validTypes.some((type) => fileName.endsWith(type))
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">
          <FileText className="mr-2 h-4 w-4" />
          Open Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Open a book</DialogTitle>
        </DialogHeader>
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors",
            isDragging ? "border-primary bg-primary/10" : "border-border",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-center mb-4">Drag and drop your file here, or click to select</p>
          <p className="text-xs text-muted-foreground mb-4">Supported formats: .txt, .epub, .pdf</p>
          <Button onClick={openFileDialog}>Select File</Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.epub,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
