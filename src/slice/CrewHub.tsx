import { useState } from 'react'
import { ASSETS } from './content.js'
import type { MiniGameResult } from './MiniGames.js'

const CONVERSATIONS = [
  {
    id: 'cross', name: 'GABRIEL CROSS', station: 'SECURITY WATCH', portrait: ASSETS.portraits['gabriel-cross'],
    tension: 'ORDER',
    lines: [
      'Three people tried Vale’s access code tonight. Nobody believes this is curiosity anymore.',
      'They think command has an escape boat hidden inside that sphere. Fear is learning to organize.',
      'Give me authority to search bunks now, and this ends before somebody touches the chamber.',
    ],
  },
  {
    id: 'corelli', name: 'ISABELLA CORELLI', station: 'NIGHT MEDICAL', portrait: ASSETS.portraits['isabella-corelli'],
    tension: 'FEAR',
    lines: [
      'Half my sleep prescriptions are for people dreaming they died in the sanctuary.',
      'Vale sealed the Gate record, then the sphere, then his own quarters. The crew is filling every silence for him.',
      'Do not treat frightened people like an enemy formation. Ask what they think is being taken from them.',
    ],
  },
  {
    id: 'mori', name: 'LENA MORI', station: 'ENGINEERING ACCESS', portrait: ASSETS.portraits['lena-mori'],
    tension: 'COST',
    lines: [
      'Somebody has been mapping maintenance shafts around containment. They used plans from before the jump.',
      'Every locked door says officers know more than crew. Every repair asks those same crew to die holding it shut.',
      'Tell them exactly what opening the sphere does to my ship. Give consequence a shape they can understand.',
    ],
  },
  {
    id: 'elias', name: 'ELIAS', station: 'SERVICE CORE', portrait: ASSETS.portraits.elias,
    tension: 'TRUST',
    lines: [
      'I have heard one hundred and nineteen versions of the same rumour. The details differ; the wound does not.',
      'The crew believes Vale wants home more than he wants them alive. His decisions have made that story plausible.',
      'A captain cannot correct a rumour only with facts. He must risk being known by the people asked to trust him.',
    ],
  },
] as const

export function CrewRumourHub({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const [visited, setVisited] = useState<string[]>([])
  const active = CONVERSATIONS.find((item) => item.id === activeId)
  const ready = visited.length >= 3

  const open = (id: string) => { setActiveId(id); setLineIndex(0) }
  const advance = () => {
    if (!active) return
    if (lineIndex < active.lines.length - 1) return setLineIndex((value) => value + 1)
    setVisited((current) => current.includes(active.id) ? current : [...current, active.id])
    setActiveId(null)
  }

  return (
    <section className="crew-hub" style={{ '--hub-bg': `url(${ASSETS.cinematics.sphereChamber})` } as React.CSSProperties}>
      <header className="hub-heading"><div><span>BEAT 08</span><strong>CREW DECK · 00:42</strong></div><small>{visited.length} / 4 VOICES HEARD</small></header>
      <div className="hub-intro"><p className="eyebrow">THE FORBIDDEN SPHERE</p><h1>Rumours below decks</h1><p>The current is sealed. Home is visible. Before giving an order, walk the ship and learn what people believe is behind the door.</p></div>
      <div className="hub-deck">
        {CONVERSATIONS.map((conversation) => (
          <button key={conversation.id} className={visited.includes(conversation.id) ? 'visited' : ''} onClick={() => open(conversation.id)}>
            <img src={conversation.portrait} alt="" />
            <span>{conversation.station}</span><strong>{conversation.name}</strong><small>{conversation.tension}</small>
            <i>{visited.includes(conversation.id) ? 'HEARD' : 'SPEAK'}</i>
          </button>
        ))}
      </div>
      <div className="hub-response">
        <span>CAPTAIN’S RESPONSE</span>
        <div>
          <button disabled={!ready} onClick={() => onComplete({ success: true, score: visited.length * 25, choiceId: 'open-sphere-records' })}><strong>Open the records</strong><small>Show every deck what the sphere is—and what it is not.</small></button>
          <button disabled={!ready} onClick={() => onComplete({ success: true, score: visited.length * 25, choiceId: 'reassure-crew' })}><strong>Promise them home</strong><small>Use hope to hold the crew together until the transit completes.</small></button>
          <button disabled={!ready} onClick={() => onComplete({ success: true, score: visited.length * 25, choiceId: 'tighten-security' })}><strong>Lock containment down</strong><small>Trust Cross to prevent action even if suspicion survives.</small></button>
        </div>
        {!ready && <p>Hear at least three crew perspectives before deciding.</p>}
      </div>

      {active && (
        <div className="hub-conversation" role="dialog" aria-modal="true" aria-label={`Conversation with ${active.name}`}>
          <div className="hub-portrait"><img src={active.portrait} alt={active.name} /><span>{active.station}</span></div>
          <div className="hub-dialogue">
            <p className="eyebrow">PRIVATE CONVERSATION · {lineIndex + 1} / {active.lines.length}</p>
            <h2>{active.name}</h2>
            <p>{active.lines[lineIndex]}</p>
            <button className="advance-button" onClick={advance}>{lineIndex === active.lines.length - 1 ? 'Return to crew deck' : 'Listen'} <span>→</span></button>
          </div>
        </div>
      )}
    </section>
  )
}
