import { useCallback, useEffect, useState } from 'react'
import type { Profile } from '../types'

const PROFILES_KEY = 'renard-malin-profiles-v1'
const CURRENT_KEY = 'renard-malin-current-profile-v1'

function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadCurrentId(): string | null {
  try {
    return localStorage.getItem(CURRENT_KEY)
  } catch {
    return null
  }
}

function makeId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>(() => loadProfiles())
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(() => loadCurrentId())

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
    } catch {
      // Storage unavailable (e.g. private browsing) — profiles just won't persist.
    }
  }, [profiles])

  useEffect(() => {
    try {
      if (currentProfileId) localStorage.setItem(CURRENT_KEY, currentProfileId)
      else localStorage.removeItem(CURRENT_KEY)
    } catch {
      // Storage unavailable.
    }
  }, [currentProfileId])

  const createProfile = useCallback((name: string, emoji: string) => {
    const profile: Profile = { id: makeId(), name: name.trim(), emoji }
    setProfiles((prev) => [...prev, profile])
    setCurrentProfileId(profile.id)
  }, [])

  const selectProfile = useCallback((id: string) => {
    setCurrentProfileId(id)
  }, [])

  const switchProfile = useCallback(() => {
    setCurrentProfileId(null)
  }, [])

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    try {
      localStorage.removeItem(`renard-malin-progress-v1:${id}`)
    } catch {
      // Storage unavailable.
    }
    setCurrentProfileId((current) => (current === id ? null : current))
  }, [])

  const currentProfile = profiles.find((p) => p.id === currentProfileId) ?? null

  return { profiles, currentProfile, createProfile, selectProfile, switchProfile, deleteProfile }
}
