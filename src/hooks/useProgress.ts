import { useCallback, useEffect, useState } from 'react'
import type { LevelResult, Progress, Stars } from '../types'
import { LEVELS } from '../data/levels'

const STORAGE_KEY = 'renard-malin-progress-v1'

function defaultProgress(): Progress {
  return {
    levelStars: {},
    unlockedBadges: [],
    lastPlayedDate: null,
    streak: 0,
    totalCorrect: 0,
    totalQuestions: 0,
  }
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw)
    return { ...defaultProgress(), ...parsed }
  } catch {
    return defaultProgress()
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function computeStars(correct: number, total: number): Stars {
  if (total === 0) return 0
  const ratio = correct / total
  if (ratio >= 0.9) return 3
  if (ratio >= 0.7) return 2
  if (ratio >= 0.5) return 1
  return 0
}

function updateStreak(progress: Progress): { streak: number; newBadgeIds: string[] } {
  const today = todayKey()
  const newBadgeIds: string[] = []

  if (progress.lastPlayedDate === today) {
    return { streak: progress.streak, newBadgeIds }
  }

  let streak = 1
  if (progress.lastPlayedDate) {
    const last = new Date(progress.lastPlayedDate)
    const diffDays = Math.round((new Date(today).getTime() - last.getTime()) / 86400000)
    streak = diffDays === 1 ? progress.streak + 1 : 1
  }

  if (streak >= 3) newBadgeIds.push('streak-3')
  if (streak >= 7) newBadgeIds.push('streak-7')

  return { streak, newBadgeIds }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Storage unavailable (e.g. private browsing) — progress just won't persist.
    }
  }, [progress])

  const isLevelUnlocked = useCallback(
    (levelId: number) => {
      if (levelId <= 1) return true
      const prevStars = progress.levelStars[levelId - 1]
      return typeof prevStars === 'number' && prevStars >= 1
    },
    [progress.levelStars],
  )

  const recordLevelResult = useCallback(
    (levelId: number, correct: number, total: number, durationSec: number): LevelResult => {
      const prev = progress
      const stars = computeStars(correct, total)
      const newBadgeIds: string[] = []

      const prevStars = prev.levelStars[levelId] ?? 0
      const isNewBest = stars > prevStars
      const levelStars = { ...prev.levelStars, [levelId]: Math.max(prevStars, stars) as Stars }

      if (stars >= 1) {
        const badgeId = `level-${levelId}`
        if (!prev.unlockedBadges.includes(badgeId)) newBadgeIds.push(badgeId)
      }
      if (correct === total && total > 0 && !prev.unlockedBadges.includes('perfect')) {
        newBadgeIds.push('perfect')
      }
      if (stars === 3 && durationSec > 0 && durationSec / total <= 4 && !prev.unlockedBadges.includes('speedy')) {
        newBadgeIds.push('speedy')
      }
      if (
        LEVELS.every((l) => (levelStars[l.id] ?? 0) === 3) &&
        !prev.unlockedBadges.includes('all-stars')
      ) {
        newBadgeIds.push('all-stars')
      }

      const { streak, newBadgeIds: streakBadges } = updateStreak(prev)
      for (const b of streakBadges) {
        if (!prev.unlockedBadges.includes(b) && !newBadgeIds.includes(b)) newBadgeIds.push(b)
      }

      setProgress({
        ...prev,
        levelStars,
        unlockedBadges: [...prev.unlockedBadges, ...newBadgeIds],
        lastPlayedDate: todayKey(),
        streak,
        totalCorrect: prev.totalCorrect + correct,
        totalQuestions: prev.totalQuestions + total,
      })

      return { levelId, correct, total, stars, durationSec, isNewBest, newBadgeIds }
    },
    [progress],
  )

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress())
  }, [])

  return { progress, isLevelUnlocked, recordLevelResult, resetProgress }
}
