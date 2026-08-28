import type { GameState } from '../state/types.js'
import type { InterludeData } from './content.js'

export function BeatInterlude({ data, game, onContinue }: { data: InterludeData; game: GameState; onContinue: () => void }) {
  const record = captainRecord(data.id, game)
  const route = data.incomingBeat <= 8
    ? Array.from({ length: 8 }, (_, index) => index + 1)
    : data.incomingBeat <= 17
      ? Array.from({ length: 9 }, (_, index) => index + 9)
      : data.incomingBeat <= 27
        ? Array.from({ length: 10 }, (_, index) => index + 18)
        : Array.from({ length: 5 }, (_, index) => index + 28)

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
          <div className="beat-route" aria-label="Act one progress">
            {route.map((beat) => <span key={beat} className={beat < data.incomingBeat ? 'done' : beat === data.incomingBeat ? 'current' : ''}>{String(beat).padStart(2, '0')}</span>)}
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
  if (id === 'interlude-04') {
    if (game.flags.includes('deserters-forced-back')) return 'The departing shuttle was recovered. Twenty-three crew are aboard again; not all of them consider themselves rescued.'
    return 'Twenty-three crew remained in Eirenai. The Ithaca is lighter, and nobody agrees whether Vale granted freedom or abandoned the people being brought home.'
  }
  if (id === 'interlude-05') {
    if (game.flags.includes('argus-awakened')) return 'ARGUS saw the Ithaca clearly before the escape. The broadcast carries a complete combat silhouette and every weapon frequency Cross used.'
    return 'The stolen null harmonic kept ARGUS half-blind. Its broadcast is incomplete, but the question at its center remains: identify the intruder.'
  }
  if (id === 'interlude-06') {
    if (game.flags.includes('vale-revealed-name')) return 'Vale’s name is travelling on the ARGUS carrier. Pride, confession, or calculation has given the pursuer a person to answer.'
    if (game.flags.includes('vale-used-false-identity')) return 'A false captain travels on the carrier. ELIAS warns that lies slow a determined search; they do not end it.'
    return 'Vale named the Ithaca but not himself. The entire crew now shares the identity sent into the dark.'
  }
  if (id === 'interlude-07') {
    const loss = choiceFor(game, 'sacrifice-system')?.replaceAll('-', ' ') ?? 'a ship system'
    return `The Ithaca escaped by severing ${loss}. Mori has recorded the choice as a casualty, not a repair.`
  }
  if (id === 'interlude-22') {
    const rescued = game.evidence.find((item) => item.startsWith('scylla-rescued:'))?.slice('scylla-rescued:'.length) ?? 'none'
    return rescued === 'none' ? 'No captive returned from Scylla. Helios receives a ship carrying six deliberate silences.' : `The rescue ledger carries ${rescued.replaceAll(',', ', ')} into Helios. Their skills—and the names left behind—remain active consequences.`
  }
  if (id === 'interlude-23') {
    if (game.evidence.includes('helios-ban-ratified')) return 'The no-harvest rule was ratified by the crew. Shared consent did not make six days of cold equally bearable.'
    if (game.evidence.includes('helios-ecology-published')) return 'Every deck received the proof that Helios is alive and the full ration cost of restraint. Nobody behind the pressure door can claim ignorance.'
    return 'Vale protected Helios by direct command while withholding operational detail. The familiar shape of secrecy returned before the hunger did.'
  }
  if (id === 'interlude-24') {
    if (game.flags.includes('helios-remnant-preserved')) return 'The first organism died, but the override stopped the second extraction and preserved a fading remnant. Helios can hear both the killing and its limit.'
    return 'The cradle consumed the organism completely. Whatever judgment Vale passed on the mutiny, Helios receives no surviving fragment from the ship.'
  }
  if (id === 'interlude-25') {
    const strikes = game.evidence.find((item) => item.startsWith('coronal-strikes:'))?.slice('coronal-strikes:'.length) ?? '0'
    return `The nursery survived the firing corridor. The Ithaca carries ${strikes} unabsorbed routing strike${strikes === '1' ? '' : 's'} and a drive that now requires one visible human cost.`
  }
  if (id === 'interlude-26') {
    const companion = game.evidence.find((item) => item.startsWith('last-companion:'))?.slice('last-companion:'.length)?.replaceAll('-', ' ') ?? 'the last companion'
    return `${companion} is dead, not missing. The impossible horizon appears only after the memorial, and no promise on the shore is permitted to erase that sequence.`
  }
  if (id === 'interlude-27') {
    const baseYears = Number(game.evidence.find((item) => item.startsWith('calypso-years:'))?.split(':')[1] ?? 9)
    const extraYears = Number(game.evidence.find((item) => item.startsWith('calypso-extra-years:'))?.split(':')[1] ?? 0)
    const years = baseYears + extraYears
    const offer = choiceFor(game, 'immortality-offer')?.replaceAll('-', ' ') ?? 'unanswered'
    return `The false-home investigation proves the reconstruction. ${years} external years passed before Vale answered Calypso’s offer: ${offer}.`
  }
  if (id === 'interlude-28') {
    const departure = choiceFor(game, 'terms-of-departure')?.replaceAll('-', ' ') ?? 'terms unrecorded'
    const integrity = game.evidence.find((item) => item.startsWith('identity-integrity:'))?.split(':')[1] ?? '0'
    return `Vale crossed the identity maze with ${integrity} outward anchors and departed under these terms: ${departure}. Calypso’s second Vale remains a future witness or adversary.`
  }
  const keeperChoice = choiceFor(game, 'keeper-negotiation')
  if (keeperChoice === 'tell-keeper-truth') return 'Vale gave Aeolia the unvarnished Gate record. The sphere was entrusted to the crew on the condition that truth would travel with it.'
  if (keeperChoice === 'conceal-sanctuary') return 'Vale secured the sphere with another omission. Morozova knows home is now riding inside a bargain founded on the same kind of silence.'
  return 'Aeolia heard the military account and offered the current with reservations. Hospitality has bought time, not absolution.'
}

function choiceFor(game: GameState, activityId: string): string | undefined {
  for (let index = game.decisions.length - 1; index >= 0; index--) {
    if (game.decisions[index].activityId === activityId) return game.decisions[index].choiceId
  }
  return undefined
}
