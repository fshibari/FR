"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLanguage } from "@/contexts/language-context"
import { useForm } from "@/contexts/form-context"
import { useMemo } from "react"

interface PhotoVideoReleaseFormProps {
  onNext: () => void
  onBack: () => void
}

export function PhotoVideoReleaseForm({ onNext, onBack }: PhotoVideoReleaseFormProps) {
  const { t } = useLanguage()
  const { formData, updateFormData } = useForm()

  const photoVideoData = useMemo(() => {
    const data = formData.photoVideoRelease || {
      usageRights: [],
      otherUsage: "",
      commercialUse: false,
      commercialCompensation: "",
      commercialPaymentDays: "",
      anonymityOptions: [],
      anonymityRiskAcknowledged: false,
      financialTerms: {
        publicationAgreed: false,
        publicationNotAgreed: false,
        tfpOrAmount: "tfp", // "tfp" or "amount"
        agreedAmount: "",
        notAgreedAmount: "",
      },
      monetizationUnderstanding: false,
    }
    return data
  }, [formData.photoVideoRelease])

  const usageRightsOptions = [
    "особисте портфоліо",
    "публікації у соціальних мережах",
    "участь у виставках, конкурсах, фестивалях",
    "друк у спеціалізованих виданнях",
    "матеріали можуть бути використані у навчальних цілях, зокрема для проведення майстер-класів, воркшопів, семінарів чи демонстрацій у закритих професійних спільнотах",
  ]

  const anonymityOptions = [
    "Дозволено публічно показувати обличчя",
    "Маскування обличчя",
    "Кадрування обличчя",
    "Використання псевдоніму",
    "Фото без обличчя",
    "Пост-обробка – блюр обличчя",
    "Пост-обробка – блюр татуювань, пірсингу, родимих плям",
  ]

  const handleUsageRightChange = (right: string, checked: boolean) => {
    const updated = checked
      ? [...(photoVideoData.usageRights || []), right]
      : (photoVideoData.usageRights || []).filter((r) => r !== right)

    updateFormData({
      photoVideoRelease: { ...photoVideoData, usageRights: updated },
    })
  }

  const handleAnonymityChange = (option: string, checked: boolean) => {
    const updated = checked
      ? [...(photoVideoData.anonymityOptions || []), option]
      : (photoVideoData.anonymityOptions || []).filter((o) => o !== option)

    updateFormData({
      photoVideoRelease: { ...photoVideoData, anonymityOptions: updated },
    })
  }

  const handleNext = () => {
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Частина II. Photo/Video Release (Контент)</CardTitle>
        <CardDescription>
          Модель надає Оператору згоду на створення її зображень (фото та відео) під час сесії
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Предмет договору</h3>
          <div className="space-y-3 text-sm">
            <p>
              Модель надає Оператору згоду на створення її зображень (фото та відео) під час сесії, у формах та межах,
              визначених у розділі «Очікування та межі» цього договору. Модель надає згоду на відео- та аудіофіксацію
              процесу сесії виключно з метою підтвердження добровільності участі, контролю безпеки та можливого
              використання у разі спорів або претензій.
            </p>

            <div className="pl-4 space-y-2">
              <p>
                <strong>Оператор (Майстер/Фото-відео оператор):</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>відповідає за технічну якість зйомки та збереження матеріалів;</li>
                <li>гарантує дотримання узгоджених меж та рівня конфіденційності, зазначених у договорі;</li>
                <li>
                  несе відповідальність за захищене зберігання матеріалів та недопущення їх несанкціонованого
                  використання.
                </li>
              </ul>
            </div>

            <div className="pl-4 space-y-2">
              <p>
                <strong>Модель:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  підтверджує достовірність даних, зазначених у розділі «Очікування та межі», та бере на себе
                  відповідальність за приховування чи невказання обмежень (медичних, психологічних або фізичних), що
                  можуть вплинути на безпеку та результат зйомки;
                </li>
                <li>
                  усвідомлює, що фото/відеоматеріали можуть зберігатися у приватному архіві Оператора з метою
                  підтвердження факту співпраці, вирішення можливих спорів або удосконалення професійної діяльності.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">2. Авторські права та використання</h3>
          <div className="space-y-3 text-sm">
            <p>
              Автором усіх створених фото- та відеоматеріалів є Оператор (Майстер/Фото-відео оператор). Авторські права
              на матеріали залишаються за Оператором відповідно до законодавства ЄС та Румунії.
            </p>

            <p>
              <strong>Модель надає Оператору невиключне право використовувати матеріали у таких формах:</strong>
            </p>

            <div className="space-y-3">
              {usageRightsOptions.map((right) => (
                <div key={right} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={`usage-${right}`}
                    checked={(photoVideoData.usageRights || []).includes(right)}
                    onCheckedChange={(checked) => handleUsageRightChange(right, checked as boolean)}
                    className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor={`usage-${right}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                    {right}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="tagging-allowed"
                  checked={(photoVideoData.usageRights || []).includes(
                    "Дозволяються позначки (теги) та спільні публікації у соцмережах",
                  )}
                  onCheckedChange={(checked) =>
                    handleUsageRightChange(
                      "Дозволяються позначки (теги) та спільні публікації у соцмережах",
                      checked as boolean,
                    )
                  }
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor="tagging-allowed" className="text-sm leading-relaxed cursor-pointer flex-1">
                  Дозволяються позначки (теги) та спільні публікації у соцмережах
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="other-usage" className="text-sm font-medium">
                інше (вказати):
              </Label>
              <Input
                id="other-usage"
                placeholder="____________________"
                value={photoVideoData.otherUsage || ""}
                onChange={(e) =>
                  updateFormData({
                    photoVideoRelease: { ...photoVideoData, otherUsage: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-sm">
                Забороняється використання матеріалів у політичних, дискримінаційних або таких, що можуть завдати шкоди
                честі та гідності Моделі чи Майстра, цілях.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                Оператор залишає за собою право відмовити у публікації або розповсюдженні матеріалів, якщо їх якість є
                технічно незадовільною, або якщо така публікація може зашкодити його професійній репутації.
              </p>

              <p>
                <strong>Модель має право вимагати анонімності у публічному використанні матеріалів, шляхом:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>приховування обличчя (маскування, кадрування, ретуш, блюр);</li>
                <li>використання псевдоніму;</li>
                <li>видалення або маскування ідентифікаційних ознак (татуювання, пірсинг, родимі плями тощо).</li>
              </ul>

              <p>
                <strong>Модель підтверджує, що усвідомлює:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>авторські права на створені матеріали належать Оператору;</li>
                <li>
                  згода на використання матеріалів може бути відкликана лише у межах, передбачених розділом «Відкликання
                  згоди».
                </li>
              </ul>

              <p>
                Використання матеріалів у комерційних цілях (продаж, реклама, ліцензування, передача третім особам)
                можливе лише за умови: прямої згоди моделі, зафіксованої у цьому договорі (чекбокс «Комерційне
                використання»);
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Комерційне використання</h3>
          <div className="space-y-3 text-sm">
            <p>За замовчуванням цей договір не надає Оператору права на комерціалізацію матеріалів.</p>

            <p>
              <strong>Комерційне використання включає:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>продаж фото/відео;</li>
              <li>використання у рекламі, маркетингових кампаніях та просуванні товарів/послуг;</li>
              <li>ліцензування матеріалів третім особам;</li>
              <li>будь-яке інше використання з прямою чи непрямою фінансовою вигодою.</li>
            </ul>

            <div className="space-y-3 mt-4">
              <Label className="text-sm font-medium">
                Для комерційного використання необхідна окрема згода Моделі, яка може бути виражена шляхом:
              </Label>
              <RadioGroup
                value={photoVideoData.commercialUse ? "yes" : "no"}
                onValueChange={(value) =>
                  updateFormData({
                    photoVideoRelease: { ...photoVideoData, commercialUse: value === "yes" },
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="commercial-yes" />
                  <Label htmlFor="commercial-yes">підтвердження у цьому договорі (чекбокс «Так, я погоджуюсь»)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="commercial-no" />
                  <Label htmlFor="commercial-no">ні, не погоджуюсь</Label>
                </div>
              </RadioGroup>
            </div>

            {photoVideoData.commercialUse && (
              <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p>
                  <strong>У разі згоди Моделі сторони додатково узгоджують:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>форму комерційного використання (реклама, продаж, ліцензії тощо);</li>
                  <li className="flex items-center gap-2">
                    розмір компенсації - одноразова виплата
                    <Input
                      value={photoVideoData.commercialCompensation || ""}
                      onChange={(e) =>
                        updateFormData({
                          photoVideoRelease: { ...photoVideoData, commercialCompensation: e.target.value },
                        })
                      }
                      placeholder="____"
                      className="w-20 h-8 text-xs"
                    />
                    Euro
                  </li>
                  <li>строк дії комерційного дозволу – безстроково.</li>
                </ul>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm">У строк до</span>
                  <Input
                    value={photoVideoData.commercialPaymentDays || ""}
                    onChange={(e) =>
                      updateFormData({
                        photoVideoRelease: { ...photoVideoData, commercialPaymentDays: e.target.value },
                      })
                    }
                    placeholder="____"
                    className="w-16 h-8 text-xs"
                  />
                  <span className="text-sm">днів після початку комерційного використання.</span>
                </div>

                <p className="text-xs mt-2">
                  Компенсація виплачується у безготівковій формі (банківський переказ, Revolut або інший погоджений
                  метод).
                </p>
              </div>
            )}

            <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Checkbox
                id="monetization-understanding"
                checked={photoVideoData.monetizationUnderstanding || false}
                onCheckedChange={(checked) =>
                  updateFormData({
                    photoVideoRelease: { ...photoVideoData, monetizationUnderstanding: checked as boolean },
                  })
                }
                className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <Label htmlFor="monetization-understanding" className="text-sm">
                Модель підтверджує, що розуміє: монетизація соціальних мереж (Instagram, YouTube, TikTok тощо) є
                комерційним використанням
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Обмеження та анонімність</h3>
          <div className="space-y-3">
            {anonymityOptions.map((option) => (
              <div key={option} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`anonymity-${option}`}
                  checked={(photoVideoData.anonymityOptions || []).includes(option)}
                  onCheckedChange={(checked) => handleAnonymityChange(option, checked as boolean)}
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`anonymity-${option}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Checkbox
              id="anonymity-risk"
              checked={photoVideoData.anonymityRiskAcknowledged || false}
              onCheckedChange={(checked) =>
                updateFormData({
                  photoVideoRelease: { ...photoVideoData, anonymityRiskAcknowledged: checked as boolean },
                })
              }
              className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
            />
            <Label htmlFor="anonymity-risk" className="text-sm">
              Модель усвідомлює, що навіть за умови маскування чи блюру завжди зберігається ризик ідентифікації за
              іншими ознаками (фігура, голос тощо)
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Компенсація (контент)</h3>
          <div className="space-y-4">
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="publication-agreed"
                  checked={photoVideoData.financialTerms?.publicationAgreed || false}
                  onCheckedChange={(checked) =>
                    updateFormData({
                      photoVideoRelease: {
                        ...photoVideoData,
                        financialTerms: {
                          ...photoVideoData.financialTerms,
                          publicationAgreed: checked as boolean,
                        },
                      },
                    })
                  }
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor="publication-agreed" className="text-sm">
                  Якщо публікація фото/відео узгоджена:
                </Label>
              </div>

              {photoVideoData.financialTerms?.publicationAgreed && (
                <div className="ml-7 space-y-3">
                  <RadioGroup
                    value={photoVideoData.financialTerms?.tfpOrAmount || "tfp"}
                    onValueChange={(value) =>
                      updateFormData({
                        photoVideoRelease: {
                          ...photoVideoData,
                          financialTerms: {
                            ...photoVideoData.financialTerms,
                            tfpOrAmount: value,
                          },
                        },
                      })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tfp" id="tfp-option" />
                      <Label htmlFor="tfp-option" className="text-sm">
                        співпраця на умовах TFP (безкоштовно)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 gap-2">
                      <RadioGroupItem value="amount" id="amount-option" />
                      <Label htmlFor="amount-option" className="text-sm">
                        або за домовленою сумою
                      </Label>
                      <Input
                        value={photoVideoData.financialTerms?.agreedAmount || ""}
                        onChange={(e) =>
                          updateFormData({
                            photoVideoRelease: {
                              ...photoVideoData,
                              financialTerms: {
                                ...photoVideoData.financialTerms,
                                agreedAmount: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="______"
                        className="w-20 h-8 text-xs"
                        disabled={photoVideoData.financialTerms?.tfpOrAmount !== "amount"}
                      />
                      <span className="text-sm">Euro (сума прописується під час заповнення релізу)</span>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start space-x-2 gap-2">
                <Checkbox
                  id="publication-not-agreed"
                  checked={photoVideoData.financialTerms?.publicationNotAgreed || false}
                  onCheckedChange={(checked) =>
                    updateFormData({
                      photoVideoRelease: {
                        ...photoVideoData,
                        financialTerms: {
                          ...photoVideoData.financialTerms,
                          publicationNotAgreed: checked as boolean,
                        },
                      },
                    })
                  }
                  className="mt-1 w-5 h-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor="publication-not-agreed" className="text-sm">
                  Якщо публікація не узгоджена: модель сплачує винагороду Майстру у сумі
                </Label>
                <Input
                  value={photoVideoData.financialTerms?.notAgreedAmount || ""}
                  onChange={(e) =>
                    updateFormData({
                      photoVideoRelease: {
                        ...photoVideoData,
                        financialTerms: {
                          ...photoVideoData.financialTerms,
                          notAgreedAmount: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="______"
                  className="w-20 h-8 text-xs"
                />
                <span className="text-sm">Euro (сума прописується під час заповнення релізу)</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Компенсація виплачується у безготівковій формі (банківський переказ, Revolut або інший погоджений метод).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Право на архівування</h3>
          <div className="text-sm space-y-2">
            <p>
              Оператор має право зберігати копії фото/відео у своєму архіві навіть у разі заборони публікації, з метою
              підтвердження факту співпраці та вирішення спорів.
            </p>
            <p>Матеріали в архіві зберігаються у захищеному вигляді, без доступу третіх осіб.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Відкликання згоди</h3>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Модель може відкликати згоду на публікацію у будь-який момент, подавши письмове відкликання на ім'я
                Оператора з посиланням на даний реліз (номер релізу).
              </li>
              <li>
                Це відкликання не стосується матеріалів, вже оприлюднених у публічному просторі до дати відкликання.
              </li>
              <li>
                Оператор зберігає за собою право зберігати копії у своєму архіві для підтвердження співпраці та
                вирішення спорів (виняток: «processing necessary for legal claims»).
              </li>
            </ul>

            <p className="mt-3">
              Модель має право заборонити майбутні публікації матеріалів без пояснення причин, шляхом відкликання згоди
              відповідно до розділу „Відкликання згоди".
            </p>

            <p>
              Відкликання згоди здійснюється шляхом надсилання письмового повідомлення на електронну адресу Оператора,
              зазначену у його персональних даних у цьому договорі. Дата відправлення електронного листа вважається
              датою відкликання.
            </p>

            <p>
              Оператор зобов'язаний підтвердити отримання повідомлення про відкликання згоди протягом 7 календарних днів
              з моменту його надходження.
            </p>
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
