import type { ChallengeType, Question } from '../types'

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

function randomPair(tables: number[]): { a: number; b: number } {
  const a = tables[randInt(0, tables.length - 1)]
  const b = randInt(1, 10)
  return { a, b }
}

const SPECIAL_TRICKS: Record<number, (other: number) => string> = {
  1: (other) => `Multiplier par 1 ne change rien : la réponse est ${other}.`,
  2: (other) => `Multiplier par 2, c'est additionner le nombre avec lui-même : ${other} + ${other}.`,
  4: (other) => `Multiplier par 4, c'est doubler deux fois de suite : d'abord ${other} + ${other}, puis redouble ce résultat.`,
  5: () => `Pour multiplier par 5 : multiplie par 10, puis divise le résultat par 2.`,
  9: (other) => `Pour multiplier par 9 : multiplie par 10, puis retire ${other}.`,
  10: () => `Pour multiplier par 10 : ajoute simplement un 0 à la fin du nombre.`,
  11: (other) => (other <= 9 ? `Pour multiplier 11 par un chiffre de 1 à 9, répète-le deux fois : ${other}${other}.` : `Pense à 11 comme 10 + 1 : additionne le nombre × 10 et le nombre lui-même.`),
}

function generateHint(a: number, b: number): string {
  const candidates = [a, b].filter((n) => n in SPECIAL_TRICKS)
  if (candidates.length > 0) {
    const n = Math.min(...candidates)
    const other = n === a ? b : a
    return `Astuce : ${SPECIAL_TRICKS[n](other)}`
  }

  return `Astuce : décompose le calcul. ${a} × ${b} = (${a} × ${b - 1}) + ${a}. Calcule d'abord ${a} × ${b - 1}, puis ajoute ${a}.`
}

function generateFactorHint(known: number, product: number): string {
  return `Astuce : ${product} ÷ ${known} = ?. Cherche combien de fois ${known} tient dans ${product}.`
}

export function generateQuizQuestions(tables: number[], count: number): Question[] {
  const questions: Question[] = []
  const seen = new Set<string>()

  while (questions.length < count) {
    const { a, b } = randomPair(tables)
    const key = `${a}x${b}`
    if (seen.has(key) && seen.size < tables.length * 10) continue
    seen.add(key)

    questions.push({ prompt: `${a} × ${b}`, answer: a * b, hint: generateHint(a, b) })
  }

  return questions
}

export function generateMissingFactorQuestions(tables: number[], count: number): Question[] {
  const questions: Question[] = []
  const seen = new Set<string>()

  while (questions.length < count) {
    const { a, b } = randomPair(tables)
    const key = `${a}x${b}`
    if (seen.has(key) && seen.size < tables.length * 10) continue
    seen.add(key)

    const product = a * b
    const hideFirst = Math.random() < 0.5
    const prompt = hideFirst ? `? × ${b} = ${product}` : `${a} × ? = ${product}`
    const answer = hideFirst ? a : b
    const known = hideFirst ? b : a

    questions.push({ prompt, answer, hint: generateFactorHint(known, product) })
  }

  return questions
}

export function generateMixedQuestions(tables: number[], count: number): Question[] {
  const half = Math.ceil(count / 2)
  const pool = [...generateQuizQuestions(tables, half), ...generateMissingFactorQuestions(tables, count - half)]
  return shuffle(pool).slice(0, count)
}

export function generateQuestionsForChallenge(type: ChallengeType, tables: number[], count: number): Question[] {
  switch (type) {
    case 'quiz':
      return generateQuizQuestions(tables, count)
    case 'missing-factor':
      return generateMissingFactorQuestions(tables, count)
    case 'mixed':
      return generateMixedQuestions(tables, count)
    case 'chrono':
      return generateQuizQuestions(tables, count)
  }
}
