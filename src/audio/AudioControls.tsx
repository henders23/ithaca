import { useState } from 'react'
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
  const track = MUSIC_TRACKS[scene]

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

          <label className="audio-row">
            <button className={`audio-switch ${musicEnabled ? 'on' : ''}`} onClick={() => audioDirector.setMusicEnabled(!musicEnabled)}>
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
            <span>MUSIC</span>
            <input
              type="range" min={0} max={100} value={Math.round(musicVolume * 100)}
              aria-label="Music volume"
              onChange={(event) => audioDirector.setMusicVolume(Number(event.target.value) / 100)}
            />
          </label>

          <label className="audio-row">
            <button className={`audio-switch ${sfxEnabled ? 'on' : ''}`} onClick={() => audioDirector.setSfxEnabled(!sfxEnabled)}>
              {sfxEnabled ? 'ON' : 'OFF'}
            </button>
            <span>EFFECTS</span>
            <input
              type="range" min={0} max={100} value={Math.round(sfxVolume * 100)}
              aria-label="Combat effects volume"
              onChange={(event) => audioDirector.setSfxVolume(Number(event.target.value) / 100)}
            />
          </label>
        </div>
      )}
    </div>
  )
}
