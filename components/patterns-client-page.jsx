"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Database,
  Target,
  TrendingUp,
  BookOpen,
  LayoutGrid,
  LayoutList,
  Search,
  CheckCircle2,
  Circle,
  Code,
  FileText,    
  ArrowRight,
} from "lucide-react";
import DifficultyFilter from "./filters/difficulty-filter";
import SearchFilter from "./filters/search-filter";
import CompanyFilter from "./filters/company-filter";
import TagFilter from "./filters/tag-filter";
import ActiveFilters from "./filters/active-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PatternsClientPage({
  patterns,
  userProgress,
  currentUser,
}) {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    difficulty: searchParams.get("difficulty") || "All",
    company: searchParams.get("company") || "All",
    tag: searchParams.get("tag") || "All",
    search: searchParams.get("search") || "",
  });

  const [viewMode, setViewMode] = useState("card");
  const [searchMode, setSearchMode] = useState("pattern");

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllQuestions() {
      setLoading(true);
      try {
        const response = await fetch("/api/questions/all");

        if (response.ok) {
          const allQuestions = await response.json();

          const questionsWithPattern = allQuestions.map((q) => {
            const pattern = patterns.find((p) => p.slug === q.pattern_id);
            return {
              ...q,
              patternName: pattern?.name || "Unknown Pattern",
              patternSlug: q.pattern_id || "unknown",
            };
          });

          setAllQuestions(questionsWithPattern);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllQuestions();
  }, [patterns]);

  const sortedPatterns = useMemo(() => {
    return [...patterns].sort((a, b) => {
      const orderA = a.order || 999;
      const orderB = b.order || 999;
      return orderA - orderB;
    });
  }, [patterns]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "All" && value !== "") {
        params.set(key, value);
      }
    });
    const newUrl = `/patterns${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.replaceState(null, "", newUrl);
  };

  const updateFilter = (key, value) => {
    updateFilters({ ...filters, [key]: value });
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters };
    if (key === "search") {
      newFilters.search = "";
    } else {
      newFilters[key] = "All";
    }
    updateFilters(newFilters);
  };

  const clearAllFilters = () => {
    updateFilters({
      difficulty: "All",
      company: "All",
      tag: "All",
      search: "",
    });
  };

  const { companies, tags } = useMemo(() => {
    const companiesSet = new Set();
    const tagsSet = new Set();
    allQuestions.forEach((q) => {
      q.companies?.forEach((c) => companiesSet.add(c));
      q.tags?.forEach((t) => tagsSet.add(t));
    });
    return {
      companies: Array.from(companiesSet).sort(),
      tags: Array.from(tagsSet).sort(),
    };
  }, [allQuestions]);

  const filteredPatterns = useMemo(() => {
    if (
      !filters.difficulty &&
      !filters.search &&
      !filters.company &&
      !filters.tag
    ) {
      return sortedPatterns;
    }

    return sortedPatterns.filter((pattern) => {
      const patternQuestions = allQuestions.filter(
        (q) => q.patternSlug === pattern.slug
      );
      const matchingQuestions = patternQuestions.filter((q) => {
        if (filters.difficulty && filters.difficulty !== "All") {
          if (q.difficulty !== filters.difficulty) return false;
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const patternMatch = pattern.name.toLowerCase().includes(searchLower);
          const titleMatch = q.title?.toLowerCase().includes(searchLower);
          const tagsMatch = q.tags?.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          );
          if (!patternMatch && !titleMatch && !tagsMatch) return false;
        }
        if (filters.company && filters.company !== "All") {
          if (!q.companies?.includes(filters.company)) return false;
        }
        if (filters.tag && filters.tag !== "All") {
          if (!q.tags?.includes(filters.tag)) return false;
        }
        return true;
      });
      return matchingQuestions.length > 0;
    });
  }, [sortedPatterns, allQuestions, filters]);

  const filteredQuestions = useMemo(() => {
    let result = allQuestions;

    if (filters.difficulty && filters.difficulty !== "All") {
      result = result.filter((q) => q.difficulty === filters.difficulty);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((q) => {
        const titleMatch = q.title?.toLowerCase().includes(searchLower);
        const tagsMatch = q.tags?.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        );
        const patternMatch = q.patternName?.toLowerCase().includes(searchLower);
        return titleMatch || tagsMatch || patternMatch;
      });
    }

    if (filters.company && filters.company !== "All") {
      result = result.filter((q) => q.companies?.includes(filters.company));
    }

    if (filters.tag && filters.tag !== "All") {
      result = result.filter((q) => q.tags?.includes(filters.tag));
    }

    return result;
  }, [allQuestions, filters]);

  const stats = useMemo(() => {
    const totalQuestions = allQuestions.length;
    const completedQuestions = userProgress?.completed?.length || 0;

    const byDifficulty = {
      Easy: allQuestions.filter((q) => q.difficulty === "Easy").length,
      Medium: allQuestions.filter((q) => q.difficulty === "Medium").length,
      Hard: allQuestions.filter((q) => q.difficulty === "Hard").length,
    };

    const completedByDifficulty = {
      Easy: allQuestions.filter(
        (q) =>
          q.difficulty === "Easy" && userProgress?.completed?.includes(q._id)
      ).length,
      Medium: allQuestions.filter(
        (q) =>
          q.difficulty === "Medium" && userProgress?.completed?.includes(q._id)
      ).length,
      Hard: allQuestions.filter(
        (q) =>
          q.difficulty === "Hard" && userProgress?.completed?.includes(q._id)
      ).length,
    };

    return {
      total: totalQuestions,
      completed: completedQuestions,
      remaining: totalQuestions - completedQuestions,
      percentage:
        totalQuestions > 0
          ? Math.round((completedQuestions / totalQuestions) * 100)
          : 0,
      byDifficulty,
      completedByDifficulty,
    };
  }, [allQuestions, userProgress]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <main className="container px-4 py-8 max-w-7xl mx-auto">

         <Card className="mb-8 overflow-hidden border-2 border-blue-200 dark:border-blue-800">
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1">
      <div className="bg-background p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📚 New to DSA Patterns? Start Here!
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                Check out our complete <strong>12-week study guide</strong> with 300 curated problems,
                learning tips, and company-specific prep strategies.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  30 Core Patterns
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  Study Schedule
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  FAANG Tips
                </span>
              </div>
            </div>
          </div>
          <Link href="/syllabus">
            <Button className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 group">
              <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              View Complete Syllabus
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </Card>

      <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5" />
            <h3 className="font-semibold">Overall Progress</h3>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{stats.percentage}%</div>
            <p className="text-blue-100 text-sm">
              {stats.completed}/{stats.total} completed
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Remaining</span>
              <span className="font-semibold">{stats.remaining}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress by Difficulty
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {["Easy", "Medium", "Hard"].map((diff) => (
              <div key={diff} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      diff === "Easy"
                        ? "bg-green-500"
                        : diff === "Medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium">{diff}</span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    diff === "Easy"
                      ? "text-green-600"
                      : diff === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {stats.completedByDifficulty[diff]}/{stats.byDifficulty[diff]}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.byDifficulty[diff] > 0
                    ? Math.round(
                        (stats.completedByDifficulty[diff] /
                          stats.byDifficulty[diff]) *
                          100
                      )
                    : 0}
                  % done
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {patterns.length} Patterns Available • {stats.total} Questions
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Master the Fundamentals
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn these essential patterns to solve any coding problem with
          confidence
        </p>
      </div>

      <Card className="p-6 space-y-4 mb-8 max-w-6xl mx-auto">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchFilter
              value={filters.search}
              onChange={(value) => updateFilter("search", value)}
              placeholder={
                searchMode === "pattern"
                  ? "Search patterns or questions..."
                  : "Search questions by name or tags..."
              }
            />
          </div>

          <Select value={searchMode} onValueChange={setSearchMode}>
            <SelectTrigger className="w-[180px] shrink-0">
              <Search className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pattern">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Pattern Mode
                </div>
              </SelectItem>
              <SelectItem value="question">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Question Mode
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[150px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Card View
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <LayoutList className="h-4 w-4" />
                  List View
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <DifficultyFilter
            selected={filters.difficulty}
            onChange={(value) => updateFilter("difficulty", value)}
          />
        </div>

        {(companies.length > 0 || tags.length > 0) && (
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {companies.length > 0 && (
              <CompanyFilter
                selected={filters.company}
                onChange={(value) => updateFilter("company", value)}
                companies={companies}
              />
            )}
            {tags.length > 0 && (
              <TagFilter
                selected={filters.tag}
                onChange={(value) => updateFilter("tag", value)}
                tags={tags}
              />
            )}
          </div>
        )}

        <ActiveFilters
          filters={filters}
          onRemove={removeFilter}
          onClearAll={clearAllFilters}
          hideStatus={true}
        />
      </Card>

      <div className="mb-4 text-sm text-muted-foreground text-center">
        {searchMode === "pattern" ? (
          <>
            Showing {filteredPatterns.length} of {patterns.length} patterns
          </>
        ) : (
          <>
            Showing {filteredQuestions.length} of {stats.total} questions
          </>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading questions...</p>
        </div>
      ) : (
        <>
          {searchMode === "pattern" && (
            <>
              {viewMode === "card" && filteredPatterns.length > 0 && (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {filteredPatterns.map((pattern) => {
                    const patternQuestions = allQuestions.filter(
                      (q) => q.patternSlug === pattern.slug
                    );
                    const completedCount = patternQuestions.filter((q) =>
                      userProgress?.completed?.includes(q._id)
                    ).length;
                    const totalCount = patternQuestions.length;
                    const progressPercent =
                      totalCount > 0
                        ? Math.round((completedCount / totalCount) * 100)
                        : 0;

                    return (
                      <Link
                        key={pattern._id}
                        href={`/patterns/${pattern.slug}`}
                      >
                        <Card className="group relative p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full bg-white dark:bg-slate-900 border-2 hover:border-primary/50">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg" />

                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 dark:from-blue-950/0 dark:via-purple-950/0 dark:to-pink-950/0 dark:group-hover:from-blue-950/10 dark:group-hover:via-purple-950/10 dark:group-hover:to-pink-950/10 transition-all duration-500 rounded-lg pointer-events-none" />

                          <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                            {pattern.order || "?"}
                          </div>

                          <div className="relative pl-12">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                                {pattern.name}
                              </h3>

                              <Badge
                                variant="secondary"
                                className="shrink-0 ml-2 bg-primary/10 text-primary border border-primary/20 font-semibold group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300"
                              >
                                {totalCount}
                              </Badge>
                            </div>

                            {currentUser && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-muted-foreground font-medium">
                                    Progress
                                  </span>
                                  <span
                                    className={`font-bold ${
                                      progressPercent === 100
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-blue-600 dark:text-blue-400"
                                    }`}
                                  >
                                    {completedCount}/{totalCount}
                                  </span>
                                </div>
                                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-sm"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {pattern.description}
                            </p>

                            {pattern.complexity && (
                              <div className="pt-3 border-t border-muted flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                  <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-foreground font-mono font-semibold">
                                    {pattern.complexity.time}
                                  </code>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Database className="h-3.5 w-3.5 text-muted-foreground" />
                                  <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-foreground font-mono font-semibold">
                                    {pattern.complexity.space}
                                  </code>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}

              {viewMode === "list" && filteredPatterns.length > 0 && (
                <div className="space-y-4 max-w-6xl mx-auto">
                  {filteredPatterns.map((pattern) => {
                    const patternQuestions = allQuestions.filter(
                      (q) => q.patternSlug === pattern.slug
                    );
                    const completedCount = patternQuestions.filter((q) =>
                      userProgress?.completed?.includes(q._id)
                    ).length;
                    const totalCount = patternQuestions.length;
                    const progressPercent =
                      totalCount > 0
                        ? Math.round((completedCount / totalCount) * 100)
                        : 0;

                    return (
                      <Link
                        key={pattern._id}
                        href={`/patterns/${pattern.slug}`}
                      >
                        <Card className="group relative p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900 border-2">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 dark:from-blue-950/0 dark:via-purple-950/0 dark:to-pink-950/0 dark:group-hover:from-blue-950/10 dark:group-hover:via-purple-950/10 dark:group-hover:to-pink-950/10 transition-all duration-500 rounded-lg" />

                          <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                            {pattern.order || "?"}
                          </div>

                          <div className="relative flex items-center gap-6 pl-20">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                                  {pattern.name}
                                </h3>
                                <Badge className="shrink-0 bg-primary/10 text-primary border border-primary/20 font-semibold">
                                  {totalCount} problems
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                                {pattern.description}
                              </p>
                              {pattern.complexity && (
                                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">Time:</span>
                                    <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono font-semibold">
                                      {pattern.complexity.time}
                                    </code>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Database className="h-4 w-4" />
                                    <span className="font-medium">Space:</span>
                                    <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono font-semibold">
                                      {pattern.complexity.space}
                                    </code>
                                  </span>
                                </div>
                              )}
                            </div>

                            {currentUser && (
                              <div className="w-48 shrink-0">
                                <div className="text-center mb-2">
                                  <div
                                    className={`text-3xl font-bold ${
                                      progressPercent === 100
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-blue-600 dark:text-blue-400"
                                    }`}
                                  >
                                    {progressPercent}%
                                  </div>
                                  <div className="text-xs text-muted-foreground font-medium">
                                    {completedCount}/{totalCount} completed
                                  </div>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-sm"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {searchMode === "question" && filteredQuestions.length > 0 && (
            <>
              {viewMode === "card" && (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
                  {filteredQuestions.map((question) => {
                    const isCompleted = userProgress?.completed?.includes(
                      question._id
                    );

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
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}

                        {isCompleted && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                        )}

                        <div className="relative flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-pulse"></div>
                                <CheckCircle2 className="relative w-6 h-6 text-green-600 dark:text-green-400" />
                              </div>
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link href={`/questions/${question._id}`}>
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
                              <Badge
                                variant="outline"
                                className="text-xs border-slate-300 dark:border-slate-700"
                              >
                                {question.patternName}
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

                            <div className="flex gap-2">
                              <Link href={`/questions/${question._id}`}>
                                <Button
                                  size="sm"
                                  className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                                >
                                  <Code className="w-4 h-4 mr-1.5" />
                                  Solve
                                </Button>
                              </Link>
                              <Link href={`/patterns/${question.patternSlug}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 border-2 hover:bg-accent transition-all"
                                >
                                  <BookOpen className="w-4 h-4 mr-1.5" />
                                  Pattern
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-3 max-w-6xl mx-auto">
                  {filteredQuestions.map((question) => {
                    const isCompleted = userProgress?.completed?.includes(
                      question._id
                    );

                    return (
                      <Card
                        key={question._id}
                        className={`group relative p-5 hover:shadow-xl transition-all duration-300 border-2 ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-400 dark:border-green-700"
                            : "bg-white dark:bg-slate-900 hover:border-primary/50"
                        }`}
                      >
                        {!isCompleted && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}

                        {isCompleted && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                        )}

                        <div className="relative flex items-center gap-5">
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-pulse"></div>
                                <CheckCircle2 className="relative w-6 h-6 text-green-600 dark:text-green-400" />
                              </div>
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Link href={`/questions/${question._id}`}>
                                <h3 className="text-lg font-bold hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300">
                                  {question.title}
                                </h3>
                              </Link>
                              <Badge
                                className={`${getDifficultyColor(
                                  question.difficulty
                                )} font-semibold shrink-0`}
                              >
                                {question.difficulty}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs shrink-0 border-slate-300 dark:border-slate-700"
                              >
                                {question.patternName}
                              </Badge>
                            </div>

                            {question.tags && question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {question.tags.slice(0, 5).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {question.tags.length > 5 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-semibold"
                                  >
                                    +{question.tags.length - 5}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 shrink-0">
                            <Link href={`/questions/${question._id}`}>
                              <Button
                                size="sm"
                                className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                              >
                                <Code className="w-4 h-4 mr-1.5" />
                                Solve
                              </Button>
                            </Link>
                            <Link href={`/patterns/${question.patternSlug}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-2 hover:bg-accent transition-all"
                              >
                                <BookOpen className="w-4 h-4 mr-1.5" />
                                Pattern
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {((searchMode === "pattern" && filteredPatterns.length === 0) ||
            (searchMode === "question" && filteredQuestions.length === 0)) && (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No {searchMode === "pattern" ? "patterns" : "questions"} match
                  your filters.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </main>
  );
}
