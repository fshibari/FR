import { type NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7805228540:AAEglmmfSr1dzlTzj7nWczWQ2sqMQ03px88"
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002959503332"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] ===== TELEGRAM API ENDPOINT START =====")
    console.log("[v0] Request method:", request.method)
    console.log("[v0] Request URL:", request.url)
    console.log("[v0] Bot token exists:", !!TELEGRAM_BOT_TOKEN)
    console.log("[v0] Chat ID:", TELEGRAM_CHAT_ID)
    console.log("[v0] Using env vars:", {
      tokenFromEnv: !!process.env.TELEGRAM_BOT_TOKEN,
      chatIdFromEnv: !!process.env.TELEGRAM_CHAT_ID,
    })

    console.log("[v0] Parsing form data...")
    const formData = await request.formData()

    const publicPdf = formData.get("publicPdf") as File
    const privatePdf = formData.get("privatePdf") as File
    const releaseId = formData.get("releaseId") as string

    console.log("[v0] Form data parsed:")
    console.log("[v0] - publicPdf exists:", !!publicPdf)
    console.log("[v0] - publicPdf size:", publicPdf?.size)
    console.log("[v0] - privatePdf exists:", !!privatePdf)
    console.log("[v0] - privatePdf size:", privatePdf?.size)
    console.log("[v0] - releaseId:", releaseId)

    if (!publicPdf || !privatePdf) {
      console.log("[v0] ERROR: Missing PDF files")
      return NextResponse.json({ error: "Missing PDF files" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB Telegram limit
    if (publicPdf.size > MAX_FILE_SIZE) {
      console.log("[v0] ERROR: Public PDF too large:", publicPdf.size)
      return NextResponse.json(
        { error: `Public PDF too large: ${Math.round(publicPdf.size / 1024 / 1024)}MB (max 50MB)` },
        { status: 400 },
      )
    }
    if (privatePdf.size > MAX_FILE_SIZE) {
      console.log("[v0] ERROR: Private PDF too large:", privatePdf.size)
      return NextResponse.json(
        { error: `Private PDF too large: ${Math.round(privatePdf.size / 1024 / 1024)}MB (max 50MB)` },
        { status: 400 },
      )
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log("[v0] ERROR: Missing Telegram credentials")
      return NextResponse.json({ error: "Telegram credentials not configured" }, { status: 500 })
    }

    console.log("[v0] Testing bot connection...")
    try {
      const botInfoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`)
      const botInfo = await botInfoResponse.json()
      console.log("[v0] Bot info:", botInfo)
      if (!botInfo.ok) {
        console.log("[v0] ERROR: Invalid bot token")
        return NextResponse.json({ error: "Invalid Telegram bot token" }, { status: 500 })
      }
    } catch (botError) {
      console.log("[v0] ERROR: Bot connection failed:", botError)
      return NextResponse.json({ error: "Failed to connect to Telegram bot" }, { status: 500 })
    }

    console.log("[v0] Preparing to send public PDF to Telegram...")
    const publicFormData = new FormData()
    publicFormData.append("chat_id", TELEGRAM_CHAT_ID)
    publicFormData.append("document", publicPdf)
    publicFormData.append(
      "caption",
      `📄 Публічний реліз #${releaseId}\n🔒 Анонімізовані дані\n📅 ${new Date().toLocaleString("uk-UA")}`,
    )

    console.log("[v0] Sending public PDF to Telegram API...")
    const publicResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: "POST",
      body: publicFormData,
    })

    console.log("[v0] Public PDF response status:", publicResponse.status)
    console.log("[v0] Public PDF response ok:", publicResponse.ok)

    if (!publicResponse.ok) {
      const errorText = await publicResponse.text()
      console.error("[v0] Public PDF error response:", errorText)
      throw new Error(`Failed to send public PDF: ${errorText}`)
    }

    const publicResult = await publicResponse.json()
    console.log("[v0] Public PDF sent successfully:", publicResult.ok)

    console.log("[v0] Preparing to send private PDF to Telegram...")
    const privateFormData = new FormData()
    privateFormData.append("chat_id", TELEGRAM_CHAT_ID)
    privateFormData.append("document", privatePdf)
    privateFormData.append(
      "caption",
      `🔐 Приватний реліз #${releaseId}\n👤 Повні персональні дані\n📅 ${new Date().toLocaleString("uk-UA")}`,
    )

    console.log("[v0] Sending private PDF to Telegram API...")
    const privateResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: "POST",
      body: privateFormData,
    })

    console.log("[v0] Private PDF response status:", privateResponse.status)
    console.log("[v0] Private PDF response ok:", privateResponse.ok)

    if (!privateResponse.ok) {
      const errorText = await privateResponse.text()
      console.error("[v0] Private PDF error response:", errorText)
      throw new Error(`Failed to send private PDF: ${errorText}`)
    }

    const privateResult = await privateResponse.json()
    console.log("[v0] Private PDF sent successfully:", privateResult.ok)

    console.log("[v0] ===== TELEGRAM API ENDPOINT SUCCESS =====")
    return NextResponse.json({
      success: true,
      message: "PDFs sent to Telegram successfully",
      releaseId,
    })
  } catch (error) {
    console.error("[v0] ===== TELEGRAM API ENDPOINT ERROR =====")
    console.error("[v0] Error type:", typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      {
        error: "Failed to send PDFs to Telegram",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
