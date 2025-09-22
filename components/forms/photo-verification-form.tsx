"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, CheckCircle, AlertCircle, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"
import { CameraCapture, type CapturedPhoto } from "@/components/camera/camera-capture"

interface PhotoVerificationFormProps {
  onNext: () => void
  onBack: () => void
}

export function PhotoVerificationForm({ onNext, onBack }: PhotoVerificationFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()

  const [currentPhotoType, setCurrentPhotoType] = useState<"id-document" | "selfie" | "joint-photo" | null>(null)
  const [currentParty, setCurrentParty] = useState<"A" | "B" | null>(null)
  const [photos, setPhotos] = useState<{
    partyAId?: CapturedPhoto
    partyBId?: CapturedPhoto
    partyASelfie?: CapturedPhoto
    partyBSelfie?: CapturedPhoto
    jointPhoto?: CapturedPhoto
  }>({})

  const partyARequirements = [
    {
      type: "partyAId" as const,
      captureType: "id-document" as const,
      title: `Документ ${formData.partyA?.fullName || "Сторони A"}`,
      description: "Фото документа, що посвідчує особу (паспорт, ID-картка)",
      required: true,
    },
    {
      type: "partyASelfie" as const,
      captureType: "selfie" as const,
      title: `Селфі ${formData.partyA?.fullName || "Сторони A"}`,
      description: "Селфі з документом в руках для верифікації особи",
      required: true,
    },
  ]

  const partyBRequirements = [
    {
      type: "partyBId" as const,
      captureType: "id-document" as const,
      title: `Документ ${formData.partyB?.fullName || "Сторони B"}`,
      description: "Фото документа, що посвідчує особу (паспорт, ID-картка)",
      required: true,
    },
    {
      type: "partyBSelfie" as const,
      captureType: "selfie" as const,
      title: `Селфі ${formData.partyB?.fullName || "Сторони B"}`,
      description: "Селфі з документом в руках для верифікації особи",
      required: true,
    },
  ]

  const jointRequirements = [
    {
      type: "jointPhoto" as const,
      captureType: "joint-photo" as const,
      title: "Спільне фото",
      description: "Фото обох учасників разом для підтвердження згоди",
      required: true,
    },
  ]

  const handlePhotoCapture = (photo: CapturedPhoto, photoKey: string) => {
    console.log("[v0] Photo captured for:", photoKey, photo.id)

    const updatedPhotos = { ...photos, [photoKey]: photo }
    setPhotos(updatedPhotos)

    const photoData = {
      partyAId: updatedPhotos.partyAId?.dataUrl || "",
      partyBId: updatedPhotos.partyBId?.dataUrl || "",
      partyASelfie: updatedPhotos.partyASelfie?.dataUrl || "",
      partyBSelfie: updatedPhotos.partyBSelfie?.dataUrl || "",
      jointPhoto: updatedPhotos.jointPhoto?.dataUrl || "",
    }

    updateFormData({ photos: photoData })
    setCurrentPhotoType(null)
    setCurrentParty(null)
  }

  const handleRetakePhoto = (photoKey: string) => {
    const updatedPhotos = { ...photos }
    delete updatedPhotos[photoKey as keyof typeof photos]
    setPhotos(updatedPhotos)

    const photoData = {
      partyAId: updatedPhotos.partyAId?.dataUrl || "",
      partyBId: updatedPhotos.partyBId?.dataUrl || "",
      partyASelfie: updatedPhotos.partyASelfie?.dataUrl || "",
      partyBSelfie: updatedPhotos.partyBSelfie?.dataUrl || "",
      jointPhoto: updatedPhotos.jointPhoto?.dataUrl || "",
    }

    updateFormData({ photos: photoData })
  }

  const isFormValid = () => {
    const allRequirements = [...partyARequirements, ...partyBRequirements, ...jointRequirements]
    const requiredPhotos = allRequirements.filter((req) => req.required)
    return requiredPhotos.every((req) => photos[req.type])
  }

  const handleNext = () => {
    if (isFormValid()) {
      console.log("[v0] Photo verification completed, proceeding to next step")
      onNext()
    }
  }

  const renderPhotoSection = (requirements: typeof partyARequirements, party: "A" | "B") => (
    <div className="space-y-4">
      {requirements.map((requirement) => {
        const isCompleted = !!photos[requirement.type]
        const photo = photos[requirement.type]

        return (
          <Card key={requirement.type} className={`transition-colors ${isCompleted ? "border-primary/50" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {photo ? (
                    <img
                      src={photo.dataUrl || "/placeholder.svg"}
                      alt={requirement.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{requirement.title}</h4>
                    {requirement.required ? (
                      <Badge variant="destructive" className="text-xs">
                        Обов'язково
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Необов'язково
                      </Badge>
                    )}
                    {isCompleted && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{requirement.description}</p>

                  {photo && (
                    <div className="text-xs text-muted-foreground">
                      <p>
                        Розмір: {photo.metadata.width}×{photo.metadata.height}px
                      </p>
                      <p>Знято: {new Date(photo.timestamp).toLocaleString("uk-UA")}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                    onClick={() => {
                      setCurrentPhotoType(requirement.captureType)
                      setCurrentParty(party)
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isCompleted ? "Перезняти" : "Зняти"}
                  </Button>
                  {isCompleted && (
                    <Button size="sm" variant="ghost" onClick={() => handleRetakePhoto(requirement.type)}>
                      Видалити
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  if (currentPhotoType && currentParty) {
    const requirements =
      currentParty === "A" ? partyARequirements : currentParty === "B" ? partyBRequirements : jointRequirements
    const requirement = requirements.find((req) => req.captureType === currentPhotoType)
    if (!requirement) return null

    return (
      <CameraCapture
        photoType={currentPhotoType}
        title={requirement.title}
        description={requirement.description}
        onPhotoCapture={(photo) => handlePhotoCapture(photo, requirement.type)}
        onCancel={() => {
          setCurrentPhotoType(null)
          setCurrentParty(null)
        }}
        existingPhoto={photos[requirement.type] || null}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.steps.photoVerification}</CardTitle>
        <CardDescription>
          Зробіть необхідні фотографії для верифікації особи та підтвердження згоди на участь у сесії
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="party-a" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="party-a" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Сторона A{photos.partyAId && photos.partyASelfie && <CheckCircle className="w-4 h-4 text-primary" />}
            </TabsTrigger>
            <TabsTrigger value="party-b" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Сторона B{photos.partyBId && photos.partyBSelfie && <CheckCircle className="w-4 h-4 text-primary" />}
            </TabsTrigger>
            <TabsTrigger value="joint" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Спільне фото
              {photos.jointPhoto && <CheckCircle className="w-4 h-4 text-primary" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="party-a" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Фотографії для {formData.partyA?.fullName || "Сторони A"}</h3>
              </div>
              {renderPhotoSection(partyARequirements, "A")}
            </div>
          </TabsContent>

          <TabsContent value="party-b" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Фотографії для {formData.partyB?.fullName || "Сторони B"}</h3>
              </div>
              {renderPhotoSection(partyBRequirements, "B")}
            </div>
          </TabsContent>

          <TabsContent value="joint" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Спільні фотографії</h3>
              </div>
              {renderPhotoSection(jointRequirements, "A")}
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {isFormValid() ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-medium">Прогрес: {Object.keys(photos).length} з 5 обов'язкових фото</span>
          </div>
          {!isFormValid() && (
            <p className="text-sm text-muted-foreground">Завершіть всі обов'язкові фотографії для продовження</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack}>
            {t.back}
          </Button>
          <Button onClick={handleNext} disabled={!isFormValid()}>
            {t.next}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
