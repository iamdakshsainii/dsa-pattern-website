"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Zap, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function CardTestClient({
  masterId,
  cardSlug,
  roadmapTitle,
  roadmapIcon,
  yearNumber,
  questions,
  cooldownRemaining,
  lastAttempt
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (showResults || cooldownRemaining > 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, cooldownRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersArray = questions.map(q => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || ""
    }));

    try {
      const res = await fetch('/api/roadmaps/masters/card-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId,
          cardSlug,
          yearNumber,
          answers: answersArray
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert(error.message || 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cooldownRemaining > 0) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => router.push(`/roadmaps/masters/${masterId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journey
        </Button>

        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Cooldown Active</h2>
            <p className="text-muted-foreground mb-4">
              You can retake this test in {cooldownRemaining} minutes
            </p>
            {lastAttempt && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Last Attempt:</p>
                <div className="flex items-center justify-center gap-4">
                  <Badge variant={lastAttempt.passed ? "default" : "destructive"}>
                    {lastAttempt.percentage}% ({lastAttempt.score}/10)
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(lastAttempt.completedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="text-center">
              {results.passed ? (
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              )}
              <CardTitle className="text-3xl mb-2">
                {results.passed ? '🎉 Test Passed!' : 'Test Not Passed'}
              </CardTitle>
              <p className="text-muted-foreground">
                {roadmapIcon} {roadmapTitle}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Score</p>
                <p className="text-2xl font-bold">{results.score}/10</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                <p className="text-2xl font-bold">{results.percentage}%</p>
              </div>
            </div>

            {results.passed && results.progressImpact && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Progress Impact
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card Progress:</span>
                    <span className="font-medium">
                      {results.progressImpact.cardBefore}% → {results.progressImpact.cardAfter}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year {yearNumber} Progress:</span>
                    <span className="font-medium">
                      {results.progressImpact.yearBefore}% → {results.progressImpact.yearAfter}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!results.passed && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-600" />
                  <div>
                    <p className="font-medium mb-1">Keep Learning!</p>
                    <p className="text-sm text-muted-foreground">
                      You need 80% to unlock this roadmap. Review the topics and try again in 1 hour.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/roadmaps/masters/${masterId}`)}
                className="flex-1"
              >
                Back to Journey
              </Button>
              {results.passed && (
                <Button
                  onClick={() => router.push(`/roadmaps/${cardSlug}`)}
                  variant="outline"
                  className="flex-1"
                >
                  View Roadmap
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (currentQuestion / questions.length) * 100;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => router.push(`/roadmaps/masters/${masterId}`)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Journey
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Test Out: {roadmapIcon} {roadmapTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Pass with 80% to unlock this roadmap instantly
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {answeredCount}/{questions.length} answered
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Badge variant="outline">
                {questions[currentQuestion]?.difficulty || 'medium'}
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">
              {questions[currentQuestion]?.question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion]?.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[questions[currentQuestion].id] === option
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[questions[currentQuestion].id] === option
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {answers[questions[currentQuestion].id] === option && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < questions.length}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : `Submit Test (${answeredCount}/${questions.length})`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
