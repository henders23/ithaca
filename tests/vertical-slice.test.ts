import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ASSETS, DIALOGUE_SCENES, INTERLUDES, SLICE_ASSET_PATHS } from '../src/slice/content.js'
import { SLICE_SCREEN_IDS, VERTICAL_SLICE_BEATS } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame } from '../src/state/reducer.js'

describe('playable vertical slice', () => {
  it('registers one continuous and unique screen sequence', () => {
    expect(SLICE_SCREEN_IDS).toHaveLength(20)
    expect(new Set(SLICE_SCREEN_IDS).size).toBe(SLICE_SCREEN_IDS.length)
    expect(SLICE_SCREEN_IDS[0]).toBe('title')
    expect(SLICE_SCREEN_IDS.at(-1)).toBe('complete')
    expect(VERTICAL_SLICE_BEATS).toEqual([
      '01-burning-tide-gate',
      '02-wrong-stars',
      '03-garden-forgetting',
      '04-one-eyed-fortress',
    ])
  })

  it('briefs the player between every completed beat in the slice', () => {
    expect(Object.keys(INTERLUDES)).toEqual(['interlude-02', 'interlude-03', 'interlude-04'])
    for (const interlude of Object.values(INTERLUDES)) {
      expect(interlude.recap.length).toBeGreaterThan(100)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.objective.length).toBeGreaterThan(30)
    }
  })

  it('ships every cinematic, portrait and combat asset used by the slice', () => {
    expect(SLICE_ASSET_PATHS.length).toBe(16)
    for (const asset of SLICE_ASSET_PATHS) {
      const file = join(process.cwd(), 'public', asset.slice(1))
      expect(existsSync(file), `${asset} should exist`).toBe(true)
      expect(statSync(file).size, `${asset} should not be empty`).toBeGreaterThan(5_000)
    }
    expect(Object.keys(ASSETS.portraits)).toContain('argus-one')
  })

  it('only uses narrators or characters with a vertical-slice portrait', () => {
    for (const scene of Object.values(DIALOGUE_SCENES)) {
      expect(scene.lines.length).toBeGreaterThan(0)
      for (const line of scene.lines) {
        expect(line.speaker === 'narrator' || line.speaker in ASSETS.portraits).toBe(true)
      }
    }
  })

  it('can complete every mandatory activity in beats one through four', () => {
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
    expect(state.campaign.currentBeatId).toBe('05-captain-gives-name')
  })
})
