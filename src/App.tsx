import { useEffect, useState } from 'react'
import { ChallengeSelect } from './screens/ChallengeSelect'
import { ChronoQuiz } from './screens/ChronoQuiz'
import { Home } from './screens/Home'
import { LevelSelect } from './screens/LevelSelect'
import { ProfileSelect } from './screens/ProfileSelect'
import { Quiz } from './screens/Quiz'
import { Results } from './screens/Results'
import { Rewards } from './screens/Rewards'
import { getNextChallenge } from './data/levels'
import { useProfiles } from './hooks/useProfiles'
import { useProgress } from './hooks/useProgress'
import type { ChallengeResult, ChallengeType, Screen } from './types'

function App() {
  const { profiles, currentProfile, createProfile, selectProfile, switchProfile, deleteProfile } = useProfiles()
  const { progress, isLevelUnlocked, isChallengeUnlocked, recordChallengeResult, resetProgress } = useProgress(
    currentProfile?.id ?? null,
  )
  const [screen, setScreen] = useState<Screen>(() => (currentProfile ? 'home' : 'profiles'))
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null)
  const [lastResult, setLastResult] = useState<ChallengeResult | null>(null)

  useEffect(() => {
    if (!currentProfile) setScreen('profiles')
  }, [currentProfile])

  function openLevel(levelId: number) {
    setSelectedLevelId(levelId)
    setScreen('challenges')
  }

  function startChallenge(levelId: number, type: ChallengeType) {
    setSelectedLevelId(levelId)
    setSelectedChallenge(type)
    setScreen(type === 'chrono' ? 'chrono' : 'quiz')
  }

  function finishChallenge(
    correct: number,
    total: number,
    durationSec: number,
    score: number,
    hintsUsed: number,
    revealsUsed: number,
  ) {
    if (selectedLevelId === null || selectedChallenge === null) return
    const result = recordChallengeResult(
      selectedLevelId,
      selectedChallenge,
      correct,
      total,
      durationSec,
      score,
      hintsUsed,
      revealsUsed,
    )
    setLastResult(result)
    setScreen('results')
  }

  function finishChrono(correct: number, total: number, durationSec: number) {
    finishChallenge(correct, total, durationSec, correct, 0, 0)
  }

  function goToNextChallenge() {
    if (!lastResult) return
    const next = getNextChallenge(lastResult.levelId, lastResult.type)
    if (!next) return
    startChallenge(next.levelId, next.type)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100">
      {screen === 'profiles' && (
        <ProfileSelect
          profiles={profiles}
          onSelect={(id) => {
            selectProfile(id)
            setScreen('home')
          }}
          onCreate={(name, emoji) => {
            createProfile(name, emoji)
            setScreen('home')
          }}
          onDelete={deleteProfile}
        />
      )}

      {screen === 'home' && currentProfile && (
        <Home
          profile={currentProfile}
          progress={progress}
          onPlay={() => setScreen('levels')}
          onRewards={() => setScreen('rewards')}
          onSwitchProfile={switchProfile}
        />
      )}

      {screen === 'levels' && (
        <LevelSelect
          progress={progress}
          isLevelUnlocked={isLevelUnlocked}
          onSelectLevel={openLevel}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'challenges' && selectedLevelId !== null && (
        <ChallengeSelect
          levelId={selectedLevelId}
          progress={progress}
          isChallengeUnlocked={isChallengeUnlocked}
          onSelectChallenge={(type) => startChallenge(selectedLevelId, type)}
          onBack={() => setScreen('levels')}
        />
      )}

      {screen === 'quiz' && selectedLevelId !== null && selectedChallenge !== null && (
        <Quiz
          levelId={selectedLevelId}
          challengeType={selectedChallenge}
          onFinish={finishChallenge}
          onBack={() => setScreen('challenges')}
        />
      )}

      {screen === 'chrono' && selectedLevelId !== null && (
        <ChronoQuiz levelId={selectedLevelId} onFinish={finishChrono} onBack={() => setScreen('challenges')} />
      )}

      {screen === 'results' && lastResult && (
        <Results
          result={lastResult}
          onRetry={() => setScreen(lastResult.type === 'chrono' ? 'chrono' : 'quiz')}
          onNext={goToNextChallenge}
          onBackToChallenges={() => setScreen('challenges')}
        />
      )}

      {screen === 'rewards' && (
        <Rewards
          progress={progress}
          onBack={() => setScreen('home')}
          onReset={() => {
            resetProgress()
            setScreen('home')
          }}
        />
      )}
    </div>
  )
}

export default App
