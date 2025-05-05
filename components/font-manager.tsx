"use client"

import { useState } from "react"

interface FontManagerProps {
  onFontLoaded: (fontFamily: string) => void
}

export function FontManager({ onFontLoaded }: FontManagerProps) {
  const [fontUrl, setFontUrl] = useState("")
  const [fontName, setFontName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedFonts, setLoadedFonts] = useState<string[]>([])

  const loadFont = async () => {
    if (!fontName.trim() || !fontUrl.trim()) {
      setError("Please provide both a font name and URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create a new FontFace object
      const font = new FontFace(fontName, `url(${fontUrl})`)

      // Wait for the font to load
      const loadedFont = await font.load()

      // Add the font to the document
      document.fonts.add(loadedFont)

      // Add to our list of loaded fonts
      setLoadedFonts((prev) => [...prev, fontName])

      // Notify parent component
      onFontLoaded(fontName)

      // Reset form
      setFontUrl("")
      setFontName("")

      console.log(`Font "${fontName}" loaded successfully`)
    } catch (err) {
      console.error("Error loading font:", err)
      setError(`Failed to load font: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Import Online Font</h3>

      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="font-name" className="text-sm font-medium">
            Font Name
          </label>
          <input
            id="font-name"
            type="text"
            value={fontName}
            onChange={(e) => setFontName(e.target.value)}
            placeholder="MyCustomFont"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="font-url" className="text-sm font-medium">
            Font URL (WOFF/WOFF2)
          </label>
          <input
            id="font-url"
            type="text"
            value={fontUrl}
            onChange={(e) => setFontUrl(e.target.value)}
            placeholder="https://example.com/font.woff2"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          onClick={loadFont}
          disabled={loading || !fontName || !fontUrl}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
        >
          {loading ? "Loading..." : "Import Font"}
        </button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {loadedFonts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Imported Fonts</h4>
          <ul className="space-y-1">
            {loadedFonts.map((font) => (
              <li key={font} className="text-sm" style={{ fontFamily: font }}>
                {font}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
