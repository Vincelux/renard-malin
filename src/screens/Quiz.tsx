import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { FoxMascot } from '../components/FoxMascot'
import { getLevel, QUESTIONS_PER_LEVEL } from '../data/levels'
import { generateHint, generateQuestions } from '../utils/quiz'

const ATTEMPTS_BEFORE_HELP = 3

type Status = 'active' | 'correct' | 'revealed'

function pointsFor(attempts: number, hintUsed: boolean, revealed: boolean): number {
  if (revealed) return 0
  if (hintUsed) return 1
  if (attempts === 0) return 3
  return 2
}

export function Quiz({
  levelId,
  onFinish,
  onBack,
}: {
  levelId: number
  onFinish: (correct: number, total: number, durationSec: number, score: number, hintsUsed: number, revealsUsed: number) => void
  onBack: () => void
}) {
  const level = getLevel(levelId)!
  const questions = useMemo(() => generateQuestions(level.tables, QUESTIONS_PER_LEVEL), [levelId])

  const [index, setIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [status, setStatus] = useState<Status>('active')
  const [hintUsed, setHintUsed] = useState(false)
  const [helpDismissed, setHelpDismissed] = useState(false)
  const [shake, setShake] = useState(false)

  const [correctCount, setCorrectCount] = useState(0)
  const [score, setScore] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealsUsed, setRevealsUsed] = useState(0)

  const startTime = useRef(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)

  const question = questions[index]
  const isLast = index === questions.length - 1
  const showHelp = attempts >= ATTEMPTS_BEFORE_HELP && !helpDismissed && status === 'active'

  useEffect(() => {
    inputRef.current?.focus()
  }, [index])

  useEffect(() => {
    if (status === 'active') return
    const timeout = setTimeout(() => {
      if (isLast) {
        const durationSec = Math.round((Date.now() - startTime.current) / 1000)
        onFinish(correctCount, questions.length, durationSec, score, hintsUsed, revealsUsed)
      } else {
        setIndex((i) => i + 1)
        setInputValue('')
        setAttempts(0)
        setStatus('active')
        setHintUsed(false)
        setHelpDismissed(false)
      }
    }, 1300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (status !== 'active' || inputValue.trim() === '') return

    if (Number(inputValue) === question.answer) {
      const gained = pointsFor(attempts, hintUsed, false)
      setScore((s) => s + gained)
      setCorrectCount((c) => c + 1)
      setStatus('correct')
    } else {
      setAttempts((n) => n + 1)
      setHelpDismissed(false)
      setInputValue('')
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  function handleHint() {
    setHintUsed(true)
    setHintsUsed((n) => n + 1)
    inputRef.current?.focus()
  }

  function handleReveal() {
    setRevealsUsed((n) => n + 1)
    setInputValue(String(question.answer))
    setStatus('revealed')
  }

  const mood = status === 'correct' ? 'excited' : status === 'revealed' ? 'sad' : shake ? 'sad' : 'neutral'

  return (
    <div className="min-h-[80vh] px-4 py-6 max-w-lg mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-orange-700 font-semibold">
          ← Quitter
        </button>
        <div className="text-orange-700 font-semibold">
          Question {index + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full bg-orange-100 rounded-full h-3 mb-8">
        <div
          className="bg-orange-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${((index + (status !== 'active' ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <FoxMascot mood={mood} size="text-6xl" />
        <div className="text-5xl font-extrabold text-orange-900">
          {question.a} × {question.b}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`flex flex-col items-center gap-4 ${shake ? 'animate-pulse' : ''}`}>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          disabled={status !== 'active'}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-40 text-center text-4xl font-bold rounded-2xl border-4 py-3 outline-none transition ${
            status === 'correct'
              ? 'border-green-400 bg-green-50 text-green-700'
              : status === 'revealed'
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-orange-300 bg-white text-orange-900 focus:border-orange-500'
          }`}
          placeholder="?"
        />

        {status === 'active' && (
          <button
            type="submit"
            className="rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition text-white font-bold text-lg px-8 py-3 shadow-lg"
          >
            Valider
          </button>
        )}

        {status === 'revealed' && (
          <p className="text-orange-600 font-semibold">
            La réponse était {question.answer}. On continue !
          </p>
        )}
      </form>

      {hintUsed && status === 'active' && (
        <div className="mt-6 w-full bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 text-center">
          <p className="text-amber-800 text-sm font-semibold">{generateHint(question.a, question.b)}</p>
        </div>
      )}

      {showHelp && (
        <div className="mt-4 w-full bg-amber-50 rounded-2xl p-4 border-2 border-dashed border-amber-300 flex flex-col items-center gap-3 text-center">
          <p className="text-amber-800 font-semibold">Tu bloques ? Le renard peut t'aider 🦊</p>

          <div className="flex flex-col gap-2 w-full">
            {!hintUsed && (
              <button
                onClick={handleHint}
                className="rounded-xl bg-amber-300 hover:bg-amber-400 active:scale-95 transition text-amber-900 font-semibold py-2"
              >
                💡 Une astuce (perds moins de points)
              </button>
            )}
            <button
              onClick={handleReveal}
              className="rounded-xl bg-stone-200 hover:bg-stone-300 active:scale-95 transition text-stone-700 font-semibold py-2"
            >
              👀 Montrer la réponse (perds plus de points)
            </button>
            <button onClick={() => setHelpDismissed(true)} className="text-amber-700 text-sm font-semibold py-1">
              Je continue à chercher seul(e)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
