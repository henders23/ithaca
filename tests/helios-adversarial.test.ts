import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { combatObjectiveComplete, type LiveCombatTarget } from '../src/slice/CinematicCombat.js'
import { CORONAL_PHASES, DRIVE_CYCLES, HELIOS_CHAIN, CoronalRoutingGame, FailingDriveGame, LivingSunEcologyGame, MutinyControlGame, companionCandidates, coronalRoutingOutcome, driveOutcome, evaluateHeliosChain, mutinyOutcome, rechargeOutcome } from '../src/slice/ActThreeFinalGames.js'
import { ACT_THREE_FINAL_INTERLUDES, ACT_THREE_FINAL_SCENES, companionMemorialScene, lastWordsScene, mutinyConfrontationScene } from '../src/slice/actThreeFinalContent.js'
import { SLICE_SCREEN_IDS, judgmentCombatConfig } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import type { GameState } from '../src/state/types.js'

function stateWith(patch:Partial<GameState>):GameState {
  const base=createInitialState('helios-adversary')
  return {...base,...patch,relationships:{...base.relationships,...patch.relationships},characters:{...base.characters,...patch.characters}}
}

describe('Helios adversarial release gate',()=>{
  it('server-renders every new interactive surface with its goal and live feedback visible',()=>{
    const game=stateWith({evidence:['scylla-rescued:SATO,VEGA,TAMSIN']})
    const noOp=()=>undefined
    const ecology=renderToStaticMarkup(createElement(LivingSunEcologyGame,{onComplete:noOp}))
    const mutiny=renderToStaticMarkup(createElement(MutinyControlGame,{game,onComplete:noOp}))
    const routing=renderToStaticMarkup(createElement(CoronalRoutingGame,{game,onComplete:noOp}))
    const drive=renderToStaticMarkup(createElement(FailingDriveGame,{game,onComplete:noOp}))
    expect(ecology).toContain('Build the solar food chain')
    expect(ecology).toContain('FAILED TESTS')
    expect(mutiny).toContain('Take back a ship that has already eaten')
    expect(mutiny).toContain('SOLAR REMNANT')
    expect(routing).toContain('Keep one path alive through judgment')
    expect(routing).toContain('PROJECTED HULL LOSS')
    expect(drive).toContain('Choose who remains behind')
    expect(drive).toContain('NO REMOTE SOLUTION REMAINS')
  })

  it('requires causal ecology evidence and provides a genuinely non-lethal recharge route',()=>{
    expect(evaluateHeliosChain(HELIOS_CHAIN).success).toBe(true)
    expect(evaluateHeliosChain(['surface-loop','seed-shoal','grazer','shepherd']).success).toBe(false)
    expect(evaluateHeliosChain(['nursery','grazer','seed-shoal','shepherd']).wrong).toHaveLength(2)

    const ethical=rechargeOutcome(['shed-shells','shadow-wake'])
    const fast=rechargeOutcome(['nursery-core'])
    expect(ethical.energy).toBeGreaterThanOrEqual(50)
    expect(ethical.lifeHarm).toBe(0)
    expect(fast.energy).toBeGreaterThan(ethical.energy)
    expect(fast.lifeHarm).toBeGreaterThan(0)
  })

  it('does not let the hunger mutiny erase the first death or offer a cost-free recovery',()=>{
    const alone=mutinyOutcome(['clinic','habitat','drive'],[])
    expect(alone.remnantPreserved).toBe(false)
    expect(alone.spent).toBe(alone.chargeLimit)

    const specialists=['scylla-rescued:VEGA,TAMSIN']
    const informed=mutinyOutcome(['clinic','habitat','drive','cradle'],specialists)
    expect(informed.spent).toBe(informed.chargeLimit)
    expect(informed.remnantPreserved).toBe(true)
    expect(informed.casualties).toBe(0)

    const crisis=ACT_THREE_FINAL_SCENES['b23-crisis'].lines.map((line)=>line.text).join(' ')
    expect(crisis).toContain('First extraction already happened')
    const confrontation=mutinyConfrontationScene(stateWith({evidence:['hunger-casualties:7']})).lines.map((line)=>line.text).join(' ')
    expect(confrontation).toContain('Forty-one people')
    expect(confrontation).toContain('Neither fact erases the other')
  })

  it('pays the Scylla rescue forward into both routing and the three-sided battle',()=>{
    const correct=CORONAL_PHASES.map((phase)=>phase.correct)
    const oneWrong=[CORONAL_PHASES[0].paths[0].id,...correct.slice(1)]
    expect(coronalRoutingOutcome(oneWrong,[])).toMatchObject({mistakes:1,strikes:1,hullDamage:8})
    expect(coronalRoutingOutcome(oneWrong,['scylla-rescued:VEGA'])).toMatchObject({mistakes:1,strikes:0,hullDamage:0})

    const plain=judgmentCombatConfig(stateWith({ship:{...createInitialState('x').ship,hull:70}}))
    const rescued=judgmentCombatConfig(stateWith({evidence:['scylla-rescued:SATO,RAO,AMARI'],ship:{...createInitialState('x').ship,hull:70}}))
    expect(rescued.enemyInterval).toBeGreaterThan(plain.enemyInterval ?? 0)
    expect(rescued.targets.find((target)=>target.id==='memory-lance')?.hp).toBeLessThan(plain.targets.find((target)=>target.id==='memory-lance')?.hp ?? 0)
    expect(rescued.targets.find((target)=>target.id==='coronal-knot')?.hp).toBeLessThan(plain.targets.find((target)=>target.id==='coronal-knot')?.hp ?? 0)
  })

  it('makes the solar nursery visibly protected while allowing the escape objective to complete',()=>{
    const config=judgmentCombatConfig(stateWith({flags:['helios-remnant-preserved']}))
    const nursery=config.targets.find((target)=>target.id==='nursery-shoal')
    expect(nursery?.protected).toBe(true)
    expect(nursery?.role).toContain('PRESERVE')
    expect(config.objective).toContain('without striking the nursery')
    const live=config.targets.map((target)=>({...target,currentHp:target.protected?target.hp:0})) as LiveCombatTarget[]
    expect(combatObjectiveComplete(live,config.mode)).toBe(true)
  })

  it('shows every qualified companion and never derives the lethal assignment from trust',()=>{
    const lowTrust=stateWith({relationships:{'lena-mori':-5} as GameState['relationships']})
    const candidates=companionCandidates(lowTrust)
    expect(candidates).toHaveLength(5)
    expect(candidates.map((candidate)=>candidate.id)).not.toContain('elias')
    expect(candidates.find((candidate)=>candidate.id==='lena-mori')?.trust).toBe(-5)
    for(const candidate of candidates){
      expect(candidate.skill.length).toBeGreaterThan(40)
      expect(candidate.humanCost.length).toBeGreaterThan(70)
    }
    const volunteerText=ACT_THREE_FINAL_SCENES['b25-volunteers'].lines.map((line)=>line.text).join(' ')
    expect(volunteerText).toContain('not being risked')
    expect(volunteerText).toContain('what each choice costs')
    expect(volunteerText).toContain('cannot replace the person at the interlock')
  })

  it('keeps stability, ship damage and the final record in real tension after the death is confirmed',()=>{
    const stable=driveOutcome(['vent-habitat','cut-channel','jump-now'])
    const recorded=driveOutcome(['burn-buffer','keep-channel','carry-core'])
    expect(stable.success).toBe(true)
    expect(stable.recordQuality).toBe(0)
    expect(recorded.recordQuality).toBeGreaterThanOrEqual(3)
    expect(recorded.hullDamage).toBeGreaterThan(stable.hullDamage)
    expect(DRIVE_CYCLES).toHaveLength(3)
    for(const cycle of DRIVE_CYCLES) for(const action of cycle.actions) expect(action.detail.length).toBeGreaterThan(45)
  })

  it('changes last words with the chosen relationship and gives grief its own scene',()=>{
    const decision={id:'25:last:1',beatId:'25-last-companion',activityId:'failing-drive',choiceId:'last-companion:lena-mori'}
    const trusted=stateWith({decisions:[decision],flags:['last-companion-record-preserved'],relationships:{'lena-mori':5} as GameState['relationships']})
    const wounded=stateWith({decisions:[decision],flags:['last-companion-record-preserved'],relationships:{'lena-mori':-5} as GameState['relationships']})
    const trustedWords=lastWordsScene(trusted).lines.map((line)=>line.text).join(' ')
    const woundedWords=lastWordsScene(wounded).lines.map((line)=>line.text).join(' ')
    expect(trustedWords).toContain('The ship was always us')
    expect(woundedWords).toContain('kept spending the ship')
    expect(trustedWords).not.toBe(woundedWords)
    expect(companionMemorialScene(trusted).lines.map((line)=>line.text).join(' ')).toContain('Lena Mori')

    const lastWords=SLICE_SCREEN_IDS.indexOf('b25-last-words')
    const memorial=SLICE_SCREEN_IDS.indexOf('b25-memorial')
    const complete=SLICE_SCREEN_IDS.indexOf('act-three-complete')
    expect(lastWords).toBeLessThan(memorial)
    expect(memorial).toBeLessThan(complete)
  })

  it('ships distinct cinematic states and an explicit short-laptop composition',()=>{
    for(const assetName of ['helios-arrival.webp','helios-ecology.webp','hunger-mutiny.webp','helios-judgment.webp','failing-drive.webp','last-companion-memorial.webp']){
      const asset=join(process.cwd(),'public/assets/cinematics',assetName)
      expect(existsSync(asset)).toBe(true)
      expect(statSync(asset).size).toBeGreaterThan(40_000)
    }
    const portrait=join(process.cwd(),'public/assets/portraits/helios.webp')
    expect(statSync(portrait).size).toBeGreaterThan(100_000)
    const css=readFileSync(join(process.cwd(),'src/ui/styles.css'),'utf8')
    expect(css).toContain('@media(max-height:850px) and (min-width:801px)')
    expect(css).toContain('.companion-candidates button{min-height:100px')
    expect(css).toContain('.helios-game{padding:46px')
  })

  it('briefs each new beat with causal context rather than unexplained spectacle',()=>{
    for(const interlude of Object.values(ACT_THREE_FINAL_INTERLUDES)){
      expect(interlude.recap.length).toBeGreaterThan(180)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.objective.length).toBeGreaterThan(70)
    }
    expect(ACT_THREE_FINAL_INTERLUDES['interlude-23'].recap).toContain('proved that the solar forms are born')
    expect(ACT_THREE_FINAL_INTERLUDES['interlude-25'].recap).toContain('manual interlock')
  })
})
