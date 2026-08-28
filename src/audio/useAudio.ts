import { useEffect, useSyncExternalStore } from 'react'
import { audioDirector, DEFAULT_AUDIO_SETTINGS, type AudioSnapshot } from './director.js'
import { DEFAULT_MUSIC_SCENE, type MusicScene } from './tracks.js'

const SERVER_SNAPSHOT: AudioSnapshot = { ...DEFAULT_AUDIO_SETTINGS, scene: DEFAULT_MUSIC_SCENE, awaitingGesture: false }

/** Reactive view of the player's audio settings and the track currently playing. */
export function useAudioSettings(): AudioSnapshot {
  return useSyncExternalStore(audioDirector.subscribe, audioDirector.getSnapshot, () => SERVER_SNAPSHOT)
}

/**
 * Claims a music scene for as long as the calling screen is mounted, and hands
 * playback back to the default voyage theme when it leaves.
 */
export function useMusicScene(scene: MusicScene) {
  useEffect(() => {
    audioDirector.requestScene(scene)
    return () => audioDirector.releaseScene()
  }, [scene])
}

/** Starts music once the game shell is on screen. */
export function useMusicDirector() {
  useEffect(() => {
    audioDirector.start()
  }, [])
}
