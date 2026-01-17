import { getCurrentUser } from "@/lib/auth";
import { getPatterns, connectToDatabase } from "@/lib/db";
import SyllabusClient from "./syllabus-client";

export const metadata = {
  title: "DSA Syllabus & Study Guide | Master 300 Problems in 6 Months",
  description: "Complete study guide with 30 patterns, 6-month plan, company-specific prep, and expert tips for FAANG interviews.",
};

export default async function SyllabusPage() {
  try {
    const user = await getCurrentUser();
    const patterns = await getPatterns();
    const { db } = await connectToDatabase();

    const totalQuestions = await db.collection("questions").countDocuments();

    let userProgress = null;
    let completedCount = 0;

    if (user) {
      const progress = await db
        .collection("user_progress")
        .find({ user_id: user.id })
        .toArray();

      completedCount = progress.filter(p => p.status === "completed").length;

      userProgress = {
        completed: progress
          .filter(p => p.status === "completed")
          .map(p => p.question_id),
        inProgress: progress
          .filter(p => p.status === "in_progress")
          .map(p => p.question_id),
      };
    }

    const patternsByPart = [
      {
        part: "Array Fundamentals",
        patterns: patterns.filter(p => p.order >= 1 && p.order <= 5),
        range: [1, 5],
        difficulty: "Foundation"
      },
      {
        part: "Search & Sort",
        patterns: patterns.filter(p => p.order >= 6 && p.order <= 9),
        range: [6, 9],
        difficulty: "Core"
      },
      {
        part: "Data Structures",
        patterns: patterns.filter(p => p.order >= 10 && p.order <= 12),
        range: [10, 12],
        difficulty: "Essential"
      },
      {
        part: "Recursion & Advanced",
        patterns: patterns.filter(p => p.order >= 13 && p.order <= 16),
        range: [13, 16],
        difficulty: "Intermediate"
      },
      {
        part: "Optimization",
        patterns: patterns.filter(p => p.order >= 17 && p.order <= 18),
        range: [17, 18],
        difficulty: "Advanced"
      },
      {
        part: "Trees",
        patterns: patterns.filter(p => p.order >= 19 && p.order <= 21),
        range: [19, 21],
        difficulty: "Core"
      },
      {
        part: "Dynamic Programming",
        patterns: patterns.filter(p => p.order >= 22 && p.order <= 27),
        range: [22, 27],
        difficulty: "Advanced"
      },
      {
        part: "Graphs",
        patterns: patterns.filter(p => p.order >= 28 && p.order <= 30),
        range: [28, 30],
        difficulty: "Advanced"
      },
    ];

    const enrichedParts = await Promise.all(
      patternsByPart.map(async (part) => {
        const partPatternSlugs = part.patterns.map(p => p.slug);

        const problemCount = await db
          .collection("questions")
          .countDocuments({
            pattern_id: { $in: partPatternSlugs }
          });

        return {
          ...part,
          patternCount: part.patterns.length,
          problemCount,
        };
      })
    );

    // Calculate company frequency from questions
    const allQuestions = await db.collection("questions").find({}).toArray();

    const companyStats = {};
    allQuestions.forEach(q => {
      if (q.companies && Array.isArray(q.companies)) {
        q.companies.forEach(company => {
          if (!companyStats[company]) {
            companyStats[company] = {
              total: 0,
              byPattern: {}
            };
          }
          companyStats[company].total++;

          if (!companyStats[company].byPattern[q.pattern_id]) {
            companyStats[company].byPattern[q.pattern_id] = 0;
          }
          companyStats[company].byPattern[q.pattern_id]++;
        });
      }
    });

    const topCompanies = Object.entries(companyStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 6);

    const companyFocus = topCompanies.map(([company, data]) => {
      const sortedPatterns = Object.entries(data.byPattern)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const focus = sortedPatterns.map(([patternId, count]) => {
        const pattern = patterns.find(p => p.slug === patternId);
        const percentage = Math.round((count / data.total) * 100);
        return `${pattern?.name || patternId} (${percentage}%)`;
      }).join(", ");

      const gradients = [
        "from-blue-500 to-green-500",
        "from-blue-600 to-indigo-600",
        "from-orange-500 to-yellow-500",
        "from-cyan-500 to-blue-500",
        "from-gray-600 to-gray-800",
        "from-red-600 to-pink-600"
      ];

      return {
        name: company,
        focus,
        color: gradients[topCompanies.indexOf([company, data]) % gradients.length]
      };
    });

    const stats = {
      patternsByPart: enrichedParts,
      totalPatterns: patterns.length,
      totalProblems: totalQuestions,
      completedProblems: completedCount,
      completedPercentage: totalQuestions > 0
        ? Math.round((completedCount / totalQuestions) * 100)
        : 0,
      companyFocus: companyFocus.length > 0 ? companyFocus : [
        { name: "Google", focus: "Graphs (25%), DP (20%), Trees (15%)", color: "from-blue-500 to-green-500" },
        { name: "Meta", focus: "Arrays (25%), Graphs (20%), DP (20%)", color: "from-blue-600 to-indigo-600" },
        { name: "Amazon", focus: "Arrays (25%), Trees (20%), DP (15%)", color: "from-orange-500 to-yellow-500" },
        { name: "Microsoft", focus: "Arrays (20%), DP (20%), Trees (15%)", color: "from-cyan-500 to-blue-500" },
        { name: "Apple", focus: "Arrays (25%), Trees (20%), DP (15%)", color: "from-gray-600 to-gray-800" },
        { name: "Netflix", focus: "DP (25%), Arrays (20%), Graphs (10%)", color: "from-red-600 to-pink-600" }
      ]
    };

    return (
      <SyllabusClient
        patterns={patterns}
        stats={stats}
        isLoggedIn={!!user}
      />
    );
  } catch (error) {
    console.error("Error loading syllabus page:", error);

    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Syllabus</h1>
        <p className="text-muted-foreground">
          There was an error loading the syllabus page. Please try again later.
        </p>
        <pre className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg text-left text-sm">
          {error.message}
        </pre>
      </div>
    );
  }
}
