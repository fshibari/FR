"use client"

// Cryptographic utilities for Shibari Release Generator
// Implements Ed25519 signatures, SHA-256 hashing, and AES-256-GCM encryption

export interface CryptoKeyPair {
  publicKey: string
  privateKey: string
}

export interface SignatureData {
  signature: string
  publicKey: string
  timestamp: string
}

export interface EncryptedData {
  encryptedData: string
  iv: string
  tag: string
}

// Generate Ed25519 key pair for digital signatures
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "Ed25519",
      },
      true, // extractable
      ["sign", "verify"],
    )

    const publicKeyBuffer = await window.crypto.subtle.exportKey("raw", keyPair.publicKey)
    const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)

    return {
      publicKey: bufferToBase64(publicKeyBuffer),
      privateKey: bufferToBase64(privateKeyBuffer),
    }
  } catch (error) {
    console.error("[v0] Error generating key pair:", error)
    throw new Error("Failed to generate cryptographic key pair")
  }
}

// Sign data with Ed25519 private key
export async function signData(data: string, privateKeyBase64: string): Promise<string> {
  try {
    const privateKeyBuffer = base64ToBuffer(privateKeyBase64)
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "Ed25519",
      },
      false,
      ["sign"],
    )

    const dataBuffer = new TextEncoder().encode(data)
    const signatureBuffer = await window.crypto.subtle.sign("Ed25519", privateKey, dataBuffer)

    return bufferToBase64(signatureBuffer)
  } catch (error) {
    console.error("[v0] Error signing data:", error)
    throw new Error("Failed to sign data")
  }
}

// Verify Ed25519 signature
export async function verifySignature(data: string, signature: string, publicKeyBase64: string): Promise<boolean> {
  try {
    const publicKeyBuffer = base64ToBuffer(publicKeyBase64)
    const publicKey = await window.crypto.subtle.importKey(
      "raw",
      publicKeyBuffer,
      {
        name: "Ed25519",
      },
      false,
      ["verify"],
    )

    const dataBuffer = new TextEncoder().encode(data)
    const signatureBuffer = base64ToBuffer(signature)

    return await window.crypto.subtle.verify("Ed25519", publicKey, signatureBuffer, dataBuffer)
  } catch (error) {
    console.error("[v0] Error verifying signature:", error)
    return false
  }
}

// Generate SHA-256 hash
export async function generateHash(data: string): Promise<string> {
  try {
    const dataBuffer = new TextEncoder().encode(data)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer)
    return bufferToBase64(hashBuffer)
  } catch (error) {
    console.error("[v0] Error generating hash:", error)
    throw new Error("Failed to generate hash")
  }
}

// Generate AES-256-GCM key
export async function generateAESKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  )
}

// Encrypt data with AES-256-GCM
export async function encryptData(data: string, key: CryptoKey): Promise<EncryptedData> {
  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
    const dataBuffer = new TextEncoder().encode(data)

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      dataBuffer,
    )

    // Split encrypted data and authentication tag
    const encryptedArray = new Uint8Array(encryptedBuffer)
    const encryptedData = encryptedArray.slice(0, -16) // All but last 16 bytes
    const tag = encryptedArray.slice(-16) // Last 16 bytes

    return {
      encryptedData: bufferToBase64(encryptedData),
      iv: bufferToBase64(iv),
      tag: bufferToBase64(tag),
    }
  } catch (error) {
    console.error("[v0] Error encrypting data:", error)
    throw new Error("Failed to encrypt data")
  }
}

// Decrypt data with AES-256-GCM
export async function decryptData(encryptedData: EncryptedData, key: CryptoKey): Promise<string> {
  try {
    const iv = base64ToBuffer(encryptedData.iv)
    const encrypted = base64ToBuffer(encryptedData.encryptedData)
    const tag = base64ToBuffer(encryptedData.tag)

    // Combine encrypted data and tag
    const combined = new Uint8Array(encrypted.length + tag.length)
    combined.set(new Uint8Array(encrypted))
    combined.set(new Uint8Array(tag), encrypted.length)

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      combined,
    )

    return new TextDecoder().decode(decryptedBuffer)
  } catch (error) {
    console.error("[v0] Error decrypting data:", error)
    throw new Error("Failed to decrypt data")
  }
}

// Generate unique Release ID (16 characters: AAAA-BBBB-CCCC-DDDD)
export function generateReleaseId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const segments = []

  for (let i = 0; i < 4; i++) {
    let segment = ""
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }

  return segments.join("-")
}

// Generate timestamp in ISO format with timezone
export function generateTimestamp(): string {
  return new Date().toISOString()
}

// Get geolocation (if available)
export async function getGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("[v0] Geolocation not supported")
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        console.log("[v0] Geolocation error:", error.message)
        resolve(null)
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

// Utility functions
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

// Create cryptographic chain for release data
export async function createCryptographicChain(releaseData: any): Promise<{
  keyPair: CryptoKeyPair
  dataHash: string
  signature: string
  timestamp: string
  geolocation: { latitude: number; longitude: number } | null
}> {
  try {
    console.log("[v0] Creating cryptographic chain for release data")

    // Generate key pair
    const keyPair = await generateKeyPair()
    console.log("[v0] Generated Ed25519 key pair")

    // Create data string for hashing and signing
    const dataString = JSON.stringify(releaseData, null, 0)

    // Generate hash
    const dataHash = await generateHash(dataString)
    console.log("[v0] Generated SHA-256 hash")

    // Generate timestamp
    const timestamp = generateTimestamp()

    // Get geolocation
    const geolocation = await getGeolocation()
    console.log("[v0] Retrieved geolocation:", geolocation ? "available" : "not available")

    // Create signature data
    const signaturePayload = {
      dataHash,
      timestamp,
      geolocation,
    }

    // Sign the payload
    const signature = await signData(JSON.stringify(signaturePayload), keyPair.privateKey)
    console.log("[v0] Created Ed25519 signature")

    return {
      keyPair,
      dataHash,
      signature,
      timestamp,
      geolocation,
    }
  } catch (error) {
    console.error("[v0] Error creating cryptographic chain:", error)
    throw error
  }
}

// Verify cryptographic chain
export async function verifyCryptographicChain(
  releaseData: any,
  cryptoData: {
    publicKey: string
    dataHash: string
    signature: string
    timestamp: string
    geolocation: { latitude: number; longitude: number } | null
  },
): Promise<boolean> {
  try {
    console.log("[v0] Verifying cryptographic chain")

    // Recreate data string
    const dataString = JSON.stringify(releaseData, null, 0)

    // Verify hash
    const computedHash = await generateHash(dataString)
    if (computedHash !== cryptoData.dataHash) {
      console.log("[v0] Hash verification failed")
      return false
    }

    // Recreate signature payload
    const signaturePayload = {
      dataHash: cryptoData.dataHash,
      timestamp: cryptoData.timestamp,
      geolocation: cryptoData.geolocation,
    }

    // Verify signature
    const isValidSignature = await verifySignature(
      JSON.stringify(signaturePayload),
      cryptoData.signature,
      cryptoData.publicKey,
    )

    console.log("[v0] Cryptographic chain verification:", isValidSignature ? "passed" : "failed")
    return isValidSignature
  } catch (error) {
    console.error("[v0] Error verifying cryptographic chain:", error)
    return false
  }
}
