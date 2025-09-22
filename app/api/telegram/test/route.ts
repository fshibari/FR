import { type NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7805228540:AAEglmmfSr1dzlTzj7nWczWQ2sqMQ03px88"
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002959503332"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] ===== TELEGRAM TEST START =====")
    console.log("[v0] Bot token exists:", !!TELEGRAM_BOT_TOKEN)
    console.log("[v0] Chat ID:", TELEGRAM_CHAT_ID)

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log("[v0] ERROR: Missing Telegram credentials")
      return NextResponse.json({ error: "Telegram credentials not configured" }, { status: 500 })
    }

    const message = `🧪 Тестове повідомлення від v0
📅 ${new Date().toLocaleString("uk-UA")}
✅ Telegram інтеграція працює!`

    console.log("[v0] Sending test message to Telegram...")
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response:", errorText)
      return NextResponse.json(
        {
          error: "Failed to send test message",
          details: errorText,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("[v0] Test message sent successfully:", result.ok)
    console.log("[v0] ===== TELEGRAM TEST SUCCESS =====")

    return NextResponse.json({
      success: true,
      message: "Test message sent to Telegram successfully",
      telegramResponse: result,
    })
  } catch (error) {
    console.error("[v0] ===== TELEGRAM TEST ERROR =====")
    console.error("[v0] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to send test message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
