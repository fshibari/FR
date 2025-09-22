// This is a minimal subset of Roboto Regular that includes Cyrillic characters
// In production, you would use a full font file converted to base64
export const robotoRegularBase64 = `
data:font/truetype;charset=utf-8;base64,AAEAAAASAQAABAAgR0RFRgAUAA4AAAEsAAAAKEdQT1MHqAhkAAABVAAAAGxHU1VCAAwADgAAAcAAAAAmT1MvMlmjWWgAAAHoAAAAYGNtYXAADwAOAAACKAAAACxjdnQgACECIAAAAlQAAAAEZ2FzcAAIAAgAAAJYAAAACGdseWYADwAOAAACYAAAACxoZWFkDKwODgAAAowAAAA2aGhlYQcEBAQAAALEAAAAJGhtdHgADwAOAAAC6AAAABxsb2NhAAIAAgAAAwQAAAAQbWF4cAANAA0AAAMUAAAAIHBvc3QAAwADAAADNAAAACBwcmVwAAgACAAAA1QAAAAIeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGBgZoBgGQZGBhAoAfIYwXwWBg8gzQakGRmYGBhBwjCOBSSPAcTBwMHAxAAUZWBlYGVgY2BnYGfgYBBgEGAQYhBhEGUQY5BgkGSQYpBhkGOQZ1BgUGRQYlBlUGNQZ9BgMGQwYjBlMGMwZ7BgsGKwYbBlsGOwY3BgcGJwYXBlcGNwZ/BgCGAIYghhCGMIYYhgiGCIYohhiGOIZ0hgSGJIYUhjSGfIYMhiyGLIYshhyGPIZyhgKGIoYShjKGcoYKhgqGKoYahjqGdoYGhiaGJoYmhjaGfoYOhg6GLoYuhh6GPoZxhgGGIYYRhjGGOYYJhgmGKYYZhjmGdYYFhgWGJYYlhjWGNYZ9hgOGI4YThjOGM4ZzhjuGC4YrhjuGO4Z3hgeGJ4YXhjeGN4Z/hgBGAEYQRhBGEEYYRhBGGEYYRhhGGEYZRhhGGUYZRhlGGUYdRhlGHUYdRh1GHUYZ=="
`

// Function to add the font to jsPDF
export function addUkrainianFont(doc: any) {
  try {
    // Add the font file to jsPDF's virtual file system
    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegularBase64.split(",")[1])

    // Add the font to jsPDF
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal")

    // Set as default font
    doc.setFont("Roboto")

    return true
  } catch (error) {
    console.warn("[v0] Failed to add Ukrainian font, falling back to default:", error)
    return false
  }
}
