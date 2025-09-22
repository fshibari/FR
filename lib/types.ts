export interface Language {
  code: "ua" | "ro" | "en"
  name: string
  flag: string
}

export interface PersonData {
  fullName: string
  pseudonym: string
  dateOfBirth: string
  idNumber: string
  address: string
  phone: string
  email: string
  socialMedia: string
  citizenship: string
  selfie?: string // Base64 encoded image
  documentPhoto?: string // Base64 encoded image of passport/ID first page
}

export interface ShibariConsent {
  medicalConditions: string[]
  nudityLevel: "none" | "partial" | "full"
  bindingTypes: string[]
  bdsmPractices: string[]
  safeWords: {
    yellow: string
    red: string
  }
  aftercareNeeds: string
}

export interface PhotoVideoRelease {
  commercialUse: boolean
  socialMedia: boolean
  portfolio: boolean
  exhibitions: boolean
  restrictions: string
}

export interface ReleaseData {
  id: string
  timestamp: string
  language: Language["code"]
  partyA: PersonData
  partyB: PersonData
  shibariConsent: ShibariConsent
  photoVideoRelease: PhotoVideoRelease
  gdprConsent: boolean
  risksAcknowledged: boolean
  jurisdiction: string
  signatures: {
    partyA: string
    partyB: string
  }
  photos: {
    partyAId: string
    partyBId: string
    partyASelfie: string
    partyBSelfie: string
    jointPhoto: string
  }
  cryptographicData: {
    publicKey: string
    privateKey: string
    signature: string
    hash: string
  }
}

export interface QRCodeData {
  releaseId: string
  timestamp: string
  parties: string[]
  signature: string
  publicUrl: string
}

export interface AutoTranslationRequest {
  text: string
  fromLanguage: "ua" | "ro" | "en"
  toLanguage: "ua" | "ro" | "en"
  context?: string // Optional context for better translation
}

export interface AutoTranslationResponse {
  translatedText: string
  confidence: number
  detectedLanguage?: "ua" | "ro" | "en"
}

export interface GeneratedRelease {
  releaseData: ReleaseData
  cryptographicChain: {
    hash: string
    publicKey: string
    signature: string
  }
}
