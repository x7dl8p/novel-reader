"use client"

import { useState } from "react"
import { X, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FontManager } from "@/components/font-manager"

interface OptionsSidebarProps {
  options: {
    fontSize: number
    brightness: number
    contrast: number
    padding: number
    fontFamily: string
  }
  onOptionsChange: (options: Partial<typeof options>) => void
  bookmarks: { cfi: string; title: string; timestamp: number }[]
  onBookmarkRemove: (timestamp: number) => void
  onClose: () => void
}

const DEFAULT_FONTS = [
  { name: "Inter", value: "Inter" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Times New Roman", value: "Times New Roman, Times, serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Merriweather", value: "Merriweather, serif" },
]

export function OptionsSidebar({
  options,
  onOptionsChange,
  bookmarks,
  onBookmarkRemove,
  onClose,
}: OptionsSidebarProps) {
  const [availableFonts, setAvailableFonts] = useState<Array<{ name: string; value: string }>>(DEFAULT_FONTS)

  const handleFontLoaded = (fontFamily: string) => {
    // Add the new font to the available fonts list
    setAvailableFonts((prev) => [...prev, { name: fontFamily, value: fontFamily }])

    // Automatically switch to the new font
    onOptionsChange({ fontFamily })
  }

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Options</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="options" className="flex-1">
        <TabsList className="grid grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="fonts">Fonts</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="flex-1 p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="text-size">Text Size</label>
                <span className="text-sm text-muted-foreground">{options.fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">-</span>
                <Slider
                  id="text-size"
                  min={12}
                  max={32}
                  step={1}
                  value={[options.fontSize]}
                  onValueChange={(value) => onOptionsChange({ fontSize: value[0] })}
                />
                <span className="text-sm">+</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="brightness">Brightness</label>
                <span className="text-sm text-muted-foreground">{options.brightness}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">-</span>
                <Slider
                  id="brightness"
                  min={50}
                  max={150}
                  step={5}
                  value={[options.brightness]}
                  onValueChange={(value) => onOptionsChange({ brightness: value[0] })}
                />
                <span className="text-sm">+</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="contrast">Background Contrast</label>
                <span className="text-sm text-muted-foreground">{options.contrast}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">-</span>
                <Slider
                  id="contrast"
                  min={50}
                  max={150}
                  step={5}
                  value={[options.contrast]}
                  onValueChange={(value) => onOptionsChange({ contrast: value[0] })}
                />
                <span className="text-sm">+</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="padding">Padding</label>
                <span className="text-sm text-muted-foreground">{options.padding}px</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">-</span>
                <Slider
                  id="padding"
                  min={0}
                  max={64}
                  step={4}
                  value={[options.padding]}
                  onValueChange={(value) => onOptionsChange({ padding: value[0] })}
                />
                <span className="text-sm">+</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="font">Font</label>
              <Select value={options.fontFamily} onValueChange={(value) => onOptionsChange({ fontFamily: value })}>
                <SelectTrigger id="font">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fonts" className="flex-1 p-4">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <FontManager onFontLoaded={handleFontLoaded} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="bookmarks" className="flex-1">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Bookmarks</h3>

              {bookmarks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No bookmarks yet.</p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.timestamp}
                      className="flex items-center justify-between p-3 border border-border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4 text-primary" />
                        <span className="text-sm truncate max-w-[180px]">{bookmark.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onBookmarkRemove(bookmark.timestamp)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
