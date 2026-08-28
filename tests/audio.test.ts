import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { AUDIO_ASSET_PATHS, COMBAT_FX, COMBAT_FX_ASSET_PATHS, EXPLOSION_SHEETS, MUSIC_SCENES, MUSIC_TRACKS, SFX_SOURCES } from '../src/audio/tracks.js'
import { AudioControls } from '../src/audio/AudioControls.js'
import { CinematicCombat } from '../src/slice/CinematicCombat.js'
import { DialogueScene } from '../src/slice/DialogueScene.js'
import { ASSETS, DIALOGUE_SCENES, sceneHasAlienSpeaker, type DialogueSceneData } from '../src/slice/content.js'
import { SLICE_TWO_SCENES } from '../src/slice/sliceTwoContent.js'
import { ACT_TWO_SCENES } from '../src/slice/actTwoContent.js'
import { ACT_THREE_SCENES } from '../src/slice/actThreeContent.js'
import { ACT_TWO_FINAL_SCENES } from '../src/slice/actTwoFinalContent.js'
import { ACT_THREE_FINAL_SCENES } from '../src/slice/actThreeFinalContent.js'
import { immortalityOfferScene } from '../src/slice/actThreeCodaContent.js'
import { createInitialState } from '../src/state/initial.js'
import { ALIEN_CHARACTER_IDS, isAlienCharacter } from '../src/canon/characters.js'
import { scyllaCombatConfigForRoute } from '../src/slice/SliceGame.js'

const asset = (path: string) => join(process.cwd(), 'public', path.slice(1))

describe('voyage soundtrack', () => {
  it('scores the start screen, the default voyage, alien encounters and combat with four distinct tracks', () => {
    expect(MUSIC_SCENES).toEqual(['title', 'voyage', 'alien', 'combat'])
    expect(MUSIC_TRACKS.title.title).toBe('Glass Moon Relay')
    expect(MUSIC_TRACKS.voyage.title).toBe('Starship Ithaca')
    expect(MUSIC_TRACKS.alien.title).toBe('Cirene’s Ark')
    expect(MUSIC_TRACKS.combat.title).toBe('Black Banner')
    const sources = MUSIC_SCENES.map((scene) => MUSIC_TRACKS[scene].src)
    expect(new Set(sources).size).toBe(4)
    // Encounters open on the same bar every time; the voyage itself is continuous.
    expect([MUSIC_TRACKS.alien.restart, MUSIC_TRACKS.combat.restart]).toEqual([true, true])
    expect([MUSIC_TRACKS.title.restart, MUSIC_TRACKS.voyage.restart]).toEqual([false, false])
  })

  it('ships every music, combat sample and effect frame it references', () => {
    for (const path of [...AUDIO_ASSET_PATHS, ...COMBAT_FX_ASSET_PATHS]) {
      expect(existsSync(asset(path)), `${path} should exist`).toBe(true)
      expect(statSync(asset(path)).size, `${path} should not be empty`).toBeGreaterThan(5_000)
    }
    expect(AUDIO_ASSET_PATHS.length).toBe(17)
    expect(COMBAT_FX_ASSET_PATHS.length).toBe(11)
    expect(new Set(Object.values(SFX_SOURCES)).size).toBe(13)
  })

  it('describes each explosion sheet as a complete grid of cells', () => {
    for (const [id, sheet] of Object.entries(EXPLOSION_SHEETS)) {
      expect(Object.values(COMBAT_FX), id).toContain(sheet.sheet)
      expect(sheet.columns * sheet.rows, id).toBeGreaterThanOrEqual(16)
      expect(sheet.frameMs, id).toBeGreaterThan(0)
    }
  })
})

describe('alien encounter scoring', () => {
  it('treats Eidolon and encounter entities as alien and the crew as not', () => {
    expect(ALIEN_CHARACTER_IDS).toContain('tidefather')
    expect(ALIEN_CHARACTER_IDS).toContain('doctor-cirene')
    expect(ALIEN_CHARACTER_IDS).toContain('calypso')
    expect(isAlienCharacter('narrator')).toBe(false)
    expect(isAlienCharacter('alexander-vale')).toBe(false)
    // ELIAS is the Ithaca's own service intelligence, not an encounter.
    expect(isAlienCharacter('elias')).toBe(false)
  })

  it('marks the scenes where an alien actually speaks', () => {
    const alien: readonly DialogueSceneData[] = [
      SLICE_TWO_SCENES['b6-memories'],
      SLICE_TWO_SCENES['b7-negotiation'],
      ACT_TWO_SCENES['b10-arrival'],
      ACT_TWO_FINAL_SCENES['b17-prophecy'],
      ACT_THREE_FINAL_SCENES['b22-arrival'],
      // State-built scenes resolve the same way as the authored ones.
      immortalityOfferScene(createInitialState('audio-test')),
    ]
    for (const scene of alien) expect(sceneHasAlienSpeaker(scene), scene.title).toBe(true)

    const human: readonly DialogueSceneData[] = [
      DIALOGUE_SCENES.prologue,
      DIALOGUE_SCENES['b1-briefing'],
      DIALOGUE_SCENES['b2-accounting'],
      // The crew discussing the Choir is still a crew scene.
      ACT_THREE_SCENES['b18-promises'],
    ]
    for (const scene of human) expect(sceneHasAlienSpeaker(scene), scene.title).toBe(false)
  })
})

describe('audio surfaces render without a browser', () => {
  it('renders the audio panel, a dialogue scene and a battle during server rendering', () => {
    expect(renderToStaticMarkup(createElement(AudioControls))).toContain('Starship Ithaca')

    const dialogue = renderToStaticMarkup(createElement(DialogueScene, { scene: DIALOGUE_SCENES.prologue }))
    expect(dialogue).toContain('dialogue-scene')

    const battle = renderToStaticMarkup(createElement(CinematicCombat, {
      config: scyllaCombatConfigForRoute('scylla-close', 100),
      onComplete: () => {},
    }))
    expect(battle).toContain('combat-screen')
    expect(battle).toContain(ASSETS.ships.ithaca)
  })
})
