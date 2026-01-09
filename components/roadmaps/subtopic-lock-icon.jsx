"use client"

import { Lock } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function SubtopicLockIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-muted-foreground/30 bg-muted/50 cursor-help">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-sm font-medium">🔒 Login Required</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to track your progress and unlock learning resources
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
