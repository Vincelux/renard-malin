export function StarRating({ stars, size = 'text-2xl' }: { stars: number; size?: string }) {
  return (
    <div className={`flex gap-0.5 ${size}`} aria-label={`${stars} étoile(s) sur 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= stars ? 'text-amber-400' : 'text-stone-300'}>
          ★
        </span>
      ))}
    </div>
  )
}
