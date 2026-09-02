import { useEffect, useRef, useState } from 'react'
import { audioDirector } from '../audio/director.js'
import { useMusicScene } from '../audio/useAudio.js'
import { COMBAT_FX, EXPLOSION_SHEETS, type ExplosionId, type SfxId } from '../audio/tracks.js'
import {
  BRACE_COST, BRACE_WINDOW_MS, DESTROY_EFFECT_LABEL, ENEMY_WEAPON_LABEL, EVADE_WINDOW_MS, LOCK_WINDOW_MS, MAX_LOCK,
  POWER_PROFILES, POWER_PROFILE_IDS, RATING_COPY, SHIELD_REGEN_DELAY_MS, WEAPONS, WEAPON_IDS,
  combatRating, destroyEffectFor, enemyInterval, enemyIsAdapting, incomingDamage, objectiveTargets, rollEnemyWeapon,
  telegraphDuration, weaknessFor, weaponDamage,
  type CombatRating, type CombatTarget, type DestroyEffect, type LiveTarget, type PowerProfile, type WeaponId,
} from './combatRules.js'

export type { CombatTarget, WeaponId, PowerProfile } from './combatRules.js'

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
  crewBarks?: readonly CombatBark[]
}

export interface CombatBark {
  id: string
  trigger: 'shield-break' | 'hull-75' | 'hull-40' | 'adapt' | 'first-evade' | 'disrupt'
  speaker: string
  text: string
}

export interface CombatResult {
  hull: number
  score: number
  rating?: CombatRating
}

export type LiveCombatTarget = LiveTarget

export function combatObjectiveTargets(targets: readonly LiveCombatTarget[]) {
  return objectiveTargets(targets)
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

type CombatSide = 'player' | 'enemy'
type Phase = 'briefing' | 'playing' | 'victory' | 'defeat'

interface WeaponEffect {
  id: number
  kind: WeaponId
  incoming: boolean
  duration: number
}

type CombatSpriteBody =
  | { kind: 'flash'; image: string; side: CombatSide; size: number; life: number }
  | { kind: 'bolt'; image: string; incoming: boolean; height: number; duration: number }
  | { kind: 'explosion'; sheet: ExplosionId; side: CombatSide; size: number }

type CombatSprite = CombatSpriteBody & { id: number }

const WEAPON_AUDIO: Record<WeaponId, { fire: SfxId; impact: SfxId; bolt: boolean }> = {
  lance: { fire: 'laserCannon', impact: 'mediumExplosion', bolt: false },
  missile: { fire: 'blaster', impact: 'torpedoExplosion', bolt: true },
  ion: { fire: 'laserBeam', impact: 'smallExplosion', bolt: true },
}

const COMBAT_SFX: readonly SfxId[] = [
  'laserBeam', 'laserCannon', 'blaster', 'smallExplosion', 'mediumExplosion', 'torpedoExplosion',
  'enemyDestroyed', 'shipDestroyed', 'enemySightedMale', 'enemySightedFemale', 'uiClick',
]

const DEFAULT_CREW_BARKS: readonly CombatBark[] = [
  { id: 'shield-break', trigger: 'shield-break', speaker: 'MORI', text: 'Shields are gone. Route power to shields or the next sound is the hull.' },
  { id: 'hull-75', trigger: 'hull-75', speaker: 'CROSS', text: 'Still steering. Watch the warning line and burn when it goes red.' },
  { id: 'hull-40', trigger: 'hull-40', speaker: 'CORELLI', text: 'Deck Five is open to vacuum. I need the ship still for eight seconds.' },
  { id: 'adapt', trigger: 'adapt', speaker: 'CROSS', text: 'It’s learning our rhythm. Ion on whatever is still aiming at us.' },
  { id: 'first-evade', trigger: 'first-evade', speaker: 'MORI', text: 'Burn registered. The drive is held together with opinion, Captain.' },
  { id: 'disrupt', trigger: 'disrupt', speaker: 'N’DALA', text: 'Their fire control just went quiet. Three seconds. Use them.' },
]

interface ImpactEffect {
  id: number
  kind: WeaponId
  incoming: boolean
  shielded: boolean
  evaded: boolean
}

interface CombatFloater {
  id: number
  incoming: boolean
  text: string
  color: string
}

interface Telegraph {
  kind: WeaponId
  startedAt: number
  endsAt: number
  volley: boolean
}

interface ImpactOutcome {
  shielded: boolean
  evaded: boolean
  floater: string
  color: string
}

/** Everything that ticks. Kept in a ref so the clock never waits for React. */
interface Sim {
  phase: Phase
  elapsed: number
  charge: number
  shield: number
  hull: number
  missiles: number
  power: PowerProfile
  targets: LiveCombatTarget[]
  selected: string
  evadeReadyAt: number
  evadeUntil: number
  braceUntil: number
  lastHitAt: number
  lock: { targetId: string; count: number; lastAt: number }
  disruptedUntil: number
  nextAttackAt: number
  telegraph: Telegraph | null
  adapting: boolean
  volleyCounter: number
  slowed: number
  blinded: number
  evasions: number
  crits: number
  survivalRemaining: number
  survivalTickAt: number
  incomingInFlight: number
}

let spriteSequence = 0
const nextSpriteId = () => ++spriteSequence

const TICK_MS = 100

export function CinematicCombat({ config, onComplete }: { config: CombatConfig; onComplete: (result: CombatResult) => void }) {
  const freshTargets = (): LiveCombatTarget[] => config.targets.map((target) => ({ ...target, currentHp: target.hp }))
  const freshSim = (): Sim => ({
    phase: 'briefing',
    elapsed: 0,
    charge: 70,
    shield: 100,
    hull: config.playerHull,
    missiles: WEAPONS.missile.ammo ?? 3,
    power: 'weapons',
    targets: freshTargets(),
    selected: config.targets.find((target) => !target.protected)?.id ?? '',
    evadeReadyAt: 0,
    evadeUntil: 0,
    braceUntil: 0,
    lastHitAt: -SHIELD_REGEN_DELAY_MS,
    lock: { targetId: '', count: 0, lastAt: 0 },
    disruptedUntil: 0,
    nextAttackAt: config.enemyInterval ?? 2700,
    telegraph: null,
    adapting: false,
    volleyCounter: 0,
    slowed: 0,
    blinded: 0,
    evasions: 0,
    crits: 0,
    survivalRemaining: config.survivalSeconds ?? 30,
    survivalTickAt: 0,
    incomingInFlight: 0,
  })

  const simRef = useRef<Sim>(freshSim())
  const [sim, setSim] = useState<Sim>(() => simRef.current)
  const [paused, setPaused] = useState(false)
  const [effects, setEffects] = useState<WeaponEffect[]>([])
  const [impacts, setImpacts] = useState<ImpactEffect[]>([])
  const [floaters, setFloaters] = useState<CombatFloater[]>([])
  const [sprites, setSprites] = useState<CombatSprite[]>([])
  const [log, setLog] = useState('Weapons hot. Pick a subsystem, watch the warning line, fire.')
  const [crewBark, setCrewBark] = useState<CombatBark | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [banking, setBanking] = useState(false)
  const [rating, setRating] = useState<CombatRating | null>(null)
  const pausedRef = useRef(paused)
  const barkHistoryRef = useRef(new Set<string>())
  const hailedRef = useRef('')
  const timersRef = useRef(new Set<number>())
  pausedRef.current = paused

  useMusicScene('combat')

  const publish = () => setSim({ ...simRef.current, targets: simRef.current.targets.map((target) => ({ ...target })) })

  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      callback()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  const sfx = (id: SfxId, level = 1) => audioDirector.playSfx(id, level)

  const showCrewBark = (trigger: CombatBark['trigger']) => {
    const bark = (config.crewBarks ?? DEFAULT_CREW_BARKS).find((candidate) => candidate.trigger === trigger && !barkHistoryRef.current.has(candidate.id))
    if (!bark) return
    barkHistoryRef.current.add(bark.id)
    setCrewBark(bark)
    later(() => setCrewBark((current) => current?.id === bark.id ? null : current), 3600)
  }

  const showBanner = (text: string, life = 2600) => {
    setBanner(text)
    later(() => setBanner((current) => current === text ? null : current), life)
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

  /** Launches a projectile; the outcome is resolved only when it arrives, so a late dodge still counts. */
  const launchEffect = (kind: WeaponId, incoming: boolean, resolve: () => ImpactOutcome | null) => {
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
      const outcome = resolve()
      if (!outcome) return
      setImpacts((current) => [...current, { id, kind, incoming, shielded: outcome.shielded, evaded: outcome.evaded }])
      setFloaters((current) => [...current, { id, incoming, text: outcome.floater, color: outcome.color }])
      if (outcome.evaded) {
        sfx('uiClick', 0.3)
      } else if (outcome.shielded) {
        spawnFlash(struck === 'enemy' ? COMBAT_FX.shieldHitEnemy : COMBAT_FX.shieldHitPlayer, struck, 150, 420)
        sfx('smallExplosion', 0.45)
      } else {
        spawnExplosion(struck === 'enemy' ? 'orange' : 'red', struck, 150)
        spawnFlash(struck === 'enemy' ? COMBAT_FX.impactEnemy : COMBAT_FX.impactPlayer, struck, 130)
        sfx(audio.impact, incoming ? 0.7 : 0.78)
      }
      later(() => setImpacts((current) => current.filter((impact) => impact.id !== id)), 720)
      later(() => setFloaters((current) => current.filter((item) => item.id !== id)), 1250)
    }, duration)
  }

  const finish = (phase: 'victory' | 'defeat') => {
    const state = simRef.current
    if (state.phase !== 'playing') return
    state.phase = phase
    state.telegraph = null
    if (phase === 'victory') {
      setRating(combatRating({ hull: state.hull, startingHull: config.playerHull, evasions: state.evasions, crits: state.crits, seconds: state.elapsed / 1000 }))
    } else {
      spawnExplosion('capital', 'player', 460)
      sfx('shipDestroyed', 0.95)
    }
    publish()
  }

  const launchIncoming = (kind: WeaponId) => {
    const state = simRef.current
    state.incomingInFlight += 1
    launchEffect(kind, true, () => {
      const live = simRef.current
      live.incomingInFlight = Math.max(0, live.incomingInFlight - 1)
      if (live.phase !== 'playing') return null
      if (live.evadeUntil > live.elapsed) {
        live.evasions += 1
        if (live.evasions === 1) showCrewBark('first-evade')
        setLog('Evasive burn. The shot crosses empty space.')
        return { shielded: false, evaded: true, floater: 'EVADED', color: '#9df2c4' }
      }
      if (Math.random() < POWER_PROFILES[live.power].passiveDodge) {
        setLog('Engine power throws the firing solution. Miss.')
        return { shielded: false, evaded: true, floater: 'MISS', color: '#9df2c4' }
      }
      const braced = live.braceUntil > live.elapsed
      const { shieldLoss, hullLoss } = incomingDamage(kind, live.shield, braced)
      const shieldBefore = live.shield
      const hullBefore = live.hull
      live.shield = Math.max(0, live.shield - shieldLoss)
      live.hull = Math.max(0, live.hull - hullLoss)
      live.lastHitAt = live.elapsed
      if (shieldBefore > 0 && live.shield === 0) showCrewBark('shield-break')
      if (hullBefore > 75 && live.hull <= 75) showCrewBark('hull-75')
      if (hullBefore > 40 && live.hull <= 40) showCrewBark('hull-40')
      if (live.hull <= 0) finish('defeat')
      const shielded = shieldBefore > 0
      const floater = braced
        ? `BRACED ${shieldLoss ? `-${shieldLoss} SHIELD` : `-${hullLoss} HULL`}`
        : shielded ? (hullLoss ? `-${shieldLoss} SHIELD · -${hullLoss} HULL` : 'ABSORBED') : `-${hullLoss} HULL`
      return { shielded, evaded: false, floater, color: braced ? '#7de7ff' : shielded ? '#7de7ff' : '#ff826d' }
    })
  }

  const cycleTarget = (direction = 1) => {
    const state = simRef.current
    const alive = objectiveTargets(state.targets).filter((target) => target.currentHp > 0)
    if (!alive.length) return
    const index = alive.findIndex((target) => target.id === state.selected)
    state.selected = alive[(index + direction + alive.length) % alive.length].id
    publish()
  }

  const fire = (weaponId: WeaponId) => {
    const state = simRef.current
    const weapon = WEAPONS[weaponId]
    if (state.phase !== 'playing' || pausedRef.current || state.charge < weapon.cost || (weaponId === 'missile' && state.missiles <= 0)) return
    const alive = objectiveTargets(state.targets).filter((item) => item.currentHp > 0)
    const target = alive.find((item) => item.id === state.selected) ?? alive[0]
    if (!target) return
    state.charge -= weapon.cost
    if (weaponId === 'missile') state.missiles -= 1
    setLog(`${weapon.name} away. Tracking ${target.name}.`)
    publish()
    launchEffect(weaponId, false, () => {
      const live = simRef.current
      if (live.phase !== 'playing') return null
      const current = live.targets.find((item) => item.id === target.id)
      if (!current || current.currentHp <= 0) return { shielded: false, evaded: false, floater: 'ALREADY DOWN', color: '#8ca0ae' }
      const chained = live.lock.targetId === target.id && live.elapsed - live.lock.lastAt <= LOCK_WINDOW_MS
      const lockCount = chained ? live.lock.count : 0
      const index = live.targets.findIndex((item) => item.id === target.id)
      const roll = weaponDamage(weaponId, weaknessFor(current, index), lockCount)
      current.currentHp = Math.max(0, current.currentHp - roll.damage)
      live.lock = { targetId: target.id, count: roll.crit ? 0 : Math.min(MAX_LOCK, lockCount + 1), lastAt: live.elapsed }
      if (roll.crit) live.crits += 1
      if (weaponId === 'ion') {
        live.disruptedUntil = live.elapsed + (weapon.disruptMs ?? 0)
        live.telegraph = null
        showCrewBark('disrupt')
      }
      const flavour = roll.crit ? 'LOCKED SHOT' : roll.weak ? 'WEAK POINT' : ''
      if (current.currentHp === 0) {
        spawnExplosion('capital', 'enemy', 340)
        sfx('enemyDestroyed', 0.9)
        const effect = destroyEffectFor(current)
        if (effect === 'slows-fire') { live.slowed += 1; setLog(`${target.name} destroyed. Enemy fire slows.`) }
        else if (effect === 'blinds') { live.blinded += 1; setLog(`${target.name} destroyed. Their warnings will show earlier.`) }
        else setLog(`${target.name} destroyed.`)
        if (config.mode === 'survive') {
          later(() => {
            const latest = simRef.current
            if (latest.phase !== 'playing') return
            const regrown = latest.targets.find((item) => item.id === target.id)
            if (regrown) regrown.currentHp = regrown.hp
            if (effect === 'slows-fire') latest.slowed = Math.max(0, latest.slowed - 1)
            if (effect === 'blinds') latest.blinded = Math.max(0, latest.blinded - 1)
            publish()
          }, 3800)
        }
      } else {
        setLog(`${weapon.name} impacts ${target.name}.${roll.weak ? ' Weak point.' : ''}${weaponId === 'ion' ? ' Fire control silenced.' : ''}`)
      }
      const alive = objectiveTargets(live.targets).filter((item) => item.currentHp > 0)
      if (!alive.some((item) => item.id === live.selected) && alive[0]) live.selected = alive[0].id
      if (combatObjectiveComplete(live.targets, config.mode)) later(() => finish('victory'), 300)
      publish()
      return { shielded: false, evaded: false, floater: `-${roll.damage} ${target.name.toUpperCase()}${flavour ? ` · ${flavour}` : ''}`, color: roll.crit ? '#fff1c4' : weaponId === 'ion' ? '#7de7ff' : '#ffd28d' }
    })
  }

  const evade = () => {
    const state = simRef.current
    if (state.phase !== 'playing' || pausedRef.current || state.evadeReadyAt > state.elapsed) return
    state.evadeUntil = state.elapsed + EVADE_WINDOW_MS
    state.evadeReadyAt = state.elapsed + POWER_PROFILES[state.power].evadeCooldownMs
    setBanking(true)
    later(() => setBanking(false), 700)
    setLog('Evasive burn. Hold on.')
    publish()
  }

  const brace = () => {
    const state = simRef.current
    if (state.phase !== 'playing' || pausedRef.current || state.charge < BRACE_COST || state.braceUntil > state.elapsed) return
    state.charge -= BRACE_COST
    state.braceUntil = state.elapsed + BRACE_WINDOW_MS
    setLog('Shields angled. The next hit lands on the thick side.')
    publish()
  }

  const routePower = (profile: PowerProfile) => {
    const state = simRef.current
    if (state.phase !== 'playing' || state.power === profile) return
    state.power = profile
    setLog(`Power to ${POWER_PROFILES[profile].label.toLowerCase()}. ${POWER_PROFILES[profile].detail}`)
    sfx('uiClick', 0.2)
    publish()
  }

  const engage = () => {
    const state = simRef.current
    if (state.phase !== 'briefing') return
    state.phase = 'playing'
    setLog('Weapons hot. Pick a subsystem, watch the warning line, fire.')
    publish()
  }

  const retry = () => {
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current.clear()
    simRef.current = freshSim()
    simRef.current.phase = 'playing'
    setEffects([])
    setImpacts([])
    setFloaters([])
    setSprites([])
    setPaused(false)
    setBanner(null)
    setCrewBark(null)
    setRating(null)
    barkHistoryRef.current.clear()
    setLog('Weapons hot. Pick a subsystem, watch the warning line, fire.')
    publish()
  }

  useEffect(() => {
    const clock = window.setInterval(() => {
      const state = simRef.current
      if (pausedRef.current || state.phase !== 'playing') return
      state.elapsed += TICK_MS
      const profile = POWER_PROFILES[state.power]
      state.charge = Math.min(100, state.charge + profile.chargeRate)
      if (profile.shieldRegen > 0 && state.shield < 100 && state.incomingInFlight === 0 && state.elapsed - state.lastHitAt >= SHIELD_REGEN_DELAY_MS && !state.telegraph) {
        state.shield = Math.min(100, state.shield + profile.shieldRegen)
      }
      if (config.mode === 'survive' && state.elapsed - state.survivalTickAt >= 1000) {
        state.survivalTickAt = state.elapsed
        state.survivalRemaining = Math.max(0, state.survivalRemaining - 1)
        if (state.survivalRemaining === 0) { finish('victory'); return }
      }
      const adapting = enemyIsAdapting(state.targets, config.mode, state.survivalRemaining, config.survivalSeconds ?? 30)
      if (adapting && !state.adapting) {
        state.adapting = true
        showBanner('THE ENEMY ADAPTS · faster fire · volleys')
        showCrewBark('adapt')
        sfx('enemySightedMale', 0.5)
      }
      if (state.disruptedUntil > state.elapsed) {
        state.telegraph = null
        state.nextAttackAt = Math.max(state.nextAttackAt, state.disruptedUntil + 400)
      } else if (!state.telegraph && state.elapsed >= state.nextAttackAt) {
        state.volleyCounter += 1
        const volley = state.adapting && state.volleyCounter % 3 === 0
        state.telegraph = { kind: rollEnemyWeapon(Math.random()), startedAt: state.elapsed, endsAt: state.elapsed + telegraphDuration(state.blinded), volley }
        setLog(`${config.incomingLabel} ${ENEMY_WEAPON_LABEL[state.telegraph.kind].toLowerCase()} charging${volley ? ' — volley' : ''}.`)
      } else if (state.telegraph && state.elapsed >= state.telegraph.endsAt) {
        const { kind, volley } = state.telegraph
        state.telegraph = null
        state.nextAttackAt = state.elapsed + enemyInterval(config.enemyInterval ?? 2700, state.slowed, state.adapting)
        launchIncoming(kind)
        if (volley) later(() => { if (simRef.current.phase === 'playing') launchIncoming(rollEnemyWeapon(Math.random())) }, 380)
      }
      publish()
    }, TICK_MS)
    return () => window.clearInterval(clock)
    // The clock reads config through refs-equivalent closures that do not change per encounter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const state = simRef.current
      if (event.code === 'Space') {
        if (state.phase === 'briefing') { event.preventDefault(); engage(); return }
        if (state.phase !== 'playing') return
        event.preventDefault()
        setPaused((value) => !value)
        return
      }
      if (state.phase === 'briefing' && event.key === 'Enter') { engage(); return }
      if (state.phase !== 'playing') return
      const key = event.key.toLowerCase()
      if (key === '1') fire('lance')
      else if (key === '2') fire('missile')
      else if (key === '3') fire('ion')
      else if (key === 'q') evade()
      else if (key === 'e') brace()
      else if (key === 'z') routePower('weapons')
      else if (key === 'x') routePower('shields')
      else if (key === 'c') routePower('engines')
      else if (key === 'tab') { event.preventDefault(); cycleTarget(event.shiftKey ? -1 : 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    audioDirector.preloadSfx(COMBAT_SFX)
    if (hailedRef.current === config.beat) return
    hailedRef.current = config.beat
    audioDirector.playSfx(Math.random() < 0.5 ? 'enemySightedMale' : 'enemySightedFemale', 0.9)
  }, [config.beat])

  useEffect(() => () => {
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current.clear()
  }, [])

  const { phase, targets, selected, charge, shield, hull, missiles, power, telegraph, elapsed, evadeReadyAt, evadeUntil, braceUntil, lock, disruptedUntil, adapting, survivalRemaining, evasions, crits } = sim
  const objectiveProgress = combatObjectiveProgress(targets, config.mode, survivalRemaining, config.survivalSeconds ?? 30)
  const takingFire = effects.some((effect) => effect.incoming) || impacts.some((impact) => impact.incoming && !impact.shielded && !impact.evaded)
  const telegraphProgress = telegraph ? Math.min(1, (elapsed - telegraph.startedAt) / (telegraph.endsAt - telegraph.startedAt)) : 0
  const dodgeWindow = telegraph ? telegraphProgress >= 0.35 : false
  const evadeCooldown = Math.max(0, evadeReadyAt - elapsed)
  const evadeActive = evadeUntil > elapsed
  const braceActive = braceUntil > elapsed
  const disrupted = disruptedUntil > elapsed
  const lockChained = lock.targetId === selected && elapsed - lock.lastAt <= LOCK_WINDOW_MS
  const lockCount = lockChained ? lock.count : 0
  const profile = POWER_PROFILES[power]
  const evadeSeconds = (evadeCooldown / 1000).toFixed(1)

  return (
    <section className={`combat-screen ${takingFire ? 'taking-fire' : ''} ${paused ? 'is-paused' : ''} ${hull <= 40 && phase === 'playing' ? 'critical' : ''} ${adapting ? 'adapting' : ''}`} style={{ '--combat-bg': `url(${config.background})` } as React.CSSProperties}>
      <header className="combat-header">
        <div><span>{config.beat}</span><strong>{config.title}</strong></div>
        <div className="combat-header-tools">
          <span className="combat-clock">{formatClock(elapsed)}</span>
          <button onClick={() => phase === 'playing' && setPaused((value) => !value)}>{paused ? 'RESUME' : 'PAUSE'} <kbd>SPACE</kbd></button>
        </div>
      </header>

      <div className="combat-space">
        <div className="battle-objective"><span>OBJECTIVE</span><strong>{config.objective}</strong>{config.mode === 'survive' && <b>{String(survivalRemaining).padStart(2, '0')} SEC</b>}<i style={{ width: `${objectiveProgress}%` }} /></div>
        <div className={`ship-shield player ${shield > 0 ? 'active' : ''} ${braceActive ? 'braced' : ''}`}><i /><i /></div>
        <div className={`ship-shield enemy active ${disrupted ? 'disrupted' : ''}`}><i /><i /></div>
        <div className={`targeting-reticle enemy ${adapting ? 'hostile' : ''} ${lockCount >= MAX_LOCK ? 'locked' : ''}`}><i /><i /><i /></div>
        {telegraph && <div className={`threat-line ${dodgeWindow ? 'imminent' : ''}`} aria-hidden="true" />}
        <img className={`combat-ship player ${banking ? 'banking' : ''} ${evadeActive ? 'evading' : ''}`} src={config.playerShip} alt="CSV Ithaca" />
        <img className={`combat-ship enemy ${config.enemyClassName ?? ''} ${disrupted ? 'disrupted' : ''}`} src={config.enemyShip} alt={config.enemyName} />

        {sprites.map((sprite) => <CombatSpriteFx key={sprite.id} sprite={sprite} />)}
        {effects.map((effect) => <WeaponFx key={effect.id} effect={effect} />)}
        {impacts.map((impact) => <ImpactFx key={impact.id} impact={impact} />)}
        {floaters.map((floater) => <div key={floater.id} className={`combat-floater ${floater.incoming ? 'incoming' : 'outgoing'}`} style={{ color: floater.color }}>{floater.text}</div>)}

        {telegraph && (
          <div className={`incoming-warning ${dodgeWindow ? 'dodge-window' : ''} ${telegraph.volley ? 'volley' : ''}`} role="status">
            <span>{dodgeWindow ? 'BURN NOW · Q' : 'INCOMING'}</span>
            <strong>{ENEMY_WEAPON_LABEL[telegraph.kind]}{telegraph.volley ? ' · VOLLEY ×2' : ''}</strong>
            <i style={{ width: `${telegraphProgress * 100}%` }} />
          </div>
        )}
        {disrupted && <div className="enemy-status disrupted-tag">FIRE CONTROL SILENCED · {((disruptedUntil - elapsed) / 1000).toFixed(1)}s</div>}
        {banner && <div className="combat-banner">{banner}</div>}

        <div className="combat-log"><i className="log-pulse" />{log}</div>
        {crewBark && <div className="combat-bark" role="status"><strong>{crewBark.speaker}</strong><span>{crewBark.text}</span></div>}
      </div>

      <div className="combat-controls">
        <div className="ship-status">
          <strong>CSV ITHACA</strong>
          <Meter label="SHIELD" value={Math.round(shield)} />
          <Meter label="HULL" value={hull} danger />
          <div className="power-router">
            <span>POWER ROUTING</span>
            <div>
              {POWER_PROFILE_IDS.map((id) => (
                <button key={id} className={`power-${id} ${power === id ? 'active' : ''}`} disabled={phase !== 'playing'} onClick={() => routePower(id)}>
                  <strong>{POWER_PROFILES[id].label}</strong><kbd>{POWER_PROFILES[id].key}</kbd>
                </button>
              ))}
            </div>
            <small>{profile.detail}</small>
          </div>
        </div>

        <div className="target-bank">
          <span>TARGET SUBSYSTEM <kbd>TAB</kbd> cycles</span>
          <div>
            {targets.map((target, index) => {
              const weakness = weaknessFor(target, index)
              const effect = destroyEffectFor(target)
              return (
                <button key={target.id} disabled={target.currentHp <= 0 || target.protected} className={`${selected === target.id ? 'selected' : ''} ${target.protected ? 'protected' : ''} ${target.currentHp <= 0 ? 'destroyed' : ''}`} onClick={() => { simRef.current.selected = target.id; publish() }}>
                  <strong>{target.name}</strong><small>{target.role}</small>
                  {target.protected
                    ? <em>PROTECTED</em>
                    : <>
                        <i>{Array.from({ length: target.hp }, (_, pip) => <b key={pip} className={pip < target.currentHp ? '' : 'lost'} />)}</i>
                        <span className={`weak-tag weak-${weakness}`}>WEAK · {WEAPONS[weakness].name.split(' ')[1]?.toUpperCase() ?? weakness.toUpperCase()}</span>
                        {effect !== 'none' && <span className="effect-tag">{DESTROY_EFFECT_LABEL[effect]}</span>}
                      </>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="weapon-bank">
          <div className="charge-row"><span>WEAPON CHARGE</span><strong>{Math.floor(charge)}%</strong></div>
          <div className="charge-track"><i style={{ width: `${charge}%` }} /></div>
          <div className="weapon-buttons">
            {WEAPON_IDS.map((weaponId) => {
              const weapon = WEAPONS[weaponId]
              const unavailable = charge < weapon.cost || (weaponId === 'missile' && missiles <= 0)
              const selectedTarget = targets.find((target) => target.id === selected)
              const selectedIndex = targets.findIndex((target) => target.id === selected)
              const effective = selectedTarget && !selectedTarget.protected && weaknessFor(selectedTarget, selectedIndex) === weaponId
              return (
                <button key={weaponId} className={`weapon-${weaponId} ${effective ? 'effective' : ''}`} disabled={unavailable || phase !== 'playing'} onClick={() => fire(weaponId)} title={weapon.detail}>
                  <i /><strong>{weapon.name}</strong><small>{weapon.cost}% {weaponId === 'missile' ? `· ${missiles} LEFT` : ''}{effective ? ' · WEAK POINT' : ''}</small><kbd>{weapon.key}</kbd>
                </button>
              )
            })}
          </div>
          <div className="lock-row">
            <span>TARGET LOCK</span>
            <i>{Array.from({ length: MAX_LOCK }, (_, pip) => <b key={pip} className={pip < lockCount ? 'lit' : ''} />)}</i>
            <small>{lockCount >= MAX_LOCK ? 'NEXT HIT +1' : 'consecutive hits · same target'}</small>
          </div>
        </div>

        <div className="maneuver-bank">
          <span>MANOEUVRE</span>
          <button className={`maneuver evade ${evadeActive ? 'active' : ''} ${evadeCooldown > 0 ? 'cooling' : ''}`} disabled={phase !== 'playing' || evadeCooldown > 0} onClick={evade}>
            <strong>EVASIVE BURN</strong>
            <small>{evadeActive ? 'BURNING' : evadeCooldown > 0 ? `READY IN ${evadeSeconds}s` : 'dodge the next shot'}</small>
            <kbd>Q</kbd>
            <i style={{ width: evadeCooldown > 0 ? `${100 - (evadeCooldown / profile.evadeCooldownMs) * 100}%` : '100%' }} />
          </button>
          <button className={`maneuver brace ${braceActive ? 'active' : ''}`} disabled={phase !== 'playing' || braceActive || charge < BRACE_COST} onClick={brace}>
            <strong>BRACE SHIELDS</strong>
            <small>{braceActive ? 'ANGLED' : `half damage · ${BRACE_COST}% charge`}</small>
            <kbd>E</kbd>
          </button>
          <div className="sortie-stats"><span>EVADED <b>{evasions}</b></span><span>LOCKED SHOTS <b>{crits}</b></span></div>
        </div>
      </div>

      {phase === 'briefing' && (
        <div className="combat-modal briefing">
          <p className="eyebrow">{config.beat} · TACTICAL BRIEFING</p>
          <h2>{config.title}</h2>
          <p>{config.objective}.</p>
          <ul className="briefing-rules">
            <li><kbd>1 2 3</kbd><span>Fire. Every subsystem shows the weapon it is weak to.</span></li>
            <li><kbd>Q</kbd><span>Evasive burn while the warning line is red. A dodged shot costs nothing.</span></li>
            <li><kbd>Z X C</kbd><span>Route reactor power: faster charge, knitting shields, or a quicker burn.</span></li>
            <li><kbd>3</kbd><span>Ion shear silences enemy fire control for three seconds.</span></li>
          </ul>
          <button className="primary-action" onClick={engage}>Engage <span>→</span></button>
          <small>ENTER or SPACE to engage</small>
        </div>
      )}
      {paused && phase === 'playing' && <div className="combat-modal"><p className="eyebrow">TACTICAL PAUSE</p><h2>Time is holding.</h2><p>Select a target, check charge and routing, then resume.</p></div>}
      {(phase === 'victory' || phase === 'defeat') && (
        <div className="combat-modal result">
          <p className="eyebrow">{phase === 'victory' ? 'OBJECTIVE COMPLETE' : 'THE ITHACA IS LOST'}</p>
          <h2>{phase === 'victory' ? config.victoryTitle ?? 'The way is open.' : 'Return to the last firing solution.'}</h2>
          {phase === 'victory' && rating && (
            <div className={`combat-rating rating-${rating}`}>
              <b>{rating}</b>
              <div><strong>{RATING_COPY[rating]}</strong><span>HULL {hull}% · {evasions} EVADED · {crits} LOCKED SHOT{crits === 1 ? '' : 'S'} · {formatClock(elapsed)}</span></div>
            </div>
          )}
          <p>{phase === 'victory' ? config.victoryText ?? `Hull integrity ${hull}%. Combat consequences will follow the ship.` : defeatAdvice(sim)}</p>
          <button className="primary-action" onClick={phase === 'victory' ? () => onComplete({ hull, score: hull + Math.round(shield), rating: rating ?? undefined }) : retry}>{phase === 'victory' ? 'Resume the story' : 'Retry battle'} <span>→</span></button>
        </div>
      )}
    </section>
  )
}

function formatClock(ms: number) {
  const total = Math.floor(ms / 1000)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function defeatAdvice(sim: Sim) {
  if (sim.evasions === 0) return 'Defeat never erases a story choice. Not one shot was dodged: press Q when the warning line turns red and the shot crosses empty space.'
  if (sim.power === 'weapons' && sim.shield === 0) return 'Defeat never erases a story choice. The shields never knitted: route power to SHIELDS (X) when nothing is inbound.'
  return 'Defeat never erases a story choice. Ion shear on whatever is still aiming buys three quiet seconds. Retry the encounter.'
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
  if (impact.evaded) return <div className={`impact-fx evaded ${impact.incoming ? 'incoming' : 'outgoing'}`}><i /></div>
  return (
    <div className={`impact-fx fx-${impact.kind} ${impact.incoming ? 'incoming' : 'outgoing'} ${impact.shielded ? 'shielded' : ''}`}>
      <i /><i /><i /><i /><i />
    </div>
  )
}

function Meter({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return <div className={`meter ${danger ? 'danger' : ''}`}><span>{label}</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>
}

export type { DestroyEffect }
