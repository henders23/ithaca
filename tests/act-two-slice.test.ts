import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CAMPAIGN_BEATS } from '../src/campaign/beats.js'
import { ACT_TWO_INTERLUDES, ACT_TWO_SCENES, cireneBargainScene, departureScene, harbourAftermathScene } from '../src/slice/actTwoContent.js'
import { DebrisCourseGame, IdentityForensicsGame, NeuralLockGame, RefitAllocationGame } from '../src/slice/ActTwoGames.js'
import { ASSETS } from '../src/slice/content.js'
import { RefugeHub } from '../src/slice/RefugeHub.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame } from '../src/state/reducer.js'
import type { CampaignEffect, GameState } from '../src/state/types.js'

function stateAtBeat(beatOrder: number): GameState {
  let state = reduceGame(createInitialState('act-two-test'), { type: 'campaign/started' }).state
  for (const beat of CAMPAIGN_BEATS.slice(0, beatOrder - 1)) {
    for (const activity of beat.activities.filter((item) => item.mandatory)) {
      state = reduceGame(state, { type: 'activity/completed', beatId: beat.id, activityId: activity.id }).state
    }
    state = reduceGame(state, { type: 'beat/completed', beatId: beat.id }).state
  }
  return state
}

function complete(state: GameState, beatId: string, activityId: string, choiceId: string, effects: CampaignEffect[] = []): GameState {
  const result = reduceGame(state, { type: 'activity/completed', beatId, activityId, choiceId, effects })
  expect(result.accepted, `${beatId}:${activityId}`).toBe(true)
  return result.state
}

function finish(state: GameState, beatId: string): GameState {
  const result = reduceGame(state, { type: 'beat/completed', beatId })
  expect(result.accepted, beatId).toBe(true)
  return result.state
}

describe('Act II first slice', () => {
  it('renders every new interactive framework with an explicit player-facing goal', () => {
    const state = stateAtBeat(9)
    const noOp = () => undefined
    const surfaces = [
      renderToStaticMarkup(createElement(DebrisCourseGame, { convoyWarned: true, onComplete: noOp })),
      renderToStaticMarkup(createElement(IdentityForensicsGame, { onComplete: noOp })),
      renderToStaticMarkup(createElement(NeuralLockGame, { onComplete: noOp })),
      renderToStaticMarkup(createElement(RefitAllocationGame, { game: state, onComplete: noOp })),
      renderToStaticMarkup(createElement(RefugeHub, { game: state, onComplete: noOp })),
    ]
    expect(surfaces[0]).toContain('Plot a route through the closing jaws')
    expect(surfaces[0]).toContain('PROJECTED HULL RISK')
    expect(surfaces[1]).toContain('Audit the continuities')
    expect(surfaces[1]).toContain('PERSONHOOD REVIEW')
    expect(surfaces[2]).toContain('Hold the shape of Vale’s mind')
    expect(surfaces[2]).not.toContain('Hold the difficult detail')
    expect(surfaces[3]).toContain('Choose what the refuge restores')
    expect(surfaces[4]).toContain('A ship forgetting its purpose')
  })

  it('carries choices from the harbour through Cirene and into departure', () => {
    let state = stateAtBeat(9)
    state = complete(state, '09-devouring-harbour', 'false-hospitality', 'warn-the-convoy', [{ kind: 'set-flag', flag: 'harbour-convoy-warned' }])
    state = complete(state, '09-devouring-harbour', 'debris-course', 'convoy-corridor', [{ kind: 'add-evidence', evidenceId: 'harbour-route-safe' }])
    state = complete(state, '09-devouring-harbour', 'harbour-escape', 'harbour-mouth-cleared')
    state = finish(state, '09-devouring-harbour')

    state = complete(state, '10-palace-new-flesh', 'offer-new-flesh', 'crew-decides-treatment')
    state = complete(state, '10-palace-new-flesh', 'identity-forensics', 'continuities-identified', [{ kind: 'add-evidence', evidenceId: 'cirene-continuity-audit' }])
    state = complete(state, '10-palace-new-flesh', 'restoration-choice', 'recognize-both', [{ kind: 'set-flag', flag: 'cirene-copies-recognized' }])
    state = finish(state, '10-palace-new-flesh')

    state = complete(state, '11-captains-bargain', 'neural-lock', 'identity-held')
    state = complete(state, '11-captains-bargain', 'cirene-bargain', 'ally-with-cirene', [{ kind: 'set-flag', flag: 'cirene-allied' }, { kind: 'add-module', moduleId: 'cirene-gate-map' }])
    state = finish(state, '11-captains-bargain')

    state = complete(state, '12-year-outside-time', 'life-in-shelter', 'crew-life-witnessed')
    state = complete(state, '12-year-outside-time', 'refit-allocation', 'hull+engines+medical', [{ kind: 'repair-hull', amount: 20 }, { kind: 'add-module', moduleId: 'cirene-living-armor' }])
    state = complete(state, '12-year-outside-time', 'resume-voyage', 'hold-crew-vote', [{ kind: 'set-flag', flag: 'refuge-vote-honoured' }])
    state = finish(state, '12-year-outside-time')

    expect(state.campaign.currentBeatId).toBe('13-road-through-dead')
    expect(state.flags).toEqual(expect.arrayContaining(['harbour-convoy-warned', 'cirene-copies-recognized', 'cirene-allied', 'refuge-vote-honoured']))
    expect(state.ship.modules).toEqual(expect.arrayContaining(['cirene-gate-map', 'cirene-living-armor']))
    expect(state.decisions.slice(-12).map((decision) => decision.choiceId)).toContain('identity-held')
  })

  it('acknowledges prior choices in later authored scenes', () => {
    let state = stateAtBeat(9)
    state = { ...state, flags: [...state.flags, 'harbour-convoy-warned', 'cirene-copies-recognized', 'cirene-allied'] }
    expect(harbourAftermathScene(state).title).toContain('Three ships')
    expect(cireneBargainScene(state).lines[0].text).toContain('defended continuations')
    expect(departureScene(state).lines.some((line) => line.text.includes('expanded crew'))).toBe(true)
  })

  it('ships compressed cinematic art and clean combat silhouettes', () => {
    const required = [
      ASSETS.cinematics.devouringHarbour, ASSETS.cinematics.devouringHarbourEscape,
      ASSETS.cinematics.cireneArk, ASSETS.cinematics.cireneIdentityLab,
      ASSETS.cinematics.cireneMindTheatre, ASSETS.cinematics.cireneRefitYear,
      ASSETS.portraits['doctor-cirene'], ASSETS.ships.salvageTug, ASSETS.ships.cireneCustodian,
    ]
    for (const asset of required) {
      const file = join(process.cwd(), 'public', asset.slice(1))
      expect(existsSync(file), asset).toBe(true)
      expect(statSync(file).size, `${asset} should be optimized for runtime`).toBeLessThan(1_500_000)
    }
  })

  it('keeps every new beat and interlude narratively dense without becoming a cutscene wall', () => {
    expect(Object.values(ACT_TWO_INTERLUDES)).toHaveLength(4)
    for (const interlude of Object.values(ACT_TWO_INTERLUDES)) {
      expect(interlude.recap.length).toBeGreaterThan(180)
      expect(interlude.objective.length).toBeGreaterThan(80)
    }
    for (const scene of Object.values(ACT_TWO_SCENES)) {
      expect(scene.lines.length).toBeGreaterThanOrEqual(5)
      expect(scene.lines.length).toBeLessThanOrEqual(6)
    }
  })
})
