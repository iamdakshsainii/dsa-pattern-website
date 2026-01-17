"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/contexts/ThemeProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Target, Clock, Award, Lightbulb,
  ChevronDown, ChevronUp, Download, CheckCircle2, ArrowRight,
  Users, Zap, Calendar, BarChart3, Brain, Rocket, Moon, Sun
} from "lucide-react";

export default function SyllabusClient({ patterns, stats, isLoggedIn }) {
  const { theme, toggleTheme } = useTheme();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!stats || !stats.patternsByPart) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Syllabus...</h2>
          <p className="text-muted-foreground">Please wait while we load the content.</p>
        </div>
      </div>
    );
  }

  const handleDownloadTracker = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch('/api/download-tracker');

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DSA-Tracker-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download tracker. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    philosophy: false,
    studyPlan: false,
    patterns: false,
    company: false,
    tips: false,
    resources: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const companies = stats.companyFocus || [];

  const weeklySchedule = patterns && stats.patternsByPart ? [
    {
      weeks: "1-2",
      focus: stats.patternsByPart[0]?.part || "Array Fundamentals",
      patterns: "1-5",
      problems: stats.patternsByPart[0]?.problemCount || 0,
      topics: patterns.filter(p => p.order >= 1 && p.order <= 5).map(p => p.name).join(", ")
    },
    {
      weeks: "3-4",
      focus: stats.patternsByPart[1]?.part || "Search & Sort",
      patterns: "6-9",
      problems: stats.patternsByPart[1]?.problemCount || 0,
      topics: patterns.filter(p => p.order >= 6 && p.order <= 9).map(p => p.name).join(", ")
    },
    {
      weeks: "5-6",
      focus: stats.patternsByPart[2]?.part || "Data Structures",
      patterns: "10-12",
      problems: stats.patternsByPart[2]?.problemCount || 0,
      topics: patterns.filter(p => p.order >= 10 && p.order <= 12).map(p => p.name).join(", ")
    },
    {
      weeks: "7-8",
      focus: stats.patternsByPart[3]?.part || "Recursion & Advanced",
      patterns: "13-16",
      problems: stats.patternsByPart[3]?.problemCount || 0,
      topics: patterns.filter(p => p.order >= 13 && p.order <= 16).map(p => p.name).join(", ")
    },
    {
      weeks: "9-10",
      focus: "Optimization & Trees",
      patterns: "17-21",
      problems: (stats.patternsByPart[4]?.problemCount || 0) + (stats.patternsByPart[5]?.problemCount || 0),
      topics: patterns.filter(p => p.order >= 17 && p.order <= 21).map(p => p.name).join(", ")
    },
    {
      weeks: "11-14",
      focus: stats.patternsByPart[6]?.part || "Dynamic Programming",
      patterns: "22-27",
      problems: stats.patternsByPart[6]?.problemCount || 0,
      topics: patterns.filter(p => p.order >= 22 && p.order <= 27).map(p => p.name).join(", ")
    },
    {
      weeks: "15-18",
      focus: stats.patternsByPart[7]?.part || "Graphs & Final Prep",
      patterns: "28-30",
      problems: stats.patternsByPart[7]?.problemCount || 0,
      topics: patterns.filter(p => p.order >= 28 && p.order <= 30).map(p => p.name).join(", ")
    },
  ] : [];

  const tips = [
    { title: "Pattern Recognition First", desc: "Spend 2-3 minutes identifying the pattern before coding", icon: Brain },
    { title: "Time Yourself", desc: "Easy: 15-20min | Medium: 25-35min | Hard: 40-50min", icon: Clock },
    { title: "Quality Over Quantity", desc: "Deeply understand 300 problems > superficially solve 500", icon: Target },
    { title: "Mock Interviews", desc: "Start after Month 3, do 2-3 per week minimum", icon: Users },
    { title: "Spaced Repetition", desc: "Revisit problems on Day 3, Day 7, and Day 30", icon: Calendar },
    { title: "Handle Nervousness", desc: "Talk through approach, start with brute force, ask clarifying questions", icon: Lightbulb },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Foundation: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Core: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Essential: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  const SectionHeader = ({ section, icon: Icon, title, iconColor }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-6 rounded-lg shadow-md transition-all duration-300 bg-white dark:bg-slate-900 hover:shadow-xl border border-gray-200 dark:border-gray-800 hover:scale-[1.02] group"
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${iconColor} transition-transform duration-300 group-hover:scale-110`} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className={`transition-transform duration-300 ${expandedSections[section] ? 'rotate-180' : ''}`}>
        <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 animate-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-float">
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">Complete Interview Preparation Guide</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master DSA in 6 Months
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {stats.totalProblems} Curated Problems • {stats.totalPatterns} Core Patterns • FAANG Ready
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { label: 'Patterns', value: stats.totalPatterns },
                { label: 'Problems', value: stats.totalProblems },
                { label: 'Months', value: 6 },
                ...(isLoggedIn ? [{ label: 'Complete', value: `${stats.completedPercentage}%` }] : [])
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="px-6 py-3 rounded-lg bg-white/20 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <section className="mb-8">
          <SectionHeader
            section="overview"
            icon={BarChart3}
            title="Pattern Overview"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          {expandedSections.overview && (
            <Card className="mt-4 p-6 animate-slide-down">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Part</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Patterns</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Problems</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.patternsByPart.map((item, idx) => (
                      <tr key={idx} className="border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200">
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{item.part}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{item.patternCount}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{item.problemCount}</td>
                        <td className="py-4 px-4">
                          <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            section="philosophy"
            icon={Target}
            title="Learning Philosophy"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          {expandedSections.philosophy && (
            <Card className="mt-4 p-6 animate-slide-down">
              <div className="space-y-4">
                {[
                  { icon: "📚", title: "Follow Sequence", desc: "Each pattern builds on previous concepts" },
                  { icon: "✅", title: "Complete All Problems", desc: "Finish entire pattern before moving forward" },
                  { icon: "🧠", title: "Understand Why", desc: "Don't just memorize solutions" },
                  { icon: "📊", title: "Track Progress", desc: "Use checkboxes to monitor completion" },
                  { icon: "🔄", title: "Review Weekly", desc: "Revisit completed patterns regularly" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div className="text-3xl animate-float" style={{ animationDelay: `${idx * 200}ms` }}>{item.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            section="studyPlan"
            icon={Calendar}
            title="6-Month Study Plan"
            iconColor="text-green-600 dark:text-green-400"
          />

          {expandedSections.studyPlan && (
            <Card className="mt-4 p-6 space-y-4 animate-slide-down">
              {weeklySchedule.map((week, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-l-4 border-blue-600 bg-gray-50 dark:bg-slate-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Week {week.weeks}
                      </Badge>
                      <h3 className="font-bold text-gray-900 dark:text-white">{week.focus}</h3>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{week.problems} problems</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Patterns {week.patterns}: {week.topics}
                  </p>
                </div>
              ))}
            </Card>
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            section="patterns"
            icon={Brain}
            title="Pattern Recognition Guide"
            iconColor="text-orange-600 dark:text-orange-400"
          />

          {expandedSections.patterns && (
            <Card className="mt-4 p-6 animate-slide-down">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { condition: "Sorted + pair/triplet", pattern: "Two Pointers" },
                  { condition: "Contiguous subarray", pattern: "Sliding Window" },
                  { condition: "Range [1,n] missing/duplicate", pattern: "Cyclic Sort" },
                  { condition: "Cycle detection", pattern: "Fast & Slow Pointers" },
                  { condition: "Next greater/smaller", pattern: "Monotonic Stack" },
                  { condition: "Top K elements", pattern: "Heaps" },
                  { condition: '"Minimize maximum"', pattern: "Binary Search on Answer" },
                  { condition: "All subsets/permutations", pattern: "Recursion/Backtracking" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border bg-gray-50 dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 mt-0.5 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">{item.condition}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">→ {item.pattern}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            section="company"
            icon={Award}
            title="Company-Specific Focus"
            iconColor="text-yellow-600 dark:text-yellow-400"
          />

          {expandedSections.company && (
            <Card className="mt-4 p-6 animate-slide-down">
              {companies.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {companies.map((company, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-lg bg-gradient-to-br ${company.color} text-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
                    >
                      <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                      <p className="text-sm opacity-90">{company.focus}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No company data available</p>
              )}
            </Card>
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            section="tips"
            icon={Zap}
            title="Pro Tips for Success"
            iconColor="text-yellow-600 dark:text-yellow-400"
          />

          {expandedSections.tips && (
            <Card className="mt-4 p-6 animate-slide-down">
              <div className="grid md:grid-cols-2 gap-4">
                {tips.map((tip, idx) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border bg-gray-50 dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">{tip.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tip.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            section="resources"
            icon={BookOpen}
            title="Additional Resources"
            iconColor="text-indigo-600 dark:text-indigo-400"
          />

          {expandedSections.resources && (
            <Card className="mt-4 p-6 space-y-6 animate-slide-down">
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">📺 Video Tutorials</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Striver (TakeUForward) - Visual learning, A2Z coverage</li>
                  <li>• NeetCode - Pattern-based explanations</li>
                  <li>• Abdul Bari - Algorithm concepts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">💻 Practice Platforms</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• LeetCode - Primary platform, company tags</li>
                  <li>• GeeksforGeeks - Indian interviews</li>
                  <li>• HackerRank - Interview preparation kits</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">📚 Books</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• "Cracking the Coding Interview" - Gayle Laakmann McDowell</li>
                  <li>• "Elements of Programming Interviews" - Aziz, Lee, Prakash</li>
                  <li>• "Algorithm Design Manual" - Steven Skiena</li>
                </ul>
              </div>
            </Card>
          )}
        </section>

        <Card className="p-8 text-center bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white border-0 animate-gradient">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6 opacity-90">
            In 6 months, you'll be interview-ready for any top tech company.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/patterns">
              <Button className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-110">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            </Link>
            <Button
              onClick={handleDownloadTracker}
              disabled={isDownloading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-semibold transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className={`w-5 h-5 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? 'Generating...' : 'Download Tracker'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        <p className="text-lg italic">"Pattern recognition beats memorization every single time."</p>
        <p className="text-sm mt-2">- Last Updated: January 2026</p>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
