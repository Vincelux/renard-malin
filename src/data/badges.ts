import type { Badge } from '../types'

export const BADGES: Badge[] = [
  { id: 'level-1', name: 'Bébé Renard', description: 'Termine "Le Renardeau"', emoji: '🦊' },
  { id: 'level-2', name: 'Renard Curieux', description: 'Termine "Le Renard Curieux"', emoji: '🐾' },
  { id: 'level-3', name: 'Renard Astucieux', description: 'Termine "Le Renard Astucieux"', emoji: '🍁' },
  { id: 'level-4', name: 'Renard Rusé', description: 'Termine "Le Renard Rusé"', emoji: '🌰' },
  { id: 'level-5', name: 'Grand Maître Renard', description: 'Termine "Le Grand Maître Renard"', emoji: '👑' },
  { id: 'perfect', name: 'Étoile Filante', description: 'Réponds juste à toutes les questions d\'un niveau', emoji: '🌟' },
  { id: 'speedy', name: "Rapide comme l'éclair", description: 'Termine un niveau vite avec un très bon score', emoji: '⚡' },
  { id: 'streak-3', name: 'Petit Explorateur', description: 'Joue 3 jours de suite', emoji: '🔥' },
  { id: 'streak-7', name: 'Grand Explorateur', description: 'Joue 7 jours de suite', emoji: '🏆' },
  { id: 'all-stars', name: 'Reine des Renards', description: 'Obtiens 3 étoiles à tous les niveaux', emoji: '✨' },
]

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}
