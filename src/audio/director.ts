import { DEFAULT_MUSIC_SCENE, MUSIC_TRACKS, SFX_SOURCES, type MusicScene, type SfxId } from './tracks.js'

export interface AudioSettings {
  musicEnabled: boolean
  musicVolume: number
  sfxEnabled: boolean
  sfxVolume: number
}

export interface AudioSnapshot extends AudioSettings {
  scene: MusicScene
  /** True while the browser is still refusing playback until the first gesture. */
  awaitingGesture: boolean
}

const SETTINGS_KEY = 'ithaca-audio-v1'
const CROSSFADE_MS = 900
const TICK_MS = 50

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  musicEnabled: true,
  musicVolume: 0.7,
  sfxEnabled: true,
  sfxVolume: 0.8,
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

function readSettings(): AudioSettings {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_AUDIO_SETTINGS }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_AUDIO_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<AudioSettings>
    return {
      musicEnabled: parsed.musicEnabled ?? DEFAULT_AUDIO_SETTINGS.musicEnabled,
      musicVolume: clamp01(Number(parsed.musicVolume ?? DEFAULT_AUDIO_SETTINGS.musicVolume)),
      sfxEnabled: parsed.sfxEnabled ?? DEFAULT_AUDIO_SETTINGS.sfxEnabled,
      sfxVolume: clamp01(Number(parsed.sfxVolume ?? DEFAULT_AUDIO_SETTINGS.sfxVolume)),
    }
  } catch {
    return { ...DEFAULT_AUDIO_SETTINGS }
  }
}

/**
 * Owns every looping music track and every one-shot combat sample.
 *
 * The campaign never selects a file directly: screens claim a *scene* and the
 * director crossfades between the four compositions. Audio stays a progressive
 * enhancement — a browser that blocks autoplay, refuses `Audio` or has no
 * storage still renders and plays the game.
 */
class AudioDirector {
  private settings = readSettings()
  private scene: MusicScene = DEFAULT_MUSIC_SCENE
  private pendingScene: MusicScene | null = null
  private sceneChangeQueued = false
  private readonly elements = new Map<MusicScene, HTMLAudioElement>()
  private readonly samples = new Map<SfxId, HTMLAudioElement>()
  private readonly listeners = new Set<() => void>()
  private snapshot: AudioSnapshot = { ...this.settings, scene: DEFAULT_MUSIC_SCENE, awaitingGesture: false }
  private fadeTimer: number | null = null
  private duckFactor = 1
  private duckTimer: number | null = null
  private gestureBound = false
  private started = false

  // ---- React store ---------------------------------------------------------

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  getSnapshot = () => this.snapshot

  private publish() {
    this.snapshot = { ...this.settings, scene: this.scene, awaitingGesture: this.snapshot.awaitingGesture }
    for (const listener of this.listeners) listener()
  }

  private setAwaitingGesture(value: boolean) {
    if (this.snapshot.awaitingGesture === value) return
    this.snapshot = { ...this.snapshot, awaitingGesture: value }
    for (const listener of this.listeners) listener()
  }

  // ---- settings ------------------------------------------------------------

  private persist() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)) } catch { /* private mode */ }
  }

  setMusicEnabled(enabled: boolean) {
    this.settings = { ...this.settings, musicEnabled: enabled }
    this.persist()
    this.publish()
    this.applyMusic()
  }

  setMusicVolume(volume: number) {
    this.settings = { ...this.settings, musicVolume: clamp01(volume) }
    this.persist()
    this.publish()
    this.applyMusic()
  }

  setSfxEnabled(enabled: boolean) {
    this.settings = { ...this.settings, sfxEnabled: enabled }
    this.persist()
    this.publish()
  }

  setSfxVolume(volume: number) {
    this.settings = { ...this.settings, sfxVolume: clamp01(volume) }
    this.persist()
    this.publish()
  }

  // ---- scenes --------------------------------------------------------------

  /**
   * Screens claim a scene on mount and release it on unmount. Claims are
   * coalesced to the end of the commit so the unmount of one screen and the
   * mount of the next never audibly bounce through the default theme.
   */
  requestScene(scene: MusicScene) {
    this.pendingScene = scene
    if (this.sceneChangeQueued) return
    this.sceneChangeQueued = true
    queueMicrotask(() => {
      this.sceneChangeQueued = false
      const next = this.pendingScene
      this.pendingScene = null
      if (!next || next === this.scene) return
      this.scene = next
      this.publish()
      this.applyMusic()
    })
  }

  releaseScene() {
    this.requestScene(DEFAULT_MUSIC_SCENE)
  }

  // ---- playback ------------------------------------------------------------

  /** Called once when the game shell mounts. Safe to call repeatedly. */
  start() {
    if (this.started || typeof window === 'undefined' || typeof Audio === 'undefined') return
    this.started = true
    this.applyMusic()
    this.bindGesture()
  }

  stop() {
    if (this.fadeTimer !== null) { window.clearInterval(this.fadeTimer); this.fadeTimer = null }
    if (this.duckTimer !== null) { window.clearTimeout(this.duckTimer); this.duckTimer = null }
    for (const element of this.elements.values()) {
      try { element.pause(); element.src = '' } catch { /* already torn down */ }
    }
    this.elements.clear()
    this.started = false
  }

  private element(scene: MusicScene): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null
    const existing = this.elements.get(scene)
    if (existing) return existing
    try {
      const element = new Audio(MUSIC_TRACKS[scene].src)
      element.loop = true
      element.preload = 'auto'
      element.volume = 0
      this.elements.set(scene, element)
      return element
    } catch {
      return null
    }
  }

  private targetVolume(scene: MusicScene) {
    if (!this.settings.musicEnabled || scene !== this.scene) return 0
    return clamp01(MUSIC_TRACKS[scene].level * this.settings.musicVolume * this.duckFactor)
  }

  private applyMusic() {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return
    if (this.settings.musicEnabled) {
      const element = this.element(this.scene)
      if (element && element.paused) {
        if (MUSIC_TRACKS[this.scene].restart && element.volume === 0) {
          try { element.currentTime = 0 } catch { /* not seekable yet */ }
        }
        const playback = element.play()
        if (playback && typeof playback.catch === 'function') {
          playback.then(() => this.setAwaitingGesture(false)).catch(() => this.setAwaitingGesture(true))
        }
      }
    }
    this.ensureFading()
  }

  private ensureFading() {
    if (this.fadeTimer !== null || typeof window === 'undefined') return
    this.fadeTimer = window.setInterval(() => this.fadeStep(), TICK_MS)
  }

  private fadeStep() {
    let moving = false
    for (const [scene, element] of this.elements) {
      const target = this.targetVolume(scene)
      const distance = target - element.volume
      if (Math.abs(distance) < 0.01) {
        if (element.volume !== target) element.volume = target
        if (target === 0 && !element.paused) element.pause()
        continue
      }
      moving = true
      const step = TICK_MS / CROSSFADE_MS
      element.volume = clamp01(element.volume + Math.sign(distance) * Math.min(Math.abs(distance), step))
    }
    if (!moving && this.fadeTimer !== null) {
      window.clearInterval(this.fadeTimer)
      this.fadeTimer = null
    }
  }

  /** Browsers block autoplay until the player interacts; retry on the first input. */
  private bindGesture() {
    if (this.gestureBound || typeof window === 'undefined') return
    this.gestureBound = true
    const unlock = () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      this.gestureBound = false
      this.applyMusic()
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
  }

  /** Briefly pulls the music down so a loud weapon or explosion reads clearly. */
  duck(durationMs: number, depth: number) {
    if (!this.settings.musicEnabled || typeof window === 'undefined') return
    this.duckFactor = Math.min(this.duckFactor, clamp01(1 - depth))
    if (this.duckTimer !== null) window.clearTimeout(this.duckTimer)
    this.duckTimer = window.setTimeout(() => {
      this.duckTimer = null
      this.duckFactor = 1
      this.ensureFading()
    }, durationMs)
    this.ensureFading()
  }

  // ---- one-shot samples ----------------------------------------------------

  preloadSfx(ids: readonly SfxId[]) {
    if (typeof Audio === 'undefined') return
    for (const id of ids) {
      if (this.samples.has(id)) continue
      try {
        const element = new Audio(SFX_SOURCES[id])
        element.preload = 'auto'
        this.samples.set(id, element)
      } catch { /* audio unavailable */ }
    }
  }

  /** `level` is the sample's own mix weight; the player's sfx volume scales it. */
  playSfx(id: SfxId, level = 1) {
    if (!this.settings.sfxEnabled || typeof Audio === 'undefined') return
    const volume = clamp01(level * this.settings.sfxVolume)
    if (volume <= 0) return
    try {
      const base = this.samples.get(id)
      const element = base ? (base.cloneNode(true) as HTMLAudioElement) : new Audio(SFX_SOURCES[id])
      element.volume = volume
      if (volume >= 0.42) this.duck(volume >= 0.7 ? 680 : 420, volume >= 0.7 ? 0.34 : 0.2)
      const playback = element.play()
      if (playback && typeof playback.catch === 'function') playback.catch(() => { /* blocked until gesture */ })
    } catch { /* audio remains a progressive enhancement */ }
  }
}

export const audioDirector = new AudioDirector()
