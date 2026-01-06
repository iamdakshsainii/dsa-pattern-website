const QUIZ_STORAGE_KEY = 'quiz_in_progress'
const QUIZ_RESULT_KEY = 'quiz_result'

export function saveQuizProgress(roadmapId, data) {
  if (typeof window === 'undefined') return

  try {
    const progressData = {
      roadmapId,
      currentQuestion: data.currentQuestion,
      answers: data.answers,
      timeLeft: data.timeLeft,
      startedAt: data.startedAt || Date.now(),
      lastSaved: Date.now()
    }

    sessionStorage.setItem(`${QUIZ_STORAGE_KEY}_${roadmapId}`, JSON.stringify(progressData))
    return true
  } catch (error) {
    console.error('Error saving quiz progress:', error)
    return false
  }
}

export function loadQuizProgress(roadmapId) {
  if (typeof window === 'undefined') return null

  try {
    const stored = sessionStorage.getItem(`${QUIZ_STORAGE_KEY}_${roadmapId}`)
    if (!stored) return null

    const data = JSON.parse(stored)

    if (data.roadmapId !== roadmapId) {
      clearQuizProgress(roadmapId)
      return null
    }

    const fiveMinutes = 5 * 60 * 1000
    if (Date.now() - data.lastSaved > fiveMinutes) {
      clearQuizProgress(roadmapId)
      return null
    }

    return data
  } catch (error) {
    console.error('Error loading quiz progress:', error)
    return null
  }
}

export function clearQuizProgress(roadmapId) {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem(`${QUIZ_STORAGE_KEY}_${roadmapId}`)
    return true
  } catch (error) {
    console.error('Error clearing quiz progress:', error)
    return false
  }
}

export function hasQuizProgress(roadmapId) {
  if (typeof window === 'undefined') return false

  try {
    const stored = sessionStorage.getItem(`${QUIZ_STORAGE_KEY}_${roadmapId}`)
    return !!stored
  } catch (error) {
    return false
  }
}

export function saveQuizResult(roadmapId, result) {
  if (typeof window === 'undefined') return

  try {
    const resultData = {
      roadmapId,
      score: result.score,
      percentage: result.percentage,
      passed: result.passed,
      answers: result.answers,
      timeTaken: result.timeTaken,
      attemptNumber: result.attemptNumber,
      savedAt: Date.now()
    }

    sessionStorage.setItem(`${QUIZ_RESULT_KEY}_${roadmapId}`, JSON.stringify(resultData))
    return true
  } catch (error) {
    console.error('Error saving quiz result:', error)
    return false
  }
}

export function loadQuizResult(roadmapId) {
  if (typeof window === 'undefined') return null

  try {
    const stored = sessionStorage.getItem(`${QUIZ_RESULT_KEY}_${roadmapId}`)
    if (!stored) return null

    const data = JSON.parse(stored)
    if (data.roadmapId !== roadmapId) return null

    return data
  } catch (error) {
    console.error('Error loading quiz result:', error)
    return null
  }
}

export function clearQuizResult(roadmapId) {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem(`${QUIZ_RESULT_KEY}_${roadmapId}`)
    return true
  } catch (error) {
    console.error('Error clearing quiz result:', error)
    return false
  }
}
