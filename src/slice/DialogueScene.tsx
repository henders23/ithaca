import { useEffect, useState } from 'react'
import type { DialogueChoice, DialogueSceneData, PortraitId } from './content.js'
import { ASSETS } from './content.js'

interface DialogueSceneProps {
  scene: DialogueSceneData
  onChoice?: (choice: DialogueChoice) => void
  onContinue?: () => void
}

export function DialogueScene({ scene, onChoice, onContinue }: DialogueSceneProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const line = scene.lines[lineIndex]
  const atEnd = lineIndex === scene.lines.length - 1
  const progress = ((lineIndex + 1) / scene.lines.length) * 100
  const portrait = line.speaker !== 'narrator' && line.speaker in ASSETS.portraits
    ? ASSETS.portraits[line.speaker as PortraitId]
    : null

  useEffect(() => setLineIndex(0), [scene])

  const advance = () => {
    if (!atEnd) setLineIndex((index) => index + 1)
    else onContinue?.()
  }

  return (
    <section className="dialogue-scene" style={{ '--scene-bg': `url(${scene.background})` } as React.CSSProperties}>
      <div className="cinematic-bars" aria-hidden="true" />
      <header className="scene-heading">
        <span>{scene.beat}</span>
        <strong>{scene.chapter}</strong>
        <small>{String(lineIndex + 1).padStart(2, '0')} / {String(scene.lines.length).padStart(2, '0')}</small>
      </header>

      <div className="dialogue-stage">
        {portrait && <img key={`${line.speaker}-${lineIndex}`} className="speaker-portrait" src={portrait} alt={line.name} />}
        <div key={lineIndex} className={`dialogue-panel ${portrait ? '' : 'narration'} ${line.cutaway ? 'with-cutaway' : ''}`} aria-live="polite">
          <div className="scene-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
          <p className="dialogue-title">{scene.title}</p>
          <div className="dialogue-body">
            <div className="dialogue-line">
              {line.cue && <p className="stage-cue">{line.cue}</p>}
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

          {atEnd && scene.choices ? (
            <div className="dialogue-choices">
              {scene.choices.map((choice, index) => (
                <button className="choice-button" key={choice.id} onClick={() => onChoice?.(choice)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{choice.label}</strong>
                  <small>{choice.detail}</small>
                </button>
              ))}
            </div>
          ) : (
            <button className="advance-button" onClick={advance}>
              {atEnd ? scene.continueLabel ?? 'Continue' : 'Continue'} <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
