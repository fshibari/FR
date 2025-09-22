"use client"

import type { ReleaseData } from "@/lib/types"
import { generateReleaseId, generateTimestamp, createCryptographicChain } from "@/lib/crypto"

export interface GeneratedRelease {
  releaseData: ReleaseData
  privateQRData: PrivateQRData
  publicQRData: PublicQRData
}

export interface PrivateQRData {
  releaseId: string
  timestamp: string
  parties: {
    partyA: {
      fullName: string
      email: string
      phone: string
    }
    partyB: {
      fullName: string
      email: string
      phone: string
    }
  }
  shibariConsent: {
    nudityLevel: string
    safeWords: {
      yellow: string
      red: string
    }
    medicalConditions: string[]
  }
  cryptographicData: {
    publicKey: string
    signature: string
    dataHash: string
  }
  geolocation: {
    latitude: number
    longitude: number
  } | null
  verificationUrl: string
}

export interface PublicQRData {
  releaseId: string
  timestamp: string
  parties: string[] // Anonymized names
  sessionType: "shibari"
  cryptographicData: {
    publicKey: string
    signature: string
  }
  verificationUrl: string
}

// Generate complete release with cryptographic security
export async function generateRelease(formData: Partial<ReleaseData>): Promise<GeneratedRelease> {
  try {
    console.log("[v0] Starting release generation process")

    // Generate unique Release ID
    const releaseId = generateReleaseId()
    const timestamp = generateTimestamp()

    console.log("[v0] Generated Release ID:", releaseId)

    // Create complete release data
    const releaseData: ReleaseData = {
      id: releaseId,
      timestamp,
      language: formData.language || "ua",
      partyA: formData.partyA!,
      partyB: formData.partyB!,
      shibariConsent: formData.shibariConsent!,
      photoVideoRelease: formData.photoVideoRelease!,
      gdprConsent: formData.gdprConsent || false,
      risksAcknowledged: formData.risksAcknowledged || false,
      jurisdiction: formData.jurisdiction || "",
      signatures: formData.signatures || { partyA: "", partyB: "" },
      photos: formData.photos || {
        partyAId: "",
        partyBId: "",
        partyASelfie: "",
        partyBSelfie: "",
        jointPhoto: "",
      },
      cryptographicData: {
        publicKey: "",
        privateKey: "",
        signature: "",
        hash: "",
      },
    }

    // Create cryptographic chain
    const cryptoChain = await createCryptographicChain(releaseData)

    // Update release data with crypto information
    releaseData.cryptographicData = {
      publicKey: cryptoChain.keyPair.publicKey,
      privateKey: cryptoChain.keyPair.privateKey,
      signature: cryptoChain.signature,
      hash: cryptoChain.dataHash,
    }

    console.log("[v0] Cryptographic chain created successfully")

    // Generate verification URL (would be actual domain in production)
    const verificationUrl = `https://shibari-verify.app/verify/${releaseId}`

    // Create private QR data (full information)
    const privateQRData: PrivateQRData = {
      releaseId,
      timestamp,
      parties: {
        partyA: {
          fullName: releaseData.partyA.fullName,
          email: releaseData.partyA.email,
          phone: releaseData.partyA.phone,
        },
        partyB: {
          fullName: releaseData.partyB.fullName,
          email: releaseData.partyB.email,
          phone: releaseData.partyB.phone,
        },
      },
      shibariConsent: {
        nudityLevel: releaseData.shibariConsent.nudityLevel,
        safeWords: releaseData.shibariConsent.safeWords,
        medicalConditions: releaseData.shibariConsent.medicalConditions,
      },
      cryptographicData: {
        publicKey: cryptoChain.keyPair.publicKey,
        signature: cryptoChain.signature,
        dataHash: cryptoChain.dataHash,
      },
      geolocation: cryptoChain.geolocation,
      verificationUrl,
    }

    // Create public QR data (anonymized)
    const publicQRData: PublicQRData = {
      releaseId,
      timestamp,
      parties: [anonymizeName(releaseData.partyA.fullName), anonymizeName(releaseData.partyB.fullName)],
      sessionType: "shibari",
      cryptographicData: {
        publicKey: cryptoChain.keyPair.publicKey,
        signature: cryptoChain.signature,
      },
      verificationUrl,
    }

    console.log("[v0] Release generation completed successfully")

    return {
      releaseData,
      privateQRData,
      publicQRData,
    }
  } catch (error) {
    console.error("[v0] Error generating release:", error)
    throw new Error("Failed to generate release")
  }
}

// Anonymize name for public QR code
function anonymizeName(fullName: string): string {
  const parts = fullName.trim().split(" ")
  if (parts.length === 0) return "Anonymous"

  const firstName = parts[0]
  const lastName = parts[parts.length - 1]

  if (firstName.length === 0) return "Anonymous"

  const anonymizedFirst = firstName.charAt(0) + "*".repeat(Math.max(0, firstName.length - 1))
  const anonymizedLast = lastName.length > 0 ? lastName.charAt(0) + "." : ""

  return `${anonymizedFirst} ${anonymizedLast}`.trim()
}

// Validate release data before generation
export function validateReleaseData(formData: Partial<ReleaseData>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check required party data
  if (!formData.partyA?.fullName) errors.push("Party A full name is required")
  if (!formData.partyA?.email) errors.push("Party A email is required")
  if (!formData.partyB?.fullName) errors.push("Party B full name is required")
  if (!formData.partyB?.email) errors.push("Party B email is required")

  // Check Shibari consent
  if (!formData.shibariConsent?.safeWords?.yellow) errors.push("Yellow safe word is required")
  if (!formData.shibariConsent?.safeWords?.red) errors.push("Red safe word is required")

  // Check legal consents
  if (!formData.gdprConsent) errors.push("GDPR consent is required")
  if (!formData.risksAcknowledged) errors.push("Risk acknowledgment is required")

  // Check jurisdiction
  if (!formData.jurisdiction) errors.push("Jurisdiction must be specified")

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Generate release preview for confirmation step
export function generateReleasePreview(formData: Partial<ReleaseData>): {
  summary: {
    parties: string
    sessionType: string
    safeWords: string
    nudityLevel: string
    jurisdiction: string
  }
  consents: {
    shibari: boolean
    photoVideo: boolean
    gdpr: boolean
    risks: boolean
  }
} {
  return {
    summary: {
      parties: `${formData.partyA?.fullName || "N/A"} & ${formData.partyB?.fullName || "N/A"}`,
      sessionType: "Shibari/Kinbaku Session",
      safeWords: `Yellow: "${formData.shibariConsent?.safeWords?.yellow || "N/A"}", Red: "${formData.shibariConsent?.safeWords?.red || "N/A"}"`,
      nudityLevel: formData.shibariConsent?.nudityLevel || "not specified",
      jurisdiction: formData.jurisdiction || "not specified",
    },
    consents: {
      shibari: !!(formData.shibariConsent?.safeWords?.yellow && formData.shibariConsent?.safeWords?.red),
      photoVideo: !!formData.photoVideoRelease,
      gdpr: !!formData.gdprConsent,
      risks: !!formData.risksAcknowledged,
    },
  }
}
