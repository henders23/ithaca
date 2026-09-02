import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CinematicCombat } from '../src/slice/CinematicCombat.js'
import {
  BASE_TELEGRAPH_MS, BLINDED_TELEGRAPH_BONUS_MS, EVADE_WINDOW_MS, MAX_LOCK, POWER_PROFILES, WEAPONS,
  combatRating, destroyEffectFor, enemyInterval, enemyIsAdapting, incomingDamage, telegraphDuration, weaknessFor, weaponDamage,
  type LiveTarget,
} from '../src/slice/combatRules.js'
import { describeEffects, shortCharacterName } from '../src/slice/consequences.js'
import { characterDelay } from '../src/slice/DialogueScene.js'
import { CHASE_OBSTACLES, chaseSpeed, crossedObstacles } from '../src/slice/MiniGames.js'
import { citadelCombatConfig, finalCombatConfig, judgmentCombatConfig, phaeacianCombatConfig, scyllaCombatConfigForRoute } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import type { CampaignEffect } from '../src/state/types.js'

describe('tactical combat rules', () => {
  it('prints a weakness and a destruction effect for every subsystem so nothing is hidden', () => {
    const state = createInitialState('combat-rules')
    const configs = [
      scyllaCombatConfigForRoute('scylla-close', 80), scyllaCombatConfigForRoute('charybdis-wide', 80),
      judgmentCombatConfig(state), phaeacianCombatConfig(state), citadelCombatConfig(state), finalCombatConfig(state),
    ]
    for (const config of configs) {
      config.targets.forEach((target, index) => {
        expect(['lance', 'missile', 'ion']).toContain(weaknessFor(target, index))
        expect(['slows-fire', 'blinds', 'none']).toContain(destroyEffectFor(target))
        if (target.protected) expect(destroyEffectFor(target)).toBe('none')
      })
      const html = renderToStaticMarkup(createElement(CinematicCombat, { config, onComplete: () => undefined }))
      expect(html).toContain('WEAK ·')
      expect(html).toContain('EVASIVE BURN')
      expect(html).toContain('POWER ROUTING')
      expect(html).toContain('TACTICAL BRIEFING')
    }
  })

  it('rewards the printed weakness and a full target lock, and never below base damage', () => {
    expect(weaponDamage('lance', 'lance', 0)).toEqual({ damage: 2, weak: true, crit: false })
    expect(weaponDamage('lance', 'ion', 0)).toEqual({ damage: 1, weak: false, crit: false })
    expect(weaponDamage('missile', 'missile', MAX_LOCK)).toEqual({ damage: 4, weak: true, crit: true })
    expect(weaponDamage('ion', 'missile', MAX_LOCK - 1).damage).toBe(WEAPONS.ion.damage)
  })

  it('makes bracing and evasion real defensive choices', () => {
    expect(incomingDamage('missile', 100, false)).toEqual({ shieldLoss: 22, hullLoss: 0 })
    expect(incomingDamage('missile', 100, true)).toEqual({ shieldLoss: 11, hullLoss: 0 })
    expect(incomingDamage('missile', 0, false)).toEqual({ shieldLoss: 0, hullLoss: 13 })
    expect(incomingDamage('missile', 0, true)).toEqual({ shieldLoss: 0, hullLoss: 7 })
    const overflow = incomingDamage('ion', 9, false)
    expect(overflow.shieldLoss).toBe(9)
    expect(overflow.hullLoss).toBeGreaterThan(0)
    expect(incomingDamage('ion', 9, true).hullLoss).toBe(0)
    expect(EVADE_WINDOW_MS).toBeLessThan(BASE_TELEGRAPH_MS + WEAPONS.lance.duration)
    expect(EVADE_WINDOW_MS).toBeGreaterThan(WEAPONS.missile.duration - 200)
  })

  it('trades charge, shield regeneration and evasion across the three power profiles', () => {
    expect(POWER_PROFILES.weapons.chargeRate).toBeGreaterThan(POWER_PROFILES.shields.chargeRate)
    expect(POWER_PROFILES.shields.shieldRegen).toBeGreaterThan(0)
    expect(POWER_PROFILES.weapons.shieldRegen).toBe(0)
    expect(POWER_PROFILES.engines.evadeCooldownMs).toBeLessThan(POWER_PROFILES.weapons.evadeCooldownMs)
    expect(POWER_PROFILES.engines.passiveDodge).toBeGreaterThan(0)
  })

  it('escalates at half objective mass and lets destroyed subsystems slow or blind the enemy', () => {
    const targets: LiveTarget[] = [
      { id: 'a', name: 'A', role: 'THREAT', hp: 2, currentHp: 2 },
      { id: 'b', name: 'B', role: 'SENSOR', hp: 2, currentHp: 2 },
      { id: 'p', name: 'P', role: 'PROTECT', hp: 9, currentHp: 9, protected: true },
    ]
    expect(enemyIsAdapting(targets, 'destroy')).toBe(false)
    targets[0].currentHp = 0
    expect(enemyIsAdapting(targets, 'destroy')).toBe(true)
    expect(enemyIsAdapting(targets, 'survive', 20, 30)).toBe(false)
    expect(enemyIsAdapting(targets, 'survive', 10, 30)).toBe(true)
    expect(enemyInterval(2000, 0, false)).toBe(2000)
    expect(enemyInterval(2000, 1, false)).toBe(2700)
    expect(enemyInterval(2000, 0, true)).toBe(1440)
    expect(telegraphDuration(0)).toBe(BASE_TELEGRAPH_MS)
    expect(telegraphDuration(1)).toBe(BASE_TELEGRAPH_MS + BLINDED_TELEGRAPH_BONUS_MS)
    expect(telegraphDuration(5)).toBe(BASE_TELEGRAPH_MS + 2 * BLINDED_TELEGRAPH_BONUS_MS)
  })

  it('rates the engagement on retained hull, evasions, locked shots and time', () => {
    expect(combatRating({ hull: 100, startingHull: 100, evasions: 3, crits: 1, seconds: 30 })).toBe('S')
    expect(combatRating({ hull: 80, startingHull: 100, evasions: 1, crits: 0, seconds: 50 })).toBe('B')
    expect(combatRating({ hull: 30, startingHull: 100, evasions: 0, crits: 0, seconds: 90 })).toBe('C')
    expect(combatRating({ hull: 96, startingHull: 100, evasions: 1, crits: 0, seconds: 60 })).toBe('A')
  })
})

describe('choice consequences', () => {
  it('turns campaign effects into short, prioritised acknowledgements', () => {
    const effects: CampaignEffect[] = [
      { kind: 'set-flag', flag: 'tide-gate-scanned' },
      { kind: 'relationship', character: 'helen-morozova', delta: 2 },
      { kind: 'pursuit', delta: 12 },
      { kind: 'add-evidence', evidenceId: 'scylla-rescued:sato,vega' },
      { kind: 'character-status', character: 'gabriel-cross', status: 'dead' },
      { kind: 'damage-hull', amount: 4 },
    ]
    const notices = describeEffects(effects)
    expect(notices.length).toBe(4)
    expect(notices[0]).toMatchObject({ tone: 'loss', title: 'CROSS' })
    expect(notices.map((notice) => notice.title)).toContain('MOROZOVA')
    expect(notices.map((notice) => notice.title)).toContain('PURSUIT +12')
    expect(notices.some((notice) => notice.detail.includes('scylla'))).toBe(false)
    expect(describeEffects([{ kind: 'relationship', character: 'isabella-corelli', delta: -3 }])[0]).toMatchObject({ tone: 'strain', detail: 'will not forgive this' })
    expect(describeEffects([{ kind: 'relationship-axis', character: 'gabriel-cross', axis: 'resentment', delta: 1 }])[0].tone).toBe('strain')
    expect(describeEffects([{ kind: 'relationship-axis', character: 'gabriel-cross', axis: 'intimacy', delta: 1 }])[0]).toMatchObject({ tone: 'bond', detail: 'Closeness rises' })
    expect(describeEffects([{ kind: 'pursuit', delta: 0 }])).toEqual([])
  })

  it('names the cast the way the crew does', () => {
    expect(shortCharacterName('helen-morozova')).toBe('MOROZOVA')
    expect(shortCharacterName('kiara-ndala')).toBe('N’DALA')
    expect(shortCharacterName('elara-vale')).toBe('ELARA')
    expect(shortCharacterName('elias')).toBe('ELIAS')
    expect(shortCharacterName('calypso')).toBe('CALYPSO')
  })
})

describe('dialogue pacing and the shuttle chase', () => {
  it('breathes after punctuation instead of scrolling at a constant rate', () => {
    expect(characterDelay('a', 14)).toBe(14)
    expect(characterDelay(',', 14)).toBeGreaterThan(14)
    expect(characterDelay('.', 14)).toBeGreaterThan(characterDelay(',', 14))
  })

  it('accelerates the chase, forces lane reads with two-lane walls and never lets a wall block every lane', () => {
    expect(chaseSpeed(0, false)).toBeLessThan(chaseSpeed(90, false))
    expect(chaseSpeed(50, true)).toBeGreaterThan(chaseSpeed(50, false) * 1.5)
    expect(CHASE_OBSTACLES.some((obstacle) => obstacle.lanes.length === 2)).toBe(true)
    for (const obstacle of CHASE_OBSTACLES) expect(obstacle.lanes.length).toBeLessThan(3)
    expect(crossedObstacles(10, 12.5).map((obstacle) => obstacle.at)).toEqual([12])
    expect(crossedObstacles(12, 12.5)).toEqual([])
    const ticks = []
    for (let progress = 0, tick = 0; progress < 100; tick++) { progress += chaseSpeed(progress, false); ticks.push(tick) }
    expect(ticks.length * 70).toBeGreaterThan(9000)
  })
})
