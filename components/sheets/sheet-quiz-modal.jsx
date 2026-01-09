'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function SheetQuizModal({ isOpen, onClose, sheets }) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const questions = [
    {
      id: 'timeline',
      text: 'When do you need to be interview-ready?',
      options: [
        { value: 'urgent', label: '2-4 weeks (urgent)', weight: { 'blind-75': 3, 'leetcode-top-100': 3 } },
        { value: 'planned', label: '1-3 months (planned)', weight: { 'neetcode-150': 3, 'grind-169': 3 } },
        { value: 'learning', label: '6+ months (learning)', weight: { 'striver-a2z': 3, 'love-babbar-450': 3 } }
      ]
    },
    {
      id: 'level',
      text: 'Your current DSA level?',
      options: [
        { value: 'beginner', label: 'Beginner (< 50 problems)', weight: { 'blind-75': 2, 'love-babbar-450': 3 } },
        { value: 'intermediate', label: 'Intermediate (50-200)', weight: { 'neetcode-150': 3, 'grind-169': 2 } },
        { value: 'advanced', label: 'Advanced (200+)', weight: { 'striver-a2z': 3, 'algoexpert-160': 2 } }
      ]
    },
    {
      id: 'style',
      text: 'Your learning style?',
      options: [
        { value: 'fast', label: 'Fast & focused (core patterns)', weight: { 'blind-75': 3, 'leetcode-top-100': 2 } },
        { value: 'comprehensive', label: 'Comprehensive (deep understanding)', weight: { 'striver-a2z': 3, 'neetcode-150': 2 } },
        { value: 'video', label: 'Video explanations preferred', weight: { 'neetcode-150': 3, 'striver-a2z': 2 } }
      ]
    }
  ]

  const handleAnswer = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option }
    setAnswers(newAnswers)

    if (step < 3) {
      setStep(step + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = (finalAnswers) => {
    const scores = {}

    Object.values(finalAnswers).forEach(answer => {
      Object.entries(answer.weight).forEach(([sheetSlug, points]) => {
        scores[sheetSlug] = (scores[sheetSlug] || 0) + points
      })
    })

    const topSheet = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0]

    const recommended = sheets.find(s => {
      const slug = s.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
      return slug.includes(topSheet[0].split('-')[0])
    })

    setResult(recommended || sheets[0])
  }

  const reset = () => {
    setStep(1)
    setAnswers({})
    setResult(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">🎯 Find Your Perfect Sheet</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i <= step ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Question {step} of 3</p>
              </div>

              <h3 className="text-xl font-semibold mb-6">
                {questions[step - 1].text}
              </h3>

              <div className="space-y-3">
                {questions[step - 1].options.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[step - 1].id, option)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-left font-medium"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2">
                {result.name} is your best fit!
              </h3>
              <p className="text-gray-600 mb-6">
                Based on your answers, this sheet matches your goals and timeline.
              </p>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6 text-left">
                <p className="font-semibold mb-2">⚠️ Commitment Check:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Complete all {result.count} problems</li>
                  <li>✓ Don't switch sheets mid-way</li>
                  <li>✓ Stick to your timeline</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                >
                  Start {result.name} →
                </a>
                <button
                  onClick={reset}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
