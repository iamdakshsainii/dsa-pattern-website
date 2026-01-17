// ========================================
// FILE: app/api/download-tracker/route.js
// Dynamic Excel Tracker Generator
// ========================================

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import ExcelJS from "exceljs";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    const { db } = await connectToDatabase();

    // Fetch all patterns (sorted by order)
    const patterns = await db
      .collection("patterns")
      .find({})
      .sort({ order: 1 })
      .toArray();

    // Fetch all questions
    const questions = await db
      .collection("questions")
      .find({})
      .sort({ pattern_id: 1, order: 1 })
      .toArray();

    // Get user progress if logged in
    let userProgress = null;
    if (user) {
      const progress = await db
        .collection("user_progress")
        .find({ user_id: user.id })
        .toArray();

      userProgress = {
        completed: progress
          .filter((p) => p.status === "completed")
          .map((p) => p.question_id),
        inProgress: progress
          .filter((p) => p.status === "in_progress")
          .map((p) => p.question_id),
      };
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "DSA Patterns Platform";
    workbook.created = new Date();

    // ============================================
    // SHEET 1: 12-Week Study Plan
    // ============================================
    const planSheet = workbook.addWorksheet("12-Week Study Plan", {
      properties: { tabColor: { argb: "FF4F46E5" } },
    });

    // Define week groups
    const weekGroups = [
      { weeks: "1-2", range: [1, 5], focus: "Array Fundamentals" },
      { weeks: "3-4", range: [6, 9], focus: "Search & Sort" },
      { weeks: "5-6", range: [10, 12], focus: "Data Structures" },
      { weeks: "7-8", range: [13, 16], focus: "Recursion & Advanced" },
      { weeks: "9", range: [17, 18], focus: "Optimization" },
      { weeks: "9", range: [19, 21], focus: "Trees" },
      { weeks: "10-11", range: [22, 27], focus: "Dynamic Programming" },
      { weeks: "12", range: [28, 30], focus: "Graphs & Final Prep" },
    ];

    // Headers
    planSheet.columns = [
      { header: "Week", key: "week", width: 12 },
      { header: "Focus Area", key: "focus", width: 30 },
      { header: "Patterns", key: "patterns", width: 15 },
      { header: "Problems", key: "problems", width: 12 },
      { header: "Topics Covered", key: "topics", width: 60 },
    ];

    // Style header row
    planSheet.getRow(1).font = { bold: true, size: 12 };
    planSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" },
    };
    planSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    planSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    // Add data
    weekGroups.forEach((week) => {
      const weekPatterns = patterns.filter(
        (p) => p.order >= week.range[0] && p.order <= week.range[1]
      );
      const weekQuestions = questions.filter((q) =>
        weekPatterns.some((p) => p.slug === q.pattern_id)
      );

      planSheet.addRow({
        week: `Week ${week.weeks}`,
        focus: week.focus,
        patterns: `${week.range[0]}-${week.range[1]}`,
        problems: weekQuestions.length,
        topics: weekPatterns.map((p) => p.name).join(", "),
      });
    });

    // Freeze header row
    planSheet.views = [{ state: "frozen", ySplit: 1 }];

    // ============================================
    // SHEET 2: All Problems Checklist
    // ============================================
    const checklistSheet = workbook.addWorksheet("Problems Checklist", {
      properties: { tabColor: { argb: "FF10B981" } },
    });

    // Headers
    checklistSheet.columns = [
      { header: "#", key: "num", width: 6 },
      { header: "Pattern", key: "pattern", width: 25 },
      { header: "Problem Title", key: "title", width: 40 },
      { header: "Difficulty", key: "difficulty", width: 12 },
      { header: "Week", key: "week", width: 10 },
      { header: "Status", key: "status", width: 12 },
      { header: "LeetCode", key: "leetcode", width: 15 },
      { header: "YouTube", key: "youtube", width: 15 },
      { header: "Companies", key: "companies", width: 30 },
      { header: "Tags", key: "tags", width: 30 },
      { header: "Time", key: "time", width: 12 },
      { header: "Space", key: "space", width: 12 },
      { header: "Notes", key: "notes", width: 40 },
    ];

    // Style header
    checklistSheet.getRow(1).font = { bold: true, size: 11 };
    checklistSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10B981" },
    };
    checklistSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    checklistSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    // Add problems
    let problemNum = 1;
    patterns.forEach((pattern) => {
      const patternQuestions = questions.filter((q) => q.pattern_id === pattern.slug);

      patternQuestions.forEach((q) => {
        // Determine week
        const weekGroup = weekGroups.find(
          (w) => pattern.order >= w.range[0] && pattern.order <= w.range[1]
        );
        const week = weekGroup ? `Week ${weekGroup.weeks}` : "N/A";

        // Determine status
        let status = "Not Started";
        if (userProgress?.completed?.includes(q._id)) {
          status = "✓ Completed";
        } else if (userProgress?.inProgress?.includes(q._id)) {
          status = "In Progress";
        }

        const row = checklistSheet.addRow({
          num: problemNum++,
          pattern: pattern.name,
          title: q.title,
          difficulty: q.difficulty || "Medium",
          week: week,
          status: status,
          leetcode: q.links?.leetcode ? "Link" : "",
          youtube: q.links?.youtube ? "Link" : "",
          companies: q.companies?.join(", ") || "",
          tags: q.tags?.join(", ") || "",
          time: pattern.complexity?.time || "",
          space: pattern.complexity?.space || "",
          notes: "",
        });

        // Color code difficulty
        const difficultyCell = row.getCell("difficulty");
        if (q.difficulty === "Easy") {
          difficultyCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" },
          };
          difficultyCell.font = { color: { argb: "FF065F46" } };
        } else if (q.difficulty === "Medium") {
          difficultyCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" },
          };
          difficultyCell.font = { color: { argb: "FF92400E" } };
        } else if (q.difficulty === "Hard") {
          difficultyCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFECACA" },
          };
          difficultyCell.font = { color: { argb: "FF991B1B" } };
        }

        // Highlight completed problems
        if (status === "✓ Completed") {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" },
          };
        }

        // Add hyperlinks if available
        if (q.links?.leetcode) {
          row.getCell("leetcode").value = {
            text: "LeetCode",
            hyperlink: q.links.leetcode,
          };
          row.getCell("leetcode").font = { color: { argb: "FF2563EB" }, underline: true };
        }

        if (q.links?.youtube) {
          row.getCell("youtube").value = {
            text: "YouTube",
            hyperlink: q.links.youtube,
          };
          row.getCell("youtube").font = { color: { argb: "FFDC2626" }, underline: true };
        }
      });
    });

    // Freeze header and enable filters
    checklistSheet.views = [{ state: "frozen", ySplit: 1 }];
    checklistSheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 13 },
    };

    // ============================================
    // SHEET 3: Statistics & Summary
    // ============================================
    const statsSheet = workbook.addWorksheet("Statistics", {
      properties: { tabColor: { argb: "FFF59E0B" } },
    });

    statsSheet.columns = [
      { header: "Metric", key: "metric", width: 30 },
      { header: "Value", key: "value", width: 20 },
    ];

    // Style header
    statsSheet.getRow(1).font = { bold: true, size: 12 };
    statsSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF59E0B" },
    };
    statsSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

    // Calculate statistics
    const totalProblems = questions.length;
    const easyCount = questions.filter((q) => q.difficulty === "Easy").length;
    const mediumCount = questions.filter((q) => q.difficulty === "Medium").length;
    const hardCount = questions.filter((q) => q.difficulty === "Hard").length;
    const completedCount = userProgress?.completed?.length || 0;
    const inProgressCount = userProgress?.inProgress?.length || 0;

    // Add statistics
    statsSheet.addRow({ metric: "Total Patterns", value: patterns.length });
    statsSheet.addRow({ metric: "Total Problems", value: totalProblems });
    statsSheet.addRow({ metric: "" }); // Empty row

    statsSheet.addRow({ metric: "By Difficulty:", value: "" });
    statsSheet.addRow({ metric: "  Easy Problems", value: easyCount });
    statsSheet.addRow({ metric: "  Medium Problems", value: mediumCount });
    statsSheet.addRow({ metric: "  Hard Problems", value: hardCount });
    statsSheet.addRow({ metric: "" });

    if (user) {
      statsSheet.addRow({ metric: "Your Progress:", value: "" });
      statsSheet.addRow({ metric: "  Completed", value: completedCount });
      statsSheet.addRow({ metric: "  In Progress", value: inProgressCount });
      statsSheet.addRow({ metric: "  Remaining", value: totalProblems - completedCount });
      statsSheet.addRow({
        metric: "  Completion %",
        value: `${Math.round((completedCount / totalProblems) * 100)}%`,
      });
      statsSheet.addRow({ metric: "" });
    }

    statsSheet.addRow({ metric: "Study Timeline:", value: "" });
    statsSheet.addRow({ metric: "  Duration", value: "12 Weeks" });
    statsSheet.addRow({ metric: "  Daily Target", value: `~${Math.ceil(totalProblems / 84)} problems/day` });
    statsSheet.addRow({ metric: "  Weekly Target", value: `~${Math.ceil(totalProblems / 12)} problems/week` });

    // Bold metric column
    statsSheet.getColumn("metric").font = { bold: true };

    // ============================================
    // Generate and send file
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    const filename = user
      ? `DSA-Tracker-${user.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`
      : `DSA-Tracker-${new Date().toISOString().split("T")[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating tracker:", error);
    return NextResponse.json(
      { error: "Failed to generate tracker" },
      { status: 500 }
    );
  }
}
