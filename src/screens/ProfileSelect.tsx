import { useState, type MouseEvent } from 'react'
import type { Profile } from '../types'

const EMOJI_OPTIONS = ['🦊', '🐰', '🐱', '🐶', '🐼', '🦁', '🐨', '🐸']

export function ProfileSelect({
  profiles,
  onSelect,
  onCreate,
  onDelete,
}: {
  profiles: Profile[]
  onSelect: (id: string) => void
  onCreate: (name: string, emoji: string) => void
  onDelete: (id: string) => void
}) {
  const [isCreating, setIsCreating] = useState(profiles.length === 0)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0])

  function handleCreate() {
    if (name.trim() === '') return
    onCreate(name, emoji)
    setName('')
    setEmoji(EMOJI_OPTIONS[0])
    setIsCreating(false)
  }

  function handleDelete(e: MouseEvent, id: string, profileName: string) {
    e.stopPropagation()
    if (window.confirm(`Supprimer le profil "${profileName}" et toute sa progression ?`)) {
      onDelete(id)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-6 py-10 gap-8 text-center">
      <div>
        <div className="text-6xl mb-2">🦊</div>
        <h1 className="text-3xl font-extrabold text-orange-800">Qui joue aujourd'hui ?</h1>
      </div>

      {profiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className="relative rounded-2xl bg-white hover:bg-orange-50 active:scale-95 transition shadow p-4 flex flex-col items-center gap-1"
            >
              <span
                onClick={(e) => handleDelete(e, profile.id, profile.name)}
                className="absolute top-1 right-1 text-stone-300 hover:text-red-500 text-sm px-1"
                aria-label="Supprimer ce profil"
              >
                ✕
              </span>
              <div className="text-4xl">{profile.emoji}</div>
              <div className="font-bold text-orange-900">{profile.name}</div>
            </button>
          ))}
        </div>
      )}

      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 transition text-orange-900 font-bold px-6 py-3 shadow"
        >
          + Ajouter un joueur
        </button>
      )}

      {isCreating && (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow p-5 flex flex-col items-center gap-4">
          <p className="font-bold text-orange-800">Nouveau joueur</p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom"
            maxLength={20}
            className="w-full text-center text-xl rounded-xl border-2 border-orange-200 focus:border-orange-500 outline-none py-2"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setEmoji(option)}
                className={`text-2xl rounded-xl p-2 transition ${
                  emoji === option ? 'bg-orange-200 scale-110' : 'bg-stone-100 hover:bg-orange-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full">
            {profiles.length > 0 && (
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 transition text-stone-600 font-semibold py-2"
              >
                Annuler
              </button>
            )}
            <button
              onClick={handleCreate}
              disabled={name.trim() === ''}
              className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 active:scale-95 transition text-white font-semibold py-2"
            >
              Créer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
