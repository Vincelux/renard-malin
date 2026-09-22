import { BADGES } from '../data/badges'
import type { Progress } from '../types'

export function Rewards({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-orange-700 font-semibold mb-4">
        ← Retour
      </button>
      <h2 className="text-3xl font-extrabold text-orange-800 text-center mb-2">Mes récompenses</h2>
      <p className="text-center text-orange-600 mb-6">
        {progress.unlockedBadges.length} / {BADGES.length} récompenses débloquées
      </p>

      <div className="grid grid-cols-2 gap-4">
        {BADGES.map((badge) => {
          const unlocked = progress.unlockedBadges.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 shadow flex flex-col items-center text-center gap-1 ${
                unlocked ? 'bg-white' : 'bg-stone-100 opacity-60'
              }`}
            >
              <div className="text-4xl">{unlocked ? badge.emoji : '❓'}</div>
              <div className="font-bold text-orange-900">{unlocked ? badge.name : '???'}</div>
              <div className="text-xs text-orange-600">{unlocked ? badge.description : 'Récompense à découvrir'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
