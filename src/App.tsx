import { useState } from 'react'
import { Home } from './screens/Home'
import { LevelSelect } from './screens/LevelSelect'
import { Quiz } from './screens/Quiz'
import { Results } from './screens/Results'
import { Rewards } from './screens/Rewards'
import { useProgress } from './hooks/useProgress'
import type { LevelResult, Screen } from './types'

function App() {
  const { progress, isLevelUnlocked, recordLevelResult } = useProgress()
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)
  const [lastResult, setLastResult] = useState<LevelResult | null>(null)

  function startLevel(levelId: number) {
    setSelectedLevelId(levelId)
    setScreen('quiz')
  }

  function finishQuiz(
    correct: number,
    total: number,
    durationSec: number,
    score: number,
    hintsUsed: number,
    revealsUsed: number,
  ) {
    if (selectedLevelId === null) return
    const result = recordLevelResult(selectedLevelId, correct, total, durationSec, score, hintsUsed, revealsUsed)
    setLastResult(result)
    setScreen('results')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100">
      {screen === 'home' && (
        <Home progress={progress} onPlay={() => setScreen('levels')} onRewards={() => setScreen('rewards')} />
      )}

      {screen === 'levels' && (
        <LevelSelect
          progress={progress}
          isLevelUnlocked={isLevelUnlocked}
          onSelectLevel={startLevel}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'quiz' && selectedLevelId !== null && (
        <Quiz levelId={selectedLevelId} onFinish={finishQuiz} onBack={() => setScreen('levels')} />
      )}

      {screen === 'results' && lastResult && (
        <Results
          result={lastResult}
          isLevelUnlocked={isLevelUnlocked}
          onRetry={() => setScreen('quiz')}
          onNextLevel={() => {
            setSelectedLevelId(lastResult.levelId + 1)
            setScreen('quiz')
          }}
          onBackToLevels={() => setScreen('levels')}
        />
      )}

      {screen === 'rewards' && <Rewards progress={progress} onBack={() => setScreen('home')} />}
    </div>
  )
}

export default App
