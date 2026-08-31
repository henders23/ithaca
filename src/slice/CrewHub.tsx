import { useState } from 'react'
import { ASSETS } from './content.js'
import type { MiniGameResult } from './MiniGames.js'

interface HubQuestion { id: string; label: string; response: string }

const CONVERSATIONS = [
  {
    id: 'cross', name: 'GABRIEL CROSS', station: 'SECURITY WATCH', portrait: ASSETS.portraits['gabriel-cross'], tension: 'ORDER',
    opening: 'Three people tried your access code tonight. One of them used your birthday.',
    questions: [
      { id: 'who', label: '“Who?”', response: 'I know two. I’m not giving you names until I know whether this is an investigation or a purge.' },
      { id: 'afraid', label: '“Are you frightened?”', response: 'Yes. That answer stays in this corridor. I’m frightened they’re right about us.' },
      { id: 'search', label: '“What would a search cost?”', response: 'The conspiracy, maybe. Also every crew member who still thinks a closed bunk belongs to them.' },
    ] satisfies HubQuestion[],
  },
  {
    id: 'corelli', name: 'ISABELLA CORELLI', station: 'NIGHT MEDICAL', portrait: ASSETS.portraits['isabella-corelli'], tension: 'FEAR',
    opening: 'I prescribed sleep to forty-seven people. Twenty asked whether officers get different dreams.',
    questions: [
      { id: 'what-believe', label: '“What do they believe?”', response: 'That there are fewer places in the sphere than there are people on the ship. You never said that. You never said otherwise where they could hear it.' },
      { id: 'mara', label: '“How is Mara Venn?”', response: 'Still fixing other people’s dressings. Fear hasn’t made her useless. Remember that if Cross brings her to you.' },
      { id: 'you', label: '“When did you last sleep?”', response: 'That is almost kind. Ask again after you tell the crew what is behind the door.' },
    ] satisfies HubQuestion[],
  },
  {
    id: 'mori', name: 'LENA MORI', station: 'ENGINEERING ACCESS', portrait: ASSETS.portraits['lena-mori'], tension: 'COST',
    opening: 'Somebody marked the maintenance crawl to containment in grease. Mine, annoyingly.',
    questions: [
      { id: 'danger', label: '“If they open it?”', response: 'The current takes the drive, then the compartments nearest the chamber. Say that shipwide. Use the word “people,” not “containment loss.”' },
      { id: 'suspect', label: '“Who took the plans?”', response: 'Anyone who repaired this ship before you started locking doors. That is most of Engineering.' },
      { id: 'trust', label: '“Do you trust me?”', response: 'With a firing solution? Usually. With a secret that makes everybody else carry the weight? Less every day.' },
    ] satisfies HubQuestion[],
  },
  {
    id: 'elias', name: 'ELIAS', station: 'SERVICE CORE', portrait: ASSETS.portraits.elias, tension: 'TRUST',
    opening: 'I have heard one hundred and nineteen versions of the rumour. The details differ. The wound does not.',
    questions: [
      { id: 'wound', label: '“Name the wound.”', response: 'They think you want home more than you want them alive. Your choices have made the sentence difficult to dismiss.' },
      { id: 'lie', label: '“Would you lie for me?”', response: 'Poorly. You designed maintenance joke seventeen specifically to detect it.' },
      { id: 'remember', label: '“What do you remember?”', response: 'A younger Vale explaining every locked door to the child on the other side. I do not know when he stopped.' },
    ] satisfies HubQuestion[],
  },
] as const

export function CrewRumourHub({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [asked, setAsked] = useState<string[]>([])
  const [response, setResponse] = useState<string | null>(null)
  const [visited, setVisited] = useState<string[]>([])
  const active = CONVERSATIONS.find((item) => item.id === activeId)
  const ready = visited.length >= 3

  const open = (id: string) => { setActiveId(id); setAsked([]); setResponse(null) }
  const ask = (question: HubQuestion) => { setAsked((current) => [...current, question.id]); setResponse(question.response) }
  const leave = () => {
    if (!active) return
    setVisited((current) => current.includes(active.id) ? current : [...current, active.id])
    setActiveId(null); setAsked([]); setResponse(null)
  }

  return (
    <section className="crew-hub" style={{ '--hub-bg': `url(${ASSETS.cinematics.sphereChamber})` } as React.CSSProperties}>
      <header className="hub-heading"><small>{visited.length} / 4 CONVERSATIONS</small></header>
      <div className="hub-intro"><h1>Rumours below decks</h1><p>The current is sealed. Home is visible. Do not summon the crew to another briefing. Walk the ship and ask what command has made difficult to say.</p></div>
      <div className="hub-deck">
        {CONVERSATIONS.map((conversation) => (
          <button key={conversation.id} className={visited.includes(conversation.id) ? 'visited' : ''} onClick={() => open(conversation.id)}>
            <img src={conversation.portrait} alt="" /><span>{conversation.station}</span><strong>{conversation.name}</strong><small>{conversation.tension}</small><i>{visited.includes(conversation.id) ? 'RETURN' : 'SPEAK'}</i>
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
        {!ready && <p>Have real conversations with at least three crew members before deciding.</p>}
      </div>

      {active && (
        <div className="hub-conversation" role="dialog" aria-modal="true" aria-label={`Conversation with ${active.name}`}>
          <div className="hub-portrait"><img src={active.portrait} alt={active.name} /><span>{active.station}</span></div>
          <div className="hub-dialogue">
            <p className="eyebrow">PRIVATE CONVERSATION · {asked.length} / 2 QUESTIONS</p>
            <h2>{active.name}</h2>
            <p>{response ?? active.opening}</p>
            {response ? (
              <button className="advance-button" onClick={() => asked.length >= 2 ? leave() : setResponse(null)}>{asked.length >= 2 ? 'Leave the conversation' : 'Ask something else'} <span>→</span></button>
            ) : (
              <div className="hub-questions">{active.questions.filter((question) => !asked.includes(question.id)).map((question) => <button key={question.id} onClick={() => ask(question)}>{question.label}</button>)}</div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
