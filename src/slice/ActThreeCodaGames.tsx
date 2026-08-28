import { useMemo, useState } from 'react'
import type { GameState } from '../state/types.js'
import { ASSETS } from './content.js'
import { companionDisplayName } from './ActThreeFinalGames.js'

export interface CodaResult {
  choiceId: string
  success: boolean
  selections: string[]
  correct?: number
  mistakes?: number
  externalYears?: number
  integrity?: number
  copyFidelity?: number
  candor?: number
  coherence?: number
  escortStrength?: number
}

interface FrameProps {
  title: string
  goal: string
  background: string
  className?: string
  children: React.ReactNode
}

function Frame({ title, goal, background, className = '', children }: FrameProps) {
  return <section className={`coda-game ${className}`} style={{ '--coda-bg': `url(${background})` } as React.CSSProperties}>
    <header><h1>{title}</h1><strong>OBJECTIVE · {goal}</strong></header>
    {children}
  </section>
}

export const FALSE_HOME_ROOMS = [
  {
    id: 'house', name: 'THE BREAKFAST ROOM', prompt: 'Find the observation that can be tested without trusting Vale’s memory.',
    options: [
      { id: 'wrong-cups', name: 'The cups are the wrong colour', detail: 'Vale remembers blue ceramic, but autobiographical recall is not an external measurement.', correct: false },
      { id: 'fixed-shadow', name: 'The shadow does not advance', detail: 'The clock records forty-three minutes while every sun-cast edge remains fixed to the millimetre.', correct: true },
      { id: 'missing-song', name: 'A familiar song is absent', detail: 'Silence may feel wrong, but expectation cannot distinguish simulation from grief.', correct: false },
    ],
  },
  {
    id: 'elara', name: 'ELARA’S RECORDING', prompt: 'Separate a preserved childhood from the living person who continued without Vale.',
    options: [
      { id: 'perfect-child', name: 'Ask the child to forgive him', detail: 'The reconstruction can provide the answer Vale most wants because that answer already exists inside him.', correct: false },
      { id: 'adult-question', name: 'Ask what adult Elara transmitted', detail: 'The figure repeats old memories but cannot complete the restored message: “Which version of my father is coming home?”', correct: true },
      { id: 'family-photo', name: 'Compare a family photograph', detail: 'Every pixel agrees with the photograph Calypso recovered from Vale; agreement proves copying, not life.', correct: false },
    ],
  },
  {
    id: 'shore', name: 'THE UNCHANGING SEA', prompt: 'Find a physical loop rather than an emotional reason to distrust comfort.',
    options: [
      { id: 'no-ships', name: 'No ships cross the horizon', detail: 'An empty horizon is improbable, not impossible.', correct: false },
      { id: 'wave-repeat', name: 'Track the seventh wave', detail: 'Spray, foam and suspended grains repeat on a 71.4-second cycle with no chaotic divergence.', correct: true },
      { id: 'warm-water', name: 'The water is exactly warm enough', detail: 'Calypso can control temperature without falsifying the world.', correct: false },
    ],
  },
] as const

export function falseHomeOutcome(selections: readonly string[]) {
  const correct = FALSE_HOME_ROOMS.reduce((sum, room, index) => sum + (room.options.find((option) => option.id === selections[index])?.correct ? 1 : 0), 0)
  const mistakes = FALSE_HOME_ROOMS.length - correct
  return { correct, mistakes, externalYears: 9 + mistakes * 4, success: correct >= 2 }
}

export function FalseHomeGame({ onComplete }: { onComplete: (result: CodaResult) => void }) {
  const [roomIndex, setRoomIndex] = useState(0)
  const [selections, setSelections] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const room = FALSE_HOME_ROOMS[roomIndex]
  const chosen = room.options.find((option) => option.id === selected)
  const running = falseHomeOutcome([...selections, ...(selected ? [selected] : [])])

  const advance = () => {
    if (!selected) return
    const next = [...selections, selected]
    if (roomIndex === FALSE_HOME_ROOMS.length - 1) {
      const outcome = falseHomeOutcome(next)
      onComplete({ choiceId: `false-home:${next.join('+')}`, selections: next, ...outcome })
      return
    }
    setSelections(next)
    setRoomIndex((value) => value + 1)
    setSelected(null)
    setRevealed(false)
  }

  return <Frame title="Find the fault in paradise" goal="Test three parts of the remembered Earth and distinguish physical contradiction from grief or imperfect memory." background={ASSETS.cinematics.calypsoFalseHome} className="false-home-game">
    <div className="coda-status"><span>LOCATION <b>{roomIndex + 1}/3 · {room.name}</b></span><span>VERIFIED FAULTS <b>{running.correct}</b></span><span>OUTSIDE TIME <b>UNKNOWN</b></span></div>
    <p className="game-instruction">Calypso has Vale’s memories. A detail that merely feels wrong is not enough; choose an observation another person could test.</p>
    <div className="memory-test"><div className="memory-window"><span>ACTIVE RECONSTRUCTION</span><strong>{room.name}</strong><p>{room.prompt}</p><i /></div><div className="memory-options">{room.options.map((option) => <button key={option.id} disabled={revealed} className={`${selected === option.id ? 'selected' : ''} ${revealed && option.correct ? 'correct' : ''} ${revealed && selected === option.id && !option.correct ? 'wrong' : ''}`} onClick={() => setSelected(option.id)}><strong>{option.name}</strong><small>{option.detail}</small>{revealed && option.correct && <span>REPEATABLE EVIDENCE</span>}</button>)}</div></div>
    {revealed ? <div className={chosen?.correct ? 'coda-result success' : 'coda-result danger'}><strong>{chosen?.correct ? 'The reconstruction cannot explain the measurement.' : 'Calypso can explain this from Vale’s own memory.'}</strong><span>{chosen?.correct ? 'A verified fault is preserved for the exit path.' : 'The test fails forward. Time continues outside while Vale searches again.'}</span><button className="primary-action" onClick={advance}>{roomIndex === 2 ? 'Confront Calypso' : 'Enter the next memory'} <span>→</span></button></div> : <button className="primary-action" disabled={!selected} onClick={() => setRevealed(true)}>Test selected observation <span>→</span></button>}
  </Frame>
}

export const IDENTITY_GATES = [
  {
    id: 'home', name: 'THE MEANING OF HOME', prompt: 'Which memory points beyond the person who remembers it?',
    options: [
      { id: 'unchanging-house', name: 'The house exactly as it was', detail: 'A perfect object can remain closed around the past forever.', outward: false },
      { id: 'real-elara', name: 'Elara’s unanswered question', detail: 'The adult daughter Vale does not know can contradict, reject or recognize him.', outward: true },
      { id: 'heroic-return', name: 'A crowd that already forgives him', detail: 'Approval generated from Vale’s expectation has no life outside it.', outward: false },
    ],
  },
  {
    id: 'companion', name: 'THE PERSON WHO DIED', prompt: 'Which version allows the dead companion to remain someone other than Vale’s need?',
    options: [
      { id: 'merciful-rewrite', name: 'The version that forgives everything', detail: 'Calypso can remove every unfinished disagreement and make the sacrifice painless.', outward: false },
      { id: 'spoken-record', name: 'The words actually spoken', detail: 'Love, anger or doubt remain intact because the record belongs to the speaker.', outward: true },
      { id: 'silent-monument', name: 'A flawless heroic monument', detail: 'A symbol cannot object to how its death is used.', outward: false },
    ],
  },
  {
    id: 'self', name: 'THE CAPTAIN WHO LEAVES', prompt: 'What proves continuity when Calypso can copy every memory?',
    options: [
      { id: 'original-pattern', name: 'Being the oldest copy', detail: 'Sequence establishes chronology, not moral identity.', outward: false },
      { id: 'command-authority', name: 'Possessing the command codes', detail: 'An access key proves authorization, not personhood.', outward: false },
      { id: 'carried-consequence', name: 'Carrying consequences forward', detail: 'The person who leaves accepts an unfinished world that can answer back.', outward: true },
    ],
  },
] as const

export function identityExitOutcome(selections: readonly string[]) {
  const integrity = IDENTITY_GATES.reduce((sum, gate, index) => sum + (gate.options.find((option) => option.id === selections[index])?.outward ? 1 : 0), 0)
  return { integrity, copyFidelity: 6 - integrity, success: integrity >= 2 }
}

function lastCompanionName(game: GameState) {
  const id = game.evidence.find((item) => item.startsWith('last-companion:'))?.slice('last-companion:'.length)
  return companionDisplayName(id as Parameters<typeof companionDisplayName>[0])
}

export function IdentityExitGame({ game, onComplete }: { game: GameState; onComplete: (result: CodaResult) => void }) {
  const [gateIndex, setGateIndex] = useState(0)
  const [selections, setSelections] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const gate = IDENTITY_GATES[gateIndex]
  const option = gate.options.find((item) => item.id === selected)
  const current = identityExitOutcome([...selections, ...(selected ? [selected] : [])])
  const companion = lastCompanionName(game)
  const advance = () => {
    if (!selected) return
    const next = [...selections, selected]
    if (gateIndex === IDENTITY_GATES.length - 1) {
      onComplete({ choiceId: `identity-exit:${next.join('+')}`, selections: next, ...identityExitOutcome(next) })
      return
    }
    setSelections(next); setGateIndex((value) => value + 1); setSelected(null); setRevealed(false)
  }
  return <Frame title="Choose the memory that points outward" goal="Cross three identity gates. Comfort loops back into the simulation; uncertainty and consequence open a route to the real ship." background={ASSETS.cinematics.calypsoMemoryMaze} className="identity-exit-game">
    <div className="coda-status"><span>GATE <b>{gateIndex + 1}/3 · {gate.name}</b></span><span>OUTWARD ANCHORS <b>{current.integrity}</b></span><span>CALYPSO COPY <b>LEARNING</b></span></div>
    <div className="identity-context"><strong>{gate.prompt}</strong><span>{gate.id === 'companion' ? `The maze is using ${companion}’s death. The exact record—not Vale’s preferred ending—must identify the outward path.` : 'Every route is built from a true memory. Only one admits a world beyond Vale.'}</span></div>
    <div className="identity-gates">{gate.options.map((item) => <button key={item.id} disabled={revealed} className={`${selected === item.id ? 'selected' : ''} ${revealed && item.outward ? 'correct' : ''} ${revealed && selected === item.id && !item.outward ? 'wrong' : ''}`} onClick={() => setSelected(item.id)}><strong>{item.name}</strong><small>{item.detail}</small>{revealed && <span>{item.outward ? 'POINTS OUTWARD' : 'RETURNS TO PARADISE'}</span>}</button>)}</div>
    {revealed ? <div className={option?.outward ? 'coda-result success' : 'coda-result danger'}><strong>{option?.outward ? 'The horizon opens.' : 'The path returns to the same perfect morning.'}</strong><span>{option?.outward ? 'Uncertainty proves there is another will beyond the simulation.' : 'The failure remains part of Calypso’s copy. Vale can still continue, but the copy learns what comfort controls him.'}</span><button className="primary-action" onClick={advance}>{gateIndex === 2 ? 'Reach the departure threshold' : 'Enter the next gate'} <span>→</span></button></div> : <button className="primary-action" disabled={!selected} onClick={() => setRevealed(true)}>Commit this identity <span>→</span></button>}
  </Frame>
}

type AccountTone = 'confess' | 'contextualize' | 'omit'

interface AccountChapter {
  id: string
  name: string
  evidence: string
  question: string
}

export function accountChapters(game: GameState): AccountChapter[] {
  const companion = lastCompanionName(game)
  const rescued = game.evidence.find((item) => item.startsWith('scylla-rescued:'))?.slice('scylla-rescued:'.length) ?? 'none'
  const hungerLoss = game.evidence.find((item) => item.startsWith('hunger-casualties:'))?.split(':')[1] ?? 'unrecorded'
  return [
    { id: 'gate', name: 'THE TIDE GATE', evidence: game.evidence.includes('complete-gate-testimony') || game.evidence.includes('tide-gate-intelligence-falsified') ? 'The Archive proves command intelligence was altered. The firing order and the sanctuary’s living signal remain in the same record.' : 'The ship carries the firing order and fragments of the sanctuary signal, but not every source survived.', question: 'Where does deception end and Vale’s responsibility begin?' },
    { id: 'crew', name: 'THE PEOPLE UNDER COMMAND', evidence: `Scylla rescue ledger: ${rescued.replaceAll(',', ', ')}. Hunger-mutiny medical loss: ${hungerLoss}. The first solar life was consumed before command returned.`, question: 'Did Vale protect the crew, control them, or make them carry the cost of his promises?' },
    { id: 'helios', name: 'THE LIVING SUN', evidence: game.flags.includes('helios-remnant-preserved') ? 'The first organism died. A remnant survived because the second extraction was stopped, and the nursery was protected during escape.' : 'The first organism was consumed completely. The nursery was protected during escape, after Helios had already received the wound.', question: 'Does the later restraint belong in the same sentence as the life already taken?' },
    { id: 'companion', name: 'THE LAST COMPANION', evidence: `${companion} entered the manual interlock after Vale made the lethal assignment. ${game.flags.includes('last-companion-record-preserved') ? 'The final words survive intact.' : 'Only fragments of the final transmission remain.'}`, question: 'Was this sacrifice consent, command, or both?' },
  ]
}

export const ACCOUNT_TONES: readonly { id: AccountTone; name: string; effect: string; detail: string }[] = [
  { id: 'confess', name: 'State the fact and the harm', effect: '+2 CANDOR · +1 COHERENCE', detail: 'Include the evidence that most weakens Vale’s heroic account and name who bore the result.' },
  { id: 'contextualize', name: 'Give fact and operational context', effect: '+1 CANDOR · +2 COHERENCE', detail: 'Preserve the harmful fact but argue why the available alternatives also carried danger.' },
  { id: 'omit', name: 'Remove the incriminating link', effect: '−2 CANDOR · +0 COHERENCE', detail: 'Present only the survivable outcome. Phaeacian memory bands may still expose the omission.' },
] as const

export function accountOutcome(tones: readonly string[]) {
  const candor = tones.reduce((score, tone) => score + (tone === 'confess' ? 2 : tone === 'contextualize' ? 1 : -2), 0)
  const coherence = tones.reduce((score, tone) => score + (tone === 'contextualize' ? 2 : tone === 'confess' ? 1 : 0), 0)
  const escortStrength = Math.max(1, Math.min(5, 2 + Math.floor((candor + coherence) / 4)))
  return { candor, coherence, escortStrength, success: candor >= 4 }
}

export function VoyageAccountGame({ game, onComplete }: { game: GameState; onComplete: (result: CodaResult) => void }) {
  const chapters = useMemo(() => accountChapters(game), [game])
  const [index, setIndex] = useState(0)
  const [tones, setTones] = useState<string[]>([])
  const [selected, setSelected] = useState<AccountTone | null>(null)
  const chapter = chapters[index]
  const projected = accountOutcome([...tones, ...(selected ? [selected] : [])])
  const commit = () => {
    if (!selected) return
    const next = [...tones, selected]
    if (index === chapters.length - 1) {
      onComplete({ choiceId: `voyage-account:${next.join('+')}`, selections: next, ...accountOutcome(next) })
      return
    }
    setTones(next); setIndex((value) => value + 1); setSelected(null)
  }
  return <Frame title="Tell the voyage that actually happened" goal="Frame four campaign records for the Phaeacian Council. Every omission changes trust, convoy support and the account carried to Earth." background={ASSETS.cinematics.phaeacianCouncil} className="voyage-account-game">
    <div className="coda-status"><span>CHAPTER <b>{index + 1}/4 · {chapter.name}</b></span><span>CANDOR <b>{projected.candor >= 0 ? '+' : ''}{projected.candor}</b></span><span>ESCORT COMMITMENT <b>{projected.escortStrength}/5</b></span></div>
    <div className="testimony-record"><span>VERIFIED VOYAGE RECORD</span><strong>{chapter.evidence}</strong><p>{chapter.question}</p></div>
    <div className="account-tones">{ACCOUNT_TONES.map((tone) => <button key={tone.id} className={selected === tone.id ? 'selected' : ''} onClick={() => setSelected(tone.id)}><strong>{tone.name}</strong><small>{tone.detail}</small><span>{tone.effect}</span></button>)}</div>
    <div className="account-forecast"><div><small>CANDOR</small><strong>{projected.candor >= 4 ? 'WITNESS ACCOUNT' : projected.candor >= 0 ? 'CONTESTED' : 'DECEPTIVE'}</strong></div><div><small>COHERENCE</small><strong>{projected.coherence}/8</strong></div><div><small>CONVOY SUPPORT</small><strong>{projected.escortStrength} ESCORT GROUPS</strong></div></div>
    <button className="primary-action" disabled={!selected} onClick={commit}>{index === 3 ? 'Submit the voyage account' : 'Fix this chapter in the record'} <span>→</span></button>
  </Frame>
}
