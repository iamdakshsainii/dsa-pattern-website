'use client'

import { useState, useRef } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import HeroSection from '@/components/sheets/hero-section'
import SheetQuizModal from '@/components/sheets/sheet-quiz-modal'
import FeaturedSection from '@/components/sheets/featured-section'
import FilterBar from '@/components/sheets/filter-bar'
import BattleCard from '@/components/sheets/battle-card'
import ComparisonTable from '@/components/sheets/comparison-table'

export default function SheetsPage() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [filters, setFilters] = useState({ timeline: 'all', goal: 'all', level: 'all' })

  const comparisonRef = useRef(null)
  const filterRef = useRef(null)

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

  const filterSheets = (sheets) => {
    return sheets.filter(sheet => {
      if (filters.timeline !== 'all') {
        if (filters.timeline === 'short' && sheet.count >= 100) return false
        if (filters.timeline === 'medium' && (sheet.count < 100 || sheet.count > 200)) return false
        if (filters.timeline === 'long' && sheet.count < 200) return false
      }

      if (filters.goal !== 'all') {
        if (filters.goal === 'interview' && sheet.count > 200) return false
        if (filters.goal === 'learning' && sheet.count < 200) return false
      }

      if (filters.level !== 'all') {
        if (filters.level === 'beginner' && sheet.count > 150) return false
        if (filters.level === 'advanced' && sheet.count < 150) return false
      }

      return true
    })
  }

  const filteredSheets = filterSheets(sheets)

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFilter = () => {
    filterRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Curated DSA Sheets</h1>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-7xl mx-auto">
        <HeroSection
          onQuizClick={() => setQuizOpen(true)}
          onCompareClick={scrollToComparison}
          onFilterClick={scrollToFilter}
        />

        <FeaturedSection sheets={sheets} />

        <div ref={filterRef}>
          <FilterBar
            onFilterChange={setFilters}
            matchCount={filteredSheets.length}
            totalCount={sheets.length}
          />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Sheets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSheets.map(sheet => (
              <BattleCard key={sheet.name} sheet={sheet} />
            ))}
          </div>

          {filteredSheets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No sheets match your filters</p>
              <button
                onClick={() => setFilters({ timeline: 'all', goal: 'all', level: 'all' })}
                className="text-purple-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div ref={comparisonRef}>
          <ComparisonTable sheets={sheets} />
        </div>
      </main>

      <SheetQuizModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        sheets={sheets}
      />
    </div>
  )
}
