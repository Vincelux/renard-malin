import type { Question } from '../types'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
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

    questions.push({ a, b, answer: a * b })
  }

  return questions
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

export function generateHint(a: number, b: number): string {
  const candidates = [a, b].filter((n) => n in SPECIAL_TRICKS)
  if (candidates.length > 0) {
    const n = Math.min(...candidates)
    const other = n === a ? b : a
    return `Astuce : ${SPECIAL_TRICKS[n](other)}`
  }

  return `Astuce : décompose le calcul. ${a} × ${b} = (${a} × ${b - 1}) + ${a}. Calcule d'abord ${a} × ${b - 1}, puis ajoute ${a}.`
}
