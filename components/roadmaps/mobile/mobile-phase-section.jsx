'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Youtube,
  FileText
} from "lucide-react"

export default function MobilePhaseSection({
  nodes,
  userProgress,
  currentUser,
  onMarkComplete
}) {
  const [expandedNodeId, setExpandedNodeId] = useState(null)

  const getNodeStatus = (nodeId) => {
    if (!userProgress) return "unlocked"
    const nodeProgress = userProgress.nodesProgress?.find(n => n.nodeId === nodeId)
    return nodeProgress?.status || "unlocked"
  }

  const isNodeUnlocked = (node) => {
    if (!node.prerequisites || node.prerequisites.length === 0) return true
    if (!userProgress) return false

    return node.prerequisites.every(prereqId => {
      const prereqProgress = userProgress.nodesProgress?.find(n => n.nodeId === prereqId)
      return prereqProgress?.status === "completed"
    })
  }

  const toggleNode = (nodeId) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId)
  }

  return (
    <div className="divide-y">
      {nodes.map((node) => {
        const status = getNodeStatus(node.nodeId)
        const unlocked = isNodeUnlocked(node)
        const isExpanded = expandedNodeId === node.nodeId
        const nodeProgress = userProgress?.nodesProgress?.find(n => n.nodeId === node.nodeId)
        const completedSubtopics = nodeProgress?.completedSubtopics || []

        return (
          <div key={node.nodeId} className="p-4">
            <button
              onClick={() => unlocked && toggleNode(node.nodeId)}
              disabled={!unlocked}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {status === "completed" && (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                  {status === "in-progress" && (
                    <Circle className="h-6 w-6 text-blue-600" />
                  )}
                  {!unlocked && (
                    <Lock className="h-6 w-6 text-gray-400" />
                  )}
                  {unlocked && status !== "completed" && status !== "in-progress" && (
                    <Circle className="h-6 w-6 text-primary" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={`font-semibold ${!unlocked ? 'text-muted-foreground' : ''}`}>
                    {node.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {node.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {node.estimatedHours}h
                    </div>
                    {node.subtopics && (
                      <Badge variant="outline" className="text-xs">
                        {completedSubtopics.length}/{node.subtopics.length} subtopics
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge className="text-xs bg-green-500/10 text-green-700">
                        Completed
                      </Badge>
                    )}
                  </div>

                  {node.subtopics && node.subtopics.length > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(completedSubtopics.length / node.subtopics.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {unlocked && (
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            </button>

            {isExpanded && unlocked && (
              <div className="mt-4 pl-9 space-y-4 animate-in slide-in-from-top-2 duration-300">
                {node.subtopics && node.subtopics.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold mb-2">Subtopics</h5>
                    <div className="space-y-1">
                      {node.subtopics.map((subtopic, idx) => {
                        const isCompleted = completedSubtopics.includes(subtopic.subtopicId)

                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm py-1"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                              {subtopic.title}
                            </span>

                            {subtopic.externalLink && (
                              <a
                                href={subtopic.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3 text-primary" />
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {node.resources && node.resources.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold mb-2">Resources</h5>
                    <div className="space-y-2">
                      {node.resources.slice(0, 3).map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {resource.type === "video" && (
                            <Youtube className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                          {resource.type === "article" && (
                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          )}
                          <span className="flex-1 truncate">{resource.title}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {currentUser && status !== "completed" && (
                  <Button
                    onClick={() => onMarkComplete(node.nodeId)}
                    className="w-full"
                    size="sm"
                  >
                    Mark as Complete
                  </Button>
                )}
              </div>
            )}

            {!unlocked && (
              <p className="text-xs text-muted-foreground mt-2 pl-9">
                🔒 Complete previous topics to unlock
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
