import type { Question } from '../types'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildChoices(a: number, b: number, answer: number): number[] {
  const distractors = new Set<number>()
  const candidates = [
    a * (b + 1),
    a * (b - 1),
    (a + 1) * b,
    (a - 1) * b,
    answer + a,
    answer - a,
    answer + b,
    answer - b,
    answer + randInt(1, 10),
    answer - randInt(1, 10),
  ].filter((n) => n > 0 && n !== answer)

  for (const c of shuffle(candidates)) {
    if (distractors.size >= 3) break
    distractors.add(c)
  }
  // Fallback in the unlikely case we didn't find 3 distinct distractors.
  while (distractors.size < 3) {
    const fallback = answer + randInt(-15, 15)
    if (fallback > 0 && fallback !== answer) distractors.add(fallback)
  }

  return shuffle([answer, ...Array.from(distractors)])
}

export function generateQuestions(tables: number[], count: number): Question[] {
  const questions: Question[] = []
  const seen = new Set<string>()

  while (questions.length < count) {
    const a = tables[randInt(0, tables.length - 1)]
    const b = randInt(1, 10)
    const key = `${a}x${b}`
    if (seen.has(key) && seen.size < tables.length * 10) continue
    seen.add(key)

    const answer = a * b
    questions.push({ a, b, answer, choices: buildChoices(a, b, answer) })
  }

  return questions
}
