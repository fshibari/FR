"use client"

import { useCallback } from "react"

const STORAGE_KEY = "shibari-form-data" // Declare STORAGE_KEY
const STORAGE_LIMIT = 4 * 1024 * 1024 // 4MB limit for localStorage
const MAX_IMAGE_SIZE = 800 * 1024 // 800KB per image for 6x8cm photos

const compressImage = (base64: string): string => {
  try {
    // If image is too large, return a placeholder
    if (base64.length > MAX_IMAGE_SIZE) {
      console.log("[v0] Image too large, using placeholder")
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OTk5OSI+Rkm0byDQt9Cw0LLQsNC90YLQsNC20LXQvdC+PC90ZXh0Pjwvc3ZnPg=="
    }
    return base64
  } catch (error) {
    console.error("[v0] Error compressing image:", error)
    return base64
  }
}

const checkStorageSpace = (): boolean => {
  try {
    const used = new Blob(Object.values(localStorage)).size
    return used < STORAGE_LIMIT
  } catch {
    return false
  }
}

const clearOldData = () => {
  try {
    // Clear old form data if storage is full
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("shibari-") && key !== STORAGE_KEY) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("[v0] Error clearing old data:", error)
  }
}

const getFormData = (): Partial<FormData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("[v0] Error retrieving form data:", error)
    return {}
  }
}

export const useFormStorage = () => {
  const saveFormData = useCallback((data: Partial<FormData>) => {
    try {
      // Check storage space before saving
      if (!checkStorageSpace()) {
        clearOldData()
      }

      // Compress images before saving
      const compressedData = { ...data }
      if (compressedData.photos) {
        Object.keys(compressedData.photos).forEach((key) => {
          if (compressedData.photos![key]?.data) {
            compressedData.photos![key]!.data = compressImage(compressedData.photos![key]!.data)
          }
        })
      }

      const currentData = getFormData()
      const updatedData = { ...currentData, ...compressedData }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
      console.log("[v0] Form data saved successfully")
    } catch (error) {
      console.error("[v0] Error saving form data:", error)
      // If still failing, try to save without images
      try {
        const dataWithoutImages = { ...data }
        delete dataWithoutImages.photos
        const currentData = getFormData()
        const updatedData = { ...currentData, ...dataWithoutImages }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
        console.log("[v0] Form data saved without images")
      } catch (fallbackError) {
        console.error("[v0] Failed to save even without images:", fallbackError)
      }
    }
  }, [])

  const loadFormData = useCallback((): Partial<FormData> => {
    return getFormData()
  }, [])

  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log("[v0] Form data cleared successfully")
    } catch (error) {
      console.error("[v0] Error clearing form data:", error)
    }
  }, [])

  return {
    saveFormData,
    loadFormData,
    clearFormData,
  }
}
