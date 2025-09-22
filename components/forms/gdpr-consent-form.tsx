"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"

interface GDPRConsentFormProps {
  onNext: () => void
  onBack: () => void
}

export function GDPRConsentForm({ onNext, onBack }: GDPRConsentFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()

  const [gdprConsent, setGdprConsent] = useState(formData.gdprConsent || false)

  const handleNext = () => {
    if (!gdprConsent) {
      alert("Для продовження необхідно надати згоду на обробку персональних даних")
      return
    }

    updateFormData({ gdprConsent })
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Частина III. GDPR та електронна верифікація</CardTitle>
        <CardDescription>Згода на обробку персональних даних та електронна верифікація</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-4 text-sm">
            <p>
              - Модель надає згоду на обробку та зберігання персональних даних (Селфі, ПІБ, Псевдонім, Дата народження,
              Телефон, Еmail, Посилання на соцмережі, Адреса проживання, Громадянство, Номер паспорта / ID, Фото першої
              сторінки паспорта/ID).
            </p>

            <p>
              - Договір підтверджується електронними підписами сторін, таймінгом, геопозицією та спільним селфі, що
              засвідчує добровільну участь у сесії, а також хешується у кюар код для електронної верифікації.
            </p>

            <p>- Система генерує два типи QR-кодів у форматі JSON з хешованими даними:</p>
            <ul className="ml-4 space-y-1">
              <li>- Приватний — з повними даними.</li>
              <li>- Публічний — з анонімізованими даними («Ім'я1», «Дата1») для передачі третім особам.</li>
            </ul>

            <p>
              Персональні дані та відеоархів зберігаються у зашифрованому вигляді, доступ до них захищений паролем і
              надається виключно Оператору.
            </p>

            <p>
              Персональні дані та матеріали зберігаються не менше ніж 5 (п'яти) років з моменту підписання цього
              договору, а надалі — виключно на підставі законного інтересу Оператора для захисту своїх прав у разі
              спорів.
            </p>

            <p>Використання приватного та публічного екземплярів визначене у розділі „Екземпляри договору"</p>

            <p>
              Модель зобов'язана зберігати власну копію договору у захищеному вигляді (наприклад, у зашифрованому
              цифровому архіві або під паролем), та несе повну відповідальність у випадку витоку персональних даних із
              її копії.
            </p>

            <p>
              Модель надає згоду на зберігання відео- та аудіозапису процесу сесії у приватному архіві Оператора. Такі
              записи зберігаються виключно з метою підтвердження добровільності участі, контролю безпеки та захисту
              законних прав у разі спорів. Записи не підлягають передачі третім особам, окрім випадків законного запиту
              державних органів чи суду.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="gdpr-consent"
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="gdpr-consent" className="text-sm leading-relaxed">
              Я надаю добровільну та усвідомлену згоду на обробку моїх персональних даних відповідно до зазначених вище
              цілей та умов. Я розумію свої права та можу відкликати цю згоду у будь-який час.
            </Label>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Увага:</strong> Без надання згоди на обробку персональних даних проведення сесії неможливе.
          </p>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            {t.back}
          </Button>
          <Button onClick={handleNext} disabled={!gdprConsent}>
            {t.next}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
