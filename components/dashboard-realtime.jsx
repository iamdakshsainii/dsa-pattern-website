"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  CheckCircle2,
  Circle,
  BookMarked,
  ArrowLeft,
  RefreshCw,
  Flame,
  Calendar,
  Grid3x3,
  ChevronDown,
  FileText,
  ClipboardCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StreakPopup from "./dashboard/streak-popup";
import ProfileCompletionWidget from "./dashboard/profile-completion-widget";
import AchievementShowcase from "./dashboard/achievement-showcase";
import DailyChallengeCard from "./dashboard/daily-challenge-card";
import SkillsChart from "./dashboard/skills-chart";
import PatternProgressGrid from "./dashboard/pattern-progress-grid";
import QuizSummaryWidget from "./dashboard/quiz-summary-widget";
import { BadgeToastManager } from "./achievements/badge-unlock-toast";
import SmartRoadmapWidget from "./dashboard/smart-roadmap-widget";
import CommunityBanner from "./community/community-banner";
import WhatsAppWidget from "./community/whatsapp-widget";

export default function DashboardRealTime({ userId, userName, userEmail }) {
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [allPatterns, setAllPatterns] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [streakInfo, setStreakInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStreakBrokenMessage, setShowStreakBrokenMessage] = useState(false);
  const [brokenStreakInfo, setBrokenStreakInfo] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const response = await fetch("/api/record-visit", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.showPopup && data.streak > 0) {
            setStreakInfo({
              streak: data.streak,
              longestStreak: data.longestStreak,
            });
            setShowStreakPopup(true);
          }
          if (data.streakBroken && data.previousStreak > 0) {
            setBrokenStreakInfo({
              previousStreak: data.previousStreak,
            });
            setShowStreakBrokenMessage(true);
          }
        }
      } catch (error) {
        console.error("Failed to record visit:", error);
      }
    };

    recordVisit();
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchAllPatterns();

    const statsInterval = setInterval(() => {
      fetchAllData();
    }, 30000);

    const heatmapInterval = setInterval(() => {
      fetchHeatmapData();
    }, 60000);

    const handleRefresh = () => {
      fetchAllData();
      fetchHeatmapData();
      fetchAllPatterns();
    };

    window.addEventListener("dashboard-refresh", handleRefresh);

    return () => {
      clearInterval(statsInterval);
      clearInterval(heatmapInterval);
      window.removeEventListener("dashboard-refresh", handleRefresh);
    };
  }, []);

  useEffect(() => {
    fetchHeatmapData();
  }, [selectedYear]);

  const fetchAllData = async () => {
    try {
      setRefreshing(true);

      const response = await fetch("/api/dashboard/stats", {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      const response = await fetch(
        `/api/activity-heatmap?year=${selectedYear}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHeatmapData(data.heatmap || []);
      }
    } catch (error) {
      console.error("Error fetching heatmap:", error);
    }
  };

  const fetchAllPatterns = async () => {
    try {
      const response = await fetch("/api/all-patterns", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAllPatterns(data.patterns || []);
      }
    } catch (error) {
      console.error("Error fetching patterns:", error);
    }
  };

  const getHeatmapColor = (count) => {
    if (count === 0)
      return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
    if (count <= 2)
      return "bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-800";
    if (count <= 4)
      return "bg-green-400 dark:bg-green-700 border border-green-500 dark:border-green-600";
    if (count <= 6)
      return "bg-green-600 dark:bg-green-500 border border-green-700 dark:border-green-400";
    return "bg-green-800 dark:bg-green-400 border border-green-900 dark:border-green-300";
  };

  const handleRefreshClick = () => {
    fetchAllData();
    fetchHeatmapData();
    fetchAllPatterns();
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleCloseStreakPopup = () => {
    setShowStreakPopup(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard</p>
          <Button onClick={fetchAllData}>Try Again</Button>
        </div>
      </div>
    );
  }

  const progress =
    stats.totalQuestions > 0
      ? (stats.solvedProblems / stats.totalQuestions) * 100
      : 0;

  const easyTotal = stats.difficultyStats?.Easy?.total || 0;
  const easySolved = stats.difficultyStats?.Easy?.solved || 0;
  const mediumTotal = stats.difficultyStats?.Medium?.total || 0;
  const mediumSolved = stats.difficultyStats?.Medium?.solved || 0;
  const hardTotal = stats.difficultyStats?.Hard?.total || 0;
  const hardSolved = stats.difficultyStats?.Hard?.solved || 0;

  const totalSubmissions = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const todaySubmissions =
    heatmapData.find((d) => {
      const today = new Date().toISOString().split("T")[0];
      return d.date === today;
    })?.count || 0;

  const totalPages = Math.ceil(
    (stats.recentActivity?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivity =
    stats.recentActivity?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {showStreakPopup && streakInfo && (
        <StreakPopup
          streak={streakInfo.streak}
          longestStreak={streakInfo.longestStreak}
          onClose={handleCloseStreakPopup}
        />
      )}

      {showStreakBrokenMessage && brokenStreakInfo && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <Card className="p-4 shadow-2xl border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 max-w-md">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Streak Broken! 💔
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  You broke your {brokenStreakInfo.previousStreak}-day streak.
                  Start fresh today! 💪
                </p>
              </div>
              <button
                onClick={() => setShowStreakBrokenMessage(false)}
                className="p-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      )}

      <BadgeToastManager />
      <CommunityBanner />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                👋 Welcome back, {userName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {userEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/feedback">
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                My Feedback
              </Button>
            </Link>
            <Button
              onClick={handleRefreshClick}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.totalQuestions}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Target className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Solved</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.solvedProblems}
                </p>
                <p className="text-green-100 text-xs mt-1 font-medium">
                  {Math.round(progress)}%
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Bookmarks</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.bookmarksCount}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <BookMarked className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Streak</p>
                <p className="text-3xl font-bold mt-2">{stats.currentStreak}</p>
                <p className="text-orange-100 text-xs mt-1 font-medium">days</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Flame className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <ProfileCompletionWidget />
            </div>
            <div
              className="animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: "100ms" }}
            >
              <AchievementShowcase stats={stats} />
            </div>

            <Card
              className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {totalSubmissions} submissions in the last year
                  </h3>
                  {todaySubmissions > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                      {todaySubmissions}{" "}
                      {todaySubmissions === 1 ? "submission" : "submissions"}{" "}
                      today ✨
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm hover:scale-105 transition-all"
                    >
                      {selectedYear} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {yearOptions.map((year) => (
                      <DropdownMenuItem
                        key={year}
                        onClick={() => handleYearChange(year)}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        {year}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="inline-flex flex-col gap-[3px] min-w-max">
                  <div className="flex gap-[3px] mb-1">
                    <div className="w-8"></div>
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((month) => (
                      <div
                        key={month}
                        className="text-xs text-gray-500 w-[44px]"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                  {["Mon", "Wed", "Fri"].map((day, dayIndex) => (
                    <div key={day} className="flex items-center gap-[3px]">
                      <span className="text-xs text-gray-500 w-8">{day}</span>
                      <div className="flex gap-[3px]">
                        {Array.from({ length: 53 }).map((_, weekIndex) => {
                          const actualDayIndex =
                            dayIndex === 0 ? 1 : dayIndex === 1 ? 3 : 5;
                          const dataIndex = weekIndex * 7 + actualDayIndex;
                          const dayData = heatmapData[dataIndex];
                          return (
                            <div
                              key={`${weekIndex}-${actualDayIndex}`}
                              className={`w-[10px] h-[10px] rounded-sm ${getHeatmapColor(
                                dayData?.count || 0
                              )} cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all hover:scale-125 duration-200`}
                              title={
                                dayData
                                  ? `${dayData.date}: ${dayData.count} ${
                                      dayData.count === 1
                                        ? "problem"
                                        : "problems"
                                    }`
                                  : "No data"
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 3, 5, 7].map((count) => (
                      <div
                        key={count}
                        className={`w-[10px] h-[10px] rounded-sm ${getHeatmapColor(
                          count
                        )}`}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: "300ms" }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Solved Problems
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.solvedProblems}
                  </span>
                  <span className="text-gray-500">
                    / {stats.totalQuestions}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="h-2" />
                  <div
                    className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 hover:scale-105 transition-transform duration-300">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">
                      Easy
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {easySolved}
                      <span className="text-sm text-gray-400">
                        /{easyTotal}
                      </span>
                    </div>
                    <div className="relative mt-2">
                      <Progress
                        value={
                          easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0
                        }
                        className="h-1"
                      />
                      <div
                        className="absolute top-0 left-0 h-1 rounded-full bg-green-500 transition-all duration-1000"
                        style={{
                          width: `${
                            easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900 hover:scale-105 transition-transform duration-300">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">
                      Medium
                    </div>
                    <div className="text-xl font-bold text-yellow-600">
                      {mediumSolved}
                      <span className="text-sm text-gray-400">
                        /{mediumTotal}
                      </span>
                    </div>
                    <div className="relative mt-2">
                      <Progress
                        value={
                          mediumTotal > 0
                            ? (mediumSolved / mediumTotal) * 100
                            : 0
                        }
                        className="h-1"
                      />
                      <div
                        className="absolute top-0 left-0 h-1 rounded-full bg-yellow-500 transition-all duration-1000"
                        style={{
                          width: `${
                            mediumTotal > 0
                              ? (mediumSolved / mediumTotal) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 hover:scale-105 transition-transform duration-300">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">
                      Hard
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {hardSolved}
                      <span className="text-sm text-gray-400">
                        /{hardTotal}
                      </span>
                    </div>
                    <div className="relative mt-2">
                      <Progress
                        value={
                          hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0
                        }
                        className="h-1"
                      />
                      <div
                        className="absolute top-0 left-0 h-1 rounded-full bg-red-500 transition-all duration-1000"
                        style={{
                          width: `${
                            hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div
              className="animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: "400ms" }}
            >
              <SkillsChart patterns={allPatterns} />
            </div>
            <div
              className="animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: "500ms" }}
            >
              <PatternProgressGrid patterns={allPatterns} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-right duration-700">
              <DailyChallengeCard
                userProgress={{
                  completed:
                    stats.recentActivity?.map((a) => a.problemId) || [],
                }}
              />
            </div>
            <div
              className="animate-in fade-in slide-in-from-right duration-700"
              style={{ animationDelay: "100ms" }}
            >
              <SmartRoadmapWidget userId={userId} />
            </div>
            <div
              className="animate-in fade-in slide-in-from-right duration-700"
              style={{ animationDelay: "200ms" }}
            >
              <QuizSummaryWidget />
            </div>
            <div
              className="animate-in fade-in slide-in-from-right duration-700"
              style={{ animationDelay: "300ms" }}
            >
              <WhatsAppWidget />
            </div>

            <Card
              className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-right duration-700"
              style={{ animationDelay: "400ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Submissions
                </h3>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-7 w-7 p-0 transition-all ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {paginatedActivity.length > 0 ? (
                  paginatedActivity.map((activity, index) => (
                    <Link
                      key={index}
                      href={`/patterns/${activity.pattern}/questions/${activity.problemId}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3">
                        {activity.completed ? (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <Circle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {activity.problemName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs font-medium ${
                                activity.difficulty === "Easy"
                                  ? "text-green-600 dark:text-green-400"
                                  : activity.difficulty === "Medium"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {new Date(
                                activity.lastAttemptDate
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      No submissions yet
                    </p>
                    <Link href="/patterns">
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-sm hover:scale-105 transition-all"
                      >
                        Start Solving
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
            <Card
              className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-right duration-700"
              style={{ animationDelay: "500ms" }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href="/patterns">
                  <Button
                    className="w-full justify-start shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    All Patterns
                  </Button>
                </Link>
                <Link href="/roadmaps">
                  <Button
                    className="w-full justify-start shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Learning Roadmaps
                  </Button>
                </Link>
                <Link href="/bookmarks">
                  <Button
                    className="w-full justify-start shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    <BookMarked className="h-4 w-4 mr-2" />
                    Bookmarks
                  </Button>
                </Link>
                <Link href="/dashboard/feedback">
                  <Button
                    className="w-full justify-start shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    My Feedback
                  </Button>
                </Link>
                <Link href="/resume">
                  <Button
                    className="w-full justify-start shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Resume Manager
                  </Button>
                </Link>
                <Link href="/interview-prep">
                  <Button
                    className="w-full justify-start shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Interview Prep
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
