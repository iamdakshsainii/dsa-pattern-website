import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookOpen, RotateCcw } from "lucide-react";

export function PersistentActions({ uiState, roadmap, canRetake }) {
  // State 1: Active (subtle, secondary)
  if (uiState === "active") {
    return (
      <div className="mt-6 pt-6 border-t">
        <p className="text-xs text-center text-muted-foreground mb-3">
          💡 Need additional support while learning?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/mentorship-request">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-purple-200 hover:border-purple-400"
            >
              <MessageSquare className="h-4 w-4" />
              Get Help from Mentor
            </Button>
          </Link>
          <Link href={`/roadmaps/${roadmap.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-blue-200 hover:border-blue-400"
            >
              <BookOpen className="h-4 w-4" />
              Review Roadmap
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State 2: Bonus (medium emphasis)
  if (uiState === "bonus") {
    return (
      <div className="mt-6 pt-6 border-t bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-4">
        <p className="text-sm text-center font-semibold mb-3">
          📚 Consider reviewing before your next attempt
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {canRetake && (
            <Link href={`/roadmaps/${roadmap.slug}/quiz`}>
              <Button
                size="default"
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Quiz Now
              </Button>
            </Link>
          )}
          <Link href="/mentorship-request">
            <Button
              variant="outline"
              size="default"
              className="w-full gap-2 border-2 border-purple-300 hover:bg-purple-50"
            >
              <MessageSquare className="h-4 w-4" />
              Talk to Mentor
            </Button>
          </Link>
          <Link href={`/roadmaps/${roadmap.slug}`}>
            <Button
              variant="outline"
              size="default"
              className="w-full gap-2 border-2 border-blue-300 hover:bg-blue-50"
            >
              <BookOpen className="h-4 w-4" />
              Review Content
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State 3: Locked (high emphasis, primary actions)
  if (uiState === "locked") {
    return (
      <div className="mt-6 pt-6 border-t-2 border-orange-300 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 rounded-lg p-6">
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg mb-1">🚀 Ready to Break Through?</h3>
          <p className="text-sm text-muted-foreground">
            Take these next steps to master this roadmap
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/mentorship-request">
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg h-14"
            >
              <MessageSquare className="h-5 w-5" />
              <div className="text-left">
                <div className="font-bold">Request Mentorship</div>
                <div className="text-xs opacity-90">Get personalized guidance</div>
              </div>
            </Button>
          </Link>
          <Link href={`/roadmaps/${roadmap.slug}`}>
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg h-14"
            >
              <BookOpen className="h-5 w-5" />
              <div className="text-left">
                <div className="font-bold">Review Roadmap</div>
                <div className="text-xs opacity-90">Strengthen weak areas</div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State 4: Mastered (celebration, different actions)
  if (uiState === "mastered") {
    return null; // Success card handles its own actions
  }

  return null;
}
