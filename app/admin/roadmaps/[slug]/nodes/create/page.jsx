import { notFound } from "next/navigation"
import { getRoadmap } from "@/lib/db"
import NodeForm from "@/components/admin/node-form"

export default async function CreateNodePage({ params }) {
  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Add New Node</h1>
      <p className="text-muted-foreground mb-6">
        Create a new week/module for {roadmap.title}
      </p>
      <NodeForm roadmapId={slug} />
    </div>
  )
}
