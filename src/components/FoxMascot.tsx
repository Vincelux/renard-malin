type Mood = 'happy' | 'excited' | 'neutral' | 'sad'

const MOOD_EMOJI: Record<Mood, string> = {
  happy: '🦊',
  excited: '🥳',
  neutral: '🦊',
  sad: '🦊',
}

const MOOD_ANIMATION: Record<Mood, string> = {
  happy: 'animate-bounce',
  excited: 'animate-bounce',
  neutral: '',
  sad: 'animate-pulse',
}

export function FoxMascot({ mood = 'happy', size = 'text-8xl' }: { mood?: Mood; size?: string }) {
  return (
    <div className={`${size} ${MOOD_ANIMATION[mood]} select-none drop-shadow-lg`} aria-hidden="true">
      {MOOD_EMOJI[mood]}
    </div>
  )
}
