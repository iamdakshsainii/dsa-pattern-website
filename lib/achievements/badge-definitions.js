// Complete badge definitions with unlock conditions
export const BADGES = {
  'first-solve': {
    id: 'first-solve',
    name: 'First Steps',
    description: 'Solved your first problem',
    icon: '🎯',
    color: 'blue',
    condition: (stats) => stats.solved >= 1
  },
  'streak-7': {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day solving streak',
    icon: '🔥',
    color: 'orange',
    condition: (stats) => stats.currentStreak >= 7
  },
  'streak-30': {
    id: 'streak-30',
    name: 'Consistency King',
    description: 'Maintained a 30-day solving streak',
    icon: '👑',
    color: 'purple',
    condition: (stats) => stats.currentStreak >= 30
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Solved 10 problems in one day',
    icon: '⚡',
    color: 'yellow',
    condition: (stats) => stats.maxProblemsInDay >= 10
  },
  'pattern-master-sliding-window': {
    id: 'pattern-master-sliding-window',
    name: 'Sliding Window Master',
    description: 'Completed all Sliding Window problems',
    icon: '🪟',
    color: 'green',
    pattern: 'sliding-window',
    condition: (stats, patternSlug) => {
      if (patternSlug !== 'sliding-window') return false
      return stats.completedByPattern?.['sliding-window'] === stats.totalByPattern?.['sliding-window']
    }
  },
  'pattern-master-two-pointers': {
    id: 'pattern-master-two-pointers',
    name: 'Two Pointers Master',
    description: 'Completed all Two Pointers problems',
    icon: '👆',
    color: 'green',
    pattern: 'two-pointers',
    condition: (stats, patternSlug) => {
      if (patternSlug !== 'two-pointers') return false
      return stats.completedByPattern?.['two-pointers'] === stats.totalByPattern?.['two-pointers']
    }
  },
  'problem-solver-50': {
    id: 'problem-solver-50',
    name: 'Problem Solver',
    description: 'Solved 50 problems',
    icon: '💯',
    color: 'indigo',
    condition: (stats) => stats.solved >= 50
  },
  'problem-solver-100': {
    id: 'problem-solver-100',
    name: 'Centurion',
    description: 'Solved 100 problems',
    icon: '🏆',
    color: 'gold',
    condition: (stats) => stats.solved >= 100
  },
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Solved a problem before 8 AM',
    icon: '🌅',
    color: 'pink',
    condition: (stats) => stats.hasEarlyMorningSolve === true
  },
  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Solved a problem after 11 PM',
    icon: '🦉',
    color: 'indigo',
    condition: (stats) => stats.hasLateNightSolve === true
  }
}

export function getAllBadges() {
  return Object.values(BADGES)
}

export function getBadgeById(badgeId) {
  return BADGES[badgeId]
}

export function checkBadgeUnlock(badgeId, stats, patternSlug = null) {
  const badge = BADGES[badgeId]
  if (!badge) return false
  return badge.condition(stats, patternSlug)
}

export function getUnlockedBadges(stats, userBadges = []) {
  const unlocked = []

  for (const badge of getAllBadges()) {
    const hasUnlocked = userBadges.some(ub => ub.badgeId === badge.id)
    if (hasUnlocked || checkBadgeUnlock(badge.id, stats, badge.pattern)) {
      unlocked.push(badge)
    }
  }

  return unlocked
}

export function getNewlyUnlockedBadges(stats, userBadges = []) {
  const newly = []

  for (const badge of getAllBadges()) {
    const alreadyHas = userBadges.some(ub => ub.badgeId === badge.id)
    const shouldUnlock = checkBadgeUnlock(badge.id, stats, badge.pattern)

    if (!alreadyHas && shouldUnlock) {
      newly.push(badge)
    }
  }

  return newly
}
