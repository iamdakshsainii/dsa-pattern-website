import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUser } from "@/lib/db";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token") || cookieStore.get("authToken");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(authToken.value);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentUser = await getUser(payload.email);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const client = await clientPromise;
    const db = client.db("dsa_patterns");

    const userData = await db.collection("users").findOne({
      email: currentUser.email
    });

    return NextResponse.json({
      success: true,
      interviews: userData?.interviews || []
    });
  } catch (error) {
    console.error("Countdown fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token") || cookieStore.get("authToken");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(authToken.value);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentUser = await getUser(payload.email);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { company, role, date, time } = body;

    if (!company || !date) {
      return NextResponse.json(
        { error: "Company and date are required" },
        { status: 400 }
      );
    }

    const interviewDateTime = new Date(`${date}T${time || '10:00'}:00`);

    const client = await clientPromise;
    const db = client.db("dsa_patterns");

    const result = await db.collection("users").updateOne(
      { email: currentUser.email },
      {
        $push: {
          interviews: {
            company,
            role: role || '',
            date: interviewDateTime,
            createdAt: new Date()
          }
        }
      }
    );

    const updatedUser = await db.collection("users").findOne({
      email: currentUser.email
    });

    return NextResponse.json({
      success: true,
      interviews: updatedUser.interviews || []
    });
  } catch (error) {
    console.error("Countdown add error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token") || cookieStore.get("authToken");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(authToken.value);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentUser = await getUser(payload.email);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { index } = body;

    const client = await clientPromise;
    const db = client.db("dsa_patterns");

    const userData = await db.collection("users").findOne({
      email: currentUser.email
    });

    if (!userData || !userData.interviews || !userData.interviews[index]) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const updatedInterviews = userData.interviews.filter((_, i) => i !== index);

    await db.collection("users").updateOne(
      { email: currentUser.email },
      { $set: { interviews: updatedInterviews } }
    );

    return NextResponse.json({
      success: true,
      interviews: updatedInterviews
    });
  } catch (error) {
    console.error("Countdown delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
