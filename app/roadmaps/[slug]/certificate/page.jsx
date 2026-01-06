'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Share2,
  Award,
  AlertCircle,
  Calendar,
  Trophy
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function CertificatePage({ params }) {
  const [slug, setSlug] = useState(null)
  const [loading, setLoading] = useState(true)
  const [certificateData, setCertificateData] = useState(null)
  const [isEligible, setIsEligible] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const certificateRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return

    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/roadmaps/certificate?roadmapId=${slug}`)

        if (res.status === 403) {
          setIsEligible(false)
          setLoading(false)
          return
        }

        if (!res.ok) {
          throw new Error("Failed to fetch certificate")
        }

        const data = await res.json()
        setCertificateData(data)
        setIsEligible(true)
        setLoading(false)

        await fetch('/api/roadmaps/certificate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roadmapId: slug })
        })
      } catch (error) {
        console.error("Error fetching certificate:", error)
        toast({
          title: "Error",
          description: "Failed to load certificate",
          variant: "destructive"
        })
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [slug])

  const downloadPDF = async () => {
    if (!certificateRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${certificateData.roadmapTitle.replace(/\s+/g, '-')}-Certificate.pdf`)

      toast({
        title: "Success!",
        description: "Certificate downloaded successfully"
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const shareOnLinkedIn = () => {
    const text = `I just completed ${certificateData.roadmapTitle} and earned my certificate!`
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    window.open(linkedInUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading certificate...</p>
        </Card>
      </div>
    )
  }

  if (!isEligible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <Link href={`/roadmaps/${slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roadmap
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="p-10 text-center border-2 border-orange-200 dark:border-orange-800">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <AlertCircle className="h-16 w-16 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">Certificate Not Available</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Complete the roadmap 100% and pass the quiz with 70% or higher to earn your certificate
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/roadmaps/${slug}`}>
                <Button size="lg">Continue Learning</Button>
              </Link>
              <Link href={`/roadmaps/${slug}/quiz`}>
                <Button variant="outline" size="lg">
                  <Trophy className="h-5 w-5 mr-2" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  const issueDate = new Date(certificateData.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <Link href={`/roadmaps/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmap
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <Award className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Certificate of Completion</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            🎉 Congratulations on completing <span className="font-semibold">{certificateData.roadmapTitle}</span>!
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <Button
            onClick={downloadPDF}
            size="lg"
            className="gap-2"
            disabled={isDownloading}
          >
            <Download className="h-5 w-5" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
          <Button onClick={shareOnLinkedIn} variant="outline" size="lg" className="gap-2">
            <Share2 className="h-5 w-5" />
            Share on LinkedIn
          </Button>
        </div>

        <div className="flex justify-center mb-8">
          <div
            ref={certificateRef}
            className="bg-white dark:bg-gray-900 p-16 rounded-xl shadow-2xl border-8 border-double border-primary relative overflow-hidden"
            style={{ width: '1000px', minHeight: '700px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

            <div className="relative h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="text-7xl mb-4 animate-bounce">{certificateData.roadmapIcon || '🏆'}</div>

              <div>
                <h2 className="text-5xl font-serif font-bold text-primary mb-2">
                  CERTIFICATE OF COMPLETION
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-400">This certifies that</p>

              <h3 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {certificateData.userName}
              </h3>

              <p className="text-xl text-gray-600 dark:text-gray-400">has successfully completed</p>

              <h4 className="text-4xl font-bold text-gray-900 dark:text-white px-8">
                {certificateData.roadmapTitle}
              </h4>

              <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mt-6">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xs text-muted-foreground">Quiz Score</p>
                  <p className="font-bold text-lg">{certificateData.quizScore}</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Issued On</p>
                  <p className="font-bold text-sm">{issueDate}</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200">
                  <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs text-muted-foreground">Certificate ID</p>
                  <p className="font-mono text-xs font-bold">{certificateData.certificateId}</p>
                </Card>
              </div>

              <div className="mt-auto pt-8 border-t-2 border-gray-300 dark:border-gray-700 w-full">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-lg">DSA Patterns Platform</p>
                    <p className="text-sm text-gray-500">Verified Learning Achievement</p>
                  </div>
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    Digital Certificate
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/profile/certificates">
            <Button variant="outline" size="lg">
              View All Certificates
            </Button>
          </Link>
          <Link href="/roadmaps">
            <Button variant="outline" size="lg">
              Browse More Roadmaps
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
