import { useCallback, useEffect, useState } from 'react'
import type { ChallengeResult, ChallengeType, Progress, Stars } from '../types'
import { LEVELS, getLevel } from '../data/levels'
import { challengeKey } from '../utils/progressKeys'

const STORAGE_PREFIX = 'renard-malin-progress-v1'

function defaultProgress(): Progress {
  return {
    challengeStars: {},
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

function computeChronoStars(correct: number): Stars {
  if (correct >= 15) return 3
  if (correct >= 10) return 2
  if (correct >= 6) return 1
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
      const prevLevel = getLevel(levelId - 1)
      if (!prevLevel) return false
      return prevLevel.challenges.every(
        (type) => (progress.challengeStars[challengeKey(prevLevel.id, type)] ?? 0) >= 1,
      )
    },
    [progress.challengeStars],
  )

  const isChallengeUnlocked = useCallback(
    (levelId: number, type: ChallengeType) => {
      if (!isLevelUnlocked(levelId)) return false
      const level = getLevel(levelId)
      if (!level) return false
      const idx = level.challenges.indexOf(type)
      if (idx <= 0) return true
      const prevType = level.challenges[idx - 1]
      return (progress.challengeStars[challengeKey(levelId, prevType)] ?? 0) >= 1
    },
    [isLevelUnlocked, progress.challengeStars],
  )

  const recordChallengeResult = useCallback(
    (
      levelId: number,
      type: ChallengeType,
      correct: number,
      total: number,
      durationSec: number,
      score: number,
      hintsUsed: number,
      revealsUsed: number,
    ): ChallengeResult => {
      const prev = progress
      const maxScore = total * 3
      const stars = type === 'chrono' ? computeChronoStars(correct) : computeStars(score, maxScore)
      const newBadgeIds: string[] = []
      const key = challengeKey(levelId, type)

      const prevStars = prev.challengeStars[key] ?? 0
      const isNewBest = stars > prevStars
      const challengeStars = { ...prev.challengeStars, [key]: Math.max(prevStars, stars) as Stars }

      const level = getLevel(levelId)
      const chapterComplete = level
        ? level.challenges.every((t) => (challengeStars[challengeKey(levelId, t)] ?? 0) >= 1)
        : false
      if (chapterComplete && levelId <= 12 && !prev.unlockedBadges.includes(`chapter-${levelId}`)) {
        newBadgeIds.push(`chapter-${levelId}`)
      }

      if (type !== 'chrono' && score === maxScore && total > 0 && !prev.unlockedBadges.includes('perfect')) {
        newBadgeIds.push('perfect')
      }

      if (type === 'chrono' && stars === 3) {
        if (!prev.unlockedBadges.includes('speedy')) newBadgeIds.push('speedy')

        const chronoLevels = LEVELS.filter((l) => l.challenges.includes('chrono'))
        const allChronoMastered = chronoLevels.every((l) => (challengeStars[challengeKey(l.id, 'chrono')] ?? 0) === 3)
        if (allChronoMastered && !prev.unlockedBadges.includes('chrono-master')) {
          newBadgeIds.push('chrono-master')
        }
      }

      const level15 = getLevel(15)
      if (
        level15 &&
        level15.challenges.every((t) => (challengeStars[challengeKey(15, t)] ?? 0) === 3) &&
        !prev.unlockedBadges.includes('boss')
      ) {
        newBadgeIds.push('boss')
      }

      const allMastered = LEVELS.every((l) => l.challenges.every((t) => (challengeStars[challengeKey(l.id, t)] ?? 0) === 3))
      if (allMastered && !prev.unlockedBadges.includes('all-stars')) {
        newBadgeIds.push('all-stars')
      }

      const { streak, newBadgeIds: streakBadges } = updateStreak(prev)
      for (const b of streakBadges) {
        if (!prev.unlockedBadges.includes(b) && !newBadgeIds.includes(b)) newBadgeIds.push(b)
      }

      setProgress({
        ...prev,
        challengeStars,
        unlockedBadges: [...prev.unlockedBadges, ...newBadgeIds],
        lastPlayedDate: todayKey(),
        streak,
        totalCorrect: prev.totalCorrect + correct,
        totalQuestions: prev.totalQuestions + total,
      })

      return {
        levelId,
        type,
        correct,
        total,
        score,
        maxScore,
        hintsUsed,
        revealsUsed,
        stars,
        durationSec,
        isNewBest,
        newBadgeIds,
      }
    },
    [progress],
  )

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress())
  }, [])

  return { progress, isLevelUnlocked, isChallengeUnlocked, recordChallengeResult, resetProgress }
}
