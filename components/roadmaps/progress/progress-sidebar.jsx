"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressRing from "./progress-ring";
import NextNodeCard from "./next-node-card";
import { Flame, Target, Trophy, Award, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgressSidebar({
  roadmap,
  nodes,
  userProgress,
  overallProgress,
  quizStatus,
}) {
  const router = useRouter();

  const groupedNodes = nodes.reduce((acc, node) => {
    const week = node.weekNumber || 1;
    if (!acc[week]) acc[week] = [];
    acc[week].push(node);
    return acc;
  }, {});

  const phaseBreakdown = Object.keys(groupedNodes).map((week) => {
    const phaseNodes = groupedNodes[week];
    const completed = phaseNodes.filter((node) => {
      const nodeProgress = userProgress?.nodesProgress?.find(
        (n) => n.nodeId === node.nodeId
      );
      return nodeProgress?.status === "completed";
    }).length;
    const total = phaseNodes.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      week: `Week ${week}`,
      completed,
      total,
      percentage,
    };
  });

  const nextNode = nodes.find((node) => {
    const nodeProgress = userProgress?.nodesProgress?.find(
      (n) => n.nodeId === node.nodeId
    );
    const status = nodeProgress?.status;
    return status === "in-progress" || (!status && isNodeUnlocked(node));
  });

  function isNodeUnlocked(node) {
    if (!node.prerequisites || node.prerequisites.length === 0) return true;
    if (!userProgress) return false;

    return node.prerequisites.every((prereqId) => {
      const prereqProgress = userProgress?.nodesProgress?.find(
        (n) => n.nodeId === prereqId
      );
      return prereqProgress?.status === "completed";
    });
  }

  const currentStreak = userProgress?.streaks?.current || 0;
  const longestStreak = userProgress?.streaks?.longest || 0;
  const totalNodes = nodes.length;
  const completedNodes =
    userProgress?.nodesProgress?.filter((n) => n.status === "completed")
      .length || 0;

  let totalSubtopics = 0;
  let completedSubtopics = 0;

  nodes.forEach((node) => {
    totalSubtopics += node.subtopics?.length || 0;
  });

  userProgress?.nodesProgress?.forEach((nodeProgress) => {
    completedSubtopics += nodeProgress.completedSubtopics?.length || 0;
  });

  const remainingSubtopics = totalSubtopics - completedSubtopics;

  const cappedProgress = Math.min(100, overallProgress);
  const isQuizUnlocked = cappedProgress >= 90;
  const isMastered = quizStatus?.status === "mastered";

  return (
    <div className="sticky top-24 space-y-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary animate-pulse" />
            Roadmap Progress
          </h3>
          <Badge variant="secondary" className="text-lg font-bold px-3 py-1 shadow-sm">
            {Math.round(cappedProgress)}%
          </Badge>
        </div>

        <div className="flex justify-center mb-6">
          <ProgressRing percentage={cappedProgress} />
        </div>

        <div className="space-y-3 mb-6">
          {phaseBreakdown.map((phase, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] group"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  {phase.percentage === 100 && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
                  )}
                  {phase.week}
                </span>
                <Badge
                  variant={phase.percentage === 100 ? "default" : "outline"}
                  className={phase.percentage === 100 ? "bg-green-600" : ""}
                >
                  {Math.round(phase.percentage)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-500 ${
                    phase.percentage === 100
                      ? "bg-green-600"
                      : "bg-primary"
                  }`}
                  style={{ width: `${phase.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {phase.completed}/{phase.total} topics completed
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="bg-white/80 dark:bg-gray-900/50 rounded-lg p-4 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="text-3xl font-bold text-primary mb-1">
              {completedNodes}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Nodes Done</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/50 rounded-lg p-4 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {completedSubtopics}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Topics Done</div>
          </div>
        </div>
      </Card>

      {!isQuizUnlocked ? (
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-base mb-1 text-foreground">Quiz Locked</h4>
              <p className="text-xs text-muted-foreground">
                Complete all topics to unlock the final quiz
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Progress to Quiz</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                {remainingSubtopics} topics left
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-yellow-600 h-full transition-all duration-500"
                style={{ width: `${cappedProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/50 rounded-lg p-4 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-2 text-foreground mb-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold">After 100% completion:</span>
            </div>
            <ul className="ml-6 space-y-1.5 text-muted-foreground">
              <li>• Take a 10-question quiz</li>
              <li>• Pass with 70% to earn certificate</li>
              <li>• Download & share your achievement</li>
            </ul>
          </div>
        </Card>
      ) : isMastered ? (
        <Link href={`/roadmaps/${roadmap.slug}/certificate`}>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-500 hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                <Award className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-foreground">Certificate Earned! 🏆</h4>
                <p className="text-sm text-muted-foreground">
                  Congratulations on mastering this!
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" size="lg">
              <Award className="h-5 w-5" />
              View Certificate
            </Button>
          </Card>
        </Link>
      ) : (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-500 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500 rounded-full shadow-lg">
              <Trophy className="h-6 w-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-foreground">Quiz Unlocked! 🎉</h4>
              <p className="text-sm text-muted-foreground">
                You've completed all topics
              </p>
            </div>
          </div>
          {quizStatus && (
            <div className="mb-4 p-4 bg-white/80 dark:bg-gray-900/50 rounded-lg space-y-2 text-sm backdrop-blur-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attempts Used:</span>
                <span className="font-medium text-foreground">
                  {quizStatus.attemptsUsed}/{quizStatus.attemptsUnlocked}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passed:</span>
                <span className="font-medium text-green-600">
                  {quizStatus.passed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Score:</span>
                <span className="font-medium text-blue-600">
                  {quizStatus.bestScore}%
                </span>
              </div>
            </div>
          )}

          {quizStatus?.canTakeQuiz ? (
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => router.push(`/roadmaps/${roadmap.slug}/quiz`)}
            >
              <Trophy className="h-5 w-5" />
              Take Quiz ({quizStatus.attemptsRemaining} left)
            </Button>
          ) : (
            <div className="space-y-2">
              <Button size="lg" variant="outline" className="w-full" disabled>
                <Lock className="h-5 w-5 mr-2" />
                No Attempts Remaining
              </Button>
              <Link href="/activity/quizzes">
                <Button size="sm" variant="ghost" className="w-full">
                  View Quiz History
                </Button>
              </Link>
            </div>
          )}
        </Card>
      )}

      {currentStreak > 0 && (
        <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-300 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
              <Flame className="h-7 w-7 text-foreground animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-orange-600">
                {currentStreak} days
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                Current Streak!
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs bg-white/80 dark:bg-gray-900/50 rounded-lg p-3 backdrop-blur-sm">
            <span className="text-muted-foreground">Best Streak:</span>
            <span className="font-bold text-foreground">{longestStreak} days 🏆</span>
          </div>
        </Card>
      )}

      {nextNode && <NextNodeCard node={nextNode} roadmapSlug={roadmap.slug} />}

      <Card className="p-5 shadow-lg hover:shadow-xl transition-all">
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-foreground">
          <Target className="h-4 w-4 text-primary" />
          Quick Stats
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="text-muted-foreground">Total Nodes</span>
            <Badge variant="outline">{totalNodes}</Badge>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="text-muted-foreground">Completed</span>
            <Badge className="bg-green-600">{completedNodes}</Badge>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="text-muted-foreground">In Progress</span>
            <Badge variant="secondary">
              {userProgress?.nodesProgress?.filter(
                (n) => n.status === "in-progress"
              ).length || 0}
            </Badge>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700 p-2">
            <span className="text-muted-foreground">Estimated Time</span>
            <span className="font-bold text-foreground">{roadmap.estimatedWeeks} weeks</span>
          </div>
        </div>
      </Card>

      <Link href="/roadmaps">
        <Button variant="outline" className="w-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          ← Back to All Roadmaps
        </Button>
      </Link>
    </div>
  );
}
