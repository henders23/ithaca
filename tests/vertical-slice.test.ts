import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { DialogueLine } from '../src/slice/content.js'
import { ASSETS, DIALOGUE_SCENES, INTERLUDES, SLICE_ASSET_PATHS } from '../src/slice/content.js'
import { SLICE_TWO_INTERLUDES, SLICE_TWO_SCENES } from '../src/slice/sliceTwoContent.js'
import { ACT_TWO_INTERLUDES, ACT_TWO_SCENES } from '../src/slice/actTwoContent.js'
import { ACT_TWO_FINAL_INTERLUDES, ACT_TWO_FINAL_SCENES } from '../src/slice/actTwoFinalContent.js'
import { ACT_THREE_INTERLUDES, ACT_THREE_SCENES, rescueAftermathScene } from '../src/slice/actThreeContent.js'
import { COURSE_PHASES, RESCUE_CREW, applyRescue, choirCarrierForEvidence, evaluateChoirFilter, evaluateRouteSelection, navigationChoiceIsReal, rescueHullDamage, rescueOffer, transferPower, vectorsMatch, type ChoirBandId, type RescueState } from '../src/slice/ActThreeGames.js'
import { combatObjectiveComplete, combatObjectiveProgress, type LiveCombatTarget } from '../src/slice/CinematicCombat.js'
import { SLICE_SCREEN_IDS, VERTICAL_SLICE_BEATS } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame } from '../src/state/reducer.js'

describe('playable vertical slice', () => {
  it('registers one continuous and unique screen sequence', () => {
    expect(SLICE_SCREEN_IDS).toHaveLength(100)
    expect(new Set(SLICE_SCREEN_IDS).size).toBe(SLICE_SCREEN_IDS.length)
    expect(SLICE_SCREEN_IDS[0]).toBe('title')
    expect(SLICE_SCREEN_IDS.at(-1)).toBe('act-three-slice-complete')
    expect(VERTICAL_SLICE_BEATS).toEqual([
      '01-burning-tide-gate',
      '02-wrong-stars',
      '03-garden-forgetting',
      '04-one-eyed-fortress',
      '05-captain-gives-name',
      '06-first-wrath',
      '07-keeper-of-winds',
      '08-forbidden-sphere',
      '09-devouring-harbour',
      '10-palace-new-flesh',
      '11-captains-bargain',
      '12-year-outside-time',
      '13-road-through-dead',
      '14-voices-archive',
      '15-unburied-signal',
      '16-mothers-message',
      '17-prophet-probability',
      '18-choir-dark', '19-silent-passage', '20-twin-terrors', '21-six-taken',
    ])
  })

  it('briefs the player between every completed beat in the slice', () => {
    const interludes = { ...INTERLUDES, ...SLICE_TWO_INTERLUDES, ...ACT_TWO_INTERLUDES, ...ACT_TWO_FINAL_INTERLUDES, ...ACT_THREE_INTERLUDES }
    expect(Object.keys(interludes)).toHaveLength(20)
    for (const interlude of Object.values(interludes)) {
      expect(interlude.recap.length).toBeGreaterThan(100)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.objective.length).toBeGreaterThan(30)
    }
  })

  it('ships every cinematic, portrait and combat asset used by the slice', () => {
    expect(SLICE_ASSET_PATHS.length).toBe(45)
    for (const asset of SLICE_ASSET_PATHS) {
      const file = join(process.cwd(), 'public', asset.slice(1))
      expect(existsSync(file), `${asset} should exist`).toBe(true)
      expect(statSync(file).size, `${asset} should not be empty`).toBeGreaterThan(5_000)
    }
    expect(Object.keys(ASSETS.portraits)).toContain('argus-one')
    expect(Object.keys(ASSETS.portraits)).toContain('tidefather')
    expect(Object.keys(ASSETS.portraits)).toContain('keeper-aeolia')
    expect(Object.keys(ASSETS.portraits)).toContain('doctor-cirene')
  })

  it('only uses narrators or characters with a vertical-slice portrait', () => {
    for (const scene of [...Object.values(DIALOGUE_SCENES), ...Object.values(SLICE_TWO_SCENES), ...Object.values(ACT_TWO_SCENES), ...Object.values(ACT_TWO_FINAL_SCENES), ...Object.values(ACT_THREE_SCENES)]) {
      expect(scene.lines.length).toBeGreaterThan(0)
      for (const line of scene.lines) {
        expect(line.speaker === 'narrator' || line.speaker in ASSETS.portraits).toBe(true)
      }
    }
  })

  it('paces each story scene with developed exchanges and visual reveals', () => {
    let lineCount = 0
    let cueCount = 0
    let cutawayCount = 0

    for (const scene of [...Object.values(DIALOGUE_SCENES), ...Object.values(SLICE_TWO_SCENES), ...Object.values(ACT_TWO_SCENES), ...Object.values(ACT_TWO_FINAL_SCENES), ...Object.values(ACT_THREE_SCENES)]) {
      expect(scene.lines.length, `${scene.title} should unfold over several exchanges`).toBeGreaterThanOrEqual(5)
      for (const line of scene.lines as readonly DialogueLine[]) {
        lineCount += 1
        if (line.cue) cueCount += 1
        if (line.cutaway) {
          cutawayCount += 1
          expect(SLICE_ASSET_PATHS).toContain(line.cutaway.image)
          expect(line.cutaway.caption.length).toBeGreaterThan(20)
        }
      }
    }

    expect(lineCount).toBeGreaterThanOrEqual(150)
    expect(cueCount).toBeGreaterThanOrEqual(20)
    expect(cutawayCount).toBeGreaterThanOrEqual(18)
  })

  it('can complete every mandatory activity through Act II', () => {
    let state = reduceGame(createInitialState('slice-test'), { type: 'campaign/started' }).state
    const activities = [
      ['01-burning-tide-gate', 'incomplete-intelligence'],
      ['01-burning-tide-gate', 'gate-assault'],
      ['01-burning-tide-gate', 'gate-collapse'],
      ['02-wrong-stars', 'emergency-routing'],
      ['02-wrong-stars', 'triage'],
      ['02-wrong-stars', 'first-accounting'],
      ['03-garden-forgetting', 'garden-welcome'],
      ['03-garden-forgetting', 'memory-fragments'],
      ['03-garden-forgetting', 'shuttle-pursuit'],
      ['04-one-eyed-fortress', 'salvage-dispute'],
      ['04-one-eyed-fortress', 'blind-the-eye'],
      ['04-one-eyed-fortress', 'fortress-breakout'],
      ['05-captain-gives-name', 'transponder-cipher'],
      ['05-captain-gives-name', 'name-the-captain'],
      ['06-first-wrath', 'memories-of-the-dead'],
      ['06-first-wrath', 'survive-tidefather'],
      ['06-first-wrath', 'sacrifice-system'],
      ['07-keeper-of-winds', 'keeper-negotiation'],
      ['07-keeper-of-winds', 'phase-current'],
      ['07-keeper-of-winds', 'storm-flight'],
      ['08-forbidden-sphere', 'crew-suspicion'],
      ['08-forbidden-sphere', 'access-log'],
      ['08-forbidden-sphere', 'mutiny-judgment'],
      ['09-devouring-harbour', 'false-hospitality'],
      ['09-devouring-harbour', 'debris-course'],
      ['09-devouring-harbour', 'harbour-escape'],
      ['10-palace-new-flesh', 'offer-new-flesh'],
      ['10-palace-new-flesh', 'identity-forensics'],
      ['10-palace-new-flesh', 'restoration-choice'],
      ['11-captains-bargain', 'neural-lock'],
      ['11-captains-bargain', 'cirene-bargain'],
      ['12-year-outside-time', 'life-in-shelter'],
      ['12-year-outside-time', 'refit-allocation'],
      ['12-year-outside-time', 'resume-voyage'],
      ['13-road-through-dead', 'death-protocol'],
      ['13-road-through-dead', 'run-dark'],
      ['14-voices-archive', 'attack-timeline'],
      ['14-voices-archive', 'admirals-testimony'],
      ['15-unburied-signal', 'recover-consciousness'],
      ['15-unburied-signal', 'final-request'],
      ['16-mothers-message', 'message-fragments'],
      ['16-mothers-message', 'home-has-changed'],
      ['17-prophet-probability', 'future-constraints'],
      ['17-prophet-probability', 'prophecy'],
      ['18-choir-dark','private-promises'],['18-choir-dark','filter-choir'],
      ['19-silent-passage','hallucinated-navigation'],['19-silent-passage','extract-route'],
      ['20-twin-terrors','choose-passage'],['20-twin-terrors','gravity-course'],['20-twin-terrors','scylla-passage'],
      ['21-six-taken','rescue-decision'],['21-six-taken','tether-rescue'],
    ] as const

    for (const beatId of VERTICAL_SLICE_BEATS) {
      for (const [activityBeat, activityId] of activities.filter(([candidate]) => candidate === beatId)) {
        const transition = reduceGame(state, { type: 'activity/completed', beatId: activityBeat, activityId })
        expect(transition.accepted, `${activityId} should complete`).toBe(true)
        state = transition.state
      }
      const transition = reduceGame(state, { type: 'beat/completed', beatId })
      expect(transition.accepted, `${beatId} should advance`).toBe(true)
      state = transition.state
    }

    expect(state.campaign.completedBeatIds).toEqual(VERTICAL_SLICE_BEATS)
    expect(state.campaign.currentBeatId).toBe('22-living-sun')
  })

  it('protects non-target objectives while allowing the Scylla battle to finish', () => {
    const targets: LiveCombatTarget[] = [
      { id:'limb-a', name:'Grasp A', role:'THREAT', hp:2, currentHp:0 },
      { id:'limb-b', name:'Grasp B', role:'THREAT', hp:2, currentHp:0 },
      { id:'tether', name:'Gravity Tether', role:'PRESERVE', hp:3, currentHp:3, protected:true },
    ]
    expect(combatObjectiveComplete(targets, 'destroy')).toBe(true)
    expect(combatObjectiveProgress(targets, 'destroy')).toBe(100)
    targets[1].currentHp = 1
    expect(combatObjectiveComplete(targets, 'destroy')).toBe(false)
    expect(combatObjectiveProgress(targets, 'destroy')).toBe(75)
  })

  it('makes Choir filtration depend on prior evidence, telemetry and a non-lethal protocol', () => {
    expect(choirCarrierForEvidence(['elara-message-private'])).toBe('HOME')
    expect(choirCarrierForEvidence(['elara-message-shared'])).toBe('TRUTH')
    const muted: ChoirBandId[] = ['HOME','REST','PURPOSE']
    expect(evaluateChoirFilter(muted, 'phase-inversion', 'TRUTH').success).toBe(true)
    expect(evaluateChoirFilter(muted, 'broadband-jam', 'TRUTH').success).toBe(false)
    expect(evaluateChoirFilter(['TRUTH','REST','PURPOSE'], 'phase-inversion', 'TRUTH').success).toBe(false)
  })

  it('requires evidence-based navigation and rejects tempting route fragments', () => {
    expect(navigationChoiceIsReal(0, 'hold-heading')).toBe(true)
    expect(navigationChoiceIsReal(1, 'trust-drift')).toBe(true)
    expect(navigationChoiceIsReal(2, 'cut-visuals')).toBe(true)
    expect(navigationChoiceIsReal(0, 'beacon-turn')).toBe(false)
    expect(evaluateRouteSelection(['choir-first','fuel-after','sun-forbidden','earth-hidden']).success).toBe(true)
    const contaminated = evaluateRouteSelection(['choir-first','fuel-after','sun-forbidden','elara-waits'])
    expect(contaminated.success).toBe(false)
    expect(contaminated.wrong).toEqual(['elara-waits'])
    expect(contaminated.missing).toEqual(['earth-hidden'])
  })

  it('uses explicit donor-to-destination power transfers across route-specific hazards', () => {
    const initial = [25,25,25,25]
    const transferred = transferPower(initial, 1, 0)
    expect(transferred).toEqual([30,20,25,25])
    expect(transferred.reduce((sum, value) => sum + value, 0)).toBe(100)
    expect(vectorsMatch(COURSE_PHASES['scylla-close'][0].target, COURSE_PHASES['scylla-close'][0].target)).toBe(true)
    expect(COURSE_PHASES['scylla-close'][0].target).not.toEqual(COURSE_PHASES['charybdis-wide'][0].target)
  })

  it('makes all-six rescue possible through sequencing while preserving a real ship cost', () => {
    let optimal: RescueState = { rescued:[], pulses:6, seconds:60 }
    for (const id of ['SATO','VEGA','AMARI','NOAH','RAO','TAMSIN'] as const) optimal = applyRescue(id, optimal)
    expect(optimal.rescued).toHaveLength(6)
    expect(optimal.pulses).toBe(0)
    expect(optimal.seconds).toBe(8)
    expect(rescueHullDamage(optimal.seconds, 'charybdis-wide')).toBe(18)

    let poorOrder: RescueState = { rescued:[], pulses:6, seconds:60 }
    for (const id of ['NOAH','RAO','TAMSIN','VEGA'] as const) poorOrder = applyRescue(id, poorOrder)
    expect(rescueOffer('SATO', poorOrder).canRescue).toBe(false)
    expect(poorOrder.rescued).toHaveLength(4)
  })

  it('gives all six captives a voice and carries both rescue lists into the aftermath', () => {
    const names = ACT_THREE_SCENES['b21-voices'].lines.map((line) => line.name.split(' · ')[0])
    for (const person of RESCUE_CREW) expect(names).toContain(person.id)
    const state = {
      ...createInitialState('aftermath'),
      evidence:['scylla-rescued:SATO,AMARI,NOAH','scylla-abandoned:RAO,VEGA,TAMSIN'],
    }
    const aftermath = rescueAftermathScene(state)
    const text = aftermath.lines.map((line) => `${line.name} ${line.text}`).join(' ')
    for (const name of ['SATO','AMARI','NOAH','RAO','VEGA','TAMSIN']) expect(text).toContain(name)
  })
})
