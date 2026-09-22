import { LEVELS } from '../data/levels'
import type { ChallengeType, Level, Progress, Stars } from '../types'
import { challengeKey } from './progressKeys'

export function getChallengeStars(progress: Progress, levelId: number, type: ChallengeType): Stars {
  return (progress.challengeStars[challengeKey(levelId, type)] ?? 0) as Stars
}

export function getLevelStars(progress: Progress, level: Level): { earned: number; max: number } {
  const max = level.challenges.length * 3
  const earned = level.challenges.reduce((sum, type) => sum + getChallengeStars(progress, level.id, type), 0)
  return { earned, max }
}

export function getTotalStars(progress: Progress): { earned: number; max: number } {
  return LEVELS.reduce(
    (acc, level) => {
      const { earned, max } = getLevelStars(progress, level)
      return { earned: acc.earned + earned, max: acc.max + max }
    },
    { earned: 0, max: 0 },
  )
}
