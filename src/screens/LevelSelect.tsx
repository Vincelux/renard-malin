import { LEVELS } from '../data/levels'
import { StarRating } from '../components/StarRating'
import type { Progress } from '../types'

export function LevelSelect({
  progress,
  isLevelUnlocked,
  onSelectLevel,
  onBack,
}: {
  progress: Progress
  isLevelUnlocked: (id: number) => boolean
  onSelectLevel: (id: number) => void
  onBack: () => void
}) {
  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-orange-700 font-semibold mb-4">
        ← Retour
      </button>
      <h2 className="text-3xl font-extrabold text-orange-800 text-center mb-6">Choisis un niveau</h2>

      <div className="flex flex-col gap-4">
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(level.id)
          const stars = progress.levelStars[level.id] ?? 0

          return (
            <button
              key={level.id}
              disabled={!unlocked}
              onClick={() => onSelectLevel(level.id)}
              className={`flex items-center gap-4 rounded-2xl p-4 shadow text-left transition ${
                unlocked
                  ? 'bg-white hover:bg-orange-50 active:scale-[0.98]'
                  : 'bg-stone-100 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-4xl">{unlocked ? level.emoji : '🔒'}</div>
              <div className="flex-1">
                <div className="font-bold text-orange-900 text-lg">{level.name}</div>
                <div className="text-sm text-orange-600">{level.subtitle}</div>
              </div>
              <StarRating stars={stars} size="text-lg" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
