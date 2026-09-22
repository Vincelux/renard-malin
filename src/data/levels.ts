import type { ChallengeType, Level } from '../types'

const CHAPTER_META: { table: number; name: string; emoji: string }[] = [
  { table: 1, name: 'Le Renardeau', emoji: '🦊' },
  { table: 2, name: 'Le Petit Explorateur', emoji: '🐾' },
  { table: 3, name: 'Le Renard Curieux', emoji: '🍂' },
  { table: 4, name: 'Le Renard Agile', emoji: '🍃' },
  { table: 5, name: 'Le Renard Malin', emoji: '🌾' },
  { table: 6, name: 'Le Renard Astucieux', emoji: '🌰' },
  { table: 7, name: 'Le Renard Rusé', emoji: '🍁' },
  { table: 8, name: 'Le Renard Sauvage', emoji: '🌲' },
  { table: 9, name: 'Le Renard Sage', emoji: '🌙' },
  { table: 10, name: 'Le Renard Éclair', emoji: '⚡' },
  { table: 11, name: 'Le Renard Mystique', emoji: '✨' },
  { table: 12, name: 'Le Grand Maître Renard', emoji: '👑' },
]

const CHAPTER_CHALLENGES: ChallengeType[] = ['quiz', 'missing-factor', 'chrono']
const CHAPTER_QUESTION_COUNT = 10

export const CHRONO_TIME_SEC = 60

export const LEVELS: Level[] = [
  ...CHAPTER_META.map(
    (meta, i): Level => ({
      id: i + 1,
      name: meta.name,
      subtitle: `Table de ${meta.table}`,
      tables: [meta.table],
      emoji: meta.emoji,
      challenges: CHAPTER_CHALLENGES,
      questionCount: CHAPTER_QUESTION_COUNT,
    }),
  ),
  {
    id: 13,
    name: 'Le Grand Mélange',
    subtitle: 'Révision des tables de 1 à 10',
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    emoji: '🎲',
    challenges: ['quiz'],
    questionCount: 15,
  },
  {
    id: 14,
    name: 'Le Duel des Nombres',
    subtitle: 'Toutes les tables, questions classiques et facteurs manquants',
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    emoji: '⚔️',
    challenges: ['mixed'],
    questionCount: 15,
  },
  {
    id: 15,
    name: 'Le Défi Suprême',
    subtitle: 'Toutes les tables, le grand final',
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    emoji: '🏆',
    challenges: ['mixed', 'chrono'],
    questionCount: 20,
  },
]

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id)
}

export function challengeLabel(type: ChallengeType): string {
  switch (type) {
    case 'quiz':
      return 'Quiz'
    case 'missing-factor':
      return 'Facteur manquant'
    case 'mixed':
      return 'Défi mixte'
    case 'chrono':
      return 'Chrono'
  }
}

export function challengeEmoji(type: ChallengeType): string {
  switch (type) {
    case 'quiz':
      return '📝'
    case 'missing-factor':
      return '🔍'
    case 'mixed':
      return '🎯'
    case 'chrono':
      return '⏱️'
  }
}

export function getNextChallenge(levelId: number, type: ChallengeType): { levelId: number; type: ChallengeType } | null {
  const level = getLevel(levelId)
  if (!level) return null

  const idx = level.challenges.indexOf(type)
  if (idx < level.challenges.length - 1) {
    return { levelId, type: level.challenges[idx + 1] }
  }

  const nextLevel = getLevel(levelId + 1)
  if (!nextLevel) return null
  return { levelId: nextLevel.id, type: nextLevel.challenges[0] }
}
