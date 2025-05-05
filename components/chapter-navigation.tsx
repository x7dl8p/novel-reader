"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChapterNavigationProps {
  chapters: { title: string; href: string }[];
  currentChapter: string | null;
  onChapterChange: (chapterId: string) => void;
}

export function ChapterNavigation({
  chapters,
  currentChapter,
  onChapterChange,
}: ChapterNavigationProps) {
  if (!chapters || chapters.length === 0) {
    return <p className="text-sm text-muted-foreground">No chapters found.</p>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col pr-3 py-2 w-full">
        {chapters.map((chapter) => (
          <Button
        key={chapter.href}
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start text-left font-normal h-auto px-3 py-2 rounded-md transition-colors duration-200",
          chapter.href === currentChapter
            ? "bg-accent text-accent-foreground font-medium"
            : "hover:bg-accent/50 hover:text-accent-foreground",
          "group flex items-center"
        )}
        onClick={() => onChapterChange(chapter.href)}
          >
        <span className="line-clamp-2 break-words w-full">{chapter.title}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
