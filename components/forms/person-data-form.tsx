"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Camera, FileImage } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"
import { CameraCapture, type CapturedPhoto } from "@/components/camera/camera-capture"
import type { PersonData } from "@/lib/types"

interface PersonDataFormProps {
  party: "A" | "B"
  onNext: () => void
  onBack: () => void
}

export function PersonDataForm({ party, onNext, onBack }: PersonDataFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()

  const personData = party === "A" ? formData.partyA : formData.partyB
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSelfieCapture, setShowSelfieCapture] = useState(false)
  const [showDocumentCapture, setShowDocumentCapture] = useState(false)

  const handleInputChange = (field: keyof PersonData, value: string) => {
    const updatedData = {
      ...personData,
      [field]: value,
    }

    if (party === "A") {
      updateFormData({ partyA: updatedData })
    } else {
      updateFormData({ partyB: updatedData })
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSelfieCapture = (photo: CapturedPhoto) => {
    const updatedData = {
      ...personData,
      selfie: photo.dataUrl,
    }

    if (party === "A") {
      updateFormData({ partyA: updatedData })
    } else {
      updateFormData({ partyB: updatedData })
    }

    setShowSelfieCapture(false)
  }

  const handleDocumentCapture = (photo: CapturedPhoto) => {
    const updatedData = {
      ...personData,
      documentPhoto: photo.dataUrl,
    }

    if (party === "A") {
      updateFormData({ partyA: updatedData })
    } else {
      updateFormData({ partyB: updatedData })
    }

    setShowDocumentCapture(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!personData?.fullName?.trim()) {
      newErrors.fullName = `${t.form.fullName} ${t.form.required.toLowerCase()}`
    }

    if (!personData?.dateOfBirth) {
      newErrors.dateOfBirth = `${t.form.dateOfBirth} ${t.form.required.toLowerCase()}`
    }

    if (!personData?.email?.trim()) {
      newErrors.email = `${t.form.email} ${t.form.required.toLowerCase()}`
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personData.email)) {
      newErrors.email = "Невірний формат email"
    }

    if (!personData?.phone?.trim()) {
      newErrors.phone = `${t.form.phone} ${t.form.required.toLowerCase()}`
    }

    if (!personData?.selfie) {
      newErrors.selfie = `${t.form.selfie} ${t.form.required.toLowerCase()}`
    }

    if (!personData?.documentPhoto) {
      newErrors.documentPhoto = `${t.form.documentPhoto} ${t.form.required.toLowerCase()}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  if (showSelfieCapture) {
    return (
      <CameraCapture
        photoType="selfie"
        title={`${t.form.selfie} - ${party === "A" ? t.contract.parties.partyA : t.contract.parties.partyB}`}
        description="Зробіть селфі для верифікації особи"
        onPhotoCapture={handleSelfieCapture}
        onCancel={() => setShowSelfieCapture(false)}
        existingPhoto={
          personData?.selfie
            ? {
                id: `selfie-${party}`,
                dataUrl: personData.selfie,
                timestamp: new Date().toISOString(),
                type: "selfie",
                metadata: { width: 0, height: 0, size: 0 },
              }
            : null
        }
      />
    )
  }

  if (showDocumentCapture) {
    return (
      <CameraCapture
        photoType="id-document"
        title={`${t.form.documentPhoto} - ${party === "A" ? t.contract.parties.partyA : t.contract.parties.partyB}`}
        description="Сфотографуйте першу сторінку паспорта або ID"
        onPhotoCapture={handleDocumentCapture}
        onCancel={() => setShowDocumentCapture(false)}
        existingPhoto={
          personData?.documentPhoto
            ? {
                id: `document-${party}`,
                dataUrl: personData.documentPhoto,
                timestamp: new Date().toISOString(),
                type: "id-document",
                metadata: { width: 0, height: 0, size: 0 },
              }
            : null
        }
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{party === "A" ? t.steps.partyAData : t.steps.partyBData}</CardTitle>
        <CardDescription>{party === "A" ? t.contract.parties.partyA : t.contract.parties.partyB}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Фото верифікація</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Selfie */}
            <div className="space-y-2">
              <Label>
                {t.form.selfie} <span className="text-destructive">*</span>
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                {personData?.selfie ? (
                  <div className="space-y-2">
                    <img
                      src={personData.selfie || "/placeholder.svg"}
                      alt="Selfie"
                      className="w-full h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowSelfieCapture(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Змінити селфі
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileImage className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Селфі не додано</p>
                    <Button variant="outline" size="sm" onClick={() => setShowSelfieCapture(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Зробити селфі
                    </Button>
                  </div>
                )}
              </div>
              {errors.selfie && <p className="text-sm text-destructive">{errors.selfie}</p>}
            </div>

            {/* Document Photo */}
            <div className="space-y-2">
              <Label>
                {t.form.documentPhoto} <span className="text-destructive">*</span>
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                {personData?.documentPhoto ? (
                  <div className="space-y-2">
                    <img
                      src={personData.documentPhoto || "/placeholder.svg"}
                      alt="Document"
                      className="w-full h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowDocumentCapture(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Змінити фото
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileImage className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Фото документа не додано</p>
                    <Button variant="outline" size="sm" onClick={() => setShowDocumentCapture(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Сфотографувати документ
                    </Button>
                  </div>
                )}
              </div>
              {errors.documentPhoto && <p className="text-sm text-destructive">{errors.documentPhoto}</p>}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Персональні дані</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`fullName-${party}`}>
                Прізвище та ім'я <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`fullName-${party}`}
                value={personData?.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Введіть прізвище та ім'я"
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`pseudonym-${party}`}>Псевдонім</Label>
              <Input
                id={`pseudonym-${party}`}
                value={personData?.pseudonym || ""}
                onChange={(e) => handleInputChange("pseudonym", e.target.value)}
                placeholder="Введіть псевдонім (необов'язково)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dateOfBirth-${party}`}>
                {t.form.dateOfBirth} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`dateOfBirth-${party}`}
                type="date"
                value={personData?.dateOfBirth || ""}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className={errors.dateOfBirth ? "border-destructive" : ""}
              />
              {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${party}`}>
                {t.form.phone} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`phone-${party}`}
                type="tel"
                value={personData?.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+380..."
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`email-${party}`}>
                {t.form.email} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`email-${party}`}
                type="email"
                value={personData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`socialMedia-${party}`}>{t.form.socialMedia}</Label>
              <Input
                id={`socialMedia-${party}`}
                value={personData?.socialMedia || ""}
                onChange={(e) => handleInputChange("socialMedia", e.target.value)}
                placeholder="Instagram, Facebook, тощо"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`citizenship-${party}`}>{t.form.citizenship}</Label>
              <Input
                id={`citizenship-${party}`}
                value={personData?.citizenship || ""}
                onChange={(e) => handleInputChange("citizenship", e.target.value)}
                placeholder="Україна, Румунія, тощо"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`idNumber-${party}`}>{t.form.idNumber}</Label>
              <Input
                id={`idNumber-${party}`}
                value={personData?.idNumber || ""}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                placeholder="Номер паспорта або ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`address-${party}`}>{t.form.address}</Label>
            <Textarea
              id={`address-${party}`}
              value={personData?.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Повна адреса проживання"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack}>
            {t.back}
          </Button>
          <Button onClick={handleNext}>{t.next}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
