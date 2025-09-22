"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Heart, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"

interface ShibariConsentFormProps {
  onNext: () => void
  onBack: () => void
}

export function ShibariConsentForm({ onNext, onBack }: ShibariConsentFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showHealthDescription, setShowHealthDescription] = useState<Record<string, boolean>>({})

  const shibariData = formData.shibariConsent || {
    medicalConditions: [],
    nudityLevel: [],
    bindingTypes: [],
    bdsmPractices: [],
    safeWords: { yellow: "", red: "" },
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
  }

  const healthConditions = [
    { key: "previousInjuries", label: "Попередні травми" },
    { key: "currentPhysical", label: "Поточний стан фізичний" },
    { key: "currentEmotional", label: "Поточний стан емоційний" },
    { key: "medicalContraindications", label: "Медичні протипоказання" },
    { key: "psychologicalTriggers", label: "Психологічні тригери" },
  ]

  const nudityOptions = [
    { value: "none", label: "Без оголеності" },
    { value: "partialUpper", label: "Часткова (верхня частина тіла)" },
    { value: "partialLower", label: "Часткова (нижня частина тіла)" },
    { value: "full", label: "Повна оголеність" },
    { value: "dynamic", label: "Оголеність у динамічних позах (під час руху, зміни позицій) – ігровий момент" },
  ]

  const bindingOptions = [
    "Легкі пози (сидячи, стоячи, лежачи)",
    "Динамічні пози (зміна положень під час сесії)",
    "Часткове підвішування (одна точка опори)",
    "Повне підвішування (без опори)",
    "Зворотні пози (вниз головою)",
    "Обмеження ніг",
    "Комбіновані вузли / багатоточкові підвіси",
    "Фіксування до предметів",
  ]

  const sensoryDeprivationOptions = ["Кляп", "Маска / закриті очі", "Навушники / шумопоглинаючі пристрої"]

  const coldOptions = [
    { value: "cold-light", label: "Light" },
    { value: "cold-medium", label: "Medium" },
    { value: "cold-hard", label: "Hard" },
  ]

  const heatOptions = [
    { value: "heat-light", label: "Лайт" },
    { value: "heat-medium", label: "Медіум" },
    { value: "heat-hard", label: "Хард" },
  ]

  const breathingOptions = [
    "Не дозволено",
    "Дозволено тільки у легкій формі (короткочасне обмеження дихання)",
    "Дозволено у контрольованій формі (з чіткими стоп-сигналами)",
    "Дозволено застосування схем зв'язування, що частково обмежують дихання",
  ]

  const impactPractices = ["Легке поплескування (hand spanking)", "Флогер", "Паддл", "Бамбуковий стек"]

  const touchOptions = [
    "Тільки технічні (виправлення мотузки, баланс)",
    "Дотики допускаються лише у межах домовленості",
    "Вільні дотики дозволені",
    "Мінімальні/жодних дотиків",
  ]

  const emotionalFormats = [
    "Лише арт / естетика (як художня фотосесія)",
    "Арт + легкий еротичний підтекст",
    "Фетишний контекст дозволений",
    "БДСМ-контекст (емоції, контроль, підкорення)",
    "Рольова гра",
    "Перформанс / публічна демонстрація",
  ]

  const observersOptions = [
    "Сторонні особи не допускаються",
    "Допускається асистент",
    "Допускається фотограф/відеооператор",
    "Допускається глядачі (наприклад: публічна демонстрація)",
  ]

  const aftercareOptions = [
    "Час на відпочинок у тиші",
    "Вода / чай / їжа",
    "Масаж / легка розминка",
    "Обійми / тілесний контакт",
    "Спілкування, психологічна підтримка",
    "Залишитись наодинці / без контакту",
  ]

  const handleMedicalChange = (condition: string, checked: boolean) => {
    const updated = checked
      ? [...shibariData.medicalConditions, condition]
      : shibariData.medicalConditions.filter((c) => c !== condition)

    updateFormData({
      shibariConsent: { ...shibariData, medicalConditions: updated },
    })
  }

  const handleBindingChange = (binding: string, checked: boolean) => {
    const updated = checked
      ? [...shibariData.bindingTypes, binding]
      : shibariData.bindingTypes.filter((b) => b !== binding)

    updateFormData({
      shibariConsent: { ...shibariData, bindingTypes: updated },
    })
  }

  const handleBdsmChange = (practice: string, checked: boolean) => {
    const updated = checked
      ? [...shibariData.bdsmPractices, practice]
      : shibariData.bdsmPractices.filter((p) => p !== practice)

    updateFormData({
      shibariConsent: { ...shibariData, bdsmPractices: updated },
    })
  }

  const handleSafeWordChange = (type: "yellow" | "red", value: string) => {
    updateFormData({
      shibariConsent: {
        ...shibariData,
        safeWords: { ...shibariData.safeWords, [type]: value },
      },
    })

    if (errors[type]) {
      setErrors((prev) => ({ ...prev, [type]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!shibariData.safeWords?.yellow?.trim()) {
      newErrors.yellow = "Стоп-слово обов'язкове"
    }

    if (!shibariData.safeWords?.red?.trim()) {
      newErrors.red = "Сигнал обов'язковий"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          {t.shibari.title}
        </CardTitle>
        <CardDescription>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold text-base text-foreground">Добровільність та безпека</p>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li className="font-medium">Участь є добровільною</li>
              <li className="font-medium">
                Модель має право зупинити процес у будь-який момент за допомогою стоп-слова/сигналу:
              </li>
              <li className="ml-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[120px]">стоп-слова (safe word):</span>
                  <Input
                    value={shibariData.safeWords?.yellow || ""}
                    onChange={(e) => handleSafeWordChange("yellow", e.target.value)}
                    className={`w-48 h-10 text-sm font-medium ${
                      errors.yellow
                        ? "border-red-500 bg-red-50"
                        : shibariData.safeWords?.yellow?.trim()
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                    }`}
                    placeholder="введіть стоп-слово"
                  />
                  {errors.yellow && <span className="text-red-500 text-sm font-medium">{errors.yellow}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[120px]">сигналу (gesture):</span>
                  <Input
                    value={shibariData.safeWords?.red || ""}
                    onChange={(e) => handleSafeWordChange("red", e.target.value)}
                    className={`w-48 h-10 text-sm font-medium ${
                      errors.red
                        ? "border-red-500 bg-red-50"
                        : shibariData.safeWords?.red?.trim()
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                    }`}
                    placeholder="введіть сигнал"
                  />
                  {errors.red && <span className="text-red-500 text-sm font-medium">{errors.red}</span>}
                </div>
              </li>
              <li className="font-medium">
                Майстер зобов'язується використовувати безпечні техніки та уважно стежити за станом моделі
              </li>
              <li className="font-medium">Модель повідомляє про свої фізичні та медичні обмеження</li>
              <li className="font-medium">Майстер забезпечує належний aftercare (післядогляд)</li>
              <li className="font-medium">
                Майстер має право відмовити у проведенні сесії, якщо виявить у Моделі ознаки стану (алкагольне чи
                наркотичне сп'яніння, хворобливий або нестабільний стан здоров'я, відкриті травми тощо), які становлять
                загрозу для її життя чи здоров'я
              </li>
            </ul>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <Label className="text-base font-medium">Стан здоров'я та обмеження</Label>
          </div>
          <div className="space-y-4">
            {healthConditions.map((condition) => (
              <div key={condition.key} className="space-y-3 p-4 border rounded-lg">
                <Label className="text-sm font-medium">{condition.label}</Label>
                <RadioGroup
                  value={shibariData.medicalConditions.includes(condition.key) ? "present" : "absent"}
                  onValueChange={(value) => {
                    const updated =
                      value === "present"
                        ? [...shibariData.medicalConditions.filter((c) => c !== condition.key), condition.key]
                        : shibariData.medicalConditions.filter((c) => c !== condition.key)
                    updateFormData({
                      shibariConsent: { ...shibariData, medicalConditions: updated },
                    })

                    setShowHealthDescription((prev) => ({
                      ...prev,
                      [condition.key]: value === "present",
                    }))
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absent" id={`${condition.key}-absent`} />
                    <Label htmlFor={`${condition.key}-absent`}>✅ {t.shibari.healthConditions.absent}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="present" id={`${condition.key}-present`} />
                    <Label htmlFor={`${condition.key}-present`}>
                      ❌ {t.shibari.healthConditions.present} (опис моделі)
                    </Label>
                  </div>
                </RadioGroup>

                {showHealthDescription[condition.key] && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor={`${condition.key}-description`} className="text-sm">
                      Опис стану:
                    </Label>
                    <Textarea
                      id={`${condition.key}-description`}
                      placeholder="Детально опишіть стан або обмеження"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Очікування та межі (заповнюється Моделлю)</Label>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">1. {t.shibari.expectations.nudityLevel.title}</Label>
          <div className="space-y-3">
            {nudityOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`nudity-${option.value}`}
                  checked={
                    Array.isArray(shibariData.nudityLevel)
                      ? shibariData.nudityLevel.includes(option.value)
                      : shibariData.nudityLevel === option.value
                  }
                  onCheckedChange={(checked) => {
                    const currentLevels = Array.isArray(shibariData.nudityLevel)
                      ? shibariData.nudityLevel
                      : shibariData.nudityLevel
                        ? [shibariData.nudityLevel]
                        : []

                    const updated = checked
                      ? [...currentLevels, option.value]
                      : currentLevels.filter((level) => level !== option.value)

                    updateFormData({
                      shibariConsent: { ...shibariData, nudityLevel: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`nudity-${option.value}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nudity-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="nudity-comment"
              placeholder="Додаткові коментарі щодо рівня оголеності"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">2. {t.shibari.expectations.bindingTypes.title}</Label>
          <div className="grid gap-3">
            {bindingOptions.map((binding) => (
              <div key={binding} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`binding-${binding}`}
                  checked={shibariData.bindingTypes.includes(binding)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...shibariData.bindingTypes, binding]
                      : shibariData.bindingTypes.filter((b) => b !== binding)
                    updateFormData({
                      shibariConsent: { ...shibariData, bindingTypes: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`binding-${binding}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {binding}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="forbidden-poses" className="text-sm font-medium">
              Заборонені пози або зони:
            </Label>
            <Textarea id="forbidden-poses" placeholder="Опишіть заборонені пози або зони тіла" rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="binding-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="binding-comment"
              placeholder="Додаткові коментарі щодо типів зв'язування"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">3. Сенсорика</Label>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Сенсорна депривація (обмеження органів чуття)</Label>
              <div className="space-y-3">
                {sensoryDeprivationOptions.map((option) => (
                  <div key={option} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={`sensory-dep-${option}`}
                      checked={shibariData.bdsmPractices.includes(option)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...shibariData.bdsmPractices, option]
                          : shibariData.bdsmPractices.filter((p) => p !== option)
                        updateFormData({
                          shibariConsent: { ...shibariData, bdsmPractices: updated },
                        })
                      }}
                      className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor={`sensory-dep-${option}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Температурні</Label>
              <div className="ml-4 space-y-4">
                <div>
                  <Label className="text-sm mb-3 block">Холод (лід)</Label>
                  <div className="ml-4 space-y-3">
                    {coldOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`cold-${option.value}`}
                          checked={shibariData.bdsmPractices.includes(`Холод ${option.label}`)}
                          onCheckedChange={(checked) => {
                            const practice = `Холод ${option.label}`
                            const updated = checked
                              ? [...shibariData.bdsmPractices, practice]
                              : shibariData.bdsmPractices.filter((p) => p !== practice)
                            updateFormData({
                              shibariConsent: { ...shibariData, bdsmPractices: updated },
                            })
                          }}
                          className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                        <Label
                          htmlFor={`cold-${option.value}`}
                          className="text-sm leading-relaxed cursor-pointer flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Тепло (теплі предмети, «гаряча піна», ваксплей)
                  </Label>
                  <div className="ml-4 space-y-3">
                    {heatOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`heat-${option.value}`}
                          checked={shibariData.bdsmPractices.includes(`Тепло ${option.label}`)}
                          onCheckedChange={(checked) => {
                            const practice = `Тепло ${option.label}`
                            const updated = checked
                              ? [...shibariData.bdsmPractices, practice]
                              : shibariData.bdsmPractices.filter((p) => p !== practice)
                            updateFormData({
                              shibariConsent: { ...shibariData, bdsmPractices: updated },
                            })
                          }}
                          className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                        <Label
                          htmlFor={`heat-${option.value}`}
                          className="text-sm leading-relaxed cursor-pointer flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sensory-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="sensory-comment"
              placeholder="Додаткові коментарі щодо сенсорних практик"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <Label className="text-base font-medium">4. Обмеження дихання (контрольована асфіксія)</Label>
          </div>
          <div className="space-y-3">
            {breathingOptions.map((option) => (
              <div key={option} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`breathing-${option}`}
                  checked={shibariData.bdsmPractices.includes(option)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...shibariData.bdsmPractices, option]
                      : shibariData.bdsmPractices.filter((p) => p !== option)
                    updateFormData({
                      shibariConsent: { ...shibariData, bdsmPractices: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`breathing-${option}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="breathing-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="breathing-comment"
              placeholder="Додаткові коментарі щодо обмеження дихання"
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="breathing-risks"
                checked={shibariData.bdsmPractices.includes("breathing-risks-acknowledged")}
                onCheckedChange={(checked) => {
                  const updated = checked
                    ? [...shibariData.bdsmPractices, "breathing-risks-acknowledged"]
                    : shibariData.bdsmPractices.filter((p) => p !== "breathing-risks-acknowledged")
                  updateFormData({
                    shibariConsent: { ...shibariData, bdsmPractices: updated },
                  })
                }}
              />
              <Label htmlFor="breathing-risks" className="text-sm">
                Модель підтверджує, що усвідомлює ризики технік, пов'язаних з частковим обмеженням дихання, і
                добровільно погоджується на їх можливе застосування.
              </Label>
            </div>
            <p className="text-xs text-amber-800">
              Майстер здійснює постійний контроль стану Моделі. У разі використання стоп-сигналу процес негайно
              припиняється. Якщо Модель не використовує стоп-сигнал, але виявлені ознаки ризику (зміна дихання, кольору
              шкіри тощо), Майстер зобов'язаний припинити або змінити техніку.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">5. Ударні практики</Label>
          <div className="grid gap-3">
            {impactPractices.map((practice) => (
              <div key={practice} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`impact-${practice}`}
                  checked={shibariData.bdsmPractices.includes(practice)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...shibariData.bdsmPractices, practice]
                      : shibariData.bdsmPractices.filter((p) => p !== practice)
                    updateFormData({
                      shibariConsent: { ...shibariData, bdsmPractices: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`impact-${practice}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {practice}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="impact-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="impact-comment"
              placeholder="Додаткові коментарі щодо ударних практик"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">6. Дотики</Label>
          <div className="space-y-3">
            {touchOptions.map((option) => (
              <div key={option} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`touch-${option}`}
                  checked={shibariData.bdsmPractices.includes(option)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...shibariData.bdsmPractices, option]
                      : shibariData.bdsmPractices.filter((p) => p !== option)
                    updateFormData({
                      shibariConsent: { ...shibariData, bdsmPractices: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`touch-${option}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="touch-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea id="touch-comment" placeholder="Додаткові коментарі щодо дотиків" rows={2} className="text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">7. Емоційний та візуальний формат</Label>
          <div className="space-y-3">
            {emotionalFormats.map((format) => (
              <div key={format} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`format-${format}`}
                  checked={shibariData.bdsmPractices.includes(format)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...shibariData.bdsmPractices, format]
                      : shibariData.bdsmPractices.filter((p) => p !== format)
                    updateFormData({
                      shibariConsent: { ...shibariData, bdsmPractices: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`format-${format}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {format}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="format-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="format-comment"
              placeholder="Додаткові коментарі щодо емоційного формату"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">8. Присутність сторонніх осіб</Label>
          <div className="grid gap-3">
            {observersOptions.map((option) => (
              <div key={option} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`observers-${option}`}
                  checked={shibariData.bdsmPractices.includes(option)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...shibariData.bdsmPractices, option]
                      : shibariData.bdsmPractices.filter((p) => p !== option)
                    updateFormData({
                      shibariConsent: { ...shibariData, bdsmPractices: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`observers-${option}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="observers-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="observers-comment"
              placeholder="Додаткові коментарі щодо присутності сторонніх осіб"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">9. Психологічні тригери / табу</Label>
          <div className="space-y-4">
            <div>
              <Label htmlFor="forbidden-objects" className="text-sm font-medium">
                Заборонені предмети:
              </Label>
              <Input
                id="forbidden-objects"
                value={shibariData.forbiddenObjects || ""}
                onChange={(e) =>
                  updateFormData({
                    shibariConsent: { ...shibariData, forbiddenObjects: e.target.value },
                  })
                }
                placeholder="Додаткові коментарі щодо заборонених предметів"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="forbidden-poses-triggers" className="text-sm font-medium">
                Заборонені пози:
              </Label>
              <Input
                id="forbidden-poses-triggers"
                value={shibariData.forbiddenPoses || ""}
                onChange={(e) =>
                  updateFormData({
                    shibariConsent: { ...shibariData, forbiddenPoses: e.target.value },
                  })
                }
                placeholder="Додаткові коментарі щодо заборонених поз"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="forbidden-colors" className="text-sm font-medium">
                Заборонені кольори мотузок / реквізиту:
              </Label>
              <Input
                id="forbidden-colors"
                value={shibariData.forbiddenColors || ""}
                onChange={(e) =>
                  updateFormData({
                    shibariConsent: { ...shibariData, forbiddenColors: e.target.value },
                  })
                }
                placeholder="Додаткові коментарі щодо заборонених кольорів"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="psychological-triggers-field" className="text-sm font-medium">
                Психологічні тригери (звук, запах, жести):
              </Label>
              <Input
                id="psychological-triggers-field"
                value={shibariData.psychologicalTriggers || ""}
                onChange={(e) =>
                  updateFormData({
                    shibariConsent: { ...shibariData, psychologicalTriggers: e.target.value },
                  })
                }
                placeholder="Додаткові коментарі щодо психологічних тригерів"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="conversational-triggers" className="text-sm font-medium">
                Тематичні розмовні тригери (слова, репліки):
              </Label>
              <Input
                id="conversational-triggers"
                value={shibariData.conversationalTriggers || ""}
                onChange={(e) =>
                  updateFormData({
                    shibariConsent: { ...shibariData, conversationalTriggers: e.target.value },
                  })
                }
                placeholder="Додаткові коментарі щодо розмовних тригерів"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="triggers-comment-field" className="text-sm font-medium">
                Додаткові коментарі:
              </Label>
              <Input
                id="triggers-comment-field"
                value={shibariData.triggersComment || ""}
                onChange={(e) =>
                  updateFormData({
                    shibariConsent: { ...shibariData, triggersComment: e.target.value },
                  })
                }
                placeholder="Додаткові коментарі щодо тригерів та обмежень"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">10. Aftercare (після сесії)</Label>
          <div className="grid gap-3">
            {aftercareOptions.map((option) => (
              <div key={option} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`aftercare-${option}`}
                  checked={shibariData.aftercareNeeds.includes(option)}
                  onCheckedChange={(checked) => {
                    const current = shibariData.aftercareNeeds.split(", ").filter(Boolean)
                    const updated = checked
                      ? [...current, option].join(", ")
                      : current.filter((item) => item !== option).join(", ")
                    updateFormData({
                      shibariConsent: { ...shibariData, aftercareNeeds: updated },
                    })
                  }}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`aftercare-${option}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="aftercare-comment" className="text-sm text-muted-foreground">
              Коментар:
            </Label>
            <Textarea
              id="aftercare-comment"
              placeholder="Додаткові коментарі щодо aftercare"
              rows={2}
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto bg-transparent">
            {t.back}
          </Button>
          <Button onClick={handleNext} className="w-full sm:w-auto">
            {t.next}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
