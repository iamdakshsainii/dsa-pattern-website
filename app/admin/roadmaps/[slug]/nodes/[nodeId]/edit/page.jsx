import { notFound } from "next/navigation"
import { getRoadmapNodes } from "@/lib/db"
import NodeForm from "@/components/admin/node-form"

export default async function EditNodePage({ params }) {
  const { slug, nodeId } = await params
  const nodes = await getRoadmapNodes(slug)
  const node = nodes.find(n => n.nodeId === nodeId)

  if (!node) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Node</h1>
      <NodeForm roadmapId={slug} node={node} />
    </div>
  )
}
