import { FileText } from "lucide-react"

export function NoFileSelected() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Book Selected</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Open a text, EPUB, or PDF file to start reading. You can customize the reading experience using the options
        panel.
      </p>
    </div>
  )
}
