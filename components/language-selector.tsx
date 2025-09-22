"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/translations"

const languages = [
  { code: "ua" as Language, name: "Українська", flag: "🇺🇦" },
  { code: "ro" as Language, name: "Română", flag: "🇷🇴" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="gap-2"
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </Button>
      ))}
    </div>
  )
}
