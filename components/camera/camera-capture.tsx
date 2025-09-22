"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, RotateCcw, Check, X, Upload } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: string
  type: "id-document" | "selfie" | "joint-photo"
  metadata: {
    width: number
    height: number
    size: number
  }
}

interface CameraCaptureProps {
  photoType?: "id-document" | "selfie" | "joint-photo"
  title?: string
  description?: string
  onPhotoCapture?: (photo: CapturedPhoto) => void
  onCapture?: (imageData: string) => void // Added simple onCapture for direct image data
  onCancel?: () => void
  existingPhoto?: CapturedPhoto | null
  facingMode?: "user" | "environment" // Added facingMode prop
  aspectRatio?: "video" | "square" // Added aspectRatio prop
}

export function CameraCapture({
  photoType = "joint-photo", // Default to joint-photo
  title,
  description,
  onPhotoCapture,
  onCapture, // New simple capture callback
  onCancel,
  existingPhoto,
  facingMode: initialFacingMode = "user", // Use prop for initial facing mode
  aspectRatio = "video", // Default aspect ratio
}: CameraCaptureProps) {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(existingPhoto?.dataUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">(initialFacingMode) // Use prop
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [hasCheckedDevices, setHasCheckedDevices] = useState(false)

  const checkAvailableCameras = useCallback(async () => {
    try {
      console.log("[v0] Checking available camera devices...")

      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
        tempStream.getTracks().forEach((track) => track.stop())
      } catch (permError) {
        console.log("[v0] Permission request failed, continuing with device enumeration:", permError)
      }

      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter((device) => device.kind === "videoinput")

      console.log("[v0] Found cameras:", cameras.length)
      cameras.forEach((camera, index) => {
        console.log(`[v0] Camera ${index + 1}:`, {
          deviceId: camera.deviceId,
          label: camera.label || `Camera ${index + 1}`,
          groupId: camera.groupId,
        })
      })

      setAvailableCameras(cameras)
      setHasCheckedDevices(true)

      if (cameras.length === 0) {
        setError("Не знайдено жодної камери. Будь ласка, завантажіть фото з файлу.")
        return false
      }

      return true
    } catch (err) {
      console.error("[v0] Error checking camera devices:", err)
      setError("Помилка при перевірці доступних камер. Спробуйте завантажити фото з файлу.")
      setHasCheckedDevices(true)
      return false
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      console.log("[v0] Starting camera with facing mode:", facingMode)

      if (!hasCheckedDevices) {
        const hasDevices = await checkAvailableCameras()
        if (!hasDevices) return
      }

      if (availableCameras.length === 0) {
        setError("Не знайдено жодної камери. Будь ласка, завантажіть фото з файлу.")
        return
      }

      let stream: MediaStream | null = null

      const cameraConstraints = {
        video: {
          width: { ideal: 708 },
          height: { ideal: 944 },
          aspectRatio: { ideal: 3 / 4 }, // Always 3:4 for all photo types
          facingMode: facingMode,
        },
        audio: false,
      }

      try {
        const preferredCamera = availableCameras.find((camera) =>
          facingMode === "user"
            ? camera.label.toLowerCase().includes("front") || camera.label.toLowerCase().includes("user")
            : camera.label.toLowerCase().includes("back") || camera.label.toLowerCase().includes("environment"),
        )

        if (preferredCamera) {
          console.log("[v0] Trying preferred camera:", preferredCamera.label)
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: preferredCamera.deviceId },
              width: { ideal: 708 },
              height: { ideal: 944 },
              aspectRatio: { ideal: 3 / 4 }, // Always 3:4
            },
            audio: false,
          })
        } else {
          stream = await navigator.mediaDevices.getUserMedia(cameraConstraints)
        }
      } catch (specificError) {
        console.log("[v0] Specific camera failed, trying first available:", specificError)

        try {
          const firstCamera = availableCameras[0]
          console.log("[v0] Trying first available camera:", firstCamera.label)

          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: firstCamera.deviceId },
              width: { ideal: 708 },
              height: { ideal: 944 },
              aspectRatio: { ideal: 3 / 4 }, // Always 3:4
            },
            audio: false,
          })
          console.log("[v0] First available camera access successful")
        } catch (fallbackError) {
          console.log("[v0] First camera failed, trying basic constraints:", fallbackError)

          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              aspectRatio: { ideal: 3 / 4 }, // Always 3:4
            },
            audio: false,
          })
          console.log("[v0] Basic camera access successful")
        }
      }

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
        console.log("[v0] Camera stream started successfully")
      }
    } catch (err) {
      console.error("[v0] Error accessing camera:", err)
      setError(
        "Не вдалося отримати доступ до камери. Перевірте дозволи браузера або спробуйте завантажити фото з файлу.",
      )
    }
  }, [facingMode, availableCameras, hasCheckedDevices, checkAvailableCameras, photoType])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
      console.log("[v0] Camera stream stopped")
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Always use 3:4 aspect ratio (708x944)
    const targetWidth = 708
    const targetHeight = 944

    canvas.width = targetWidth
    canvas.height = targetHeight

    const videoAspect = video.videoWidth / video.videoHeight
    const targetAspect = targetWidth / targetHeight

    let sourceWidth = video.videoWidth
    let sourceHeight = video.videoHeight
    let sourceX = 0
    let sourceY = 0

    // Center crop to maintain aspect ratio
    if (videoAspect > targetAspect) {
      // Video is wider than target - crop sides
      sourceWidth = video.videoHeight * targetAspect
      sourceX = (video.videoWidth - sourceWidth) / 2
    } else {
      // Video is taller than target - crop top/bottom
      sourceHeight = video.videoWidth / targetAspect
      sourceY = (video.videoHeight - sourceHeight) / 2
    }

    // Draw the cropped and centered image
    context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.5)
    setCapturedPhoto(dataUrl)
    stopCamera()

    console.log("[v0] Photo captured with 3:4 aspect ratio and proper centering:", targetWidth + "x" + targetHeight)
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Будь ласка, виберіть файл зображення")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setCapturedPhoto(dataUrl)
      console.log("[v0] Photo uploaded from file")
    }
    reader.readAsDataURL(file)
  }, [])

  const confirmPhoto = useCallback(() => {
    if (!capturedPhoto) return

    try {
      console.log("[v0] Starting photo confirmation process")

      if (onCapture) {
        onCapture(capturedPhoto)
        console.log("[v0] Photo confirmed via onCapture callback")
        return
      }

      if (onPhotoCapture) {
        const img = new Image()
        img.onload = () => {
          try {
            const photo: CapturedPhoto = {
              id: `${photoType}-${Date.now()}`,
              dataUrl: capturedPhoto,
              timestamp: new Date().toISOString(),
              type: photoType,
              metadata: {
                width: img.width,
                height: img.height,
                size: Math.round((capturedPhoto.length * 3) / 4),
              },
            }

            console.log("[v0] Photo object created successfully:", photo.id)
            onPhotoCapture(photo)
            console.log("[v0] Photo confirmed and saved:", photo.id)
          } catch (error) {
            console.error("[v0] Error creating photo object:", error)
            setError("Помилка при обробці фото. Спробуйте ще раз.")
          }
        }

        img.onerror = () => {
          console.error("[v0] Error loading image for processing")
          setError("Помилка при завантаженні фото. Спробуйте ще раз.")
        }

        img.src = capturedPhoto
      }
    } catch (error) {
      console.error("[v0] Error in confirmPhoto:", error)
      setError("Помилка при підтвердженні фото. Спробуйте ще раз.")
    }
  }, [capturedPhoto, photoType, onPhotoCapture, onCapture])

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null)
    startCamera()
  }, [startCamera])

  const switchCamera = useCallback(() => {
    stopCamera()
    setTimeout(() => {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    }, 100)
  }, [stopCamera])

  useEffect(() => {
    if (isStreaming) {
      startCamera()
    }
  }, [facingMode, isStreaming, startCamera])

  useEffect(() => {
    if ((photoType === "joint-photo" || onCapture) && !capturedPhoto) {
      console.log("[v0] Auto-starting camera for joint photo or simple capture mode")
      startCamera()
    }
  }, [photoType, capturedPhoto, startCamera, onCapture])

  useEffect(() => {
    if (photoType === "joint-photo" && !capturedPhoto) {
      startCamera()
    }
  }, [photoType, capturedPhoto, startCamera])

  useEffect(() => {
    checkAvailableCameras()
  }, [checkAvailableCameras])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  if (onCapture) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="relative bg-muted rounded-lg overflow-hidden aspect-[3/4]">
          {capturedPhoto ? (
            <img src={capturedPhoto || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
          ) : isStreaming ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <div className="absolute inset-4 border-2 border-white/50 rounded-lg pointer-events-none">
                <div className="absolute inset-0 border border-white/30 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white rounded-full" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center space-y-2">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Камера не активна</p>
              </div>
            </div>
          )}

          {isStreaming && !capturedPhoto && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button size="sm" variant="secondary" onClick={switchCamera}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="lg" onClick={capturePhoto} className="rounded-full w-16 h-16">
                <Camera className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-2 justify-center">
          {capturedPhoto ? (
            <>
              <Button variant="outline" onClick={retakePhoto}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Перезняти
              </Button>
              <Button onClick={confirmPhoto}>
                <Check className="w-4 h-4 mr-2" />
                Підтвердити
              </Button>
            </>
          ) : (
            <>
              {!isStreaming && (
                <Button onClick={startCamera}>
                  <Camera className="w-4 h-4 mr-2" />
                  Увімкнути камеру
                </Button>
              )}
            </>
          )}

          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Скасувати
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline">{photoType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="relative bg-muted rounded-lg overflow-hidden aspect-[3/4]">
          {capturedPhoto ? (
            <img src={capturedPhoto || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
          ) : isStreaming ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <div className="absolute inset-4 border-2 border-white/50 rounded-lg pointer-events-none">
                <div className="absolute inset-0 border border-white/30 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white rounded-full" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center space-y-2">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Камера не активна</p>
              </div>
            </div>
          )}

          {isStreaming && !capturedPhoto && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button size="sm" variant="secondary" onClick={switchCamera}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="lg" onClick={capturePhoto} className="rounded-full w-16 h-16">
                <Camera className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          capture={photoType === "selfie" ? "user" : "environment"}
        />

        <div className="flex gap-2 justify-center">
          {capturedPhoto ? (
            <>
              <Button variant="outline" onClick={retakePhoto}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Перезняти
              </Button>
              <Button onClick={confirmPhoto}>
                <Check className="w-4 h-4 mr-2" />
                Підтвердити
              </Button>
            </>
          ) : (
            <>
              {!isStreaming && (
                <Button onClick={startCamera}>
                  <Camera className="w-4 h-4 mr-2" />
                  Увімкнути камеру
                </Button>
              )}
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Завантажити файл
              </Button>
            </>
          )}

          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Скасувати
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Рекомендації для фото:</p>
          {photoType === "id-document" && (
            <ul className="list-disc list-inside space-y-1">
              <li>Документ повинен бути чітко видимий</li>
              <li>Уникайте відблисків та тіней</li>
              <li>Розмістіть документ на контрастному фоні</li>
            </ul>
          )}
          {photoType === "selfie" && (
            <ul className="list-disc list-inside space-y-1">
              <li>Обличчя повинно бути чітко видимим</li>
              <li>Дивіться прямо в камеру</li>
              <li>Забезпечте хороше освітлення</li>
            </ul>
          )}
          {photoType === "joint-photo" && (
            <ul className="list-disc list-inside space-y-1">
              <li>Обидві особи повинні бути видимими</li>
              <li>Тримайте документи поруч з обличчями</li>
              <li>Переконайтеся, що всі елементи в фокусі</li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
