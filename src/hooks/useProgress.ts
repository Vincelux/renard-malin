import { useCallback, useEffect, useState } from 'react'
import type { LevelResult, Progress, Stars } from '../types'
import { LEVELS } from '../data/levels'

const STORAGE_PREFIX = 'renard-malin-progress-v1'

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

function loadProgress(profileId: string | null): Progress {
  if (!profileId) return defaultProgress()
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${profileId}`)
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

function computeStars(score: number, maxScore: number): Stars {
  if (maxScore === 0) return 0
  const ratio = score / maxScore
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

export function useProgress(profileId: string | null) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(profileId))

  useEffect(() => {
    setProgress(loadProgress(profileId))
  }, [profileId])

  useEffect(() => {
    if (!profileId) return
    try {
      localStorage.setItem(`${STORAGE_PREFIX}:${profileId}`, JSON.stringify(progress))
    } catch {
      // Storage unavailable (e.g. private browsing) — progress just won't persist.
    }
  }, [progress, profileId])

  const isLevelUnlocked = useCallback(
    (levelId: number) => {
      if (levelId <= 1) return true
      const prevStars = progress.levelStars[levelId - 1]
      return typeof prevStars === 'number' && prevStars >= 1
    },
    [progress.levelStars],
  )

  const recordLevelResult = useCallback(
    (
      levelId: number,
      correct: number,
      total: number,
      durationSec: number,
      score: number,
      hintsUsed: number,
      revealsUsed: number,
    ): LevelResult => {
      const prev = progress
      const maxScore = total * 3
      const stars = computeStars(score, maxScore)
      const newBadgeIds: string[] = []

      const prevStars = prev.levelStars[levelId] ?? 0
      const isNewBest = stars > prevStars
      const levelStars = { ...prev.levelStars, [levelId]: Math.max(prevStars, stars) as Stars }

      if (stars >= 1) {
        const badgeId = `level-${levelId}`
        if (!prev.unlockedBadges.includes(badgeId)) newBadgeIds.push(badgeId)
      }
      if (score === maxScore && total > 0 && !prev.unlockedBadges.includes('perfect')) {
        newBadgeIds.push('perfect')
      }
      if (stars === 3 && durationSec > 0 && durationSec / total <= 6 && !prev.unlockedBadges.includes('speedy')) {
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

      return { levelId, correct, total, score, maxScore, hintsUsed, revealsUsed, stars, durationSec, isNewBest, newBadgeIds }
    },
    [progress],
  )

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress())
  }, [])

  return { progress, isLevelUnlocked, recordLevelResult, resetProgress }
}
