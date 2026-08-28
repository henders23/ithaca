import { useEffect, useRef, useState } from 'react'
import type { ShipSystemId } from '../state/types.js'
import { ASSETS } from './content.js'
import type { MiniGameResult } from './MiniGames.js'

type SliceTwoVariant = 'cipher' | 'sacrifice' | 'current' | 'storm' | 'evidence'

function ProcedureFrame({ title, instruction, variant, background, children }: {
  title: string
  instruction: string
  variant: SliceTwoVariant
  background: string
  children: React.ReactNode
}) {
  return (
    <section className={`minigame-screen mini-${variant}`} style={{ '--minigame-bg': `url(${background})` } as React.CSSProperties}>
      <div className="minigame-ambient" aria-hidden="true"><i /><i /><i /></div>
      <div className="minigame-card">
        <div className="minigame-titlebar">
          <div>
            <h1>{title}</h1>
            <p className="minigame-instruction">{instruction}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

const CIPHER_TARGET = [3, 1, 4, 2] as const
const CIPHER_LABELS = ['REGISTRY', 'CAPTAIN', 'DRIVE WAKE', 'WAR RECORD'] as const

export function TransponderCipherGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [phases, setPhases] = useState([0, 0, 0, 0])
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('Four identity layers remain attached to ARGUS’s packet.')
  const matches = CIPHER_TARGET.filter((phase, index) => phase === phases[index]).length
  const correlation = (index: number) => {
    const distance = Math.abs(CIPHER_TARGET[index] - phases[index])
    return 100 - Math.min(distance, 5 - distance) * 40
  }
  const turn = (index: number) => setPhases((current) => current.map((phase, item) => item === index ? (phase + 1) % 5 : phase))
  const test = () => {
    if (matches === 4) return onComplete({ success: true, score: Math.max(50, 100 - attempts * 12), choiceId: 'cipher-stable' })
    const next = attempts + 1
    setAttempts(next)
    setMessage(`${matches} identity layers masked. ${4 - matches} remain traceable.`)
    if (next >= 4) onComplete({ success: false, score: matches * 20, choiceId: 'cipher-traceable' })
  }

  return (
    <ProcedureFrame title="Forge a transponder identity" instruction="Rotate each carrier through five phases. A stable null will let ELIAS replace the record; failed injections leave a trail the enemy can follow." variant="cipher" background={ASSETS.cinematics.argusTransmitter}>
      <div className="cipher-console">
        <div className="signal-waterfall" aria-hidden="true"><i /><i /><i /><i /><span>ARGUS CARRIER</span></div>
        <div className="cipher-layers">
          {phases.map((phase, index) => (
            <button key={CIPHER_LABELS[index]} className={phase === CIPHER_TARGET[index] ? 'locked' : ''} onClick={() => turn(index)}>
              <span>{CIPHER_LABELS[index]}</span>
              <i style={{ '--cipher-phase': `${phase * 72}deg` } as React.CSSProperties}><b /></i>
              <strong>PHASE {phase + 1}</strong>
              <small>{phase === CIPHER_TARGET[index] ? 'NULL LOCKED' : `ECHO CORRELATION ${correlation(index)}%`}</small>
              <em aria-label={`Echo correlation ${correlation(index)} percent`}><b style={{ width: `${correlation(index)}%` }} /></em>
            </button>
          ))}
        </div>
      </div>
      <div className="procedure-feedback"><span>{message}</span><strong>INJECTIONS {attempts} / 4</strong></div>
      <button className="primary-action" onClick={test}>Inject false carrier <span>→</span></button>
    </ProcedureFrame>
  )
}

const SACRIFICE_OPTIONS: readonly { id: ShipSystemId; name: string; human: string; escape: string }[] = [
  { id: 'weapons', name: 'WEAPONS SPINE', human: 'Cross loses the rail lance and the crews who maintain it.', escape: 'Cuts the heaviest alien pathway.' },
  { id: 'shields', name: 'SHIELD MATRIX', human: 'The hull will meet every future weapon without its first defense.', escape: 'Releases enough charge for a clean jump.' },
  { id: 'medical', name: 'MEDICAL RESERVE', human: 'Corelli keeps one bay; every later wound becomes a harder choice.', escape: 'Preserves engines and tactical systems.' },
  { id: 'sensors', name: 'LONG-RANGE SENSORS', human: 'The Ithaca will travel half-blind through the wrong stars.', escape: 'A fast, low-casualty physical severance.' },
  { id: 'communications', name: 'COMMUNICATIONS ARRAY', human: 'Kiara loses the equipment that lets her hear the pursuer clearly.', escape: 'Silences the alien carrier feeding the lock.' },
]

const SACRIFICE_WITNESSES: Record<string, { portrait: string; name: string; line: string }> = {
  weapons: { portrait: ASSETS.portraits['gabriel-cross'], name: 'CROSS', line: 'The lance crews know what this buys. Give me sixty seconds to get them clear.' },
  shields: { portrait: ASSETS.portraits['lena-mori'], name: 'MORI', line: 'After this, every hit reaches metal. There will be nowhere left to hide bad flying.' },
  medical: { portrait: ASSETS.portraits['isabella-corelli'], name: 'CORELLI', line: 'You are not cutting away rooms. You are cutting away the next people I might have saved.' },
  sensors: { portrait: ASSETS.portraits['kiara-ndala'], name: 'N’DALA', line: 'We can travel blind. We cannot pretend blindness is the same thing as safety.' },
  communications: { portrait: ASSETS.portraits['kiara-ndala'], name: 'N’DALA', line: 'If we silence the array, the Tidefather becomes a monster again—because we stop hearing the grief.' },
}

export function SystemSacrificeGame({ onComplete }: { onComplete: (result: MiniGameResult & { system: ShipSystemId }) => void }) {
  const [selected, setSelected] = useState<ShipSystemId | null>(null)
  const [armed, setArmed] = useState(false)
  const option = SACRIFICE_OPTIONS.find((item) => item.id === selected)
  const witness = selected ? SACRIFICE_WITNESSES[selected] : null
  const commit = () => {
    if (!selected) return
    if (!armed) return setArmed(true)
    onComplete({ success: true, score: 100, choiceId: selected, system: selected })
  }

  return (
    <ProcedureFrame title="Choose what the Ithaca must lose" instruction="The emergency jump cannot carry every Gate-altered system. Isolate one deck network, evacuate it, and sever it from the ship permanently." variant="sacrifice" background={ASSETS.cinematics.tidefatherIntercept}>
      <div className="sacrifice-layout">
        <div className="ship-cutaway">
          <img src={ASSETS.ships.ithaca} alt="CSV Ithaca system cutaway" />
          {SACRIFICE_OPTIONS.map((item, index) => <i key={item.id} className={selected === item.id ? 'selected' : ''} style={{ left: `${18 + index * 13}%`, top: `${35 + index * 4}%` }} />)}
          <span>EMERGENCY JUMP MASS <strong>{selected ? 'WITHIN LIMIT' : 'OVER LIMIT'}</strong></span>
        </div>
        <div className="sacrifice-options">
          {SACRIFICE_OPTIONS.map((item) => (
            <button key={item.id} className={selected === item.id ? 'selected' : ''} onClick={() => { setSelected(item.id); setArmed(false) }}>
              <strong>{item.name}</strong><small>{item.escape}</small><p>{item.human}</p>
            </button>
          ))}
        </div>
      </div>
      {witness && <div className="sacrifice-witness"><img src={witness.portrait} alt="" /><div><span>{witness.name} · PRIVATE COMMAND CHANNEL</span><p>{witness.line}</p></div></div>}
      {option && <div className={`sacrifice-confirm ${armed ? 'armed' : ''}`}><span>{armed ? 'SEVERANCE ARMED' : 'SELECTED FOR EVACUATION'}</span><strong>{option.name}</strong></div>}
      <button className="primary-action danger-action" disabled={!selected} onClick={commit}>{armed ? 'Sever system and jump' : 'Arm severance'} <span>→</span></button>
    </ProcedureFrame>
  )
}

const CURRENT_TARGET = [2, 4, 1, 3] as const

export function PhaseCurrentGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [rings, setRings] = useState([0, 0, 0, 0])
  const [stress, setStress] = useState(0)
  const stable = CURRENT_TARGET.filter((value, index) => value === rings[index]).length
  const driftCue = (index: number) => {
    const advance = (CURRENT_TARGET[index] - rings[index] + 6) % 6
    if (advance === 0) return 'PHASE LOCKED'
    return advance <= 3 ? `DRIFT → ADVANCE ${advance}` : `DRIFT ← RETARD ${6 - advance}`
  }
  const tune = (index: number, direction: number) => setRings((current) => current.map((value, item) => item === index ? (value + direction + 6) % 6 : value))
  const test = () => {
    if (stable === 4) return onComplete({ success: true, score: Math.max(55, 100 - stress * 10), choiceId: 'current-contained' })
    const next = stress + 1
    setStress(next)
    if (next >= 5) onComplete({ success: false, score: stable * 20, choiceId: 'current-volatile' })
  }
  return (
    <ProcedureFrame title="Contain a spatial current" instruction="Counter-rotate four magnetic vanes until their phase marks hold still around the current. Each failed test increases pressure on the vessel." variant="current" background={ASSETS.cinematics.sphereChamber}>
      <div className="current-console">
        <div className={`current-sphere stability-${stable}`}><i /><i /><i /><strong>{stable}/4</strong><span>VANES STABLE</span></div>
        <div className="current-rings">
          {rings.map((value, index) => (
            <div key={index} className={value === CURRENT_TARGET[index] ? 'stable' : ''}>
              <span>VANE {String.fromCharCode(65 + index)}</span>
              <i style={{ '--current-phase': `${value * 60}deg` } as React.CSSProperties}><b /></i>
              <nav><button onClick={() => tune(index, -1)}>−</button><strong>{value}</strong><button onClick={() => tune(index, 1)}>+</button></nav>
              <small>{driftCue(index)}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="procedure-feedback"><span>{stable === 4 ? 'The current is holding a single direction.' : `${4 - stable} vanes continue to precess.`}</span><strong>VESSEL STRESS {stress} / 5</strong></div>
      <button className="primary-action" onClick={test}>Test containment <span>→</span></button>
    </ProcedureFrame>
  )
}

const STORM_GATES = [
  { at: 13, lane: 0 }, { at: 23, lane: 2 }, { at: 34, lane: 1 }, { at: 46, lane: 0 },
  { at: 58, lane: 2 }, { at: 68, lane: 1 }, { at: 79, lane: 2 }, { at: 90, lane: 0 },
] as const

export function StormFlightGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [started, setStarted] = useState(false)
  const [lane, setLane] = useState(1)
  const [progress, setProgress] = useState(0)
  const [stability, setStability] = useState(100)
  const laneRef = useRef(lane)
  const stabilityRef = useRef(stability)
  const hitRef = useRef(new Set<number>())
  laneRef.current = lane
  stabilityRef.current = stability

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') setLane((value) => Math.max(0, value - 1))
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') setLane((value) => Math.min(2, value + 1))
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  useEffect(() => {
    if (!started) return
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 0.8)
        for (const gate of STORM_GATES) {
          if (Math.abs(next - gate.at) < 1 && laneRef.current !== gate.lane && !hitRef.current.has(gate.at)) {
            hitRef.current.add(gate.at)
            stabilityRef.current = Math.max(10, stabilityRef.current - 13)
            setStability(stabilityRef.current)
          }
        }
        if (next >= 100) {
          window.clearInterval(timer)
          window.setTimeout(() => onComplete({ success: stabilityRef.current >= 48, score: stabilityRef.current, choiceId: stabilityRef.current >= 48 ? 'storm-proven' : 'storm-damaged' }), 450)
        }
        return next
      })
    }, 70)
    return () => window.clearInterval(timer)
  }, [onComplete, started])

  return (
    <ProcedureFrame title="Fly the current through the storm" instruction="Keep the sphere aligned with each luminous wind gate. Move port or starboard before the Ithaca reaches the cloud wall." variant="storm" background={ASSETS.cinematics.aeolianCity}>
      <div className={`storm-flight ${started ? 'running' : ''}`}>
        <div className="storm-clouds" /><div className="storm-lightning"><i /><i /><i /></div>
        {STORM_GATES.filter((gate) => gate.at > progress - 7 && gate.at < progress + 32).map((gate) => (
          <span key={gate.at} className="wind-gate" style={{ left: `${18 + gate.lane * 32}%`, top: `${88 - (gate.at - progress) * 2.8}%` }}><i /></span>
        ))}
        <div className="storm-ship" style={{ left: `${18 + lane * 32}%` }}><img src={ASSETS.ships.ithaca} alt="CSV Ithaca" /><i /></div>
        {!started && <button className="launch-chase" onClick={() => setStarted(true)}>ENTER STORM</button>}
      </div>
      <div className="storm-readout"><span>COURSE <strong>{Math.round(progress)}%</strong></span><span>SPHERE STABILITY <strong>{stability}%</strong></span></div>
      <div className="chase-controls"><button onClick={() => setLane((value) => Math.max(0, value - 1))}>← PORT</button><button onClick={() => setLane((value) => Math.min(2, value + 1))}>STARBOARD →</button></div>
    </ProcedureFrame>
  )
}

const LOG_EVENTS = [
  { id: 'rumour', code: 'FRAGMENT K', title: 'Rumour packet copied', detail: 'Anonymous claim spreads before any request for the sealed chamber exists.' },
  { id: 'request', code: 'FRAGMENT R', title: 'Three access requests denied', detail: 'ELIAS’s refusals create the credential challenge answered by the forge.' },
  { id: 'forge', code: 'FRAGMENT A', title: 'Command token forged', detail: 'A medical terminal mirrors Vale’s token before the camera loses continuity.' },
  { id: 'camera', code: 'FRAGMENT V', title: 'Local camera looped', detail: 'A repeating six-second frame masks the group entering—but not the final release.' },
  { id: 'open', code: 'FRAGMENT E', title: 'Outer seal opened', detail: 'Mara Venn turns the manual release after every electronic safeguard is bypassed.' },
] as const

export function AccessLogGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('Select the fragments from earliest cause to final action.')
  const scrambled = [LOG_EVENTS[3], LOG_EVENTS[0], LOG_EVENTS[4], LOG_EVENTS[1], LOG_EVENTS[2]]
  const choose = (id: string) => setSequence((current) => current.includes(id) ? current : [...current, id])
  const verify = () => {
    const success = LOG_EVENTS.every((event, index) => sequence[index] === event.id)
    if (success) return onComplete({ success: true, score: Math.max(60, 100 - attempts * 15), choiceId: 'conspiracy-reconstructed' })
    const next = attempts + 1
    const correct = LOG_EVENTS.filter((event, index) => sequence[index] === event.id).length
    setAttempts(next)
    setSequence([])
    setMessage(`${correct} of 5 causal links verified. Rebuild the chain.`)
    if (next >= 3) onComplete({ success: false, score: correct * 18, choiceId: 'partial-log-recovered' })
  }
  return (
    <ProcedureFrame title="Reconstruct the access log" instruction="The timestamps were stripped, but each fragment still contains a causal handshake. Build the chain that turned a rumour into the opened sphere." variant="evidence" background={ASSETS.cinematics.sphereRupture}>
      <div className="evidence-board">
        <div className="evidence-pool">
          {scrambled.map((event) => (
            <button key={event.id} disabled={sequence.includes(event.id)} onClick={() => choose(event.id)}>
              <span>{event.code}</span><strong>{event.title}</strong><small>{event.detail}</small>
            </button>
          ))}
        </div>
        <div className="causal-chain">
          {Array.from({ length: 5 }, (_, index) => {
            const event = LOG_EVENTS.find((item) => item.id === sequence[index])
            return <div key={index} className={event ? 'filled' : ''}><span>{String(index + 1).padStart(2, '0')}</span><strong>{event?.title ?? 'UNRESOLVED'}</strong>{index < 4 && <i>→</i>}</div>
          })}
        </div>
      </div>
      <div className="procedure-feedback"><span>{message}</span><strong>ATTEMPTS {attempts} / 3</strong></div>
      {sequence.length > 0 && <button className="chain-reset" onClick={() => { setSequence([]); setMessage('Chain cleared. Follow each fragment’s cause and consequence.') }}>Clear chain</button>}
      <button className="primary-action" disabled={sequence.length !== 5} onClick={verify}>Verify causal chain <span>→</span></button>
    </ProcedureFrame>
  )
}
