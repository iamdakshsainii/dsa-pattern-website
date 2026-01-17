// lib/filter-utils.js

// Utility functions for filtering questions
export function filterQuestions(questions, filters, userProgress = {}) {
  return questions.filter(question => {
    // IMPORTANT: Exclude additional problems from main filtering
    if (question.isAdditional) return false

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'All') {
      if (question.difficulty !== filters.difficulty) return false
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      const isCompleted = userProgress.completed?.includes(question._id)
      const isInProgress = userProgress.inProgress?.includes(question._id)

      if (filters.status === 'Solved' && !isCompleted) return false
      if (filters.status === 'Todo' && (isCompleted || isInProgress)) return false
      if (filters.status === 'Attempted' && !isInProgress) return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const titleMatch = question.title?.toLowerCase().includes(searchLower)
      const tagsMatch = question.tags?.some(tag =>
        tag.toLowerCase().includes(searchLower)
      )
      if (!titleMatch && !tagsMatch) return false
    }

    // Company filter
    if (filters.company && filters.company !== 'All') {
      if (!question.companies?.includes(filters.company)) return false
    }

    // Tag filter
    if (filters.tag && filters.tag !== 'All') {
      if (!question.tags?.includes(filters.tag)) return false
    }

    return true
  })
}

/**
 * Sort questions based on criteria
 */
export function sortQuestions(questions, sortBy, userProgress = {}) {
  const sorted = [...questions]

  switch (sortBy) {
    case 'Difficulty':
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 }
      return sorted.sort((a, b) =>
        difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      )

    case 'Title':
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title)
      )

    case 'Status':
      return sorted.sort((a, b) => {
        const aCompleted = userProgress.completed?.includes(a._id)
        const bCompleted = userProgress.completed?.includes(b._id)
        if (aCompleted === bCompleted) return 0
        return aCompleted ? 1 : -1
      })

    case 'Default':
    default:
      return sorted.sort((a, b) => (a.order || 0) - (b.order || 0))
  }
}

/**
 * Get all unique companies from questions
 */
export function getUniqueCompanies(questions) {
  const companies = new Set()
  // Only get companies from core problems
  questions.filter(q => !q.isAdditional).forEach(q => {
    q.companies?.forEach(c => companies.add(c))
  })
  return Array.from(companies).sort()
}

/**
 * Get all unique tags from questions
 */
export function getUniqueTags(questions) {
  const tags = new Set()
  // Only get tags from core problems
  questions.filter(q => !q.isAdditional).forEach(q => {
    q.tags?.forEach(t => tags.add(t))
  })
  return Array.from(tags).sort()
}

/**
 * Get statistics for filtered questions
 */
export function getFilterStats(questions, userProgress = {}) {
  // IMPORTANT: Only count core problems (exclude additional)
  const coreQuestions = questions.filter(q => !q.isAdditional)

  const total = coreQuestions.length
  const completed = coreQuestions.filter(q =>
    userProgress.completed?.includes(q._id)
  ).length

  const byDifficulty = {
    Easy: coreQuestions.filter(q => q.difficulty === 'Easy').length,
    Medium: coreQuestions.filter(q => q.difficulty === 'Medium').length,
    Hard: coreQuestions.filter(q => q.difficulty === 'Hard').length
  }

  const completedByDifficulty = {
    Easy: coreQuestions.filter(q =>
      q.difficulty === 'Easy' && userProgress.completed?.includes(q._id)
    ).length,
    Medium: coreQuestions.filter(q =>
      q.difficulty === 'Medium' && userProgress.completed?.includes(q._id)
    ).length,
    Hard: coreQuestions.filter(q =>
      q.difficulty === 'Hard' && userProgress.completed?.includes(q._id)
    ).length
  }

  return {
    total,
    completed,
    remaining: total - completed,
    byDifficulty,
    completedByDifficulty,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}
