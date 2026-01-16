"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Target,
  TrendingDown,
  Award,
  Trash2,
  ExternalLink,
  AlertCircle,
  Youtube,
  FileText,
  Code,
  BookOpen,
  Lightbulb,
} from "lucide-react";

export default function ActivitiesClient() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/profile/activities", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const result = await res.json();

      if (result.success && result.data) {
        setData(result.data);
      } else if (result.dashboard) {
        setData(result);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(attemptId) {
    if (!confirm("Are you sure you want to delete this quiz attempt?")) return;

    try {
      const res = await fetch("/api/profile/activities/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attemptId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      await fetchData();
    } catch (error) {
      console.error("Error deleting attempt:", error);
      alert("Failed to delete quiz attempt");
    }
  }

  function formatTime(seconds) {
    if (!seconds) return "0m 0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  function handleAttemptClick(roadmapId, attemptId) {
    router.push(`/roadmaps/${roadmapId}/quiz/result/${attemptId}`);
  }

  function getResourceIcon(type) {
    switch (type?.toLowerCase()) {
      case "youtube":
      case "video":
        return <Youtube className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "practice":
      case "leetcode":
        return <Code className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "article":
      case "blog":
      default:
        return (
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        );
    }
  }

  function getResourceTypeLabel(type) {
    switch (type?.toLowerCase()) {
      case "youtube":
      case "video":
        return "Video";
      case "practice":
      case "leetcode":
        return "Practice";
      case "article":
      case "blog":
      default:
        return "Article";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading your activity data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="p-8 text-center border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  const quizAnalytics = data?.quizAnalytics || {};
  const weakTopics = data?.weakTopics || [];
  const recentAttempts = quizAnalytics.recentQuizzes || [];

  const stats = {
    totalAttempts: quizAnalytics.totalQuizzesTaken || 0,
    averageScore: quizAnalytics.averageScore || 0,
    bestScore: quizAnalytics.bestScore || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Activity Dashboard</h1>
            <p className="text-muted-foreground">
              Track your learning progress and performance
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="recent" className="text-base">
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="weak" className="text-base">
              Weak Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Total Attempts
                  </h3>
                </div>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalAttempts}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Quiz completions
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Average Score
                  </h3>
                </div>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {stats.averageScore}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall performance
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Best Score</h3>
                </div>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.bestScore}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Personal record
                </p>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Quiz Attempts</h2>

              {recentAttempts.length === 0 ? (
                <Card className="p-12 text-center border-dashed bg-card">
                  <Target className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No quiz attempts yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Complete a roadmap and take your first quiz to see your
                    progress here
                  </p>
                  <Link href="/roadmaps">
                    <Button size="lg">Browse Roadmaps</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentAttempts.slice(0, 6).map((attempt) => (
                    <Card
                      key={attempt._id}
                      className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group bg-card"
                      onClick={() =>
                        handleAttemptClick(attempt.roadmapId, attempt._id)
                      }
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-3xl flex-shrink-0">
                            {attempt.roadmapIcon || "📚"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                              {attempt.roadmapTitle ||
                                attempt.roadmapId?.replace(/-/g, " ")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(attempt.completedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(attempt._id);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Score
                            </span>
                            <span className="text-2xl font-bold text-primary">
                              {attempt.score || 0}/
                              {attempt.totalQuestions || 10}
                            </span>
                          </div>
                          <Progress
                            value={attempt.percentage || 0}
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              {formatTime(attempt.timeTaken)}
                            </span>
                          </div>
                          <Badge
                            variant={attempt.passed ? "default" : "destructive"}
                            className="text-sm"
                          >
                            {attempt.percentage || 0}%
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weak" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Topics Needing Improvement</h2>
              {weakTopics.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {weakTopics.length} topic{weakTopics.length !== 1 ? "s" : ""}{" "}
                  found
                </Badge>
              )}
            </div>

            {weakTopics.length === 0 ? (
              <Card className="p-12 text-center border-dashed bg-card">
                <Award className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-400">
                  Great job! No weak topics identified
                </h3>
                <p className="text-muted-foreground mb-6">
                  Keep taking quizzes to maintain your performance and identify
                  areas for improvement
                </p>
                <Link href="/roadmaps">
                  <Button size="lg">Continue Learning</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {weakTopics.map((topic, index) => (
                  <Card
                    key={index}
                    className="p-6 border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow bg-card"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {topic.topic}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {topic.totalAttempts} attempt
                          {topic.totalAttempts !== 1 ? "s" : ""} •{" "}
                          {topic.correctAttempts} correct
                        </p>
                      </div>
                      <Badge
                        variant="destructive"
                        className="text-lg px-3 py-1"
                      >
                        {topic.correctPercentage}%
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <Progress
                        value={topic.correctPercentage}
                        className="h-3"
                      />
                    </div>

                    {topic.resources && topic.resources.length > 0 ? (
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                          <Lightbulb className="h-4 w-4" />
                          Recommended Learning Resources:
                        </h4>
                        <div className="space-y-2">
                          {topic.resources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:shadow-md transition-all group border border-border"
                            >
                              <div className="flex-shrink-0">
                                {getResourceIcon(resource.type)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                  {resource.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getResourceTypeLabel(resource.type)}
                                </p>
                              </div>

                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : topic.roadmapId ? (
                      <div className="space-y-3">
                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                          <p className="text-sm text-foreground flex items-center gap-2 mb-3">
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            Study the roadmap to strengthen this topic
                          </p>
                          <Link href={`/roadmaps/${topic.roadmapId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Go to Roadmap
                            </Button>
                          </Link>
                        </div>
                        {topic.relatedTopics &&
                          topic.relatedTopics.length > 0 && (
                            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                              <p className="text-sm font-semibold mb-2 text-foreground">
                                Related Topics to Study:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {topic.relatedTopics.map((relTopic, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {relTopic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                        <p className="text-sm text-foreground flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          No specific resources available yet. Continue
                          practicing to improve!
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
