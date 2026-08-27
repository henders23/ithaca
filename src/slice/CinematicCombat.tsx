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
  mode?: 'destroy' | 'survive'
  survivalSeconds?: number
  victoryTitle?: string
  victoryText?: string
}

interface CombatResult {
  hull: number
  score: number
}

type WeaponId = 'lance' | 'missile' | 'ion'
type SfxId = WeaponId | 'impact' | 'shield'

interface WeaponEffect {
  id: number
  kind: WeaponId
  incoming: boolean
  duration: number
}

interface ImpactEffect {
  id: number
  kind: WeaponId
  incoming: boolean
  shielded: boolean
}

interface CombatFloater {
  id: number
  incoming: boolean
  text: string
  color: string
}

const WEAPONS = {
  lance: { name: 'Rail lance', cost: 42, damage: 1, duration: 240 },
  missile: { name: 'Kinetic salvo', cost: 68, damage: 2, duration: 860 },
  ion: { name: 'Ion shear', cost: 55, damage: 1, duration: 640 },
} as const

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
  const [survivalRemaining, setSurvivalRemaining] = useState(config.survivalSeconds ?? 30)
  const [effects, setEffects] = useState<WeaponEffect[]>([])
  const [impacts, setImpacts] = useState<ImpactEffect[]>([])
  const [floaters, setFloaters] = useState<CombatFloater[]>([])
  const [log, setLog] = useState('Weapons hot. Select a subsystem and fire.')
  const shieldRef = useRef(shield)
  const hullRef = useRef(hull)
  const pausedRef = useRef(paused)
  const phaseRef = useRef(phase)
  const audioRef = useRef<AudioContext | null>(null)
  const timersRef = useRef(new Set<number>())
  shieldRef.current = shield
  hullRef.current = hull
  pausedRef.current = paused
  phaseRef.current = phase

  const survivingTargets = useMemo(() => targets.filter((target) => target.currentHp > 0), [targets])
  const objectiveProgress = config.mode === 'survive'
    ? Math.round((1 - survivalRemaining / (config.survivalSeconds ?? 30)) * 100)
    : Math.round((1 - targets.reduce((sum, target) => sum + target.currentHp, 0) / targets.reduce((sum, target) => sum + target.hp, 0)) * 100)

  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      callback()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  const sfx = (type: SfxId) => {
    try {
      const context = audioRef.current ?? new AudioContext()
      audioRef.current = context
      if (context.state === 'suspended') void context.resume()
      const at = context.currentTime
      const output = context.createGain()
      output.gain.setValueAtTime(0.82, at)
      output.connect(context.destination)
      const oscillator = (shape: OscillatorType, from: number, to: number, duration: number, volume: number) => {
        const source = context.createOscillator()
        const gain = context.createGain()
        source.type = shape
        source.frequency.setValueAtTime(from, at)
        source.frequency.exponentialRampToValueAtTime(Math.max(1, to), at + duration)
        gain.gain.setValueAtTime(volume, at)
        gain.gain.exponentialRampToValueAtTime(0.001, at + duration)
        source.connect(gain).connect(output)
        source.start(at)
        source.stop(at + duration + 0.02)
      }
      const noise = (duration: number, volume: number, from: number, to: number) => {
        const length = Math.ceil(context.sampleRate * duration)
        const buffer = context.createBuffer(1, length, context.sampleRate)
        const data = buffer.getChannelData(0)
        for (let index = 0; index < length; index++) data[index] = Math.random() * 2 - 1
        const source = context.createBufferSource()
        const filter = context.createBiquadFilter()
        const gain = context.createGain()
        source.buffer = buffer
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(from, at)
        filter.frequency.exponentialRampToValueAtTime(to, at + duration)
        gain.gain.setValueAtTime(volume, at)
        gain.gain.exponentialRampToValueAtTime(0.001, at + duration)
        source.connect(filter).connect(gain).connect(output)
        source.start(at)
        source.stop(at + duration + 0.02)
      }
      if (type === 'lance') { oscillator('square', 920, 170, 0.15, 0.07); oscillator('sawtooth', 170, 70, 0.22, 0.04) }
      else if (type === 'missile') { noise(0.46, 0.11, 760, 130); oscillator('triangle', 110, 60, 0.32, 0.05) }
      else if (type === 'ion') { oscillator('sine', 620, 260, 0.25, 0.09); oscillator('sine', 940, 420, 0.2, 0.045) }
      else if (type === 'impact') { noise(0.2, 0.14, 980, 180); oscillator('sine', 130, 42, 0.25, 0.14) }
      else { oscillator('sine', 1500, 920, 0.18, 0.08); oscillator('sine', 2200, 1300, 0.13, 0.04) }
    } catch {
      // Audio remains a progressive enhancement when browser policy blocks it.
    }
  }

  const launchEffect = (
    kind: WeaponId,
    incoming: boolean,
    shielded: boolean,
    floater: string,
    onImpact: () => void,
  ) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const duration = WEAPONS[kind].duration
    setEffects((current) => [...current, { id, kind, incoming, duration }])
    sfx(kind)
    later(() => {
      setEffects((current) => current.filter((effect) => effect.id !== id))
      setImpacts((current) => [...current, { id, kind, incoming, shielded }])
      setFloaters((current) => [...current, { id, incoming, text: floater, color: shielded ? '#7de7ff' : incoming ? '#ff826d' : kind === 'ion' ? '#7de7ff' : '#ffd28d' }])
      sfx(shielded ? 'shield' : 'impact')
      onImpact()
      later(() => setImpacts((current) => current.filter((impact) => impact.id !== id)), 720)
      later(() => setFloaters((current) => current.filter((item) => item.id !== id)), 1250)
    }, duration)
  }

  useEffect(() => {
    const recharge = window.setInterval(() => {
      if (!pausedRef.current && phaseRef.current === 'playing') setCharge((value) => Math.min(100, value + 1.4))
    }, 100)
    return () => window.clearInterval(recharge)
  }, [])

  useEffect(() => {
    if (config.mode !== 'survive' || phase !== 'playing') return
    const countdown = window.setInterval(() => {
      if (pausedRef.current || phaseRef.current !== 'playing') return
      setSurvivalRemaining((current) => {
        const next = Math.max(0, current - 1)
        if (next === 0) {
          phaseRef.current = 'victory'
          setPhase('victory')
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(countdown)
  }, [config.mode, phase])

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
      const roll = Math.random()
      const kind: WeaponId = roll < 0.22 ? 'missile' : roll < 0.42 ? 'ion' : 'lance'
      const shielded = shieldRef.current > 0
      setLog(`${config.incomingLabel} ${kind === 'missile' ? 'Kinetic track inbound.' : kind === 'ion' ? 'Ion bloom detected.' : 'Energy spike detected.'}`)
      launchEffect(kind, true, shielded, shielded ? 'ABSORBED' : '-9 HULL', () => {
        if (phaseRef.current !== 'playing') return
        if (shieldRef.current > 0) {
          const damage = kind === 'ion' ? 27 : kind === 'missile' ? 22 : 18
          shieldRef.current = Math.max(0, shieldRef.current - damage)
          setShield(shieldRef.current)
        } else {
          const damage = kind === 'missile' ? 13 : 9
          hullRef.current = Math.max(0, hullRef.current - damage)
          setHull(hullRef.current)
          if (hullRef.current <= 0) {
            phaseRef.current = 'defeat'
            setPhase('defeat')
          }
        }
      })
    }, config.enemyInterval ?? 2700)
    return () => window.clearInterval(incoming)
  }, [config.enemyInterval, config.incomingLabel])

  useEffect(() => () => {
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current.clear()
    if (audioRef.current) void audioRef.current.close()
  }, [])

  const fire = (weaponId: WeaponId) => {
    const weapon = WEAPONS[weaponId]
    if (phase !== 'playing' || paused || charge < weapon.cost || (weaponId === 'missile' && missiles <= 0)) return
    const target = targets.find((item) => item.id === selected && item.currentHp > 0) ?? survivingTargets[0]
    if (!target) return
    setCharge((value) => value - weapon.cost)
    if (weaponId === 'missile') setMissiles((value) => value - 1)
    setLog(`${weapon.name} away. Tracking ${target.name}.`)
    launchEffect(weaponId, false, false, `-${weapon.damage} ${target.name.toUpperCase()}`, () => {
      setLog(`${weapon.name} impacts ${target.name}.`)
      setTargets((current) => {
        const next = current.map((item) => item.id === target.id ? { ...item, currentHp: Math.max(0, item.currentHp - weapon.damage) } : item)
        const remaining = next.filter((item) => item.currentHp > 0)
        if (!remaining.some((item) => item.id === selected) && remaining[0]) setSelected(remaining[0].id)
        if (remaining.length === 0 && config.mode !== 'survive') {
          phaseRef.current = 'victory'
          later(() => setPhase('victory'), 300)
        }
        if (config.mode === 'survive' && next.find((item) => item.id === target.id)?.currentHp === 0) {
          setLog(`${target.name} suppressed. The living hull is regenerating.`)
          later(() => {
            if (phaseRef.current !== 'playing') return
            setTargets((latest) => latest.map((item) => item.id === target.id ? { ...item, currentHp: item.hp } : item))
          }, 3800)
        }
        return next
      })
    })
  }

  const retry = () => {
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current.clear()
    const resetTargets = freshTargets()
    setTargets(resetTargets)
    setSelected(resetTargets[0]?.id ?? '')
    setCharge(70)
    setShield(100)
    setHull(config.playerHull)
    shieldRef.current = 100
    hullRef.current = config.playerHull
    setMissiles(3)
    setEffects([])
    setImpacts([])
    setFloaters([])
    setPaused(false)
    phaseRef.current = 'playing'
    setPhase('playing')
    setSurvivalRemaining(config.survivalSeconds ?? 30)
    setLog('Weapons hot. Select a subsystem and fire.')
  }

  const takingFire = effects.some((effect) => effect.incoming) || impacts.some((impact) => impact.incoming && !impact.shielded)

  return (
    <section className={`combat-screen ${takingFire ? 'taking-fire' : ''} ${paused ? 'is-paused' : ''}`} style={{ '--combat-bg': `url(${config.background})` } as React.CSSProperties}>
      <header className="combat-header">
        <div><span>{config.beat}</span><strong>{config.title}</strong></div>
        <button onClick={() => setPaused((value) => !value)}>{paused ? 'RESUME' : 'PAUSE'} <kbd>SPACE</kbd></button>
      </header>

      <div className="combat-space">
        <div className="battle-objective"><span>OBJECTIVE</span><strong>{config.objective}</strong>{config.mode === 'survive' && <b>{String(survivalRemaining).padStart(2, '0')} SEC</b>}<i style={{ width: `${objectiveProgress}%` }} /></div>
        <div className={`ship-shield player ${shield > 0 ? 'active' : ''}`}><i /><i /></div>
        <div className="ship-shield enemy active"><i /><i /></div>
        <div className="targeting-reticle enemy"><i /><i /><i /></div>
        <img className="combat-ship player" src={config.playerShip} alt="CSV Ithaca" />
        <img className="combat-ship enemy" src={config.enemyShip} alt={config.enemyName} />

        {effects.map((effect) => <WeaponFx key={effect.id} effect={effect} />)}
        {impacts.map((impact) => <ImpactFx key={impact.id} impact={impact} />)}
        {floaters.map((floater) => <div key={floater.id} className={`combat-floater ${floater.incoming ? 'incoming' : 'outgoing'}`} style={{ color: floater.color }}>{floater.text}</div>)}

        <div className="combat-log"><i className="log-pulse" />{log}</div>
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
              return <button key={weaponId} className={`weapon-${weaponId}`} disabled={unavailable || phase !== 'playing'} onClick={() => fire(weaponId)}><i /><strong>{weapon.name}</strong><small>{weapon.cost}% {weaponId === 'missile' ? `· ${missiles} LEFT` : ''}</small></button>
            })}
          </div>
        </div>
      </div>

      {paused && phase === 'playing' && <div className="combat-modal"><p className="eyebrow">TACTICAL PAUSE</p><h2>Time is holding.</h2><p>Select a target, check charge, then resume the battle.</p></div>}
      {phase !== 'playing' && (
        <div className="combat-modal result">
          <p className="eyebrow">{phase === 'victory' ? 'OBJECTIVE COMPLETE' : 'THE ITHACA IS LOST'}</p>
          <h2>{phase === 'victory' ? config.victoryTitle ?? 'The way is open.' : 'Return to the last firing solution.'}</h2>
          <p>{phase === 'victory' ? config.victoryText ?? `Hull integrity ${hull}%. Combat consequences will follow the ship.` : 'Defeat never erases a story choice. Retry the encounter.'}</p>
          <button className="primary-action" onClick={phase === 'victory' ? () => onComplete({ hull, score: hull + shield }) : retry}>{phase === 'victory' ? 'Resume the story' : 'Retry battle'} <span>→</span></button>
        </div>
      )}
    </section>
  )
}

function WeaponFx({ effect }: { effect: WeaponEffect }) {
  return (
    <div className={`weapon-fx fx-${effect.kind} ${effect.incoming ? 'incoming' : 'outgoing'}`} style={{ '--fx-duration': `${effect.duration}ms` } as React.CSSProperties}>
      <i /><i /><i />
    </div>
  )
}

function ImpactFx({ impact }: { impact: ImpactEffect }) {
  return (
    <div className={`impact-fx fx-${impact.kind} ${impact.incoming ? 'incoming' : 'outgoing'} ${impact.shielded ? 'shielded' : ''}`}>
      <i /><i /><i /><i /><i />
    </div>
  )
}

function Meter({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return <div className={`meter ${danger ? 'danger' : ''}`}><span>{label}</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>
}
