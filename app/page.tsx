"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Languages, Shield, FileText, Camera, QrCode, Download } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { FormProvider, useForm } from "@/contexts/form-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { LanguageSelector } from "@/components/language-selector"
import { PersonDataForm } from "@/components/forms/person-data-form"
import { ShibariConsentForm } from "@/components/forms/shibari-consent-form"
import { PhotoVideoReleaseForm } from "@/components/forms/photo-video-release-form"
import { GDPRConsentForm } from "@/components/forms/gdpr-consent-form"
import { PotentialRisksForm } from "@/components/forms/potential-risks-form"
import { JurisdictionForm } from "@/components/forms/jurisdiction-form"
import { ConfirmationForm } from "@/components/forms/confirmation-form"
import { PDFExport } from "@/components/pdf/pdf-export"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const TOTAL_STEPS = 8

function HomePage() {
  const { t } = useLanguage()
  const { currentStep, setCurrentStep, isStepValid } = useForm()

  const features = [
    {
      icon: Languages,
      title: t.features.multilingual.title,
      description: t.features.multilingual.description,
    },
    {
      icon: Shield,
      title: t.features.cryptographic.title,
      description: t.features.cryptographic.description,
    },
    {
      icon: FileText,
      title: t.features.legal.title,
      description: t.features.legal.description,
    },
    {
      icon: Camera,
      title: t.features.photo.title,
      description: t.features.photo.description,
    },
    {
      icon: QrCode,
      title: t.features.qrCodes.title,
      description: t.features.qrCodes.description,
    },
    {
      icon: Download,
      title: t.features.pdfExport.title,
      description: t.features.pdfExport.description,
    },
  ]

  const stepTitles = [
    t.steps.contractPurpose, // Step 0 - Contract purpose and session details
    t.steps.partyAData,
    t.steps.partyBData,
    t.steps.shibariConsent,
    t.steps.photoVideoRelease,
    t.steps.gdprConsent,
    t.steps.potentialRisks,
    t.steps.jurisdiction,
    t.steps.confirmation,
  ]

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    console.log("[v0] PDF export process completed - staying on current page")
    // The user can use the "New Contract" button to start over if needed
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.contractPurpose.title}</CardTitle>
              <CardDescription>{t.contractPurpose.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Деталі сесії</h3>
                <div className="grid md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionLocation">{t.contractPurpose.sessionLocation}:</Label>
                    <Input id="sessionLocation" placeholder={t.contractPurpose.sessionLocation} className="w-full" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionDate">{t.contractPurpose.sessionDate}:</Label>
                      <Input id="sessionDate" type="date" className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTime">{t.contractPurpose.sessionTime}:</Label>
                      <Input id="sessionTime" type="time" className="w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(-1)}>
                  {t.backToHome}
                </Button>
                <Button onClick={() => setCurrentStep(1)}>{t.next}</Button>
              </div>
            </CardContent>
          </Card>
        )
      case 1:
        return (
          <ErrorBoundary>
            <PersonDataForm party="A" onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 2:
        return (
          <ErrorBoundary>
            <PersonDataForm party="B" onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 3:
        return (
          <ErrorBoundary>
            <ShibariConsentForm onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 4:
        return (
          <ErrorBoundary>
            <PhotoVideoReleaseForm onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 5:
        return (
          <ErrorBoundary>
            <GDPRConsentForm onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 6:
        return (
          <ErrorBoundary>
            <PotentialRisksForm onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 7:
        return (
          <ErrorBoundary>
            <JurisdictionForm onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 8:
        return (
          <ErrorBoundary>
            <ConfirmationForm onNext={handleNext} onBack={handleBack} />
          </ErrorBoundary>
        )
      case 9:
        return (
          <ErrorBoundary>
            <PDFExport onComplete={handleComplete} onBack={handleBack} />
          </ErrorBoundary>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{t.appTitle}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{t.appDescription}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentStep >= 0 && (
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(-1)} className="text-xs sm:text-sm">
                  {t.backToHome}
                </Button>
              )}
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Progress Section */}
        {currentStep >= 0 && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">{t.progress}</CardTitle>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {currentStep + 1}/{TOTAL_STEPS + 1}
                </Badge>
              </div>
              <Progress value={((currentStep + 1) / (TOTAL_STEPS + 1)) * 100} className="mt-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {stepTitles.map((title, index) => (
                  <div
                    key={index}
                    className={`p-2 sm:p-3 rounded text-xs sm:text-sm text-center cursor-pointer transition-colors ${
                      index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : index === currentStep
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => {
                      // Allow navigation to completed steps or current step
                      if (index <= currentStep) {
                        setCurrentStep(index)
                      }
                    }}
                  >
                    <div className="truncate">{title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        {currentStep === -1 && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-balance">{t.appTitle}</h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
                {t.appDescription}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                      </div>
                      <CardTitle className="text-sm sm:text-sm font-semibold">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 px-3">
                    <CardDescription className="text-xs leading-snug">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center px-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    // TODO: Open release preview modal or page
                    console.log("[v0] Opening release preview")
                  }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  {t.reviewRelease}
                </Button>
                <Button
                  size="lg"
                  onClick={() => setCurrentStep(0)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  {t.startContract}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        {currentStep >= 0 && renderCurrentStep()}
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <FormProvider>
          <HomePage />
        </FormProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
