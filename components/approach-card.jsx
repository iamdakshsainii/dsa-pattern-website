import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, BookOpen, ListOrdered, Info } from "lucide-react"
import ComplexityBadge from "../components/questions/complexity-badge"
import CodeViewer from "./code-viewer"

export default function ApproachCard({ approach, number, total }) {
  const getApproachBadgeColor = (order) => {
    if (order === 1) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300"
    if (order === total) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300"
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300"
  }

  const getApproachLabel = (order) => {
    if (order === 1) return "Brute Force"
    if (order === total) return "Optimal"
    return "Better"
  }

  const parseStepsHierarchy = (steps) => {
    if (!steps || !Array.isArray(steps)) return []

    const result = []
    let currentMain = null

    steps.forEach(step => {
      const trimmed = step.trim()
      const hasLeadingSpace = step.startsWith('  ') || step.startsWith('\t') || step.startsWith(' ')
      const hasBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')
      const isIndented = hasLeadingSpace || hasBullet

      if (isIndented) {
        const cleanStep = trimmed.replace(/^[•\-\*]\s*/, '').trim()
        if (currentMain !== null && cleanStep) {
          result[currentMain].sub.push(cleanStep)
        }
      } else {
        if (trimmed) {
          result.push({ text: trimmed, sub: [] })
          currentMain = result.length - 1
        }
      }
    })

    return result
  }

  const hierarchicalSteps = parseStepsHierarchy(approach.steps)

  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className={getApproachBadgeColor(approach.order)}>
                Approach {number} - {getApproachLabel(approach.order)}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {approach.name}
            </h3>
          </div>
          <ComplexityBadge
            time={approach.complexity?.time}
            space={approach.complexity?.space}
          />
        </div>

        {/* Intuition */}
        {approach.intuition && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  💡 Intuition
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {approach.intuition}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Approach Explanation */}
        {approach.approach && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                Approach
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {approach.approach}
            </p>
          </div>
        )}

        {/* Steps with Hierarchy */}
        {hierarchicalSteps && hierarchicalSteps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                Algorithm Steps
              </h4>
            </div>
            <ol className="space-y-3 pl-7">
              {hierarchicalSteps.map((step, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <span>{step.text}</span>
                      {step.sub.length > 0 && (
                        <ul className="mt-2 space-y-1.5 ml-4">
                          {step.sub.map((subStep, subIndex) => (
                            <li key={subIndex} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                              <span className="text-blue-500 flex-shrink-0">•</span>
                              <span>{subStep}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Complexity Explanation */}
        {(approach.complexity?.timeExplanation || approach.complexity?.spaceExplanation) && (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Complexity Analysis
              </h4>
            </div>
            {approach.complexity.timeExplanation && (
              <div className="pl-7">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Time Complexity:
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {approach.complexity.timeExplanation}
                </p>
              </div>
            )}
            {approach.complexity.spaceExplanation && (
              <div className="pl-7">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Space Complexity:
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {approach.complexity.spaceExplanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Code */}
        {approach.code && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">{"</>"}</span>
              Implementation
            </h4>
            <CodeViewer code={approach.code} />
          </div>
        )}
      </div>
    </Card>
  )
}
