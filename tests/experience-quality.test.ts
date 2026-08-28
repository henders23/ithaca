import { describe, expect, it } from 'vitest'
import { CAMPAIGN_BEATS } from '../src/campaign/beats.js'
import { DIALOGUE_SCENES, INTERLUDES, type DialogueSceneData } from '../src/slice/content.js'
import { ACT_THREE_CHARACTER_ARCS, ACT_TWO_CHARACTER_ARCS, CHARACTER_ARCS, EXPERIENCE_BEATS, EXPERIENCE_MINIGAMES } from '../src/slice/experienceManifest.js'
import { SLICE_TWO_INTERLUDES, SLICE_TWO_SCENES } from '../src/slice/sliceTwoContent.js'
import { ACT_TWO_INTERLUDES, ACT_TWO_SCENES, cireneBargainScene, departureScene } from '../src/slice/actTwoContent.js'
import { ACT_TWO_FINAL_INTERLUDES, ACT_TWO_FINAL_SCENES } from '../src/slice/actTwoFinalContent.js'
import { ACT_THREE_INTERLUDES, ACT_THREE_SCENES } from '../src/slice/actThreeContent.js'
import { ACT_THREE_FINAL_INTERLUDES, ACT_THREE_FINAL_SCENES, companionMemorialScene, heliosAwakensScene, judgmentAftermathScene, lastWordsScene, mutinyConfrontationScene } from '../src/slice/actThreeFinalContent.js'
import { createInitialState } from '../src/state/initial.js'

describe('adversarial experience contract', () => {
  it('requires every playable beat to pass a context → complication → interpretation → payoff ladder', () => {
    expect(EXPERIENCE_BEATS).toHaveLength(25)
    for (const [index, beat] of EXPERIENCE_BEATS.entries()) {
      expect(beat.beat).toBe(index + 1)
      expect(beat.playerQuestion.length).toBeGreaterThan(45)
      expect(beat.revealLadder.length, `${beat.title} needs gradual revelation`).toBeGreaterThanOrEqual(4)
      expect(beat.characterPressure.length, `${beat.title} needs character disagreement`).toBeGreaterThanOrEqual(3)
      expect(beat.payoff.length).toBeGreaterThan(45)
    }
  })

  it('rejects minigames without explicit goal, stakes, readable feedback and narrative consequence', () => {
    expect(EXPERIENCE_MINIGAMES).toHaveLength(28)
    expect(new Set(EXPERIENCE_MINIGAMES.map((game) => game.id)).size).toBe(EXPERIENCE_MINIGAMES.length)
    for (const game of EXPERIENCE_MINIGAMES) {
      expect(game.goal.length, `${game.id} goal`).toBeGreaterThan(45)
      expect(game.input.length, `${game.id} input`).toBeGreaterThan(45)
      expect(game.stakes.length, `${game.id} stakes`).toBeGreaterThan(45)
      expect(game.feedback.length, `${game.id} feedback modes`).toBeGreaterThanOrEqual(3)
      expect(game.narrativeFunction.length, `${game.id} narrative function`).toBeGreaterThan(65)
      expect(game.consequence.length, `${game.id} consequence`).toBeGreaterThan(55)
      expect(game.targetSeconds[0]).toBeGreaterThanOrEqual(30)
      expect(game.targetSeconds[1]).toBeLessThanOrEqual(180)
      expect(game.targetSeconds[1]).toBeGreaterThan(game.targetSeconds[0])
    }
  })

  it('keeps the quality manifest aligned with the playable campaign registry', () => {
    const registered = CAMPAIGN_BEATS.slice(0, 25).flatMap((beat) => beat.activities.filter((activity) => activity.kind === 'minigame').map((activity) => activity.id))
    expect(EXPERIENCE_MINIGAMES.map((game) => game.id)).toEqual(registered)
  })

  it('gives every core companion a four-stage Act I arc', () => {
    expect(Object.keys(CHARACTER_ARCS)).toHaveLength(7)
    for (const [character, arc] of Object.entries(CHARACTER_ARCS)) {
      expect(arc, `${character} arc`).toHaveLength(4)
      for (const stage of arc) expect(stage.length).toBeGreaterThan(12)
    }
  })

  it('continues every core companion through a distinct four-stage Act II arc', () => {
    expect(Object.keys(ACT_TWO_CHARACTER_ARCS)).toEqual(Object.keys(CHARACTER_ARCS))
    for (const [character, arc] of Object.entries(ACT_TWO_CHARACTER_ARCS)) {
      expect(arc, `${character} Act II arc`).toHaveLength(4)
      for (const stage of arc) expect(stage.length).toBeGreaterThan(18)
    }
  })

  it('continues every core companion through a distinct four-stage Act III arc', () => {
    expect(Object.keys(ACT_THREE_CHARACTER_ARCS)).toEqual(Object.keys(CHARACTER_ARCS))
    for (const [character, arc] of Object.entries(ACT_THREE_CHARACTER_ARCS)) {
      expect(arc, `${character} Act III arc`).toHaveLength(4)
      for (const stage of arc) expect(stage.length).toBeGreaterThan(18)
    }
  })

  it('paces decisions only after developed exchanges with legible consequences', () => {
    const blankGame = createInitialState('quality-test')
    const scenes: DialogueSceneData[] = [...Object.values(DIALOGUE_SCENES), ...Object.values(SLICE_TWO_SCENES), ...Object.values(ACT_TWO_SCENES), ...Object.values(ACT_TWO_FINAL_SCENES), ...Object.values(ACT_THREE_SCENES), ...Object.values(ACT_THREE_FINAL_SCENES), cireneBargainScene(blankGame), departureScene(blankGame), mutinyConfrontationScene(blankGame), heliosAwakensScene(blankGame), judgmentAftermathScene(blankGame), lastWordsScene(blankGame), companionMemorialScene(blankGame)]
    for (const scene of scenes) {
      expect(scene.lines.length, `${scene.title} is moving too quickly`).toBeGreaterThanOrEqual(5)
      expect(scene.lines.length, `${scene.title} is overlong`).toBeLessThanOrEqual(8)
      for (const choice of scene.choices ?? []) {
        expect(choice.label.length).toBeGreaterThan(5)
        expect(choice.detail.length, `${choice.id} must preview human or strategic cost`).toBeGreaterThan(45)
      }
    }
  })

  it('briefs every transition after Beat 1 with state, danger and a concrete objective', () => {
    const interludes = [...Object.values(INTERLUDES), ...Object.values(SLICE_TWO_INTERLUDES), ...Object.values(ACT_TWO_INTERLUDES), ...Object.values(ACT_TWO_FINAL_INTERLUDES), ...Object.values(ACT_THREE_INTERLUDES), ...Object.values(ACT_THREE_FINAL_INTERLUDES)]
    expect(interludes).toHaveLength(24)
    for (const interlude of interludes) {
      expect(interlude.recap.length).toBeGreaterThan(120)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.situation.every((item) => item.length > 45)).toBe(true)
      expect(interlude.objective.length).toBeGreaterThan(40)
    }
  })
})
