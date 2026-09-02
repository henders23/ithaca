import { useEffect, useMemo, useRef, useState } from 'react'
import { audioDirector } from '../audio/director.js'
import { useMusicScene } from '../audio/useAudio.js'
import { useDialogueMemory } from '../narrative/DialogueMemoryContext.js'
import type { DialogueChoice, DialogueLine, DialogueMomentChoice, DialogueSceneData, PortraitId } from './content.js'
import { ASSETS, portraitFor, sceneHasAlienSpeaker } from './content.js'

interface DialogueSceneProps {
  scene: DialogueSceneData
  onChoice?: (choice: DialogueChoice) => void
  onContinue?: () => void
}

interface DisplayLine extends DialogueLine {
  sourceIndex: number
  injected?: boolean
}

const AUTO_KEY = 'ithaca-dialogue-auto'
const TEXT_SPEED_KEY = 'ithaca-dialogue-speed'

export type TextSpeed = 'instant' | 'brisk' | 'measured'

/** Milliseconds per character, with a longer breath after punctuation. */
const SPEED_MS: Readonly<Record<Exclude<TextSpeed, 'instant'>, number>> = { brisk: 14, measured: 24 }

function readSetting<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  try {
    const value = localStorage.getItem(key)
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

function writeSetting(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* private mode */ }
}

const sceneIdFor = (scene: DialogueSceneData) => scene.id ?? scene.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Reveal delay for the character just typed, so sentences land instead of scrolling. */
export function characterDelay(char: string, base: number) {
  if ('.!?…'.includes(char)) return base * 14
  if ('—:;'.includes(char)) return base * 8
  if (',' === char) return base * 5
  return base
}

export function DialogueScene({ scene, onChoice, onContinue }: DialogueSceneProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedMoments, setSelectedMoments] = useState<Record<string, DialogueMomentChoice>>({})
  const [auto, setAuto] = useState(() => typeof window !== 'undefined' && readSetting(AUTO_KEY, 'off', ['on', 'off']) === 'on')
  const [speed, setSpeed] = useState<TextSpeed>(() => typeof window === 'undefined' ? 'instant' : readSetting<TextSpeed>(TEXT_SPEED_KEY, 'brisk', ['instant', 'brisk', 'measured']))
  const recordMoment = useDialogueMemory()
  const sceneId = sceneIdFor(scene)

  const sequence = useMemo<DisplayLine[]>(() => {
    const lines: DisplayLine[] = []
    scene.lines.forEach((line, sourceIndex) => {
      lines.push({ ...line, sourceIndex })
      for (const moment of scene.moments?.filter((candidate) => candidate.afterLine === sourceIndex) ?? []) {
        const selected = selectedMoments[moment.id]
        if (selected) lines.push({ ...selected.response, sourceIndex, injected: true })
      }
    })
    return lines
  }, [scene, selectedMoments])

  const line = sequence[Math.min(lineIndex, sequence.length - 1)]
  const atEnd = lineIndex === sequence.length - 1
  const progress = ((lineIndex + 1) / sequence.length) * 100
  const portrait = line.speaker !== 'narrator' && line.speaker in ASSETS.portraits
    ? portraitFor(line.speaker as PortraitId, line.emotion)
    : null
  const reactionPortrait = line.reaction && line.reaction.speaker in ASSETS.portraits
    ? portraitFor(line.reaction.speaker as PortraitId, line.reaction.emotion)
    : null
  const activeMoment = !line.injected
    ? scene.moments?.find((moment) => moment.afterLine === line.sourceIndex && !selectedMoments[moment.id])
    : undefined

  // Typewriter reveal. Server rendering shows the whole line so nothing is hidden from a static reader.
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const instant = speed === 'instant' || reducedMotion || typeof window === 'undefined'
  const [shown, setShown] = useState(() => instant ? line.text.length : 0)
  const typing = shown < line.text.length
  const typingRef = useRef(typing)
  typingRef.current = typing

  useEffect(() => {
    setLineIndex(0)
    setHistoryOpen(false)
    setSelectedMoments({})
  }, [scene])

  useEffect(() => {
    if (instant) { setShown(line.text.length); return }
    setShown(0)
    let index = 0
    let timer = 0
    const step = () => {
      index += 1
      setShown(index)
      if (index >= line.text.length) return
      timer = window.setTimeout(step, characterDelay(line.text[index - 1] ?? '', SPEED_MS[speed as Exclude<TextSpeed, 'instant'>]))
    }
    timer = window.setTimeout(step, 120)
    return () => window.clearTimeout(timer)
  }, [line, instant, speed])

  useEffect(() => {
    if (line.pause === 'silence') audioDirector.duck(1600, 0.72)
    else if (line.pause === 'held') audioDirector.duck(900, 0.42)
  }, [line])

  useMusicScene(sceneHasAlienSpeaker(scene) ? 'alien' : 'voyage')

  const revealAll = () => setShown(line.text.length)

  const advance = () => {
    if (typingRef.current) { revealAll(); return }
    if (activeMoment) return
    if (!atEnd) setLineIndex((index) => index + 1)
    else onContinue?.()
  }

  // Auto-play: once a line has landed, wait long enough to read it, then move on.
  useEffect(() => {
    if (!auto || typing || historyOpen || activeMoment || (atEnd && scene.choices)) return
    const wait = 900 + Math.min(4200, line.text.length * 32) + (line.pause === 'silence' ? 1400 : line.pause === 'held' ? 700 : 0)
    const timer = window.setTimeout(() => {
      if (!atEnd) setLineIndex((index) => index + 1)
      else onContinue?.()
    }, wait)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, typing, historyOpen, activeMoment, atEnd, lineIndex, scene])

  const toggleAuto = () => {
    setAuto((value) => {
      writeSetting(AUTO_KEY, value ? 'off' : 'on')
      return !value
    })
  }

  const cycleSpeed = () => {
    setSpeed((value) => {
      const next: TextSpeed = value === 'brisk' ? 'measured' : value === 'measured' ? 'instant' : 'brisk'
      writeSetting(TEXT_SPEED_KEY, next)
      return next
    })
  }

  const chooseMoment = (choice: DialogueMomentChoice) => {
    if (!activeMoment) return
    setSelectedMoments((current) => ({ ...current, [activeMoment.id]: choice }))
    recordMoment({ sceneId, choice })
    audioDirector.playSfx('uiClick', 0.22)
  }

  const chooseFinal = (choice: DialogueChoice) => {
    audioDirector.playSfx('uiClick', 0.28)
    onChoice?.(choice)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (historyOpen) { if (event.key === 'Escape') setHistoryOpen(false); return }
      const key = event.key.toLowerCase()
      if (key === 'a') { toggleAuto(); return }
      if (key === 't') { setHistoryOpen(true); return }
      if (/^[1-4]$/.test(key)) {
        const index = Number(key) - 1
        if (activeMoment && !typing && activeMoment.choices[index]) { chooseMoment(activeMoment.choices[index]); return }
        if (atEnd && !typing && scene.choices?.[index]) { chooseFinal(scene.choices[index]); return }
      }
      if (activeMoment && !typing) return
      if (atEnd && scene.choices && !typing) return
      if (event.key === 'ArrowLeft' && lineIndex > 0) {
        event.preventDefault()
        setLineIndex((index) => Math.max(0, index - 1))
      }
      if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const speedLabel = speed === 'instant' ? 'TEXT · INSTANT' : speed === 'brisk' ? 'TEXT · BRISK' : 'TEXT · MEASURED'

  return (
    <section className={`dialogue-scene scene-${scene.sceneType ?? 'standard'} shot-${line.shot ?? 'medium'} pause-${line.pause ?? 'none'} ${typing ? 'is-typing' : ''}`} style={{ '--scene-bg': `url(${scene.background})` } as React.CSSProperties}>
      <div className="cinematic-bars" aria-hidden="true" />
      <header className="scene-heading">
        <div className="scene-orientation">
          <small>{scene.chapter}</small>
          <strong>{scene.title}</strong>
          {scene.location && <span>{scene.location}</span>}
        </div>
        <div className="scene-tools">
          <button disabled={lineIndex === 0} onClick={() => setLineIndex((index) => Math.max(0, index - 1))}>← Back</button>
          <button onClick={() => setHistoryOpen(true)}>Transcript</button>
          <button className={auto ? 'active' : ''} onClick={toggleAuto} aria-pressed={auto}>Auto {auto ? 'on' : 'off'}</button>
          <button onClick={cycleSpeed}>{speedLabel}</button>
          <small>{String(lineIndex + 1).padStart(2, '0')} / {String(sequence.length).padStart(2, '0')}</small>
        </div>
      </header>

      <div className="dialogue-stage" onClick={(event) => { if ((event.target as HTMLElement).closest('button')) return; if (typing) revealAll() }}>
        {portrait && <img key={`${line.speaker}-${line.emotion ?? 'neutral'}-${lineIndex}`} className={`speaker-portrait emotion-${line.emotion ?? 'neutral'} ${typing ? 'speaking' : ''}`} src={portrait} alt={line.name} />}
        {reactionPortrait && <figure className="reaction-portrait"><img src={reactionPortrait} alt={`${line.reaction?.name} reacts`} /><figcaption>{line.reaction?.name}</figcaption></figure>}
        <div key={lineIndex} className={`dialogue-panel ${portrait ? '' : 'narration'} ${line.cutaway ? 'with-cutaway' : ''}`} aria-live="polite">
          <div className="scene-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
          {line.cue && <p className="stage-cue"><span aria-hidden="true" />{line.cue}</p>}
          <div className="dialogue-body">
            <div className="dialogue-line">
              <div className="speaker-label">
                <strong>{line.name}</strong>
                {line.station && <span>{line.station}</span>}
              </div>
              <p className="dialogue-copy">
                <span className="typed">{line.text.slice(0, shown)}</span>
                {typing && <i className="type-caret" aria-hidden="true" />}
                <span className="untyped" aria-hidden="true">{line.text.slice(shown)}</span>
              </p>
            </div>
            {line.cutaway && (
              <figure className={`story-cutaway fit-${line.cutaway.fit ?? 'cover'}`}>
                <img src={line.cutaway.image} alt="" />
                <figcaption><span>{line.cutaway.label}</span><p>{line.cutaway.caption}</p></figcaption>
              </figure>
            )}
          </div>

          {activeMoment && !typing ? (
            <div className="dialogue-moment">
              <p>{activeMoment.prompt}</p>
              <div>
                {activeMoment.choices.map((choice, index) => (
                  <button key={choice.id} onClick={() => chooseMoment(choice)}>
                    <strong><kbd>{index + 1}</kbd> {choice.label}</strong><small>{choice.detail}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : atEnd && scene.choices && !typing ? (
            <div className="dialogue-choices">
              {scene.choices.map((choice, index) => (
                <button className="choice-button" key={choice.id} onClick={() => chooseFinal(choice)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{choice.label}</strong>
                  <small>{choice.detail}</small>
                </button>
              ))}
            </div>
          ) : (
            <div className="advance-row">
              <small className="key-hints" aria-hidden="true"><kbd>ENTER</kbd> continue · <kbd>←</kbd> back · <kbd>A</kbd> auto · <kbd>T</kbd> transcript</small>
              <button className="advance-button" onClick={advance}>
                {typing ? 'Skip' : atEnd ? scene.continueLabel ?? 'Continue' : line.pause === 'silence' ? 'Break the silence' : 'Continue'} <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {historyOpen && (
        <aside className="dialogue-transcript" role="dialog" aria-modal="true" aria-label="Scene transcript">
          <header><div><small>{scene.chapter}</small><h2>{scene.title}</h2></div><button onClick={() => setHistoryOpen(false)}>Close</button></header>
          <ol>
            {sequence.slice(0, lineIndex + 1).map((entry, index) => (
              <li key={`${entry.name}-${index}`} className={index === lineIndex ? 'current' : ''}>
                <strong>{entry.name}</strong><p>{entry.text}</p>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </section>
  )
}
