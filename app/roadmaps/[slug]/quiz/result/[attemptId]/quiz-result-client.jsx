"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, MessageSquare } from "lucide-react";
import { QuizResultHeader } from "@/components/quiz/quiz-result-header";
import {
  ScoreHeader,
  CertificationProgress,
  PerformanceAnalytics,
  QuestionReview,
  FocusAreas
} from "@/components/quiz/result-sections";
import {
  RetakeActiveSection,
  RetakeBonusSection,
  LockedStateCard
} from "@/components/quiz/retake-section";
import { SuccessCard } from "@/components/quiz/success-card";
import { PersistentActions } from "@/components/quiz/persistent-actions";

export default function QuizResultClient({
  result,
  roadmap,
  evaluation,
  isMastered,
  totalPasses,
}) {
  const [newBadges, setNewBadges] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [badgeProgress, setBadgeProgress] = useState(null);
  const [weakTopicResources, setWeakTopicResources] = useState({});

  useEffect(() => {
    checkNewBadges();
    fetchBadgeProgress();
    loadWeakTopicResources();
  }, []);

  async function checkNewBadges() {
    try {
      const res = await fetch("/api/quiz/badge-stats", {
        credentials: "include",
      });
      if (res.ok) {
        const stats = await res.json();
        const badgeRes = await fetch("/api/achievements/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ stats }),
        });
        if (badgeRes.ok) {
          const data = await badgeRes.json();
          setNewBadges(data.newBadges || []);
        }
      }
    } catch (error) {
      console.error("Failed to check badges:", error);
    }
  }

  async function fetchBadgeProgress() {
    try {
      const res = await fetch("/api/quiz/badge-stats", {
        credentials: "include",
      });
      if (res.ok) {
        const stats = await res.json();
        setBadgeProgress(stats);
      }
    } catch (error) {
      console.error("Failed to fetch badge progress:", error);
    }
  }

  async function loadWeakTopicResources() {
    const resources = {};
    const answers = result.answers || [];

    answers.forEach((answer) => {
      if (!answer.isCorrect && answer.topic && answer.resources) {
        if (!resources[answer.topic]) {
          resources[answer.topic] = [];
        }
        answer.resources.forEach((res) => {
          if (!resources[answer.topic].some((r) => r.url === res.url)) {
            resources[answer.topic].push(res);
          }
        });
      }
    });

    setWeakTopicResources(resources);
  }

  const percentage = result.percentage || 0;
  const passed = result.passed || false;
  const score = result.score || 0;
  const totalQuestions = result.totalQuestions || 10;
  const timeTaken = result.timeTaken || 0;
  const answers = result.answers || [];

  // Analytics calculation
  const analytics = {
    byDifficulty: {},
    byTopic: {},
  };

  answers.forEach((answer) => {
    const diff = answer.difficulty || "medium";
    const topic = answer.topic || "General";

    if (!analytics.byDifficulty[diff]) {
      analytics.byDifficulty[diff] = { correct: 0, total: 0 };
    }
    analytics.byDifficulty[diff].total++;
    if (answer.isCorrect) analytics.byDifficulty[diff].correct++;

    if (!analytics.byTopic[topic]) {
      analytics.byTopic[topic] = { correct: 0, total: 0, incorrect: [] };
    }
    analytics.byTopic[topic].total++;
    if (answer.isCorrect) {
      analytics.byTopic[topic].correct++;
    } else {
      analytics.byTopic[topic].incorrect.push(answer);
    }
  });

  Object.keys(analytics.byDifficulty).forEach((key) => {
    const data = analytics.byDifficulty[key];
    data.percentage =
      data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  });

  Object.keys(analytics.byTopic).forEach((key) => {
    const data = analytics.byTopic[key];
    data.percentage =
      data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  });

  const filteredAnswers = answers.filter((answer) => {
    if (filterType === "correct") return answer.isCorrect;
    if (filterType === "incorrect") return !answer.isCorrect;
    return true;
  });

  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const passedCount = badgeProgress?.quizPasses || 0;
  const attemptsUnlocked = evaluation?.attemptsUnlocked || 5;
  const attemptsRemaining = attemptsUnlocked - result.attemptNumber;
  const attemptsExhausted = attemptsRemaining <= 0;
  const hasBonus = evaluation?.unlockCount > 0;
  const showIntelligentSystem = result.attemptNumber >= 3;

  // Determine UI state
  let uiState = "active"; // active, bonus, locked
  if (isMastered) {
    uiState = "mastered";
  } else if (attemptsExhausted && passedCount < 3) {
    uiState = "locked";
  } else if (hasBonus && !attemptsExhausted) {
    uiState = "bonus";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <QuizResultHeader
        roadmap={roadmap}
        attemptNumber={result.attemptNumber}
        attemptsUnlocked={attemptsUnlocked}
        passedCount={passedCount}
        canRetake={!attemptsExhausted && !isMastered}
        isMastered={isMastered}
        attemptsRemaining={attemptsRemaining}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ScoreHeader
          passed={passed}
          score={score}
          totalQuestions={totalQuestions}
          percentage={percentage}
          timeTaken={timeTaken}
          attemptNumber={result.attemptNumber}
          evaluation={evaluation}
          newBadges={newBadges}
        />

        {!isMastered && (
          <CertificationProgress
            passedCount={passedCount}
            badgeProgress={badgeProgress}
            isMastered={isMastered}
            canRetake={!attemptsExhausted && !isMastered}
            roadmapSlug={roadmap.slug}
            attemptsRemaining={attemptsRemaining}
          />
        )}

        <PerformanceAnalytics analytics={analytics} />

        <QuestionReview
          answers={answers}
          filterType={filterType}
          setFilterType={setFilterType}
          filteredAnswers={filteredAnswers}
          expandedQuestions={expandedQuestions}
          toggleQuestion={toggleQuestion}
        />

        {Object.values(analytics.byTopic).some((t) => t.incorrect.length > 0) && (
          <FocusAreas
            analytics={analytics}
            weakTopicResources={weakTopicResources}
            passed={passed}
          />
        )}

        {/* State-based Retake Sections */}
        {uiState === "active" && (
          <RetakeActiveSection
            passedCount={passedCount}
            result={result}
            evaluation={evaluation}
            percentage={percentage}
            analytics={analytics}
            roadmap={roadmap}
            attemptsRemaining={attemptsRemaining}
            showIntelligentSystem={showIntelligentSystem}
          />
        )}

        {uiState === "bonus" && (
          <RetakeBonusSection
            passedCount={passedCount}
            result={result}
            evaluation={evaluation}
            percentage={percentage}
            analytics={analytics}
            roadmap={roadmap}
            attemptsRemaining={attemptsRemaining}
          />
        )}

        {uiState === "locked" && (
          <LockedStateCard
            result={result}
            percentage={percentage}
            roadmap={roadmap}
            evaluation={evaluation}
            analytics={analytics}
            passedCount={passedCount}
          />
        )}

        {uiState === "mastered" && (
          <SuccessCard
            roadmap={roadmap}
            passedCount={passedCount}
            attemptNumber={result.attemptNumber}
            percentage={percentage}
          />
        )}

        {/* Persistent Action Bar */}
        <PersistentActions
          uiState={uiState}
          roadmap={roadmap}
          canRetake={!attemptsExhausted && !isMastered}
        />
      </div>
    </div>
  );
}
