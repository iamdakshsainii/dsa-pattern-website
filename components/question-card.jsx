"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Youtube, FileText, Bookmark, CheckCircle2, Circle, BookmarkCheck } from "lucide-react"

export default function QuestionCard({ question, userProgress = null }) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userProgress) {
      setIsCompleted(userProgress.completed?.includes(question._id) || false)
      setIsBookmarked(userProgress.bookmarks?.includes(question._id) || false)
    }
  }, [userProgress, question._id])

  const handleCheckboxChange = async () => {
    setLoading(true)
    const newStatus = !isCompleted

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: question._id,
          status: newStatus ? "completed" : "not_started",
        }),
      })

      if (response.ok) {
        setIsCompleted(newStatus)
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: question._id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsBookmarked(data.bookmarked)
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    } finally {
      setLoading(false)
    }
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card
      className={`p-6 transition-all duration-200 hover:shadow-md ${
        isCompleted ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleCheckboxChange}
          disabled={loading || !userProgress}
          className="mt-1 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className={`text-lg font-semibold ${isCompleted ? "line-through text-gray-500" : ""}`}>
              {question.title}
            </h3>
            <button
              onClick={handleBookmark}
              disabled={loading || !userProgress}
              className="flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={difficultyColors[question.difficulty] || difficultyColors.Medium}>
              {question.difficulty}
            </Badge>
            {question.topics?.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>

          {question.pattern_trigger && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm">
                <span className="font-semibold text-blue-900 dark:text-blue-300">Pattern Trigger: </span>
                <span className="text-blue-800 dark:text-blue-200">{question.pattern_trigger}</span>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {question.leetcode_link && (
              <Button variant="outline" size="sm" asChild>
                <a href={question.leetcode_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  LeetCode
                </a>
              </Button>
            )}
            {question.video_solution && (
              <Button variant="outline" size="sm" asChild>
                <a href={question.video_solution} target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4 mr-1" />
                  Video
                </a>
              </Button>
            )}
            {question.article_link && (
              <Button variant="outline" size="sm" asChild>
                <a href={question.article_link} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-1" />
                  Article
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
