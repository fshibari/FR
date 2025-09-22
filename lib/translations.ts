export type Language = "ua" | "ro" | "en"

export interface Translations {
  // Navigation and UI
  appTitle: string
  appDescription: string
  startContract: string
  next: string
  back: string
  save: string
  cancel: string
  confirm: string
  progress: string
  backToHome: string
  reviewRelease: string

  // Steps
  steps: {
    contractPurpose: string
    partyAData: string
    partyBData: string
    shibariConsent: string
    photoVideoRelease: string
    gdprConsent: string
    potentialRisks: string
    jurisdiction: string
    photoVerification: string
    confirmation: string
  }

  // Features
  features: {
    multilingual: {
      title: string
      description: string
    }
    cryptographic: {
      title: string
      description: string
    }
    legal: {
      title: string
      description: string
    }
    photo: {
      title: string
      description: string
    }
    qrCodes: {
      title: string
      description: string
    }
    pdfExport: {
      title: string
      description: string
    }
  }

  // Contract purpose and session details
  contractPurpose: {
    title: string
    description: string
    sessionLocation: string
    sessionDate: string
    sessionTime: string
  }

  // Form fields
  form: {
    fullName: string
    pseudonym: string
    dateOfBirth: string
    idNumber: string
    address: string
    phone: string
    email: string
    emergencyContact: string
    emergencyPhone: string
    required: string
    optional: string
    selfie: string
    documentPhoto: string
    sessionLocation: string
    sessionDate: string
    sessionTime: string
    socialMedia: string
    citizenship: string
    takePhoto: string
    photoDocument: string
    selfieNotProvided: string
    documentNotProvided: string
  }

  // PDF specific translations
  pdf: {
    privateVersion: string
    publicVersion: string
    parties: string
    legalConsents: string
    gdprConsent: string
    risksAcknowledged: string
    photoVideoRelease: string
    photosVerification: string
    partyAId: string
    partyBId: string
    partyASelfie: string
    partyBSelfie: string
    jointPhoto: string
    qrVerification: string
    privateQRCode: string
    publicQRCode: string
    verify: string
    cryptographicProtection: string
    sha256Hash: string
    ed25519PublicKey: string
    digitalSignature: string
    generatedBy: string
    releaseId: string
    protectedByEd25519: string
  }

  // Shibari specific
  shibari: {
    title: string
    voluntaryParticipation: string
    safeWord: string
    safeWordsAgreed: string
    medicalLimitationsConsidered: string
    gesture: string
    aftercare: string
    healthConditions: {
      title: string
      previousInjuries: string
      currentPhysical: string
      currentEmotional: string
      medicalContraindications: string
      psychologicalTriggers: string
      absent: string
      present: string
    }
    expectations: {
      title: string
      nudityLevel: {
        title: string
        none: string
        partialUpper: string
        partialLower: string
        full: string
        dynamic: string
      }
      bindingTypes: {
        title: string
        lightPoses: string
        dynamicPoses: string
        partialSuspension: string
        fullSuspension: string
        invertedPoses: string
        legRestrictions: string
        combinedKnots: string
        objectFixation: string
        forbiddenPoses: string
      }
    }
  }

  // Legal
  legal: {
    consent: string
    acknowledge: string
    agree: string
    signature: string
    jurisdiction: string
    gdprCompliance: string
  }

  // Contract details
  contract: {
    purpose: string
    parties: {
      partyA: string
      partyB: string
    }
    copies: {
      title: string
      description: string
      private: string
      public: string
    }
  }
}

export const translations: Record<Language, Translations> = {
  ua: {
    appTitle: "UNIVERSAL РЕЛІЗ (Shibari + Фото/Відео)",
    appDescription:
      "Створюйте професійні правові договори з криптографічною безпекою, багатомовною підтримкою та повною верифікацією учасників.",
    startContract: "Розпочати створення договору",
    next: "Далі",
    back: "Назад",
    save: "Зберегти",
    cancel: "Скасувати",
    confirm: "Підтвердити",
    progress: "Прогрес заповнення",
    backToHome: "На початок",
    reviewRelease: "Ознайомитись з релізом",

    steps: {
      contractPurpose: "Мета договору",
      partyAData: "Дані сторони А",
      partyBData: "Дані сторони Б",
      shibariConsent: "Згода на Shibari",
      photoVideoRelease: "Фото/відео реліз",
      gdprConsent: "GDPR згода",
      potentialRisks: "Потенційні ризики",
      jurisdiction: "Юрисдикція",
      photoVerification: "Фото верифікація",
      confirmation: "Підтвердження",
    },

    features: {
      multilingual: {
        title: "Багатомовність",
        description: "Підтримка української, румунської та англійської мов",
      },
      cryptographic: {
        title: "Криптографічна безпека",
        description: "Ed25519 підписи та AES-256-GCM шифрування",
      },
      legal: {
        title: "Правові договори",
        description: "Повні релізи з усіма необхідними згодами",
      },
      photo: {
        title: "Фото верифікація",
        description: "Селфі та фото документів для підтвердження",
      },
      qrCodes: {
        title: "QR коди",
        description: "Унікальні коди для верифікації договорів",
      },
      pdfExport: {
        title: "PDF експорт",
        description: "Генерація приватних та публічних версій",
      },
    },

    contractPurpose: {
      title: "Мета договору (релізу)",
      description:
        "Цей договір укладається з метою підтвердження добровільної участі Моделі у Shibari-сесії та/або створенні фото- й відеоматеріалів, визначення умов проведення процесу, збереження та використання матеріалів, фіксації меж і очікувань сторін, а також розподілу відповідальності між ними. Договір регламентує творчу співпрацю між сторонами без створення трудових відносин, забезпечує захист законних прав та інтересів обох сторін і гарантує дотримання норм законодавства Європейського Союзу та Румунії, включно з положеннями GDPR. Цей реліз формується, узгоджується та підписується сторонами до початку проведення сесії, що підтверджує добровільність і усвідомленість згоди Моделі на участь у процесі та створення матеріалів.",
      sessionLocation: "Місце проведення сесії (узгоджене сторонами)",
      sessionDate: "Дата проведення сесії (узгоджене сторонами)",
      sessionTime: "Час проведення сесії (узгоджене сторонами)",
    },

    form: {
      fullName: "Прізвище та ім'я",
      pseudonym: "Псевдонім",
      dateOfBirth: "Дата народження",
      idNumber: "Номер паспорта / ID",
      address: "Адреса проживання",
      phone: "Телефон",
      email: "Email",
      socialMedia: "Посилання на соцмережі",
      citizenship: "Громадянство",
      emergencyContact: "Контакт для екстрених випадків",
      emergencyPhone: "Телефон для екстрених випадків",
      required: "Обов'язково",
      optional: "Необов'язково",
      selfie: "Селфі",
      documentPhoto: "Фото першої сторінки паспорта/ID",
      sessionLocation: "Місце проведення сесії",
      sessionDate: "Дата проведення сесії",
      sessionTime: "Час проведення сесії",
      takePhoto: "Зробити селфі",
      photoDocument: "Сфотографувати документ",
      selfieNotProvided: "Селфі не додано",
      documentNotProvided: "Фото документа не додано",
    },

    pdf: {
      privateVersion: "Приватна версія",
      publicVersion: "Публічна версія",
      parties: "Сторони договору",
      legalConsents: "Правові згоди",
      gdprConsent: "GDPR згода",
      risksAcknowledged: "Ризики підтверджені",
      photoVideoRelease: "Фото/відео реліз",
      photosVerification: "Верифікація фотографій",
      partyAId: "ID документ сторони А",
      partyBId: "ID документ сторони Б",
      partyASelfie: "Селфі сторони А",
      partyBSelfie: "Селфі сторони Б",
      jointPhoto: "Спільне фото",
      qrVerification: "QR верифікація",
      privateQRCode: "Приватний QR код",
      publicQRCode: "Публічний QR код",
      verify: "Перевірити",
      cryptographicProtection: "Криптографічний захист",
      sha256Hash: "SHA-256 хеш",
      ed25519PublicKey: "Ed25519 публічний ключ",
      digitalSignature: "Цифровий підпис",
      generatedBy: "Згенеровано",
      releaseId: "ID релізу",
      protectedByEd25519: "Захищено Ed25519",
    },

    shibari: {
      title: "Частина I. Shibari Consent & Safety (Процес)",
      voluntaryParticipation: "Участь є добровільною",
      safeWord: "Стоп-слово/сигнал",
      safeWordsAgreed: "Стоп-слова узгоджені",
      medicalLimitationsConsidered: "Медичні обмеження враховані",
      gesture: "Жест",
      aftercare: "Післядогляд",
      healthConditions: {
        title: "Стан здоров'я та обмеження (заповнюється Моделлю)",
        previousInjuries: "Попередні травми",
        currentPhysical: "Поточний стан фізичний",
        currentEmotional: "Поточний стан емоційний",
        medicalContraindications: "Медичні протипоказання",
        psychologicalTriggers: "Психологічні тригери",
        absent: "Відсутні",
        present: "Присутні (опис моделі)",
      },
      expectations: {
        title: "Очікування та межі (заповнюється Моделлю)",
        nudityLevel: {
          title: "Рівень оголеності",
          none: "Без оголеності",
          partialUpper: "Часткова (верхня частина тіла)",
          partialLower: "Часткова (нижня частина тіла)",
          full: "Повна оголеність",
          dynamic: "Оголеність у динамічних позах (під час руху, зміни позицій) – ігровий момент",
        },
        bindingTypes: {
          title: "Типи зв'язувань / позицій",
          lightPoses: "Легкі пози (сидячи, стоячи, лежачи)",
          dynamicPoses: "Динамічні пози (зміна положень під час сесії)",
          partialSuspension: "Часткове підвішування (одна точка опори)",
          fullSuspension: "Повне підвішування (без опори)",
          invertedPoses: "Зворотні пози (вниз головою)",
          legRestrictions: "Обмеження ніг",
          combinedKnots: "Комбіновані вузли / багатоточкові підвіси",
          objectFixation: "Фіксування до предметів",
          forbiddenPoses: "Заборонені пози або зони",
        },
      },
    },

    legal: {
      consent: "Згода",
      acknowledge: "Підтверджую",
      agree: "Погоджуюся",
      signature: "Підпис",
      jurisdiction: "Юрисдикція",
      gdprCompliance: "Відповідність GDPR",
    },

    contract: {
      purpose:
        "Цей договір укладається з метою підтвердження добровільної участі Моделі у Shibari-сесії та/або створенні фото- й відеоматеріалів, визначення умов проведення процесу, збереження та використання матеріалів, фіксації меж і очікувань сторін, а також розподілу відповідальності між ними.",
      parties: {
        partyA: "Сторона А: Майстер шибарі та Фото/Відео оператор (в одній особі)",
        partyB: "Сторона Б: Модель",
      },
      copies: {
        title: "Екземпляри договору",
        description: "Договір складається у двох екземплярах:",
        private:
          "Приватний екземпляр — містить повні персональні дані та використовується лише у випадку вирішення спорів, або у випадку законного запиту від державних органів.",
        public:
          "Публічний екземпляр — використовується у випадку публікації чи демонстрації, як підтвердження взаємної згоди на процес і може бути переданий третім особам.",
      },
    },
  },

  ro: {
    appTitle: "RELEASE UNIVERSAL (Shibari + Foto/Video)",
    appDescription:
      "Creați contracte juridice profesionale cu securitate criptografică, suport multilingv și verificare completă a participanților.",
    startContract: "Începe crearea contractului",
    next: "Următorul",
    back: "Înapoi",
    save: "Salvează",
    cancel: "Anulează",
    confirm: "Confirmă",
    progress: "Progresul completării",
    backToHome: "La început",
    reviewRelease: "Examinați release-ul",

    steps: {
      contractPurpose: "Scopul contractului",
      partyAData: "Date partea A",
      partyBData: "Date partea B",
      shibariConsent: "Consimțământ Shibari",
      photoVideoRelease: "Eliberare foto/video",
      gdprConsent: "Consimțământ GDPR",
      potentialRisks: "Riscuri potențiale",
      jurisdiction: "Jurisdicție",
      photoVerification: "Verificare foto",
      confirmation: "Confirmare",
    },

    features: {
      multilingual: {
        title: "Multilingv",
        description: "Suport pentru limbile ucraineană, română și engleză",
      },
      cryptographic: {
        title: "Securitate criptografică",
        description: "Semnături Ed25519 și criptare AES-256-GCM",
      },
      legal: {
        title: "Contracte legale",
        description: "Release-uri complete cu toate consimțămintele necesare",
      },
      photo: {
        title: "Verificare foto",
        description: "Selfie-uri și fotografii de documente pentru confirmare",
      },
      qrCodes: {
        title: "Coduri QR",
        description: "Coduri unice pentru verificarea contractelor",
      },
      pdfExport: {
        title: "Export PDF",
        description: "Generarea versiunilor private și publice",
      },
    },

    contractPurpose: {
      title: "Scopul contractului (release)",
      description:
        "Acest contract este încheiat cu scopul de a confirma participarea voluntară a Modelului la sesiunea Shibari și/sau la realizarea de materiale foto și video, de a stabili condițiile de desfășurare a procesului, de păstrare și utilizare a materialelor, de a fixa limitele și așteptările părților, precum și de a repartiza responsabilitățile între acestea. Contractul reglementează colaborarea creativă între părți fără a crea relații de muncă, asigură protecția drepturilor și intereselor legitime ale ambelor părți și garantează respectarea normelor legislației Uniunii Europene și a României, inclusiv a prevederilor GDPR. Acest contract este elaborat, convenit și semnat de părți înainte de începerea sesiunii, ceea ce confirmă caracterul voluntar și conștient al consimțământului Modelului de a participa la proces și de a crea materiale.",
      sessionLocation: "Locul desfășurării sesiunii (convenit de părți)",
      sessionDate: "Data desfășurării sesiunii (convenită de părți)",
      sessionTime: "Ora desfășurării sesiunii (convenită de părți)",
    },

    form: {
      fullName: "Numele complet",
      pseudonym: "Pseudonim",
      dateOfBirth: "Data nașterii",
      idNumber: "Numărul pașaportului / ID",
      address: "Adresa de domiciliu",
      phone: "Telefon",
      email: "Email",
      socialMedia: "Link către rețelele sociale",
      citizenship: "Cetățenie",
      emergencyContact: "Contact de urgență",
      emergencyPhone: "Telefon de urgență",
      required: "Obligatoriu",
      optional: "Opțional",
      selfie: "Selfie",
      documentPhoto: "Fotografia primei pagini a pașaportului/ID",
      sessionLocation: "Locul desfășurării sesiunii",
      sessionDate: "Data desfășurării sesiunii",
      sessionTime: "Ora desfășurării sesiunii",
      takePhoto: "Fă selfie",
      photoDocument: "Fotografiază documentul",
      selfieNotProvided: "Selfie nu a fost adăugat",
      documentNotProvided: "Fotografia documentului nu a fost adăugată",
    },

    pdf: {
      privateVersion: "Versiune privată",
      publicVersion: "Versiune publică",
      parties: "Părțile contractului",
      legalConsents: "Consimțăminte legale",
      gdprConsent: "Consimțământ GDPR",
      risksAcknowledged: "Riscuri recunoscute",
      photoVideoRelease: "Eliberare foto/video",
      photosVerification: "Verificarea fotografiilor",
      partyAId: "Document ID partea A",
      partyBId: "Document ID partea B",
      partyASelfie: "Selfie partea A",
      partyBSelfie: "Selfie partea B",
      jointPhoto: "Fotografie comună",
      qrVerification: "Verificare QR",
      privateQRCode: "Cod QR privat",
      publicQRCode: "Cod QR public",
      verify: "Verifică",
      cryptographicProtection: "Protecție criptografică",
      sha256Hash: "Hash SHA-256",
      ed25519PublicKey: "Cheie publică Ed25519",
      digitalSignature: "Semnătură digitală",
      generatedBy: "Generat de",
      releaseId: "ID release",
      protectedByEd25519: "Protejat de Ed25519",
    },

    shibari: {
      title: "Partea I. Shibari Consent & Safety (Proces)",
      voluntaryParticipation: "Participarea este voluntară",
      safeWord: "Cuvânt/semnal de oprire",
      safeWordsAgreed: "Cuvinte de oprire convenite",
      medicalLimitationsConsidered: "Limitări medicale considerate",
      gesture: "Gest",
      aftercare: "Îngrijire ulterioară",
      healthConditions: {
        title: "Starea de sănătate și limitări (completat de Model)",
        previousInjuries: "Leziuni anterioare",
        currentPhysical: "Starea fizică actuală",
        currentEmotional: "Starea emoțională actuală",
        medicalContraindications: "Contraindicații medicale",
        psychologicalTriggers: "Declanșatori psihologici",
        absent: "Absente",
        present: "Prezente (descrierea modelului)",
      },
      expectations: {
        title: "Așteptări și limite (completat de Model)",
        nudityLevel: {
          title: "Nivelul de nuditate",
          none: "Fără nuditate",
          partialUpper: "Parțială (partea superioară a corpului)",
          partialLower: "Parțială (partea inferioară a corpului)",
          full: "Nuditate completă",
          dynamic: "Nuditate în poziții dinamice (în timpul mișcării, schimbării pozițiilor) – moment de joc",
        },
        bindingTypes: {
          title: "Tipuri de legare / poziții",
          lightPoses: "Poziții ușoare (șezând, stând în picioare, culcat)",
          dynamicPoses: "Poziții dinamice (schimbarea pozițiilor în timpul sesiunii)",
          partialSuspension: "Suspendare parțială (un punct de sprijin)",
          fullSuspension: "Suspendare completă (fără sprijin)",
          invertedPoses: "Poziții inversate (cu capul în jos)",
          legRestrictions: "Restricții ale picioarelor",
          combinedKnots: "Noduri combinate / suspensii multipunct",
          objectFixation: "Fixarea la obiecte",
          forbiddenPoses: "Poziții sau zone interzise",
        },
      },
    },

    legal: {
      consent: "Consimțământ",
      acknowledge: "Confirm",
      agree: "Sunt de acord",
      signature: "Semnătură",
      jurisdiction: "Jurisdicție",
      gdprCompliance: "Conformitate GDPR",
    },

    contract: {
      purpose:
        "Acest contract se încheie în scopul confirmării participării voluntare a Modelului la sesiunea Shibari și/sau crearea materialelor foto și video, definirea condițiilor de desfășurare a procesului, păstrarea și utilizarea materialelor, fixarea limitelor și așteptărilor părților, precum și distribuirea responsabilității între acestea.",
      parties: {
        partyA: "Partea A: Maestru shibari și Operator foto/video (în aceeași persoană)",
        partyB: "Partea B: Model",
      },
      copies: {
        title: "Exemplare ale contractului",
        description: "Contractul se întocmește în două exemplare:",
        private:
          "Exemplarul privat — conține date personale complete și se utilizează doar în cazul rezolvării disputelor sau în cazul unei cereri legale din partea organelor de stat.",
        public:
          "Exemplarul public — se utilizează în cazul publicării sau demonstrației, ca confirmare a consimțământului mutual pentru proces și poate fi transmis terților.",
      },
    },
  },

  en: {
    appTitle: "UNIVERSAL RELEASE (Shibari + Photo/Video)",
    appDescription:
      "Create professional legal contracts with cryptographic security, multilingual support, and complete participant verification.",
    startContract: "Start creating contract",
    next: "Next",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    progress: "Completion progress",
    backToHome: "Back to Home",
    reviewRelease: "Review Release",

    steps: {
      contractPurpose: "Contract Purpose",
      partyAData: "Party A Data",
      partyBData: "Party B Data",
      shibariConsent: "Shibari Consent",
      photoVideoRelease: "Photo/Video Release",
      gdprConsent: "GDPR Consent",
      potentialRisks: "Potential Risks",
      jurisdiction: "Jurisdiction",
      photoVerification: "Photo Verification",
      confirmation: "Confirmation",
    },

    features: {
      multilingual: {
        title: "Multilingual",
        description: "Support for Ukrainian, Romanian, and English languages",
      },
      cryptographic: {
        title: "Cryptographic Security",
        description: "Ed25519 signatures and AES-256-GCM encryption",
      },
      legal: {
        title: "Legal Contracts",
        description: "Complete releases with all necessary consents",
      },
      photo: {
        title: "Photo Verification",
        description: "Selfies and document photos for confirmation",
      },
      qrCodes: {
        title: "QR Codes",
        description: "Unique codes for contract verification",
      },
      pdfExport: {
        title: "PDF Export",
        description: "Generation of private and public versions",
      },
    },

    contractPurpose: {
      title: "Purpose of the agreement (release)",
      description:
        "This agreement is concluded with the aim of confirming the Model's voluntary participation in the Shibari session and/or the creation of photo and video materials, determining the conditions for conducting the process, storing and using the materials, establishing the boundaries and expectations of the parties, and distributing responsibility between them. The agreement regulates creative cooperation between the parties without creating an employment relationship, ensures the protection of the legal rights and interests of both parties, and guarantees compliance with the laws of the European Union and Romania, including the provisions of the GDPR. This release is drafted, agreed upon, and signed by the parties prior to the start of the session, confirming the Model's voluntary and informed consent to participate in the process and create materials.",
      sessionLocation: "Place of the session (agreed by the parties)",
      sessionDate: "Date of the session (agreed by the parties)",
      sessionTime: "Time of the session (agreed by the parties)",
    },

    form: {
      fullName: "Full name",
      pseudonym: "Pseudonym",
      dateOfBirth: "Date of birth",
      idNumber: "Passport/ID number",
      address: "Residential address",
      phone: "Phone",
      email: "Email",
      socialMedia: "Social media links",
      citizenship: "Citizenship",
      emergencyContact: "Emergency contact",
      emergencyPhone: "Emergency phone",
      required: "Required",
      optional: "Optional",
      selfie: "Selfie",
      documentPhoto: "Photo of first page of passport/ID",
      sessionLocation: "Session location",
      sessionDate: "Session date",
      sessionTime: "Session time",
      takePhoto: "Take selfie",
      photoDocument: "Photograph document",
      selfieNotProvided: "Selfie not provided",
      documentNotProvided: "Document photo not provided",
    },

    pdf: {
      privateVersion: "Private Version",
      publicVersion: "Public Version",
      parties: "Contract Parties",
      legalConsents: "Legal Consents",
      gdprConsent: "GDPR Consent",
      risksAcknowledged: "Risks Acknowledged",
      photoVideoRelease: "Photo/Video Release",
      photosVerification: "Photo Verification",
      partyAId: "Party A ID Document",
      partyBId: "Party B ID Document",
      partyASelfie: "Party A Selfie",
      partyBSelfie: "Party B Selfie",
      jointPhoto: "Joint Photo",
      qrVerification: "QR Verification",
      privateQRCode: "Private QR Code",
      publicQRCode: "Public QR Code",
      verify: "Verify",
      cryptographicProtection: "Cryptographic Protection",
      sha256Hash: "SHA-256 Hash",
      ed25519PublicKey: "Ed25519 Public Key",
      digitalSignature: "Digital Signature",
      generatedBy: "Generated by",
      releaseId: "Release ID",
      protectedByEd25519: "Protected by Ed25519",
    },

    shibari: {
      title: "Part I. Shibari Consent & Safety (Process)",
      voluntaryParticipation: "Participation is voluntary",
      safeWord: "Stop word/signal",
      safeWordsAgreed: "Safe words agreed",
      medicalLimitationsConsidered: "Medical limitations considered",
      gesture: "Gesture",
      aftercare: "Aftercare",
      healthConditions: {
        title: "Health condition and limitations (filled by Model)",
        previousInjuries: "Previous injuries",
        currentPhysical: "Current physical condition",
        currentEmotional: "Current emotional condition",
        medicalContraindications: "Medical contraindications",
        psychologicalTriggers: "Psychological triggers",
        absent: "Absent",
        present: "Present (model's description)",
      },
      expectations: {
        title: "Expectations and boundaries (filled by Model)",
        nudityLevel: {
          title: "Level of nudity",
          none: "No nudity",
          partialUpper: "Partial (upper body)",
          partialLower: "Partial (lower body)",
          full: "Full nudity",
          dynamic: "Nudity in dynamic poses (during movement, position changes) – playful moment",
        },
        bindingTypes: {
          title: "Types of binding / positions",
          lightPoses: "Light poses (sitting, standing, lying)",
          dynamicPoses: "Dynamic poses (position changes during session)",
          partialSuspension: "Partial suspension (one support point)",
          fullSuspension: "Full suspension (no support)",
          invertedPoses: "Inverted poses (head down)",
          legRestrictions: "Leg restrictions",
          combinedKnots: "Combined knots / multi-point suspensions",
          objectFixation: "Fixation to objects",
          forbiddenPoses: "Forbidden poses or zones",
        },
      },
    },

    legal: {
      consent: "Consent",
      acknowledge: "I acknowledge",
      agree: "I agree",
      signature: "Signature",
      jurisdiction: "Jurisdiction",
      gdprCompliance: "GDPR Compliance",
    },

    contract: {
      purpose:
        "This contract is concluded to confirm the voluntary participation of the Model in a Shibari session and/or creation of photo and video materials, define the conditions for conducting the process, storing and using materials, fixing the boundaries and expectations of the parties, as well as distributing responsibility between them.",
      parties: {
        partyA: "Party A: Shibari Master and Photo/Video Operator (in one person)",
        partyB: "Party B: Model",
      },
      copies: {
        title: "Contract copies",
        description: "The contract consists of two copies:",
        private:
          "Private copy — contains complete personal data and is used only in case of dispute resolution or in case of a legal request from state authorities.",
        public:
          "Public copy — used in case of publication or demonstration, as confirmation of mutual consent to the process and may be transferred to third parties.",
      },
    },
  },
}

export function useTranslation(language: Language) {
  return translations[language]
}

// Auto-translation function for free text fields
export async function autoTranslate(text: string, fromLang: Language, toLang: Language): Promise<string> {
  // This would integrate with a translation service like Google Translate API
  // For now, return the original text as placeholder
  console.log(`[v0] Auto-translating "${text}" from ${fromLang} to ${toLang}`)
  return text
}

// Language detection for free text
export function detectLanguage(text: string): Language {
  // Simple language detection based on character patterns
  const ukrainianChars = /[іїєґ]/i
  const romanianChars = /[ăâîșț]/i

  if (ukrainianChars.test(text)) return "ua"
  if (romanianChars.test(text)) return "ro"
  return "en" // Default to English
}
