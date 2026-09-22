import { StarRating } from '../components/StarRating'
import { challengeEmoji, challengeLabel, getLevel } from '../data/levels'
import { getChallengeStars } from '../utils/stars'
import type { ChallengeType, Progress } from '../types'

export function ChallengeSelect({
  levelId,
  progress,
  isChallengeUnlocked,
  onSelectChallenge,
  onBack,
}: {
  levelId: number
  progress: Progress
  isChallengeUnlocked: (levelId: number, type: ChallengeType) => boolean
  onSelectChallenge: (type: ChallengeType) => void
  onBack: () => void
}) {
  const level = getLevel(levelId)!

  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-orange-700 font-semibold mb-4">
        ← Retour
      </button>

      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{level.emoji}</div>
        <h2 className="text-2xl font-extrabold text-orange-800">{level.name}</h2>
        <p className="text-orange-600">{level.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4">
        {level.challenges.map((type) => {
          const unlocked = isChallengeUnlocked(levelId, type)
          const stars = getChallengeStars(progress, levelId, type)

          return (
            <button
              key={type}
              disabled={!unlocked}
              onClick={() => onSelectChallenge(type)}
              className={`flex items-center gap-4 rounded-2xl p-4 shadow text-left transition ${
                unlocked
                  ? 'bg-white hover:bg-orange-50 active:scale-[0.98]'
                  : 'bg-stone-100 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-4xl">{unlocked ? challengeEmoji(type) : '🔒'}</div>
              <div className="flex-1">
                <div className="font-bold text-orange-900 text-lg">{challengeLabel(type)}</div>
              </div>
              <StarRating stars={stars} size="text-lg" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
