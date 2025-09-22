"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2, Check, Maximize2, X } from "lucide-react"

interface DigitalSignaturePadProps {
  onSignatureChange: (signature: string | null) => void
  placeholder?: string
  label?: string
  width?: number
  height?: number
}

export function DigitalSignaturePad({
  onSignatureChange,
  placeholder = "Розпишіться тут",
  label,
  width = 472,
  height = 354,
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const setupCanvas = (canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Set drawing styles
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setupCanvas(canvas, width, height)
  }, [width, height])

  useEffect(() => {
    if (isFullscreen) {
      const canvas = fullscreenCanvasRef.current
      if (!canvas) return

      // Use landscape dimensions for fullscreen
      const fullscreenWidth = Math.max(window.innerWidth, window.innerHeight)
      const fullscreenHeight = Math.min(window.innerWidth, window.innerHeight)

      setupCanvas(canvas, fullscreenWidth, fullscreenHeight)
    }
  }, [isFullscreen])

  const getActiveCanvas = () => {
    return isFullscreen ? fullscreenCanvasRef.current : canvasRef.current
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = getActiveCanvas()
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = getActiveCanvas()
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      e.preventDefault()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.stroke()

    setHasSignature(true)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = getActiveCanvas()
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const canvasWidth = isFullscreen ? Math.max(window.innerWidth, window.innerHeight) : width
    const canvasHeight = isFullscreen ? Math.min(window.innerWidth, window.innerHeight) : height

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    setHasSignature(false)
    onSignatureChange(null)
  }

  const confirmSignature = () => {
    const canvas = getActiveCanvas()
    if (!canvas) return

    // Convert to base64 and notify parent
    const signatureData = canvas.toDataURL("image/png")
    onSignatureChange(signatureData)

    // Copy signature to main canvas if in fullscreen
    if (isFullscreen) {
      const mainCanvas = canvasRef.current
      const mainCtx = mainCanvas?.getContext("2d")
      if (mainCanvas && mainCtx) {
        mainCtx.fillStyle = "#ffffff"
        mainCtx.fillRect(0, 0, width, height)

        // Scale and draw the fullscreen signature to main canvas
        mainCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height)
      }
    }

    setIsFullscreen(false)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
    // Try to rotate screen to landscape
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch(() => {
        // Ignore if orientation lock is not supported
      })
    }
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    // Unlock orientation
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock()
    }
  }

  return (
    <>
      <div className="space-y-3">
        {label && <Label className="text-sm font-medium text-muted-foreground">{label}</Label>}

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 bg-white">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded cursor-crosshair touch-none w-full"
            style={{ maxWidth: "100%", height: "auto", aspectRatio: `${width}/${height}` }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {!hasSignature && <p className="text-center text-sm text-muted-foreground mt-2">{placeholder}</p>}

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                disabled={!hasSignature}
                className="flex items-center gap-2 bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
                Очистити
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFullscreen}
                className="flex items-center gap-2 bg-transparent"
              >
                <Maximize2 className="w-4 h-4" />
                На весь екран
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {hasSignature && (
                <>
                  <Button type="button" size="sm" onClick={confirmSignature} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Підтвердити
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    Підпис готовий
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Підпис - {label}</h3>
            <Button variant="ghost" size="sm" onClick={closeFullscreen}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Signature area */}
          <div className="flex-1 p-4 flex items-center justify-center">
            <canvas
              ref={fullscreenCanvasRef}
              className="bg-white border-2 border-gray-300 cursor-crosshair touch-none max-w-full max-h-full"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          {/* Footer with controls */}
          <div className="bg-white p-4 flex justify-center gap-4">
            <Button variant="outline" onClick={clearSignature} className="flex items-center gap-2 bg-transparent">
              <Trash2 className="w-4 h-4" />
              Очистити
            </Button>
            <Button onClick={confirmSignature} disabled={!hasSignature} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Підтвердити
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
