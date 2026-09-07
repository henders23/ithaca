// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogueMemoryProvider, type DialogueMomentSelection } from '../src/narrative/DialogueMemoryContext.js'
import { CinematicCombat, type CombatConfig } from '../src/slice/CinematicCombat.js'
import { DialogueScene } from '../src/slice/DialogueScene.js'
import { ASSETS, type DialogueSceneData, type SliceScreenId } from '../src/slice/content.js'
import { ENCOUNTER_MOMENTS } from '../src/slice/encounterMoments.js'
import { SliceGame } from '../src/slice/SliceGame.js'
import { CAMPAIGN_BEATS } from '../src/campaign/beats.js'
import { createInitialState } from '../src/state/initial.js'
import { reduceGame, replayGame } from '../src/state/reducer.js'
import type { GameState } from '../src/state/types.js'

vi.mock('../src/audio/useAudio.js', () => ({ useMusicScene: () => {}, useMusicDirector: () => {} }))
vi.mock('../src/audio/AudioControls.js', () => ({ AudioControls: () => null }))
vi.mock('../src/audio/director.js', () => ({ audioDirector: { playSfx: vi.fn(), preloadSfx: vi.fn(), duck: vi.fn() } }))

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(Math, 'random').mockReturnValue(.99)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  localStorage.clear()
  window.history.replaceState({}, '', '/')
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const advanceTime = (ms: number) => act(() => vi.advanceTimersByTime(ms))
function button(text: string, scope: ParentNode = host) {
  const found = Array.from(scope.querySelectorAll<HTMLButtonElement>('button')).find(item => item.textContent?.includes(text))
  if (!found) throw new Error(`Missing button ${text}: ${scope.textContent}`)
  return found
}
function click(text: string, scope: ParentNode = host) { act(() => button(text, scope).click()) }
const clock = () => host.querySelector('.combat-clock')?.textContent
const meters = () => host.querySelector('.ship-status')?.textContent
function waitForShot() {
  for (let i = 0; i < 40 && !host.querySelector('.weapon-fx.incoming'); i++) advanceTime(100)
  expect(host.querySelector('.weapon-fx.incoming')).not.toBeNull()
}
const config: CombatConfig = {
  beat: 'TEST BATTLE', title: 'Test', objective: 'Open the way', background: ASSETS.cinematics.title,
  playerShip: ASSETS.ships.ithaca, enemyShip: ASSETS.ships.eidolon, enemyName: 'Guardian',
  incomingLabel: 'Guardian', targets: [{ id: 'lock', name: 'Lock', role: 'THREAT', hp: 50 }],
  playerHull: 100, enemyInterval: 1000,
}

describe('combat input and simulation adversaries', () => {
  it('holds an airborne projectile through pause and resolves it only after resuming', () => {
    act(() => root.render(<CinematicCombat config={config} onComplete={vi.fn()} />))
    click('Engage')
    waitForShot()
    const before = meters()
    click('PAUSE')
    const time = clock()
    advanceTime(30000)
    expect(clock()).toBe(time)
    expect(meters()).toBe(before)
    expect(host.querySelector('.weapon-fx.incoming')).not.toBeNull()
    click('Resume battle')
    advanceTime(1000)
    expect(meters()).not.toBe(before)
  })

  it('freezes the clock and impacts while the document is hidden', () => {
    act(() => root.render(<CinematicCombat config={config} onComplete={vi.fn()} />))
    click('Engage')
    waitForShot()
    const before = meters(), time = clock()
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    advanceTime(10000)
    expect(clock()).toBe(time)
    expect(meters()).toBe(before)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    advanceTime(1000)
    expect(meters()).not.toBe(before)
  })

  it('keeps the dodge cue visible in flight and accepts Q from a focused weapon', () => {
    act(() => root.render(<CinematicCombat config={config} onComplete={vi.fn()} />))
    click('Engage')
    waitForShot()
    expect(host.querySelector('.incoming-warning')?.textContent).toContain('BURN NOW')
    act(() => {
      const weapon = button('Rail lance')
      weapon.focus()
      weapon.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true }))
    })
    advanceTime(1000)
    expect(host.querySelector('.sortie-stats')?.textContent).toContain('EVADED 1')
  })

  it('pauses for both the decision and the reply, locks weapons, and traps focus', () => {
    const battle = { ...config, beat: 'BEAT 09', enemyInterval: 100000 }
    act(() => root.render(<CinematicCombat config={battle} onComplete={vi.fn()} />))
    click('Engage')
    advanceTime(8200)
    const time = clock()
    const dialog = host.querySelector('.encounter-moment')!
    expect(dialog.contains(document.activeElement)).toBe(true)
    act(() => button('Force the gap').focus())
    act(() => document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })))
    expect(document.activeElement).toBe(button('Leave a white wake'))
    advanceTime(60000)
    expect(clock()).toBe(time)
    click('Leave a white wake')
    expect(dialog.textContent).toContain('For once the leak is supposed')
    advanceTime(60000)
    expect(clock()).toBe(time)
    click('Back to the fight')
    expect(button('Rail lance').disabled).toBe(true)
    advanceTime(3900)
    expect(button('Rail lance').disabled).toBe(true)
    advanceTime(200)
    expect(button('Rail lance').disabled).toBe(false)
    advanceTime(10000)
    expect(host.querySelector('.encounter-moment')).toBeNull()
  })

  it('retry clears a decision, delayed effects and cooldowns from a lost attempt', () => {
    const battle = { ...config, beat: 'BEAT 06', playerHull: 1, enemyInterval: 3000 }
    act(() => root.render(<CinematicCombat config={battle} onComplete={vi.fn()} />))
    click('Engage')
    advanceTime(8200)
    click('Hold the bearing and fire')
    click('Back to the fight')
    advanceTime(50000)
    expect(host.querySelector('[aria-label="Battle lost"]')).not.toBeNull()
    click('Retry battle')
    expect(clock()).toBe('00:00')
    expect(host.querySelector('.weapon-fx')).toBeNull()
    advanceTime(8200)
    expect(button('Cast a false drive echo').disabled).toBe(false)
  })
})

const dialogue: DialogueSceneData = {
  id: 'test-private-scene', chapter: 'TEST', beat: 'BEAT 01', title: 'A quiet moment', background: ASSETS.cinematics.bridge,
  lines: [
    { speaker: 'alexander-vale', name: 'VALE', text: 'I thought we would have more time.' },
    { speaker: 'gabriel-cross', name: 'CROSS', text: 'We have this much.' },
    { speaker: 'narrator', name: 'BRIDGE', text: 'Neither of them looks at the clock.' },
  ],
  moments: [{ id: 'answer-cross', afterLine: 1, prompt: 'Answer him.', choices: [
    { id: 'stay', label: 'Stay a moment', detail: 'Sit with him.', character: 'gabriel-cross', axis: 'intimacy', delta: 1, response: { speaker: 'gabriel-cross', name: 'CROSS', text: 'All right. Stay.' } },
    { id: 'leave', label: 'Return to duty', detail: 'Leave him alone.', character: 'gabriel-cross', axis: 'resentment', delta: 1, response: { speaker: 'gabriel-cross', name: 'CROSS', text: 'Of course, Captain.' } },
  ] }],
}

describe('dialogue continuity adversaries', () => {
  it('Skip reveals the whole line permanently, even with a pending typewriter timer', () => {
    localStorage.setItem('ithaca-dialogue-speed', 'measured')
    act(() => root.render(<DialogueScene scene={dialogue} />))
    advanceTime(160)
    click('Skip')
    expect(host.querySelector('.typed')?.textContent).toBe(dialogue.lines[0].text)
    advanceTime(1000)
    expect(host.querySelector('.typed')?.textContent).toBe(dialogue.lines[0].text)
  })

  it('records a response once, preserves position when state rebuilds the scene, and restores it on reload', () => {
    localStorage.setItem('ithaca-dialogue-speed', 'instant')
    let saved = reduceGame(createInitialState('dialogue'), { type: 'campaign/started' }).state
    function Harness() {
      const [state, setState] = useState(saved)
      const record = ({ sceneId, momentId, choice }: DialogueMomentSelection) => {
        saved = reduceGame(state, { type: 'dialogue/moment', sceneId, momentId, choiceId: choice.id, label: choice.label, character: choice.character, axis: choice.axis, delta: choice.delta }).state
        setState(saved)
      }
      return <DialogueMemoryProvider memories={state.dialogueMemories} onRecord={record}><DialogueScene scene={{ ...dialogue, lines: dialogue.lines.map(line => ({ ...line })) }} /></DialogueMemoryProvider>
    }
    act(() => root.render(<Harness />))
    click('Continue')
    click('Stay a moment')
    expect(host.querySelector('.typed')?.textContent).toBe('We have this much.')
    click('Continue')
    expect(host.querySelector('.typed')?.textContent).toBe('All right. Stay.')
    expect(saved.dialogueMemories).toHaveLength(1)
    act(() => root.render(<Harness key="reloaded" />))
    click('Continue')
    expect(host.querySelector('.dialogue-moment')).toBeNull()
    click('Continue')
    expect(host.querySelector('.typed')?.textContent).toBe('All right. Stay.')
    expect(saved.relationshipDimensions['gabriel-cross'].intimacy).toBe(1)
    const duplicate = reduceGame(saved, { type: 'dialogue/moment', sceneId: dialogue.id!, momentId: 'answer-cross', choiceId: 'leave', label: 'Return to duty', character: 'gabriel-cross', axis: 'resentment', delta: 1 })
    expect(duplicate.accepted).toBe(false)
    expect(duplicate.state).toBe(saved)
  })

  it('does not let Enter on Transcript also advance the underlying scene', () => {
    localStorage.setItem('ithaca-dialogue-speed', 'instant')
    act(() => root.render(<DialogueScene scene={dialogue} />))
    act(() => {
      const transcript = button('Transcript')
      transcript.focus()
      transcript.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      transcript.click()
    })
    expect(host.querySelector('.dialogue-transcript')).not.toBeNull()
    expect(host.querySelector('.typed')?.textContent).toBe(dialogue.lines[0].text)
    act(() => document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
    expect(host.querySelector('.dialogue-transcript')).toBeNull()
  })

  it('holds autoplay while the journal covers the scene and resumes at the same line', () => {
    localStorage.setItem('ithaca-dialogue-speed', 'instant')
    localStorage.setItem('ithaca-dialogue-auto', 'on')
    const render = (suspended: boolean) => act(() => root.render(<DialogueMemoryProvider onRecord={() => {}} suspended={suspended}><DialogueScene scene={dialogue} /></DialogueMemoryProvider>))
    render(false)
    advanceTime(200)
    render(true)
    advanceTime(30000)
    expect(host.querySelector('.typed')?.textContent).toBe(dialogue.lines[0].text)
    render(false)
    advanceTime(3000)
    expect(host.querySelector('.typed')?.textContent).toBe(dialogue.lines[1].text)
  })
})

const screens: readonly [string, SliceScreenId][] = [['01','b1-combat'],['04','b4-combat'],['06','b6-combat'],['09','b9-combat'],['11','b11-combat'],['20','b20-combat'],['24','b24-combat'],['28','b28-combat'],['31','b31-combat'],['32','b32-orbit']]

describe('actual campaign encounters, both tactical decisions', () => {
  it('holds a live battle while the Journey Log is open', () => {
    window.history.replaceState({}, '', '/?screen=b1-combat')
    act(() => root.render(<SliceGame />))
    click('Engage')
    advanceTime(4000)
    const time = clock(), before = meters()
    act(() => host.querySelector<HTMLButtonElement>('.voyage-log-button')!.click())
    const log = host.querySelector('[aria-label="Journey log"]')!
    expect(log.contains(document.activeElement)).toBe(true)
    advanceTime(30000)
    expect(clock()).toBe(time)
    expect(meters()).toBe(before)
    click('Close', log)
    advanceTime(1000)
    expect(clock()).not.toBe(time)
  })

  for (const [beat, screen] of screens) for (const choice of ENCOUNTER_MOMENTS[beat].choices) {
    it(`${screen}: ${choice.id} completes, saves and replays its order`, () => {
      let state = reduceGame(createInitialState('whole-battle'), { type: 'campaign/started' }).state
      // Reach the intended beat through legal reducer actions, completing earlier requirements.
      for (const previous of CAMPAIGN_BEATS) {
        if (previous.id.startsWith(beat + '-')) break
        for (const activity of previous.activities.filter(activity => activity.mandatory)) state = reduceGame(state, { type: 'activity/completed', beatId: previous.id, activityId: activity.id }).state
        state = reduceGame(state, { type: 'beat/completed', beatId: previous.id }).state
      }
      localStorage.setItem('ithaca-vertical-slice-v1', JSON.stringify({ screen, game: state, savedAt: '2026-09-07T12:00:00.000Z' }))
      window.history.replaceState({}, '', `/?screen=${screen}`)
      act(() => root.render(<SliceGame />))
      click('Engage')
      advanceTime(8200)
      expect(host.querySelector('.encounter-moment'), screen).not.toBeNull()
      click(choice.label)
      click('Back to the fight')
      // Read the actual visible weaknesses; don't reach into combat state or inject a victory.
      for (let tick = 0; tick < 900 && !host.querySelector('.combat-modal.result'); tick++) {
        const warning = host.querySelector('.incoming-warning')?.textContent
        if (warning?.includes('BURN NOW') && !button('EVASIVE BURN').disabled) click('EVASIVE BURN')
        const effective = host.querySelector<HTMLButtonElement>('.weapon-buttons button.effective:not(:disabled)')
        if (effective) act(() => effective.click())
        else {
          const ion = host.querySelector<HTMLButtonElement>('.weapon-ion:not(:disabled)')
          if (ion) act(() => ion.click())
        }
        advanceTime(100)
      }
      expect(host.querySelector('[aria-label="Battle complete"]'), host.textContent ?? '').not.toBeNull()
      click('Resume the story')
      const save = JSON.parse(localStorage.getItem('ithaca-vertical-slice-v1')!) as { screen: string; game: GameState }
      expect(save.screen).not.toBe(screen)
      expect(save.game.evidence).toContain(`battle-choice:${beat}:${choice.id}`)
      expect(replayGame(createInitialState('whole-battle'), save.game.actionLog)).toEqual(save.game)
    })
  }
})
