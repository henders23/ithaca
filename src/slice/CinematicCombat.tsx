import { useEffect, useMemo, useRef, useState } from 'react'

export interface CombatTarget {
  id: string
  name: string
  role: string
  hp: number
}

export interface CombatConfig {
  beat: string
  title: string
  objective: string
  background: string
  playerShip: string
  enemyShip: string
  enemyName: string
  incomingLabel: string
  targets: readonly CombatTarget[]
  playerHull: number
  enemyInterval?: number
}

interface CombatResult {
  hull: number
  score: number
}

type WeaponId = 'lance' | 'missile' | 'ion'

const WEAPONS = {
  lance: { name: 'Rail lance', cost: 42, damage: 1, tone: 148 },
  missile: { name: 'Kinetic salvo', cost: 68, damage: 2, tone: 92 },
  ion: { name: 'Ion shear', cost: 55, damage: 1, tone: 310 },
} as const

function playTone(frequency: number, duration = 0.12) {
  try {
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency / 2), context.currentTime + duration)
    gain.gain.setValueAtTime(0.04, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
    oscillator.addEventListener('ended', () => void context.close())
  } catch {
    // Audio is a progressive enhancement; some browsers require stricter gestures.
  }
}

export function CinematicCombat({ config, onComplete }: { config: CombatConfig; onComplete: (result: CombatResult) => void }) {
  const freshTargets = () => config.targets.map((target) => ({ ...target, currentHp: target.hp }))
  const [targets, setTargets] = useState(freshTargets)
  const [selected, setSelected] = useState(config.targets[0]?.id ?? '')
  const [charge, setCharge] = useState(70)
  const [shield, setShield] = useState(100)
  const [hull, setHull] = useState(config.playerHull)
  const [missiles, setMissiles] = useState(3)
  const [paused, setPaused] = useState(false)
  const [phase, setPhase] = useState<'playing' | 'victory' | 'defeat'>('playing')
  const [beam, setBeam] = useState<{ id: number; incoming: boolean } | null>(null)
  const [log, setLog] = useState('Weapons hot. Select a subsystem and fire.')
  const shieldRef = useRef(shield)
  const hullRef = useRef(hull)
  const pausedRef = useRef(paused)
  const phaseRef = useRef(phase)
  shieldRef.current = shield
  hullRef.current = hull
  pausedRef.current = paused
  phaseRef.current = phase

  const survivingTargets = useMemo(() => targets.filter((target) => target.currentHp > 0), [targets])
  const objectiveProgress = Math.round((1 - targets.reduce((sum, target) => sum + target.currentHp, 0) / targets.reduce((sum, target) => sum + target.hp, 0)) * 100)

  useEffect(() => {
    const recharge = window.setInterval(() => {
      if (!pausedRef.current && phaseRef.current === 'playing') setCharge((value) => Math.min(100, value + 1.4))
    }, 100)
    return () => window.clearInterval(recharge)
  }, [])

  useEffect(() => {
    const togglePause = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || phaseRef.current !== 'playing') return
      event.preventDefault()
      setPaused((value) => !value)
    }
    window.addEventListener('keydown', togglePause)
    return () => window.removeEventListener('keydown', togglePause)
  }, [])

  useEffect(() => {
    const incoming = window.setInterval(() => {
      if (pausedRef.current || phaseRef.current !== 'playing') return
      playTone(58, 0.24)
      setBeam({ id: Date.now(), incoming: true })
      setLog(config.incomingLabel)
      if (shieldRef.current > 0) {
        const damage = 18
        shieldRef.current = Math.max(0, shieldRef.current - damage)
        setShield(shieldRef.current)
      } else {
        const damage = 9
        hullRef.current = Math.max(0, hullRef.current - damage)
        setHull(hullRef.current)
        if (hullRef.current <= 0) {
          phaseRef.current = 'defeat'
          setPhase('defeat')
        }
      }
      window.setTimeout(() => setBeam(null), 320)
    }, config.enemyInterval ?? 2700)
    return () => window.clearInterval(incoming)
  }, [config.enemyInterval, config.incomingLabel])

  const fire = (weaponId: WeaponId) => {
    const weapon = WEAPONS[weaponId]
    if (phase !== 'playing' || paused || charge < weapon.cost || (weaponId === 'missile' && missiles <= 0)) return
    const target = targets.find((item) => item.id === selected && item.currentHp > 0) ?? survivingTargets[0]
    if (!target) return
    playTone(weapon.tone)
    setCharge((value) => value - weapon.cost)
    if (weaponId === 'missile') setMissiles((value) => value - 1)
    setBeam({ id: Date.now(), incoming: false })
    setLog(`${weapon.name} impacts ${target.name}.`)
    setTargets((current) => {
      const next = current.map((item) => item.id === target.id ? { ...item, currentHp: Math.max(0, item.currentHp - weapon.damage) } : item)
      const remaining = next.filter((item) => item.currentHp > 0)
      if (!remaining.some((item) => item.id === selected) && remaining[0]) setSelected(remaining[0].id)
      if (remaining.length === 0) {
        phaseRef.current = 'victory'
        window.setTimeout(() => setPhase('victory'), 260)
      }
      return next
    })
    window.setTimeout(() => setBeam(null), 280)
  }

  const retry = () => {
    const resetTargets = freshTargets()
    setTargets(resetTargets)
    setSelected(resetTargets[0]?.id ?? '')
    setCharge(70)
    setShield(100)
    setHull(config.playerHull)
    setMissiles(3)
    setPaused(false)
    setPhase('playing')
    setLog('Weapons hot. Select a subsystem and fire.')
  }

  return (
    <section className={`combat-screen ${beam?.incoming ? 'taking-fire' : ''}`} style={{ '--combat-bg': `url(${config.background})` } as React.CSSProperties}>
      <header className="combat-header">
        <div><span>{config.beat}</span><strong>{config.title}</strong></div>
        <button onClick={() => setPaused((value) => !value)}>{paused ? 'RESUME' : 'PAUSE'} <kbd>SPACE</kbd></button>
      </header>

      <div className="combat-space">
        <div className="battle-objective"><span>OBJECTIVE</span><strong>{config.objective}</strong><i style={{ width: `${objectiveProgress}%` }} /></div>
        <img className="combat-ship player" src={config.playerShip} alt="CSV Ithaca" />
        <img className="combat-ship enemy" src={config.enemyShip} alt={config.enemyName} />
        {beam && <div key={beam.id} className={`weapon-beam ${beam.incoming ? 'incoming' : 'outgoing'}`} />}
        <div className="combat-log">{log}</div>
      </div>

      <div className="combat-controls">
        <div className="ship-status">
          <strong>CSV ITHACA</strong>
          <Meter label="SHIELD" value={shield} />
          <Meter label="HULL" value={hull} danger />
        </div>
        <div className="target-bank">
          <span>TARGET SUBSYSTEM</span>
          <div>
            {targets.map((target) => (
              <button key={target.id} disabled={target.currentHp <= 0} className={selected === target.id ? 'selected' : ''} onClick={() => setSelected(target.id)}>
                <strong>{target.name}</strong><small>{target.role}</small>
                <i>{Array.from({ length: target.hp }, (_, index) => <b key={index} className={index < target.currentHp ? '' : 'lost'} />)}</i>
              </button>
            ))}
          </div>
        </div>
        <div className="weapon-bank">
          <div className="charge-row"><span>WEAPON CHARGE</span><strong>{Math.floor(charge)}%</strong></div>
          <div className="charge-track"><i style={{ width: `${charge}%` }} /></div>
          <div className="weapon-buttons">
            {(Object.keys(WEAPONS) as WeaponId[]).map((weaponId) => {
              const weapon = WEAPONS[weaponId]
              const unavailable = charge < weapon.cost || (weaponId === 'missile' && missiles <= 0)
              return <button key={weaponId} disabled={unavailable || phase !== 'playing'} onClick={() => fire(weaponId)}><strong>{weapon.name}</strong><small>{weapon.cost}% {weaponId === 'missile' ? `· ${missiles} LEFT` : ''}</small></button>
            })}
          </div>
        </div>
      </div>

      {paused && phase === 'playing' && <div className="combat-modal"><p className="eyebrow">TACTICAL PAUSE</p><h2>Time is holding.</h2><p>Select a target, check charge, then resume the battle.</p></div>}
      {phase !== 'playing' && (
        <div className="combat-modal result">
          <p className="eyebrow">{phase === 'victory' ? 'OBJECTIVE COMPLETE' : 'THE ITHACA IS LOST'}</p>
          <h2>{phase === 'victory' ? 'The way is open.' : 'Return to the last firing solution.'}</h2>
          <p>{phase === 'victory' ? `Hull integrity ${hull}%. Combat consequences will follow the ship.` : 'Defeat never erases a story choice. Retry the encounter.'}</p>
          <button className="primary-action" onClick={phase === 'victory' ? () => onComplete({ hull, score: hull + shield }) : retry}>{phase === 'victory' ? 'Resume the story' : 'Retry battle'} <span>→</span></button>
        </div>
      )}
    </section>
  )
}

function Meter({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return <div className={`meter ${danger ? 'danger' : ''}`}><span>{label}</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>
}
