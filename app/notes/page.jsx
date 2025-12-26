import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getAllUserNotes } from "@/lib/db"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StickyNote, ArrowRight, Calendar, FileText, ArrowLeft } from "lucide-react"

async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) return null

  try {
    return await verifyToken(token.value)
  } catch {
    return null
  }
}

export default async function NotesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const notes = await getAllUserNotes(user.id)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4 px-4 max-w-6xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Your Notes</h1>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Your Saved Notes</h2>
          <p className="text-muted-foreground">
            Access all your notes and insights from solved problems
          </p>
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Start solving problems and save your notes to see them here!
              </p>
              <Link href="/patterns">
                <Button>
                  Browse Problems
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-2 hover:border-primary/50"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(note.difficulty)}
                        >
                          {note.difficulty || "Medium"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {note.patternName}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-1 truncate">
                        {note.questionTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Last updated: {formatDate(note.updated_at)}</span>
                      </div>
                    </div>
                    <Link href={`/questions/${note.question_id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        View Problem
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex items-start gap-2 mb-2">
                      <StickyNote className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium">Your Notes:</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap line-clamp-3">
                      {note.content}
                    </p>
                    {note.content.length > 200 && (
                      <Link href={`/questions/${note.question_id}`}>
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-2 px-0 h-auto"
                        >
                          Read more →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {notes.length > 0 && (
          <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <Link href="/patterns">
                <Button variant="outline" className="gap-2">
                  Solve More Problems
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
