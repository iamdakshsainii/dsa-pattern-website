"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  FileText,
  Youtube,
  Code,
  TrendingUp,
  Star,
} from "lucide-react";

export default function QuizReportClient({
  attempt,
  roadmap,
  evaluation,
  isMastered,
  totalPasses,
}) {
  const formatTime = (seconds) => {
    if (!seconds) return "0m 0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "youtube":
      case "video":
        return <Youtube className="h-4 w-4 text-red-600" />;
      case "practice":
      case "leetcode":
        return <Code className="h-4 w-4 text-green-600" />;
      case "article":
      case "blog":
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const weakTopics = {};
  attempt.answers?.forEach((answer) => {
    if (!answer.isCorrect) {
      const topic = answer.topic || "General";
      if (!weakTopics[topic]) {
        weakTopics[topic] = {
          total: 0,
          resources: new Set(),
        };
      }
      weakTopics[topic].total++;
      if (answer.resources) {
        answer.resources.forEach((res) =>
          weakTopics[topic].resources.add(JSON.stringify(res))
        );
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/roadmaps/${attempt.roadmapId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmap
            </Button>
          </Link>
          <Link href="/profile/activities">
            <Button variant="outline" size="sm">
              View All Attempts
            </Button>
          </Link>
        </div>

        {isMastered && (
          <Card className="p-6 mb-6 border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-400 rounded-full">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  🎉 Roadmap Mastered!
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You've passed {totalPasses} quizzes. Time to ace those
                  interviews!
                </p>
              </div>
            </div>
          </Card>
        )}

        {evaluation && evaluation.message && (
          <Card className="p-6 mb-6 border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Performance Update
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {evaluation.message}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8 mb-6 border-2 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">{roadmap?.icon || "📚"}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {roadmap?.title || "Quiz Results"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Completed on{" "}
                {new Date(attempt.completedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800">
              <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Score
              </p>
              <p
                className={`text-3xl font-bold ${getScoreColor(
                  attempt.percentage
                )}`}
              >
                {attempt.percentage}%
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Correct
              </p>
              <p className="text-3xl font-bold text-green-600">
                {attempt.score}/{attempt.totalQuestions}
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800">
              <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Time Taken
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {formatTime(attempt.timeTaken)}
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
              <Badge
                className={
                  attempt.passed
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-lg px-4 py-2"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-lg px-4 py-2"
                }
              >
                {attempt.passed ? "PASSED" : "FAILED"}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Status
              </p>
            </div>
          </div>
        </Card>

        {Object.keys(weakTopics).length > 0 && (
          <Card className="p-6 mb-6 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold">Topics to Review</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(weakTopics).map(([topic, data]) => (
                <div
                  key={topic}
                  className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{topic}</h3>
                    <Badge variant="destructive">{data.total} incorrect</Badge>
                  </div>
                  {data.resources.size > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Recommended resources:
                      </p>
                      <div className="space-y-2">
                        {Array.from(data.resources).map((resStr, idx) => {
                          const resource = JSON.parse(resStr);
                          return (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-2 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              {getResourceIcon(resource.type)}
                              <span className="text-sm flex-1">
                                {resource.title}
                              </span>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Question Review</h2>
          <div className="space-y-6">
            {attempt.answers?.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {answer.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Question {index + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {answer.topic || "General"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {answer.difficulty || "Medium"}
                      </Badge>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">
                      {answer.question}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Your answer:
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            answer.isCorrect
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {answer.userAnswer}
                        </span>
                      </div>
                      {!answer.isCorrect && (
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Correct answer:
                          </span>
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            {answer.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>

                    {answer.explanation && (
                      <div className="mt-3 p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Explanation:</strong> {answer.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
