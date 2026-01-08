"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Eye, Code, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import LinkToSetDialog from "./link-to-set-dialog"

export default function QuizPoolTable({ sets, questions, viewMode, loading, onRefresh }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  async function handleDeleteSet(set) {
    if (!confirm(`Delete quiz set "${set.setName}"? This will remove all ${set.questions.length} questions.`)) return

    setDeleting(set.setId)
    try {
      const endpoint = set.roadmapId
        ? `/api/admin/roadmaps/${set.roadmapId}/quiz-bank/${set.setId}`
        : `/api/admin/quiz-manager/pool/${set.setId}`

      const res = await fetch(endpoint, { method: "DELETE" })

      if (res.ok) {
        onRefresh()
      } else {
        alert("Failed to delete quiz set")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete quiz set")
    } finally {
      setDeleting(null)
    }
  }

  function handleLinkQuestion(question) {
    setSelectedQuestion(question)
    setLinkDialogOpen(true)
  }

  function getDifficultyColor(difficulty) {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading quiz pool...</div>
  }

  if (viewMode === "questions") {
    if (!questions || questions.length === 0) {
      return (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No questions found</p>
            <p className="text-sm">Create quiz sets to see questions here</p>
          </div>
        </Card>
      )
    }

    return (
      <>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Quiz Set</TableHead>
                <TableHead>Roadmap</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question, idx) => (
                <TableRow key={question.id || idx}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="font-medium line-clamp-2">{question.question}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {question.code && (
                          <Badge variant="outline" className="text-xs">
                            <Code className="w-3 h-3 mr-1" />
                            Code
                          </Badge>
                        )}
                        {question.image && (
                          <Badge variant="outline" className="text-xs">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Image
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{question.setName}</span>
                  </TableCell>
                  <TableCell>
                    {question.roadmap ? (
                      <div className="flex items-center gap-1">
                        <span>{question.roadmap.icon}</span>
                        <span className="text-sm">{question.roadmap.title}</span>
                      </div>
                    ) : (
                      <Badge variant="secondary">Pool Only</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{question.topic || 'General'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty || 'Medium'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {question.roadmapId ? (
                          <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${question.roadmapId}/quiz-bank/edit/${question.setId}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit in Quiz Set
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => router.push(`/admin/quiz-manager/pool/${question.setId}/edit`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Quiz Set
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleLinkQuestion(question)}>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Link to Quiz Set
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <LinkToSetDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          question={selectedQuestion}
          onSuccess={onRefresh}
        />
      </>
    )
  }

  if (!sets || sets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-muted-foreground mb-4">
          <p className="text-lg font-medium mb-2">No quiz sets in pool yet</p>
          <p className="text-sm">Create quiz sets in roadmaps to see them here</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        {sets.map((set) => (
          <AccordionItem key={set.setId} value={set.setId} className="border rounded-lg">
            <Card className="border-0">
              <div className="px-6 py-4 flex items-center justify-between">
                <AccordionTrigger className="flex-1 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    {set.roadmap ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{set.roadmap.icon}</span>
                        <div>
                          <div className="font-semibold">{set.setName}</div>
                          <div className="text-sm text-muted-foreground">
                            {set.roadmap.title}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold">{set.setName}</div>
                        <div className="text-sm text-muted-foreground">Pool Only</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <Badge variant="outline">
                      {set.questions.length} questions
                    </Badge>
                  </div>
                </AccordionTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {set.roadmapId ? (
                      <>
                        <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${set.roadmapId}/quiz-bank`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View in Roadmap
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/roadmaps/${set.roadmapId}/quiz-bank/edit/${set.setId}`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Quiz Set
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push(`/admin/quiz-manager/pool/${set.setId}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Quiz Set
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteSet(set)}
                      disabled={deleting === set.setId}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Set
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AccordionContent>
                <div className="px-6 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[100px]">Options</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {set.questions.map((question, idx) => (
                        <TableRow key={question.id || idx}>
                          <TableCell className="font-medium">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="max-w-md">
                              <div className="font-medium line-clamp-2">{question.question}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {question.code && (
                                  <Badge variant="outline" className="text-xs">
                                    <Code className="w-3 h-3 mr-1" />
                                    Code
                                  </Badge>
                                )}
                                {question.image && (
                                  <Badge variant="outline" className="text-xs">
                                    <ImageIcon className="w-3 h-3 mr-1" />
                                    Image
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{question.topic || 'General'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty || 'Medium'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {question.type === 'multiple-choice' ? 'MCQ' :
                               question.type === 'multi-select' ? 'Multi' :
                               'MCQ'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {question.options?.length || 4}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
