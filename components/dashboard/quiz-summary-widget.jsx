"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

export default function QuizSummaryWidget() {
  const [quizStats, setQuizStats] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const [statsRes, weakRes] = await Promise.all([
        fetch("/api/quiz/stats", { credentials: "include" }),
        fetch("/api/profile/weak-topics", { credentials: "include" }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setQuizStats(data.stats);
      }

      if (weakRes.ok) {
        const data = await weakRes.json();
        setWeakTopics(data.weakTopics || []);
      }
    } catch (error) {
      console.error("Failed to fetch quiz stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!quizStats || quizStats.totalAttempts === 0) {
    return (
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="mb-4 inline-flex p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Roadmap Quizzes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Complete roadmaps to unlock quizzes and test your knowledge
          </p>
          <Link href="/roadmaps">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              Browse Roadmaps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const averageScore = quizStats.averageScore || 0;
  const passedCount = quizStats.passedCount || 0;
  const bestScore = quizStats.bestScore || 0;
  const recentAttempts = quizStats.recentAttempts || [];

  const totalPages = Math.ceil(recentAttempts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAttempts = recentAttempts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80)
      return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (score >= 60)
      return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Roadmap Quizzes
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Track quiz history, progress reports, and master weak topics
          </p>
        </div>
        <Link href="/profile/activities">
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Details
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Total
              </span>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {quizStats.totalAttempts}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Avg
              </span>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {Math.round(averageScore)}%
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Passed
              </span>
            </div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {passedCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Best
              </span>
            </div>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {bestScore}%
            </p>
          </div>
        </div>

        {weakTopics.length > 0 && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Weak Topics ({weakTopics.length})
                </span>
              </div>
              <Link href="/profile/activities?tab=weak">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-1">
              {weakTopics.slice(0, 3).map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                    {topic.topic}
                  </span>
                  <Badge
                    variant="destructive"
                    className="text-xs ml-2 flex-shrink-0"
                  >
                    {topic.correctPercentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentAttempts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recent Attempts
              </h4>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-gray-500 px-2">
                    {currentPage}/{totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {paginatedAttempts.map((attempt, index) => (
              <Link
                key={index}
                href={`/roadmaps/${attempt.roadmapId}/quiz/result/${attempt.attemptId}`}
                className={`block p-3 rounded-lg border ${getScoreBgColor(
                  attempt.score
                )} hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {attempt.patternName}
                  </span>
                  <Badge
                    variant={attempt.passed ? "default" : "secondary"}
                    className={
                      attempt.passed
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }
                  >
                    {attempt.passed ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {attempt.passed ? "Pass" : "Fail"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      attempt.score
                    )}`}
                  >
                    {attempt.score}%
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(attempt.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Link href="/profile/activities" className="flex-1">
            <Button
              variant="outline"
              className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Link href="/roadmaps" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              Take Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
