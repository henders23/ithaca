import { useEffect, useRef, useState } from 'react'

export interface MiniGameResult {
  success: boolean
  score: number
  choiceId: string
}

interface MiniGameFrameProps {
  beat: string
  title: string
  instruction: string
  children: React.ReactNode
}

function MiniGameFrame({ beat, title, instruction, children }: MiniGameFrameProps) {
  return (
    <section className="minigame-screen">
      <header className="minigame-heading">
        <div><span>{beat}</span><strong>FIELD PROCEDURE</strong></div>
        <small>INTERACTIVE</small>
      </header>
      <div className="minigame-card">
        <p className="eyebrow">CREW ACTION</p>
        <h1>{title}</h1>
        <p className="minigame-instruction">{instruction}</p>
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
    <MiniGameFrame beat="BEAT 02 · THE WRONG STARS" title="Restore emergency power" instruction="The reactor can support eight load units. Keep life support online and decide what the ship can afford to save.">
      <div className="power-grid">
        <div className="reactor-core"><span>REACTOR</span><strong>{capacity - used}</strong><small>UNITS FREE</small></div>
        <div className="power-lines" aria-hidden="true" />
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
    <MiniGameFrame beat="BEAT 02 · THE WRONG STARS" title="Two surgical bays. Four lives." instruction="Corelli can stabilize only two cases before the reserve batteries fail. There is no hidden correct answer.">
      <div className="triage-grid">
        {PATIENTS.map((patient) => (
          <button key={patient.id} className={`patient-card ${selected.includes(patient.id) ? 'selected' : ''}`} onClick={() => choose(patient.id)}>
            <span className="patient-time">{patient.time}</span>
            <strong>{patient.name}</strong>
            <small>{patient.injury}</small>
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
  { id: 'alarm', index: 'I', text: 'The launch alarm. A promise made to a daughter.' },
  { id: 'gate', index: 'II', text: 'The Gate burning. A command that cannot be recalled.' },
  { id: 'garden', index: 'III', text: 'Warm rain in Eirenai. Grief beginning to loosen.' },
  { id: 'empty', index: 'IV', text: 'A face remains. The name behind it is already gone.' },
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
    <MiniGameFrame beat="BEAT 03 · THE GARDEN OF FORGETTING" title="Reconstruct the erased memory" instruction="The garden has loosened Lieutenant Sato’s autobiographical chain. Select the fragments from earliest to latest.">
      <div className="memory-layout">
        <div className="memory-pool">
          {[MEMORY_FRAGMENTS[2], MEMORY_FRAGMENTS[0], MEMORY_FRAGMENTS[3], MEMORY_FRAGMENTS[1]].map((fragment) => (
            <button key={fragment.id} disabled={sequence.includes(fragment.id)} onClick={() => add(fragment.id)}>
              <span>{fragment.index}</span><p>{fragment.text}</p>
            </button>
          ))}
        </div>
        <div className={`memory-chain ${error ? 'error' : ''}`}>
          {Array.from({ length: 4 }, (_, index) => {
            const fragment = MEMORY_FRAGMENTS.find((item) => item.id === sequence[index])
            return <div key={index} className={fragment ? 'filled' : ''}>{fragment?.index ?? index + 1}</div>
          })}
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
    <MiniGameFrame beat="BEAT 03 · THE GARDEN OF FORGETTING" title="Catch the departing shuttle" instruction="Thread the Ithaca’s launch through the rotating habitat rings. Use A/D, arrow keys, or the controls below.">
      <div className={`chase-view ${started ? 'running' : ''}`}>
        <div className="chase-stars" />
        <div className="chase-rings"><i /><i /><i /></div>
        {OBSTACLES.filter((obstacle) => obstacle.at > progress - 8 && obstacle.at < progress + 28).map((obstacle) => (
          <span key={obstacle.at} className="chase-obstacle" style={{ left: `${16 + obstacle.lane * 34}%`, top: `${90 - (obstacle.at - progress) * 3.4}%` }} />
        ))}
        <div className="shuttle-target">SHUTTLE<br /><strong>{Math.max(0, 18 - Math.floor(progress / 6))} KM</strong></div>
        <div className="chase-ship" style={{ left: `${18 + lane * 32}%` }}>▲</div>
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
    <MiniGameFrame beat="BEAT 04 · THE ONE-EYED FORTRESS" title="Blind the central eye" instruction="Rotate each stolen calibration ring to reproduce the sensor’s null harmonic. Four failed tests will alert every cutter in the moon.">
      <div className="circuit-console">
        <div className="eye-display"><span /><p>{message}</p></div>
        <div className="phase-rings">
          {phases.map((phase, index) => (
            <button key={index} onClick={() => turn(index)} style={{ '--phase': `${phase * 90}deg` } as React.CSSProperties}>
              <i /><strong>{String.fromCharCode(65 + index)}</strong><small>PHASE {phase}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="attempts">DETECTION RISK <strong>{attempts} / 4</strong></div>
      <button className="primary-action" onClick={test}>Inject harmonic <span>→</span></button>
    </MiniGameFrame>
  )
}
