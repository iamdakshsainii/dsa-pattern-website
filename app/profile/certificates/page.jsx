import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Award, Download, Calendar, Trophy } from "lucide-react"

export default async function CertificatesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user certificates
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/roadmaps/certificate/list?userId=${user.id}`,
    { cache: 'no-store' }
  )

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
        {/* Header with trophy animation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse" />
              <Trophy className="relative h-10 w-10 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Certificates
              </h1>
              <p className="text-muted-foreground text-lg">
                {certificates.length} {certificates.length === 1 ? 'achievement' : 'achievements'} unlocked
              </p>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl" />
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-full">
                  <Award className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3">No Certificates Yet</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Complete roadmaps and pass quizzes to earn your first certificate!
            </p>
            <Link href="/roadmaps">
              <Button size="lg" className="gap-2">
                <Trophy className="h-5 w-5" />
                Browse Roadmaps
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert._id}
                className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-blue-400"
              >
                {/* Certificate Header with Icon */}
                <div className="relative h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="relative text-7xl group-hover:scale-110 transition-transform duration-300">
                    {cert.roadmapIcon || '🎓'}
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-lg">
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {cert.roadmapTitle}
                  </h3>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Score</span>
                      </div>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">{cert.quizScore}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Date</span>
                      </div>
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Certificate ID */}
                  <div className="bg-muted/50 px-3 py-2 rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground">Certificate ID</p>
                    <p className="font-mono text-xs font-semibold mt-1">
                      {cert.certificateId}
                    </p>
                  </div>

                  {/* View Button */}
                  <Link href={`/roadmaps/${cert.roadmapId}/certificate`}>
                    <Button
                      className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg group-hover:shadow-xl transition-all"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                      View Certificate
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Roadmaps CTA */}
        {certificates.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="inline-block p-8 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <p className="text-lg mb-4">Ready to earn more certificates?</p>
              <Link href="/roadmaps">
                <Button size="lg" variant="outline" className="gap-2 border-blue-500 hover:bg-blue-50">
                  <Trophy className="h-5 w-5" />
                  Explore More Roadmaps
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
