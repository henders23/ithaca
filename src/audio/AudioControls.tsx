import { useEffect, useState } from 'react'
import { audioDirector } from './director.js'
import { MUSIC_TRACKS } from './tracks.js'
import { useAudioSettings } from './useAudio.js'

/**
 * The voyage's audio panel: mute and level for music and combat effects, plus
 * the name of the composition currently scoring the scene.
 */
export function AudioControls() {
  const { musicEnabled, musicVolume, sfxEnabled, sfxVolume, scene, awaitingGesture } = useAudioSettings()
  const [open, setOpen] = useState(false)
  const [textScale, setTextScale] = useState(() => {
    if (typeof localStorage === 'undefined') return 100
    return Math.max(85, Math.min(130, Number(localStorage.getItem('ithaca-text-scale') ?? 100)))
  })
  const track = MUSIC_TRACKS[scene]

  useEffect(() => {
    document.documentElement.style.setProperty('--dialogue-scale', String(textScale / 100))
    try { localStorage.setItem('ithaca-text-scale', String(textScale)) } catch { /* private mode */ }
  }, [textScale])

  return (
    <div className={`audio-panel ${open ? 'open' : ''}`}>
      <button
        className="audio-toggle"
        aria-expanded={open}
        title={musicEnabled ? `Now playing: ${track.title}` : 'Music muted'}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{musicEnabled ? '♪' : '♪̸'}</span>
        <strong>{musicEnabled ? track.title : 'AUDIO MUTED'}</strong>
      </button>

      {open && (
        <div className="audio-settings">
          <p className="eyebrow">{track.role}</p>
          {awaitingGesture && <p className="audio-note">Click anywhere to allow playback.</p>}

          <div className="audio-row">
            <button className={`audio-switch ${musicEnabled ? 'on' : ''}`} onClick={() => audioDirector.setMusicEnabled(!musicEnabled)}>
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
            <span>MUSIC</span>
            <input
              type="range" min={0} max={100} value={Math.round(musicVolume * 100)}
              aria-label="Music volume"
              onChange={(event) => audioDirector.setMusicVolume(Number(event.target.value) / 100)}
            />
          </div>

          <div className="audio-row">
            <button className={`audio-switch ${sfxEnabled ? 'on' : ''}`} onClick={() => audioDirector.setSfxEnabled(!sfxEnabled)}>
              {sfxEnabled ? 'ON' : 'OFF'}
            </button>
            <span>EFFECTS</span>
            <input
              type="range" min={0} max={100} value={Math.round(sfxVolume * 100)}
              aria-label="Effects volume"
              onChange={(event) => audioDirector.setSfxVolume(Number(event.target.value) / 100)}
            />
          </div>

          <label className="audio-row">
            <span>TEXT</span>
            <input type="range" min={85} max={130} value={textScale} aria-label="Dialogue text size" onChange={(event) => setTextScale(Number(event.target.value))} />
            <b>{textScale}%</b>
          </label>
        </div>
      )}
    </div>
  )
}
