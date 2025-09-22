"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Copy, Eye, EyeOff, Share2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { PrivateQRData, PublicQRData } from "@/lib/release-generator"
import { generatePrivateQR, generatePublicQR, generateVerificationUrl, generateQRCode } from "@/lib/qr-generator"

interface QRDisplayProps {
  privateData: PrivateQRData
  publicData: PublicQRData
  releaseId: string
}

interface SimpleQRDisplayProps {
  qrData: string
  title: string
  description: string
}

export function SimpleQRDisplay({ qrData, title, description }: SimpleQRDisplayProps) {
  const [qrImage, setQrImage] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsGenerating(true)
        const qrCode = await generateQRCode(qrData, 200)
        setQrImage(qrCode)
      } catch (error) {
        console.error("[v0] Error generating QR:", error)
      } finally {
        setIsGenerating(false)
      }
    }

    generateQR()
  }, [qrData])

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-2">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="bg-white p-2 rounded border inline-block">
        <img src={qrImage || "/placeholder.svg"} alt="QR Code" className="w-32 h-32" />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export function QRDisplay({ privateData, publicData, releaseId }: QRDisplayProps) {
  const { t } = useLanguage()

  const [privateQR, setPrivateQR] = useState<string>("")
  const [publicQR, setPublicQR] = useState<string>("")
  const [showPrivateData, setShowPrivateData] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate QR codes on component mount
  useEffect(() => {
    const generateQRCodes = async () => {
      try {
        setIsGenerating(true)
        setError(null)

        const safeReleaseId = releaseId || "TEMP-" + Date.now().toString().slice(-8)
        console.log("[v0] Generating QR codes for release:", safeReleaseId)

        // Ensure data objects have releaseId
        const safePrivateData = { ...privateData, releaseId: safeReleaseId }
        const safePublicData = { ...publicData, releaseId: safeReleaseId }

        // Generate both QR codes in parallel
        const [privateQRCode, publicQRCode] = await Promise.all([
          generatePrivateQR(safePrivateData),
          generatePublicQR(safePublicData),
        ])

        setPrivateQR(privateQRCode)
        setPublicQR(publicQRCode)

        console.log("[v0] QR codes generated successfully")
      } catch (err) {
        console.error("[v0] Error generating QR codes:", err)
        setError("Помилка генерації QR кодів")
      } finally {
        setIsGenerating(false)
      }
    }

    generateQRCodes()
  }, [privateData, publicData, releaseId])

  const downloadQR = (dataUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("[v0] QR code downloaded:", filename)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log("[v0] Copied to clipboard")
    } catch (err) {
      console.error("[v0] Failed to copy to clipboard:", err)
    }
  }

  const shareQR = async (dataUrl: string, title: string) => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], `${title}.png`, { type: "image/png" })

        await navigator.share({
          title: title,
          files: [file],
        })

        console.log("[v0] QR code shared successfully")
      } catch (err) {
        console.error("[v0] Error sharing QR code:", err)
      }
    } else {
      // Fallback: download the QR code
      downloadQR(dataUrl, `${title}.png`)
    }
  }

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Генерація QR кодів
          </CardTitle>
          <CardDescription>Створення криптографічно захищених QR кодів...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Помилка генерації QR кодів</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Release ID Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Release ID: {releaseId || "Генерується..."}
          </CardTitle>
          <CardDescription>Унікальний ідентифікатор договору з криптографічним захистом</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-3 py-2 rounded text-lg font-mono">{releaseId || "Генерується..."}</code>
            {releaseId && (
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(releaseId)}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Codes Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Public QR Code */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Публічний QR код</CardTitle>
                <CardDescription>Анонімізовані дані для публічного використання</CardDescription>
              </div>
              <Badge variant="secondary">Публічний</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border">
                <img src={publicQR || "/placeholder.svg"} alt="Public QR Code" className="w-48 h-48" />
              </div>
            </div>

            {/* Public Data Preview */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Учасники:</strong> {publicData?.parties?.join(", ") || "Не вказано"}
              </p>
              <p>
                <strong>Тип сесії:</strong> {publicData?.sessionType || "Не вказано"}
              </p>
              <p>
                <strong>Дата:</strong>{" "}
                {publicData?.timestamp ? new Date(publicData.timestamp).toLocaleDateString("uk-UA") : "Не вказано"}
              </p>
              <p>
                <strong>Верифікація:</strong> {generateVerificationUrl(releaseId || "temp", false)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadQR(publicQR, `shibari-public-${releaseId}`)}>
                <Download className="w-4 h-4 mr-2" />
                Завантажити
              </Button>
              <Button size="sm" variant="outline" onClick={() => shareQR(publicQR, `shibari-public-${releaseId}`)}>
                <Share2 className="w-4 h-4 mr-2" />
                Поділитися
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Private QR Code */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Приватний QR код</CardTitle>
                <CardDescription>Повні дані з особистою інформацією</CardDescription>
              </div>
              <Badge variant="destructive">Конфіденційно</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border">
                <img src={privateQR || "/placeholder.svg"} alt="Private QR Code" className="w-48 h-48" />
              </div>
            </div>

            {/* Private Data Preview Toggle */}
            <div className="space-y-2">
              <Button size="sm" variant="ghost" onClick={() => setShowPrivateData(!showPrivateData)} className="w-full">
                {showPrivateData ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Приховати дані
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Показати дані
                  </>
                )}
              </Button>

              {showPrivateData && (
                <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded">
                  <p>
                    <strong>Сторона A:</strong> {privateData?.parties?.partyA?.fullName || "Не вказано"}
                  </p>
                  <p>
                    <strong>Email A:</strong> {privateData?.parties?.partyA?.email || "Не вказано"}
                  </p>
                  <p>
                    <strong>Сторона B:</strong> {privateData?.parties?.partyB?.fullName || "Не вказано"}
                  </p>
                  <p>
                    <strong>Email B:</strong> {privateData?.parties?.partyB?.email || "Не вказано"}
                  </p>
                  <p>
                    <strong>Стоп-слова:</strong> {privateData?.shibariConsent?.safeWords?.yellow || "Не вказано"} /{" "}
                    {privateData?.shibariConsent?.safeWords?.red || "Не вказано"}
                  </p>
                  <p>
                    <strong>Рівень оголеності:</strong> {privateData?.shibariConsent?.nudityLevel || "Не вказано"}
                  </p>
                  {privateData?.geolocation && (
                    <p>
                      <strong>Геолокація:</strong> {privateData.geolocation.latitude?.toFixed(4) || "0.0000"},{" "}
                      {privateData.geolocation.longitude?.toFixed(4) || "0.0000"}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadQR(privateQR, `shibari-private-${releaseId}`)}>
                <Download className="w-4 h-4 mr-2" />
                Завантажити
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generateVerificationUrl(releaseId || "temp", true))}
              >
                <Copy className="w-4 h-4 mr-2" />
                Копіювати URL
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Інформація про безпеку</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>• QR коди містять криптографічні підписи Ed25519 для верифікації автентичності</p>
          <p>• Приватний QR код містить повну інформацію та повинен зберігатися в безпеці</p>
          <p>• Публічний QR код містить анонімізовані дані та може використовуватися для публічної верифікації</p>
          <p>• Всі дані захищені SHA-256 хешуванням та геолокаційними мітками</p>
        </CardContent>
      </Card>
    </div>
  )
}

export { QRDisplay as QrDisplay }
