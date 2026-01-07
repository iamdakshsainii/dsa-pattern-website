'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function PublishToggle({ slug, initialPublished }) {
  const [published, setPublished] = useState(initialPublished)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleToggle = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/roadmaps/${slug}/toggle-publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      })

      if (!res.ok) throw new Error('Failed to toggle')

      setPublished(!published)
      toast({
        title: !published ? "Published" : "Unpublished",
        description: !published ? "Roadmap is now live" : "Roadmap is now draft"
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle publish status",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {published ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  )
}
