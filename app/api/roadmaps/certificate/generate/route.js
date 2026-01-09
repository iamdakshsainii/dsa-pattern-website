// app/api/roadmaps/certificate/generate/route.js

import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import {
  getUser,
  getQuizResult,
  generateCertificateRecord,
  getRoadmap,
} from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID required" },
        { status: 400 }
      );
    }

    // Verify authentication
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(authToken.value);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await getUser(payload.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get roadmap and quiz data
    const roadmap = await getRoadmap(roadmapId);
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }
    const quizResult = await getQuizResult(user._id.toString(), roadmapId);

    // console.log("🔍 Quiz Result Debug:");
    // console.log("Quiz Passed:", quizResult?.passed);

    if (!quizResult || !quizResult.passed) {
      return NextResponse.json(
        { error: "Quiz not passed. Minimum 70% required." },
        { status: 403 }
      );
    }

    // Generate certificate record
    const certificateRecord = await generateCertificateRecord(
      user._id.toString(),
      roadmapId,
      quizResult.percentage
    );

    // Create PDF
    const doc = new PDFDocument({
      size: [842, 595], // A4 landscape
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // DECORATIVE CORNER ELEMENTS
    // Top-left corner
    doc.save();
    doc
      .moveTo(0, 0)
      .lineTo(150, 0)
      .lineTo(0, 150)
      .closePath()
      .fillAndStroke("#1e40af", "#1e3a8a");
    doc.restore();

    // Top-right corner
    doc.save();
    doc
      .moveTo(842, 0)
      .lineTo(692, 0)
      .lineTo(842, 150)
      .closePath()
      .fillAndStroke("#7c3aed", "#6d28d9");
    doc.restore();

    // Bottom-left corner
    doc.save();
    doc
      .moveTo(0, 595)
      .lineTo(150, 595)
      .lineTo(0, 445)
      .closePath()
      .fillAndStroke("#7c3aed", "#6d28d9");
    doc.restore();

    // Bottom-right corner
    doc.save();
    doc
      .moveTo(842, 595)
      .lineTo(692, 595)
      .lineTo(842, 445)
      .closePath()
      .fillAndStroke("#1e40af", "#1e3a8a");
    doc.restore();

    // MAIN BORDER
    doc.roundedRect(40, 40, 762, 515, 10).lineWidth(3).stroke("#1e293b");

    doc.roundedRect(50, 50, 742, 495, 8).lineWidth(1).stroke("#cbd5e1");

    // PLATFORM LOGO/ICON (emoji as text)
    doc
      .fontSize(48)
      .fillColor("#1e40af")
      .text("🎯", 0, 80, { align: "center", width: 842 });

    // PLATFORM NAME
    doc
      .fontSize(14)
      .fillColor("#64748b")
      .font("Helvetica-Bold")
      .text("DSA PATTERNS PLATFORM", 0, 140, { align: "center", width: 842 });

    // CERTIFICATE OF
    doc
      .fontSize(16)
      .fillColor("#475569")
      .font("Helvetica")
      .text("CERTIFICATE OF", 0, 180, { align: "center", width: 842 });

    // COMPLETION
    doc
      .fontSize(42)
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .text("COMPLETION", 0, 205, { align: "center", width: 842 });

    // PRESENTED TO
    doc
      .fontSize(12)
      .fillColor("#64748b")
      .font("Helvetica")
      .text("THIS CERTIFICATE IS PRESENTED TO:", 0, 270, {
        align: "center",
        width: 842,
      });

    // USER NAME (with underline)
    const userName = user.name || "User";
    doc
      .fontSize(36)
      .fillColor("#1e40af")
      .font("Helvetica-BoldOblique")
      .text(userName, 0, 300, { align: "center", width: 842 });

    // Underline for name
    const nameWidth = doc.widthOfString(userName);
    const nameX = (842 - nameWidth) / 2;
    doc
      .moveTo(nameX, 345)
      .lineTo(nameX + nameWidth, 345)
      .lineWidth(1)
      .stroke("#cbd5e1");

    // ACHIEVEMENT TEXT
    doc
      .fontSize(11)
      .fillColor("#475569")
      .font("Helvetica")
      .text(
        `For successfully completing the ${roadmap.title} roadmap`,
        100,
        370,
        { align: "center", width: 642 }
      );

    doc.text(
      `and demonstrating mastery by achieving ${quizResult.percentage}% on the final assessment.`,
      100,
      388,
      { align: "center", width: 642 }
    );

    doc
      .fontSize(10)
      .fillColor("#64748b")
      .text(
        "This achievement represents dedication, skill development, and problem-solving excellence.",
        100,
        410,
        { align: "center", width: 642 }
      );

    // SIGNATURE SECTION
    const signatureY = 460;

    // Left signature - Platform
    doc
      .moveTo(160, signatureY)
      .lineTo(300, signatureY)
      .lineWidth(1)
      .stroke("#cbd5e1");

    doc
      .fontSize(11)
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .text("DSA Patterns Team", 160, signatureY + 8, {
        width: 140,
        align: "center",
      });

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .font("Helvetica")
      .text("Platform Authority", 160, signatureY + 24, {
        width: 140,
        align: "center",
      });

    // Right signature - Instructor
    doc
      .moveTo(542, signatureY)
      .lineTo(682, signatureY)
      .lineWidth(1)
      .stroke("#cbd5e1");

    doc
      .fontSize(11)
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .text("Chief Learning Officer", 542, signatureY + 8, {
        width: 140,
        align: "center",
      });

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .font("Helvetica")
      .text("Course Instructor", 542, signatureY + 24, {
        width: 140,
        align: "center",
      });

    // FOOTER - Certificate Details
    const footerY = 535;

    doc
      .fontSize(8)
      .fillColor("#94a3b8")
      .font("Helvetica")
      .text(`Certificate ID: ${certificateRecord.certificateId}`, 60, footerY, {
        width: 300,
      });

    doc.text(
      `Issued: ${new Date(certificateRecord.issuedAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )}`,
      542,
      footerY,
      { width: 240, align: "right" }
    );

    doc
      .fontSize(7)
      .fillColor("#cbd5e1")
      .text("Verify at: dsapatterns.com/verify", 0, footerY + 15, {
        align: "center",
        width: 842,
      });

    // DECORATIVE SEAL (bottom center)
    const sealX = 421;
    const sealY = 460;
    const sealRadius = 25;

    doc
      .circle(sealX, sealY, sealRadius)
      .lineWidth(2)
      .fillAndStroke("#dbeafe", "#1e40af");

    doc
      .circle(sealX, sealY, sealRadius - 5)
      .lineWidth(1)
      .stroke("#3b82f6");

    doc
      .fontSize(24)
      .fillColor("#1e40af")
      .text(roadmap.icon || "🎓", sealX - 15, sealY - 12);

    // Finalize PDF
    doc.end();

    // Wait for PDF generation to complete
    await new Promise((resolve) => {
      doc.on("end", resolve);
    });

    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${roadmap.title.replace(
          /\s+/g,
          "-"
        )}-Certificate.pdf"`,
      },
    });
  } catch (error) {
    // console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
