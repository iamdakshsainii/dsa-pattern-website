import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getFullUserProfile, calculateProfileCompletion, getUserById, updateUserProfile } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserById(user.id);
    const fullProfile = await getFullUserProfile(user.id);

    if (!fullProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const completion = calculateProfileCompletion(fullProfile.profile);

    return NextResponse.json({
      id: fullProfile.id,
      name: fullProfile.name,
      email: fullProfile.email,
      username: dbUser.username || null,
      createdAt: fullProfile.createdAt,
      profile: {
        ...fullProfile.profile,
        username: dbUser.username || null,
      },
      completionPercentage: completion,
      resume: fullProfile.resume,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const profileData = {
      bio: body.bio || "",
      college: body.college || "",
      graduationYear: body.graduationYear || null,
      currentYear: body.currentYear || "",
      location: body.location || "",
      skills: Array.isArray(body.skills) ? body.skills : [],
      github: body.socialLinks?.github || "",
      linkedin: body.socialLinks?.linkedin || "",
      leetcode: body.socialLinks?.leetcode || "",
      website: body.socialLinks?.portfolio || "",
      twitter: body.socialLinks?.twitter || "",
    };

    await updateUserProfile(user.id, profileData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
