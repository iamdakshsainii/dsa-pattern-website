"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Youtube, BookOpen, Code } from "lucide-react"

export default function QuestionList({ questions, patternSlug, solutions = {} }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  // Helper to get links from both MongoDB and JSON (JSON takes priority)
  const getLinks = (question, questionId) => {
    const solution = solutions[questionId]
    const links = {}

    // LeetCode - priority: JSON > MongoDB
    links.leetcode = solution?.resources?.leetcode || question.links?.leetcode

    // YouTube - Get first video from JSON, or MongoDB fallback
    if (solution?.resources?.videos?.[0]?.url) {
      links.youtube = solution.resources.videos[0].url
      links.youtubeCount = solution.resources.videos.length
    } else {
      links.youtube = question.links?.youtube
    }

    // GFG - Get first practice link with GFG, or MongoDB fallback
    const gfgLink = solution?.resources?.practice?.find(p =>
      p.url?.includes('geeksforgeeks.org') || p.platform === 'GeeksforGeeks'
    )
    links.gfg = gfgLink?.url || question.links?.gfg

    // Article - Get first article, or MongoDB fallback
    links.article = solution?.resources?.articles?.[0]?.url || question.links?.article

    return links
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const links = getLinks(question, question._id)

        return (
          <Card key={question._id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">#{index + 1}</span>
                  <h3 className="font-semibold text-lg">{question.title}</h3>
                  <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                  {question.level && <Badge variant="outline">{question.level}</Badge>}
                </div>

                {question.patternTriggers && (
                  <div className="text-sm">
                    <span className="font-medium">Why this pattern: </span>
                    <span className="text-muted-foreground">{question.patternTriggers}</span>
                  </div>
                )}

                {/* Resource Links */}
                <div className="flex flex-wrap gap-2">
                  {/* LeetCode */}
                  {links.leetcode ? (
                    <a href={links.leetcode} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 hover:border-orange-400 transition-colors">
                        <Code className="h-4 w-4 text-orange-600" />
                        LeetCode
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent opacity-50" disabled>
                      <Code className="h-4 w-4" />
                      LeetCode
                    </Button>
                  )}

                  {/* YouTube */}
                  {links.youtube ? (
                    <a href={links.youtube} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 hover:border-red-400 transition-colors">
                        <Youtube className="h-4 w-4 text-red-500" />
                        Video
                        {links.youtubeCount > 1 && (
                          <span className="text-xs text-muted-foreground">+{links.youtubeCount - 1}</span>
                        )}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent opacity-50" disabled>
                      <Youtube className="h-4 w-4" />
                      Video
                    </Button>
                  )}

                  {/* GFG */}
                  {links.gfg ? (
                    <a href={links.gfg} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 hover:border-green-400 transition-colors">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        GFG
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent opacity-50" disabled>
                      <BookOpen className="h-4 w-4" />
                      GFG
                    </Button>
                  )}

                  {/* Article */}
                  {links.article && (
                    <a href={links.article} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 hover:border-blue-400 transition-colors">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        Article
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <Link href={`/questions/${question._id}`}>
                <Button>View Solution</Button>
              </Link>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
