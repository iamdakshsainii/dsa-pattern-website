'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, StopCircle, Eye, EyeOff, Award, RefreshCw, ExternalLink } from 'lucide-react';
import MockInterviewTimer from './mock-interview-timer';
import Link from 'next/link';

const INTERVIEW_DURATION = 45 * 60;

export default function MockInterviewSimulator() {
  const [state, setState] = useState('idle');
  const [question, setQuestion] = useState(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview-prep/mock-question', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setQuestion(data.question);
        setState('active');
        setHintsRevealed(0);
        setAssessment(null);
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = () => {
    setState('assessment');
  };

  const submitAssessment = (result) => {
    setAssessment(result);
    setState('complete');
  };

  const reset = () => {
    setState('idle');
    setQuestion(null);
    setHintsRevealed(0);
    setAssessment(null);
  };

  if (state === 'idle') {
    return (
      <Card className="p-8 shadow-lg border-2 border-purple-200 dark:border-purple-800">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
            <PlayCircle className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Mock Interview Simulator
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Practice under real interview conditions with a 45-minute timer
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                ⏱️ 45 Minutes
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Real interview timing
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">
                💡 Progressive Hints
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Get help if stuck
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-700 dark:text-green-400 mb-1">
                📝 Self Assessment
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress
              </p>
            </div>
          </div>

          <Button
            onClick={startInterview}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-lg px-8 py-6"
          >
            {loading ? 'Loading...' : (
              <>
                <PlayCircle className="h-5 w-5 mr-2" />
                Start Mock Interview
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (state === 'active' && question) {
    return (
      <Card className="p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <PlayCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Mock Interview in Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Think out loud and explain your approach
              </p>
            </div>
          </div>
          <MockInterviewTimer totalSeconds={INTERVIEW_DURATION} onComplete={endInterview} />
        </div>

        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {question.title}
              </h4>
              <div className="flex items-center gap-2">
                <Badge className={
                  question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }>
                  {question.difficulty}
                </Badge>
                {question.pattern && (
                  <Badge variant="outline">
                    {question.pattern}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {question.description}
            </p>

            {question.examples && question.examples.length > 0 && (
              <div className="mt-4 space-y-3">
                {question.examples.map((example, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white dark:bg-gray-800 border">
                    <p className="font-semibold text-sm mb-1">Example {idx + 1}:</p>
                    <pre className="text-sm">{example}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {question.hints && question.hints.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              💡 Hints Available: {hintsRevealed}/{question.hints.length}
            </p>
            <div className="space-y-2">
              {question.hints.slice(0, hintsRevealed).map((hint, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    Hint {idx + 1}: {hint}
                  </p>
                </div>
              ))}

              {hintsRevealed < question.hints.length && (
                <Button
                  onClick={() => setHintsRevealed(prev => prev + 1)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Reveal Next Hint ({hintsRevealed + 1}/{question.hints.length})
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            <strong>💡 Interview Tip:</strong> Before coding, always clarify: edge cases, input constraints, and expected output format. Then explain your high-level approach!
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={endInterview}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            End Interview
          </Button>
          {question.leetcodeLink && (
            <Link href={question.leetcodeLink} target="_blank">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                LeetCode
              </Button>
            </Link>
          )}
        </div>
      </Card>
    );
  }

  if (state === 'assessment') {
    return (
      <Card className="p-8 shadow-lg border-2 border-green-200 dark:border-green-800">
        <div className="text-center mb-6">
          <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <Award className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Interview Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            How did you perform?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { key: 'solved', label: '✅ Solved Completely', desc: 'Got the optimal solution' },
            { key: 'with-hints', label: '💡 Solved with Hints', desc: 'Needed some guidance' },
            { key: 'partial', label: '⚠️ Partially Solved', desc: 'Got close but incomplete' },
            { key: 'couldnt', label: '❌ Couldn\'t Solve', desc: 'Need more practice' }
          ].map(option => (
            <Button
              key={option.key}
              onClick={() => submitAssessment(option.key)}
              variant="outline"
              className="w-full h-auto py-4 hover:bg-purple-50 dark:hover:bg-purple-950/20"
            >
              <div className="text-left w-full">
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  if (state === 'complete') {
    return (
      <Card className="p-8 shadow-lg border-2 border-purple-200 dark:border-purple-800">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
            <Award className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Great Work!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You marked this as: <strong>{
              assessment === 'solved' ? 'Solved Completely ✅' :
              assessment === 'with-hints' ? 'Solved with Hints 💡' :
              assessment === 'partial' ? 'Partially Solved ⚠️' :
              'Couldn\'t Solve ❌'
            }</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Hints used: {hintsRevealed}/{question?.hints?.length || 0}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={startInterview}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Another Question
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="flex-1"
            >
              Back to Start
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
