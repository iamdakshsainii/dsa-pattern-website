'use client'

import { User } from 'lucide-react'

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl'
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-12 w-12'
}

export default function ProfileAvatar({ src, name, size = 'md', className = '' }) {
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const getColorFromName = (name) => {
    if (!name) return 'bg-gray-500'

    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ]

    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    return colors[Math.abs(hash) % colors.length]
  }

  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 ${className}`}>
        <img
          src={src}
          alt={name || 'Profile'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div
          className={`w-full h-full ${getColorFromName(name)} flex items-center justify-center text-white font-semibold hidden`}
        >
          {getInitials(name)}
        </div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getColorFromName(name)} flex items-center justify-center text-white font-semibold border-2 border-gray-200 dark:border-gray-700 ${className}`}>
      {name ? getInitials(name) : <User className={iconSizes[size]} />}
    </div>
  )
}
