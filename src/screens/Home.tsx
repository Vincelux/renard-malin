import { FoxMascot } from '../components/FoxMascot'
import type { Profile, Progress } from '../types'
import { getTotalStars } from '../utils/stars'

export function Home({
  profile,
  progress,
  onPlay,
  onRewards,
  onSwitchProfile,
}: {
  profile: Profile
  progress: Progress
  onPlay: () => void
  onRewards: () => void
  onSwitchProfile: () => void
}) {
  const { earned: totalStars, max: maxStars } = getTotalStars(progress)

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-6 gap-6">
      <button
        onClick={onSwitchProfile}
        className="absolute top-4 right-4 text-sm text-orange-500 hover:text-orange-700 font-semibold"
      >
        🔄 Changer de joueur
      </button>

      <FoxMascot mood="happy" />
      <div>
        <h1 className="text-4xl font-extrabold text-orange-800">
          Salut {profile.emoji} {profile.name} !
        </h1>
        <p className="mt-2 text-lg text-orange-700">
          Prêt(e) à devenir le roi ou la reine des tables de multiplication ?
        </p>
      </div>

      {progress.streak > 1 && (
        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
          🔥 {progress.streak} jours de suite !
        </div>
      )}

      <div className="flex items-center gap-2 text-amber-600 font-semibold">
        <span className="text-2xl">★</span>
        <span>
          {totalStars} / {maxStars} étoiles
        </span>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        <button
          onClick={onPlay}
          className="rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition text-white font-bold text-xl py-4 shadow-lg"
        >
          🐾 Jouer
        </button>
        <button
          onClick={onRewards}
          className="rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 transition text-orange-900 font-bold text-lg py-3 shadow"
        >
          🏆 Mes récompenses
        </button>
      </div>
    </div>
  )
}
