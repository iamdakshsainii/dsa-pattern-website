import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUserWeakTopics } from "@/lib/db";

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

    const weakTopics = await getUserWeakTopics(userId);

    return NextResponse.json({
      success: true,
      weakTopics,
    });
  } catch (error) {
    console.error("Error fetching weak topics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
