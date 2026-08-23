import type { CharacterId } from '../canon/characters.js'
import type { FactionId } from '../canon/world.js'

export type ActNumber = 1 | 2 | 3 | 4

export type MinigameTemplate =
  | 'power-grid'
  | 'signal-alignment'
  | 'evidence-board'
  | 'navigation'
  | 'circuit-reconstruction'
  | 'hotspot-investigation'
  | 'resource-triage'
  | 'identity-maze'

export type CombatObjective =
  | 'destroy-targets'
  | 'survive'
  | 'escape'
  | 'protect'
  | 'disable'
  | 'scan'
  | 'hold-position'
  | 'boss-phases'

interface BaseActivity {
  id: string
  title: string
  mandatory: boolean
}

export interface DialogueActivity extends BaseActivity {
  kind: 'dialogue'
  focus: string
}

export interface HubActivity extends BaseActivity {
  kind: 'hub'
  focus: string
}

export interface MinigameActivity extends BaseActivity {
  kind: 'minigame'
  template: MinigameTemplate
  failureMode: 'consequence' | 'harder-combat' | 'lost-opportunity'
}

export interface CombatActivity extends BaseActivity {
  kind: 'combat'
  opponent: FactionId
  objective: CombatObjective
  conditional: boolean
  resumeDialogue: boolean
}

export interface CutsceneActivity extends BaseActivity {
  kind: 'cutscene'
  focus: string
}

export type CampaignActivity =
  | DialogueActivity
  | HubActivity
  | MinigameActivity
  | CombatActivity
  | CutsceneActivity

export interface CampaignBeat {
  id: string
  order: number
  act: ActNumber
  title: string
  odysseyEcho: string
  premise: string
  cast: readonly CharacterId[]
  locationKey: string
  activities: readonly CampaignActivity[]
}

