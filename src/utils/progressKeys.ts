import type { ChallengeType } from '../types'

export function challengeKey(levelId: number, type: ChallengeType): string {
  return `${levelId}:${type}`
}
