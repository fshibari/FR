"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"

interface PotentialRisksFormProps {
  onNext: () => void
  onBack: () => void
}

export function PotentialRisksForm({ onNext, onBack }: PotentialRisksFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()

  const [risksAcknowledged, setRisksAcknowledged] = useState(formData.risksAcknowledged || false)

  const handleNext = () => {
    if (!risksAcknowledged) {
      alert("Для продовження необхідно підтвердити розуміння потенційних ризиків")
      return
    }

    updateFormData({ risksAcknowledged })
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Потенційні ризики та відповідальність
        </CardTitle>
        <CardDescription>Інформація про можливі ризики під час Shibari-сесії</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3 text-sm">
            <p className="font-semibold">
              Модель підтверджує, що усвідомлює можливі ризики, пов'язані з процесом та створенням матеріалів, зокрема:
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>можливі синці, почервоніння шкіри, біль у м'язах чи тимчасовий дискомфорт після сесії;</li>
              <li>
                особливості окремих технік (підвішування, обмеження рухів, часткове обмеження дихання), які вимагають
                підвищеного контролю з боку Майстра;
              </li>
              <li>
                що відкликання згоди діє лише на майбутні публікації і не стосується матеріалів, вже поширених до
                моменту відкликання;
              </li>
              <li>
                що у разі вибору публікації з частковим маскуванням (наприклад, лише обличчя) завжди існує ризик
                упізнавання за іншими ознаками (татуювання, родимі плями, голос, тіло);
              </li>
              <li>
                що персональні дані та реліз зберігаються у двох сторін, і кожна несе відповідальність за безпеку своєї
                копії.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="risks-acknowledged"
              checked={risksAcknowledged}
              onCheckedChange={(checked) => setRisksAcknowledged(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="risks-acknowledged" className="text-sm leading-relaxed">
              Модель підтверджує, що ознайомлена з наведеними потенційними ризиками та добровільно приймає їх.
            </Label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            {t.back}
          </Button>
          <Button onClick={handleNext} disabled={!risksAcknowledged}>
            {t.next}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
