import { describe, expect, it } from 'vitest'
import { CAMPAIGN_BEATS } from '../src/campaign/beats.js'
import { DIALOGUE_SCENES, INTERLUDES, type DialogueSceneData } from '../src/slice/content.js'
import { CHARACTER_ARCS, EXPERIENCE_BEATS, EXPERIENCE_MINIGAMES } from '../src/slice/experienceManifest.js'
import { SLICE_TWO_INTERLUDES, SLICE_TWO_SCENES } from '../src/slice/sliceTwoContent.js'

describe('adversarial experience contract', () => {
  it('requires every Act I beat to pass a context → complication → interpretation → payoff ladder', () => {
    expect(EXPERIENCE_BEATS).toHaveLength(8)
    for (const [index, beat] of EXPERIENCE_BEATS.entries()) {
      expect(beat.beat).toBe(index + 1)
      expect(beat.playerQuestion.length).toBeGreaterThan(45)
      expect(beat.revealLadder.length, `${beat.title} needs gradual revelation`).toBeGreaterThanOrEqual(4)
      expect(beat.characterPressure.length, `${beat.title} needs character disagreement`).toBeGreaterThanOrEqual(3)
      expect(beat.payoff.length).toBeGreaterThan(45)
    }
  })

  it('rejects minigames without explicit goal, stakes, readable feedback and narrative consequence', () => {
    expect(EXPERIENCE_MINIGAMES).toHaveLength(10)
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
    const registered = CAMPAIGN_BEATS.slice(0, 8).flatMap((beat) => beat.activities.filter((activity) => activity.kind === 'minigame').map((activity) => activity.id))
    expect(EXPERIENCE_MINIGAMES.map((game) => game.id)).toEqual(registered)
  })

  it('gives every core companion a four-stage Act I arc', () => {
    expect(Object.keys(CHARACTER_ARCS)).toHaveLength(7)
    for (const [character, arc] of Object.entries(CHARACTER_ARCS)) {
      expect(arc, `${character} arc`).toHaveLength(4)
      for (const stage of arc) expect(stage.length).toBeGreaterThan(12)
    }
  })

  it('paces decisions only after developed exchanges with legible consequences', () => {
    const scenes: DialogueSceneData[] = [...Object.values(DIALOGUE_SCENES), ...Object.values(SLICE_TWO_SCENES)]
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
    const interludes = [...Object.values(INTERLUDES), ...Object.values(SLICE_TWO_INTERLUDES)]
    expect(interludes).toHaveLength(7)
    for (const interlude of interludes) {
      expect(interlude.recap.length).toBeGreaterThan(120)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.situation.every((item) => item.length > 45)).toBe(true)
      expect(interlude.objective.length).toBeGreaterThan(40)
    }
  })
})
