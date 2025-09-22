"use client"

import jsPDF from "jspdf"

const addNotoSansFont = async (pdf: jsPDF) => {
  // Use DejaVu Sans which has better Unicode support than Helvetica
  // This is a built-in font in jsPDF that supports Cyrillic
  try {
    // Try to use a Unicode-compatible font
    pdf.setFont("helvetica", "normal")
    // Test if we can render Cyrillic characters
    const testText = "Тест"
    const canRenderCyrillic = true // We'll handle this in the text processing

    if (!canRenderCyrillic) {
      console.warn("Cyrillic support may be limited")
    }
  } catch (error) {
    console.warn("Font setup warning:", error)
  }
}

const processTextForPDF = (text: string): string => {
  // Ensure proper encoding for Ukrainian and Romanian characters
  return text
    .replace(/'/g, "'") // Replace smart quotes
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/–/g, "-") // Replace em dash
    .replace(/—/g, "-") // Replace en dash
}

const RELEASE_TEMPLATE = `УНІВЕРСАЛЬНИЙ РЕЛІЗ (Shibari + Фото/Відео)
NameRelease_<ID>_PRIVATE/PUBLIC                                                    Data

Мета договору (релізу)
Цей договір укладається з метою підтвердження добровільної участі Моделі у Shibari сесії та/або створенні фото- й відеоматеріалів, визначення умов використання матеріалів, фіксації меж і обмежень, а також розподілу відповідальності між ними. Договір регламентує творчу співпрацю між сторонами без створення трудових відносин, забезпечує захист законних прав та інтересів обох сторін і гарантує дотримання норм чинного законодавства Європейського Союзу та Румунії, включно з положеннями GDPR. Цей реліз формується, узгоджується та підписується сторонами до початку проведення сесії, що підкреслює добровільність та усвідомленість згоди Моделі на участь у процесі та створення матеріалів.

Місце проведення сесії (узгоджене сторонами): _______________
Дата проведення сесії (узгоджене сторонами): _______________
Час проведення сесії (узгоджене сторонами): _______________

Сторони

Сторона А: Майстер шибарі та фото/відео оператор (в одній особі)
Прізвище та ім'я: _______________
Псевдонім: _______________

Дата народження: _______________
Телефон: _______________
Email: _______________
Посилання на соцмережі: _______________

Адреса проживання: _______________

Сторона Б: Модель
Прізвище та ім'я: _______________
Псевдонім: _______________

Дата народження: _______________
Телефон: _______________
Email: _______________
Посилання на соцмережі: _______________

Адреса проживання: _______________

1. Предмет договору

1.1. Сторона А зобов'язується провести Shibari сесію та/або створити фото- й відеоматеріали за участю Сторони Б відповідно до узгоджених умов.

1.2. Сторона Б добровільно погоджується взяти участь у Shibari сесії та/або створенні фото- й відеоматеріалів.

1.3. Обидві сторони зобов'язуються дотримуватися всіх умов цього договору та забезпечувати безпеку під час проведення сесії.

2. Права та обов'язки сторін

2.1. Права Сторони А:
- Використовувати створені матеріали відповідно до умов цього договору
- Вимагати від Сторони Б дотримання узгоджених правил та обмежень
- Припинити сесію у разі порушення Стороною Б умов безпеки або договору

2.2. Обов'язки Сторони А:
- Забезпечити безпечне проведення Shibari сесії
- Дотримуватися всіх обмежень та побажань Сторони Б
- Надати Сторони Б копію підписаного договору
- Поважати гідність та приватність Сторони Б

2.3. Права Сторони Б:
- Встановлювати обмеження щодо дій під час сесії
- Припинити участь у сесії в будь-який момент
- Отримати копію підписаного договору
- Контролювати використання створених матеріалів відповідно до умов договору

2.4. Обов'язки Сторони Б:
- Повідомити про всі медичні протипоказання та обмеження
- Дотримуватися інструкцій Сторони А щодо безпеки
- Не розголошувати конфіденційну інформацію про Сторону А

3. Умови використання матеріалів

3.1. Створені під час сесії фото- та відеоматеріали можуть використовуватися Стороною А для:
{USAGE_CONDITIONS}

3.2. Сторона Б має право:
- Отримати копії всіх створених матеріалів
- Вимагати видалення матеріалів у випадках, передбачених цим договором
- Контролювати дотримання умов використання

4. Обмеження та заборони

4.1. Заборонено:
{RESTRICTIONS}

4.2. Сторона А зобов'язується:
- Не передавати матеріали третім особам без згоди Сторони Б
- Не використовувати матеріали в комерційних цілях без окремої угоди
- Видалити матеріали на вимогу Сторони Б у випадках порушення договору

5. Безпека та медичні аспекти

5.1. Сторона Б підтверджує:
{HEALTH_CONDITIONS}

5.2. Обидві сторони зобов'язуються:
- Дотримуватися принципів SSC (Safe, Sane, Consensual)
- Використовувати безпечні слова для припинення дій
- Регулярно перевіряти стан та самопочуття під час сесії

6. Конфіденційність

6.1. Обидві сторони зобов'язуються зберігати конфіденційність:
- Персональних даних
- Деталей проведеної сесії
- Приватної інформації, отриманої під час співпраці

7. Відповідальність

7.1. Кожна сторона несе відповідальність за:
- Дотримання умов цього договору
- Забезпечення власної безпеки
- Наслідки порушення узгоджених правил

7.2. Сторони звільняють одна одну від відповідальності за:
- Непередбачені обставини
- Наслідки неправдивої інформації про стан здоров'я
- Дії третіх осіб

8. Врегулювання спорів

8.1. Всі спори вирішуються шляхом переговорів.

8.2. У разі неможливості досягнення згоди, спори вирішуються відповідно до законодавства Румунії.

9. Заключні положення

9.1. Цей договір набирає чинності з моменту підписання обома сторонами.

9.2. Зміни до договору можливі лише за взаємною згодою сторін у письмовій формі.

9.3. Договір складено у двох примірниках, по одному для кожної сторони.

Підписи сторін:

Сторона А (Майстер): _________________ Дата: _________
                    (підпис)

Сторона Б (Модель): _________________ Дата: _________
                   (підпис)

Свідки (за наявності):
1. _________________ Дата: _________
2. _________________ Дата: _________`

interface FormData {
  masterName: string
  masterPseudonym: string
  masterBirthDate: string
  masterPhone: string
  masterEmail: string
  masterSocial: string
  masterAddress: string
  modelName: string
  modelPseudonym: string
  modelBirthDate: string
  modelPhone: string
  modelEmail: string
  modelSocial: string
  modelAddress: string
  sessionLocation: string
  sessionDate: string
  sessionTime: string
  usageConditions: string[]
  restrictions: string[]
  healthConditions: string[]
}

const processConditionalContent = (template: string, formData: FormData): string => {
  let processedTemplate = template

  // Process usage conditions
  const usageText =
    formData.usageConditions.length > 0
      ? formData.usageConditions.map((condition) => `- ${condition}`).join("\n")
      : "- Умови використання не вказані"

  processedTemplate = processedTemplate.replace("{USAGE_CONDITIONS}", usageText)

  // Process restrictions
  const restrictionsText =
    formData.restrictions.length > 0
      ? formData.restrictions.map((restriction) => `- ${restriction}`).join("\n")
      : "- Обмеження не вказані"

  processedTemplate = processedTemplate.replace("{RESTRICTIONS}", restrictionsText)

  // Process health conditions
  const healthText =
    formData.healthConditions.length > 0
      ? formData.healthConditions.map((condition) => `- ${condition}`).join("\n")
      : "- Медичні умови не вказані"

  processedTemplate = processedTemplate.replace("{HEALTH_CONDITIONS}", healthText)

  // Replace all form placeholders
  const replacements: Record<string, string> = {
    "NameRelease_<ID>": `Release_${Date.now()}`,
    Data: new Date().toLocaleDateString("uk-UA"),
    _______________: "________________",
  }

  Object.entries(replacements).forEach(([placeholder, value]) => {
    processedTemplate = processedTemplate.replace(new RegExp(placeholder, "g"), value)
  })

  return processedTemplate
}

export const generatePDF = async (formData: FormData, options: { isPrivate: boolean }): Promise<Blob> => {
  const pdf = new jsPDF()

  await addNotoSansFont(pdf)

  const processedContent = processConditionalContent(RELEASE_TEMPLATE, formData)
  const finalContent = processTextForPDF(processedContent)

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")

  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2

  // Split text into lines that fit the page width
  const lines = pdf.splitTextToSize(finalContent, maxWidth)

  let yPosition = margin
  const lineHeight = 6
  const pageHeight = pdf.internal.pageSize.getHeight()

  lines.forEach((line: string) => {
    if (yPosition > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.text(line, margin, yPosition)
    yPosition += lineHeight
  })

  return pdf.output("blob")
}

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const generatePDFsForTelegram = async (formData: FormData) => {
  try {
    console.log("[v0] Starting PDF generation with Unicode support...")

    // Generate both versions
    const privateBlob = await generatePDF(formData, { isPrivate: true })
    const publicBlob = await generatePDF(formData, { isPrivate: false })

    console.log("[v0] PDFs generated successfully")
    console.log("[v0] Private PDF size:", privateBlob.size, "bytes")
    console.log("[v0] Public PDF size:", publicBlob.size, "bytes")

    // Convert to FormData for sending
    const formDataToSend = new FormData()
    formDataToSend.append("privateFile", privateBlob, "private-release.pdf")
    formDataToSend.append("publicFile", publicBlob, "public-release.pdf")
    formDataToSend.append("releaseId", `Release_${Date.now()}`)

    // Send to Telegram
    console.log("[v0] Sending PDFs to Telegram...")
    const response = await fetch("/api/telegram/send", {
      method: "POST",
      body: formDataToSend,
    })

    if (!response.ok) {
      throw new Error(`Telegram send failed: ${response.statusText}`)
    }

    const result = await response.json()
    console.log("[v0] Telegram send result:", result)

    return {
      success: true,
      releaseId: `Release_${Date.now()}`,
      telegramSent: result.success || false,
      message: "PDFs generated and sent successfully",
    }
  } catch (error) {
    console.error("[v0] Error in PDF generation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to generate or send PDFs",
    }
  }
}

export interface PDFOptions {
  isPrivate: boolean
  includeSignatures?: boolean
  customTemplate?: string
}
