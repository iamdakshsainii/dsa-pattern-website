import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, BookMarked } from "lucide-react"

export default function SheetsPage() {
  const sheets = [
    {
      name: "Blind 75",
      description: "75 must-do LeetCode problems curated by a Facebook engineer",
      count: 75,
      difficulty: "Mixed",
      color: "bg-blue-500",
      url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    },
    {
      name: "NeetCode 150",
      description: "Extended version with 150 essential coding interview problems",
      count: 150,
      difficulty: "Mixed",
      color: "bg-purple-500",
      url: "https://neetcode.io/practice",
    },
    {
      name: "Striver A2Z DSA",
      description: "Complete DSA sheet covering all topics from basics to advanced",
      count: 450,
      difficulty: "All Levels",
      color: "bg-green-500",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
    },
    {
      name: "Grind 169",
      description: "169 questions covering all patterns for tech interviews",
      count: 169,
      difficulty: "Mixed",
      color: "bg-orange-500",
      url: "https://www.techinterviewhandbook.org/grind75",
    },
    {
      name: "LeetCode Top 100",
      description: "Most liked and frequently asked interview questions",
      count: 100,
      difficulty: "Mixed",
      color: "bg-yellow-500",
      url: "https://leetcode.com/studyplan/top-100-liked/",
    },
    {
      name: "AlgoExpert 160",
      description: "Hand-picked questions from AlgoExpert platform",
      count: 160,
      difficulty: "All Levels",
      color: "bg-red-500",
      url: "https://www.algoexpert.io/product",
    },
    {
      name: "Love Babbar 450",
      description: "Comprehensive DSA sheet with 450 questions",
      count: 450,
      difficulty: "All Levels",
      color: "bg-pink-500",
      url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Curated Problem Sheets</h1>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Popular Problem Collections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore {sheets.length} carefully curated sheets from top engineers and educators
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sheets.map((sheet, index) => (
            <Card key={index} className="group p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-1 h-16 ${sheet.color} rounded-full`}></div>
                <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {sheet.count} problems
                </Badge>
              </div>

              <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                {sheet.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                {sheet.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge variant="outline">{sheet.difficulty}</Badge>
                <a href={sheet.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View Sheet
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
