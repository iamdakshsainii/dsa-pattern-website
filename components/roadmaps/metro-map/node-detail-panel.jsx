'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ExternalLink, Youtube, FileText, CheckCircle2, Circle } from "lucide-react"

export default function NodeDetailPanel({
  node,
  userProgress,
  currentUser,
  onMarkComplete
}) {
  const nodeProgress = userProgress?.nodesProgress?.find(n => n.nodeId === node.nodeId)
  const completedSubtopics = nodeProgress?.completedSubtopics || []
  const status = nodeProgress?.status || "unlocked"

  return (
    <Card className="mt-4 ml-20 p-6 bg-accent/50 border-2 border-primary/20 animate-in slide-in-from-top-2 duration-300">
      {/* Subtopics */}
      {node.subtopics && node.subtopics.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Subtopics ({completedSubtopics.length}/{node.subtopics.length} complete)
          </h4>

          <div className="space-y-2">
            {node.subtopics.map((subtopic, idx) => {
              const isCompleted = completedSubtopics.includes(subtopic.subtopicId)

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border"
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {idx + 1}. {subtopic.title}
                      </p>
                      {subtopic.provider && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {subtopic.provider}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {subtopic.externalLink && (
                    <a
                      href={subtopic.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Top Resources */}
      {node.resources && node.resources.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Top Resources</h4>
          <div className="space-y-2">
            {node.resources.slice(0, 3).map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-accent transition-colors border"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  {resource.type === "video" && (
                    <Youtube className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  {resource.type === "article" && (
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.provider}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {currentUser && status !== "completed" && (
        <div className="flex gap-2">
          <Button
            onClick={() => onMarkComplete(node.nodeId)}
            className="flex-1"
          >
            Mark as Complete
          </Button>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
          <CheckCircle2 className="h-5 w-5" />
          Completed!
        </div>
      )}
    </Card>
  )
}
