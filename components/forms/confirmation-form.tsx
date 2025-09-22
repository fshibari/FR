"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, FileText, Users, Shield, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"
import { DigitalSignaturePad } from "@/components/signature/digital-signature-pad"
import { generatePDFsForTelegram } from "@/lib/pdf-generator"
import { generateReleasePreview, validateReleaseData, generateRelease } from "@/lib/release-generator"
import { CameraCapture } from "@/components/camera/camera-capture"
import type { CapturedPhoto } from "@/types/photo"

interface ConfirmationFormProps {
  onNext: () => void
  onBack: () => void
}

export function ConfirmationForm({ onNext, onBack }: ConfirmationFormProps) {
  const { t } = useLanguage()
  const { formData, generatedRelease, setGeneratedRelease, updateFormData } = useForm()

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSendingToTelegram, setIsSendingToTelegram] = useState(false)
  const [telegramSent, setTelegramSent] = useState(false)

  const partyASignature = formData.signatures?.partyA || null
  const partyBSignature = formData.signatures?.partyB || null
  const jointSelfie = formData.photos?.jointPhoto || null
  const [showJointSelfieCamera, setShowJointSelfieCamera] = useState(false)

  const preview = generateReleasePreview(formData)
  const validation = validateReleaseData(formData)

  const handleGenerateRelease = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      if (!validation.isValid) {
        setError(`Помилки валідації: ${validation.errors.join(", ")}`)
        return
      }

      if (!partyASignature || !partyBSignature || !jointSelfie) {
        setError("Необхідно надати підписи обох сторін та спільне селфі")
        return
      }

      const timestamp = new Date().toISOString()
      let geolocation = null

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          })
        })
        geolocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
      } catch (geoError) {
        // Geolocation failed, continue without it
      }

      const updatedFormData = {
        ...formData,
        signatures: {
          partyA: partyASignature,
          partyB: partyBSignature,
          timestamp,
          geolocation,
        },
        photos: {
          ...formData.photos,
          jointSelfie: jointSelfie,
        },
      }

      const release = await generateRelease(updatedFormData)
      setGeneratedRelease(release)

      await handleSendToTelegram(release)

      onNext()
    } catch (err) {
      setError("Помилка генерації договору. Спробуйте ще раз.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendToTelegram = async (release: any) => {
    try {
      setIsSendingToTelegram(true)

      const telegramFormData = {
        ...release.releaseData,
        releaseId: release.releaseData.id,
      }

      const result = await generatePDFsForTelegram(telegramFormData)

      if (result.telegramSent) {
        setTelegramSent(true)
        console.log("[v0] Telegram sending successful:", result.telegramResult)
      } else {
        setError("Договір створено, але не вдалося відправити в Telegram")
      }
    } catch (error) {
      console.error("[v0] Telegram sending error:", error)
      setError("Договір створено, але не вдалося відправити в Telegram")
    } finally {
      setIsSendingToTelegram(false)
    }
  }

  const handleJointSelfieCapture = (photo: CapturedPhoto) => {
    updateFormData({
      photos: {
        ...formData.photos,
        jointPhoto: photo.dataUrl,
      },
    })
    setShowJointSelfieCamera(false)
  }

  const handlePartyASignature = (signature: string | null) => {
    updateFormData({
      signatures: {
        ...formData.signatures,
        partyA: signature,
      },
    })
  }

  const handlePartyBSignature = (signature: string | null) => {
    updateFormData({
      signatures: {
        ...formData.signatures,
        partyB: signature,
      },
    })
  }

  if (generatedRelease) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Договір успішно створено
            </CardTitle>
            <CardDescription>
              Release ID: <code className="font-mono">{generatedRelease.releaseData.id}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSendingToTelegram && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-800">Відправка PDF в Telegram архів...</span>
              </div>
            )}

            {telegramSent && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">PDF документи успішно відправлені в Telegram архів</span>
              </div>
            )}

            {!isSendingToTelegram && !telegramSent && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Документи не відправлені в архів</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendToTelegram(generatedRelease)}
                  disabled={isSendingToTelegram}
                >
                  Відправити зараз
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            {t.back}
          </Button>
          <Button onClick={onNext}>Завершити</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.steps.confirmation}</CardTitle>
          <CardDescription>
            Сторони підтверджують, що умови зрозумілі та прийняті добровільно. Електронні підписи + QR-коди є
            невід'ємною частиною цього договору.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          <Card className={validation.isValid ? "border-primary/50" : "border-destructive/50"}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-primary" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                <CardTitle className="text-lg">Статус валідації</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {validation.isValid ? (
                <p className="text-sm text-primary">Всі дані заповнені правильно</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">Знайдено помилки:</p>
                  <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Учасники
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Сторони:</strong> {preview.summary.parties}
                </p>
                <p className="text-sm">
                  <strong>Тип сесії:</strong> {preview.summary.sessionType}
                </p>
                <p className="text-sm">
                  <strong>Стоп-слова:</strong> {preview.summary.safeWords}
                </p>
                <p className="text-sm">
                  <strong>Рівень оголеності:</strong> {preview.summary.nudityLevel}
                </p>
                <p className="text-sm">
                  <strong>Юрисдикція:</strong> {preview.summary.jurisdiction}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Згоди
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  {preview.consents.shibari ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm">Shibari згода</span>
                </div>
                <div className="flex items-center gap-2">
                  {preview.consents.photoVideo ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Фото/відео реліз</span>
                </div>
                <div className="flex items-center gap-2">
                  {preview.consents.gdpr ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm">GDPR згода</span>
                </div>
                <div className="flex items-center gap-2">
                  {preview.consents.risks ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm">Підтвердження ризиків</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Фото верифікація
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "partyAId", label: "Документ A" },
                  { key: "partyBId", label: "Документ B" },
                  { key: "partySelfie", label: "Селфі" },
                  { key: "jointPhoto", label: "Спільне фото" },
                ].map((photo) => (
                  <div key={photo.key} className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                      {formData.photos?.[photo.key as keyof typeof formData.photos] ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : (
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{photo.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Частина VI. Підтвердження та підписи
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Сторони підтверджують, що умови зрозумілі та прийняті добровільно. Електронні підписи + QR-коди є
                  невід'ємною частиною цього договору.
                </p>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Юридична сила:</strong> Сторони підтверджують, що електронний підпис має для них однакову
                    юридичну силу з власноручним, оскільки дані часу та геопозиції хешуються і фіксуються у QR-коді.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Підпис Сторона А (Майстер/Оператор):</Label>
                  {!partyASignature && (
                    <div className="text-xs text-red-600 mb-2">⚠️ Потрібен підпис Сторони А для активації кнопки</div>
                  )}
                  <DigitalSignaturePad
                    onSignatureChange={handlePartyASignature}
                    placeholder="Розпишіться тут пальцем або стилусом"
                    label={`${formData.partyA?.fullName || "Сторона А"}`}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Підпис Сторона B (Модель):</Label>
                  {!partyBSignature && (
                    <div className="text-xs text-red-600 mb-2">⚠️ Потрібен підпис Сторони B для активації кнопки</div>
                  )}
                  <DigitalSignaturePad
                    onSignatureChange={handlePartyBSignature}
                    placeholder="Розпишіться тут пальцем або стилусом"
                    label={`${formData.partyB?.fullName || "Сторона B"}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Спільне селфі що підтверджує добровільність процесу:</Label>

                {!jointSelfie ? (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Зробіть нове спільне селфі разом із моделлю для підтвердження добровільності
                      </p>
                      <Button
                        onClick={() => setShowJointSelfieCamera(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Зробити спільне селфі
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Спільне селфі готове</span>
                      </div>
                      <img
                        src={jointSelfie || "/placeholder.svg"}
                        alt="Joint selfie"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        onClick={() => setShowJointSelfieCamera(true)}
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                      >
                        Переробити селфі
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="text-center">
                  <Label className="text-base font-medium">Дата: {new Date().toLocaleDateString("uk-UA")}</Label>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Мовні версії</h4>
                  <p className="text-sm text-muted-foreground">
                    Цей договір складений українською, румунською та англійською мовами. Усі версії мають однакову
                    юридичну силу. У разі розбіжностей пріоритетною є українська версія.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium">Криптографічний захист</h4>
                  <p className="text-sm text-muted-foreground">
                    Після генерації договір буде захищено Ed25519 цифровими підписами, SHA-256 хешуванням та унікальними
                    QR кодами для верифікації автентичності.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onBack}>
              {t.back}
            </Button>
            <div className="flex-1 space-y-2">
              <Button
                onClick={handleGenerateRelease}
                disabled={!validation.isValid || !partyASignature || !partyBSignature || !jointSelfie || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Генерація договору...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Згенерувати договір та QR коди
                  </>
                )}
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Валідація: {validation.isValid ? "✓" : "✗"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {partyASignature ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Підпис Сторони А: {partyASignature ? "✓" : "✗"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {partyBSignature ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Підпис Сторони B: {partyBSignature ? "✓" : "✗"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {jointSelfie ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Спільне селфі: {jointSelfie ? "✓" : "✗"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showJointSelfieCamera && (
        <CameraCapture
          onCapture={handleJointSelfieCapture}
          onCancel={() => setShowJointSelfieCamera(false)}
          captureType="joint-selfie"
          title="Зробити спільне селфі"
          description="Зробіть селфі разом з моделлю для підтвердження добровільності процесу"
        />
      )}
    </div>
  )
}
