export type ChallengeType = 'quiz' | 'missing-factor' | 'mixed' | 'chrono'

export interface Level {
  id: number
  name: string
  subtitle: string
  tables: number[]
  emoji: string
  challenges: ChallengeType[]
  questionCount: number
}

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
}

export interface Question {
  prompt: string
  answer: number
  hint: string
}

export type Stars = 0 | 1 | 2 | 3

export interface ChallengeResult {
  levelId: number
  type: ChallengeType
  correct: number
  total: number
  score: number
  maxScore: number
  hintsUsed: number
  revealsUsed: number
  stars: Stars
  durationSec: number
  isNewBest: boolean
  newBadgeIds: string[]
}

export interface Progress {
  challengeStars: Record<string, Stars>
  unlockedBadges: string[]
  lastPlayedDate: string | null
  streak: number
  totalCorrect: number
  totalQuestions: number
}

export interface Profile {
  id: string
  name: string
  emoji: string
}

export type Screen = 'profiles' | 'home' | 'levels' | 'challenges' | 'quiz' | 'chrono' | 'results' | 'rewards'
