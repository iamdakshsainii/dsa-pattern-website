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

    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const seed = dateString
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const questionIndex = seed % allQuestions.length;
    const challenge = allQuestions[questionIndex];

    return NextResponse.json({
      success: true,
      challenge: {
        ...challenge,
        _id: challenge._id.toString(),
        pattern: challenge.pattern_id || challenge.pattern || "two-pointers",
      },
      date: dateString,
    });
  } catch (error) {
    console.error("Daily challenge error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}
