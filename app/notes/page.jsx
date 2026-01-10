import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getAllUserNotes } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StickyNote, ArrowLeft } from "lucide-react"
import NotesListClient from "@/components/notes-list-client"

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
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Your Saved Notes</h2>
          <p className="text-muted-foreground">
            Access all your notes and insights from solved problems
          </p>
        </div>

        <NotesListClient notes={notes} />
      </main>
    </div>
  )
}
