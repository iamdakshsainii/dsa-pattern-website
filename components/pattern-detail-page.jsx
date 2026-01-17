"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpDown,
  LogIn,
  Sparkles,
  ExternalLink,
  Code,
  Circle,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import ViewToggle from "@/components/tables/view-toggle";
import PatternProgress from "@/components/pattern-progress";
import FilterBar from "@/components/filters/filter-bar";
import StatsPanel from "@/components/stats/stats-panel";
import ProgressBreakdown from "@/components/stats/progress-breakdown";
import {
  filterQuestions,
  sortQuestions,
  getFilterStats,
} from "@/lib/filter-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PatternDetailPage({
  pattern,
  questions,
  solutions,
  userProgress,
  currentUser,
  patternSlug,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    difficulty: searchParams.get("difficulty") || "All",
    status: searchParams.get("status") || "All",
    company: searchParams.get("company") || "All",
    tag: searchParams.get("tag") || "All",
    search: searchParams.get("search") || "",
  });

  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "Default");
  const [viewMode, setViewMode] = useState(searchParams.get("view") || "card");
  const [localProgress, setLocalProgress] = useState(
    userProgress?.completed || []
  );
  const [localBookmarks, setLocalBookmarks] = useState(
    userProgress?.bookmarks || []
  );
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    }

    const handleProgressUpdate = () => {
      if (currentUser) {
        loadProgress();
      }
    };

    window.addEventListener("dashboard-refresh", handleProgressUpdate);
    window.addEventListener("pattern-progress-update", handleProgressUpdate);

    return () => {
      window.removeEventListener("dashboard-refresh", handleProgressUpdate);
      window.removeEventListener(
        "pattern-progress-update",
        handleProgressUpdate
      );
    };
  }, [currentUser]);

  useEffect(() => {
    if (userProgress?.bookmarks) {
      setLocalBookmarks(userProgress.bookmarks);
    }
  }, [userProgress?.bookmarks]);

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/progress", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setLocalProgress([]);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const patternQuestionIds = questions.map((q) => q._id);
        const completedInThisPattern = data.completed.filter((id) =>
          patternQuestionIds.includes(id)
        );
        setLocalProgress(completedInThisPattern);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const handleBookmarkToggle = async (questionId, e) => {
    e?.preventDefault();
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    setBookmarkLoading(true);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.bookmarked) {
          setLocalBookmarks([...localBookmarks, questionId]);
        } else {
          setLocalBookmarks(localBookmarks.filter((id) => id !== questionId));
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === "status") return;
      if (value && value !== "All" && value !== "") {
        params.set(key, value);
      }
    });
    if (sortBy !== "Default") {
      params.set("sort", sortBy);
    }
    if (viewMode !== "card") {
      params.set("view", viewMode);
    }

    const queryString = params.toString();
    const newUrl = `/patterns/${patternSlug}${
      queryString ? `?${queryString}` : ""
    }`;

    window.history.replaceState(null, "", newUrl);
  };

  const updateSort = (value) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    if (value !== "Default") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    const newUrl = `/patterns/${patternSlug}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const updateViewMode = (value) => {
    setViewMode(value);
    const params = new URLSearchParams(searchParams);
    if (value !== "card") {
      params.set("view", value);
    } else {
      params.delete("view");
    }
    const newUrl = `/patterns/${patternSlug}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const companies = useMemo(() => {
    const allCompanies = new Set();
    questions.forEach((q) => {
      if (q.companies && Array.isArray(q.companies)) {
        q.companies.forEach((c) => allCompanies.add(c));
      }
    });
    return Array.from(allCompanies).sort();
  }, [questions]);

  const tags = useMemo(() => {
    const allTags = new Set();
    questions.forEach((q) => {
      if (q.tags && Array.isArray(q.tags)) {
        q.tags.forEach((t) => allTags.add(t));
      }
    });
    return Array.from(allTags).sort();
  }, [questions]);

  const progressData = useMemo(
    () => ({
      completed: localProgress,
      inProgress: userProgress?.inProgress || [],
      bookmarks: localBookmarks,
    }),
    [localProgress, userProgress, localBookmarks]
  );

  const filteredQuestions = useMemo(() => {
    const filtered = filterQuestions(questions, filters, progressData);
    return sortQuestions(filtered, sortBy, progressData);
  }, [questions, filters, sortBy, progressData]);

  const stats = useMemo(() => {
    return getFilterStats(filteredQuestions, progressData);
  }, [filteredQuestions, progressData]);

  const totalStats = useMemo(() => {
    return getFilterStats(questions, progressData);
  }, [questions, progressData]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  if (!pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Pattern not found</h2>
          <Link href="/patterns">
            <Button>Back to Patterns</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.filter((q) => !q.isAdditional).length;
  const solvedQuestions = localProgress.length;
  const progressPercentage =
    totalQuestions > 0
      ? Math.round((solvedQuestions / totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/patterns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patterns
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pattern.name}</h1>
              <p className="text-muted-foreground max-w-3xl">
                {pattern.description}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {totalQuestions} Problems
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1 space-y-6">
            {currentUser ? (
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5" />
                  <h3 className="font-semibold">Your Progress</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {progressPercentage}%
                  </div>
                  <p className="text-blue-100 text-sm">
                    {solvedQuestions}/{totalQuestions} completed
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Remaining</span>
                    <span className="font-semibold">
                      {totalQuestions - solvedQuestions}
                    </span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      Track Your Progress
                      <Sparkles className="h-4 w-4 text-primary" />
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sign in to mark problems solved and track your learning
                      journey
                    </p>
                    <Link href="/auth/login">
                      <Button size="sm" className="w-full gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {pattern.key_points && pattern.key_points.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {pattern.key_points.map((point, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span className="text-primary">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <PatternProgress
              questions={questions}
              patternSlug={patternSlug}
              initialProgress={localProgress}
              currentUser={currentUser}
            />

            {currentUser ? (
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{solvedQuestions}</p>
                      <p className="text-sm text-muted-foreground">Solved</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {userProgress?.inProgress?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In Progress
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {totalQuestions - solvedQuestions}
                      </p>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-dashed border-primary/30">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Save your progress as you solve
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sign in to track completed problems and see your stats
                  </p>
                </div>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-2"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            <FilterBar
              filters={filters}
              onFilterChange={updateFilters}
              companies={companies}
              tags={tags}
              hideStatus={true}
            />

            <StatsPanel stats={stats} totalQuestions={totalQuestions} />
          </div>
        </div>

        <Card className="p-5 mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl hover:scale-[1.005] transition-all duration-300 group">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  💡 How to Practice Effectively
                </h3>
                <div className="shrink-0">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-pulse">
                    🚀 Coming Soon
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-sm mb-3">
                <div className="flex items-start gap-2 group/item hover:translate-x-1 transition-transform">
                  <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    1️⃣
                  </span>
                  <span>
                    <strong>Follow numbers</strong> - Solve problems in order
                    for best learning path
                  </span>
                </div>
                <div className="flex items-start gap-2 group/item hover:translate-x-1 transition-transform">
                  <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    ✅
                  </span>
                  <span>
                    <strong>Track progress</strong> - Check boxes to mark
                    completed questions
                  </span>
                </div>
                <div className="flex items-start gap-2 group/item hover:translate-x-1 transition-transform">
                  <span className="text-pink-600 dark:text-pink-400 font-bold shrink-0">
                    🏢
                  </span>
                  <span>
                    <strong>Filter smartly</strong> - Use difficulty, tags &
                    companies filters above
                  </span>
                </div>
                <div className="flex items-start gap-2 group/item hover:translate-x-1 transition-transform">
                  <span className="text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    🔄
                  </span>
                  <span>
                    <strong>Sort freely</strong> - Change order using sort
                    dropdown as needed
                  </span>
                </div>
                <div className="flex items-start gap-2 group/item hover:translate-x-1 transition-transform">
                  <span className="text-green-600 dark:text-green-400 font-bold shrink-0">
                    🔗
                  </span>
                  <span>
                    <strong>Quick links</strong> - Click external link icon for
                    LeetCode/resources
                  </span>
                </div>
                <div className="flex items-start gap-2 group/item hover:translate-x-1 transition-transform">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    📖
                  </span>
                  <span>
                    <strong>Solve button</strong> - Opens detailed page with
                    solutions, hints, articles & more
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2 text-xs bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-muted-foreground">
                    <strong className="text-amber-700 dark:text-amber-400">
                      Note:
                    </strong>{" "}
                    We're working on bringing you our own resources! Currently
                    using external links, but soon you'll get built-in notes,
                    code editor, detailed explanations, and much more - all in
                    one place. Stay tuned! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold">Practice Problems</h2>
            <div className="flex items-center gap-4">
              <ViewToggle view={viewMode} onViewChange={updateViewMode} />
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={updateSort}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Default">Default Order</SelectItem>
                    <SelectItem value="Difficulty">Difficulty</SelectItem>
                    <SelectItem value="Title">Title (A-Z)</SelectItem>
                    <SelectItem value="Status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredQuestions.length > 0 ? (
            viewMode === "card" ? (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredQuestions.map((question, index) => {
                  const isCompleted = progressData.completed.includes(
                    question._id
                  );
                  const isBookmarked = progressData.bookmarks.includes(
                    question._id
                  );

                  const handleToggleComplete = async (e) => {
                    e.preventDefault();
                    if (!currentUser) return;

                    try {
                      const response = await fetch("/api/progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          questionId: question._id,
                          status: isCompleted ? "not_started" : "completed",
                        }),
                      });

                      if (response.ok) {
                        loadProgress();
                        window.dispatchEvent(
                          new Event("pattern-progress-update")
                        );
                      }
                    } catch (error) {
                      console.error("Error updating progress:", error);
                    }
                  };

                  return (
                    <Card
                      key={question._id}
                      className={`group relative p-5 hover:shadow-xl transition-all duration-300 border-2 ${
                        isCompleted
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-400 dark:border-green-700"
                          : "bg-white dark:bg-slate-900 hover:border-primary/50"
                      }`}
                    >
                      {!isCompleted && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg" />
                      )}

                      {isCompleted && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                      )}
                      <div className="relative flex items-start gap-4">
                        <div className="absolute top-3 left-3 w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm z-10">
                          {index + 1}
                        </div>

                        <div className="flex-shrink-0 mt-1">
                          {currentUser ? (
                            <button onClick={handleToggleComplete}>
                              {isCompleted ? (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-pulse"></div>
                                  <CheckCircle2 className="relative w-6 h-6 text-green-600 dark:text-green-400 hover:scale-110 transition-transform cursor-pointer" />
                                </div>
                              ) : (
                                <Circle className="w-6 h-6 text-gray-400 group-hover:text-primary hover:scale-110 transition-all cursor-pointer" />
                              )}
                            </button>
                          ) : isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/patterns/${patternSlug}/questions/${question.slug}`}
                          >
                            <h3 className="text-base font-bold hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 mb-2 line-clamp-2">
                              {question.title}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <Badge
                              className={`${getDifficultyColor(
                                question.difficulty
                              )} font-semibold`}
                            >
                              {question.difficulty}
                            </Badge>
                          </div>

                          {question.tags && question.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {question.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {question.tags.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-semibold"
                                >
                                  +{question.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {question.companies &&
                            question.companies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {question.companies
                                  .slice(0, 2)
                                  .map((company) => (
                                    <Badge
                                      key={company}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {company}
                                    </Badge>
                                  ))}
                                {question.companies.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-semibold"
                                  >
                                    +{question.companies.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) =>
                                handleBookmarkToggle(question._id, e)
                              }
                              disabled={bookmarkLoading || !currentUser}
                              className={`h-9 transition-all ${
                                isBookmarked
                                  ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-400 dark:border-yellow-600"
                                  : ""
                              }`}
                            >
                              {isBookmarked ? (
                                <>
                                  <BookmarkCheck className="w-4 h-4 mr-1.5 text-yellow-600" />
                                  <span className="hidden sm:inline text-yellow-600 font-medium">
                                    Saved
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-4 h-4 mr-1.5" />
                                  <span className="hidden sm:inline">Revision List</span>
                                </>
                              )}
                            </Button>
                            <Link
                              href={`/patterns/${patternSlug}/questions/${question.slug}`}
                            >
                              <Button
                                size="sm"
                                className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                              >
                                <Code className="w-4 h-4 mr-1.5" />
                                Solve
                              </Button>
                            </Link>
                            {question.links?.leetcode && (
                              <a
                                href={question.links.leetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-9"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-lg border-2 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b-2">
                      <tr>
                        <th className="px-6 py-4 text-center text-sm font-bold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold">
                          Title
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold">
                          Difficulty
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold">
                          Tags
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold">
                          Companies
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((question) => {
                        const isCompleted = progressData.completed.includes(
                          question._id
                        );
                        const isBookmarked = progressData.bookmarks.includes(
                          question._id
                        );

                        const handleToggleComplete = async (e) => {
                          e.preventDefault();
                          if (!currentUser) return;

                          try {
                            const response = await fetch("/api/progress", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                questionId: question._id,
                                status: isCompleted
                                  ? "not_started"
                                  : "completed",
                              }),
                            });

                            if (response.ok) {
                              loadProgress();
                              window.dispatchEvent(
                                new Event("pattern-progress-update")
                              );
                            }
                          } catch (error) {
                            console.error("Error updating progress:", error);
                          }
                        };

                        return (
                          <tr
                            key={question._id}
                            className={`border-b hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all ${
                              isCompleted
                                ? "bg-green-50/30 dark:bg-green-950/10"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-5 text-center">
                              {currentUser ? (
                                <button
                                  onClick={handleToggleComplete}
                                  className="mx-auto"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600 hover:scale-110 transition-transform cursor-pointer" />
                                  ) : (
                                    <Circle className="h-6 w-6 text-gray-300 hover:text-gray-400 hover:scale-110 transition-all cursor-pointer" />
                                  )}
                                </button>
                              ) : isCompleted ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto" />
                              ) : (
                                <Circle className="h-6 w-6 text-gray-300 mx-auto" />
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <Link
                                href={`/patterns/${patternSlug}/questions/${question.slug}`}
                              >
                                <span className="font-semibold text-base hover:text-primary transition-colors">
                                  {question.title}
                                </span>
                              </Link>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <Badge
                                className={`${getDifficultyColor(
                                  question.difficulty
                                )} font-semibold px-3 py-1`}
                              >
                                {question.difficulty}
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {question.tags &&
                                  question.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {question.tags &&
                                  question.tags.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-semibold"
                                    >
                                      +{question.tags.length - 3}
                                    </Badge>
                                  )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {question.companies &&
                                  question.companies
                                    .slice(0, 2)
                                    .map((company) => (
                                      <Badge
                                        key={company}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {company}
                                      </Badge>
                                    ))}
                                {question.companies &&
                                  question.companies.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-semibold"
                                    >
                                      +{question.companies.length - 2}
                                    </Badge>
                                  )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) =>
                                    handleBookmarkToggle(question._id, e)
                                  }
                                  disabled={bookmarkLoading || !currentUser}
                                  className={`transition-all ${
                                    isBookmarked
                                      ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-400 dark:border-yellow-600"
                                      : ""
                                  }`}
                                  title={
                                    isBookmarked
                                      ? "Remove bookmark"
                                      : "Add bookmark"
                                  }
                                >
                                  {isBookmarked ? (
                                    <BookmarkCheck className="h-3.5 w-3.5 text-yellow-600" />
                                  ) : (
                                    <Bookmark className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Link
                                  href={`/patterns/${patternSlug}/questions/${question.slug}`}
                                >
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  >
                                    <Code className="h-3.5 w-3.5 mr-1" />
                                    Solve
                                  </Button>
                                </Link>
                                {question.links?.leetcode && (
                                  <a
                                    href={question.links.leetcode}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button size="sm" variant="outline">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No problems match your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    updateFilters({
                      difficulty: "All",
                      status: "All",
                      company: "All",
                      tag: "All",
                      search: "",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
        {questions.filter((q) => q.isAdditional).length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-dashed">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500" />
                Additional Practice Problems
              </h2>
              <p className="text-muted-foreground">
                Similar problems for extra practice. These are optional and not
                counted in pattern completion.
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <div className="space-y-3">
                {questions
                  .filter((q) => q.isAdditional)
                  .map((question) => (
                    <div
                      key={question._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-900 border hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Badge
                          className={`${getDifficultyColor(
                            question.difficulty
                          )} font-semibold shrink-0`}
                        >
                          {question.difficulty}
                        </Badge>

                        <div className="flex-1 min-w-0">
                          <a
                            href={question.links?.leetcode || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-base hover:text-amber-600 dark:hover:text-amber-400 transition-colors group-hover:underline"
                          >
                            {question.title}
                          </a>

                          {question.note && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {question.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {question.tags && question.tags.length > 0 && (
                          <div className="hidden md:flex gap-1.5">
                            {question.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {question.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{question.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        {question.links?.leetcode && (
                          <a
                            href={question.links.leetcode}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="hidden sm:inline">Open</span>
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
