import type { GameState } from '../state/types.js'
import type { InterludeData } from './content.js'

export function BeatInterlude({ data, game, onContinue }: { data: InterludeData; game: GameState; onContinue: () => void }) {
  const record = captainRecord(data.id, game)

  return (
    <section className="beat-interlude" style={{ '--interlude-bg': `url(${data.background})` } as React.CSSProperties}>
      <div className="interlude-scan" aria-hidden="true" />
      <header className="interlude-masthead">
        <span>CSV-141 · COMMAND RECORD</span>
        <strong>VOYAGE INTERLUDE</strong>
        <small>{data.elapsed}</small>
      </header>

      <div className="interlude-content">
        <div className="interlude-copy">
          <p className="eyebrow">INCOMING · BEAT {String(data.incomingBeat).padStart(2, '0')}</p>
          <h1>{data.headline}</h1>
          <p className="interlude-location">{data.location}</p>
          <p className="interlude-recap">{data.recap}</p>

          <div className="interlude-briefing">
            <div>
              <span>SITUATION</span>
              <ul>{data.situation.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="captain-record">
              <span>THE VOYAGE REMEMBERS</span>
              <p>{record}</p>
            </div>
          </div>

          <div className="interlude-objective">
            <span>NEXT OBJECTIVE</span>
            <strong>{data.objective}</strong>
          </div>
          <button className="primary-action" onClick={onContinue}>{data.continueLabel} <span>→</span></button>
        </div>

        <aside className="interlude-telemetry">
          <div className="telemetry-orbit"><i /><i /><i /><b>{data.incomingBeat}</b></div>
          <Metric label="HULL INTEGRITY" value={`${game.ship.hull}%`} tone={game.ship.hull < 60 ? 'danger' : 'stable'} />
          <Metric label="DRIVE" value={game.ship.systems.engines.status.toUpperCase()} tone={game.ship.systems.engines.status === 'online' ? 'stable' : 'danger'} />
          <Metric label="PURSUIT TRACE" value={game.pursuit === 0 ? 'NONE' : String(game.pursuit).padStart(2, '0')} tone={game.pursuit > 8 ? 'danger' : 'stable'} />
          <div className="beat-route" aria-label="Vertical slice progress">
            {[1, 2, 3, 4].map((beat) => <span key={beat} className={beat < data.incomingBeat ? 'done' : beat === data.incomingBeat ? 'current' : ''}>{String(beat).padStart(2, '0')}</span>)}
          </div>
        </aside>
      </div>
    </section>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: 'stable' | 'danger' }) {
  return <div className={`interlude-metric ${tone}`}><span>{label}</span><strong>{value}</strong><i /></div>
}

function captainRecord(id: InterludeData['id'], game: GameState): string {
  if (id === 'interlude-02') {
    if (game.flags.includes('tide-gate-scanned')) return 'Vale delayed the firing order long enough to confirm the Gate carried living telemetry. The crew knows the captain saw part of the truth before the sanctuary died.'
    if (game.relationships['gabriel-cross'] > game.relationships['helen-morozova']) return 'Vale chose the firing window over certainty. Cross delivered the victory; Morozova is carrying the question nobody on the bridge can avoid.'
    return 'Vale ordered a surgical breach. It became a killing blow. Cunning saved the battle and failed the thing inside the Gate.'
  }
  if (id === 'interlude-03') {
    if (game.flags.includes('vale-questioned-orders')) return 'The complete Gate record is now public aboard ship. Vale’s authority survived the truth, but command will no longer be mistaken for innocence.'
    return 'The Gate record remains sealed. Order is holding—for now—but Morozova knows exactly which truth the captain has asked her to carry alone.'
  }
  if (game.flags.includes('deserters-forced-back')) return 'The departing shuttle was recovered. Twenty-three crew are aboard again; not all of them consider themselves rescued.'
  return 'Twenty-three crew remained in Eirenai. The Ithaca is lighter, and nobody agrees whether Vale granted freedom or abandoned the people being brought home.'
}
