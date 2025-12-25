"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Youtube,
  FileText,
  Code,
  MessageSquare,
  Clock,
  User
} from "lucide-react"

export default function ResourcesSection({ resources }) {
  if (!resources) return null

  const hasAnyResources =
    resources.leetcode ||
    (resources.videos && resources.videos.length > 0) ||
    (resources.articles && resources.articles.length > 0) ||
    (resources.practice && resources.practice.length > 0) ||
    (resources.discussions && resources.discussions.length > 0)

  if (!hasAnyResources) return null

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ExternalLink className="h-6 w-6 text-primary" />
        Resources & Practice
      </h2>

      <div className="space-y-6">
        {/* LeetCode Link */}
        {resources.leetcode && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-orange-500" />
              Practice Problem
            </h3>
            <a
              href={resources.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-4 bg-background rounded-lg border-2 border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                      <Code className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        Solve on LeetCode
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Official problem page
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Video Explanations */}
        {resources.videos && resources.videos.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Video Explanations
              <Badge variant="secondary" className="ml-2">
                {resources.videos.length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {resources.videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="p-4 bg-background rounded-lg border-2 border-red-500/20 hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-red-500/10 rounded-lg shrink-0 group-hover:bg-red-500/20 transition-colors">
                          <Youtube className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                            {video.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                            {video.channel && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {video.channel}
                              </span>
                            )}
                            {video.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {video.duration}
                              </span>
                            )}
                            {video.language && (
                              <Badge variant="outline" className="text-xs">
                                {video.language}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-red-500 transition-colors shrink-0" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        {resources.articles && resources.articles.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Articles & Editorials
              <Badge variant="secondary" className="ml-2">
                {resources.articles.length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {resources.articles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="p-4 bg-background rounded-lg border-2 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-blue-500/10 rounded-lg shrink-0 group-hover:bg-blue-500/20 transition-colors">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {article.title}
                          </p>
                          {article.source && (
                            <p className="text-sm text-muted-foreground">
                              {article.source}
                            </p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors shrink-0" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Practice Links */}
        {resources.practice && resources.practice.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              Similar Problems
              <Badge variant="secondary" className="ml-2">
                {resources.practice.length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {resources.practice.map((practice, index) => (
                <a
                  key={index}
                  href={practice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="p-4 bg-background rounded-lg border-2 border-green-500/20 hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-green-500/10 rounded-lg shrink-0 group-hover:bg-green-500/20 transition-colors">
                          <Code className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                            {practice.title}
                          </p>
                          {practice.platform && (
                            <p className="text-sm text-muted-foreground">
                              {practice.platform}
                            </p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors shrink-0" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Discussion Links */}
        {resources.discussions && resources.discussions.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              Community Discussions
              <Badge variant="secondary" className="ml-2">
                {resources.discussions.length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {resources.discussions.map((discussion, index) => (
                <a
                  key={index}
                  href={discussion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="p-4 bg-background rounded-lg border-2 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-purple-500/10 rounded-lg shrink-0 group-hover:bg-purple-500/20 transition-colors">
                          <MessageSquare className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                            {discussion.title}
                          </p>
                          {discussion.platform && (
                            <p className="text-sm text-muted-foreground">
                              {discussion.platform}
                            </p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors shrink-0" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
