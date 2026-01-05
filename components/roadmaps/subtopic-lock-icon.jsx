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
          <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 bg-gray-50 cursor-not-allowed">
            <Lock className="h-3 w-3 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Login to track progress</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
