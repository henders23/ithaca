import { useEffect, useMemo, useState } from 'react'
import type { CampaignEffect, GameState } from '../state/types.js'
import { createInitialState } from '../state/initial.js'
import { reduceGame } from '../state/reducer.js'
import { CinematicCombat, type CombatConfig } from './CinematicCombat.js'
import { ASSETS, DIALOGUE_SCENES, INTERLUDES, type DialogueChoice, type SliceScreenId } from './content.js'
import { BeatInterlude } from './BeatInterlude.js'
import { CrewRumourHub } from './CrewHub.js'
import { DialogueScene } from './DialogueScene.js'
import { CircuitGame, MemoryGame, PowerGridGame, ShuttleChaseGame, TriageGame } from './MiniGames.js'
import { AccessLogGame, PhaseCurrentGame, StormFlightGame, SystemSacrificeGame, TransponderCipherGame } from './SliceTwoGames.js'
import { nameConsequenceScene, nearHomeScene, sacrificeAftermathScene, SLICE_TWO_INTERLUDES, SLICE_TWO_SCENES, tidefatherSignalScene } from './sliceTwoContent.js'

const SAVE_KEY = 'ithaca-vertical-slice-v1'

export const SLICE_SCREEN_IDS: readonly SliceScreenId[] = [
  'title', 'prologue', 'b1-briefing', 'b1-combat', 'b1-collapse', 'interlude-02',
  'b2-grid', 'b2-triage', 'b2-accounting', 'interlude-03', 'b3-arrival', 'b3-memory',
  'b3-choice', 'b3-chase', 'b3-aftermath', 'interlude-04', 'b4-contact', 'b4-circuit',
  'b4-combat', 'complete',
  'interlude-05', 'b5-aftermath', 'b5-cipher', 'b5-name', 'b5-consequence',
  'interlude-06', 'b6-signal', 'b6-memories', 'b6-combat', 'b6-sacrifice', 'b6-aftermath',
  'interlude-07', 'b7-arrival', 'b7-negotiation', 'b7-current', 'b7-flight', 'b7-departure',
  'interlude-08', 'b8-rumours', 'b8-near-home', 'b8-rupture', 'b8-log', 'b8-judgment',
  'act-one-complete',
]

export const VERTICAL_SLICE_BEATS = [
  '01-burning-tide-gate',
  '02-wrong-stars',
  '03-garden-forgetting',
  '04-one-eyed-fortress',
  '05-captain-gives-name',
  '06-first-wrath',
  '07-keeper-of-winds',
  '08-forbidden-sphere',
] as const

interface SliceSave {
  screen: SliceScreenId
  game: GameState
  savedAt: string
}

function loadSave(): SliceSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SliceSave
    if (!SLICE_SCREEN_IDS.includes(parsed.screen) || parsed.game.schemaVersion !== 1) return null
    return parsed
  } catch {
    return null
  }
}

export function SliceGame() {
  const [savedGame, setSavedGame] = useState<SliceSave | null>(() => loadSave())
  const [screen, setScreen] = useState<SliceScreenId>('title')
  const [game, setGame] = useState<GameState>(() => savedGame?.game ?? createInitialState('ithaca-vertical-slice'))

  useEffect(() => {
    if (screen === 'title' || game.campaign.status === 'not-started') return
    const save: SliceSave = { screen, game, savedAt: new Date().toISOString() }
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
    setSavedGame(save)
  }, [game, screen])

  const startNew = () => {
    const started = reduceGame(createInitialState('ithaca-vertical-slice'), { type: 'campaign/started' }).state
    setGame(started)
    setScreen('prologue')
  }

  const resume = () => {
    if (!savedGame) return
    setGame(savedGame.game)
    setScreen(savedGame.screen)
  }

  const completeActivity = (
    beatId: string,
    activityId: string,
    nextScreen: SliceScreenId,
    choiceId?: string,
    effects: CampaignEffect[] = [],
    finishBeat = false,
  ) => {
    setGame((current) => {
      let next = reduceGame(current, { type: 'activity/completed', beatId, activityId, choiceId, effects }).state
      if (finishBeat) next = reduceGame(next, { type: 'beat/completed', beatId }).state
      return next
    })
    setScreen(nextScreen)
  }

  const finishBeat = (beatId: string, nextScreen: SliceScreenId) => {
    setGame((current) => reduceGame(current, { type: 'beat/completed', beatId }).state)
    setScreen(nextScreen)
  }

  const chooseGateOrder = (choice: DialogueChoice) => {
    const effects: CampaignEffect[] = choice.id === 'scan-before-firing'
      ? [{ kind: 'set-flag', flag: 'tide-gate-scanned' }, { kind: 'relationship', character: 'helen-morozova', delta: 2 }, { kind: 'pursuit', delta: 4 }]
      : choice.id === 'fire-immediately'
        ? [{ kind: 'relationship', character: 'gabriel-cross', delta: 2 }, { kind: 'relationship', character: 'helen-morozova', delta: -2 }, { kind: 'pursuit', delta: 12 }]
        : [{ kind: 'relationship', character: 'gabriel-cross', delta: 1 }, { kind: 'relationship', character: 'helen-morozova', delta: 1 }, { kind: 'pursuit', delta: 8 }]
    completeActivity('01-burning-tide-gate', 'incomplete-intelligence', 'b1-combat', choice.id, effects)
  }

  const chooseName = (choice: DialogueChoice) => {
    const effects: CampaignEffect[] = choice.id === 'give-real-name'
      ? [{ kind: 'set-flag', flag: 'vale-revealed-name' }, { kind: 'relationship', character: 'gabriel-cross', delta: 2 }, { kind: 'relationship', character: 'elias', delta: -1 }, { kind: 'pursuit', delta: 18 }]
      : choice.id === 'use-forged-name'
        ? [{ kind: 'set-flag', flag: 'vale-used-false-identity' }, { kind: 'relationship', character: 'helen-morozova', delta: -1 }, { kind: 'relationship', character: 'elias', delta: -1 }, { kind: 'pursuit', delta: 5 }]
        : choice.id === 'confess-the-gate'
          ? [{ kind: 'set-flag', flag: 'vale-revealed-name' }, { kind: 'set-flag', flag: 'vale-questioned-orders' }, { kind: 'relationship', character: 'helen-morozova', delta: 2 }, { kind: 'relationship', character: 'kiara-ndala', delta: 1 }, { kind: 'pursuit', delta: 15 }]
          : [{ kind: 'relationship', character: 'helen-morozova', delta: 1 }, { kind: 'pursuit', delta: 9 }]
    completeActivity('05-captain-gives-name', 'name-the-captain', 'b5-consequence', choice.id, effects, true)
  }

  const answerTidefather = (choice: DialogueChoice) => {
    const effects: CampaignEffect[] = [
      { kind: 'set-flag', flag: 'tidefather-memories-witnessed' },
      ...(choice.id === 'apologize' ? [{ kind: 'relationship', character: 'helen-morozova', delta: 2 } as CampaignEffect, { kind: 'relationship', character: 'kiara-ndala', delta: 1 } as CampaignEffect]
        : choice.id === 'justify-order' ? [{ kind: 'relationship', character: 'gabriel-cross', delta: 1 } as CampaignEffect, { kind: 'relationship', character: 'helen-morozova', delta: -2 } as CampaignEffect]
          : choice.id === 'accuse-intelligence' ? [{ kind: 'add-evidence', evidenceId: 'vale-names-falsified-intelligence' } as CampaignEffect]
            : [{ kind: 'relationship', character: 'elias', delta: 1 } as CampaignEffect]),
    ]
    completeActivity('06-first-wrath', 'memories-of-the-dead', 'b6-combat', choice.id, effects)
  }

  const negotiateWithKeeper = (choice: DialogueChoice) => {
    const effects: CampaignEffect[] = choice.id === 'tell-keeper-truth'
      ? [{ kind: 'relationship', character: 'helen-morozova', delta: 2 }, { kind: 'relationship', character: 'kiara-ndala', delta: 2 }, { kind: 'add-evidence', evidenceId: 'aeolia-heard-complete-gate-record' }]
      : choice.id === 'conceal-sanctuary'
        ? [{ kind: 'relationship', character: 'helen-morozova', delta: -2 }, { kind: 'relationship', character: 'elias', delta: -1 }, { kind: 'pursuit', delta: -2 }]
        : [{ kind: 'relationship', character: 'gabriel-cross', delta: 1 }, { kind: 'relationship', character: 'kiara-ndala', delta: -1 }]
    completeActivity('07-keeper-of-winds', 'keeper-negotiation', 'b7-current', choice.id, effects)
  }

  const judgeMutiny = (choice: DialogueChoice) => {
    const effects: CampaignEffect[] = choice.id === 'forgive-conspirators'
      ? [{ kind: 'set-flag', flag: 'mutiny-leader-forgiven' }, { kind: 'relationship', character: 'isabella-corelli', delta: 2 }, { kind: 'relationship', character: 'gabriel-cross', delta: -2 }]
      : choice.id === 'punish-opener'
        ? [{ kind: 'set-flag', flag: 'mutiny-leader-punished' }, { kind: 'relationship', character: 'gabriel-cross', delta: 2 }, { kind: 'relationship', character: 'isabella-corelli', delta: -2 }]
        : choice.id === 'accept-command-blame'
          ? [{ kind: 'set-flag', flag: 'mutiny-leader-forgiven' }, { kind: 'set-flag', flag: 'vale-questioned-orders' }, { kind: 'relationship', character: 'helen-morozova', delta: 2 }, { kind: 'relationship', character: 'elias', delta: 2 }]
          : [{ kind: 'set-flag', flag: 'mutiny-leader-punished' }, { kind: 'relationship', character: 'gabriel-cross', delta: 1 }]
    completeActivity('08-forbidden-sphere', 'mutiny-judgment', 'act-one-complete', choice.id, effects, true)
  }

  const gateCombat = useMemo<CombatConfig>(() => ({
    beat: 'BEAT 01 · COMBAT',
    title: 'BREAK THE SANCTUARY SCREEN',
    objective: 'Destroy all three screen anchors',
    background: ASSETS.cinematics.title,
    playerShip: ASSETS.ships.ithaca,
    enemyShip: ASSETS.ships.eidolon,
    enemyName: 'Eidolon screen guardian',
    incomingLabel: 'Guardian pulse strikes the forward shields.',
    targets: [
      { id: 'anchor-a', name: 'Anchor Alpha', role: 'SCREEN EMITTER', hp: 2 },
      { id: 'anchor-b', name: 'Anchor Beta', role: 'SCREEN EMITTER', hp: 2 },
      { id: 'transit-core', name: 'Transit Core', role: 'PRIMARY OBJECTIVE', hp: 3 },
    ],
    playerHull: game.ship.hull,
    enemyInterval: game.flags.includes('tide-gate-scanned') ? 2200 : 2750,
  }), [game.flags, game.ship.hull])

  const argusCombat = useMemo<CombatConfig>(() => ({
    beat: 'BEAT 04 · COMBAT',
    title: 'ESCAPE THE DISMANTLING CRADLE',
    objective: 'Disable the locks and clear the exhaust channel',
    background: ASSETS.cinematics.fortressInterior,
    playerShip: ASSETS.ships.ithaca,
    enemyShip: ASSETS.ships.argus,
    enemyName: 'ARGUS recovery cutter',
    incomingLabel: 'Industrial cutting beam rakes the Ithaca’s armor.',
    targets: game.flags.includes('argus-awakened')
      ? [
          { id: 'lock-a', name: 'Cradle Lock A', role: 'RESTRAINT', hp: 2 },
          { id: 'lock-b', name: 'Cradle Lock B', role: 'RESTRAINT', hp: 2 },
          { id: 'cutter', name: 'Recovery Cutter', role: 'ACTIVE THREAT', hp: 3 },
          { id: 'eye', name: 'Sensor Relay', role: 'ALERTED', hp: 2 },
        ]
      : [
          { id: 'lock-a', name: 'Cradle Lock A', role: 'RESTRAINT', hp: 2 },
          { id: 'lock-b', name: 'Cradle Lock B', role: 'RESTRAINT', hp: 2 },
          { id: 'cutter', name: 'Recovery Cutter', role: 'BLINDED', hp: 2 },
        ],
    playerHull: game.ship.hull,
    enemyInterval: game.flags.includes('argus-awakened') ? 1750 : 2550,
  }), [game.flags, game.ship.hull])

  const tidefatherCombat = useMemo<CombatConfig>(() => ({
    beat: 'BEAT 06 · SURVIVAL',
    title: 'ENDURE THE FIRST WRATH',
    objective: 'Hold the Tidefather back until Mori opens a jump window',
    background: ASSETS.cinematics.tidefatherIntercept,
    playerShip: ASSETS.ships.ithaca,
    enemyShip: ASSETS.ships.tidefather,
    enemyName: 'Tidefather living dreadnought',
    incomingLabel: 'The Tidefather bends the Gate scar through Ithaca’s hull.',
    mode: 'survive',
    survivalSeconds: 28,
    victoryTitle: 'The jump window is open.',
    victoryText: 'You did not defeat the Tidefather. You survived long enough to choose what the Ithaca can leave behind.',
    targets: [
      { id: 'memory-loom', name: 'Memory Loom', role: 'INTRUSIVE SIGNAL', hp: 2 },
      { id: 'pursuit-tendril', name: 'Pursuit Tendril', role: 'DRIVE LOCK', hp: 3 },
      { id: 'weapon-bloom', name: 'Weapon Bloom', role: 'ACTIVE THREAT', hp: 2 },
    ],
    playerHull: game.ship.hull,
    enemyInterval: 2550,
  }), [game.ship.hull])

  const renderScreen = () => {
    switch (screen) {
      case 'title':
        return <TitleScreen hasSave={Boolean(savedGame)} onNew={startNew} onResume={resume} />
      case 'prologue':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES.prologue} onContinue={() => setScreen('b1-briefing')} />
      case 'b1-briefing':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b1-briefing']} onChoice={chooseGateOrder} />
      case 'b1-combat':
        return <CinematicCombat config={gateCombat} onComplete={(result) => completeActivity('01-burning-tide-gate', 'gate-assault', 'b1-collapse', 'screen-broken', [{ kind: 'damage-hull', amount: Math.max(0, game.ship.hull - result.hull) }])} />
      case 'b1-collapse':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b1-collapse']} onContinue={() => completeActivity('01-burning-tide-gate', 'gate-collapse', 'interlude-02', 'lost-in-transit', [{ kind: 'add-scar', scarId: 'tide-gate-burn' }, { kind: 'damage-system', system: 'engines', amount: 45 }, { kind: 'damage-system', system: 'sensors', amount: 30 }], true)} />
      case 'interlude-02':
        return <BeatInterlude data={INTERLUDES['interlude-02']} game={game} onContinue={() => setScreen('b2-grid')} />
      case 'b2-grid':
        return <PowerGridGame onComplete={(result) => {
          const effects: CampaignEffect[] = [
            ...(result.selected.includes('engines') ? [{ kind: 'repair-system', system: 'engines', amount: 12 } as CampaignEffect] : [{ kind: 'damage-hull', amount: 8 } as CampaignEffect]),
            ...(result.selected.includes('medical') ? [{ kind: 'repair-system', system: 'medical', amount: 10 } as CampaignEffect] : []),
            ...(result.selected.includes('sensors') ? [{ kind: 'repair-system', system: 'sensors', amount: 15 } as CampaignEffect] : []),
          ]
          completeActivity('02-wrong-stars', 'emergency-routing', 'b2-triage', result.choiceId, effects)
        }} />
      case 'b2-triage':
        return <TriageGame onComplete={(result) => {
          const effects: CampaignEffect[] = [
            { kind: 'relationship', character: 'isabella-corelli', delta: 1 },
            ...(result.selected.includes('reactor-team') ? [{ kind: 'repair-system', system: 'engines', amount: 8 } as CampaignEffect] : []),
            ...(result.selected.includes('pilot') ? [{ kind: 'add-evidence', evidenceId: 'amari-venn-survived' } as CampaignEffect] : []),
            ...(result.selected.includes('child') ? [{ kind: 'add-evidence', evidenceId: 'noah-serrin-survived' } as CampaignEffect] : []),
          ]
          completeActivity('02-wrong-stars', 'triage', 'b2-accounting', result.choiceId, effects)
        }} />
      case 'b2-accounting':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b2-accounting']} onChoice={(choice) => completeActivity('02-wrong-stars', 'first-accounting', 'interlude-03', choice.id, choice.id === 'share-the-record'
          ? [{ kind: 'set-flag', flag: 'vale-questioned-orders' }, { kind: 'relationship', character: 'helen-morozova', delta: 2 }, { kind: 'add-evidence', evidenceId: 'crew-received-gate-record' }]
          : [{ kind: 'relationship', character: 'helen-morozova', delta: -2 }, { kind: 'relationship', character: 'gabriel-cross', delta: 1 }], true)} />
      case 'interlude-03':
        return <BeatInterlude data={INTERLUDES['interlude-03']} game={game} onContinue={() => setScreen('b3-arrival')} />
      case 'b3-arrival':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b3-arrival']} onContinue={() => completeActivity('03-garden-forgetting', 'garden-welcome', 'b3-memory', 'accept-limited-hospitality', [{ kind: 'repair-hull', amount: 8 }])} />
      case 'b3-memory':
        return <MemoryGame onComplete={(result) => completeActivity('03-garden-forgetting', 'memory-fragments', 'b3-choice', result.choiceId, [{ kind: 'add-evidence', evidenceId: 'sato-memory-restored' }, { kind: 'relationship', character: 'isabella-corelli', delta: 1 }])} />
      case 'b3-choice':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b3-choice']} onChoice={(choice) => {
          if (choice.id === 'pursue-deserters') setScreen('b3-chase')
          else completeActivity('03-garden-forgetting', 'shuttle-pursuit', 'b3-aftermath', choice.id, [{ kind: 'set-flag', flag: 'deserters-left-in-peace' }, { kind: 'relationship', character: 'isabella-corelli', delta: 2 }])
        }} />
      case 'b3-chase':
        return <ShuttleChaseGame onComplete={(result) => completeActivity('03-garden-forgetting', 'shuttle-pursuit', 'b3-aftermath', result.choiceId, result.success
          ? [{ kind: 'set-flag', flag: 'deserters-forced-back' }, { kind: 'relationship', character: 'isabella-corelli', delta: -1 }, { kind: 'damage-hull', amount: Math.max(0, Math.round((100 - result.score) / 12)) }]
          : [{ kind: 'set-flag', flag: 'deserters-left-in-peace' }, { kind: 'damage-hull', amount: 10 }])} />
      case 'b3-aftermath':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b3-aftermath']} onContinue={() => finishBeat('03-garden-forgetting', 'interlude-04')} />
      case 'interlude-04':
        return <BeatInterlude data={INTERLUDES['interlude-04']} game={game} onContinue={() => setScreen('b4-contact')} />
      case 'b4-contact':
        return <DialogueScene key={screen} scene={DIALOGUE_SCENES['b4-contact']} onChoice={(choice) => completeActivity('04-one-eyed-fortress', 'salvage-dispute', 'b4-circuit', choice.id, choice.id === 'assert-personhood' ? [{ kind: 'relationship', character: 'helen-morozova', delta: 1 }] : [{ kind: 'relationship', character: 'lena-mori', delta: 1 }])} />
      case 'b4-circuit':
        return <CircuitGame onComplete={(result) => completeActivity('04-one-eyed-fortress', 'blind-the-eye', 'b4-combat', result.choiceId, result.success ? [] : [{ kind: 'set-flag', flag: 'argus-awakened' }, { kind: 'damage-system', system: 'shields', amount: 20 }])} />
      case 'b4-combat':
        return <CinematicCombat config={argusCombat} onComplete={(result) => completeActivity('04-one-eyed-fortress', 'fortress-breakout', 'complete', 'exhaust-channel-escape', [{ kind: 'damage-hull', amount: Math.max(0, game.ship.hull - result.hull) }, { kind: 'add-module', moduleId: 'argus-exhaust-key' }], true)} />
      case 'complete':
        return <CompletionScreen game={game} onRestart={startNew} onContinue={() => setScreen('interlude-05')} />
      case 'interlude-05':
        return <BeatInterlude data={SLICE_TWO_INTERLUDES['interlude-05']} game={game} onContinue={() => setScreen('b5-aftermath')} />
      case 'b5-aftermath':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b5-aftermath']} onContinue={() => setScreen('b5-cipher')} />
      case 'b5-cipher':
        return <TransponderCipherGame onComplete={(result) => completeActivity('05-captain-gives-name', 'transponder-cipher', 'b5-name', result.choiceId, result.success ? [] : [{ kind: 'pursuit', delta: 6 }])} />
      case 'b5-name':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b5-name']} onChoice={chooseName} />
      case 'b5-consequence':
        return <DialogueScene key={screen} scene={nameConsequenceScene(game)} onContinue={() => setScreen('interlude-06')} />
      case 'interlude-06':
        return <BeatInterlude data={SLICE_TWO_INTERLUDES['interlude-06']} game={game} onContinue={() => setScreen('b6-signal')} />
      case 'b6-signal':
        return <DialogueScene key={screen} scene={tidefatherSignalScene(game)} onContinue={() => setScreen('b6-memories')} />
      case 'b6-memories':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b6-memories']} onChoice={answerTidefather} />
      case 'b6-combat':
        return <CinematicCombat config={tidefatherCombat} onComplete={(result) => completeActivity('06-first-wrath', 'survive-tidefather', 'b6-sacrifice', 'jump-window-open', [{ kind: 'damage-hull', amount: Math.max(0, game.ship.hull - result.hull) }, { kind: 'pursuit', delta: 10 }])} />
      case 'b6-sacrifice':
        return <SystemSacrificeGame onComplete={(result) => completeActivity('06-first-wrath', 'sacrifice-system', 'b6-aftermath', result.choiceId, [{ kind: 'damage-system', system: result.system, amount: 100 }, { kind: 'add-scar', scarId: `${result.system}-severance` }, { kind: 'relationship', character: 'lena-mori', delta: -1 }], true)} />
      case 'b6-aftermath':
        return <DialogueScene key={screen} scene={sacrificeAftermathScene(game)} onContinue={() => setScreen('interlude-07')} />
      case 'interlude-07':
        return <BeatInterlude data={SLICE_TWO_INTERLUDES['interlude-07']} game={game} onContinue={() => setScreen('b7-arrival')} />
      case 'b7-arrival':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b7-arrival']} onContinue={() => setScreen('b7-negotiation')} />
      case 'b7-negotiation':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b7-negotiation']} onChoice={negotiateWithKeeper} />
      case 'b7-current':
        return <PhaseCurrentGame onComplete={(result) => completeActivity('07-keeper-of-winds', 'phase-current', 'b7-flight', result.choiceId, [{ kind: 'add-module', moduleId: 'aeolian-current-sphere' }, ...(result.success ? [] : [{ kind: 'pursuit', delta: 4 } as CampaignEffect])])} />
      case 'b7-flight':
        return <StormFlightGame onComplete={(result) => completeActivity('07-keeper-of-winds', 'storm-flight', 'b7-departure', result.choiceId, result.success ? [{ kind: 'repair-hull', amount: 5 }] : [{ kind: 'damage-hull', amount: 9 }, { kind: 'damage-system', system: 'engines', amount: 8 }], true)} />
      case 'b7-departure':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b7-departure']} onContinue={() => setScreen('interlude-08')} />
      case 'interlude-08':
        return <BeatInterlude data={SLICE_TWO_INTERLUDES['interlude-08']} game={game} onContinue={() => setScreen('b8-rumours')} />
      case 'b8-rumours':
        return <CrewRumourHub onComplete={(result) => {
          const effects: CampaignEffect[] = result.choiceId === 'open-sphere-records'
            ? [{ kind: 'relationship', character: 'helen-morozova', delta: 2 }, { kind: 'relationship', character: 'elias', delta: 1 }, { kind: 'add-evidence', evidenceId: 'sphere-records-open-to-crew' }]
            : result.choiceId === 'tighten-security'
              ? [{ kind: 'relationship', character: 'gabriel-cross', delta: 2 }, { kind: 'relationship', character: 'isabella-corelli', delta: -1 }]
              : [{ kind: 'relationship', character: 'isabella-corelli', delta: 1 }, { kind: 'relationship', character: 'elias', delta: -1 }]
          completeActivity('08-forbidden-sphere', 'crew-suspicion', 'b8-near-home', result.choiceId, effects)
        }} />
      case 'b8-near-home':
        return <DialogueScene key={screen} scene={nearHomeScene(game)} onContinue={() => setScreen('b8-rupture')} />
      case 'b8-rupture':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b8-rupture']} onContinue={() => setScreen('b8-log')} />
      case 'b8-log':
        return <AccessLogGame onComplete={(result) => completeActivity('08-forbidden-sphere', 'access-log', 'b8-judgment', result.choiceId, [{ kind: 'add-evidence', evidenceId: result.success ? 'sphere-conspiracy-reconstructed' : 'sphere-conspiracy-partial' }, { kind: 'add-scar', scarId: 'aeolian-current-burn' }, { kind: 'pursuit', delta: 16 }])} />
      case 'b8-judgment':
        return <DialogueScene key={screen} scene={SLICE_TWO_SCENES['b8-judgment']} onChoice={judgeMutiny} />
      case 'act-one-complete':
        return <ActOneCompletionScreen game={game} onRestart={startNew} />
    }
  }

  return (
    <main className="game-shell">
      {screen !== 'title' && <VoyageHud game={game} />}
      {renderScreen()}
    </main>
  )
}

function TitleScreen({ hasSave, onNew, onResume }: { hasSave: boolean; onNew: () => void; onResume: () => void }) {
  return (
    <section className="title-screen" style={{ '--title-bg': `url(${ASSETS.cinematics.title})` } as React.CSSProperties}>
      <div className="title-vignette" />
      <div className="title-copy">
        <p>AN AUTHORED SPACE ODYSSEY</p>
        <h1>ITHACA</h1>
        <h2>NO SHORE WILL RECEIVE YOU</h2>
        <div className="title-rule" />
        <p className="title-lede">A cinematic voyage of command, consequence, puzzles and ship-to-ship combat.</p>
        <div className="title-actions">
          <button className="primary-action" onClick={onNew}>Begin new voyage <span>→</span></button>
          {hasSave && <button className="secondary-action" onClick={onResume}>Continue voyage</button>}
        </div>
      </div>
      <footer><span>ACT I · PLAYABLE CAMPAIGN</span><strong>BEATS 01—08</strong></footer>
    </section>
  )
}

function VoyageHud({ game }: { game: GameState }) {
  const completed = game.campaign.completedBeatIds.filter((id) => VERTICAL_SLICE_BEATS.includes(id as typeof VERTICAL_SLICE_BEATS[number])).length
  return (
    <aside className="voyage-hud" aria-label="Voyage status">
      <div><span>CSV</span><strong>ITHACA</strong></div>
      <div><span>HULL</span><strong>{game.ship.hull}%</strong></div>
      <div><span>PURSUIT</span><strong>{game.pursuit}</strong></div>
      <div><span>ACT I</span><strong>{Math.min(8, completed + 1)} / 8</strong></div>
      <small>AUTOSAVED</small>
    </aside>
  )
}

function CompletionScreen({ game, onRestart, onContinue }: { game: GameState; onRestart: () => void; onContinue: () => void }) {
  const strongestTrust = Object.entries(game.relationships).sort(([, a], [, b]) => b - a)[0]
  return (
    <section className="completion-screen" style={{ '--complete-bg': `url(${ASSETS.cinematics.fortress})` } as React.CSSProperties}>
      <div className="completion-card">
        <p className="eyebrow">SLICE I COMPLETE · ACT I CONTINUES</p>
        <h1>The darkness is listening.</h1>
        <p>The Ithaca escaped ARGUS-1, but the fortress is broadcasting. Somewhere beyond the wrong stars, the thing that heard the Tide Gate die has learned where to look.</p>
        <div className="completion-stats">
          <div><span>HULL</span><strong>{game.ship.hull}%</strong></div>
          <div><span>DECISIONS</span><strong>{game.decisions.length}</strong></div>
          <div><span>STRONGEST TRUST</span><strong>{strongestTrust?.[0].split('-')[0].toUpperCase() ?? 'NONE'} {strongestTrust?.[1] ?? 0}</strong></div>
          <div><span>NEXT</span><strong>THE CAPTAIN GIVES HIS NAME</strong></div>
        </div>
        <div className="choice-recap">
          {game.decisions.slice(-5).map((decision) => <span key={decision.id}>{decision.choiceId.replaceAll('-', ' ')}</span>)}
        </div>
        <div className="completion-actions">
          <button className="primary-action" onClick={onContinue}>Continue to Beat 05 <span>→</span></button>
          <button className="secondary-action" onClick={onRestart}>Restart Act I</button>
        </div>
      </div>
    </section>
  )
}

function ActOneCompletionScreen({ game, onRestart }: { game: GameState; onRestart: () => void }) {
  const sacrifice = game.decisions.find((decision) => decision.activityId === 'sacrifice-system')?.choiceId.replaceAll('-', ' ') ?? 'a ship system'
  const judgment = game.decisions.find((decision) => decision.activityId === 'mutiny-judgment')?.choiceId.replaceAll('-', ' ') ?? 'judgment pending'
  return (
    <section className="completion-screen act-finale" style={{ '--complete-bg': `url(${ASSETS.cinematics.sphereRupture})` } as React.CSSProperties}>
      <div className="completion-card">
        <p className="eyebrow">ACT I COMPLETE · THE VICTORY THAT BECAME A CURSE</p>
        <h1>No shore will receive you.</h1>
        <p>The current is gone. The familiar stars have vanished, and the Tidefather can hear the wound it left in the Ithaca. Vale still commands—but the crew now knows that home, truth and survival will not always point in the same direction.</p>
        <div className="completion-stats">
          <div><span>HULL</span><strong>{game.ship.hull}%</strong></div>
          <div><span>PURSUIT</span><strong>{game.pursuit}</strong></div>
          <div><span>SACRIFICED</span><strong>{sacrifice.toUpperCase()}</strong></div>
          <div><span>JUDGMENT</span><strong>{judgment.toUpperCase()}</strong></div>
        </div>
        <div className="act-coda">
          <span>NEXT · ACT II</span>
          <strong>THE DEVOURING HARBOUR</strong>
          <p>A settlement has answered the distress call. Its docks are already closing behind the ships that entered first.</p>
        </div>
        <button className="secondary-action" onClick={onRestart}>Replay Act I</button>
      </div>
    </section>
  )
}
