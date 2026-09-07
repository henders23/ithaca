import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { ASSETS, gateCollapseScene } from '../src/slice/content.js'
import { ENCOUNTER_MOMENTS, HOMECOMING_BARKS, applyBattleChoice, battleMemoryEffects, battleMemories } from '../src/slice/encounterMoments.js'
import { gateTruthScene, finalContactScene } from '../src/slice/actFourContent.js'
import { harbourAftermathScene } from '../src/slice/actTwoContent.js'
import { companionMemorialScene, lastWordsScene } from '../src/slice/actThreeFinalContent.js'
import { createInitialState } from '../src/state/initial.js'

const textOf = (scene: ReturnType<typeof gateTruthScene>) => scene.lines.map(line => line.text).join(' ')
const gameWith = (...evidence: string[]) => ({ ...createInitialState('story-adversary'), evidence })

describe('memory and continuity adversaries', () => {
  it('makes the opening firing-bus decision audible at once and contestable at the trial', () => {
    const held = gameWith('battle-choice:01:keep-carrier'), lost = gameWith('battle-choice:01:burn-opening')
    expect(textOf(gateCollapseScene(held))).toContain('The carrier we saved')
    expect(textOf(gateCollapseScene(lost))).toContain('inner carrier is gone')
    expect(textOf(gateTruthScene(held))).toContain('inner carrier N’Dala saved')
    expect(textOf(gateTruthScene(lost))).toContain('kept the guns online')
    expect(textOf(gateTruthScene(gameWith()))).not.toContain('inner carrier N’Dala saved')
  })

  it('lets an initially abandoned convoy leave a survivor, without undoing the abandonment', () => {
    const state = gameWith('battle-choice:09:white-wake')
    state.flags.push('harbour-convoy-abandoned')
    const text = textOf(harbourAftermathScene(state))
    expect(text).toContain('One shuttle follows')
    expect(text).toContain('larger vessels are gone')
    expect(state.flags).toContain('harbour-convoy-abandoned')
    expect(textOf(harbourAftermathScene(gameWith('battle-choice:09:ram-window')))).not.toContain('One shuttle follows')
  })

  it('lets Elara remember both the reunion and the player’s orbital order', () => {
    const state = gameWith('battle-choice:32:give-elara-sky')
    state.dialogueMemories = [{ id: 'b30-father-daughter:explain-time-loss', sceneId: 'b30-father-daughter', choiceId: 'explain-time-loss', label: 'Explain the lost time' }]
    expect(textOf(finalContactScene(state))).toContain('No more explanations')
    expect(textOf(finalContactScene(state))).toContain('You held fire when I asked')
    expect(textOf(finalContactScene(gameWith('battle-choice:32:close-range')))).toContain('You went in close')
  })

  it('remembers Cross’s bottle only when the player shared that opening moment', () => {
    const state = gameWith()
    state.flags.push('last-companion-record-preserved')
    state.decisions.push({ id: 'last', beatId: '25-last-companion', activityId: 'failing-drive', choiceId: 'last-companion:gabriel-cross' })
    state.dialogueMemories.push({ id: 'bottle', sceneId: 'prologue-last-day', choiceId: 'share-the-joke', label: 'Share the old joke' })
    expect(textOf(lastWordsScene(state))).toContain('We should have opened it that morning')
    state.dialogueMemories = []
    expect(textOf(lastWordsScene(state))).not.toContain('We should have opened it that morning')
  })

  it('never resurrects the chosen companion in the memorial, trial or homecoming combat', () => {
    for (const id of ['helen-morozova', 'gabriel-cross', 'lena-mori', 'isabella-corelli', 'kiara-ndala'] as const) {
      const state = gameWith(`last-companion:${id}`)
      state.characters[id].status = 'dead'
      state.decisions.push({ id: 'last', beatId: '25-last-companion', activityId: 'failing-drive', choiceId: `last-companion:${id}` })
      for (const scene of [companionMemorialScene(state), gateTruthScene(state), finalContactScene(state)]) expect(scene.lines.map(line => line.speaker)).not.toContain(id)
      for (const beat of ['28', '31', '32']) {
        expect(ENCOUNTER_MOMENTS[beat].speaker).not.toBe(id)
        expect(HOMECOMING_BARKS[beat].every(bark => ['ELARA','NAUSICA'].includes(bark.speaker))).toBe(true)
      }
    }
  })

  it('persists only valid decisions, renders readable memories, and has real portraits', () => {
    expect(battleMemoryEffects({ decision: { encounterId: '01', choiceId: 'invented-rescue' } })).toEqual([])
    expect(battleMemories(gameWith('battle-choice:99:missing', 'ordinary-evidence'))).toEqual([])
    for (const encounter of Object.values(ENCOUNTER_MOMENTS)) {
      expect(existsSync(`public${ASSETS.portraits[encounter.speaker]}`)).toBe(true)
      for (const choice of encounter.choices) {
        const effects = battleMemoryEffects({ decision: { encounterId: encounter.id, choiceId: choice.id } })
        const evidence = effects.flatMap(effect => effect.kind === 'add-evidence' ? [effect.evidenceId] : [])
        expect(battleMemories(gameWith(...evidence))).toEqual([{ beat: encounter.id, title: encounter.title, text: choice.memory }])
      }
    }
  })

  it('clamps tactical reserves without manufacturing hull repairs or mutating its input', () => {
    for (const encounter of Object.values(ENCOUNTER_MOMENTS)) for (const choice of encounter.choices) for (const reserve of [0, 10, 100]) {
      const state = { charge: reserve, shield: reserve, elapsed: 8000, weaponLockUntil: 0, nextAttackAt: 9000, hull: 17 }
      const before = { ...state }
      const result = applyBattleChoice(state, choice)
      expect(state).toEqual(before)
      expect(result.hull).toBe(17)
      expect(result.charge).toBeGreaterThanOrEqual(0)
      expect(result.shield).toBeGreaterThanOrEqual(0)
      expect(result.charge).toBeLessThanOrEqual(100)
      expect(result.shield).toBeLessThanOrEqual(100)
      expect(result.nextAttackAt).toBeGreaterThanOrEqual(state.nextAttackAt)
    }
  })
})
