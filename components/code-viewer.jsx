"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"

const LANGUAGES = [
  { key: "cpp", label: "C++", color: "text-blue-600" },
  { key: "java", label: "Java", color: "text-orange-600" },
  { key: "python", label: "Python", color: "text-yellow-600" },
  { key: "javascript", label: "JavaScript", color: "text-yellow-500" },
  { key: "csharp", label: "C#", color: "text-purple-600" },
  { key: "go", label: "Go", color: "text-cyan-600" },
]

export default function CodeViewer({ code }) {
  const [selectedLang, setSelectedLang] = useState("cpp")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code[selectedLang] || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter only available languages
  const availableLanguages = LANGUAGES.filter((lang) => code[lang.key])

  return (
    <div className="space-y-3">
      {/* Language Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {availableLanguages.map((lang) => (
            <Button
              key={lang.key}
              variant={selectedLang === lang.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLang(lang.key)}
              className={
                selectedLang === lang.key
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "hover:bg-blue-50 dark:hover:bg-blue-950"
              }
            >
              {lang.label}
            </Button>
          ))}
        </div>

        {/* Copy Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
          disabled={!code[selectedLang]}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </Button>
      </div>

      {/* Code Display */}
      <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <pre className="p-6 overflow-x-auto">
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
            {code[selectedLang] || "// Code not available for this language"}
          </code>
        </pre>
      </Card>
    </div>
  )
}
