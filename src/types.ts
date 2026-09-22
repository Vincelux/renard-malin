export interface Level {
  id: number
  name: string
  subtitle: string
  tables: number[]
  emoji: string
}

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
}

export interface Question {
  a: number
  b: number
  answer: number
}

export type Stars = 0 | 1 | 2 | 3

export interface LevelResult {
  levelId: number
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
  levelStars: Record<number, Stars>
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

export type Screen = 'profiles' | 'home' | 'levels' | 'quiz' | 'results' | 'rewards'
