import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AUDIO_ASSET_PATHS, SFX_SOURCES } from '../src/audio/tracks.js'
import { CHARACTER_VOICES, DIALOGUE_ANTI_PATTERNS } from '../src/narrative/voiceBible.js'
import { ACT_TWO_FINAL_SCENES } from '../src/slice/actTwoFinalContent.js'
import { cireneBargainScene } from '../src/slice/actTwoContent.js'
import { immortalityOfferScene } from '../src/slice/actThreeCodaContent.js'
import { lastWordsScene } from '../src/slice/actThreeFinalContent.js'
import { fatherDaughterScene, finalContactScene } from '../src/slice/actFourContent.js'
import { DIALOGUE_SCENES, type DialogueSceneData } from '../src/slice/content.js'
import { DialogueScene } from '../src/slice/DialogueScene.js'
import { hydrateGameState } from '../src/slice/SliceGame.js'
import { SLICE_TWO_SCENES } from '../src/slice/sliceTwoContent.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame, replayGame } from '../src/state/reducer.js'
import type { GameState } from '../src/state/types.js'

const projectFile = (path: string) => join(process.cwd(), path)

function signatureScenes(game = createInitialState('performance-gate')): DialogueSceneData[] {
  return [
    DIALOGUE_SCENES.prologue,
    DIALOGUE_SCENES['b1-briefing'],
    SLICE_TWO_SCENES['b6-memories'],
    SLICE_TWO_SCENES['b8-judgment'],
    cireneBargainScene(game),
    ACT_TWO_FINAL_SCENES['b16-aftermath'],
    lastWordsScene(game),
    immortalityOfferScene(game),
    fatherDaughterScene(game),
    finalContactScene(game),
  ]
}

describe('stringent dialogue and cinematic performance gate', () => {
  it('gives the principal cast distinct, executable voice constraints', () => {
    const required = ['alexander-vale', 'helen-morozova', 'gabriel-cross', 'lena-mori', 'isabella-corelli', 'kiara-ndala', 'elias', 'elara-vale', 'tidefather'] as const
    for (const id of required) expect(Object.keys(CHARACTER_VOICES)).toContain(id)
    for (const id of required) {
      const voice = CHARACTER_VOICES[id]
      expect(voice.rhythm.length, `${id} rhythm`).toBeGreaterThan(35)
      expect(voice.privateNeed.length, `${id} private need`).toBeGreaterThan(45)
      expect(voice.concreteLanguage.length, `${id} concrete lexicon`).toBeGreaterThanOrEqual(5)
      expect(voice.neverSays.length, `${id} exclusions`).toBeGreaterThanOrEqual(3)
    }
    expect(DIALOGUE_ANTI_PATTERNS.length).toBeGreaterThanOrEqual(5)
  })

  it('puts consequential human responses inside the scene instead of only at its exit', () => {
    const scenes = signatureScenes()
    const moments = scenes.flatMap((scene) => scene.moments ?? [])
    expect(moments.length).toBeGreaterThanOrEqual(10)
    for (const moment of moments) {
      expect(moment.afterLine).toBeGreaterThanOrEqual(0)
      expect(moment.prompt.length, moment.id).toBeGreaterThan(35)
      expect(moment.choices).toHaveLength(3)
      expect(new Set(moment.choices.map((choice) => choice.axis)).size, `${moment.id} should vary relational meaning`).toBeGreaterThanOrEqual(2)
      for (const choice of moment.choices) {
        expect(choice.detail.length, `${moment.id}:${choice.id}`).toBeGreaterThan(35)
        expect(choice.response.text.length, `${moment.id}:${choice.id} immediate response`).toBeGreaterThan(4)
      }
    }
  })

  it('uses variable rhythm, reaction framing and silence in signature scenes', () => {
    const scenes = signatureScenes()
    const lengths = scenes.map((scene) => scene.lines.length)
    expect(Math.max(...lengths) - Math.min(...lengths)).toBeGreaterThanOrEqual(2)
    const lines = scenes.flatMap((scene) => scene.lines)
    expect(lines.filter((line) => line.pause === 'silence' || line.pause === 'held').length).toBeGreaterThanOrEqual(8)
    expect(lines.filter((line) => line.emotion && line.emotion !== 'neutral').length).toBeGreaterThanOrEqual(12)
    expect(lines.filter((line) => line.reaction).length).toBeGreaterThanOrEqual(3)
    expect(lines.some((line) => line.text.trim().split(/\s+/).length <= 5)).toBe(true)
  })

  it('lets the player reread, backtrack and scale dialogue without losing cinematic framing', () => {
    const html = renderToStaticMarkup(createElement(DialogueScene, { scene: DIALOGUE_SCENES.prologue }))
    expect(html).toContain('Transcript')
    expect(html).toContain('← Back')
    expect(html).toContain('scene-orientation')
    expect(html).toContain('scene-progress')
    const css = readFileSync(projectFile('src/ui/styles.css'), 'utf8')
    expect(css).toContain('--dialogue-scale')
    expect(css).toContain('@media(max-height:850px) and (min-width:801px)')
    expect(css).toContain('.reaction-portrait')
    expect(css).toContain('.dialogue-transcript')
    expect(css).not.toContain('.dialogue-moment small { display:none; }')
    expect(css).not.toContain('.sacrifice-options p { display: none; }')
    expect(css).toContain('-webkit-line-clamp:2')
  })

  it('records relational nuance deterministically and preserves old autosaves', () => {
    let state = reduceGame(createInitialState('memory-replay'), { type: 'campaign/started' }).state
    state = reduceGame(state, {
      type: 'dialogue/moment', sceneId: 'prologue-last-day', choiceId: 'share-the-joke', label: 'Share the old joke',
      character: 'gabriel-cross', axis: 'intimacy', delta: 1,
    }).state
    expect(state.relationshipDimensions['gabriel-cross']).toMatchObject({ intimacy: 1, trust: 0, resentment: 0 })
    expect(state.dialogueMemories[0]).toMatchObject({ sceneId: 'prologue-last-day', choiceId: 'share-the-joke' })
    expect(replayGame(createInitialState('memory-replay'), state.actionLog)).toEqual(state)

    const legacy = { ...createInitialState('legacy-save'), schemaVersion: 1, relationshipDimensions: undefined, dialogueMemories: undefined } as unknown as GameState
    const migrated = hydrateGameState(legacy)
    expect(migrated.schemaVersion).toBe(2)
    expect(migrated.relationshipDimensions['helen-morozova']).toEqual({ trust: 0, intimacy: 0, respect: 0, resentment: 0 })
    expect(migrated.dialogueMemories).toEqual([])
  })

  it('pays off remembered dialogue in the homecoming rather than flattening it into a score', () => {
    const base = createInitialState('callback-gate')
    const withMessage = {
      ...base,
      dialogueMemories: [{ id: 'b16-elara-message:ask-when-mother-died', sceneId: 'b16-elara-message', choiceId: 'ask-when-mother-died', label: 'Ask when Gran died' }],
    }
    expect(fatherDaughterScene(withMessage).lines.map((line) => line.text).join(' ')).toContain('when Gran died')
    const withReunion = {
      ...base,
      dialogueMemories: [{ id: 'b30-father-daughter:explain-time-loss', sceneId: 'b30-father-daughter', choiceId: 'explain-time-loss', label: 'Explain the lost time' }],
    }
    expect(finalContactScene(withReunion).lines.map((line) => line.text).join(' ')).toContain('No more explanations')
  })
})

describe('combat repetition and audio-fatigue gate', () => {
  it('contains no reporting-damage audio source, binary or call site', () => {
    expect(Object.keys(SFX_SOURCES).join(' ')).not.toMatch(/reporting.?damage/i)
    expect(AUDIO_ASSET_PATHS.join(' ')).not.toMatch(/reporting_damage/i)
    expect(existsSync(projectFile('public/assets/audio/reporting_damage.mp3'))).toBe(false)
    expect(existsSync(projectFile('public/assets/audio/reporting_damage_1.mp3'))).toBe(false)
    const combatSource = readFileSync(projectFile('src/slice/CinematicCombat.tsx'), 'utf8')
    expect(combatSource).not.toMatch(/reporting.?damage/i)
    expect(combatSource).toContain('barkHistoryRef.current')
    expect(combatSource).toContain('role="status"')
  })
})
