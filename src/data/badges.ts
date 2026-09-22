import type { Badge } from '../types'
import { LEVELS } from './levels'

const CHAPTER_BADGES: Badge[] = LEVELS.filter((l) => l.id <= 12).map((l) => ({
  id: `chapter-${l.id}`,
  name: l.name,
  description: `Termine tous les défis de "${l.name}" (${l.subtitle})`,
  emoji: l.emoji,
}))

export const BADGES: Badge[] = [
  ...CHAPTER_BADGES,
  { id: 'perfect', name: 'Étoile Filante', description: 'Termine un défi avec un score parfait, sans aucune aide', emoji: '🌟' },
  { id: 'speedy', name: "Rapide comme l'éclair", description: 'Obtiens 3 étoiles à un défi Chrono', emoji: '⚡' },
  { id: 'chrono-master', name: 'Maître du Chrono', description: 'Obtiens 3 étoiles à tous les défis Chrono', emoji: '🏅' },
  { id: 'boss', name: 'Vainqueur du Défi Suprême', description: 'Termine "Le Défi Suprême" avec 3 étoiles partout', emoji: '🏆' },
  { id: 'streak-3', name: 'Petit Explorateur', description: 'Joue 3 jours de suite', emoji: '🔥' },
  { id: 'streak-7', name: 'Grand Explorateur', description: 'Joue 7 jours de suite', emoji: '🎖️' },
  { id: 'all-stars', name: 'Reine des Renards', description: 'Obtiens 3 étoiles à absolument tous les défis', emoji: '✨' },
]

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}
