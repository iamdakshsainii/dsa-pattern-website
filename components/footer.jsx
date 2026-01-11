import Link from "next/link"
import {
  Heart,
  Mail,
  Github,
  Linkedin,
  Instagram,
  Code2,
  BookOpen,
  Target,
  Trophy,
  Brain,
  Sparkles
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      {/* Main Footer Content */}
      <div className="container px-4 py-8 md:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                  <Brain className="h-4 w-4" />
                </div>
                <span className="font-bold text-base">DSA Patterns</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Master Data Structures & Algorithms through pattern-based learning. Built by students, for students.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                <span>Made with love for learners</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                LEARN
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/patterns"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <Code2 className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    All Patterns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmaps"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <Target className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    Roadmaps
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sheets"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <BookOpen className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    Practice Sheets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interview-prep"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <Trophy className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    Interview Prep
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                ACCOUNT
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bookmarks"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/notes"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Your Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                CONNECT
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:sainidaskh70@gmail.com"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact Support
                  </a>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Community
                  </Link>
                </li>
              </ul>

              {/* Social Links */}
              <div className="pt-1">
                <p className="text-[10px] text-muted-foreground mb-2 font-medium">Follow the developer</p>
                <div className="flex gap-2">
                  <a
                    href="https://github.com/iamdakshsainii"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/daskh-saini"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://instagram.com/iamdakshsainii"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/30">
        <div className="container px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">

              {/* Copyright */}
              <div className="text-xs text-muted-foreground">
                © {currentYear} DSA Patterns Platform. All rights reserved.
                <span className="hidden md:inline mx-2">•</span>
                <span className="block md:inline mt-1 md:mt-0">
                  Built with <Heart className="h-3 w-3 text-red-500 fill-red-500 inline mx-0.5" /> by Daskh Saini
                </span>
              </div>

              {/* Legal Links */}
              <div className="flex gap-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
