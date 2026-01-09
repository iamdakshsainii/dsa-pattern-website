import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Zap,
  Brain,
  ArrowRight,
  Sparkles,
  Lock,
  Activity,
  Lightbulb,
  BarChart3,
} from "lucide-react";

// STATE 1: Active Learning (Attempts Remaining, No Bonus)
export function RetakeActiveSection({
  passedCount,
  result,
  evaluation,
  percentage,
  analytics,
  roadmap,
  attemptsRemaining,
  showIntelligentSystem
}) {
  const attemptsUnlocked = evaluation?.attemptsUnlocked || 5;

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Target className="h-6 w-6 text-blue-600" />
        Ready to Improve Your Score?
      </h2>

      {/* Certification Requirements */}
      <Card className="p-4 mb-4 bg-white dark:bg-gray-900 border-2 border-purple-200">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          🎯 Certification Requirements
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Complete all roadmap content (90%+)</span>
          </div>
          <div className="flex items-center gap-2">
            {passedCount >= 3 ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              </div>
            )}
            <span className="font-semibold">
              Pass quiz 3 times with 70%+
              <span className="ml-1 text-orange-600">(Currently: {passedCount}/3)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>
              {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
              {showIntelligentSystem && " + intelligent bonus system"}
            </span>
          </div>
        </div>
      </Card>

      {/* Attempt Tracker */}
      <Card className="p-4 mb-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Attempt Tracker
          </h3>
          <Badge
            variant="outline"
            className={`text-base px-3 py-1 border-2 ${
              attemptsRemaining <= 1
                ? 'border-orange-500 bg-orange-100 text-orange-800'
                : 'border-blue-500 bg-blue-100 text-blue-800'
            }`}
          >
            {result.attemptNumber}/{attemptsUnlocked}
          </Badge>
        </div>

        <Progress
          value={(result.attemptNumber / attemptsUnlocked) * 100}
          className="h-3 mb-3"
        />

        <p className="text-xs text-muted-foreground">
          You've used {result.attemptNumber} out of {attemptsUnlocked} available attempts
          {attemptsRemaining === 1 && " - This is your last base attempt!"}
        </p>
      </Card>

      {/* Intelligent System Info */}
      {showIntelligentSystem && (
        <Card className="p-4 mb-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-300">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            🤖 Intelligent Support System
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Our system monitors your performance and automatically unlocks bonus attempts based on specific conditions:
          </p>
          <div className="grid gap-2">
            <div className="flex items-start gap-3 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                +3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-orange-900 dark:text-orange-200">Struggling Pattern Detected</p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">
                  <strong>Condition:</strong> Failed 3 consecutive attempts in last 5 tries
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  <strong>Result:</strong> System adds 3 bonus attempts to help you succeed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                +2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-200">Improving Pattern Detected</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
                  <strong>Condition:</strong> Mixed results (2-3 passes and 2-3 fails in last 5)
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  <strong>Result:</strong> System adds 2 bonus attempts to solidify knowledge
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-green-900 dark:text-green-200">Mastered Status</p>
                <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                  <strong>Condition:</strong> Passed 3 or more times (70%+ score)
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  <strong>Result:</strong> Certificate unlocked! 🎉
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>How it works:</strong> After every 5 attempts, our AI analyzes your pattern and determines if you qualify for bonus attempts. Keep practicing!
          </div>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            Your Current Status
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attempts Used:</span>
              <span className="font-bold">{result.attemptNumber}/{attemptsUnlocked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Score:</span>
              <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                {percentage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Passes:</span>
              <span className="font-bold text-green-600">{passedCount}/3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining:</span>
              <span className={`font-bold ${attemptsRemaining <= 1 ? 'text-orange-600' : 'text-blue-600'}`}>
                {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Quick Improvement Tips
          </h4>
          <ul className="space-y-2 text-sm">
            {Object.entries(analytics.byTopic)
              .filter(([_, data]) => data.percentage < 70)
              .slice(0, 3)
              .map(([topic], idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span>Focus on {topic}</span>
                </li>
              ))}
            {Object.values(analytics.byTopic).every((d) => d.percentage >= 70) && (
              <li className="text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>All topics look strong! 🎉</span>
              </li>
            )}
          </ul>
        </Card>
      </div>

      {/* Pro Tip */}
      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
        <p className="text-xs text-center">
          💡 <strong>Track Your Progress:</strong> View detailed analytics in your{" "}
          <Link
            href="/profile/activities"
            className="text-blue-600 hover:underline font-semibold"
          >
            Activity Dashboard
          </Link>
        </p>
      </div>
    </Card>
  );
}

// STATE 2: Bonus Unlocked (Attempts Remaining + Bonus Given)
export function RetakeBonusSection({
  passedCount,
  result,
  evaluation,
  percentage,
  analytics,
  roadmap,
  attemptsRemaining
}) {
  const attemptsUnlocked = evaluation?.attemptsUnlocked || 5;
  const baseAttempts = 5;
  const bonusAttempts = attemptsUnlocked - baseAttempts;

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 border-2 border-purple-400">
      {/* Celebration Banner */}
      <div className="text-center mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 via-pink-200/50 to-orange-200/50 blur-3xl -z-10" />
        <div className="inline-block p-4 bg-purple-500/10 backdrop-blur-sm rounded-full mb-3 animate-bounce">
          <Sparkles className="h-12 w-12 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-foreground">
          🎉 Bonus Attempts Unlocked!
        </h2>
        <p className="text-lg text-muted-foreground mb-3">
          Our intelligent system recognized your pattern
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-4 py-2">
            +{bonusAttempts} Extra Attempts Added!
          </Badge>
        </div>
      </div>

      {/* What Happened */}
      <Card className="p-4 mb-4 bg-white dark:bg-gray-900 border-2 border-purple-300">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          🤖 What Just Happened?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
              +{bonusAttempts}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">{evaluation?.message || "System detected your learning pattern"}</p>
              <p className="text-xs text-muted-foreground">
                Based on your last {result.attemptNumber >= 5 ? '5' : result.attemptNumber} attempts, our AI determined you deserve more chances to succeed!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{baseAttempts}</div>
              <div className="text-xs text-muted-foreground">Base Attempts</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-400">
              <div className="text-2xl font-bold text-purple-600">+{bonusAttempts}</div>
              <div className="text-xs text-muted-foreground">Bonus Added</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{attemptsUnlocked}</div>
              <div className="text-xs text-muted-foreground">Total Now</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Updated Attempt Tracker */}
      <Card className="p-4 mb-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Updated Progress
          </h3>
          <Badge variant="outline" className="text-base px-3 py-1 border-2 border-green-500 bg-green-100 text-green-800">
            {result.attemptNumber}/{attemptsUnlocked}
          </Badge>
        </div>

        <Progress
          value={(result.attemptNumber / attemptsUnlocked) * 100}
          className="h-3 mb-3"
        />

        <p className="text-xs text-muted-foreground">
          You've used {result.attemptNumber} attempts. You now have <strong className="text-green-600">{attemptsRemaining} more {attemptsRemaining === 1 ? 'chance' : 'chances'}</strong> to achieve certification!
        </p>
      </Card>

      {/* Recommendation Before Retake */}
      <Card className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          💡 Before Your Next Attempt
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          We've given you more chances, but consider reviewing these areas first to maximize your success:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
            <p className="text-xs font-semibold mb-2">📊 Your Current Stats:</p>
            <ul className="space-y-1 text-xs">
              <li className="flex justify-between">
                <span>Best Score:</span>
                <span className="font-bold text-blue-600">{percentage}%</span>
              </li>
              <li className="flex justify-between">
                <span>Passes:</span>
                <span className="font-bold text-green-600">{passedCount}/3</span>
              </li>
              <li className="flex justify-between">
                <span>Attempts Left:</span>
                <span className="font-bold text-orange-600">{attemptsRemaining}</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
            <p className="text-xs font-semibold mb-2">🎯 Focus Areas:</p>
            <ul className="space-y-1 text-xs">
              {Object.entries(analytics.byTopic)
                .filter(([_, data]) => data.percentage < 70)
                .slice(0, 3)
                .map(([topic, data], idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>{topic} ({data.percentage}%)</span>
                  </li>
                ))}
              {Object.values(analytics.byTopic).every((d) => d.percentage >= 70) && (
                <li className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>All topics strong! 🎉</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 text-center">
        <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
          🚀 You've got this! The system believes in you - now go show what you've learned!
        </p>
      </div>
    </Card>
  );
}

// STATE 3: All Exhausted (No More Attempts)
export function LockedStateCard({ result, percentage, roadmap, evaluation, analytics, passedCount }) {
  const attemptsUnlocked = evaluation?.attemptsUnlocked || 5;
  const baseAttempts = 5;
  const bonusReceived = attemptsUnlocked - baseAttempts;
  const hasReceivedBonus = bonusReceived > 0;

  return (
    <Card className="p-8 mb-6 relative overflow-hidden border-2 border-orange-400">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-pink-900/20 opacity-50" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-orange-500/10 backdrop-blur-sm rounded-full mb-4">
            <Activity className="h-16 w-16 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-orange-800 dark:text-orange-300 mb-2">
            💪 Great Effort on All Attempts!
          </h2>
          <p className="text-base text-muted-foreground mb-2">
            You've completed all {attemptsUnlocked} attempts
          </p>
          <Badge className="text-sm px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300">
            {passedCount}/3 passes achieved • {percentage}% best score
          </Badge>
        </div>

        {/* What Happened - Intelligent System Summary */}
        <Card className="p-4 mb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-purple-300">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            🤖 Intelligent System Summary
          </h3>

          {hasReceivedBonus ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Congratulations! Based on your performance pattern, our system provided additional support:
              </p>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{baseAttempts}</div>
                  <div className="text-xs text-muted-foreground">Base Attempts</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-400">
                  <div className="text-2xl font-bold text-green-600">+{bonusReceived}</div>
                  <div className="text-xs text-muted-foreground">Bonus Given</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{attemptsUnlocked}</div>
                  <div className="text-xs text-muted-foreground">Total Used</div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold mb-2">✨ How We Helped:</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {evaluation?.message || `Our AI detected your learning pattern and unlocked ${bonusReceived} bonus attempts.`}
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Criteria met:</strong> {bonusReceived === 3 ? 'Struggling pattern (3 consecutive fails)' : bonusReceived === 2 ? 'Improving pattern (2-3 mixed results)' : 'Performance-based bonus'}
                </div>
              </div>

              <p className="text-sm text-center font-semibold text-orange-700 dark:text-orange-300">
                You've used all available attempts. Time to review and come back stronger! 💪
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You completed all {baseAttempts} base attempts. Our intelligent system analyzes patterns after every 5 attempts.
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-semibold mb-2">📊 System Analysis:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Attempts completed: {result.attemptNumber}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>Successful passes: {passedCount}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span>Best score achieved: {percentage}%</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold mb-2">📋 Bonus Unlock Criteria:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">+3:</span>
                    <span>Struggling pattern (3 consecutive fails in last 5 attempts)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-yellow-600">+2:</span>
                    <span>Improving pattern (2-3 passes and 2-3 fails in last 5)</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-center font-semibold text-orange-700 dark:text-orange-300">
                We recommend thorough review before additional opportunities become available.
              </p>
            </div>
          )}
        </Card>

        {/* What's Next - Action Cards */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4 text-center">🎯 What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-105 transition-transform border-2 hover:border-blue-400">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-center">Review Weak Areas</h4>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                {Object.values(analytics.byTopic).filter(d => d.percentage < 70).length} topics need attention
              </p>
              <Link href={`/roadmaps/${roadmap.slug}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Go to Roadmap
                </Button>
              </Link>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-400 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-center">Get Expert Help</h4>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Talk to mentors who've mastered this
              </p>
              <Link href="/mentorship-request" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" size="sm">
                  Request Session
                </Button>
              </Link>
            </Card>

            <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-105 transition-transform border-2 hover:border-green-400">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-center">Track Progress</h4>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                View detailed analytics
              </p>
              <Link href="/profile/activities" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Activity Dashboard
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Motivational Footer */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-300">
          <p className="text-sm text-center">
            💡 <strong>Remember:</strong> Our mentors have been exactly where you are. They struggled, learned, and succeeded.
            Get personalized guidance to break through your challenges and achieve certification!
          </p>
        </Card>
      </div>
    </Card>
  );
}
