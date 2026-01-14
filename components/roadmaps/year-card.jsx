"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import RoadmapCard from "@/components/roadmaps/roadmap-card";
import CardTestButton from "./card-test-button";
import {
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle,
  Clock,
  Trophy,
  Zap,
  AlertCircle,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function YearCard({
  year,
  status,
  yearProgress,
  isExpanded,
  onToggle,
  currentUser,
  masterId,
  examModeActive = false,
}) {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const completionPercent = yearProgress?.completionPercent || 0;

  const handleToggle = async () => {
    if (status === "locked") {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      setIsShaking(true);
      setShowTooltip(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    if (isExpanded || roadmaps.length > 0) {
      onToggle();
      return;
    }

    setLoading(true);
    try {
      const roadmapSlugs = year.roadmaps
        .filter((r) => r.roadmapSlug)
        .map((r) => r.roadmapSlug);
      const promises = roadmapSlugs.map((slug) =>
        fetch(`/api/roadmaps/${slug}`).then((r) => r.json())
      );
      const results = await Promise.all(promises);

      const extractedRoadmaps = results
        .map((r) => r.roadmap)
        .filter((r) => r && !r.error);
      const filteredRoadmaps = examModeActive
        ? extractedRoadmaps.filter((r) => r.category !== "Project")
        : extractedRoadmaps;

      setRoadmaps(filteredRoadmaps);
      onToggle();
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "available" || status === "completed") {
    return (
      <Card
        className={`relative overflow-hidden transition-all duration-500 ${
          isExpanded
            ? "shadow-2xl scale-[1.01]"
            : "shadow-lg hover:shadow-xl hover:scale-[1.005]"
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            status === "completed"
              ? "from-green-500 via-emerald-500 to-green-500"
              : "from-blue-500 via-purple-500 to-pink-500"
          } opacity-100`}
        >
          <div className="absolute inset-[3px] bg-white dark:bg-slate-900 rounded-lg"></div>
        </div>

        <div
          className={`absolute -inset-20 bg-gradient-to-r ${
            status === "completed"
              ? "from-green-500/20 to-emerald-500/20"
              : "from-blue-500/20 via-purple-500/20 to-pink-500/20"
          } blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}
        ></div>

        <div className="relative">
          <div
            className="p-6 cursor-pointer select-none group"
            onClick={handleToggle}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="transition-transform duration-300">
                  {isExpanded ? (
                    <ChevronDown className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <ChevronRight className="h-6 w-6 text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>

                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      status === "completed"
                        ? "from-green-500 to-emerald-500"
                        : "from-blue-500 to-purple-500"
                    } rounded-xl blur-lg opacity-50 animate-pulse`}
                  ></div>

                  <div
                    className={`relative p-3 bg-gradient-to-br ${
                      status === "completed"
                        ? "from-green-500 to-emerald-500"
                        : "from-blue-500 to-purple-500"
                    } rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Clock className="h-6 w-6 text-white animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent mb-1">
                    {year.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {year.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {yearProgress && (
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-slate-200 dark:text-slate-800"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 28 * (1 - completionPercent / 100)
                          }`}
                          className={
                            status === "completed"
                              ? "text-green-500"
                              : "text-purple-500"
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-lg font-bold text-slate-900 dark:text-white">
                        {completionPercent}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Complete</p>
                  </div>
                )}

                {year.testOutAvailable && status === "available" && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/roadmaps/masters/${masterId}/test/${year.yearNumber}`
                      );
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Test Out
                  </Button>
                )}

                {status === "completed" && (
                  <Badge className="bg-green-500 text-white border-0 shadow-lg">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>

            {yearProgress && (
              <div className="mt-4">
                <Progress
                  value={completionPercent}
                  className={`h-2.5 ${
                    status === "completed"
                      ? "bg-green-100 dark:bg-green-950"
                      : "bg-purple-100 dark:bg-purple-950"
                  }`}
                />
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/30 animate-in slide-in-from-top-4 duration-500">
              <div className="pt-6">
                <div className="mb-6 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {year.description}
                  </p>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      Loading roadmaps...
                    </p>
                  </div>
                )}

                {!loading && roadmaps.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roadmaps.map((roadmap, idx) => (
                      <div
                        key={roadmap.slug}
                        className="relative animate-in slide-in-from-bottom-4 fade-in duration-500"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <RoadmapCard roadmap={roadmap} compact={true} />

                        <div className="absolute top-2 right-2 z-10">
                          <CardTestButton
                            cardSlug={roadmap.slug}
                            masterId={masterId}
                            yearNumber={year.yearNumber}
                            currentProgress={roadmap.overallProgress || 0}
                            lastAttempt={null}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {year.roadmaps.some((r) => r.type === "tech-stack-hub") && (
                  <Card className="mt-6 p-6 border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-md animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                          Tech Stack Selection
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Choose your specialization: Web Dev, ML, Mobile,
                          DevOps, or Cybersecurity
                        </p>
                      </div>

                      <Button
                        onClick={() => router.push("/roadmaps/tech-stack-hub")}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Choose Stack
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div
      className={`relative ${isShaking ? "animate-shake" : ""}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Card
        className="relative overflow-hidden cursor-not-allowed transition-all duration-300 hover:scale-[1.005]"
        onClick={handleToggle}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl"></div>

        <div className="absolute inset-0 border-2 border-slate-300/50 dark:border-slate-700/50 rounded-lg"></div>

        <div className="absolute inset-0 opacity-20 blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-400 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-400 rounded w-48 mb-2"></div>
                <div className="h-4 bg-slate-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-slate-400 rounded-xl blur-md opacity-50"></div>
                <div className="relative p-3 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-500 dark:text-slate-400 mb-1">
                  {year.title}
                </h3>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                  {year.subtitle}
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-0"
            >
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>

          <div className="mt-6 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-300 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unlock Requirements
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {year.unlockMessage}
                </p>

                <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Previous Year Progress
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      0 / {year.requiredProgress}% needed
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="h-1.5 bg-slate-200 dark:bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTooltip && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg shadow-xl text-sm font-medium whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Complete previous year to unlock
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
            </div>
          </div>
        )}
      </Card>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
