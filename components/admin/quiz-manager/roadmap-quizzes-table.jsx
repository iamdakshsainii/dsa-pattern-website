"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RoadmapQuizzesTable({ quizzes, loading, onRefresh }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(roadmapSlug, quizId) {
    if (!confirm("Remove this quiz from roadmap?")) return

    setDeleting(quizId)
    try {
      const res = await fetch(`/api/admin/roadmaps/${roadmapSlug}/quiz-bank/${quizId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        onRefresh()
      } else {
        alert("Failed to delete quiz")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete quiz")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading roadmap quizzes...</div>
  }

  if (quizzes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No quizzes assigned to roadmaps</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz Name</TableHead>
            <TableHead>Roadmap</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Time Limit</TableHead>
            <TableHead>Passing Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={`${quiz.roadmapId}-${quiz.quizId}`}>
              <TableCell className="font-medium">{quiz.quizName}</TableCell>
              <TableCell>
                <Link href={`/admin/roadmaps/${quiz.roadmapSlug}`} className="hover:underline">
                  {quiz.roadmapTitle}
                </Link>
              </TableCell>
              <TableCell>{quiz.questions?.length || 0}</TableCell>
              <TableCell>{quiz.settings?.timeLimit || 20} min</TableCell>
              <TableCell>{quiz.settings?.passingScore || 70}%</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${quiz.roadmapSlug}/quiz-bank/edit/${quiz.quizId}`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${quiz.roadmapSlug}/quiz-bank`)}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View in Roadmap
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(quiz.roadmapSlug, quiz.quizId)}
                      disabled={deleting === quiz.quizId}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from Roadmap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
