import { CHARACTER_IDS, RELATIONSHIP_IDS, type CharacterId, type RelationshipId } from '../canon/characters.js'
import { SHIP_SYSTEM_IDS, type CharacterState, type GameState, type RelationshipProfile, type ShipSystemId } from './types.js'

const characterState = (id: CharacterId): CharacterState => ({
  status: id === 'elara-vale' ? 'at-home' : id === 'alexander-vale' || id === 'helen-morozova' || id === 'gabriel-cross' || id === 'lena-mori' || id === 'isabella-corelli' || id === 'kiara-ndala' || id === 'elias'
    ? 'aboard'
    : 'offstage',
  injuries: [],
})

export function createInitialState(seed = 'ithaca'): GameState {
  const characters = Object.fromEntries(
    CHARACTER_IDS.map((id) => [id, characterState(id)]),
  ) as Record<CharacterId, CharacterState>

  const relationships = Object.fromEntries(
    RELATIONSHIP_IDS.map((id) => [id, 0]),
  ) as Record<RelationshipId, number>

  const relationshipDimensions = Object.fromEntries(
    RELATIONSHIP_IDS.map((id) => [id, { trust: 0, intimacy: 0, respect: 0, resentment: 0 } satisfies RelationshipProfile]),
  ) as Record<RelationshipId, RelationshipProfile>

  const systems = Object.fromEntries(
    SHIP_SYSTEM_IDS.map((id) => [id, { integrity: 100, status: 'online' }]),
  ) as GameState['ship']['systems']

  return {
    schemaVersion: 2,
    seed,
    campaign: {
      status: 'not-started',
      currentBeatId: null,
      completedBeatIds: [],
      completedActivityIds: [],
    },
    flags: [],
    relationships,
    relationshipDimensions,
    dialogueMemories: [],
    characters,
    ship: {
      hull: 100,
      fuel: 100,
      ordnance: 10,
      systems,
      modules: [],
      scars: [],
    },
    pursuit: 0,
    evidence: [],
    decisions: [],
    ending: null,
    actionLog: [],
  }
}

export function systemStatus(integrity: number): GameState['ship']['systems'][ShipSystemId]['status'] {
  if (integrity <= 0) return 'destroyed'
  if (integrity < 30) return 'offline'
  if (integrity < 70) return 'degraded'
  return 'online'
}
