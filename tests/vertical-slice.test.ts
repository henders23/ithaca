import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { DialogueLine } from '../src/slice/content.js'
import { ASSETS, DIALOGUE_SCENES, INTERLUDES, SLICE_ASSET_PATHS } from '../src/slice/content.js'
import { SLICE_TWO_INTERLUDES, SLICE_TWO_SCENES } from '../src/slice/sliceTwoContent.js'
import { ACT_TWO_INTERLUDES, ACT_TWO_SCENES } from '../src/slice/actTwoContent.js'
import { ACT_TWO_FINAL_INTERLUDES, ACT_TWO_FINAL_SCENES } from '../src/slice/actTwoFinalContent.js'
import { SLICE_SCREEN_IDS, VERTICAL_SLICE_BEATS } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame } from '../src/state/reducer.js'

describe('playable vertical slice', () => {
  it('registers one continuous and unique screen sequence', () => {
    expect(SLICE_SCREEN_IDS).toHaveLength(83)
    expect(new Set(SLICE_SCREEN_IDS).size).toBe(SLICE_SCREEN_IDS.length)
    expect(SLICE_SCREEN_IDS[0]).toBe('title')
    expect(SLICE_SCREEN_IDS.at(-1)).toBe('act-two-complete')
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
    ])
  })

  it('briefs the player between every completed beat in the slice', () => {
    const interludes = { ...INTERLUDES, ...SLICE_TWO_INTERLUDES, ...ACT_TWO_INTERLUDES, ...ACT_TWO_FINAL_INTERLUDES }
    expect(Object.keys(interludes)).toHaveLength(16)
    for (const interlude of Object.values(interludes)) {
      expect(interlude.recap.length).toBeGreaterThan(100)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.objective.length).toBeGreaterThan(30)
    }
  })

  it('ships every cinematic, portrait and combat asset used by the slice', () => {
    expect(SLICE_ASSET_PATHS.length).toBe(40)
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
    for (const scene of [...Object.values(DIALOGUE_SCENES), ...Object.values(SLICE_TWO_SCENES), ...Object.values(ACT_TWO_SCENES), ...Object.values(ACT_TWO_FINAL_SCENES)]) {
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

    for (const scene of [...Object.values(DIALOGUE_SCENES), ...Object.values(SLICE_TWO_SCENES), ...Object.values(ACT_TWO_SCENES), ...Object.values(ACT_TWO_FINAL_SCENES)]) {
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
    expect(state.campaign.currentBeatId).toBe('18-choir-dark')
  })
})
