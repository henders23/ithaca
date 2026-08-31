import { useEffect, useMemo, useState } from 'react'
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

const sceneIdFor = (scene: DialogueSceneData) => scene.id ?? scene.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function DialogueScene({ scene, onChoice, onContinue }: DialogueSceneProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedMoments, setSelectedMoments] = useState<Record<string, DialogueMomentChoice>>({})
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

  useEffect(() => {
    setLineIndex(0)
    setHistoryOpen(false)
    setSelectedMoments({})
  }, [scene])

  useEffect(() => {
    if (line.pause === 'silence') audioDirector.duck(1600, 0.72)
    else if (line.pause === 'held') audioDirector.duck(900, 0.42)
  }, [line])

  useMusicScene(sceneHasAlienSpeaker(scene) ? 'alien' : 'voyage')

  const advance = () => {
    if (activeMoment) return
    if (!atEnd) setLineIndex((index) => index + 1)
    else onContinue?.()
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (historyOpen || activeMoment || (atEnd && scene.choices)) return
      if (event.key === 'ArrowLeft' && lineIndex > 0) {
        event.preventDefault()
        setLineIndex((index) => Math.max(0, index - 1))
      }
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

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

  return (
    <section className={`dialogue-scene scene-${scene.sceneType ?? 'standard'} shot-${line.shot ?? 'medium'} pause-${line.pause ?? 'none'}`} style={{ '--scene-bg': `url(${scene.background})` } as React.CSSProperties}>
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
          <small>{String(lineIndex + 1).padStart(2, '0')} / {String(sequence.length).padStart(2, '0')}</small>
        </div>
      </header>

      <div className="dialogue-stage">
        {portrait && <img key={`${line.speaker}-${line.emotion ?? 'neutral'}-${lineIndex}`} className={`speaker-portrait emotion-${line.emotion ?? 'neutral'}`} src={portrait} alt={line.name} />}
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
              <p className="dialogue-copy">{line.text}</p>
            </div>
            {line.cutaway && (
              <figure className={`story-cutaway fit-${line.cutaway.fit ?? 'cover'}`}>
                <img src={line.cutaway.image} alt="" />
                <figcaption><span>{line.cutaway.label}</span><p>{line.cutaway.caption}</p></figcaption>
              </figure>
            )}
          </div>

          {activeMoment ? (
            <div className="dialogue-moment">
              <p>{activeMoment.prompt}</p>
              <div>
                {activeMoment.choices.map((choice) => (
                  <button key={choice.id} onClick={() => chooseMoment(choice)}>
                    <strong>{choice.label}</strong><small>{choice.detail}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : atEnd && scene.choices ? (
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
            <button className="advance-button" onClick={advance}>
              {atEnd ? scene.continueLabel ?? 'Continue' : line.pause === 'silence' ? 'Break the silence' : 'Continue'} <span aria-hidden="true">→</span>
            </button>
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
