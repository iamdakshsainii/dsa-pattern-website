"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import YearCard from "@/components/roadmaps/year-card";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ExamCalendarDialog from "@/components/exam-calendar-dialog";

export default function MasterDetailClient({
  masterRoadmap,
  userProgress,
  unlockedYears,
  currentUser,
}) {
  const router = useRouter();
  const [expandedYear, setExpandedYear] = useState(
    userProgress?.currentYear || 1
  );

  const [examMode, setExamMode] = useState(false);
  const [nearestExam, setNearestExam] = useState(null);
  const [showExamDialog, setShowExamDialog] = useState(false);

  useEffect(() => {
    async function checkExam() {
      if (!currentUser) return;
      try {
        const res = await fetch(
          `/api/roadmaps/masters/exam?userId=${currentUser.id}&masterId=${masterRoadmap.masterId}`
        ); // CHANGE HERE
        const data = await res.json();
        setExamMode(data.active);
        setNearestExam(data.nearestExam);
      } catch (error) {
        console.error("Exam check error:", error);
      }
    }
    checkExam();
  }, [currentUser, masterRoadmap.masterId]);

  const calculateOverallProgress = (userProgress) => {
    if (
      !userProgress?.yearProgress ||
      !Array.isArray(userProgress.yearProgress)
    ) {
      return 0;
    }

    const totalProgress = userProgress.yearProgress.reduce(
      (sum, year) => sum + (year.completionPercent || 0),
      0
    );
    return Math.round(totalProgress / userProgress.yearProgress.length);
  };

  const overallProgress = calculateOverallProgress(userProgress);

  const getYearStatus = (yearNumber) => {
    if (!currentUser) return "locked";
    if (!userProgress) return yearNumber === 1 ? "available" : "locked";

    const yearProg = userProgress.yearProgress.find(
      (yp) => yp.year === yearNumber
    );
    if (yearProg?.completionPercent === 100) return "completed";
    if (unlockedYears.includes(yearNumber)) return "available";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Roadmaps</span>
        </button>

        {/* Header Card */}
        <Card className="p-6 md:p-8 mb-8 border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 dark:from-slate-900 dark:via-purple-950/10 dark:to-pink-950/10">
          <div className="flex items-start gap-6">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-xl">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {masterRoadmap.title}
              </h1>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {masterRoadmap.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {masterRoadmap.years.length} Years
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                >
                  <Award className="h-3 w-3 mr-1" />
                  {masterRoadmap.years.reduce(
                    (sum, y) => sum + y.roadmaps.length,
                    0
                  )}{" "}
                  Roadmaps
                </Badge>
                {currentUser && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Year {userProgress?.currentYear || 1}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {currentUser && userProgress && (
            <div className="mt-6 p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Overall Progress
                </span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {overallProgress}%
                </span>
              </div>
              <Progress
                value={overallProgress}
                className="h-2.5 bg-purple-100 dark:bg-purple-950"
              />
            </div>
          )}
        </Card>

        {currentUser && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    📅 Exam Calendar
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {examMode && nearestExam
                      ? `${nearestExam.examName} in ${Math.ceil((new Date(nearestExam.examDate) - new Date()) / (1000*60*60*24))} days`
                      : 'No upcoming exams scheduled'
                    }
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowExamDialog(true)}
                variant={examMode ? "default" : "outline"}
                size="sm"
                className={examMode ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Exams
              </Button>
            </div>

            {examMode && nearestExam && (
              <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-300 font-semibold">
                  🎯 Exam Mode Active - Projects are {nearestExam.hideProjects ? 'hidden' : 'visible'}
                </p>
              </div>
            )}
          </Card>
        )}

        <ExamCalendarDialog
          userId={currentUser?.id}
          masterId={masterRoadmap.masterId}
          isOpen={showExamDialog}
          onClose={() => setShowExamDialog(false)}
        />

        {/* Year Cards */}
        <div className="space-y-6">
          {masterRoadmap.years.map((year) => {
            const status = getYearStatus(year.yearNumber);
            const yearProg = userProgress?.yearProgress?.find(
              (yp) => yp.year === year.yearNumber
            );

            return (
              <YearCard
                key={year.yearNumber}
                year={year}
                status={status}
                yearProgress={yearProg}
                isExpanded={expandedYear === year.yearNumber}
                onToggle={() =>
                  setExpandedYear(
                    expandedYear === year.yearNumber ? null : year.yearNumber
                  )
                }
                currentUser={currentUser}
                masterId={masterRoadmap.masterId}
                examModeActive={examMode}
              />
            );
          })}
        </div>

        {!currentUser && (
          <Card className="mt-8 p-6 text-center border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Login to track your progress and unlock features
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Login to Continue
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
