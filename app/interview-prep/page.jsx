'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ClipboardCheck, BookOpen, Target } from 'lucide-react';
import InterviewChecklist from '@/components/interview-prep/interview-checklist';
import InterviewCountdown from '@/components/interview-prep/interview-countdown';
import MockInterviewSimulator from '@/components/interview-prep/mock-interview-simulator';
import CompanyPrepCards from '@/components/interview-prep/company-prep-cards';
import EmergencyPrepSection from '@/components/interview-prep/emergency-prep-section';

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Interview Preparation</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">🎯 Get Interview Ready</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Complete preparation system: track your checklist, practice with mock interviews, study company-specific patterns, and access emergency resources.
          </p>
        </div>

        <InterviewCountdown />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InterviewChecklist />
            <MockInterviewSimulator />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li>• Practice coding out loud</li>
                <li>• Ask clarifying questions</li>
                <li>• Discuss complexity</li>
                <li>• Prepare interviewer questions</li>
                <li>• Test edge cases</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Essential Resources</h3>
              </div>

              <div className="space-y-3">
                <a
                  href="https://www.youtube.com/@NeetCode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-blue-50 dark:bg-blue-950"
                >
                  NeetCode - Blind 75
                </a>

                <a
                  href="https://www.youtube.com/@gkcs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-purple-50 dark:bg-purple-950"
                >
                  Gaurav Sen - System Design
                </a>

                <a
                  href="https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-green-50 dark:bg-green-950"
                >
                  Cracking the Coding Interview
                </a>

                <a
                  href="https://github.com/donnemartin/system-design-primer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-orange-50 dark:bg-orange-950"
                >
                  System Design Primer
                </a>

                <Link
                  href="/patterns"
                  className="block p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950"
                >
                  DSA Patterns (Internal)
                </Link>

                <a
                  href="https://www.pramp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-pink-50 dark:bg-pink-950"
                >
                  Pramp
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <Link href="/community">
                <Button className="w-full">Join Codex Community</Button>
              </Link>
            </Card>
          </div>
        </div>

        <CompanyPrepCards />
        <EmergencyPrepSection />
      </div>
    </div>
  );
}
