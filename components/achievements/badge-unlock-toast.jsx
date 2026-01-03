'use client'

import { useEffect, useState } from 'react'
import { Trophy, X } from 'lucide-react'
import { getBadgeById } from '@/lib/achievements/badge-definitions'
import { getBadgeColor } from '@/lib/achievements/badge-checker'

export default function BadgeUnlockToast({ badge, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  const badgeData = getBadgeById(badge.id) || badge

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${getBadgeColor(badgeData.color)} rounded-lg shadow-2xl border-2 p-4 min-w-[320px] max-w-md relative animate-bounce`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-3xl">
            {badgeData.icon}
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Achievement Unlocked!
              </span>
            </div>
            <h4 className="font-bold text-lg mb-1">{badgeData.name}</h4>
            <p className="text-sm opacity-90">{badgeData.description}</p>
          </div>
        </div>

        {/* Sparkle animation */}
        <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
      </div>
    </div>
  )
}

// Toast Manager Component
export function BadgeToastManager() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleBadgeUnlock = (event) => {
      const { badge } = event.detail
      setToasts(prev => [...prev, { ...badge, id: Date.now() }])
    }

    window.addEventListener('badge-unlocked', handleBadgeUnlock)
    return () => window.removeEventListener('badge-unlocked', handleBadgeUnlock)
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      {toasts.map((toast) => (
        <BadgeUnlockToast
          key={toast.id}
          badge={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}
