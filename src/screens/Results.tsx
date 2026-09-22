import { FoxMascot } from '../components/FoxMascot'
import { StarRating } from '../components/StarRating'
import { getBadge } from '../data/badges'
import { getLevel, LEVELS } from '../data/levels'
import type { LevelResult } from '../types'

export function Results({
  result,
  isLevelUnlocked,
  onRetry,
  onNextLevel,
  onBackToLevels,
}: {
  result: LevelResult
  isLevelUnlocked: (id: number) => boolean
  onRetry: () => void
  onNextLevel: () => void
  onBackToLevels: () => void
}) {
  const level = getLevel(result.levelId)!
  const nextLevel = LEVELS.find((l) => l.id === result.levelId + 1)
  const canGoNext = nextLevel && isLevelUnlocked(nextLevel.id)
  const mood = result.stars >= 2 ? 'excited' : result.stars >= 1 ? 'happy' : 'sad'

  const encouragement =
    result.stars === 3
      ? 'Incroyable, tu es une vraie championne ! 🎉'
      : result.stars === 2
        ? 'Bravo, tu progresses super bien !'
        : result.stars === 1
          ? "Bien joué, continue comme ça !"
          : "Pas grave, on réessaie et tu vas y arriver !"

  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-lg mx-auto flex flex-col items-center text-center gap-5">
      <FoxMascot mood={mood} />
      <h2 className="text-2xl font-extrabold text-orange-800">{level.name}</h2>
      <StarRating stars={result.stars} size="text-5xl" />
      <p className="text-lg text-orange-700 font-semibold">
        {result.correct} / {result.total} bonnes réponses · {result.score} / {result.maxScore} points
      </p>
      {(result.hintsUsed > 0 || result.revealsUsed > 0) && (
        <p className="text-sm text-orange-500">
          {result.hintsUsed > 0 && `💡 ${result.hintsUsed} astuce(s) utilisée(s)`}
          {result.hintsUsed > 0 && result.revealsUsed > 0 && ' · '}
          {result.revealsUsed > 0 && `👀 ${result.revealsUsed} réponse(s) montrée(s)`}
        </p>
      )}
      <p className="text-orange-600">{encouragement}</p>

      {result.newBadgeIds.length > 0 && (
        <div className="w-full bg-amber-50 rounded-2xl p-4 border-2 border-dashed border-amber-300">
          <div className="font-bold text-amber-700 mb-2">Nouvelle(s) récompense(s) !</div>
          <div className="flex flex-wrap justify-center gap-3">
            {result.newBadgeIds.map((id) => {
              const badge = getBadge(id)
              if (!badge) return null
              return (
                <div key={id} className="flex flex-col items-center w-24">
                  <div className="text-4xl">{badge.emoji}</div>
                  <div className="text-xs font-semibold text-amber-800">{badge.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full mt-2">
        {canGoNext && (
          <button
            onClick={onNextLevel}
            className="rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition text-white font-bold text-lg py-3 shadow-lg"
          >
            Niveau suivant →
          </button>
        )}
        <button
          onClick={onRetry}
          className="rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 transition text-orange-900 font-bold text-lg py-3 shadow"
        >
          🔁 Rejouer ce niveau
        </button>
        <button onClick={onBackToLevels} className="text-orange-700 font-semibold py-2">
          ← Retour aux niveaux
        </button>
      </div>
    </div>
  )
}
