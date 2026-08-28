import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { combatObjectiveComplete, type LiveCombatTarget } from '../src/slice/CinematicCombat.js'
import { FALSE_HOME_ROOMS, IDENTITY_GATES, FalseHomeGame, IdentityExitGame, VoyageAccountGame, accountChapters, accountOutcome, falseHomeOutcome, identityExitOutcome } from '../src/slice/ActThreeCodaGames.js'
import { ACT_THREE_CODA_INTERLUDES, calypsoElapsedYears, calypsoWakingScene, departureTermsScene, hospitalityVerdictScene, immortalityOfferScene, phaeacianWelcomeScene, yearsOutsideScene } from '../src/slice/actThreeCodaContent.js'
import { SLICE_SCREEN_IDS, phaeacianCombatConfig, phaeacianEscortStrength } from '../src/slice/SliceGame.js'
import { createInitialState } from '../src/state/initial.js'
import type { GameState } from '../src/state/types.js'

type GamePatch = Omit<Partial<GameState>, 'relationships' | 'characters'> & {
  relationships?: Partial<GameState['relationships']>
  characters?: Partial<GameState['characters']>
}

function stateWith(patch: GamePatch): GameState {
  const base = createInitialState('calypso-adversary')
  return {
    ...base,
    ...patch,
    relationships: { ...base.relationships, ...patch.relationships },
    characters: { ...base.characters, ...patch.characters },
    ship: patch.ship ?? base.ship,
  }
}

describe('Calypso and hospitality adversarial release gate', () => {
  it('server-renders every new interactive surface with explicit goal and live feedback', () => {
    const game = stateWith({ evidence: ['last-companion:lena-mori', 'complete-gate-testimony', 'scylla-rescued:SATO,VEGA', 'hunger-casualties:7'] })
    const noOp = () => undefined
    const falseHome = renderToStaticMarkup(createElement(FalseHomeGame, { onComplete: noOp }))
    const identity = renderToStaticMarkup(createElement(IdentityExitGame, { game, onComplete: noOp }))
    const account = renderToStaticMarkup(createElement(VoyageAccountGame, { game, onComplete: noOp }))
    expect(falseHome).toContain('Find the fault in paradise')
    expect(falseHome).toContain('VERIFIED FAULTS')
    expect(identity).toContain('Choose the memory that points outward')
    expect(identity).toContain('CALYPSO COPY')
    expect(account).toContain('Tell the voyage that actually happened')
    expect(account).toContain('ESCORT COMMITMENT')
  })

  it('requires repeatable evidence rather than punishing imperfect memory', () => {
    const correct = FALSE_HOME_ROOMS.map((room) => room.options.find((option) => option.correct)?.id ?? '')
    const memoryOnly = ['wrong-cups', 'perfect-child', 'warm-water']
    expect(falseHomeOutcome(correct)).toMatchObject({ correct: 3, mistakes: 0, externalYears: 9, success: true })
    expect(falseHomeOutcome(memoryOnly)).toMatchObject({ correct: 0, mistakes: 3, externalYears: 21, success: false })
    for (const room of FALSE_HOME_ROOMS) {
      expect(room.options.filter((option) => option.correct)).toHaveLength(1)
      expect(room.prompt).toMatch(/test|Separate|physical/i)
    }
  })

  it('keeps failed paradise tests fail-forward while making lost time legible', () => {
    const oneWrong = ['fixed-shadow', 'perfect-child', 'wave-repeat']
    const result = falseHomeOutcome(oneWrong)
    expect(result.success).toBe(true)
    expect(result.externalYears).toBeGreaterThan(9)
    expect(result.mistakes).toBe(1)
    const interlude = ACT_THREE_CODA_INTERLUDES['interlude-27']
    expect(interlude.recap).toContain('Calypso')
    expect(interlude.situation.join(' ')).toContain('Years have passed outside')
    expect(calypsoElapsedYears(stateWith({ evidence: ['calypso-years:13', 'calypso-extra-years:4'] }))).toBe(17)
  })

  it('defines the exit through other wills and consequences, not originality or command power', () => {
    const outward = IDENTITY_GATES.map((gate) => gate.options.find((option) => option.outward)?.id ?? '')
    expect(outward).toEqual(['real-elara', 'spoken-record', 'carried-consequence'])
    expect(identityExitOutcome(outward)).toMatchObject({ integrity: 3, copyFidelity: 3, success: true })
    expect(identityExitOutcome(['unchanging-house', 'merciful-rewrite', 'command-authority'])).toMatchObject({ integrity: 0, copyFidelity: 6, success: false })
  })

  it('uses the actual dead companion without allowing the dead to re-enter as a witness', () => {
    const game = stateWith({
      evidence: ['last-companion:helen-morozova'],
      characters: { 'helen-morozova': { status: 'dead', injuries: [] } },
    })
    const waking = calypsoWakingScene(game).lines.map((line) => line.text).join(' ')
    const offer = immortalityOfferScene(game).lines.map((line) => line.text).join(' ')
    const welcome = phaeacianWelcomeScene(game)
    expect(waking).toContain('Helen Morozova')
    expect(offer).toContain('Helen Morozova')
    expect(welcome.lines.some((line) => line.speaker === 'helen-morozova')).toBe(false)
    expect(welcome.lines.some((line) => line.speaker === 'gabriel-cross')).toBe(true)
  })

  it('makes a second Vale inevitable while leaving the player control over its moral inheritance', () => {
    const game = stateWith({ evidence: ['identity-integrity:3'] })
    const scene = departureTermsScene(game)
    expect(scene.lines.map((line) => line.text).join(' ')).toContain('remaining model')
    expect(scene.choices?.map((choice) => choice.id)).toEqual(['leave-copy-the-truth', 'bargain-for-future-contact', 'break-the-preserve-door'])
    for (const choice of scene.choices ?? []) expect(choice.detail.length).toBeGreaterThan(75)
  })

  it('builds testimony from actual campaign records rather than generic morality labels', () => {
    const game = stateWith({
      flags: ['helios-remnant-preserved', 'last-companion-record-preserved'],
      evidence: ['complete-gate-testimony', 'scylla-rescued:SATO,VEGA,TAMSIN', 'hunger-casualties:7', 'last-companion:lena-mori'],
    })
    const chapters = accountChapters(game)
    expect(chapters).toHaveLength(4)
    expect(chapters[0].evidence).toContain('Archive')
    expect(chapters[1].evidence).toContain('SATO, VEGA, TAMSIN')
    expect(chapters[1].evidence).toContain('7')
    expect(chapters[2].evidence).toContain('remnant survived')
    expect(chapters[3].evidence).toContain('Lena Mori')
  })

  it('preserves unconditional hospitality while making candor materially strengthen the defence', () => {
    const truthful = accountOutcome(['confess', 'confess', 'contextualize', 'confess'])
    const deceptive = accountOutcome(['omit', 'omit', 'omit', 'omit'])
    expect(truthful.candor).toBeGreaterThan(deceptive.candor)
    expect(truthful.escortStrength).toBeGreaterThan(deceptive.escortStrength)

    const honestGame = stateWith({ evidence: [`phaeacian-account:${truthful.candor}:${truthful.coherence}:${truthful.escortStrength}`] })
    const deceptiveGame = stateWith({ evidence: [`phaeacian-account:${deceptive.candor}:${deceptive.coherence}:${deceptive.escortStrength}`] })
    expect(phaeacianEscortStrength(honestGame)).toBe(truthful.escortStrength)
    expect(phaeacianCombatConfig(honestGame).enemyInterval).toBeGreaterThan(phaeacianCombatConfig(deceptiveGame).enemyInterval ?? 0)
    expect(hospitalityVerdictScene(deceptiveGame).lines.map((line) => line.text).join(' ')).toContain('law still carries the stranger home')
  })

  it('protects the sanctuary vessel while allowing convoy defence to complete', () => {
    const config = phaeacianCombatConfig(stateWith({ evidence: ['phaeacian-account:8:4:5'] }))
    const sanctuary = config.targets.find((target) => target.id === 'sanctuary-vessel')
    expect(sanctuary?.protected).toBe(true)
    expect(sanctuary?.role).toContain('CIVILIANS')
    expect(config.objective).toContain('civilian sanctuary shields')
    const live = config.targets.map((target) => ({ ...target, currentHp: target.protected ? target.hp : 0 })) as LiveCombatTarget[]
    expect(combatObjectiveComplete(live, config.mode)).toBe(true)
  })

  it('paces revelation before choice and keeps the identity copy in the future story', () => {
    const game = stateWith({ evidence: ['calypso-years:17', 'identity-integrity:2', 'last-companion:kiara-ndala'] })
    const scenes = [calypsoWakingScene(game), immortalityOfferScene(game), yearsOutsideScene(game), departureTermsScene(game), phaeacianWelcomeScene(game), hospitalityVerdictScene(game)]
    for (const scene of scenes) expect(scene.lines).toHaveLength(6)
    expect(yearsOutsideScene(game).lines.map((line) => line.text).join(' ')).toContain('17 years')
    const order = ['interlude-26', 'b26-waking', 'b26-false-home', 'b26-offer', 'interlude-27', 'b27-years', 'b27-identity', 'b27-departure', 'interlude-28', 'b28-welcome', 'b28-account', 'b28-verdict', 'b28-combat', 'act-four-opening-complete']
    for (let index = 1; index < order.length; index++) expect(SLICE_SCREEN_IDS.indexOf(order[index - 1] as never)).toBeLessThan(SLICE_SCREEN_IDS.indexOf(order[index] as never))
  })

  it('ships nine distinct final assets and an explicit short-laptop composition', () => {
    const assets = ['calypso-shore.webp', 'calypso-false-home.webp', 'calypso-memory-maze.webp', 'calypso-departure.webp', 'phaeacian-convoy.webp', 'phaeacian-council.webp', 'phaeacian-battle.webp']
    for (const name of assets) {
      const asset = join(process.cwd(), 'public/assets/cinematics', name)
      expect(existsSync(asset)).toBe(true)
      expect(statSync(asset).size).toBeGreaterThan(75_000)
    }
    for (const name of ['calypso.webp', 'speaker-nausica.webp']) expect(statSync(join(process.cwd(), 'public/assets/portraits', name)).size).toBeGreaterThan(50_000)
    const css = readFileSync(join(process.cwd(), 'src/ui/styles.css'), 'utf8')
    expect(css).toContain('@media(max-height:850px) and (min-width:801px)')
    expect(css).toContain('.memory-options button,.identity-gates button{min-height:112px')
    expect(css).toContain('@media(max-height:700px) and (min-width:801px)')
  })

  it('briefs each beat with causal context, danger and a concrete objective', () => {
    for (const interlude of Object.values(ACT_THREE_CODA_INTERLUDES)) {
      expect(interlude.recap.length).toBeGreaterThan(200)
      expect(interlude.situation).toHaveLength(3)
      expect(interlude.situation.every((item) => item.length > 65)).toBe(true)
      expect(interlude.objective.length).toBeGreaterThan(90)
    }
  })
})
