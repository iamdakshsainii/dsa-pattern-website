import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StationWrapper } from "@/components/quiz/station-wrapper";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Award,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Video,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  Target,
  Zap,
  Lock,
  Unlock,
  Activity,
  Clock,
  Brain,
  Sparkles,
  TrendingUp,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export function ScoreHeader({ passed, score, totalQuestions, percentage, timeTaken, attemptNumber, evaluation, newBadges }) {
  const getBadgeIcon = (badgeId) => {
    const icons = {
      "quiz-first-attempt": "📝",
      "quiz-first-pass": "✅",
      "quiz-first-try-master": "🎯",
      "quiz-persistent": "💪",
      "quiz-master": "👑",
      "quiz-comeback": "🔥",
      "quiz-perfect": "💯",
    };
    return icons[badgeId] || "🏆";
  };

  const getBadgeColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      green: "bg-green-100 text-green-700 border-green-300",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
      gold: "bg-yellow-200 text-yellow-800 border-yellow-400",
      pink: "bg-pink-100 text-pink-700 border-pink-300",
    };
    return colors[color] || colors.blue;
  };

  return (
    <Card
      className={`p-6 mb-6 border-2 relative overflow-hidden ${
        passed
          ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          : "border-red-500 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -ml-16 -mb-16" />

      <div className="relative">
        <div className="text-center mb-4">
          {passed ? (
            <div className="inline-block p-3 bg-green-500 rounded-full mb-3 shadow-lg animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          ) : (
            <div className="inline-block p-3 bg-red-500 rounded-full mb-3 shadow-lg">
              <XCircle className="h-12 w-12 text-white" />
            </div>
          )}
          <h1
            className={`text-3xl font-bold mb-1 ${
              passed
                ? "text-green-800 dark:text-green-300"
                : "text-red-800 dark:text-red-300"
            }`}
          >
            {passed ? "Excellent Work!" : "Keep Going!"}
          </h1>
          <p className="text-lg text-muted-foreground">
            You scored {score} out of {totalQuestions} questions
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
          <div className="text-center">
            <div
              className={`text-5xl font-bold ${
                passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentage}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              {timeTaken}m
            </div>
            <div className="text-xs text-muted-foreground mt-1">Time Taken</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              #{attemptNumber}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Attempt</div>
          </div>
        </div>

        <Progress value={percentage} className="h-3 mb-4" />

        {evaluation?.message && (
          <Card
            className={`p-3 mb-3 border ${
              evaluation.status === "mastered"
                ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-400"
                : evaluation.status === "struggling"
                ? "bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-orange-400"
                : "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-400"
            }`}
          >
            <div className="flex items-start gap-2">
              {evaluation.status === "mastered" ? (
                <Trophy className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm mb-1">
                  {evaluation.status === "mastered"
                    ? "🎉 Roadmap Mastered!"
                    : evaluation.status === "struggling"
                    ? "💪 Bonus Attempts Unlocked!"
                    : "🚀 Keep Going!"}
                </p>
                <p className="text-xs">{evaluation.message}</p>
                {evaluation.unlockCount > 0 && (
                  <Badge className="mt-2 bg-orange-600 text-white text-xs">
                    +{evaluation.unlockCount} Extra Attempts
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        )}

        {newBadges.length > 0 && (
          <Card className="p-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-500">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <p className="font-bold text-sm mb-2">🎉 New Badges Unlocked!</p>
                <div className="flex flex-wrap gap-1.5">
                  {newBadges.map((badge) => (
                    <Badge
                      key={badge.id}
                      className={`${getBadgeColor(badge.color)} text-xs px-2 py-0.5 border`}
                    >
                      {getBadgeIcon(badge.id)} {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}

export function FocusAreas({ analytics, weakTopicResources, passed }) {
  const weakTopics = Object.entries(analytics.byTopic).filter(([_, data]) => data.incorrect.length > 0);
  const totalIncorrect = weakTopics.reduce((acc, [_, data]) => acc + data.incorrect.length, 0);

  const scrollToFocusAreas = () => {
    const element = document.getElementById('focus-areas-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const compactPreview = (
    <div className="space-y-2">
      {weakTopics.slice(0, 3).map(([topic, data]) => (
        <div key={topic} className="flex items-center justify-between text-xs">
          <span className="font-medium">{topic}</span>
          <Badge variant="destructive" className="text-xs">{data.incorrect.length} missed</Badge>
        </div>
      ))}
    </div>
  );

  return (
    <StationWrapper
      title="Focus Areas & Resources"
      icon={Brain}
      lineColor="bg-orange-500"
      defaultOpen={!passed}
      badge={<Badge variant="destructive">{totalIncorrect} to review</Badge>}
      preview={`${weakTopics.length} topics need review`}
      compact={compactPreview}
    >
      <div id="focus-areas-section" className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Review these topics before your next attempt to improve your score
        </p>
        {weakTopics
          .sort((a, b) => b[1].incorrect.length - a[1].incorrect.length)
          .map(([topic, data]) => (
            <Card
              key={topic}
              className="p-4 border-l-4 border-l-orange-500 bg-white dark:bg-gray-900/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-base mb-1">{topic}</h4>
                  <p className="text-xs text-muted-foreground">
                    Accuracy: {data.percentage}% • {data.correct}/{data.total} correct
                  </p>
                </div>
                <Badge variant="destructive" className="text-sm px-2 py-1">
                  {data.incorrect.length} incorrect
                </Badge>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold mb-2">❌ Questions you missed:</p>
                <ul className="space-y-1.5">
                  {data.incorrect.map((q, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs bg-orange-50 dark:bg-orange-900/20 p-2 rounded"
                    >
                      <span className="text-orange-600 font-bold">•</span>
                      <span>
                        {q.question ? q.question.substring(0, 100) : "No question text"}
                        {q.question && q.question.length > 100 ? "..." : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {weakTopicResources[topic] && weakTopicResources[topic].length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    Recommended Resources:
                  </p>
                  <div className="grid gap-1.5">
                    {weakTopicResources[topic].map((resource, resIdx) => (
                      <a
                        key={resIdx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded hover:shadow-md transition-all border border-purple-200"
                      >
                        {resource.type === "youtube" ? (
                          <div className="p-1.5 bg-red-100 rounded">
                            <Video className="h-4 w-4 text-red-600" />
                          </div>
                        ) : resource.type === "practice" ? (
                          <div className="p-1.5 bg-yellow-100 rounded">
                            <Zap className="h-4 w-4 text-yellow-600" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-blue-100 rounded">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-xs">{resource.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
      </div>
    </StationWrapper>
  );
}

export function CertificationProgress({ passedCount, badgeProgress, isMastered, canRetake, roadmapSlug, attemptsRemaining }) {
  const certificationProgress = Math.min(100, (passedCount / 3) * 100);

  const getBadgeIcon = (badgeId) => {
    const icons = {
      "quiz-first-attempt": "📝",
      "quiz-first-pass": "✅",
      "quiz-first-try-master": "🎯",
    };
    return icons[badgeId] || "🏆";
  };

  const getBadgeColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      green: "bg-green-100 text-green-700 border-green-300",
      gold: "bg-yellow-200 text-yellow-800 border-yellow-400",
    };
    return colors[color] || colors.blue;
  };

  const quizBadges = [
    {
      id: "quiz-first-attempt",
      name: "Quiz Taker",
      color: "blue",
      condition: () => badgeProgress?.quizAttempts >= 1,
    },
    {
      id: "quiz-first-pass",
      name: "Quiz Pass",
      color: "green",
      condition: () => badgeProgress?.quizPasses >= 1,
    },
    {
      id: "quiz-first-try-master",
      name: "First Try Master",
      color: "gold",
      condition: () => badgeProgress?.firstTryPass80Plus,
    },
  ];

  const compactPreview = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Progress value={certificationProgress} className="h-2 w-32" />
        <span className="text-sm font-semibold">{passedCount}/3 passes</span>
      </div>
      <div className="flex gap-1">
        {quizBadges.map((badge) => {
          const isUnlocked = badgeProgress ? badge.condition() : false;
          return isUnlocked ? (
            <span key={badge.id} className="text-lg">{getBadgeIcon(badge.id)}</span>
          ) : null;
        })}
      </div>
    </div>
  );

  if (isMastered) return null;

  return (
    <StationWrapper
      title="Certification Progress"
      icon={Trophy}
      lineColor="bg-purple-500"
      defaultOpen={passedCount >= 2}
      badge={
        <Badge className="bg-purple-100 text-purple-700 border-purple-300">
          {passedCount}/3
        </Badge>
      }
      preview={`${passedCount >= 3 ? 'Certificate unlocked!' : `${3 - passedCount} more ${3 - passedCount === 1 ? 'pass' : 'passes'} needed`}`}
      compact={compactPreview}
    >
      <div className="space-y-4">
        {attemptsRemaining > 0 && attemptsRemaining <= 2 && (
          <Card className="p-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-400">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-orange-900 dark:text-orange-200">
                  ⚠️ {attemptsRemaining} {attemptsRemaining === 1 ? 'Attempt' : 'Attempts'} Left!
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Quiz will lock after all attempts are used. Contact mentor to unlock more.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Certificate Progress</span>
            <span className="text-lg font-bold text-purple-600">
              {passedCount}/3 passes
            </span>
          </div>
          <Progress value={certificationProgress} className="h-3 mb-1" />
          <p className="text-xs text-muted-foreground">
            {passedCount >= 3
              ? "Certificate unlocked!"
              : `${3 - passedCount} more ${3 - passedCount === 1 ? "pass" : "passes"} needed`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Card className="p-3 border border-green-200 bg-green-50/50 dark:bg-green-900/10">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Unlock className="h-4 w-4 text-green-600" />
              Requirements
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>Complete roadmap (90%+)</span>
              </div>
              <div className="flex items-center gap-2">
                {passedCount >= 3 ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                )}
                <span>Pass quiz 3 times (70%+)</span>
              </div>
            </div>
          </Card>

          <Card className="p-3 border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Quiz Badges
            </h4>
            <div className="space-y-1.5">
              {quizBadges.map((badge) => {
                const isUnlocked = badgeProgress ? badge.condition() : false;
                return (
                  <div key={badge.id} className="flex items-center gap-2 text-xs">
                    {isUnlocked ? (
                      <Badge className={`${getBadgeColor(badge.color)} text-xs px-1.5 py-0`}>
                        {getBadgeIcon(badge.id)}
                      </Badge>
                    ) : (
                      <Lock className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={isUnlocked ? "font-medium" : "text-muted-foreground"}>
                      {badge.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {canRetake && (
            <Link href={roadmapSlug ? `/roadmaps/${roadmapSlug}/quiz` : "#"}>
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="sm">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
            </Link>
          )}
          <Link href="/profile/activities">
            <Button variant="outline" className="w-full" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Activity Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </StationWrapper>
  );
}

export function PerformanceAnalytics({ analytics }) {
  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") return "bg-green-100 text-green-700 border-green-300";
    if (difficulty === "hard") return "bg-red-100 text-red-700 border-red-300";
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  const compactPreview = (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(analytics.byDifficulty).map(([difficulty, data]) => (
        <Badge key={difficulty} className={`${getDifficultyColor(difficulty)} text-xs`}>
          {difficulty}: {data.percentage}%
        </Badge>
      ))}
    </div>
  );

  const avgPerformance = Object.values(analytics.byDifficulty).reduce((acc, d) => acc + d.percentage, 0) / Object.values(analytics.byDifficulty).length;

  return (
    <StationWrapper
      title="Performance Analytics"
      icon={BarChart3}
      lineColor="bg-blue-500"
      defaultOpen={false}
      badge={<Badge variant="outline">{Math.round(avgPerformance)}% avg</Badge>}
      preview={`${Object.keys(analytics.byTopic).length} topics analyzed`}
      compact={compactPreview}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(analytics.byDifficulty).map(([difficulty, data]) => (
            <Card
              key={difficulty}
              className={`p-3 border-l-4 ${
                difficulty === "easy"
                  ? "border-l-green-500 bg-green-50/50 dark:bg-green-900/10"
                  : difficulty === "hard"
                  ? "border-l-red-500 bg-red-50/50 dark:bg-red-900/10"
                  : "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10"
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-semibold capitalize text-sm">{difficulty}</span>
                <Badge className={getDifficultyColor(difficulty) + " text-xs"}>
                  {data.correct}/{data.total}
                </Badge>
              </div>
              <Progress value={data.percentage} className="h-2 mb-1.5" />
              <p className="text-xs font-medium">{data.percentage}% accuracy</p>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Topic Breakdown
          </h4>
          {Object.entries(analytics.byTopic).map(([topic, data]) => (
            <div key={topic} className="space-y-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{topic}</span>
                <Badge variant={data.percentage >= 70 ? "default" : "destructive"} className="text-xs">
                  {data.correct}/{data.total} ({data.percentage}%)
                </Badge>
              </div>
              <Progress value={data.percentage} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </StationWrapper>
  );
}

export function QuestionReview({ answers, filterType, setFilterType, filteredAnswers, expandedQuestions, toggleQuestion }) {
  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") return "bg-green-100 text-green-700 border-green-300";
    if (difficulty === "hard") return "bg-red-100 text-red-700 border-red-300";
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = answers.filter(a => !a.isCorrect).length;

  const compactPreview = (
    <div className="grid grid-cols-10 gap-1">
      {answers.slice(0, 10).map((answer, idx) => (
        <div
          key={idx}
          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
            answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
          title={`Q${idx + 1}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}`}
        >
          {idx + 1}
        </div>
      ))}
    </div>
  );

  return (
    <StationWrapper
      title="Question Review"
      icon={BookOpen}
      lineColor="bg-green-500"
      defaultOpen={false}
      badge={
        <div className="flex gap-1">
          <Badge className="bg-green-600 text-white text-xs">{correctCount}</Badge>
          <Badge className="bg-red-600 text-white text-xs">{incorrectCount}</Badge>
        </div>
      }
      preview={`${answers.length} questions • ${correctCount} correct, ${incorrectCount} incorrect`}
      compact={compactPreview}
    >
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            All ({answers.length})
          </Button>
          <Button
            variant={filterType === "correct" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("correct")}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Correct ({correctCount})
          </Button>
          <Button
            variant={filterType === "incorrect" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("incorrect")}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Incorrect ({incorrectCount})
          </Button>
        </div>

        <div className="space-y-3">
          {filteredAnswers.map((answer, idx) => {
            const isExpanded = expandedQuestions.has(answer.questionId);
            const isCorrect = answer.isCorrect;

            return (
              <Card
                key={answer.questionId}
                className={`overflow-hidden border-l-4 transition-all ${
                  isCorrect
                    ? "border-l-green-500 bg-green-50/30 dark:bg-green-900/10 hover:bg-green-50/50"
                    : "border-l-red-500 bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50"
                }`}
              >
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => toggleQuestion(answer.questionId)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <Badge
                          className={`${
                            isCorrect ? "bg-green-600" : "bg-red-600"
                          } text-white font-semibold text-xs`}
                        >
                          {isCorrect ? "✓" : "✗"}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(answer.difficulty) + " text-xs"}>
                          {answer.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">{answer.topic}</Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">
                        Q{idx + 1}: {answer.question}
                      </h4>
                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ChevronDown className="h-3 w-3" />
                          Click to view details
                        </p>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t bg-white/50 dark:bg-gray-900/50">
                    <div className="pt-3 space-y-2">
                      <h5 className="font-semibold text-xs flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        Answer Options:
                      </h5>
                      {answer.options?.map((option, optIdx) => {
                        const isUserAnswer = option === answer.userAnswer;
                        const isCorrectAnswer = option === answer.correctAnswer;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded border-2 transition-all text-sm ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                                : isUserAnswer && !isCorrect
                                ? "border-red-500 bg-red-100 dark:bg-red-900/30"
                                : "border-gray-200 bg-gray-50 dark:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                              )}
                              <span
                                className={`flex-1 ${
                                  isCorrectAnswer
                                    ? "font-bold text-green-900 dark:text-green-200"
                                    : isUserAnswer && !isCorrect
                                    ? "font-bold text-red-900 dark:text-red-200"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {option}
                              </span>
                              {isCorrectAnswer && (
                                <Badge className="bg-green-600 text-white text-xs">Correct</Badge>
                              )}
                              {isUserAnswer && (
                                <Badge variant="outline" className="border text-xs">Your Answer</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {answer.explanation && (
                      <Card className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-bold text-xs mb-1">💡 Why This Answer?</h5>
                            <p className="text-xs leading-relaxed">{answer.explanation}</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {answer.resources && answer.resources.length > 0 && (
                      <Card className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200">
                        <h5 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                          📚 Learn More:
                        </h5>
                        <div className="space-y-1.5">
                          {answer.resources.map((resource, resIdx) => (
                            <a
                              key={resIdx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all border border-purple-200"
                            >
                              {resource.type === "youtube" ? (
                                <Video className="h-4 w-4 text-red-600 flex-shrink-0" />
                              ) : resource.type === "practice" ? (
                                <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                              ) : (
                                <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              )}
                              <span className="flex-1 font-medium text-xs">{resource.title}</span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </StationWrapper>
  );
}

export { ScoreHeader, CertificationProgress, PerformanceAnalytics, QuestionReview, FocusAreas };
