"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Download,
  Lock,
  Award,
  Map,
  List,
  Target,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MetroMapContainer from "@/components/roadmaps/metro-map/metro-map-container";
import RoadmapListView from "@/components/roadmaps/roadmap-list-view";
import QuizUnlockBanner from "@/components/roadmaps/quiz/quiz-unlock-banner";

export default function RoadmapDetailClient({
  roadmap,
  nodes,
  userProgress: initialUserProgress,
  currentUser,
  quizStatus: initialQuizStatus,
}) {
  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [quizStatus, setQuizStatus] = useState(initialQuizStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [viewMode, setViewMode] = useState("metro");

  useEffect(() => {
    const saved = sessionStorage.getItem("roadmap-view-mode");
    if (saved && (saved === "metro" || saved === "list")) {
      setViewMode(saved);
    }
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("roadmap-view-mode", viewMode);
    }
  }, [viewMode]);

  const refreshProgress = async () => {
    if (!currentUser) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(
        `/api/roadmaps/progress?roadmapId=${roadmap.slug}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
      }
    } catch (error) {
      console.error("Error refreshing progress:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshQuizStatus = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/roadmaps/${roadmap.slug}/quiz/status`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setQuizStatus(data);
      }
    } catch (error) {
      console.error("Error refreshing quiz status:", error);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && currentUser) {
        refreshProgress();
        refreshQuizStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentUser, roadmap.slug]);

  const overallProgress = Math.min(100, userProgress?.overallProgress || 0);

  const totalSubtopics = nodes.reduce(
    (sum, node) => sum + (node.subtopics?.length || 0),
    0
  );
  const completedSubtopics =
    userProgress?.nodesProgress?.reduce(
      (sum, nodeProgress) =>
        sum + (nodeProgress.completedSubtopics?.length || 0),
      0
    ) || 0;

//   console.log("🔍 ROADMAP DEBUG:");
//   console.log("Total nodes:", nodes.length);
//   console.log("Total subtopics:", totalSubtopics);
//   console.log("Completed subtopics:", completedSubtopics);
//   console.log("User progress nodes:", userProgress?.nodesProgress?.length);
//   console.log("Overall progress from DB:", userProgress?.overallProgress);
//   console.log("Capped progress:", overallProgress);
//   console.log(
//     "Nodes data:",
//     nodes.map((n) => ({
//       week: n.weekNumber,
//       nodeId: n.nodeId,
//       title: n.title,
//       subtopics: n.subtopics?.length,
//     }))
//   );
//   console.log(
//     "User progress data:",
//     userProgress?.nodesProgress?.map((np) => ({
//       nodeId: np.nodeId,
//       completedSubtopics: np.completedSubtopics?.length,
//       totalSubtopics: np.totalSubtopics,
//     }))
//   );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const handleMarkComplete = async (nodeId) => {
    if (!currentUser) {
      alert("Please login to track progress");
      return;
    }

    try {
      const response = await fetch("/api/roadmaps/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: roadmap.slug,
          nodeId,
          status: "completed",
          completedSubtopics: [],
        }),
      });

      if (response.ok) {
        await refreshProgress();
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleProtectedDownload = (e) => {
    if (!currentUser) {
      e.preventDefault();
      setShowLoginDialog(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl"></div>

        <header className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-7xl relative">
            <Link href="/roadmaps">
              <Button
                variant="ghost"
                size="sm"
                className="mb-3 group text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Roadmaps
              </Button>
            </Link>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative text-5xl bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-lg transform group-hover:scale-105 transition-transform">
                    {roadmap.icon}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-foreground">
                    {roadmap.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="border-slate-300 dark:border-slate-700"
                    >
                      {roadmap.category}
                    </Badge>
                    <Badge className={getDifficultyColor(roadmap.difficulty)}>
                      {roadmap.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {roadmap.estimatedWeeks} weeks
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      {nodes.length} topics
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative inline-flex items-center gap-0 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-inner">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-500 to-purple-600 rounded-md shadow-lg transition-transform duration-300 ease-out ${
                    viewMode === "list"
                      ? "translate-x-[calc(100%+8px)]"
                      : "translate-x-0"
                  }`}
                ></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("metro")}
                  className={`gap-2 relative z-10 transition-colors ${
                    viewMode === "metro"
                      ? "text-foreground -foreground"
                      : "text-foreground"
                  }`}
                >
                  <Map className="h-4 w-4" />
                  Metro
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`gap-2 relative z-10 transition-colors ${
                    viewMode === "list"
                      ? "text-foreground -foreground hover:bg-transparent"
                      : "text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>

            {currentUser && (
              <div className="mt-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Progress
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {completedSubtopics}/{totalSubtopics} subtopics •{" "}
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full relative"
                      style={{ width: `${overallProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 blur-sm"></div>
                    </div>
                  </div>
                  <div className="absolute -top-1 left-0 right-0 flex justify-between px-1 pointer-events-none">
                    {[25, 50, 75, 90].map((milestone) => (
                      <div
                        key={milestone}
                        className={`w-1.5 h-5 rounded-full transition-all duration-500 ${
                          overallProgress >= milestone
                            ? "bg-gradient-to-b from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        style={{ marginLeft: `${milestone}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          {roadmap.notesAttachments && roadmap.notesAttachments.length > 0 && (
            <div className="relative mb-6 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <Card className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-blue-200/60 dark:border-blue-800/60 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="relative flex items-start gap-4">
                  <div className="text-4xl">📚</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      Study Materials Available
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
                      >
                        {roadmap.notesAttachments.length} files
                      </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.notesAttachments.map((attachment, idx) =>
                        currentUser ? (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-2 hover:scale-105 hover:shadow-md transition-all border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600"
                          >
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-3 w-3" />
                              {attachment.fileName}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({attachment.fileSize})
                              </span>
                            </a>
                          </Button>
                        ) : (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="gap-2 hover:scale-105 transition-transform"
                            onClick={handleProtectedDownload}
                          >
                            <Lock className="h-3 w-3" />
                            {attachment.fileName}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({attachment.fileSize})
                            </span>
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:scale-105 transition-all group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prerequisites</p>
                  <p className="font-bold text-lg">
                    {roadmap.prerequisites?.length || 0} items
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:scale-105 transition-all group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outcomes</p>
                  <p className="font-bold text-lg">
                    {roadmap.outcomes?.length || 0} skills
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:scale-105 transition-all group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Roles</p>
                  <p className="font-bold text-lg">
                    {roadmap.targetRoles?.length || 0} roles
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {viewMode === "metro" ? (
            <MetroMapContainer
              nodes={nodes}
              userProgress={userProgress}
              roadmap={roadmap}
              currentUser={currentUser}
              onMarkComplete={handleMarkComplete}
              onProgressUpdate={refreshProgress}
              quizStatus={quizStatus}
            />
          ) : (
            <RoadmapListView
              nodes={nodes}
              userProgress={userProgress}
              roadmap={roadmap}
              currentUser={currentUser}
              quizStatus={quizStatus}
            />
          )}

          {currentUser && overallProgress >= 90 && !quizStatus?.status && (
            <QuizUnlockBanner
              roadmapSlug={roadmap.slug}
              roadmapTitle={roadmap.title}
              overallProgress={overallProgress}
              isUnlocked={overallProgress >= 90}
            />
          )}

          {currentUser && quizStatus?.status === "mastered" && (
            <div className="relative mt-6 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-2xl blur opacity-40 group-hover:opacity-60"></div>
              <Card className="relative p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200 dark:border-yellow-800 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Award className="h-7 w-7 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-foreground">
                        🎉 Certificate Ready!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You've completed this roadmap and passed the quiz.
                        Download your certificate now!
                      </p>
                    </div>
                  </div>
                  <Link href={`/roadmaps/${roadmap.slug}/certificate`}>
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <Award className="h-5 w-5" />
                      View Certificate
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl">Login Required</DialogTitle>
            <DialogDescription className="text-base">
              You need to be logged in to download study materials. Create a
              free account to access all learning resources!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up Free
            </Button>
            <Button
              variant="outline"
              className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
