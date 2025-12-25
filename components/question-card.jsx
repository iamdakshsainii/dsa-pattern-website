"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Youtube, FileText, BookOpen, Bookmark, CheckCircle2, Clock } from "lucide-react"

export default function QuestionCard({ question, solution, userProgress, isBookmarked }) {
  const [progress, setProgress] = useState(userProgress?.status || "not-started")
  const [bookmarked, setBookmarked] = useState(isBookmarked || false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const handleProgressClick = async (status) => {
    setProgress(status)
    // TODO: Call API to update progress in MongoDB
  }

  const handleBookmark = async () => {
    setBookmarked(!bookmarked)
    // TODO: Call API to toggle bookmark
  }

  // ✅ Merge links from MongoDB and JSON (JSON takes priority)
  const links = {
    leetcode: solution?.resources?.leetcode || question.links?.leetcode || null,
    youtube: solution?.resources?.videos?.[0]?.url || question.links?.youtube || null,
    gfg: solution?.resources?.practice?.[0]?.url || question.links?.gfg || null,
    article: solution?.resources?.articles?.[0]?.url || question.links?.article || null,
  }

  // ✅ Use pattern triggers from JSON or MongoDB
  const patternTriggers = solution?.patternTriggers || question.patternTriggers

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Question Title and Difficulty */}
          <div className="flex items-center gap-3 mb-3">
            <Link href={`/questions/${question._id}`} className="hover:underline">
              <h3 className="font-semibold text-lg">{question.title}</h3>
            </Link>
            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
            {question.level && (
              <Badge variant="outline" className="text-xs">
                {question.level}
              </Badge>
            )}
          </div>

          {/* Pattern Trigger */}
          {patternTriggers && (
            <p className="text-sm text-muted-foreground mb-4 italic">💡 {patternTriggers}</p>
          )}

          {/* Resource Links - Now supports both MongoDB AND JSON! */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* LeetCode Link */}
            {links.leetcode ? (
              <a
                href={links.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                LeetCode
              </a>
            ) : (
              <span className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                No LeetCode
              </span>
            )}

            {/* YouTube Link */}
            {links.youtube ? (
              <a
                href={links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Youtube className="h-3 w-3" />
                YouTube
              </a>
            ) : (
              <span className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-muted-foreground">
                <Youtube className="h-3 w-3" />
                No Video
              </span>
            )}

            {/* GFG Link */}
            {links.gfg ? (
              <a
                href={links.gfg}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors"
              >
                <FileText className="h-3 w-3" />
                GFG
              </a>
            ) : (
              <span className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-muted-foreground">
                <FileText className="h-3 w-3" />
                No GFG
              </span>
            )}

            {/* Article Link */}
            {links.article && (
              <a
                href={links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <BookOpen className="h-3 w-3" />
                Article
              </a>
            )}

            {/* Show count of additional videos if available */}
            {solution?.resources?.videos && solution.resources.videos.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                +{solution.resources.videos.length - 1} more videos
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant={bookmarked ? "default" : "outline"}
            size="icon"
            onClick={handleBookmark}
            className="shrink-0"
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          </Button>

          <div className="flex gap-1">
            <Button
              variant={progress === "in-progress" ? "default" : "outline"}
              size="icon"
              onClick={() => handleProgressClick("in-progress")}
              title="In Progress"
              className="shrink-0"
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              variant={progress === "completed" ? "default" : "outline"}
              size="icon"
              onClick={() => handleProgressClick("completed")}
              title="Completed"
              className="shrink-0"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>

          <Link href={`/questions/${question._id}`}>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Solution
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
