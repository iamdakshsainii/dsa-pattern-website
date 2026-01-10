'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronDown, ChevronUp, Brain, Clock, XCircle, Heart } from 'lucide-react';
import { EMERGENCY_PREP_DATA } from '@/data/emergency-prep-data';

export default function EmergencyPrepSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-2 border-red-300 dark:border-red-800 shadow-lg">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="w-full p-6 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
          <div className="text-left">
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
              🚨 Emergency "Night Before Interview" Cheat Sheet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quick reference for last-minute prep
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Top 10 DSA Patterns
                </h4>
              </div>
              <div className="space-y-2">
                {EMERGENCY_PREP_DATA.patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {pattern.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {pattern.complexity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      When: {pattern.when}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                      💡 {pattern.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Complexity Cheat Sheet
                  </h4>
                </div>
                <div className="space-y-2">
                  {EMERGENCY_PREP_DATA.complexity.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-bold text-green-700 dark:text-green-400">
                          {item.notation}
                        </code>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {item.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Confidence Boosters
                  </h4>
                </div>
                <div className="space-y-2">
                  {EMERGENCY_PREP_DATA.confidenceTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Common Mistakes to Avoid
                </h4>
              </div>
              <div className="space-y-2">
                {EMERGENCY_PREP_DATA.mistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                  >
                    <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                      ❌ {item.mistake}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ✅ {item.fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Last Minute Checklist
                </h4>
              </div>
              <div className="space-y-2">
                {EMERGENCY_PREP_DATA.lastMinute.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              🌙 Most Important Tip
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Get a good night's sleep! A well-rested mind performs 10x better than cramming all night.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
