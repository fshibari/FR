"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, FileText, Eye, Shield, Camera, QrCode } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"
import { generatePDF, downloadPDF, type PDFOptions } from "@/lib/pdf-generator"

interface PDFExportProps {
  onComplete: () => void
  onBack: () => void
}

export function PDFExport({ onComplete, onBack }: PDFExportProps) {
  const { t, language } = useLanguage()
  const { generatedRelease, resetForm } = useForm()

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    includePhotos: true,
    includePrivateData: true,
    includeQRCodes: true,
    language: language,
    watermark: undefined,
  })
  const [exportType, setExportType] = useState<"both" | "private" | "public">("both")

  if (!generatedRelease) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Contract not found. Please return to previous step.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onBack}>{t.back}</Button>
        </CardContent>
      </Card>
    )
  }

  const handleGeneratePDF = async () => {
    console.log("[v0] Starting PDF generation process...")

    try {
      setIsGenerating(true)
      setError(null)

      if (!generatedRelease) {
        throw new Error("Generated release data is missing")
      }

      // Generate PDF documents
      const pdfDocument = await generatePDF(generatedRelease, pdfOptions)

      // Download based on export type
      const releaseId = generatedRelease.releaseData.id
      const timestamp = new Date().toISOString().split("T")[0]

      if (exportType === "both" || exportType === "private") {
        downloadPDF(pdfDocument.privateVersion, `shibari-release-private-${releaseId}-${timestamp}`)
      }

      if (exportType === "both" || exportType === "public") {
        downloadPDF(pdfDocument.publicVersion, `shibari-release-public-${releaseId}-${timestamp}`)
      }

      console.log("[v0] PDF generation and download completed successfully")

      // Just show success message or stay on current page
      onComplete()
    } catch (err) {
      console.error("[v0] PDF generation error:", err)
      setError(`Error generating PDF: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartNew = () => {
    resetForm()
    console.log("[v0] Starting new release generation")
  }

  return (
    <div className="space-y-6">
      {/* Release Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t.features.pdfExport.title}
          </CardTitle>
          <CardDescription>
            Release ID: <code className="font-mono">{generatedRelease.releaseData.id}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Participants:</p>
              <p className="text-muted-foreground">
                {generatedRelease.releaseData.partyA.fullName} & {generatedRelease.releaseData.partyB.fullName}
              </p>
            </div>
            <div>
              <p className="font-medium">Creation Date:</p>
              <p className="text-muted-foreground">
                {new Date(generatedRelease.releaseData.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">{t.legal.jurisdiction}:</p>
              <p className="text-muted-foreground">{generatedRelease.releaseData.jurisdiction}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>Choose what data to include in PDF documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Export Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Type</Label>
            <RadioGroup value={exportType} onValueChange={(value) => setExportType(value as typeof exportType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="export-both" />
                <Label htmlFor="export-both">Both versions (private + public)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="export-private" />
                <Label htmlFor="export-private">Private version only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="export-public" />
                <Label htmlFor="export-public">Public version only</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Content Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Document Content</Label>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-photos"
                  checked={pdfOptions.includePhotos}
                  onCheckedChange={(checked) => setPdfOptions((prev) => ({ ...prev, includePhotos: !!checked }))}
                />
                <Label htmlFor="include-photos" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Include photo verification information
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-qr"
                  checked={pdfOptions.includeQRCodes}
                  onCheckedChange={(checked) => setPdfOptions((prev) => ({ ...prev, includeQRCodes: !!checked }))}
                />
                <Label htmlFor="include-qr" className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Include QR codes for verification
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-private"
                  checked={pdfOptions.includePrivateData}
                  onCheckedChange={(checked) => setPdfOptions((prev) => ({ ...prev, includePrivateData: !!checked }))}
                  disabled={exportType === "public"}
                />
                <Label htmlFor="include-private" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Include full personal data (private version only)
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={exportType === "public" ? "opacity-50" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Private Version</CardTitle>
              <Badge variant="destructive">Confidential</Badge>
            </div>
            <CardDescription>Complete information for internal use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span>Full names and contact details</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Detailed consents and safe words</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span>Information about all photographs</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              <span>Private QR code with complete data</span>
            </div>
          </CardContent>
        </Card>

        <Card className={exportType === "private" ? "opacity-50" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Public Version</CardTitle>
              <Badge variant="secondary">Public</Badge>
            </div>
            <CardDescription>Anonymized data for public use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span>Anonymized names (A*** B.)</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Consent confirmations without details</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span>Photo verification status</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              <span>Public QR code for verification</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack}>
          {t.back}
        </Button>
        <Button onClick={handleGeneratePDF} disabled={isGenerating} className="flex-1">
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate and Download PDF
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleStartNew}>
          New Contract
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium">PDF Document Security</h4>
              <p className="text-sm text-muted-foreground">
                PDF documents contain cryptographic signatures and hashes for authenticity verification. The private
                version contains confidential information and should be stored securely. The public version can be used
                to demonstrate the existence of the contract without revealing personal data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
