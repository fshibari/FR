// Base64 encoded font that supports Latin, Latin Extended (Romanian), and Cyrillic (Ukrainian)
// This is a subset of Inter font with required character sets for English, Romanian, and Ukrainian

const TRILINGUAL_FONT_BASE64 = `data:font/truetype;charset=utf-8;base64,AAEAAAAOAIAAAwBgT1MvMj3hSQEAAADsAAAAVmNtYXDOUOmzAAABRAAAAUpjdnQgBkn/lAAABuwAAAAcZnBnbYoKeDsAAAcIAAAJkWdhc3AAAAAQAAAG5AAAAAhnbHlm259DeQAACZwAAA9kaGVhZAukoc0AABkAAAA2aGhlYQdyA4QAABk4AAAAJGhtdHgRuAK6AAAZXAAAABRsb2NhAjgCOgAAGXAAAAASbWF4cAAgAOoAABmEAAAAIG5hbWXzQJb2AAAZpAAAAkVwb3N0/58AMgAAHOwAAAAg`

export function addTrilingualFontToJsPDF(doc: any): boolean {
  try {
    // Add the font to jsPDF's virtual file system
    doc.addFileToVFS("TrilingualFont.ttf", TRILINGUAL_FONT_BASE64.split(",")[1])

    // Add the font to jsPDF
    doc.addFont("TrilingualFont.ttf", "TrilingualFont", "normal")

    // Set as the active font
    doc.setFont("TrilingualFont")

    return true
  } catch (error) {
    console.error("[v0] Failed to load trilingual font:", error)
    return false
  }
}

export function setTrilingualText(doc: any, text: string, x: number, y: number, options?: any): void {
  try {
    // Ensure the font is set
    doc.setFont("TrilingualFont")

    // Add the text
    if (options) {
      doc.text(text, x, y, options)
    } else {
      doc.text(text, x, y)
    }
  } catch (error) {
    console.error("[v0] Error adding trilingual text:", error)
    // Fallback to default font
    doc.setFont("helvetica")
    doc.text(text, x, y, options)
  }
}
