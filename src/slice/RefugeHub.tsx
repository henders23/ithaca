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
        'Listen. No pump cavitation. No compartment alarms. The Ithaca has not been this quiet since before we launched.',
        allied ? 'Cirene’s scaffolds ask before crossing a bulkhead now. I wrote the boundary. She honoured it.' : 'I still do not trust the living scaffolds. I trust what forty-seven days without another funeral has done to my crews.',
        'If you order departure, I will make her fly. I need you to understand that competence is not the same thing as wanting to leave.',
      ],
    },
    {
      id: 'corelli', name: 'ISABELLA CORELLI', station: 'RECOVERY TERRACE', portrait: ASSETS.portraits['isabella-corelli'], want: 'LIVES BEYOND THE MISSION',
      lines: [
        'Rao walked six kilometres this week. Venn slept through the night without reliving the sphere chamber.',
        copies ? 'The continuations have started using middle names so their friends can stop flinching. They should not have to make themselves smaller for our comfort.' : 'The people left in Cirene’s care are not casualties. They are living somewhere the mission cannot reach them.',
        'Home is not automatically the humane choice because it is yours. Make a case stronger than longing.',
      ],
    },
    {
      id: 'cross', name: 'GABRIEL CROSS', station: 'FORMER FIRING DECK', portrait: ASSETS.portraits['gabriel-cross'], want: 'PURPOSE WITHOUT ANOTHER WAR',
      lines: [
        'They are growing tomatoes where the secondary magazine used to be. I keep checking the ceiling for blast shutters.',
        'I thought comfort would make us soft. The truth is worse: it has made me wonder how much of discipline was exhaustion wearing a uniform.',
        'I still want to leave. I just no longer want obedience to be the only reason anyone comes with us.',
      ],
    },
    {
      id: 'morozova', name: 'HELEN MOROZOVA', station: 'TEMPORAL OBSERVATORY', portrait: ASSETS.portraits['helen-morozova'], want: 'THE OUTSIDE CLOCK',
      lines: [
        'Cirene measures every day we experience. Ask her how many days the stars experience and she changes the subject to recovery.',
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
      <header className="hub-heading"><div><span>BEAT 12</span><strong>REFIT GARDEN · LOCAL DAY 47</strong></div><small>{visited.length} / 4 LIVES WITNESSED</small></header>
      <div className="hub-intro"><p className="eyebrow">A YEAR OUTSIDE TIME</p><h1>A ship forgetting its purpose</h1><p>Before asking the crew to resume the voyage, learn what the refuge has given them—and what returning to command will take away.</p></div>
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
