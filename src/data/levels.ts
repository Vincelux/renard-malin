import type { Level } from '../types'

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Le Renardeau',
    subtitle: 'Tables de 1, 2 et 10',
    tables: [1, 2, 10],
    emoji: '🦊',
  },
  {
    id: 2,
    name: 'Le Renard Curieux',
    subtitle: 'Tables de 3, 4 et 5',
    tables: [3, 4, 5],
    emoji: '🐾',
  },
  {
    id: 3,
    name: 'Le Renard Astucieux',
    subtitle: 'Tables de 6 et 7',
    tables: [6, 7],
    emoji: '🍂',
  },
  {
    id: 4,
    name: 'Le Renard Rusé',
    subtitle: 'Tables de 8 et 9',
    tables: [8, 9],
    emoji: '🌰',
  },
  {
    id: 5,
    name: 'Le Grand Maître Renard',
    subtitle: 'Tables de 11, 12 et révision complète',
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    emoji: '👑',
  },
]

export const QUESTIONS_PER_LEVEL = 10

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id)
}
