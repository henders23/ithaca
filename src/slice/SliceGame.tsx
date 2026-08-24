import { useEffect, useMemo, useState } from 'react'
import type { CampaignEffect, GameState } from '../state/types.js'
import { createInitialState } from '../state/initial.js'
import { reduceGame } from '../state/reducer.js'
import { CinematicCombat, type CombatConfig } from './CinematicCombat.js'
import { ASSETS, DIALOGUE_SCENES, INTERLUDES, type DialogueChoice, type SliceScreenId } from './content.js'
import { BeatInterlude } from './BeatInterlude.js'
import { DialogueScene } from './DialogueScene.js'
import { CircuitGame, MemoryGame, PowerGridGame, ShuttleChaseGame, TriageGame } from './MiniGames.js'

const SAVE_KEY = 'ithaca-vertical-slice-v1'

export const SLICE_SCREEN_IDS: readonly SliceScreenId[] = [
  'title', 'prologue', 'b1-briefing', 'b1-combat', 'b1-collapse', 'interlude-02',
  'b2-grid', 'b2-triage', 'b2-accounting', 'interlude-03', 'b3-arrival', 'b3-memory',
  'b3-choice', 'b3-chase', 'b3-aftermath', 'interlude-04', 'b4-contact', 'b4-circuit',
  'b4-combat', 'complete',
]

export const VERTICAL_SLICE_BEATS = [
  '01-burning-tide-gate',
  '02-wrong-stars',
  '03-garden-forgetting',
  '04-one-eyed-fortress',
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
        return <CompletionScreen game={game} onRestart={startNew} />
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
      <footer><span>PLAYABLE VERTICAL SLICE</span><strong>BEATS 01—04</strong></footer>
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
      <div><span>SLICE</span><strong>{Math.min(4, completed + 1)} / 4</strong></div>
      <small>AUTOSAVED</small>
    </aside>
  )
}

function CompletionScreen({ game, onRestart }: { game: GameState; onRestart: () => void }) {
  const strongestTrust = Object.entries(game.relationships).sort(([, a], [, b]) => b - a)[0]
  return (
    <section className="completion-screen" style={{ '--complete-bg': `url(${ASSETS.cinematics.fortress})` } as React.CSSProperties}>
      <div className="completion-card">
        <p className="eyebrow">VERTICAL SLICE COMPLETE</p>
        <h1>The voyage has begun.</h1>
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
        <button className="secondary-action" onClick={onRestart}>Replay vertical slice</button>
      </div>
    </section>
  )
}
