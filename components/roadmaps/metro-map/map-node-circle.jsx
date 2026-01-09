'use client'

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Circle, Lock, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MapNodeCircle({
  node,
  status,
  isActive,
  isUnlocked,
  onClick,
  roadmapSlug
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getNodeStyle = () => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-gradient-to-br from-green-500 to-emerald-600",
          border: "border-green-500",
          icon: <CheckCircle2 className="h-6 w-6 text-white" />,
          text: "text-white"
        }
      case "in-progress":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-purple-600",
          border: "border-blue-500",
          icon: <Circle className="h-6 w-6 text-white" />,
          text: "text-white",
          animate: "animate-pulse"
        }
      default:
        if (!isUnlocked) {
          return {
            bg: "bg-gray-300 dark:bg-gray-700",
            border: "border-gray-400 dark:border-gray-600 border-dashed",
            icon: <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
            text: "text-gray-500 dark:text-gray-400",
            opacity: "opacity-60"
          }
        }
        return {
          bg: "bg-white dark:bg-gray-800",
          border: "border-primary",
          icon: <Circle className="h-6 w-6 text-primary" />,
          text: "text-foreground"
        }
    }
  }

  const style = getNodeStyle()

  const nodeContent = (
    <div
      className={`
        flex items-start gap-4
        ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
        group
      `}
    >
      {/* Circle */}
      <div
        className={`
          relative flex-shrink-0 w-16 h-16 rounded-full
          flex items-center justify-center
          border-4 ${style.border} ${style.bg}
          transition-all duration-300
          ${isUnlocked ? 'group-hover:scale-110 group-hover:shadow-lg' : ''}
          ${style.animate || ''}
          ${style.opacity || ''}
          ${isActive ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
        `}
      >
        {style.icon}

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
        )}
      </div>

      {/* Node Info */}
      <div className="flex-1 pt-2">
        <h3 className={`font-semibold text-lg ${style.text} ${isUnlocked ? 'group-hover:text-primary' : ''} transition-colors`}>
          {node.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {node.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {node.estimatedHours}h
          </div>
          {node.subtopics && (
            <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-700">
              {node.subtopics.length} subtopics
            </Badge>
          )}
          {status === "completed" && (
            <Badge className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
              ✓ Done
            </Badge>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div
      id={`node-${node.nodeId}`}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {isUnlocked && roadmapSlug ? (
        <Link href={`/roadmaps/${roadmapSlug}/${node.nodeId}`}>
          {nodeContent}
        </Link>
      ) : (
        nodeContent
      )}

      {/* Tooltip - ONLY show for unlocked non-completed nodes */}
      {showTooltip && isUnlocked && status !== "completed" && (
        <div className="absolute left-20 top-0 z-10 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-slate-700">
          Click to view details
        </div>
      )}
    </div>
  )
}
