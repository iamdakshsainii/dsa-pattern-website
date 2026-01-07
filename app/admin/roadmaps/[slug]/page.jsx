import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getRoadmap, getRoadmapNodes, getQuizBank } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Eye, FileText, Brain, HelpCircle, Settings } from "lucide-react"

export default async function RoadmapManagementPage({ params }) {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  const nodes = await getRoadmapNodes(slug)
  const quizzes = await getQuizBank(slug)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/admin/roadmaps">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{roadmap.icon}</span>
            <h1 className="text-3xl font-bold">{roadmap.title}</h1>
            <Badge variant={roadmap.published ? "default" : "secondary"}>
              {roadmap.published ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{roadmap.description}</p>
        </div>
        <Link href={`/admin/roadmaps/${slug}/edit`}>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Nodes</h3>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mb-4">{nodes.length}</p>
          <Link href={`/admin/roadmaps/${slug}/nodes`}>
            <Button variant="outline" size="sm" className="w-full">
              Manage Nodes
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quiz Bank</h3>
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mb-4">{quizzes.length}</p>
          <Link href={`/admin/roadmaps/${slug}/quiz-bank`}>
            <Button variant="outline" size="sm" className="w-full">
              Manage Quiz Bank
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Weak Topics</h3>
            <Brain className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mb-4">Resources</p>
          <Link href={`/admin/roadmaps/${slug}/weak-topics`}>
            <Button variant="outline" size="sm" className="w-full">
              Manage Resources
            </Button>
          </Link>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link href={`/roadmaps/${slug}`}>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Roadmap
          </Button>
        </Link>
        {!roadmap.published && (
          <Link href={`/admin/roadmaps/${slug}/setup/quiz-bank`}>
            <Button>
              Complete Setup
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
