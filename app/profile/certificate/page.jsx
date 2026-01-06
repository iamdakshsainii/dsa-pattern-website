import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Award, Download, Calendar } from "lucide-react"

export default async function CertificatesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user certificates
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/roadmaps/certificate/list?userId=${user.id}`, {
    cache: 'no-store'
  })

  let certificates = []
  if (response.ok) {
    const data = await response.json()
    certificates = data.certificates || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Your Certificates</h1>
            <p className="text-muted-foreground">
              {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'} earned
            </p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-muted rounded-full">
                <Award className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Certificates Yet</h2>
            <p className="text-muted-foreground mb-6">
              Complete roadmaps and pass quizzes to earn certificates
            </p>
            <Link href="/roadmaps">
              <Button>Browse Roadmaps</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert._id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div
                  className="h-32 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                >
                  <div className="text-6xl">{cert.roadmapIcon || '🎓'}</div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {cert.roadmapTitle}
                  </h3>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Score: {cert.quizScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs mb-4">
                    ID: {cert.certificateId}
                  </Badge>

                  <Link href={`/roadmaps/${cert.roadmapId}/certificate`}>
                    <Button className="w-full gap-2" size="sm">
                      <Download className="h-4 w-4" />
                      View Certificate
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
