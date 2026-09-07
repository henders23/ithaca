import { useState } from 'react'
import type { GameState } from '../state/types.js'
import { ASSETS } from './content.js'
import type { MiniGameResult } from './MiniGames.js'

interface RefugeConversation {
  id: string
  name: string
  station: string
  portrait: string
  want: string
  lines: readonly string[]
}

function conversations(game: GameState): readonly RefugeConversation[] {
  const allied = game.flags.includes('cirene-allied')
  const copies = game.flags.includes('cirene-copies-recognized')
  const mutinyForgiven = game.flags.includes('mutiny-leader-forgiven')
  return [
    {
      id: 'mori', name: 'LENA MORI', station: 'REFIT GARDEN', portrait: ASSETS.portraits['lena-mori'], want: 'A SHIP THAT CAN REST',
      lines: [
        'Hear that? Nothing. I keep waking up to check why nothing is breaking. Tea? You have to hold a cloth under the kettle. Seal’s gone. I’ll fix it tomorrow.',
        allied ? 'Cirene’s scaffolds ask before crossing a bulkhead now. I wrote the boundary. She honoured it.' : 'I still do not trust the living scaffolds. I trust what forty-seven days without another funeral has done to my crews.',
        'I have a list of little things I’ll fix tomorrow. First time in months I’ve believed there’d be a tomorrow for them. If we’re leaving, give me a day. Let me finish something.',
      ],
    },
    {
      id: 'corelli', name: 'ISABELLA CORELLI', station: 'RECOVERY TERRACE', portrait: ASSETS.portraits['isabella-corelli'], want: 'LIVES BEYOND THE MISSION',
      lines: [
        'Venn says he’s sleeping. I asked again when the others left. He said he keeps a light on. I put him on the yellow sheet—people to ask twice.',
        copies ? 'The continuations have started using middle names so their friends can stop flinching. They should not have to make themselves smaller for our comfort.' : 'The people left in Cirene’s care are not casualties. They are living somewhere the mission cannot reach them.',
        'He’s planted something outside his room. Won’t say what it is until it flowers. If you ask him to leave, ask about that first.',
      ],
    },
    {
      id: 'cross', name: 'GABRIEL CROSS', station: 'FORMER FIRING DECK', portrait: ASSETS.portraits['gabriel-cross'], want: 'PURPOSE WITHOUT ANOTHER WAR',
      lines: [
        'They are growing tomatoes where the secondary magazine used to be. I keep checking the ceiling for blast shutters.',
        'I brought the bottle down here last night. Sat with it for an hour. Took it back unopened. I don’t know what I’m waiting for now.',
        'I still want to leave. Just—when you ask the others, let them say it themselves. We’ve had enough people answer at attention.',
      ],
    },
    {
      id: 'morozova', name: 'HELEN MOROZOVA', station: 'TEMPORAL OBSERVATORY', portrait: ASSETS.portraits['helen-morozova'], want: 'THE OUTSIDE CLOCK',
      lines: [
        'The blue tabs are the skies we couldn’t name. I thought we might get a quiet afternoon to finish them. Then I checked Cirene’s clock against a pulsar.',
        mutinyForgiven ? 'You accepted that silence helped create the sphere mutiny. Do not build another silence because this one feels merciful.' : 'After the sphere, you answered fear with control. Here control has been replaced by comfort. Both can stop people asking the necessary question.',
        'N’Dala found a carrier leaking through the shield. Come to communications. We need to know what this refuge has cost outside it.',
      ],
    },
  ]
}

export function RefugeHub({ game, onComplete }: { game: GameState; onComplete: (result: MiniGameResult) => void }) {
  const items = conversations(game)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const [visited, setVisited] = useState<string[]>([])
  const active = items.find((item) => item.id === activeId)
  const ready = visited.length >= 3 && visited.includes('morozova')
  const open = (id: string) => { setActiveId(id); setLineIndex(0) }
  const advance = () => {
    if (!active) return
    if (lineIndex < active.lines.length - 1) return setLineIndex((value) => value + 1)
    setVisited((current) => current.includes(active.id) ? current : [...current, active.id])
    setActiveId(null)
  }
  return (
    <section className="crew-hub refuge-hub" style={{ '--hub-bg': `url(${ASSETS.cinematics.cireneRefitYear})` } as React.CSSProperties}>
      <header className="hub-heading"><small>{visited.length} / 4 LIVES WITNESSED</small></header>
      <div className="hub-intro"><h1>A ship forgetting its purpose</h1><p>Before asking the crew to resume the voyage, learn what the refuge has given them—and what returning to command will take away.</p></div>
      <div className="hub-deck">
        {items.map((item) => <button key={item.id} className={visited.includes(item.id) ? 'visited' : ''} onClick={() => open(item.id)}><img src={item.portrait} alt="" /><span>{item.station}</span><strong>{item.name}</strong><small>{item.want}</small><i>{visited.includes(item.id) ? 'HEARD' : 'SPEAK'}</i></button>)}
      </div>
      <div className="hub-response">
        <span>THE QUESTION OUTSIDE THE REFUGE</span>
        <div><button disabled={!ready} onClick={() => onComplete({ success: true, score: visited.length * 25, choiceId: 'crew-life-witnessed' })}><strong>Open the external carrier</strong><small>Compare the ark’s forty-seven days with the time that passed beyond its shield.</small></button></div>
        {!ready && <p>Hear at least three crew perspectives, including Morozova’s warning.</p>}
      </div>
      {active && <div className="hub-conversation" role="dialog" aria-modal="true" aria-label={`Conversation with ${active.name}`}><div className="hub-portrait"><img src={active.portrait} alt={active.name} /><span>{active.station}</span></div><div className="hub-dialogue"><p className="eyebrow">PRIVATE CONVERSATION · {lineIndex + 1} / {active.lines.length}</p><h2>{active.name}</h2><strong className="hub-character-want">WANTS · {active.want}</strong><p>{active.lines[lineIndex]}</p><button className="advance-button" onClick={advance}>{lineIndex === active.lines.length - 1 ? 'Return to the garden' : 'Listen'} <span>→</span></button></div></div>}
    </section>
  )
}
