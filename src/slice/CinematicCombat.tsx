import { useEffect, useMemo, useRef, useState } from 'react'
import { audioDirector } from '../audio/director.js'
import { useMusicScene } from '../audio/useAudio.js'
import { COMBAT_FX, EXPLOSION_SHEETS, type ExplosionId, type SfxId } from '../audio/tracks.js'

export interface CombatTarget {
  id: string
  name: string
  role: string
  hp: number
  protected?: boolean
}

export interface CombatConfig {
  beat: string
  title: string
  objective: string
  background: string
  playerShip: string
  enemyShip: string
  enemyName: string
  enemyClassName?: string
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

export interface LiveCombatTarget extends CombatTarget {
  currentHp: number
}

export function combatObjectiveTargets(targets: readonly LiveCombatTarget[]) {
  return targets.filter((target) => !target.protected)
}

export function combatObjectiveComplete(targets: readonly LiveCombatTarget[], mode: CombatConfig['mode']) {
  return mode !== 'survive' && combatObjectiveTargets(targets).every((target) => target.currentHp <= 0)
}

export function combatObjectiveProgress(targets: readonly LiveCombatTarget[], mode: CombatConfig['mode'], survivalRemaining = 0, survivalSeconds = 30) {
  if (mode === 'survive') return Math.round((1 - survivalRemaining / survivalSeconds) * 100)
  const objectives = combatObjectiveTargets(targets)
  const total = objectives.reduce((sum, target) => sum + target.hp, 0)
  const remaining = objectives.reduce((sum, target) => sum + target.currentHp, 0)
  return total === 0 ? 100 : Math.round((1 - remaining / total) * 100)
}

type WeaponId = 'lance' | 'missile' | 'ion'
type CombatSide = 'player' | 'enemy'

interface WeaponEffect {
  id: number
  kind: WeaponId
  incoming: boolean
  duration: number
}

/** Sprite-sheet and flash frames layered over the authored CSS weapon effects. */
type CombatSpriteBody =
  | { kind: 'flash'; image: string; side: CombatSide; size: number; life: number }
  | { kind: 'bolt'; image: string; incoming: boolean; height: number; duration: number }
  | { kind: 'explosion'; sheet: ExplosionId; side: CombatSide; size: number }

type CombatSprite = CombatSpriteBody & { id: number }

/** Fire sample, impact sample and travelling bolt frame for each weapon. */
const WEAPON_AUDIO: Record<WeaponId, { fire: SfxId; impact: SfxId; bolt: boolean }> = {
  lance: { fire: 'laserCannon', impact: 'mediumExplosion', bolt: false },
  missile: { fire: 'blaster', impact: 'torpedoExplosion', bolt: true },
  ion: { fire: 'laserBeam', impact: 'smallExplosion', bolt: true },
}

const COMBAT_SFX: readonly SfxId[] = [
  'laserBeam', 'laserCannon', 'blaster', 'smallExplosion', 'mediumExplosion', 'torpedoExplosion',
  'enemyDestroyed', 'shipDestroyed', 'enemySightedMale', 'enemySightedFemale',
  'reportingDamage', 'reportingDamageAlt',
]

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

let spriteSequence = 0
const nextSpriteId = () => ++spriteSequence

const WEAPONS = {
  lance: { name: 'Rail lance', cost: 42, damage: 1, duration: 240 },
  missile: { name: 'Kinetic salvo', cost: 68, damage: 2, duration: 860 },
  ion: { name: 'Ion shear', cost: 55, damage: 1, duration: 640 },
} as const

export function CinematicCombat({ config, onComplete }: { config: CombatConfig; onComplete: (result: CombatResult) => void }) {
  const freshTargets = () => config.targets.map((target) => ({ ...target, currentHp: target.hp }))
  const [targets, setTargets] = useState(freshTargets)
  const [selected, setSelected] = useState(config.targets.find((target) => !target.protected)?.id ?? '')
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
  const [sprites, setSprites] = useState<CombatSprite[]>([])
  const [log, setLog] = useState('Weapons hot. Select a subsystem and fire.')
  const shieldRef = useRef(shield)
  const hullRef = useRef(hull)
  const pausedRef = useRef(paused)
  const phaseRef = useRef(phase)
  const targetsRef = useRef(targets)
  const lastReportRef = useRef(0)
  const hailedRef = useRef('')
  const timersRef = useRef(new Set<number>())
  shieldRef.current = shield
  hullRef.current = hull
  pausedRef.current = paused
  phaseRef.current = phase
  targetsRef.current = targets

  useMusicScene('combat')

  const survivingTargets = useMemo(() => combatObjectiveTargets(targets).filter((target) => target.currentHp > 0), [targets])
  const objectiveProgress = combatObjectiveProgress(targets, config.mode, survivalRemaining, config.survivalSeconds ?? 30)

  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      callback()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  const sfx = (id: SfxId, level = 1) => audioDirector.playSfx(id, level)

  /** Crew damage-control chatter, rate-limited so it never stacks on itself. */
  const reportDamage = () => {
    const now = Date.now()
    if (now - lastReportRef.current < 5200) return
    lastReportRef.current = now
    sfx(Math.random() < 0.5 ? 'reportingDamage' : 'reportingDamageAlt', 0.7)
  }

  const addSprite = (sprite: CombatSpriteBody, life: number) => {
    const id = nextSpriteId()
    setSprites((current) => [...current, { ...sprite, id }])
    later(() => setSprites((current) => current.filter((item) => item.id !== id)), life)
  }

  const spawnFlash = (image: string, side: CombatSide, size: number, life = 320) =>
    addSprite({ kind: 'flash', image, side, size, life }, life)

  const spawnExplosion = (sheet: ExplosionId, side: CombatSide, size: number) => {
    const { columns, rows, frameMs } = EXPLOSION_SHEETS[sheet]
    addSprite({ kind: 'explosion', sheet, side, size }, columns * rows * frameMs + 60)
  }

  const launchEffect = (
    kind: WeaponId,
    incoming: boolean,
    shielded: boolean,
    floater: string,
    onImpact: () => void,
  ) => {
    const id = nextSpriteId()
    const duration = WEAPONS[kind].duration
    const audio = WEAPON_AUDIO[kind]
    const source: CombatSide = incoming ? 'enemy' : 'player'
    const struck: CombatSide = incoming ? 'player' : 'enemy'
    setEffects((current) => [...current, { id, kind, incoming, duration }])
    sfx(audio.fire, incoming ? 0.62 : 0.85)
    spawnFlash(incoming ? COMBAT_FX.muzzleEnemy : COMBAT_FX.muzzlePlayer, source, 96)
    if (audio.bolt) addSprite({ kind: 'bolt', image: incoming ? COMBAT_FX.enemyBolt : COMBAT_FX.playerBolt, incoming, height: incoming ? 62 : 54, duration }, duration)
    later(() => {
      setEffects((current) => current.filter((effect) => effect.id !== id))
      setImpacts((current) => [...current, { id, kind, incoming, shielded }])
      setFloaters((current) => [...current, { id, incoming, text: floater, color: shielded ? '#7de7ff' : incoming ? '#ff826d' : kind === 'ion' ? '#7de7ff' : '#ffd28d' }])
      if (shielded) {
        spawnFlash(struck === 'enemy' ? COMBAT_FX.shieldHitEnemy : COMBAT_FX.shieldHitPlayer, struck, 150, 420)
        sfx('smallExplosion', 0.45)
      } else {
        spawnExplosion(struck === 'enemy' ? 'orange' : 'red', struck, 150)
        spawnFlash(struck === 'enemy' ? COMBAT_FX.impactEnemy : COMBAT_FX.impactPlayer, struck, 130)
        sfx(audio.impact, incoming ? 0.7 : 0.78)
        if (incoming) reportDamage()
      }
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
            spawnExplosion('capital', 'player', 460)
            sfx('shipDestroyed', 0.95)
          }
        }
      })
    }, config.enemyInterval ?? 2700)
    return () => window.clearInterval(incoming)
  }, [config.enemyInterval, config.incomingLabel])

  useEffect(() => {
    audioDirector.preloadSfx(COMBAT_SFX)
    // One hail per encounter, even when development remounts the screen.
    if (hailedRef.current === config.beat) return
    hailedRef.current = config.beat
    audioDirector.playSfx(Math.random() < 0.5 ? 'enemySightedMale' : 'enemySightedFemale', 0.9)
  }, [config.beat])

  useEffect(() => () => {
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current.clear()
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
      // Destruction feedback is raised here rather than inside the updater so it
      // stays a single explosion and a single sample per killing blow.
      const before = targetsRef.current.find((item) => item.id === target.id)?.currentHp ?? 0
      if (before > 0 && before - weapon.damage <= 0) {
        spawnExplosion('capital', 'enemy', 340)
        sfx('enemyDestroyed', 0.9)
      }
      setTargets((current) => {
        const next = current.map((item) => item.id === target.id ? { ...item, currentHp: Math.max(0, item.currentHp - weapon.damage) } : item)
        const remaining = combatObjectiveTargets(next).filter((item) => item.currentHp > 0)
        if (!remaining.some((item) => item.id === selected) && remaining[0]) setSelected(remaining[0].id)
        if (combatObjectiveComplete(next, config.mode)) {
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
    setSelected(resetTargets.find((target) => !target.protected)?.id ?? '')
    setCharge(70)
    setShield(100)
    setHull(config.playerHull)
    shieldRef.current = 100
    hullRef.current = config.playerHull
    setMissiles(3)
    setEffects([])
    setImpacts([])
    setFloaters([])
    setSprites([])
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
        <img className={`combat-ship enemy ${config.enemyClassName ?? ''}`} src={config.enemyShip} alt={config.enemyName} />

        {sprites.map((sprite) => <CombatSpriteFx key={sprite.id} sprite={sprite} />)}
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
              <button key={target.id} disabled={target.currentHp <= 0 || target.protected} className={`${selected === target.id ? 'selected' : ''} ${target.protected ? 'protected' : ''}`} onClick={() => setSelected(target.id)}>
                <strong>{target.name}</strong><small>{target.role}</small>
                {target.protected ? <em>PROTECTED</em> : <i>{Array.from({ length: target.hp }, (_, index) => <b key={index} className={index < target.currentHp ? '' : 'lost'} />)}</i>}
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

function CombatSpriteFx({ sprite }: { sprite: CombatSprite }) {
  if (sprite.kind === 'bolt') {
    return <img className={`fx-sprite fx-bolt ${sprite.incoming ? 'incoming' : 'outgoing'}`} src={sprite.image} alt="" style={{ height: `${sprite.height}px`, '--fx-duration': `${sprite.duration}ms` } as React.CSSProperties} />
  }
  if (sprite.kind === 'flash') {
    return <img className={`fx-sprite fx-flash at-${sprite.side}`} src={sprite.image} alt="" style={{ width: `${sprite.size}px`, height: `${sprite.size}px`, '--fx-life': `${sprite.life}ms` } as React.CSSProperties} />
  }
  return <ExplosionFx sprite={sprite} />
}

/**
 * Steps a packed explosion sheet one cell at a time. The frame index is driven
 * in script rather than CSS because the sheets are two-dimensional grids.
 */
function ExplosionFx({ sprite }: { sprite: Extract<CombatSprite, { kind: 'explosion' }> }) {
  const sheet = EXPLOSION_SHEETS[sprite.sheet]
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setFrame((value) => value + 1), sheet.frameMs)
    return () => window.clearInterval(timer)
  }, [sheet.frameMs])

  if (frame >= sheet.columns * sheet.rows) return null
  const column = frame % sheet.columns
  const row = Math.floor(frame / sheet.columns)
  return (
    <div
      className={`fx-sprite fx-explosion at-${sprite.side}`}
      style={{
        width: `${sprite.size}px`,
        height: `${sprite.size}px`,
        backgroundImage: `url(${sheet.sheet})`,
        backgroundSize: `${sheet.columns * sprite.size}px ${sheet.rows * sprite.size}px`,
        backgroundPosition: `${-column * sprite.size}px ${-row * sprite.size}px`,
      }}
    />
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
