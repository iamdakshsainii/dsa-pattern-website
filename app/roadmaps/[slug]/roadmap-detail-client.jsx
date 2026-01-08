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
 const [viewMode, setViewMode] = useState('metro')

useEffect(() => {
  const saved = sessionStorage.getItem('roadmap-view-mode')
  if (saved && (saved === 'metro' || saved === 'list')) {
    setViewMode(saved)
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

  // ADD THESE LOGS HERE:
  console.log("🔍 ROADMAP DEBUG:");
  console.log("Total nodes:", nodes.length);
  console.log("Total subtopics:", totalSubtopics);
  console.log("Completed subtopics:", completedSubtopics);
  console.log("User progress nodes:", userProgress?.nodesProgress?.length);
  console.log("Overall progress from DB:", userProgress?.overallProgress);
  console.log("Capped progress:", overallProgress);
  console.log(
    "Nodes data:",
    nodes.map((n) => ({
      week: n.weekNumber,
      nodeId: n.nodeId,
      title: n.title,
      subtopics: n.subtopics?.length,
    }))
  );
  console.log(
    "User progress data:",
    userProgress?.nodesProgress?.map((np) => ({
      nodeId: np.nodeId,
      completedSubtopics: np.completedSubtopics?.length,
      totalSubtopics: np.totalSubtopics,
    }))
  );

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <Link href="/roadmaps">
              <Button variant="ghost" size="sm" className="mb-3">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roadmaps
              </Button>
            </Link>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{roadmap.icon}</div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{roadmap.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{roadmap.category}</Badge>
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

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "metro" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("metro")}
                  className="gap-2"
                >
                  <Map className="h-4 w-4" />
                  Metro
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>

            {currentUser && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-sm font-medium">
                    {completedSubtopics}/{totalSubtopics} subtopics •{" "}
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {roadmap.notesAttachments && roadmap.notesAttachments.length > 0 && (
            <Card className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="text-3xl">📚</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    Study Materials Available
                    <Badge variant="secondary">
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
                          className="gap-2"
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
                          className="gap-2"
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
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prerequisites</p>
                  <p className="font-semibold">
                    {roadmap.prerequisites?.length || 0} items
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outcomes</p>
                  <p className="font-semibold">
                    {roadmap.outcomes?.length || 0} skills
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Roles</p>
                  <p className="font-semibold">
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
            <Card className="mt-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      🎉 Certificate Ready!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You've completed this roadmap and passed the quiz.
                      Download your certificate now!
                    </p>
                  </div>
                </div>
                <Link href={`/roadmaps/${roadmap.slug}/certificate`}>
                  <Button size="lg" className="gap-2">
                    <Award className="h-5 w-5" />
                    View Certificate
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </main>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to download study materials. Create a
              free account to access all learning resources!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1"
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up Free
            </Button>
            <Button
              variant="outline"
              className="flex-1"
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
