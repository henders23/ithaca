import type { CharacterId, RelationshipId } from '../canon/characters.js'

export const STORY_FLAGS = [
  'tide-gate-scanned',
  'vale-questioned-orders',
  'deserters-forced-back',
  'deserters-left-in-peace',
  'argus-spared',
  'argus-awakened',
  'vale-revealed-name',
  'vale-used-false-identity',
  'tidefather-memories-witnessed',
  'mutiny-leader-forgiven',
  'mutiny-leader-punished',
  'harbour-convoy-warned',
  'harbour-convoy-abandoned',
  'cirene-treatment-accepted',
  'cirene-copies-recognized',
  'cirene-copies-destroyed',
  'cirene-allied',
  'cirene-betrayed',
  'refuge-vote-honoured',
  'archive-entered-violently',
  'archive-truth-recovered',
  'unburied-signal-freed',
  'unburied-signal-erased',
  'tiresias-warning-understood',
  'choir-route-extracted',
  'scylla-rescue-attempted',
  'six-abandoned',
  'helios-warning-understood',
  'helios-life-consumed',
  'mutiny-forgiven',
  'mutiny-condemned',
  'calypso-copy-created',
  'phaeacians-told-truth',
  'phaeacians-deceived',
  'elara-trusts-vale',
  'elara-opposes-vale',
  'tide-gate-crime-exposed',
] as const

export type StoryFlag = (typeof STORY_FLAGS)[number]

export const SHIP_SYSTEM_IDS = [
  'command',
  'engines',
  'weapons',
  'shields',
  'sensors',
  'medical',
  'communications',
] as const

export type ShipSystemId = (typeof SHIP_SYSTEM_IDS)[number]
export type CharacterStatus = 'aboard' | 'at-home' | 'offstage' | 'injured' | 'missing' | 'dead'
export type EndingId = 'vengeance' | 'atonement' | 'reconciliation' | 'exile' | 'succession'

export interface CharacterState {
  status: CharacterStatus
  injuries: string[]
}

export interface ShipSystemState {
  integrity: number
  status: 'online' | 'degraded' | 'offline' | 'destroyed'
}

export interface ShipState {
  hull: number
  fuel: number
  ordnance: number
  systems: Record<ShipSystemId, ShipSystemState>
  modules: string[]
  scars: string[]
}

export interface DecisionRecord {
  id: string
  beatId: string
  activityId: string
  choiceId: string
}

export type CampaignEffect =
  | { kind: 'set-flag'; flag: StoryFlag }
  | { kind: 'clear-flag'; flag: StoryFlag }
  | { kind: 'relationship'; character: RelationshipId; delta: number }
  | { kind: 'pursuit'; delta: number }
  | { kind: 'character-status'; character: CharacterId; status: CharacterStatus }
  | { kind: 'damage-system'; system: ShipSystemId; amount: number }
  | { kind: 'repair-system'; system: ShipSystemId; amount: number }
  | { kind: 'damage-hull'; amount: number }
  | { kind: 'repair-hull'; amount: number }
  | { kind: 'add-evidence'; evidenceId: string }
  | { kind: 'add-module'; moduleId: string }
  | { kind: 'add-scar'; scarId: string }
  | { kind: 'set-ending'; ending: EndingId }

export type GameAction =
  | { type: 'campaign/started' }
  | {
      type: 'activity/completed'
      beatId: string
      activityId: string
      choiceId?: string
      effects?: CampaignEffect[]
    }
  | { type: 'beat/completed'; beatId: string }

export interface GameState {
  schemaVersion: 1
  seed: string
  campaign: {
    status: 'not-started' | 'playing' | 'completed'
    currentBeatId: string | null
    completedBeatIds: string[]
    completedActivityIds: string[]
  }
  flags: StoryFlag[]
  relationships: Record<RelationshipId, number>
  characters: Record<CharacterId, CharacterState>
  ship: ShipState
  pursuit: number
  evidence: string[]
  decisions: DecisionRecord[]
  ending: EndingId | null
  actionLog: GameAction[]
}

export type GameEvent =
  | { type: 'campaign-started'; beatId: string }
  | { type: 'activity-completed'; beatId: string; activityId: string }
  | { type: 'beat-completed'; beatId: string; nextBeatId: string | null }
  | { type: 'effect-applied'; effect: CampaignEffect }
  | { type: 'action-rejected'; reason: string }

export interface Transition {
  state: GameState
  events: GameEvent[]
  accepted: boolean
}
