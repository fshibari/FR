"use client"

import type { PrivateQRData, PublicQRData } from "@/lib/release-generator"

// QR Code generation using canvas
export function generateQRCode(data: string, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log("[v0] Generating QR code for data length:", data.length)

      // Create canvas element
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Canvas context not available")
      }

      canvas.width = size
      canvas.height = size

      // Simple QR code pattern generator (placeholder implementation)
      // In production, you would use a proper QR code library like qrcode.js
      generateQRPattern(ctx, data, size)

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png")
      console.log("[v0] QR code generated successfully")
      resolve(dataUrl)
    } catch (error) {
      console.error("[v0] Error generating QR code:", error)
      reject(error)
    }
  })
}

// Simple QR pattern generator (placeholder - would use proper QR library in production)
function generateQRPattern(ctx: CanvasRenderingContext2D, data: string, size: number) {
  const modules = 25 // QR code grid size
  const moduleSize = size / modules

  // Clear canvas
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, size, size)

  // Generate pattern based on data hash
  const hash = simpleHash(data)
  ctx.fillStyle = "#000000"

  // Draw finder patterns (corners)
  drawFinderPattern(ctx, 0, 0, moduleSize)
  drawFinderPattern(ctx, (modules - 7) * moduleSize, 0, moduleSize)
  drawFinderPattern(ctx, 0, (modules - 7) * moduleSize, moduleSize)

  // Draw data pattern
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      // Skip finder pattern areas
      if (isFinderPatternArea(i, j, modules)) continue

      // Generate module based on hash and position
      if ((hash + i * j) % 3 === 0) {
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
      }
    }
  }

  // Add center text
  ctx.fillStyle = "#ffffff"
  ctx.font = `${moduleSize * 2}px monospace`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Draw background for text
  const textWidth = moduleSize * 8
  const textHeight = moduleSize * 2
  const textX = (size - textWidth) / 2
  const textY = (size - textHeight) / 2

  ctx.fillRect(textX, textY, textWidth, textHeight)

  // Draw text
  ctx.fillStyle = "#000000"
  ctx.fillText("SHIBARI", size / 2, size / 2)
}

function drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) {
  // Outer square (7x7)
  ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)

  // Inner white square (5x5)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)

  // Center black square (3x3)
  ctx.fillStyle = "#000000"
  ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
}

function isFinderPatternArea(i: number, j: number, modules: number): boolean {
  // Top-left finder pattern
  if (i < 9 && j < 9) return true
  // Top-right finder pattern
  if (i >= modules - 8 && j < 9) return true
  // Bottom-left finder pattern
  if (i < 9 && j >= modules - 8) return true

  return false
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Generate private QR code with full data
export async function generatePrivateQR(data: PrivateQRData, size = 512): Promise<string> {
  try {
    const releaseId = data?.releaseId || "TEMP-" + Date.now().toString().slice(-8)
    console.log("[v0] Generating private QR code for release:", releaseId)

    const qrData = JSON.stringify({
      type: "private",
      releaseId: releaseId,
      timestamp: data?.timestamp || new Date().toISOString(),
      parties: data?.parties || {},
      consent: data?.shibariConsent || {},
      crypto: data?.cryptographicData || {},
      geo: data?.geolocation || null,
      verify: data?.verificationUrl || generateVerificationUrl(releaseId, true),
    })

    return await generateQRCode(qrData, size)
  } catch (error) {
    console.error("[v0] Error generating private QR code:", error)
    throw error
  }
}

// Generate public QR code with anonymized data
export async function generatePublicQR(data: PublicQRData, size = 256): Promise<string> {
  try {
    const releaseId = data?.releaseId || "TEMP-" + Date.now().toString().slice(-8)
    console.log("[v0] Generating public QR code for release:", releaseId)

    const qrData = JSON.stringify({
      type: "public",
      releaseId: releaseId,
      timestamp: data?.timestamp || new Date().toISOString(),
      parties: data?.parties || [],
      session: data?.sessionType || "Shibari Session",
      crypto: data?.cryptographicData || {},
      verify: data?.verificationUrl || generateVerificationUrl(releaseId, false),
    })

    return await generateQRCode(qrData, size)
  } catch (error) {
    console.error("[v0] Error generating public QR code:", error)
    throw error
  }
}

// Verify QR code data integrity
export function verifyQRData(qrDataString: string): {
  isValid: boolean
  type: "private" | "public" | "personal-data" | "unknown"
  releaseId?: string
  error?: string
} {
  try {
    const data = JSON.parse(qrDataString)

    if (!data.type || !data.releaseId || !data.timestamp) {
      return {
        isValid: false,
        type: "unknown",
        error: "Missing required fields",
      }
    }

    if (!["private", "public", "personal-data"].includes(data.type)) {
      return {
        isValid: false,
        type: "unknown",
        error: "Invalid QR code type",
      }
    }

    // Validate Release ID format (AAAA-BBBB-CCCC-DDDD)
    const releaseIdPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    if (!releaseIdPattern.test(data.releaseId)) {
      return {
        isValid: false,
        type: data.type,
        error: "Invalid Release ID format",
      }
    }

    return {
      isValid: true,
      type: data.type,
      releaseId: data.releaseId,
    }
  } catch (error) {
    return {
      isValid: false,
      type: "unknown",
      error: "Invalid JSON format",
    }
  }
}

// Generate verification URL for QR codes
export function generateVerificationUrl(releaseId: string, isPrivate = false): string {
  const baseUrl = "https://shibari-verify.app"
  const path = isPrivate ? "/verify/private" : "/verify/public"
  return `${baseUrl}${path}/${releaseId}`
}

// Create QR code with logo overlay
export async function generateQRWithLogo(data: string, logoUrl?: string, size = 256): Promise<string> {
  try {
    // Generate base QR code
    const qrDataUrl = await generateQRCode(data, size)

    if (!logoUrl) {
      return qrDataUrl
    }

    // Create canvas for compositing
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Canvas context not available")
    }

    canvas.width = size
    canvas.height = size

    // Load QR code image
    const qrImage = new Image()
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve
      qrImage.onerror = reject
      qrImage.src = qrDataUrl
    })

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, size, size)

    // Load and draw logo
    const logoImage = new Image()
    await new Promise((resolve, reject) => {
      logoImage.onload = resolve
      logoImage.onerror = reject
      logoImage.src = logoUrl
    })

    // Calculate logo size (20% of QR code)
    const logoSize = size * 0.2
    const logoX = (size - logoSize) / 2
    const logoY = (size - logoSize) / 2

    // Draw white background for logo
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)

    // Draw logo
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)

    return canvas.toDataURL("image/png")
  } catch (error) {
    console.error("[v0] Error generating QR code with logo:", error)
    // Return QR code without logo on error
    return await generateQRCode(data, size)
  }
}

// Generate personal data QR code
export async function generatePersonalDataQR(personData: any, party: "A" | "B", size = 256): Promise<string> {
  try {
    console.log(`[v0] Generating personal data QR for party ${party}`)

    const qrData = JSON.stringify({
      type: "personal-data",
      party: party,
      timestamp: new Date().toISOString(),
      data: {
        fullName: personData.fullName,
        email: personData.email,
        phone: personData.phone,
        dateOfBirth: personData.dateOfBirth,
        citizenship: personData.citizenship,
        // Exclude sensitive data like photos and ID numbers from QR
      },
      verification: `personal-${party}-${Date.now()}`,
    })

    return await generateQRCode(qrData, size)
  } catch (error) {
    console.error(`[v0] Error generating personal data QR for party ${party}:`, error)
    throw error
  }
}
