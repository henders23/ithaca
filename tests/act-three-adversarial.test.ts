import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { choirAftermathScene, rescueAftermathScene, scyllaRescueInterlude, silentPassageAftermathScene } from '../src/slice/actThreeContent.js'
import { RESCUE_CREW, applyRescue, rescueOffer, type RescueState } from '../src/slice/ActThreeGames.js'
import { combatObjectiveComplete, type LiveCombatTarget } from '../src/slice/CinematicCombat.js'
import { SLICE_SCREEN_IDS, scyllaCombatConfigForRoute } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import type { GameState } from '../src/state/types.js'

function stateWith(patch: Partial<GameState>): GameState {
  return { ...createInitialState('act-three-adversary'), ...patch }
}

describe('Act III adversarial release gate', () => {
  it('never asks the player to destroy the protected gravity tether', () => {
    for (const route of ['scylla-close','charybdis-wide'] as const) {
      const config = scyllaCombatConfigForRoute(route, 70)
      const tether = config.targets.find((target) => target.id === 'tether')
      expect(tether?.protected).toBe(true)
      expect(tether?.role).toContain('PRESERVE')
      const live = config.targets.map((target) => ({ ...target, currentHp: target.protected ? target.hp : 0 })) as LiveCombatTarget[]
      expect(combatObjectiveComplete(live, config.mode)).toBe(true)
    }
  })

  it('turns the passage decision into different hazards, combat pressure and rescue context', () => {
    const close = scyllaCombatConfigForRoute('scylla-close', 70)
    const wide = scyllaCombatConfigForRoute('charybdis-wide', 70)
    expect(close.targets).not.toEqual(wide.targets)
    expect(close.enemyInterval).not.toBe(wide.enemyInterval)
    expect(close.victoryText).not.toBe(wide.victoryText)
    expect(close.enemyShip).toContain('scylla-combat')

    const closeBrief = scyllaRescueInterlude(stateWith({ flags:['scylla-close-course'] }))
    const wideBrief = scyllaRescueInterlude(stateWith({ flags:['charybdis-wide-course'] }))
    expect(closeBrief.recap).toContain('close course')
    expect(wideBrief.recap).toContain('wide course')
    expect(wideBrief.situation.join(' ')).toContain('less time')
  })

  it('makes the rescue order materially change who remains reachable', () => {
    let informed: RescueState = { rescued:[], pulses:6, seconds:60 }
    for (const id of ['SATO','VEGA','AMARI','NOAH','RAO','TAMSIN'] as const) informed = applyRescue(id, informed)
    expect(informed.rescued).toHaveLength(6)

    let careless: RescueState = { rescued:[], pulses:6, seconds:60 }
    for (const id of ['NOAH','RAO','TAMSIN','VEGA'] as const) careless = applyRescue(id, careless)
    expect(rescueOffer('SATO', careless).canRescue).toBe(false)
    expect(careless.rescued).toHaveLength(4)
    expect(informed.seconds).toBeLessThan(10)
  })

  it('pays off every captive with a visible returned or abandoned name', () => {
    const partial = stateWith({ evidence:['scylla-rescued:SATO,AMARI,NOAH','scylla-abandoned:RAO,VEGA,TAMSIN'] })
    const text = rescueAftermathScene(partial).lines.map((line) => `${line.name} ${line.text}`).join(' ')
    for (const person of RESCUE_CREW) expect(text).toContain(person.id)
    expect(text).toContain('Returned:')
    expect(text).toContain('Still inside Scylla:')
  })

  it('shows fail-forward contamination in subsequent character dialogue', () => {
    const choir = choirAftermathScene(stateWith({ evidence:['elara-message-shared'], flags:['choir-filter-overexposed'] }))
    expect(choir.lines.map((line) => line.text).join(' ')).toContain('TRUTH carrier')
    expect(choir.lines.map((line) => line.text).join(' ')).not.toContain('UNKNOWN')

    const passage = silentPassageAftermathScene(stateWith({ flags:['choir-navigation-compromised'] }))
    expect(passage.lines.some((line) => line.text.includes('uncommanded correction'))).toBe(true)
  })

  it('keeps the human aftermath between the rescue and the completion card', () => {
    const rescue = SLICE_SCREEN_IDS.indexOf('b21-rescue')
    const aftermath = SLICE_SCREEN_IDS.indexOf('b21-aftermath')
    const complete = SLICE_SCREEN_IDS.indexOf('act-three-slice-complete')
    expect(rescue).toBeLessThan(aftermath)
    expect(aftermath).toBeLessThan(complete)
  })

  it('ships a dedicated alpha-capable Scylla asset instead of the Tidefather sprite', () => {
    const asset = join(process.cwd(), 'public/assets/ships/scylla-combat.webp')
    expect(existsSync(asset)).toBe(true)
    expect(statSync(asset).size).toBeGreaterThan(100_000)
    const header = readFileSync(asset).subarray(0, 16).toString('ascii')
    expect(header.startsWith('RIFF')).toBe(true)
    expect(header).toContain('WEBP')
  })

  it('has a specific 768px-class laptop composition rather than waiting for the 700px breakpoint', () => {
    const css = readFileSync(join(process.cwd(), 'src/ui/styles.css'), 'utf8')
    expect(css).toContain('@media (max-height:850px) and (min-width:801px)')
    expect(css).toContain('.act-three-game { padding:46px')
    expect(css).toContain('min-height:100dvh')
    expect(css).toContain('.rescue-grid { grid-template-columns:repeat(3')
  })
})
