import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUserActiveRoadmaps } from "@/lib/db";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const authToken =
      cookieStore.get("auth-token") || cookieStore.get("authToken");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(authToken.value);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId || payload.id;

    const roadmaps = await getUserActiveRoadmaps(userId);

    return NextResponse.json({
      success: true,
      roadmaps,
    });
  } catch (error) {
    console.error("Error fetching active roadmaps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
