import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Mail } from "lucide-react"

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">Last Updated: January 11, 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to DSA Patterns ("we," "our," or "us"). We are committed to protecting your privacy and ensuring a safe learning experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-2">When you create an account, we collect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li><strong>Name:</strong> Your full name for profile identification</li>
                  <li><strong>Email Address:</strong> Used for account access and communication</li>
                  <li><strong>Password:</strong> Securely hashed and stored (never in plain text)</li>
                  <li><strong>Profile Info:</strong> Avatar, bio, college, skills (optional)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
                <p className="text-muted-foreground mb-2">We automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Learning progress and quiz scores</li>
                  <li>Activity data and login times</li>
                  <li>Device and browser information</li>
                  <li>Cookies for session management</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              How We Use Your Information
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Provide Services:</strong> Deliver core features and track progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Improve Platform:</strong> Analyze usage to enhance experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Communication:</strong> Send important account updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Security:</strong> Detect fraud and unauthorized access</span>
              </li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              Data Security
            </h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security practices to protect your data:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Password Protection</h4>
                <p className="text-sm text-muted-foreground">Hashed using bcrypt (10 rounds)</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Secure Cookies</h4>
                <p className="text-sm text-muted-foreground">httpOnly with SameSite protection</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">HTTPS Encryption</h4>
                <p className="text-sm text-muted-foreground">All data over SSL/TLS</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Database Security</h4>
                <p className="text-sm text-muted-foreground">MongoDB with encryption at rest</p>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-900">
            <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
            <p className="font-semibold text-lg mb-3">We DO NOT sell your personal information to third parties.</p>
            <p className="text-muted-foreground mb-2">We may share information only for:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Service providers (Cloudinary, MongoDB Atlas)</li>
              <li>Legal requirements or to protect our rights</li>
              <li>Business transfer (merger, acquisition)</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Rights and Choices</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-primary font-bold">1.</span>
                <div>
                  <h4 className="font-semibold">Access</h4>
                  <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-primary font-bold">2.</span>
                <div>
                  <h4 className="font-semibold">Update</h4>
                  <p className="text-sm text-muted-foreground">Modify your profile information anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-primary font-bold">3.</span>
                <div>
                  <h4 className="font-semibold">Delete</h4>
                  <p className="text-sm text-muted-foreground">Request account deletion (removed within 30 days)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-primary font-bold">4.</span>
                <div>
                  <h4 className="font-semibold">Export</h4>
                  <p className="text-sm text-muted-foreground">Download your notes and progress data</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Contact Us
            </h2>
            <p className="text-muted-foreground mb-4">
              For privacy-related questions or concerns:
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold">Email: <a href="mailto:sainidaskh70@gmail.com" className="text-primary hover:underline">sainidaskh70@gmail.com</a></p>
              <p className="text-sm text-muted-foreground mt-1">Platform: DSA Patterns</p>
              <p className="text-sm text-muted-foreground">Developer: Daskh Saini</p>
            </div>
          </section>

          {/* Consent */}
          <section className="border-t pt-6">
            <h2 className="text-xl font-bold mb-3">Your Consent</h2>
            <p className="text-muted-foreground">
              By using DSA Patterns, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
          </section>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024-2026 DSA Patterns Platform. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  )
}
