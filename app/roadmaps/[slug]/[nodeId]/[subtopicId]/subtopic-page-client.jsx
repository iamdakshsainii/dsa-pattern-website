'use client'

import { useRouter } from "next/navigation"
import ExternalRedirectInterstitial from "@/components/roadmaps/content/external-redirect-interstitial"
import InternalContentRenderer from "@/components/roadmaps/content/internal-content-renderer"

export default function SubtopicPageClient({
  roadmap,
  node,
  subtopic,
  resourceType,
  currentUser
}) {
  const router = useRouter()

  const getResourceUrl = () => {
    switch (resourceType) {
      case 'youtube':
        return subtopic.resourceLinks?.youtube
      case 'article':
        return subtopic.resourceLinks?.article
      case 'practice':
        return subtopic.resourceLinks?.practice
      default:
        return subtopic.resourceLinks?.youtube || subtopic.resourceLinks?.article
    }
  }

  const resourceUrl = getResourceUrl()

  if (subtopic.contentType === "internal") {
    return (
      <InternalContentRenderer
        roadmap={roadmap}
        node={node}
        subtopic={subtopic}
        currentUser={currentUser}
      />
    )
  }

  if (!resourceUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Resource Not Available</h2>
          <p className="text-muted-foreground mb-4">
            This resource type is not available for this subtopic.
          </p>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <ExternalRedirectInterstitial
      roadmap={roadmap}
      node={node}
      subtopic={subtopic}
      resourceUrl={resourceUrl}
      resourceType={resourceType}
      currentUser={currentUser}
    />
  )
}
