'use client'

import { useEffect, useState } from 'react'

export default function ProgressRing({ percentage = 0, size = 140 }) {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayPercentage / 100) * circumference

  useEffect(() => {
    let start = 0
    const end = percentage
    const duration = 1500
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayPercentage(end)
        clearInterval(timer)
      } else {
        setDisplayPercentage(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [percentage])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out drop-shadow-lg"
          style={{
            filter: displayPercentage > 0 ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">
          {Math.round(displayPercentage)}%
        </span>
        <span className="text-xs text-muted-foreground font-medium mt-1">Complete</span>
      </div>
    </div>
  )
}
