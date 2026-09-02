/**
 * Pure combat rules for the cinematic ship battles.
 *
 * Everything the player can reason about during a fight lives here so the
 * screen component only has to sequence time and draw. Nothing in this file
 * is hidden from the player: weaknesses, destruction effects, power profiles
 * and escalation are all printed on the tactical panels.
 */

export interface CombatTarget {
  id: string
  name: string
  role: string
  hp: number
  protected?: boolean
  /** Weapon that deals bonus damage. Derived from the role when omitted. */
  weakness?: WeaponId
  /** What destroying the subsystem does to the enemy. Derived from the role when omitted. */
  effect?: DestroyEffect
}

export type WeaponId = 'lance' | 'missile' | 'ion'
export type PowerProfile = 'weapons' | 'shields' | 'engines'
export type DestroyEffect = 'slows-fire' | 'blinds' | 'none'
export type CombatRating = 'S' | 'A' | 'B' | 'C'

export interface WeaponSpec {
  name: string
  cost: number
  damage: number
  /** Travel time of the projectile in milliseconds. */
  duration: number
  key: string
  ammo?: number
  /** Ion shear knocks the enemy's fire control offline for this long. */
  disruptMs?: number
  detail: string
}

export const WEAPONS: Readonly<Record<WeaponId, WeaponSpec>> = {
  lance: { name: 'Rail lance', cost: 40, damage: 1, duration: 240, key: '1', detail: 'Fast · cheap · doubles on light emitters' },
  missile: { name: 'Kinetic salvo', cost: 65, damage: 2, duration: 860, key: '2', ammo: 3, detail: 'Heavy · three shots · cracks armoured cores' },
  ion: { name: 'Ion shear', cost: 50, damage: 1, duration: 640, key: '3', disruptMs: 3000, detail: 'Any hit silences enemy fire for 3s' },
}

export interface PowerProfileSpec {
  label: string
  key: string
  /** Weapon charge gained per 100ms tick. */
  chargeRate: number
  /** Shield restored per 100ms tick while not under fire. */
  shieldRegen: number
  evadeCooldownMs: number
  /** Chance that an incoming shot misses outright. */
  passiveDodge: number
  detail: string
}

export const POWER_PROFILES: Readonly<Record<PowerProfile, PowerProfileSpec>> = {
  weapons: { label: 'WEAPONS', key: 'Z', chargeRate: 2.0, shieldRegen: 0, evadeCooldownMs: 6000, passiveDodge: 0, detail: 'Charge builds twice as fast. Shields do not knit.' },
  shields: { label: 'SHIELDS', key: 'X', chargeRate: 1.0, shieldRegen: 0.9, evadeCooldownMs: 6000, passiveDodge: 0, detail: 'Shields knit 9%/s while no fire is landing.' },
  engines: { label: 'ENGINES', key: 'C', chargeRate: 1.2, shieldRegen: 0, evadeCooldownMs: 3200, passiveDodge: 0.22, detail: 'Evasive burn every 3s. One shot in five misses.' },
}

export const POWER_PROFILE_IDS = Object.keys(POWER_PROFILES) as readonly PowerProfile[]
export const WEAPON_IDS = Object.keys(WEAPONS) as readonly WeaponId[]

/** How long the enemy shows its hand before a shot leaves the tube. */
export const BASE_TELEGRAPH_MS = 1100
/** Extra warning time once a sensor-class subsystem has been destroyed. */
export const BLINDED_TELEGRAPH_BONUS_MS = 550
/** How long an evasive burn protects the ship after the key is pressed. */
export const EVADE_WINDOW_MS = 900
/** How long a shield brace lasts after the key is pressed. */
export const BRACE_WINDOW_MS = 1300
export const BRACE_COST = 12
export const MAX_LOCK = 3
/** A hit landing within this many ms of the previous one on the same target keeps the lock chain alive. */
export const LOCK_WINDOW_MS = 4200
/** Shields only knit after this much quiet. */
export const SHIELD_REGEN_DELAY_MS = 2500

const ION_ROLE = /EMITTER|SENSOR|RELAY|SIGNAL|LOCK|RESTRAINT|TARGETING|MEMORY|ERASURE|TENDRIL|PREDICT|SCREEN|LIMB|GRASP|SHEAR/
const MISSILE_ROLE = /CORE|CUTTER|THREAT|ANCHOR|CONTROL|BOARDING|ORBITAL|EXIT|ROUTE|KNOT|BLOOM|BLISTER/
const SLOWS_FIRE_ROLE = /THREAT|WEAPON|LANCE|CUTTER|BLOOM|SILENCER|VANGUARD|CLOSING|LATERAL|ENGINEERING/
const BLINDS_ROLE = /SENSOR|EYE|RELAY|TARGETING|MARKER|SCRUBBER|ALERTED|PREDICT|SIGNAL|EMITTER/

export function weaknessFor(target: Pick<CombatTarget, 'role' | 'weakness'>, index = 0): WeaponId {
  if (target.weakness) return target.weakness
  const role = target.role.toUpperCase()
  if (ION_ROLE.test(role)) return 'ion'
  if (MISSILE_ROLE.test(role)) return 'missile'
  return WEAPON_IDS[index % WEAPON_IDS.length]
}

export function destroyEffectFor(target: Pick<CombatTarget, 'role' | 'effect' | 'protected'>): DestroyEffect {
  if (target.protected) return 'none'
  if (target.effect) return target.effect
  const role = target.role.toUpperCase()
  if (SLOWS_FIRE_ROLE.test(role)) return 'slows-fire'
  if (BLINDS_ROLE.test(role)) return 'blinds'
  return 'none'
}

export const DESTROY_EFFECT_LABEL: Readonly<Record<DestroyEffect, string>> = {
  'slows-fire': 'KILL → SLOWS ENEMY FIRE',
  blinds: 'KILL → LONGER WARNINGS',
  none: '',
}

export interface DamageRoll {
  damage: number
  weak: boolean
  crit: boolean
}

/** Damage a weapon deals to a target, honouring weakness and a full target lock. */
export function weaponDamage(weapon: WeaponId, weakness: WeaponId, lock: number): DamageRoll {
  const weak = weakness === weapon
  const crit = lock >= MAX_LOCK
  return { damage: WEAPONS[weapon].damage + (weak ? 1 : 0) + (crit ? 1 : 0), weak, crit }
}

export interface LiveTarget extends CombatTarget {
  currentHp: number
}

export function objectiveTargets<T extends CombatTarget>(targets: readonly T[]) {
  return targets.filter((target) => !target.protected)
}

/** True once the enemy has lost half its objective mass or half the survival clock has run. */
export function enemyIsAdapting(targets: readonly LiveTarget[], mode: 'destroy' | 'survive' | undefined, survivalRemaining = 0, survivalSeconds = 30) {
  if (mode === 'survive') return survivalRemaining <= survivalSeconds * 0.45
  const objectives = objectiveTargets(targets)
  const total = objectives.reduce((sum, target) => sum + target.hp, 0)
  const remaining = objectives.reduce((sum, target) => sum + target.currentHp, 0)
  return total > 0 && remaining <= total / 2
}

export interface IncomingDamage {
  shieldLoss: number
  hullLoss: number
}

const SHIELD_DAMAGE: Readonly<Record<WeaponId, number>> = { lance: 18, missile: 22, ion: 27 }
const HULL_DAMAGE: Readonly<Record<WeaponId, number>> = { lance: 9, missile: 13, ion: 9 }

/**
 * What a shot that actually lands costs. Braced shields halve the loss and stop
 * the blow bleeding into the hull.
 */
export function incomingDamage(kind: WeaponId, shield: number, braced: boolean): IncomingDamage {
  if (shield > 0) {
    const raw = SHIELD_DAMAGE[kind]
    const shieldLoss = Math.min(shield, braced ? Math.ceil(raw / 2) : raw)
    const overflow = braced ? 0 : Math.max(0, raw - shield)
    return { shieldLoss, hullLoss: overflow > 0 ? Math.ceil(HULL_DAMAGE[kind] * (overflow / raw)) : 0 }
  }
  return { shieldLoss: 0, hullLoss: braced ? Math.ceil(HULL_DAMAGE[kind] / 2) : HULL_DAMAGE[kind] }
}

/** Interval between enemy attacks once destroyed subsystems and escalation are applied. */
export function enemyInterval(base: number, slowedCount: number, adapting: boolean) {
  const slowed = base * (1 + 0.35 * slowedCount)
  return Math.round(adapting ? slowed * 0.72 : slowed)
}

export function telegraphDuration(blindedCount: number) {
  return BASE_TELEGRAPH_MS + Math.min(2, blindedCount) * BLINDED_TELEGRAPH_BONUS_MS
}

export interface RatingInput {
  hull: number
  startingHull: number
  evasions: number
  crits: number
  seconds: number
}

export function combatRating({ hull, startingHull, evasions, crits, seconds }: RatingInput): CombatRating {
  const retained = startingHull > 0 ? hull / startingHull : 0
  let points = 0
  if (retained >= 0.95) points += 3
  else if (retained >= 0.75) points += 2
  else if (retained >= 0.5) points += 1
  if (evasions >= 3) points += 2
  else if (evasions >= 1) points += 1
  if (crits >= 1) points += 1
  if (seconds <= 40) points += 1
  if (points >= 6) return 'S'
  if (points >= 4) return 'A'
  if (points >= 2) return 'B'
  return 'C'
}

export const RATING_COPY: Readonly<Record<CombatRating, string>> = {
  S: 'Textbook. Cross will pretend it was routine.',
  A: 'Clean engagement. The hull will remember only a few of those.',
  B: 'The ship is through. Damage control will be busy.',
  C: 'A victory the repair decks will argue about for weeks.',
}

/** Which enemy weapon the roll selects; volleys reuse the same table. */
export function rollEnemyWeapon(roll: number): WeaponId {
  return roll < 0.22 ? 'missile' : roll < 0.42 ? 'ion' : 'lance'
}

export const ENEMY_WEAPON_LABEL: Readonly<Record<WeaponId, string>> = {
  lance: 'ENERGY LANCE',
  missile: 'KINETIC TRACK',
  ion: 'ION BLOOM',
}
