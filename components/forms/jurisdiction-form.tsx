"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"

interface JurisdictionFormProps {
  onNext: () => void
  onBack: () => void
}

export function JurisdictionForm({ onNext, onBack }: JurisdictionFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()

  const [jurisdiction, setJurisdiction] = useState(formData.jurisdiction || "")

  const handleNext = () => {
    if (!jurisdiction) {
      alert("Будь ласка, оберіть юрисдикцію")
      return
    }

    updateFormData({ jurisdiction })
    onNext()
  }

  const jurisdictions = [
    { value: "ukraine", label: "Україна" },
    { value: "romania", label: "Румунія" },
    { value: "moldova", label: "Молдова" },
    { value: "poland", label: "Польща" },
    { value: "germany", label: "Німеччина" },
    { value: "france", label: "Франція" },
    { value: "italy", label: "Італія" },
    { value: "spain", label: "Іспанія" },
    { value: "netherlands", label: "Нідерланди" },
    { value: "belgium", label: "Бельгія" },
    { value: "austria", label: "Австрія" },
    { value: "czech", label: "Чехія" },
    { value: "slovakia", label: "Словаччина" },
    { value: "hungary", label: "Угорщина" },
    { value: "other", label: "Інша (буде уточнено окремо)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Юрисдикція та спори</CardTitle>
        <CardDescription>Правове регулювання та вирішення спорів</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Removed dropdown menu for jurisdiction selection */}
        <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
          <h4 className="font-semibold">Частина V. Юрисдикція та спори</h4>
          <p className="font-medium">Цей договір регулюється законами Румунії та законодавством Європейського Союзу.</p>
          <p>
            Усі спори, що виникають із цього договору, сторони намагаються вирішувати шляхом переговорів. У разі
            недосягнення згоди спір підлягає розгляду у компетентному суді за місцем проживання Майстра (Оператора).
          </p>
          <p>
            Цей договір набирає чинності з моменту підписання і діє безстроково, якщо інше прямо не передбачено
            положеннями про відкликання згоди або додатковими угодами сторін.
          </p>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            {t.back}
          </Button>
          <Button
            onClick={() => {
              updateFormData({ jurisdiction: "romania" })
              onNext()
            }}
          >
            {t.next}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
