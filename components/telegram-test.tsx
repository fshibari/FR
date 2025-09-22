"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TelegramTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const sendTestMessage = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log("[v0] Sending test message...")
      const response = await fetch("/api/telegram/test")
      const data = await response.json()

      if (response.ok) {
        setResult("✅ Тестове повідомлення надіслано успішно!")
        console.log("[v0] Test message sent:", data)
      } else {
        setResult(`❌ Помилка: ${data.error}`)
        console.error("[v0] Test message failed:", data)
      }
    } catch (error) {
      setResult(`❌ Помилка мережі: ${error}`)
      console.error("[v0] Network error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Тест Telegram</CardTitle>
        <CardDescription>Надіслати тестове повідомлення в Telegram групу</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={sendTestMessage} disabled={isLoading} className="w-full">
          {isLoading ? "Надсилаю..." : "Надіслати тест"}
        </Button>

        {result && <div className="p-3 rounded-md bg-muted text-sm">{result}</div>}
      </CardContent>
    </Card>
  )
}
