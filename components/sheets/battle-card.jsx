'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export default function BattleCard({ sheet, featured = false }) {
  const [flipped, setFlipped] = useState(false)

  const getDifficultyColor = () => {
    if (sheet.difficulty === 'All Levels') return 'from-green-500 to-emerald-600'
    return 'from-blue-500 to-indigo-600'
  }

  const getTopics = () => {
    const topicMap = {
      'Blind 75': ['Arrays', 'Two Pointers', 'Stack', 'Binary Search', 'Sliding Window', 'DP', 'Graphs', 'Trees'],
      'NeetCode 150': ['All Patterns', 'Extended Coverage', 'Video Solutions', 'Interview Focus'],
      'Striver A2Z DSA': ['Complete DSA', 'Basics to Advanced', 'All Topics', 'Comprehensive'],
      'Grind 169': ['169 Problems', 'All Patterns', 'Interview Ready', 'Time Efficient'],
      'LeetCode Top 100': ['Most Popular', 'High Quality', 'Interview Focus', 'Community Tested'],
      'AlgoExpert 160': ['Video Explanations', 'Detailed Solutions', 'All Difficulties', 'Platform Access'],
      'Love Babbar 450': ['Complete DSA', 'Topic-wise', 'Indian Focus', 'Comprehensive']
    }
    return topicMap[sheet.name] || ['Core Patterns', 'Interview Prep', 'Problem Solving']
  }

  return (
    <div
      className={`relative group ${featured ? 'md:col-span-1' : ''}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`relative h-full transition-all duration-300 ${
        flipped ? 'scale-105' : 'scale-100'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyColor()} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>

        <div className={`relative bg-white rounded-2xl border-4 ${
          featured ? 'border-yellow-400' : 'border-gray-200'
        } group-hover:border-purple-400 transition-all shadow-lg overflow-hidden h-full`}>

          {featured && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
              FEATURED
            </div>
          )}

          <div className={`bg-gradient-to-br ${getDifficultyColor()} p-6 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">{sheet.name}</h3>
            </div>
            <p className="text-sm opacity-90">{sheet.count} problems</p>
          </div>

          <div className="p-6">
            {!flipped ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">STATS</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Problems:</span>
                      <span className="font-semibold">{sheet.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-semibold">{sheet.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Time:</span>
                      <span className="font-semibold">
                        {sheet.count < 100 ? '2-3 weeks' : sheet.count < 200 ? '1-3 months' : '6-8 months'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 pt-4 border-t">
                  <div className="text-sm font-medium text-gray-600 mb-2">DIFFICULTY SPLIT</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">🟢 Easy</span>
                        <span className="font-medium">~33%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-1/3"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">🟡 Medium</span>
                        <span className="font-medium">~50%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-1/2"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">🔴 Hard</span>
                        <span className="font-medium">~17%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500 mb-4">
                  Hover to see topics covered
                </p>
              </>
            ) : (
              <div className="py-4">
                <div className="text-sm font-medium text-gray-600 mb-3">TOPICS COVERED</div>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {getTopics().map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-900 font-medium mb-1">✅ Best For:</p>
                  <p className="text-xs text-blue-800">{sheet.description}</p>
                </div>
              </div>
            )}

            <a
              href={sheet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all text-center group/btn"
            >
              <span className="flex items-center justify-center gap-2">
                Commit to This Sheet
                <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
