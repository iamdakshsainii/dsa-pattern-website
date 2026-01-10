import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("dsa_patterns");

    const allQuestions = await db.collection("questions").find({}).toArray();

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }

    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const question = allQuestions[randomIndex];

    return NextResponse.json({
      success: true,
      question: {
        _id: question._id.toString(),
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        pattern: question.pattern_id || question.pattern,
        examples: question.examples || [],
        hints: question.hints || [],
        leetcodeLink: question.leetcode_link || question.link
      }
    });
  } catch (error) {
    console.error("Mock question error:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}
