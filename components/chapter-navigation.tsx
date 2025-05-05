"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChapterNavigationProps {
  chapters: { title: string; href: string }[]
  currentChapter: string | null
  onChapterChange: (chapterId: string) => void
}

export function ChapterNavigation({ chapters, currentChapter, onChapterChange }: ChapterNavigationProps) {

  if (!chapters || chapters.length === 0) {
    return <p className="text-sm text-muted-foreground">No chapters found.</p>;
  }

  return (
    // Use ScrollArea to make the list scrollable within its container
    <ScrollArea className="h-full"> {/* Ensure ScrollArea takes full height */} 
      <div className="flex flex-col space-y-1 pr-2"> {/* Add padding-right if needed for scrollbar */}
        {chapters.map((chapter) => (
          <Button
            key={chapter.href}
            variant="ghost"
            size="sm" // Make buttons slightly smaller
            className={cn(
              "w-full justify-start text-left font-normal h-auto py-1.5 whitespace-normal", // Allow text wrapping
              chapter.href === currentChapter
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50", // Subtle hover
            )}
            onClick={() => onChapterChange(chapter.href)}
          >
            {chapter.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
