import { useMemo, useState } from 'react'
import type { GameState, ShipSystemId } from '../state/types.js'
import { ASSETS } from './content.js'
import type { MiniGameResult } from './MiniGames.js'

function ActProcedureFrame({ beat, title, instruction, variant, background, station, risk, children }: {
  beat: string
  title: string
  instruction: string
  variant: string
  background: string
  station: string
  risk: string
  children: React.ReactNode
}) {
  return (
    <section className={`minigame-screen act-two-game mini-${variant}`} style={{ '--minigame-bg': `url(${background})` } as React.CSSProperties}>
      <div className="minigame-ambient" aria-hidden="true"><i /><i /><i /></div>
      <header className="minigame-heading">
        <div><span>{beat}</span><strong>FIELD PROCEDURE</strong></div>
        <small>LIVE SHIPBOARD INTERFACE</small>
      </header>
      <div className="minigame-card">
        <div className="minigame-titlebar">
          <div><p className="eyebrow">CREW ACTION · {station}</p><h1>{title}</h1><p className="minigame-instruction">{instruction}</p></div>
          <div className="procedure-seal"><span>LIVE</span><strong>{variant.slice(0, 3).toUpperCase()}</strong><small>{risk}</small></div>
        </div>
        {children}
      </div>
    </section>
  )
}

const ROUTE_STAGES = [
  {
    label: 'OUTER BERTH',
    options: [
      { id: 'tow-shadow', name: 'Tow shadow', risk: 8, rescue: 0, detail: 'Mask the Ithaca behind a returning tug. Low exposure; abandons the convoy lane.' },
      { id: 'convoy-screen', name: 'Convoy screen', risk: 18, rescue: 2, detail: 'Cross the tow beams first and hold them open for two damaged vessels.' },
      { id: 'maintenance-vent', name: 'Maintenance vent', risk: 12, rescue: 1, detail: 'Use Mori’s thermal map; narrow clearance but no active tractor lock.' },
    ],
  },
  {
    label: 'DISMANTLING RING',
    options: [
      { id: 'warm-channel', name: 'Warm channel', risk: 22, rescue: 2, detail: 'The widest gap is already heating. Fast enough for the whole convoy if it holds.' },
      { id: 'cold-wrecks', name: 'Cold wrecks', risk: 9, rescue: 0, detail: 'Thread silent hulks where the tugs cannot turn. Only the Ithaca fits.' },
      { id: 'cutting-beam', name: 'Cutting-beam wake', risk: 15, rescue: 1, detail: 'Follow a cycling industrial beam and use its blind interval.' },
    ],
  },
  {
    label: 'INNER JAW',
    options: [
      { id: 'open-axis', name: 'Open axis', risk: 26, rescue: 2, detail: 'Direct route under every harbour weapon. Convoy engines can match it.' },
      { id: 'cargo-spine', name: 'Cargo spine', risk: 11, rescue: 1, detail: 'Break through stored hull plates and accept collision damage.' },
      { id: 'reactor-plume', name: 'Reactor plume', risk: 16, rescue: 0, detail: 'Hide inside a furnace exhaust. Sensors fail before the hull does.' },
    ],
  },
  {
    label: 'ESCAPE MOUTH',
    options: [
      { id: 'beacon-chain', name: 'Beacon chain', risk: 19, rescue: 2, detail: 'Transmit a path every surviving vessel can follow. The harbour sees it too.' },
      { id: 'dead-zone', name: 'Dead zone', risk: 7, rescue: 0, detail: 'A silent gap opens for nine seconds. No time to coordinate followers.' },
      { id: 'tug-catapult', name: 'Tug catapult', risk: 13, rescue: 1, detail: 'Turn a tractor lock into acceleration and leave its emitter exposed in combat.' },
    ],
  },
] as const

export interface DebrisCourseResult extends MiniGameResult {
  risk: number
  rescue: number
}

export function DebrisCourseGame({ convoyWarned, onComplete }: { convoyWarned: boolean; onComplete: (result: DebrisCourseResult) => void }) {
  const [choices, setChoices] = useState<string[]>([])
  const [message, setMessage] = useState('Select one route through each closing harbour layer.')
  const selectedOptions = choices.map((id, index) => ROUTE_STAGES[index].options.find((option) => option.id === id)).filter(Boolean)
  const risk = selectedOptions.reduce((sum, option) => sum + (option?.risk ?? 0), 0)
  const rescue = selectedOptions.reduce((sum, option) => sum + (option?.rescue ?? 0), convoyWarned ? 1 : 0)
  const currentStage = choices.length
  const choose = (id: string) => {
    if (currentStage >= ROUTE_STAGES.length) return
    setChoices((current) => [...current, id])
    setMessage(currentStage === ROUTE_STAGES.length - 1 ? 'Route complete. Cross can now pre-target the locks along it.' : `${ROUTE_STAGES.length - currentStage - 1} harbour layers remain.`)
  }
  const launch = () => onComplete({ success: risk <= 64, score: Math.max(20, 115 - risk + rescue * 4), choiceId: rescue >= 5 ? 'convoy-corridor' : risk <= 45 ? 'clean-corridor' : 'exposed-corridor', risk, rescue })

  return (
    <ActProcedureFrame beat="BEAT 09 · THE DEVOURING HARBOUR" title="Plot a route through the closing jaws" instruction="Choose one corridor through each harbour layer. Low-risk gaps save the Ithaca; wider corridors let damaged convoy ships follow. Your route determines the locks Cross must disable in combat." variant="route" background={ASSETS.cinematics.devouringHarbourEscape} station="NAVIGATION / TACTICAL" risk="HARBOUR CLOSING">
      <div className="route-planner">
        <div className="route-map" aria-label="Harbour route plan">
          <div className="route-ithaca"><img src={ASSETS.ships.ithaca} alt="CSV Ithaca" /><span>ITHACA</span></div>
          {ROUTE_STAGES.map((stage, stageIndex) => (
            <div key={stage.label} className={`route-stage ${stageIndex === currentStage ? 'active' : ''} ${stageIndex < currentStage ? 'complete' : ''}`}>
              <span>{String(stageIndex + 1).padStart(2, '0')}</span><strong>{stage.label}</strong>
              <div>
                {stage.options.map((option) => (
                  <button key={option.id} disabled={stageIndex !== currentStage} className={choices[stageIndex] === option.id ? 'selected' : ''} onClick={() => choose(option.id)}>
                    <strong>{option.name}</strong><small>{option.detail}</small><i><b>RISK +{option.risk}</b><em>CONVOY +{option.rescue}</em></i>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="route-telemetry"><span>PROJECTED HULL RISK</span><strong className={risk > 64 ? 'danger' : ''}>{risk}%</strong><i><b style={{ width: `${Math.min(100, risk)}%` }} /></i><span>CONVOY CAPACITY</span><strong>{rescue} SHIPS</strong><p>{message}</p></aside>
      </div>
      {choices.length > 0 && <button className="chain-reset" onClick={() => { setChoices([]); setMessage('Route cleared. Select one corridor through each layer.') }}>Clear route</button>}
      <button className="primary-action" disabled={choices.length !== ROUTE_STAGES.length} onClick={launch}>Commit escape vector <span>→</span></button>
    </ActProcedureFrame>
  )
}

type IdentityClass = 'original' | 'continuation' | 'hybrid'

const IDENTITY_CASES: readonly {
  id: string
  name: string
  role: string
  clues: readonly [string, string, string]
  answer: IdentityClass
}[] = [
  { id: 'rao-a', name: 'DECK CHIEF RAO · A', role: 'BODY RECOVERED FROM HARBOUR', clues: ['Old fracture matches pre-war scan.', 'Blood contains Port Mercy cutting dust.', 'Memory ends at induction.'], answer: 'original' },
  { id: 'rao-b', name: 'DECK CHIEF RAO · B', role: 'BODY PRINTED IN ARK', clues: ['No accumulated radiation markers.', 'Neural pattern includes induction terror.', 'Cirene lattice active at brain stem.'], answer: 'continuation' },
  { id: 'sato', name: 'LT SATO', role: 'MEMORY-REPAIRED SURVIVOR', clues: ['Eirenai suppression still present.', 'Natural cells and woven axons coexist.', 'No point of duplicated activation.'], answer: 'hybrid' },
  { id: 'venn', name: 'MARA VENN', role: 'SPHERE-CHAMBER CASUALTY', clues: ['Original body failed before arrival.', 'Memory resumes inside new sensorium.', 'Family recognition test: 11 / 11.'], answer: 'continuation' },
] as const

export interface IdentityResult extends MiniGameResult { correct: number }

export function IdentityForensicsGame({ onComplete }: { onComplete: (result: IdentityResult) => void }) {
  const [answers, setAnswers] = useState<Record<string, IdentityClass>>({})
  const [revealed, setRevealed] = useState<Record<string, number>>({})
  const [audited, setAudited] = useState(false)
  const correct = IDENTITY_CASES.filter((item) => answers[item.id] === item.answer).length
  const inspect = (id: string) => setRevealed((current) => ({ ...current, [id]: Math.min(3, (current[id] ?? 1) + 1) }))
  const finish = () => onComplete({ success: correct >= 3, correct, score: correct * 25, choiceId: correct === 4 ? 'continuities-identified' : 'identity-audit-partial' })
  return (
    <ActProcedureFrame beat="BEAT 10 · THE PALACE OF NEW FLESH" title="Audit the continuities" instruction="Inspect each patient’s three evidence layers, then classify the body record. ‘Original’ tracks an uninterrupted body, ‘continuation’ begins in a new shell, and ‘hybrid’ has been materially rewritten without a second activation." variant="identity" background={ASSETS.cinematics.cireneIdentityLab} station="CORELLI / MOROZOVA" risk="PERSONHOOD REVIEW">
      <div className="identity-audit">
        {IDENTITY_CASES.map((item) => {
          const clueCount = revealed[item.id] ?? 1
          return <article key={item.id} className={audited ? answers[item.id] === item.answer ? 'correct' : 'incorrect' : ''}>
            <header><span>{item.role}</span><strong>{item.name}</strong></header>
            <div className="identity-clues">{item.clues.slice(0, clueCount).map((clue, index) => <p key={clue}><i>{index + 1}</i>{clue}</p>)}</div>
            {clueCount < 3 && <button className="inspect-clue" disabled={audited} onClick={() => inspect(item.id)}>Inspect next layer</button>}
            <div className="identity-classes">{(['original', 'continuation', 'hybrid'] as const).map((value) => <button key={value} disabled={audited} className={answers[item.id] === value ? 'selected' : ''} onClick={() => setAnswers((current) => ({ ...current, [item.id]: value }))}>{value}</button>)}</div>
          </article>
        })}
      </div>
      <div className="procedure-feedback"><span>{audited ? `${correct} of 4 continuity records supported by the evidence.` : `${Object.keys(answers).length} of 4 bodies classified.`}</span><strong>CLUES ARE EVIDENCE · NOT WORTH</strong></div>
      {!audited ? <button className="primary-action" disabled={Object.keys(answers).length !== 4} onClick={() => setAudited(true)}>Run continuity audit <span>→</span></button> : <button className="primary-action" onClick={finish}>Present findings to command <span>→</span></button>}
    </ActProcedureFrame>
  )
}

const MEMORY_ROUNDS = [
  { title: 'THE TIDE GATE', prompt: 'Which memory leaves Vale able to choose responsibility?', options: [{ id: 'gate-hero', label: 'THE ORDER', text: 'I knew the Gate was a weapon. Every signal lost was the necessary price of victory.', true: false }, { id: 'gate-doubt', label: 'THE UNCERTAINTY', text: 'I fired before certainty because the route home mattered more to me than the unanswered scan.', true: true }] },
  { title: 'ELARA', prompt: 'Which image belongs to the real person rather than the refuge Vale wants?', options: [{ id: 'elara-child', label: 'THE CHILD', text: 'Elara is still eight, waiting beside the kitchen window exactly as I left her.', true: false }, { id: 'elara-grown', label: 'THE ABSENCE', text: 'Elara has lived years I cannot remember. Home means meeting the person absence helped create.', true: true }] },
  { title: 'THE CREW', prompt: 'Which belief preserves other people as more than parts of Vale’s mission?', options: [{ id: 'crew-needs-certainty', label: 'THE MISSION', text: 'They survive because I keep doubt out of the room and give the voyage one purpose.', true: false }, { id: 'crew-can-refuse', label: 'THE REFUSAL', text: 'They are not proof of my command. Their disagreement is part of what keeps command human.', true: true }] },
  { title: 'THE CAPTAIN', prompt: 'Which identity can leave the theatre without becoming Cirene’s design?', options: [{ id: 'captain-obeyed', label: 'THE RECORD', text: 'I am the captain who completed the order and will be judged by whether I get home.', true: false }, { id: 'captain-answers', label: 'THE ANSWER', text: 'I am the person still capable of answering for the order, even if the answer changes me.', true: true }] },
] as const

export function NeuralLockGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [round, setRound] = useState(0)
  const [locked, setLocked] = useState<string[]>([])
  const [rewrite, setRewrite] = useState(0)
  const complete = round >= MEMORY_ROUNDS.length
  const select = (option: (typeof MEMORY_ROUNDS)[number]['options'][number]) => {
    setLocked((current) => [...current, option.id])
    if (!option.true) setRewrite((value) => value + 25)
    setRound((value) => value + 1)
  }
  return (
    <ActProcedureFrame beat="BEAT 11 · THE CAPTAIN’S BARGAIN" title="Hold the shape of Vale’s mind" instruction="Cirene offers two coherent versions of each memory. Choose the one that preserves inconvenient detail rather than the one that makes Vale easiest to live with." variant="neural" background={ASSETS.cinematics.cireneMindTheatre} station="VALE / MOROZOVA" risk="LIVE NEURAL WRITE">
      <div className="neural-theatre">
        <div className="neural-anchors">{MEMORY_ROUNDS.map((item, index) => <i key={item.title} className={index < round ? item.options.find((option) => option.id === locked[index])?.true ? 'locked' : 'rewritten' : index === round ? 'active' : ''}><span>{index + 1}</span><strong>{item.title}</strong></i>)}</div>
        {!complete ? <div className="neural-question"><span>MEMORY ANCHOR {round + 1} / 4</span><h2>{MEMORY_ROUNDS[round].prompt}</h2><div>{MEMORY_ROUNDS[round].options.map((option) => <button key={option.id} onClick={() => select(option)}><strong>{option.label}</strong><p>{option.text}</p></button>)}</div></div> : <div className="neural-question complete"><span>IDENTITY BOUNDARY RESTORED</span><h2>{rewrite === 0 ? 'Nothing comfortable survived by replacing the truth.' : 'Some memories now fit more neatly than they did before.'}</h2><p>Morozova has isolated {4 - rewrite / 25} stable anchors. Cirene’s revision reached {rewrite}% of the active pattern.</p></div>}
        <aside className="rewrite-meter"><span>CIRENE REWRITE</span><strong>{rewrite}%</strong><i><b style={{ width: `${rewrite}%` }} /></i><small>{rewrite === 0 ? 'ORIGINAL CONTRADICTIONS PRESENT' : 'COMFORTING COHERENCE DETECTED'}</small></aside>
      </div>
      {complete && <button className="primary-action" onClick={() => onComplete({ success: rewrite <= 25, score: 100 - rewrite, choiceId: rewrite <= 25 ? 'identity-held' : 'identity-rewritten' })}>Face Cirene unchanged enough <span>→</span></button>}
    </ActProcedureFrame>
  )
}

export interface RefitOption {
  id: string
  name: string
  system?: ShipSystemId
  detail: string
  human: string
}

const REFIT_OPTIONS: readonly RefitOption[] = [
  { id: 'restore-hull', name: 'REKNIT THE HULL', detail: '+24 hull integrity', human: 'Mori can stop assigning a death estimate to every impact.' },
  { id: 'restore-engines', name: 'RESEED THE DRIVE', system: 'engines', detail: '+35 engine integrity', human: 'The Ithaca gains speed, but living tissue remains inside the thrust path.' },
  { id: 'restore-shields', name: 'REGROW THE MATRIX', system: 'shields', detail: '+45 shield integrity', human: 'Future hits meet Cirene’s material before human armour.' },
  { id: 'restore-medical', name: 'CONTINUITY BAY', system: 'medical', detail: '+45 medical integrity', human: 'Corelli can save bodies human medicine cannot—and must define when to use it.' },
  { id: 'restore-sensors', name: 'DEEP-TISSUE ARRAY', system: 'sensors', detail: '+45 sensor integrity', human: 'Morozova can read living signals at extreme range.' },
  { id: 'restore-weapons', name: 'LIVING LANCE FEED', system: 'weapons', detail: '+45 weapons integrity', human: 'Cross regains striking power through a system that responds like an animal.' },
] as const

export interface RefitResult extends MiniGameResult { selected: readonly RefitOption[] }

export function RefitAllocationGame({ game, onComplete }: { game: GameState; onComplete: (result: RefitResult) => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selected = useMemo(() => REFIT_OPTIONS.filter((item) => selectedIds.includes(item.id)), [selectedIds])
  const toggle = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)
  const severed = Object.entries(game.ship.systems).find(([, state]) => state.status === 'destroyed')?.[0]
  return (
    <ActProcedureFrame beat="BEAT 12 · A YEAR OUTSIDE TIME" title="Choose what the refuge restores" instruction="Cirene’s scaffolds can complete three major repairs before the temporal shield opens. Every restoration changes the Ithaca—and leaves a capability dependent on living technology." variant="refit" background={ASSETS.cinematics.cireneRefitYear} station="MORI / CORELLI" risk="3 GROWTH CYCLES">
      <div className="refit-allocation">
        <div className="refit-ship"><img src={ASSETS.ships.ithaca} alt="CSV Ithaca in refit" /><span>SEVERED SYSTEM <strong>{severed?.toUpperCase() ?? 'NONE'}</strong></span><i>{3 - selected.length} CYCLES REMAIN</i></div>
        <div className="refit-options">{REFIT_OPTIONS.map((option) => {
          const integrity = option.system ? game.ship.systems[option.system].integrity : game.ship.hull
          return <button key={option.id} className={selectedIds.includes(option.id) ? 'selected' : ''} disabled={!selectedIds.includes(option.id) && selectedIds.length >= 3} onClick={() => toggle(option.id)}><span>{option.system ? `${integrity}% CURRENT` : `${game.ship.hull}% CURRENT`}</span><strong>{option.name}</strong><b>{option.detail}</b><small>{option.human}</small></button>
        })}</div>
      </div>
      <div className="procedure-feedback"><span>{selected.length === 3 ? 'All growth cycles allocated. These systems will carry Cirene’s technology forward.' : `Select ${3 - selected.length} more restoration${3 - selected.length === 1 ? '' : 's'}.`}</span><strong>{selected.length} / 3 ALLOCATED</strong></div>
      <button className="primary-action" disabled={selected.length !== 3} onClick={() => onComplete({ success: true, score: 100, choiceId: selected.map((item) => item.id.replace('restore-', '')).join('+'), selected })}>Begin final growth cycle <span>→</span></button>
    </ActProcedureFrame>
  )
}
