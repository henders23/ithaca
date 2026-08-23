import { describe, expect, it } from 'vitest'
import { CAMPAIGN_BEATS } from '../src/campaign/beats.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame, replayGame } from '../src/state/reducer.js'

describe('deterministic campaign state', () => {
  it('starts at the first beat and rejects skips', () => {
    const started = reduceGame(createInitialState('test'), { type: 'campaign/started' })
    expect(started.accepted).toBe(true)
    expect(started.state.campaign.currentBeatId).toBe('01-burning-tide-gate')

    const skipped = reduceGame(started.state, { type: 'beat/completed', beatId: '02-wrong-stars' })
    expect(skipped.accepted).toBe(false)
    expect(skipped.state).toBe(started.state)
  })

  it('requires every mandatory activity before advancing', () => {
    let state = reduceGame(createInitialState('test'), { type: 'campaign/started' }).state
    const premature = reduceGame(state, { type: 'beat/completed', beatId: CAMPAIGN_BEATS[0].id })
    expect(premature.accepted).toBe(false)

    for (const activity of CAMPAIGN_BEATS[0].activities.filter((item) => item.mandatory)) {
      state = reduceGame(state, {
        type: 'activity/completed',
        beatId: CAMPAIGN_BEATS[0].id,
        activityId: activity.id,
      }).state
    }
    const completed = reduceGame(state, { type: 'beat/completed', beatId: CAMPAIGN_BEATS[0].id })
    expect(completed.accepted).toBe(true)
    expect(completed.state.campaign.currentBeatId).toBe('02-wrong-stars')
  })

  it('applies typed consequences and replays to the same state', () => {
    let state = reduceGame(createInitialState('replay'), { type: 'campaign/started' }).state
    state = reduceGame(state, {
      type: 'activity/completed',
      beatId: '01-burning-tide-gate',
      activityId: 'incomplete-intelligence',
      choiceId: 'scan-before-firing',
      effects: [
        { kind: 'set-flag', flag: 'tide-gate-scanned' },
        { kind: 'relationship', character: 'helen-morozova', delta: 2 },
        { kind: 'pursuit', delta: 12 },
        { kind: 'damage-system', system: 'sensors', amount: 45 },
      ],
    }).state

    expect(state.flags).toContain('tide-gate-scanned')
    expect(state.relationships['helen-morozova']).toBe(2)
    expect(state.pursuit).toBe(12)
    expect(state.ship.systems.sensors).toEqual({ integrity: 55, status: 'degraded' })

    expect(replayGame(createInitialState('replay'), state.actionLog)).toEqual(state)
  })
})

