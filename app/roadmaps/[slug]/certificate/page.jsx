"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Share2,
  Award,
  AlertCircle,
  Calendar,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export default function CertificatePage({ params }) {
  const [slug, setSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificateData, setCertificateData] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/roadmaps/certificate?roadmapId=${slug}`);

        if (res.status === 403) {
          setIsEligible(false);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch certificate");
        }

        const data = await res.json();
        setCertificateData(data);
        setIsEligible(true);
        setLoading(false);

        await fetch("/api/roadmaps/certificate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roadmapId: slug }),
        });
      } catch (error) {
        console.error("Error fetching certificate:", error);
        toast({
          title: "Error",
          description: "Failed to load certificate",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [slug]);

  const downloadPDF = async () => {
    toast({
      title: "Coming Soon!",
      description: "Certificate download feature is launching soon. Your achievement is saved!",
    });
  };

  const shareOnLinkedIn = () => {
    const text = `I just completed ${certificateData.roadmapTitle} and earned my certificate!`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading certificate...</p>
        </Card>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <Link href={`/roadmaps/${slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roadmap
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="p-10 text-center border-2 border-orange-200 dark:border-orange-800">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <AlertCircle className="h-16 w-16 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">
              Certificate Not Available
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Complete the roadmap 100% and pass the quiz with 70% or higher to
              earn your certificate
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/roadmaps/${slug}`}>
                <Button size="lg">Continue Learning</Button>
              </Link>
              <Link href={`/roadmaps/${slug}/quiz`}>
                <Button variant="outline" size="lg">
                  <Trophy className="h-5 w-5 mr-2" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const issueDate = new Date(certificateData.issuedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <Link href={`/roadmaps/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmap
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative">
        {/* Celebration Confetti Effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 animate-float-slow">🎉</div>
          <div className="absolute top-20 right-1/4 animate-float-medium">🎊</div>
          <div className="absolute top-10 left-1/3 animate-float-fast">⭐</div>
          <div className="absolute top-32 right-1/3 animate-float-slow">🏆</div>
          <div className="absolute top-16 left-1/2 animate-float-medium">✨</div>
        </div>

        {/* Congratulations Banner */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-20 blur-3xl animate-pulse"></div>
          <Card className="relative border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-950/30 dark:via-orange-950/30 dark:to-pink-950/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="relative p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative text-8xl animate-bounce-slow">🎓</div>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-orange-500 to-pink-600 bg-clip-text text-transparent">
                🎉 Congratulations! 🎉
              </h1>
              <p className="text-2xl font-semibold mb-2">
                You've Completed <span className="text-yellow-600 dark:text-yellow-400">{certificateData.roadmapTitle}</span>!
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Your dedication and hard work have paid off. This is a significant achievement!
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-base">
                  ✅ Roadmap Complete
                </Badge>
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-base">
                  🎯 Quiz Score: {certificateData.quizScore}
                </Badge>
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-base">
                  🏆 Certificate Earned
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <Award className="h-10 w-10 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold">Your Digital Certificate</h2>
          </div>
          <p className="text-muted-foreground">
            Share your achievement with the world!
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <Button
            onClick={downloadPDF}
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
            disabled={isDownloading}
          >
            <Download className="h-5 w-5" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
          <Button
            onClick={shareOnLinkedIn}
            variant="outline"
            size="lg"
            className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Share2 className="h-5 w-5" />
            Share on LinkedIn
          </Button>
        </div>

        {/* Coming Soon Notice */}
        <div className="mb-8">
          <Card className="border-2 border-blue-400/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="relative p-6 text-center">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-500 rounded-full animate-pulse">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  Certificate Download Coming Soon!
                </h3>
              </div>
              <p className="text-base text-blue-600 dark:text-blue-300 mb-4">
                We're working hard to bring you a beautiful, downloadable PDF certificate.
                Your achievement is already saved and will be available for download very soon!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-500">
                <span className="flex items-center gap-1">
                  ⏰ Expected: Within 24-48 hours
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  📧 You'll be notified by email
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* Lock Chain Animation */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl z-20 group-hover:scale-110 transition-transform duration-300">
              ⛓️
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-7xl z-30 animate-swing group-hover:animate-none">
              🔒
            </div>

            {/* Hover Tooltip */}
            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 whitespace-nowrap">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl border-2 border-white/20">
                <p className="text-lg font-bold flex items-center gap-2">
                  🔧 We'll be right back!
                </p>
                <p className="text-sm opacity-90">Setting up something special for you</p>
              </div>
            </div>

            {/* Faded Certificate */}
            <div className="relative opacity-40 grayscale blur-[2px] group-hover:opacity-50 transition-all duration-300 select-none pointer-events-none">
              <div
                ref={certificateRef}
                className="bg-white p-16 rounded-xl shadow-2xl border-8 border-double border-blue-600 relative overflow-hidden"
                style={{ width: "1000px", minHeight: "700px" }}
              >
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center space-y-8">
                  <div className="text-7xl mb-4">
                    {certificateData.roadmapIcon || "🏆"}
                  </div>

                  <div>
                    <h2 className="text-5xl font-serif font-bold text-blue-600 mb-2">
                      CERTIFICATE OF COMPLETION
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
                  </div>

                  <p className="text-xl text-gray-600">This certifies that</p>

                  <h3 className="text-6xl font-bold text-gray-900">
                    {certificateData.userName}
                  </h3>

                  <p className="text-xl text-gray-600">
                    has successfully completed
                  </p>

                  <h4 className="text-4xl font-bold text-gray-900 px-8">
                    {certificateData.roadmapTitle}
                  </h4>

                  <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mt-6">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <Trophy className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-xs text-gray-600">Quiz Score</p>
                      <p className="font-bold text-lg text-gray-900">
                        {certificateData.quizScore}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-xs text-gray-600">Issued On</p>
                      <p className="font-bold text-sm text-gray-900">{issueDate}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-xs text-gray-600">Certificate ID</p>
                      <p className="font-mono text-xs font-bold text-gray-900">
                        {certificateData.certificateId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t-2 border-gray-300 w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-lg">
                          DSA Patterns Platform
                        </p>
                        <p className="text-sm text-gray-600">
                          Verified Learning Achievement
                        </p>
                      </div>
                      <div className="border border-gray-300 px-4 py-2 rounded text-sm text-gray-700">
                        Digital Certificate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Lock Message */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm text-white px-8 py-6 rounded-2xl border-2 border-white/30 shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <p className="text-3xl font-bold mb-2 flex items-center gap-3">
                  🔒 Locked for Now
                </p>
                <p className="text-lg opacity-90">Download coming very soon!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/profile/certificates">
            <Button variant="outline" size="lg">
              View All Certificates
            </Button>
          </Link>
          <Link href="/roadmaps">
            <Button variant="outline" size="lg">
              Browse More Roadmaps
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
