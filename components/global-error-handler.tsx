"use client"

import { useEffect } from "react"

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.error?.message?.includes("disconnected port object") ||
        event.error?.message?.includes("Extension context invalidated") ||
        event.error?.message?.includes("Attempting to use a disconnected port")
      ) {
        console.warn("[v0] Browser extension error suppressed:", event.error.message)
        event.preventDefault()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes("disconnected port object") ||
        event.reason?.message?.includes("Extension context invalidated") ||
        event.reason?.message?.includes("Attempting to use a disconnected port")
      ) {
        console.warn("[v0] Browser extension promise rejection suppressed:", event.reason.message)
        event.preventDefault()
        return false
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}
