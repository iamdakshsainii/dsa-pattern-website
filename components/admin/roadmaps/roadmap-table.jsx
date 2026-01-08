"use client"

import { useState } from "react"
import Link from "next/link"
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
import { MoreVertical, Eye, Settings, Trash2, FileText, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RoadmapTable({ roadmaps, loading, onRefresh }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(slug) {
    if (!confirm("Delete this roadmap? This cannot be undone.")) return

    setDeleting(slug)
    try {
      const res = await fetch(`/api/admin/roadmaps/${slug}`, {
        method: "DELETE"
      })

      if (res.ok) {
        onRefresh()
      } else {
        alert("Failed to delete roadmap")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete roadmap")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading roadmaps...</div>
  }

  if (roadmaps.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No roadmaps found</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nodes</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roadmaps.map((roadmap) => (
            <TableRow key={roadmap._id}>
              <TableCell>
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-lg">
                  {roadmap.icon}
                </div>
              </TableCell>
              <TableCell className="font-medium">{roadmap.title}</TableCell>
              <TableCell className="text-muted-foreground">{roadmap.slug}</TableCell>
              <TableCell>
                <Badge variant="outline">{roadmap.category}</Badge>
              </TableCell>
              <TableCell>
                {roadmap.published ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </TableCell>
              <TableCell>{roadmap.stats?.totalNodes || 0}</TableCell>
              <TableCell>{roadmap.order}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${roadmap.slug}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Overview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${roadmap.slug}/edit`)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${roadmap.slug}/nodes`)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Nodes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${roadmap.slug}/quiz-bank`)}>
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Manage Quizzes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(roadmap.slug)}
                      disabled={deleting === roadmap.slug}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
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
