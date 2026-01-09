import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const patterns = await db
      .collection("patterns")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      patterns: patterns.map(p => ({
        ...p,
        _id: p._id.toString()
      }))
    });
  } catch (error) {
    console.error("Get patterns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    );
  }
}
