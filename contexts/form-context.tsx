"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ReleaseData } from "@/lib/types"
import type { GeneratedRelease } from "@/lib/release-generator"

interface FormContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  formData: Partial<ReleaseData>
  updateFormData: (data: Partial<ReleaseData>) => void
  resetForm: () => void
  isStepValid: (step: number) => boolean
  generatedRelease: GeneratedRelease | null
  setGeneratedRelease: (release: GeneratedRelease | null) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

const initialFormData: Partial<ReleaseData> = {
  language: "ua",
  partyA: {
    fullName: "",
    dateOfBirth: "",
    idNumber: "",
    address: "",
    phone: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
    selfie: "",
    idDocument: "",
  },
  partyB: {
    fullName: "",
    dateOfBirth: "",
    idNumber: "",
    address: "",
    phone: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
    selfie: "",
    idDocument: "",
  },
  shibariConsent: {
    medicalConditions: [],
    nudityLevel: [],
    bindingTypes: [],
    bdsmPractices: [],
    safeWords: {
      yellow: "",
      red: "",
    },
    safeWord: "",
    gesture: "",
    aftercareNeeds: "",
    observersAllowed: false,
    observersForbidden: false,
    triggers: "",
    forbiddenObjects: "",
    forbiddenPoses: "",
    forbiddenColors: "",
    psychologicalTriggers: "",
    conversationalTriggers: "",
    triggersComment: "",
  },
  photoVideoRelease: {
    commercialUse: false,
    socialMedia: false,
    portfolio: false,
    exhibitions: false,
    restrictions: "",
    usageRights: [],
    anonymityOptions: [],
    compensation: "",
    commercialCompensation: "",
    financialTerms: {
      publicationAgreed: false,
      publicationNotAgreed: false,
      amount: "",
    },
  },
  gdprConsent: false,
  risksAcknowledged: false,
  jurisdiction: "",
  photos: {
    partyAId: "",
    partyBId: "",
    partyASelfie: "",
    partyBSelfie: "",
    jointPhoto: "",
  },
  signatures: {
    partyA: "",
    partyB: "",
  },
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<ReleaseData>>(initialFormData)
  const [generatedRelease, setGeneratedRelease] = useState<GeneratedRelease | null>(null)

  // Load saved form data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("shibari-form-data")
      const savedStep = localStorage.getItem("shibari-current-step")

      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setFormData({ ...initialFormData, ...parsedData })
      }

      if (savedStep) {
        setCurrentStep(Number.parseInt(savedStep, 10))
      }
    } catch (error) {
      console.error("[v0] Error loading saved form data:", error)
      // Reset to initial data if loading fails
      setFormData(initialFormData)
    }
  }, [])

  // Save form data to localStorage when changed
  useEffect(() => {
    try {
      const dataToSave = JSON.stringify(formData)
      // Check if data is too large (over 4MB)
      if (dataToSave.length > 4 * 1024 * 1024) {
        console.log("[v0] Form data too large, compressing photos...")
        // Create a copy without photos for fallback
        const dataWithoutPhotos = { ...formData }
        delete dataWithoutPhotos.photos
        localStorage.setItem("shibari-form-data", JSON.stringify(dataWithoutPhotos))
        console.log("[v0] Form data saved without photos due to size")
      } else {
        localStorage.setItem("shibari-form-data", dataToSave)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.log("[v0] Storage quota exceeded, saving without photos...")
        try {
          const dataWithoutPhotos = { ...formData }
          delete dataWithoutPhotos.photos
          localStorage.setItem("shibari-form-data", JSON.stringify(dataWithoutPhotos))
        } catch (fallbackError) {
          console.error("[v0] Failed to save even without photos:", fallbackError)
        }
      } else {
        console.error("[v0] Error saving form data:", error)
      }
    }
  }, [formData])

  useEffect(() => {
    try {
      localStorage.setItem("shibari-current-step", currentStep.toString())
    } catch (error) {
      console.error("[v0] Error saving current step:", error)
    }
  }, [currentStep])

  const updateFormData = (data: Partial<ReleaseData>) => {
    try {
      setFormData((prev) => ({ ...prev, ...data }))
      console.log("[v0] Form data updated successfully")
    } catch (error) {
      console.error("[v0] Error updating form data:", error)
    }
  }

  const resetForm = () => {
    try {
      setFormData(initialFormData)
      setCurrentStep(0)
      setGeneratedRelease(null)
      localStorage.removeItem("shibari-form-data")
      localStorage.removeItem("shibari-current-step")
      console.log("[v0] Form reset successfully")
    } catch (error) {
      console.error("[v0] Error resetting form:", error)
    }
  }

  const isStepValid = (step: number): boolean => {
    try {
      switch (step) {
        case 1: // Party A Data
          return !!(formData.partyA?.fullName && formData.partyA?.dateOfBirth && formData.partyA?.email)
        case 2: // Party B Data
          return !!(formData.partyB?.fullName && formData.partyB?.dateOfBirth && formData.partyB?.email)
        case 3: // Shibari Consent
          return !!(formData.shibariConsent?.safeWords?.yellow && formData.shibariConsent?.safeWords?.red)
        case 4: // Photo/Video Release
          return true // Optional step
        case 5: // GDPR Consent
          return !!formData.gdprConsent
        case 6: // Potential Risks
          return !!formData.risksAcknowledged
        case 7: // Jurisdiction
          return !!formData.jurisdiction
        case 8: // Confirmation
          return true
        default:
          return true
      }
    } catch (error) {
      console.error("[v0] Error validating step:", step, error)
      return false
    }
  }

  return (
    <FormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        resetForm,
        isStepValid,
        generatedRelease,
        setGeneratedRelease,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
