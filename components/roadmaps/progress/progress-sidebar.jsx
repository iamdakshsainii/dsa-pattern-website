"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressRing from "./progress-ring";
import NextNodeCard from "./next-node-card";
import { Flame, Target, Trophy, Award, Lock } from "lucide-react";
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
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Roadmap Progress
          </h3>
          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
            {Math.round(cappedProgress)}%
          </Badge>
        </div>

        <div className="flex justify-center mb-6">
          <ProgressRing percentage={cappedProgress} />
        </div>

        <div className="space-y-3 mb-4">
          {phaseBreakdown.map((phase, idx) => (
            <div
              key={idx}
              className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 backdrop-blur"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold">{phase.week}</span>
                <Badge
                  variant={phase.percentage === 100 ? "default" : "outline"}
                >
                  {Math.round(phase.percentage)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    phase.percentage === 100
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
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

        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              {completedNodes}
            </div>
            <div className="text-xs text-muted-foreground">Nodes Done</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {completedSubtopics}
            </div>
            <div className="text-xs text-muted-foreground">Topics Done</div>
          </div>
        </div>
      </Card>

      {!isQuizUnlocked ? (
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">Quiz Locked</h4>
              <p className="text-xs text-muted-foreground">
                Complete all topics to unlock the final quiz
              </p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Progress to Quiz</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                {remainingSubtopics} topics left
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${cappedProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="h-4 w-4" />
              <span className="font-semibold">After 100% completion:</span>
            </div>
            <ul className="ml-6 space-y-1 text-muted-foreground">
              <li>• Take a 10-question quiz</li>
              <li>• Pass with 70% to earn certificate</li>
              <li>• Download & share your achievement</li>
            </ul>
          </div>
        </Card>
      ) : isMastered ? (
        <Link href={`/roadmaps/${roadmap.slug}/certificate`}>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-500 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Certificate Earned! 🏆</h4>
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
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-500 rounded-full">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Quiz Unlocked! 🎉</h4>
              <p className="text-sm text-muted-foreground">
                You've completed all topics
              </p>
            </div>
          </div>
          {quizStatus && (
            <div className="mb-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attempts Used:</span>
                <span className="font-medium">
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
        <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-300 dark:border-orange-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <Flame className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {currentStreak} days
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                Current Streak!
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs bg-white/50 dark:bg-gray-900/50 rounded-lg p-2">
            <span className="text-muted-foreground">Best Streak:</span>
            <span className="font-bold">{longestStreak} days 🏆</span>
          </div>
        </Card>
      )}

      {nextNode && <NextNodeCard node={nextNode} roadmapSlug={roadmap.slug} />}

      <Card className="p-5">
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Quick Stats
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Nodes</span>
            <Badge variant="outline">{totalNodes}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Completed</span>
            <Badge className="bg-green-500">{completedNodes}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">In Progress</span>
            <Badge variant="secondary">
              {userProgress?.nodesProgress?.filter(
                (n) => n.status === "in-progress"
              ).length || 0}
            </Badge>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-muted-foreground">Estimated Time</span>
            <span className="font-bold">{roadmap.estimatedWeeks} weeks</span>
          </div>
        </div>
      </Card>

      <Link href="/roadmaps">
        <Button variant="outline" className="w-full">
          ← Back to All Roadmaps
        </Button>
      </Link>
    </div>
  );
}
