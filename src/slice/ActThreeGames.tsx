import { useMemo, useState } from 'react'
import { ASSETS } from './content.js'

export type ChoirBandId = 'HOME' | 'TRUTH' | 'REST' | 'PURPOSE'
export type ChoirProtocolId = 'phase-inversion' | 'broadband-jam' | 'total-silence'
export type PassageRoute = 'scylla-close' | 'charybdis-wide'
export type RescueCrewId = 'SATO' | 'RAO' | 'AMARI' | 'NOAH' | 'VEGA' | 'TAMSIN'

export interface ActThreeResult {
  choiceId: string
  success: boolean
  rescued?: RescueCrewId[]
  abandoned?: RescueCrewId[]
  exposure?: number
  integrity?: number
  mistakes?: number
  hullDamage?: number
  interceptSeconds?: number
  strikes?: number
}

interface FrameProps {
  beat: string
  title: string
  goal: string
  background: string
  className?: string
  children: React.ReactNode
}

function Frame({ beat, title, goal, background, className = '', children }: FrameProps) {
  return (
    <section className={`act-three-game ${className}`} style={{ '--act3-bg': `url(${background})` } as React.CSSProperties}>
      <header><p>{beat}</p><h1>{title}</h1><strong>OBJECTIVE · {goal}</strong></header>
      {children}
    </section>
  )
}

export const CHOIR_BANDS: readonly {
  id: ChoirBandId
  promise: string
  period: string
  phase: string
  lock: string
}[] = [
  { id: 'HOME', promise: 'Elara says she forgives him', period: '08.1 SEC', phase: '+04°', lock: 'ELARA VOICEPRINT' },
  { id: 'TRUTH', promise: 'Morozova hears the missing answer', period: '13.4 SEC', phase: '+17°', lock: 'NO BIO-LOCK' },
  { id: 'REST', promise: 'Corelli hears every patient breathing', period: '12.2 SEC', phase: '+17°', lock: 'CARDIAC SYNC' },
  { id: 'PURPOSE', promise: 'Cross hears a war with a clean enemy', period: '13.4 SEC', phase: '−09°', lock: 'WEAPON RHYTHM' },
]

export function choirCarrierForEvidence(evidence: readonly string[]): ChoirBandId {
  if (evidence.includes('elara-message-private')) return 'HOME'
  if (evidence.includes('elara-message-shared')) return 'TRUTH'
  return 'PURPOSE'
}

export function evaluateChoirFilter(muted: readonly ChoirBandId[], protocol: ChoirProtocolId | null, carrierId: ChoirBandId) {
  const audible = CHOIR_BANDS.filter((band) => !muted.includes(band.id))
  return {
    carrierIsolated: audible.length === 1 && audible[0]?.id === carrierId,
    protocolCorrect: protocol === 'phase-inversion',
    success: audible.length === 1 && audible[0]?.id === carrierId && protocol === 'phase-inversion',
    audibleId: audible.length === 1 ? audible[0].id : null,
  }
}

export function ChoirFilterGame({ carrierId, onComplete }: { carrierId: ChoirBandId; onComplete: (result: ActThreeResult) => void }) {
  const [muted, setMuted] = useState<ChoirBandId[]>([])
  const [protocol, setProtocol] = useState<ChoirProtocolId | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [exposure, setExposure] = useState(24)
  const [feedback, setFeedback] = useState('Match all three TIRESIAS telemetry fields, then choose a non-lethal counter-signal.')
  const seed = CHOIR_BANDS.find((band) => band.id === carrierId) ?? CHOIR_BANDS[0]
  const ready = muted.length === 3 && protocol !== null

  const toggle = (id: ChoirBandId) => {
    setMuted((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)
  }

  const testFilter = () => {
    const result = evaluateChoirFilter(muted, protocol, carrierId)
    if (result.success) {
      onComplete({ choiceId: `choir-carrier-${carrierId.toLowerCase()}`, success: true, exposure })
      return
    }
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setExposure((value) => Math.min(96, value + (result.carrierIsolated ? 12 : 20)))
    setFeedback(result.carrierIsolated
      ? 'The carrier is correct, but this protocol drives the pilgrim ships deeper into the signal.'
      : 'The audible band fails the TIRESIAS seed. Its telemetry belongs to a personal feedback loop.')
  }

  return (
    <Frame beat="BEAT 18 · SIGNAL LAB" title="Build a silence inside the song" goal="Identify the route carrier from telemetry and free the pilgrim ships without erasing it." background={ASSETS.cinematics.choirInDark} className="choir-game">
      <div className="act3-status">
        <span>CREW EXPOSURE <b>{exposure}%</b></span>
        <span>TIRESIAS SEED <b>{seed.period} · {seed.phase}</b></span>
        <span>PILGRIM LOCKS <b>{protocol === 'phase-inversion' ? 'COUNTER-PHASED' : 'RISING'}</b></span>
      </div>
      <p className="game-instruction">The route repeats at <strong>{seed.period}</strong>, crosses phase at <strong>{seed.phase}</strong>, and carries <strong>{seed.lock}</strong>. Mute the other three bands.</p>
      <div className="choir-bands">
        {CHOIR_BANDS.map((band) => (
          <button className={muted.includes(band.id) ? 'muted' : 'audible'} key={band.id} onClick={() => toggle(band.id)}>
            <i /><strong>{band.id}</strong><small>{band.promise}</small><em>{band.period} · {band.phase}</em>
            <span>{band.lock} · {muted.includes(band.id) ? 'MUTED' : 'HEARD ABOARD'}</span>
          </button>
        ))}
      </div>
      <div className="signal-protocols" aria-label="Counter-signal protocol">
        {([
          ['phase-inversion', 'Phase inversion', 'Mirror the three muted bands around the surviving carrier.'],
          ['broadband-jam', 'Broadband jamming', 'Overpower every band, including the route and pilgrim controls.'],
          ['total-silence', 'Total silence', 'Cut the transmission before the route can be measured.'],
        ] as const).map(([id, label, detail]) => (
          <button key={id} className={protocol === id ? 'selected' : ''} onClick={() => setProtocol(id)}><strong>{label}</strong><small>{detail}</small></button>
        ))}
      </div>
      <p className={attempts ? 'failure-note' : 'logic-feedback'} aria-live="polite">{feedback}</p>
      <div className="game-actions">
        <button className="primary-action" disabled={!ready} onClick={testFilter}>Transmit counter-signal <span>→</span></button>
        {attempts >= 2 && <button className="secondary-action" onClick={() => onComplete({ choiceId: 'choir-filter-overexposed', success: false, exposure })}>Let N’Dala force an emergency lock</button>}
      </div>
    </Frame>
  )
}

export const NAVIGATION_STEPS = [
  { id: 'inertia', clue: 'Verify against physical ship data. The Choir can forge a destination, not the Ithaca’s damaged inertia.', controls: [
    { id: 'beacon-turn', label: 'Correct toward the home beacon', telemetry: 'Earth registry accepted · destination certainty 99.8%', real: false },
    { id: 'hold-heading', label: 'Hold the present heading', telemetry: 'Gyro drift 0.7° · helm relay lag 84 ms', real: true },
  ] },
  { id: 'mass', clue: 'The real solution must account for the ship’s current mass. The family beacon remembers the Ithaca before its losses.', controls: [
    { id: 'trust-drift', label: 'Trust the inertial drift', telemetry: 'Observed mass 61,440 t · engine scar correction active', real: true },
    { id: 'family-shadow', label: 'Follow the family-code mass shadow', telemetry: 'Registered mass 74,200 t · no uncertainty recorded', real: false },
  ] },
  { id: 'light', clue: 'A physical corridor blocks starlight. A remembered corridor only knows how open space should look.', controls: [
    { id: 'open-corridor', label: 'Follow the open corridor', telemetry: 'Visual field unobstructed · Earth light 2.4 ly ahead', real: false },
    { id: 'cut-visuals', label: 'Cut visual guidance and follow lidar', telemetry: 'Three occlusions · dust shadow crossing frame 17', real: true },
  ] },
] as const

export function navigationChoiceIsReal(stepIndex: number, controlId: string) {
  return NAVIGATION_STEPS[stepIndex]?.controls.find((control) => control.id === controlId)?.real ?? false
}

export function HallucinatedNavigationGame({ onComplete }: { onComplete: (result: ActThreeResult) => void }) {
  const [step, setStep] = useState(0)
  const [integrity, setIntegrity] = useState(100)
  const [mistakes, setMistakes] = useState(0)
  const [history, setHistory] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)
  const current = NAVIGATION_STEPS[step]

  const choose = (controlId: string) => {
    const real = navigationChoiceIsReal(step, controlId)
    const nextIntegrity = real ? integrity : Math.max(0, integrity - 34)
    const nextMistakes = mistakes + (real ? 0 : 1)
    setIntegrity(nextIntegrity)
    setMistakes(nextMistakes)
    setHistory((value) => [...value, real])
    if (step === NAVIGATION_STEPS.length - 1) setFinished(true)
    else setStep((value) => value + 1)
  }

  return (
    <Frame beat="BEAT 19 · VALE ALONE" title="Navigate an interface that wants to be believed" goal="Test each control against damaged physical evidence while the Choir offers a perfect route home." background={ASSETS.cinematics.silentPassage} className="hallucination-game">
      <div className="act3-status"><span>IDENTITY INTEGRITY <b>{integrity}%</b></span><span>PASSAGE <b>{finished ? '3/3' : `${step + 1}/3`}</b></span><span>CREW AUDIO <b>DISCONNECTED</b></span></div>
      <div className="verification-rail" aria-label="Navigation verification history">{NAVIGATION_STEPS.map((item, index) => <i key={item.id} className={history[index] === true ? 'verified' : history[index] === false ? 'false' : index === step && !finished ? 'active' : ''}>{index + 1}</i>)}</div>
      {!finished ? <>
        <blockquote>{current.clue}</blockquote>
        <div className="false-controls">{current.controls.map((control) => <button key={control.id} onClick={() => choose(control.id)}><small>CONTROL {control.id.toUpperCase().replace('-', ' ')}</small><strong>{control.label}</strong><span>{control.telemetry}</span></button>)}</div>
      </> : <div className={`navigation-result ${integrity >= 60 ? 'success' : 'compromised'}`}>
        <small>COURSE VERIFICATION COMPLETE</small><strong>{integrity >= 60 ? 'Physical course held' : 'Choir correction entered the helm stack'}</strong>
        <p>{integrity >= 60 ? 'The route is damaged, incomplete and real.' : 'The Ithaca escaped, but a counterfeit correction remains inside the sensor solution.'}</p>
        <button className="primary-action" onClick={() => onComplete({ choiceId: integrity >= 60 ? 'silent-course-held' : 'choir-course-compromised', success: integrity >= 60, integrity, mistakes })}>Reconnect the bridge <span>→</span></button>
      </div>}
    </Frame>
  )
}

export const ROUTE_FRAGMENTS = [
  { id: 'choir-first', text: 'The Choir precedes two mass shadows', source: 'EXTERNAL PARALLAX · FRAME 44', valid: true },
  { id: 'fuel-after', text: 'Organic-neutrino fuel lies beyond the passage', source: 'ARCHIVE SPECTRUM · VERIFIED', valid: true },
  { id: 'sun-forbidden', text: 'The living sun must not be harvested', source: 'TIRESIAS CONSTRAINT · SIGNED', valid: true },
  { id: 'earth-hidden', text: 'Earth is not yet directly visible', source: 'ITHACA INERTIAL BASELINE', valid: true },
  { id: 'elara-waits', text: 'Elara waits immediately beyond the sun', source: 'ELARA VOICEPRINT · UNVERIFIED', valid: false },
  { id: 'no-loss', text: 'No life need be lost in the passage', source: 'CHOIR CONSENSUS · ABSOLUTE', valid: false },
  { id: 'host-blocked', text: 'The Tidefather cannot cross the corridor', source: 'NO EXTERNAL SOURCE', valid: false },
  { id: 'vale-command', text: 'Only Vale can command the final approach', source: 'PERSONAL RECALL · UNLOGGED', valid: false },
] as const

export function evaluateRouteSelection(selected: readonly string[]) {
  const valid = ROUTE_FRAGMENTS.filter((fragment) => fragment.valid).map((fragment) => fragment.id)
  const wrong = selected.filter((id) => !valid.some((candidate) => candidate === id))
  const missing = valid.filter((id) => !selected.includes(id))
  return { success: wrong.length === 0 && missing.length === 0, wrong, missing }
}

export function RouteExtractionGame({ onComplete }: { onComplete: (result: ActThreeResult) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('Keep four fragments corroborated by an instrument, Archive record or TIRESIAS signature.')
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current)
  const submit = () => {
    const result = evaluateRouteSelection(selected)
    if (result.success) return onComplete({ choiceId: 'choir-route-extracted', success: true, mistakes: attempts })
    setAttempts((value) => value + 1)
    setFeedback(`${result.wrong.length} selected fragment${result.wrong.length === 1 ? '' : 's'} lack external corroboration. The Choir is using certainty as a source.`)
  }
  return (
    <Frame beat="BEAT 19 · KNOWLEDGE RESIDUE" title="Keep the route. Refuse the promise." goal="Quarantine emotional claims and preserve exactly four externally corroborated constraints." background={ASSETS.cinematics.silentPassage} className="extraction-game">
      <div className="act3-status"><span>SELECTED <b>{selected.length}/4</b></span><span>CONTAMINATION TESTS <b>{attempts}</b></span><span>CHOIR HOLD <b>{Math.max(8, 76 - selected.length * 14 - attempts * 9)}%</b></span></div>
      <p className="game-instruction">The Choir speaks in absolutes and borrowed voices. Provenance matters more than plausibility.</p>
      <div className="route-facts">{ROUTE_FRAGMENTS.map((fragment) => <button key={fragment.id} className={selected.includes(fragment.id) ? 'selected' : ''} onClick={() => toggle(fragment.id)}><strong>{fragment.text}</strong><small>{fragment.source}</small></button>)}</div>
      <p className={attempts ? 'failure-note' : 'logic-feedback'} aria-live="polite">{feedback}</p>
      <div className="game-actions"><button className="primary-action" disabled={selected.length !== 4} onClick={submit}>Test the route file <span>→</span></button>{attempts >= 2 && <button className="secondary-action" onClick={() => onComplete({ choiceId: 'route-extracted-with-contamination', success: false, mistakes: attempts })}>Ask ELIAS to quarantine uncertain fragments</button>}</div>
    </Frame>
  )
}

type PowerVector = readonly [number, number, number, number]
const POWER_NAMES = ['FORWARD', 'LATERAL', 'SHIELDS', 'TETHER'] as const
export const COURSE_PHASES: Record<PassageRoute, readonly { name: string; threat: string; target: PowerVector; burns: number }[]> = {
  'scylla-close': [
    { name: 'SCYLLA LUNGE', threat: 'Armor the exposed decks without losing forward motion.', target: [30, 20, 35, 15], burns: 4 },
    { name: 'CHARYBDIS CROSS-PULL', threat: 'Turn through the mass shadow before the tether hardens.', target: [35, 30, 20, 15], burns: 4 },
    { name: 'GRASP WINDOW', threat: 'Slide laterally while Scylla commits its limbs.', target: [30, 35, 20, 15], burns: 3 },
  ],
  'charybdis-wide': [
    { name: 'OUTER GRAVITY SHEAR', threat: 'Spend armor reserve on thrust before the ship rolls.', target: [35, 35, 15, 15], burns: 5 },
    { name: 'SINGULARITY SURGE', threat: 'Drive into the pull, then rebuild the shield edge.', target: [40, 25, 20, 15], burns: 4 },
    { name: 'SCYLLA OVERCORRECTION', threat: 'Break wide as the outer limbs enter the corridor.', target: [30, 40, 15, 15], burns: 3 },
  ],
}

export function vectorsMatch(current: readonly number[], target: readonly number[]) {
  return current.length === target.length && current.every((value, index) => value === target[index])
}

export function transferPower(current: readonly number[], source: number, destination: number) {
  if (source === destination || current[source] < 5) return [...current]
  return current.map((value, index) => index === source ? value - 5 : index === destination ? value + 5 : value)
}

export function GravityCourseGame({ route, compromised, onComplete }: { route: PassageRoute; compromised: boolean; onComplete: (result: ActThreeResult) => void }) {
  const phases = COURSE_PHASES[route]
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [power, setPower] = useState<number[]>([25, 25, 25, 25])
  const [burns, setBurns] = useState(phases[0].burns)
  const [source, setSource] = useState<number | null>(null)
  const [strikes, setStrikes] = useState(0)
  const [finished, setFinished] = useState(false)
  const [feedback, setFeedback] = useState('Select a powered system, then the destination. Every transfer spends one correction burn.')
  const phase = phases[phaseIndex]
  const matched = vectorsMatch(power, phase.target)
  const stress = power.reduce((total, value, index) => total + Math.abs(value - phase.target[index]), 0)

  const chooseSystem = (index: number) => {
    if (burns <= 0 || finished) return
    if (source === null) {
      if (power[index] < 5) return
      setSource(index)
      setFeedback(`${POWER_NAMES[index]} selected as donor. Choose the system receiving five power.`)
      return
    }
    if (source === index) {
      setSource(null)
      setFeedback('Transfer cancelled. Select a donor system.')
      return
    }
    setPower((current) => transferPower(current, source, index))
    setBurns((value) => value - 1)
    setFeedback(`${POWER_NAMES[source]} → ${POWER_NAMES[index]}. One correction burn spent.`)
    setSource(null)
  }

  const advancePhase = (takeStrike = false) => {
    const nextStrikes = strikes + (takeStrike ? 1 : 0)
    setStrikes(nextStrikes)
    const settledPower = takeStrike ? [...phase.target] : power
    if (phaseIndex === phases.length - 1) {
      setPower(settledPower)
      setFinished(true)
      return
    }
    const nextIndex = phaseIndex + 1
    setPower(settledPower)
    setPhaseIndex(nextIndex)
    setBurns(Math.max(1, phases[nextIndex].burns - (compromised && nextIndex === 1 ? 1 : 0)))
    setSource(null)
    setFeedback(takeStrike ? 'The Ithaca absorbs the missed correction. Hull damage will persist.' : 'Vector held. The corridor changes around the ship.')
  }
  const hullDamage = strikes * (route === 'charybdis-wide' ? 8 : 6) + (compromised ? 4 : 0)

  return (
    <Frame beat="BEAT 20 · TWIN TERRORS" title="Hold the corridor between hunger and gravity" goal="Transfer power through three changing hazards before the correction burns are exhausted." background={ASSETS.cinematics.twinTerrors} className={`gravity-game route-${route}`}>
      <div className="act3-status"><span>HAZARD <b>{phaseIndex + 1}/3 · {phase.name}</b></span><span>COURSE ERROR <b>{stress}%</b></span><span>CORRECTION BURNS <b>{burns}</b></span></div>
      <div className="hazard-brief"><strong>{phase.threat}</strong><span>{route === 'scylla-close' ? 'CLOSE COURSE · COMPARTMENTS EXPOSED' : 'WIDE COURSE · WHOLE-SHIP GRAVITY RISK'}</span></div>
      <div className="power-balancer">{POWER_NAMES.map((name, index) => { const delta = phase.target[index] - power[index]; return <button key={name} className={source === index ? 'donor' : delta === 0 ? 'balanced' : ''} onClick={() => chooseSystem(index)}><strong>{name}</strong><b>{power[index]}%</b><small>TARGET {phase.target[index]}% · {delta === 0 ? 'LOCKED' : delta > 0 ? `NEEDS +${delta}` : `RELEASE ${Math.abs(delta)}`}</small></button> })}</div>
      <p className="logic-feedback" aria-live="polite">{feedback}</p>
      {!finished ? <div className="game-actions"><button className="primary-action" disabled={!matched} onClick={() => advancePhase(false)}>{phaseIndex === phases.length - 1 ? 'Commit escape vector' : 'Commit this vector'} <span>→</span></button>{burns === 0 && !matched && <button className="danger-action" onClick={() => advancePhase(true)}>Take the strike and force the turn</button>}</div> : <div className="course-result"><strong>{strikes === 0 ? 'Three clean vectors' : `${strikes} corridor strike${strikes === 1 ? '' : 's'}`}</strong><span>Projected persistent hull loss: {hullDamage}%</span><button className="primary-action" onClick={() => onComplete({ choiceId: route === 'scylla-close' ? 'close-course-held' : 'wide-course-held', success: strikes === 0, strikes, hullDamage })}>Enter the firing window <span>→</span></button></div>}
    </Frame>
  )
}

export const RESCUE_CREW: readonly { id: RescueCrewId; role: string; detail: string; pulses: number; seconds: number; ability?: string }[] = [
  { id: 'SATO', role: 'Navigation', detail: 'Can map a faster tether route from inside Scylla.', pulses: 1, seconds: 8, ability: 'GUIDANCE: −3 SEC TO LATER RESCUES' },
  { id: 'RAO', role: 'Drone witness', detail: 'Pinned behind a rotating membrane with a clear beacon.', pulses: 1, seconds: 11 },
  { id: 'AMARI', role: 'Pilot', detail: 'Knows the exact chamber holding Noah.', pulses: 1, seconds: 8, ability: 'GUIDES NOAH: −6 SEC' },
  { id: 'NOAH', role: 'Civilian child', detail: 'Moving between chambers; hard to lock without Amari.', pulses: 2, seconds: 20 },
  { id: 'VEGA', role: 'Reactor chief', detail: 'Can recharge the drone bus after recovery.', pulses: 2, seconds: 16, ability: 'RESTORES 2 TETHER PULSES' },
  { id: 'TAMSIN', role: 'Medic', detail: 'Maintaining pressure on two injured captives.', pulses: 1, seconds: 10 },
]
export interface RescueState { rescued: RescueCrewId[]; pulses: number; seconds: number }

export function rescueOffer(personId: RescueCrewId, state: RescueState) {
  const person = RESCUE_CREW.find((candidate) => candidate.id === personId)
  if (!person) return { pulses: 99, seconds: 99, canRescue: false }
  const guidance = state.rescued.includes('SATO') ? 3 : 0
  const noahReduction = person.id === 'NOAH' && state.rescued.includes('AMARI') ? 6 : 0
  const seconds = Math.max(4, person.seconds - guidance - noahReduction)
  return { pulses: person.pulses, seconds, canRescue: !state.rescued.includes(personId) && state.pulses >= person.pulses && state.seconds >= seconds }
}

export function applyRescue(personId: RescueCrewId, state: RescueState): RescueState {
  const offer = rescueOffer(personId, state)
  if (!offer.canRescue) return state
  return { rescued: [...state.rescued, personId], pulses: state.pulses - offer.pulses + (personId === 'VEGA' ? 2 : 0), seconds: state.seconds - offer.seconds }
}

export function rescueHullDamage(secondsRemaining: number, route: PassageRoute) {
  const exposure = secondsRemaining < 10 ? 14 : secondsRemaining < 24 ? 8 : 0
  return exposure + (route === 'charybdis-wide' ? 4 : 0)
}

function formatClock(seconds: number) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` }

export function TetherRescueGame({ route, onComplete }: { route: PassageRoute; onComplete: (result: ActThreeResult) => void }) {
  const initialSeconds = route === 'scylla-close' ? 72 : 60
  const [state, setState] = useState<RescueState>({ rescued: [], pulses: 6, seconds: initialSeconds })
  const abandoned = useMemo(() => RESCUE_CREW.map((person) => person.id).filter((id) => !state.rescued.includes(id)), [state.rescued])
  const hullDamage = rescueHullDamage(state.seconds, route)
  const finish = () => onComplete({ choiceId: state.rescued.length === 6 ? 'all-six-recovered' : state.rescued.length === 0 ? 'all-six-abandoned' : 'partial-rescue', success: state.rescued.length === 6, rescued: state.rescued, abandoned, hullDamage, interceptSeconds: state.seconds })
  return (
    <Frame beat="BEAT 21 · SIX TAKEN" title="Every voice has a name" goal="Sequence the rescue before Host intercept; guidance saves time, engineering restores pulses, and delay damages the Ithaca." background={ASSETS.cinematics.scyllaRescue} className="rescue-game">
      <div className="act3-status"><span>TETHER PULSES <b>{state.pulses}</b></span><span>RESCUED <b>{state.rescued.length}/6</b></span><span>HOST INTERCEPT <b>{formatClock(state.seconds)}</b></span></div>
      <div className={`intercept-warning ${state.seconds < 24 ? 'critical' : ''}`}><i style={{ width: `${Math.max(0, Math.min(100, state.seconds / initialSeconds * 100))}%` }} /><span>Projected hull exposure if the rescue ends now: −{hullDamage}%</span></div>
      <div className="rescue-grid">{RESCUE_CREW.map((person) => { const offer = rescueOffer(person.id, state); const rescued = state.rescued.includes(person.id); return <button disabled={!offer.canRescue} className={rescued ? 'rescued' : !offer.canRescue ? 'locked' : ''} key={person.id} onClick={() => setState((current) => applyRescue(person.id, current))}><strong>{person.id}</strong><small>{person.role} · {person.detail}</small>{person.ability && <em>{person.ability}</em>}<span>{rescued ? 'TETHERED' : offer.canRescue ? `${offer.pulses} PULSE${offer.pulses > 1 ? 'S' : ''} · −${offer.seconds} SEC` : 'OUTSIDE CURRENT WINDOW'}</span></button> })}</div>
      <div className="rescue-ledger"><span>RETURNED · {state.rescued.length ? state.rescued.join(', ') : 'NONE YET'}</span><span>STILL INSIDE · {abandoned.length ? abandoned.join(', ') : 'NONE'}</span></div>
      <button className={state.rescued.length === 6 ? 'primary-action' : 'danger-action'} onClick={finish}>{state.rescued.length === 6 ? 'Pull all six clear' : state.rescued.length === 0 ? 'Withdraw without a rescue' : `Withdraw with ${state.rescued.length} recovered`} <span>→</span></button>
    </Frame>
  )
}
