import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { FoxMascot } from '../components/FoxMascot'
import { CHRONO_TIME_SEC, getLevel } from '../data/levels'
import { generateQuestionsForChallenge } from '../utils/quiz'

export function ChronoQuiz({
  levelId,
  onFinish,
  onBack,
}: {
  levelId: number
  onFinish: (correct: number, total: number, durationSec: number) => void
  onBack: () => void
}) {
  const level = getLevel(levelId)!
  const questions = useMemo(() => generateQuestionsForChallenge('chrono', level.tables, 300), [levelId])

  const [index, setIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(CHRONO_TIME_SEC)
  const [shake, setShake] = useState(false)
  const [finished, setFinished] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const hasFinishedRef = useRef(false)

  const question = questions[index % questions.length]

  useEffect(() => {
    if (!finished) inputRef.current?.focus()
  }, [index, finished])

  useEffect(() => {
    if (finished || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, finished])

  useEffect(() => {
    if (timeLeft === 0 && !hasFinishedRef.current) {
      hasFinishedRef.current = true
      setFinished(true)
      onFinish(correctCount, index, CHRONO_TIME_SEC)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (finished || inputValue.trim() === '') return

    if (Number(inputValue) === question.answer) {
      setCorrectCount((c) => c + 1)
      setIndex((i) => i + 1)
      setInputValue('')
    } else {
      setInputValue('')
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
  }

  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-lg mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-orange-700 font-semibold">
          ← Quitter
        </button>
        <div className="text-orange-700 font-semibold">✅ {correctCount}</div>
      </div>

      <div className="w-full bg-orange-100 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="bg-red-400 h-3 transition-all duration-1000"
          style={{ width: `${(timeLeft / CHRONO_TIME_SEC) * 100}%` }}
        />
      </div>
      <div className="text-center text-2xl font-extrabold text-red-500 mb-6">⏱️ {timeLeft}s</div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <FoxMascot mood={finished ? 'happy' : shake ? 'sad' : 'excited'} size="text-6xl" />
        <div className="text-5xl font-extrabold text-orange-900">{finished ? '🏁' : question.prompt}</div>
      </div>

      {!finished && (
        <form onSubmit={handleSubmit} className={`flex flex-col items-center gap-4 ${shake ? 'animate-pulse' : ''}`}>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-40 text-center text-4xl font-bold rounded-2xl border-4 border-orange-300 bg-white text-orange-900 focus:border-orange-500 outline-none py-3"
            placeholder="?"
          />
          <button
            type="submit"
            className="rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition text-white font-bold text-lg px-8 py-3 shadow-lg"
          >
            Valider
          </button>
        </form>
      )}
    </div>
  )
}
