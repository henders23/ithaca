import { useEffect, useRef, useState } from 'react'
import { ASSETS } from './content.js'

export interface MiniGameResult {
  success: boolean
  score: number
  choiceId: string
}

interface MiniGameFrameProps {
  beat: string
  title: string
  instruction: string
  variant: 'power' | 'triage' | 'memory' | 'chase' | 'circuit'
  background: string
  station: string
  risk: string
  children: React.ReactNode
}

function MiniGameFrame({ beat, title, instruction, variant, background, station, risk, children }: MiniGameFrameProps) {
  return (
    <section className={`minigame-screen mini-${variant}`} style={{ '--minigame-bg': `url(${background})` } as React.CSSProperties}>
      <div className="minigame-ambient" aria-hidden="true"><i /><i /><i /></div>
      <header className="minigame-heading">
        <div><span>{beat}</span><strong>FIELD PROCEDURE</strong></div>
        <small>LIVE SHIPBOARD INTERFACE</small>
      </header>
      <div className="minigame-card">
        <div className="minigame-titlebar">
          <div>
            <p className="eyebrow">CREW ACTION · {station}</p>
            <h1>{title}</h1>
            <p className="minigame-instruction">{instruction}</p>
          </div>
          <div className="procedure-seal"><span>LIVE</span><strong>{variant.slice(0, 3).toUpperCase()}</strong><small>{risk}</small></div>
        </div>
        {children}
      </div>
    </section>
  )
}

const POWER_SYSTEMS = [
  { id: 'life-support', label: 'Life support', load: 3, note: 'Stabilizes atmosphere on decks 3–11' },
  { id: 'engines', label: 'Maneuvering', load: 3, note: 'Prevents collision with the Gate debris' },
  { id: 'medical', label: 'Medical', load: 2, note: 'Restores two surgical bays' },
  { id: 'sensors', label: 'Long-range sensors', load: 2, note: 'Identifies the unknown starfield' },
  { id: 'weapons', label: 'Point defense', load: 2, note: 'Protects the damaged hull' },
] as const

export function PowerGridGame({ onComplete }: { onComplete: (result: MiniGameResult & { selected: string[] }) => void }) {
  const [selected, setSelected] = useState<string[]>(['life-support'])
  const used = POWER_SYSTEMS.filter((system) => selected.includes(system.id)).reduce((sum, system) => sum + system.load, 0)
  const capacity = 8

  const toggle = (id: string, load: number) => {
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : used + load <= capacity ? [...current, id] : current)
  }

  return (
    <MiniGameFrame beat="BEAT 02 · THE WRONG STARS" title="Restore emergency power" instruction="The reactor can support eight load units. Keep life support online and decide what the ship can afford to save." variant="power" background={ASSETS.cinematics.wrongStars} station="ENGINEERING" risk="CASCADE RISK">
      <div className="power-grid">
        <div className={`reactor-core load-${used}`}>
          <i className="reactor-ring outer" /><i className="reactor-ring inner" />
          <span>REACTOR</span><strong>{capacity - used}</strong><small>UNITS FREE</small>
          <em>{used} / {capacity} COMMITTED</em>
        </div>
        <div className="power-lines" aria-hidden="true">{POWER_SYSTEMS.map((system, index) => <i key={system.id} className={selected.includes(system.id) ? 'energized' : ''} style={{ '--line-index': index } as React.CSSProperties} />)}</div>
        <div className="system-list">
          {POWER_SYSTEMS.map((system) => {
            const active = selected.includes(system.id)
            const locked = !active && used + system.load > capacity
            return (
              <button key={system.id} className={`system-node ${active ? 'active' : ''}`} disabled={locked} onClick={() => toggle(system.id, system.load)}>
                <span className="node-light" />
                <strong>{system.label}</strong>
                <small>{system.note}</small>
                <b>{system.load} LOAD</b>
                <span className="load-pips">{Array.from({ length: system.load }, (_, index) => <i key={index} />)}</span>
              </button>
            )
          })}
        </div>
      </div>
      <button className="primary-action" disabled={!selected.includes('life-support') || selected.length < 2} onClick={() => onComplete({ success: selected.includes('engines'), score: selected.length, selected, choiceId: selected.join('+') })}>
        Commit routing <span>→</span>
      </button>
    </MiniGameFrame>
  )
}

const PATIENTS = [
  { id: 'pilot', name: 'Lt. Amari Venn', injury: 'Flight control · decompression', time: '04:10', effect: 'Restores a veteran shuttle pilot' },
  { id: 'reactor-team', name: 'Engineering Team C', injury: 'Reactor deck · plasma burns', time: '02:40', effect: 'Three specialists; only one surgical slot' },
  { id: 'child', name: 'Noah Serrin', injury: 'Civilian berth · cranial trauma', time: '06:20', effect: 'No strategic value. One life.' },
  { id: 'gunner', name: 'PO Havel', injury: 'Weapons deck · arterial bleed', time: '01:35', effect: 'Point-defense gunner' },
] as const

export function TriageGame({ onComplete }: { onComplete: (result: MiniGameResult & { selected: string[] }) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const choose = (id: string) => setSelected((current) => current.includes(id)
    ? current.filter((item) => item !== id)
    : current.length < 2 ? [...current, id] : current)

  return (
    <MiniGameFrame beat="BEAT 02 · THE WRONG STARS" title="Two surgical bays. Four lives." instruction="Corelli can stabilize only two cases before the reserve batteries fail. There is no hidden correct answer." variant="triage" background={ASSETS.cinematics.wrongStars} station="EMERGENCY MEDICAL" risk="POWER 08:00">
      <div className="triage-grid">
        {PATIENTS.map((patient) => (
          <button key={patient.id} className={`patient-card ${selected.includes(patient.id) ? 'selected' : ''}`} onClick={() => choose(patient.id)}>
            <span className="patient-time">{patient.time}</span>
            <strong>{patient.name}</strong>
            <small>{patient.injury}</small>
            <span className="patient-vitals" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
            <p>{patient.effect}</p>
            <b>{selected.includes(patient.id) ? 'ASSIGNED' : 'HOLDING'}</b>
          </button>
        ))}
      </div>
      <div className="selection-count">SURGICAL BAYS ASSIGNED <strong>{selected.length} / 2</strong></div>
      <button className="primary-action" disabled={selected.length !== 2} onClick={() => onComplete({ success: true, score: 2, selected, choiceId: selected.join('+') })}>
        Begin procedures <span>→</span>
      </button>
    </MiniGameFrame>
  )
}

const MEMORY_FRAGMENTS = [
  { id: 'alarm', index: 'K7', text: 'The launch alarm. A promise made to a daughter.' },
  { id: 'gate', index: 'Θ2', text: 'The Gate burning. A command that cannot be recalled.' },
  { id: 'garden', index: 'M4', text: 'Warm rain in Eirenai. Grief beginning to loosen.' },
  { id: 'empty', index: 'Ø9', text: 'A face remains. The name behind it is already gone.' },
] as const

export function MemoryGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const [error, setError] = useState(false)
  const add = (id: string) => {
    setError(false)
    setSequence((current) => current.includes(id) ? current : [...current, id])
  }
  const verify = () => {
    const correct = MEMORY_FRAGMENTS.every((fragment, index) => sequence[index] === fragment.id)
    if (correct) onComplete({ success: true, score: 100, choiceId: 'memory-restored' })
    else { setError(true); setSequence([]) }
  }

  return (
    <MiniGameFrame beat="BEAT 03 · THE GARDEN OF FORGETTING" title="Reconstruct the erased memory" instruction="The garden has loosened Lieutenant Sato’s autobiographical chain. Select the fragments from earliest to latest." variant="memory" background={ASSETS.cinematics.garden} station="NEURAL DIAGNOSTICS" risk="IDENTITY DECAY">
      <div className="memory-layout">
        <div className="memory-pool">
          {[MEMORY_FRAGMENTS[2], MEMORY_FRAGMENTS[0], MEMORY_FRAGMENTS[3], MEMORY_FRAGMENTS[1]].map((fragment) => (
            <button key={fragment.id} disabled={sequence.includes(fragment.id)} onClick={() => add(fragment.id)}>
              <span>{fragment.index}</span><p>{fragment.text}</p>
            </button>
          ))}
        </div>
        <div className="memory-subject">
          <div className="neural-head" aria-hidden="true"><i /><i /><i /><i /></div>
          <span>AUTOBIOGRAPHICAL CHAIN</span>
          <div className={`memory-chain ${error ? 'error' : ''}`}>
            {Array.from({ length: 4 }, (_, index) => {
              const fragment = MEMORY_FRAGMENTS.find((item) => item.id === sequence[index])
              return <div key={index} className={fragment ? 'filled' : ''}>{fragment?.index ?? index + 1}</div>
            })}
          </div>
        </div>
      </div>
      {error && <p className="error-message">Sequence rejected. The memory fractures and begins again.</p>}
      <button className="primary-action" disabled={sequence.length !== 4} onClick={verify}>Rebind memory <span>→</span></button>
    </MiniGameFrame>
  )
}

const OBSTACLES = [
  { at: 16, lane: 0 }, { at: 27, lane: 1 }, { at: 39, lane: 2 }, { at: 50, lane: 1 },
  { at: 61, lane: 0 }, { at: 72, lane: 2 }, { at: 83, lane: 1 }, { at: 92, lane: 0 },
] as const

export function ShuttleChaseGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [started, setStarted] = useState(false)
  const [lane, setLane] = useState(1)
  const [progress, setProgress] = useState(0)
  const [integrity, setIntegrity] = useState(100)
  const hitRef = useRef(new Set<number>())
  const laneRef = useRef(lane)
  const integrityRef = useRef(integrity)
  laneRef.current = lane
  integrityRef.current = integrity

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') setLane((value) => Math.max(0, value - 1))
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') setLane((value) => Math.min(2, value + 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!started) return
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 0.7)
        for (const obstacle of OBSTACLES) {
          if (Math.abs(next - obstacle.at) < 1 && obstacle.lane === laneRef.current && !hitRef.current.has(obstacle.at)) {
            hitRef.current.add(obstacle.at)
            integrityRef.current = Math.max(0, integrityRef.current - 28)
            setIntegrity(integrityRef.current)
          }
        }
        if (next >= 100) {
          window.clearInterval(timer)
          window.setTimeout(() => onComplete({ success: integrityRef.current > 0, score: integrityRef.current, choiceId: integrityRef.current > 0 ? 'shuttle-recovered' : 'shuttle-lost' }), 450)
        }
        return next
      })
    }, 70)
    return () => window.clearInterval(timer)
  }, [onComplete, started])

  return (
    <MiniGameFrame beat="BEAT 03 · THE GARDEN OF FORGETTING" title="Catch the departing shuttle" instruction="Thread the Ithaca’s launch through the rotating habitat rings. Use A/D, arrow keys, or the controls below." variant="chase" background={ASSETS.cinematics.garden} station="FLIGHT CONTROL" risk="LIVE PURSUIT">
      <div className={`chase-view ${started ? 'running' : ''}`}>
        <div className="chase-stars" />
        <div className="chase-lanes" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="chase-rings"><i /><i /><i /></div>
        {OBSTACLES.filter((obstacle) => obstacle.at > progress - 8 && obstacle.at < progress + 28).map((obstacle) => (
          <span key={obstacle.at} className="chase-obstacle" style={{ left: `${16 + obstacle.lane * 34}%`, top: `${90 - (obstacle.at - progress) * 3.4}%` }} />
        ))}
        <div className="shuttle-target">SHUTTLE<br /><strong>{Math.max(0, 18 - Math.floor(progress / 6))} KM</strong></div>
        <div className="chase-ship" style={{ left: `${18 + lane * 32}%` }}><img src={ASSETS.ships.ithaca} alt="" /><i /></div>
        {!started && <button className="launch-chase" onClick={() => setStarted(true)}>LAUNCH</button>}
      </div>
      <div className="chase-hud"><span>RANGE <strong>{Math.round(progress)}%</strong></span><span>HULL <strong>{integrity}%</strong></span></div>
      <div className="chase-controls">
        <button onClick={() => setLane((value) => Math.max(0, value - 1))}>← PORT</button>
        <button onClick={() => setLane((value) => Math.min(2, value + 1))}>STARBOARD →</button>
      </div>
    </MiniGameFrame>
  )
}

const CIRCUIT_TARGET = [2, 0, 3, 1] as const

export function CircuitGame({ onComplete }: { onComplete: (result: MiniGameResult) => void }) {
  const [phases, setPhases] = useState([0, 0, 0, 0])
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('Align all four waveforms with the sensor harmonic.')
  const resonance = (index: number) => {
    const distance = Math.abs(CIRCUIT_TARGET[index] - phases[index])
    return distance === 0 ? 100 : Math.min(distance, 4 - distance) === 1 ? 55 : 10
  }
  const turn = (index: number) => setPhases((current) => current.map((phase, i) => i === index ? (phase + 1) % 4 : phase))
  const test = () => {
    const success = CIRCUIT_TARGET.every((target, index) => phases[index] === target)
    if (success) onComplete({ success: true, score: Math.max(40, 100 - attempts * 15), choiceId: 'sensor-blinded' })
    else {
      setAttempts((value) => value + 1)
      const matching = CIRCUIT_TARGET.filter((target, index) => phases[index] === target).length
      setMessage(`${matching} of 4 harmonics locked. ARGUS is adapting.`)
      if (attempts >= 3) onComplete({ success: false, score: matching * 20, choiceId: 'sensor-alerted' })
    }
  }

  return (
    <MiniGameFrame beat="BEAT 04 · THE ONE-EYED FORTRESS" title="Blind the central eye" instruction="Rotate each stolen calibration ring to reproduce the sensor’s null harmonic. Four failed tests will alert every cutter in the moon." variant="circuit" background={ASSETS.cinematics.fortressInterior} station="SCIENCE / ELECTRONIC WARFARE" risk="ARGUS LISTENING">
      <div className="circuit-console">
        <div className="eye-display">
          <img src={ASSETS.portraits['argus-one']} alt="ARGUS-1 optical sensor" />
          <span className="eye-reticle"><i /><i /><i /></span>
          <p>{message}</p>
        </div>
        <div className="phase-rings">
          {phases.map((phase, index) => (
            <button key={index} onClick={() => turn(index)} style={{ '--phase': `${phase * 90}deg` } as React.CSSProperties}>
              <i /><strong>{String.fromCharCode(65 + index)}</strong><small>PHASE {phase} · ECHO {resonance(index)}%</small>
            </button>
          ))}
        </div>
      </div>
      <div className="attempts">DETECTION RISK <strong>{attempts} / 4</strong></div>
      <button className="primary-action" onClick={test}>Inject harmonic <span>→</span></button>
    </MiniGameFrame>
  )
}
