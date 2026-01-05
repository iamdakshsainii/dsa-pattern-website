'use client'

import { CheckCircle2, Circle } from "lucide-react"

export default function SubtopicCheckbox({ checked, onChange, disabled }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`
        p-1 rounded-full transition-all
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'}
        ${checked ? 'text-green-600' : 'text-gray-400'}
      `}
      aria-label={checked ? "Mark as incomplete" : "Mark as complete"}
    >
      {checked ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
    </button>
  )
}
