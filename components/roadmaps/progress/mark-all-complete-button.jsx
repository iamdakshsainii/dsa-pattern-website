'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function MarkAllCompleteButton({ onClick, disabled }) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="gap-2"
      disabled={disabled}
    >
      <CheckCircle2 className="h-5 w-5" />
      Mark All Complete
    </Button>
  )
}
