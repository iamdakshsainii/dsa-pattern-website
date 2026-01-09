'use client'

import { useEffect, useState } from 'react'
import { X, Flame } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function StreakPopup({ streak, longestStreak, onClose }) {
  const [show, setShow] = useState(false)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
    setTimeout(() => setConfetti(true), 300)

    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  const nextMilestone = [7, 14, 30, 60, 90, 180, 365].find(m => m > streak) || 365

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup Card */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <Card className="w-[400px] p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-300 dark:border-orange-700 shadow-2xl relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Animated Flame Icon */}
          <div className="flex justify-center mb-4">
            <div className={`transition-all duration-500 ${confetti ? 'scale-110 rotate-12' : 'scale-100'}`}>
              <Flame className="w-20 h-20 text-orange-500 animate-pulse" />
            </div>
          </div>

          {/* Streak Count */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              🔥 {streak} Day Streak!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Keep the momentum going!
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{streak} days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{longestStreak} days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Next Milestone</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{nextMilestone} days</span>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>{streak} days</span>
              <span>{nextMilestone} days</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(streak / nextMilestone) * 100}%` }}
              />
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {streak >= 7 ? '🎉 Amazing consistency!' : '💪 Keep it up!'}
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleClose}
            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            Continue Learning
          </Button>
        </Card>
      </div>

      {/* Confetti Effect (CSS) */}
      {confetti && (
        <style jsx>{`
          @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
          }
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: #f97316;
            animation: confetti-fall 3s linear;
            z-index: 49;
          }
        `}</style>
      )}
    </>
  )
}
