import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkUsernameAvailable, updateUsername, getUserById } from "@/lib/db";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();

    // Validate username format
    if (!username || username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Get current user data
    const dbUser = await getUserById(user.id);

    // Check if username has changed
    if (dbUser.username === username) {
      return NextResponse.json({ success: true }); // No change needed
    }

    // Check if username is available
    const available = await checkUsernameAvailable(username);
    if (!available) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Update username with timestamp
    await updateUsername(user.id, username);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Username update error:", error);
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const available = await checkUsernameAvailable(username);
    return NextResponse.json({ available });
  } catch (error) {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
