import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, CheckCircle2, XCircle, AlertTriangle, Scale } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground mt-1">Last Updated: January 11, 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="p-8 space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using DSA Patterns ("Platform," "Service"), you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use the Platform.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              DSA Patterns is an educational platform for learning Data Structures and Algorithms. The Service includes:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Access to 22+ DSA patterns with explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>150+ curated practice problems</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Interactive roadmaps and learning paths</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Note-taking and progress tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Quiz and assessment systems</span>
              </li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Age Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>You must be at least 13 years old to use this Platform</li>
                  <li>Users between 13-18 require parental consent</li>
                  <li className="text-red-600 dark:text-red-400">Users under 13 are strictly prohibited</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* You May */}
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  You May:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Use for personal learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Take notes and track progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Share screenshots of your journey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Participate respectfully</span>
                  </li>
                </ul>
              </div>

              {/* You May NOT */}
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  You May NOT:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Copy or redistribute content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Reverse engineer the platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Use automated bots or scrapers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Harass or abuse other users</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-primary/5 p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              5. Intellectual Property Rights
            </h2>
            <p className="text-muted-foreground mb-4">
              All content on the Platform is proprietary and protected by copyright laws:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Patterns:</strong> Problem-solving patterns and explanations</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Questions:</strong> Curated problem sets and solutions</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Roadmaps:</strong> Learning paths and curriculum</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>UI/UX:</strong> Design, layout, and features</span>
              </p>
            </div>
            <div className="mt-4 p-4 bg-background rounded border">
              <p className="font-semibold">© 2024-2026 DSA Patterns Platform. All Rights Reserved.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Owned by Daskh Saini • Protected by international copyright laws
              </p>
            </div>
          </section>

          {/* Free Service */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Free Service</h2>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <h3 className="font-semibold text-lg mb-2">Current Terms</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>DSA Patterns is <strong>100% free</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>No credit card required</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>No hidden fees or charges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>All features accessible to registered users</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-900">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              7. Disclaimers
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Educational Purpose:</strong> The Platform is for educational purposes only. We do not guarantee job placement or interview success.
              </p>
              <p>
                <strong>No Warranty:</strong> THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your access immediately for:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Violation of these Terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Fraudulent or illegal activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Abuse of Platform features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Risk to Platform security</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions or concerns regarding these Terms:
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold">Email: <a href="mailto:sainidaskh70@gmail.com" className="text-primary hover:underline">sainidaskh70@gmail.com</a></p>
              <p className="text-sm text-muted-foreground mt-1">Platform: DSA Patterns</p>
              <p className="text-sm text-muted-foreground">Developer: Daskh Saini</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-6">
            <h2 className="text-xl font-bold mb-3">Acknowledgment</h2>
            <p className="text-muted-foreground mb-3">BY USING DSA PATTERNS, YOU ACKNOWLEDGE THAT:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>You have read and understood these Terms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>You agree to be bound by these Terms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>You are legally able to enter into this agreement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>You will use the Platform responsibly and ethically</span>
              </li>
            </ul>
          </section>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">© 2024-2026 DSA Patterns Platform. All Rights Reserved.</p>
          <p className="text-xs text-muted-foreground">Proprietary Software - Unauthorized use prohibited</p>
        </div>
      </div>
    </div>
  )
}
