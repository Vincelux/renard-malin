import { useEffect, useMemo, useRef, useState } from 'react'
import { FoxMascot } from '../components/FoxMascot'
import { getLevel, QUESTIONS_PER_LEVEL } from '../data/levels'
import { generateQuestions } from '../utils/quiz'

export function Quiz({
  levelId,
  onFinish,
  onBack,
}: {
  levelId: number
  onFinish: (correct: number, total: number, durationSec: number) => void
  onBack: () => void
}) {
  const level = getLevel(levelId)!
  const questions = useMemo(() => generateQuestions(level.tables, QUESTIONS_PER_LEVEL), [levelId])

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const startTime = useRef(Date.now())

  const question = questions[index]
  const isLast = index === questions.length - 1
  const isAnswered = selected !== null
  const isCorrect = isAnswered && selected === question.answer

  useEffect(() => {
    if (!isAnswered) return
    const timeout = setTimeout(() => {
      if (isLast) {
        const durationSec = Math.round((Date.now() - startTime.current) / 1000)
        onFinish(correctCount + (isCorrect ? 1 : 0), questions.length, durationSec)
      } else {
        setSelected(null)
        setIndex((i) => i + 1)
        if (isCorrect) setCorrectCount((c) => c + 1)
      }
    }, 900)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnswered])

  function handleAnswer(choice: number) {
    if (isAnswered) return
    setSelected(choice)
  }

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
          style={{ width: `${((index + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <FoxMascot mood={!isAnswered ? 'neutral' : isCorrect ? 'excited' : 'sad'} size="text-6xl" />
        <div className="text-5xl font-extrabold text-orange-900">
          {question.a} × {question.b}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.choices.map((choice) => {
          let style = 'bg-white hover:bg-orange-50 text-orange-900'
          if (isAnswered) {
            if (choice === question.answer) {
              style = 'bg-green-400 text-white'
            } else if (choice === selected) {
              style = 'bg-red-400 text-white'
            } else {
              style = 'bg-white text-orange-300'
            }
          }
          return (
            <button
              key={choice}
              disabled={isAnswered}
              onClick={() => handleAnswer(choice)}
              className={`rounded-2xl py-6 text-3xl font-bold shadow transition active:scale-95 ${style}`}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
