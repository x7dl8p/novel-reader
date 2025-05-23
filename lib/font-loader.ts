/**
 * Loads a font from a URL and adds it to the document
 * @param fontFamily The name to use for the font family
 * @param url The URL of the font file
 * @returns A promise that resolves when the font is loaded
 */
export async function loadFont(fontFamily: string, url: string): Promise<FontFace> {
  try {
    console.log(`Loading font "${fontFamily}" from "${url}"`)
    // Create a new FontFace object
    const font = new FontFace(fontFamily, `url(${url})`)

    // Wait for the font to load
    const loadedFont = await font.load()

    // Add the font to the document
    document.fonts.add(loadedFont)

    return loadedFont
  } catch (error) {
    console.error(`Failed to load font "${fontFamily}" from "${url}":`, error)
    throw error
  }
}

/**
 * Preloads the default fonts used in the application
 */
export async function preloadDefaultFonts(): Promise<void> {
  if (typeof window === "undefined") return

  // Check if we're in the browser and if the Fonts API is available
  if (!("fonts" in document)) {
    console.warn("Font Loading API not supported in this browser")
    return
  }

  try {
    // Load default fonts if they're not already loaded
    // Ensure font names match the @font-face definitions in globals.css
    const fontFamilies = ["Inter", "JetBrains Mono", "Merriweather", "Roboto"]; // Removed Georgia as it wasn't in the initial request and might not exist locally

    for (const family of fontFamilies) {
      // Check if the font is already loaded
      const isLoaded = Array.from(document.fonts).some(
        (font) => font.family.replace(/["']/g, "") === family && font.status === "loaded",
      );

      if (!isLoaded) {
        // Correct the path: Files in /public are served from the root
        const fontUrl = `/fonts/${family.toLowerCase().replace(/\s+/g, "-")}.woff2`;
        await loadFont(family, fontUrl);
        console.log(`Preloaded font: ${family}`);
      }
    }
  } catch (error) {
    console.error("Error preloading default fonts:", error)
  }
}
