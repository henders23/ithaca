import { CAMPAIGN_BEATS, FIRST_BEAT, beatById, nextBeat } from '../campaign/beats.js'
import type { CampaignActivity } from '../campaign/types.js'
import { systemStatus } from './initial.js'
import type {
  CampaignEffect,
  GameAction,
  GameEvent,
  GameState,
  Transition,
} from './types.js'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function adjustRelationshipAxis(state: GameState, character: keyof GameState['relationshipDimensions'], axis: keyof GameState['relationshipDimensions'][keyof GameState['relationshipDimensions']], delta: number): GameState {
  const before = state.relationshipDimensions[character]
  return {
    ...state,
    relationshipDimensions: {
      ...state.relationshipDimensions,
      [character]: { ...before, [axis]: clamp(before[axis] + delta, -5, 5) },
    },
  }
}

function reject(state: GameState, reason: string): Transition {
  return { state, events: [{ type: 'action-rejected', reason }], accepted: false }
}

function applyEffect(state: GameState, effect: CampaignEffect): GameState {
  switch (effect.kind) {
    case 'set-flag':
      return state.flags.includes(effect.flag) ? state : { ...state, flags: [...state.flags, effect.flag] }
    case 'clear-flag':
      return { ...state, flags: state.flags.filter((flag) => flag !== effect.flag) }
    case 'relationship':
      return adjustRelationshipAxis({
        ...state,
        relationships: {
          ...state.relationships,
          [effect.character]: clamp(state.relationships[effect.character] + effect.delta, -5, 5),
        },
      }, effect.character, effect.delta >= 0 ? 'trust' : 'resentment', Math.abs(effect.delta))
    case 'relationship-axis':
      return adjustRelationshipAxis(state, effect.character, effect.axis, effect.delta)
    case 'pursuit':
      return { ...state, pursuit: clamp(state.pursuit + effect.delta, 0, 100) }
    case 'character-status':
      return {
        ...state,
        characters: {
          ...state.characters,
          [effect.character]: { ...state.characters[effect.character], status: effect.status },
        },
      }
    case 'damage-system':
    case 'repair-system': {
      const before = state.ship.systems[effect.system]
      const direction = effect.kind === 'damage-system' ? -1 : 1
      const integrity = clamp(before.integrity + direction * effect.amount, 0, 100)
      return {
        ...state,
        ship: {
          ...state.ship,
          systems: {
            ...state.ship.systems,
            [effect.system]: { integrity, status: systemStatus(integrity) },
          },
        },
      }
    }
    case 'damage-hull':
      return { ...state, ship: { ...state.ship, hull: clamp(state.ship.hull - effect.amount, 0, 100) } }
    case 'repair-hull':
      return { ...state, ship: { ...state.ship, hull: clamp(state.ship.hull + effect.amount, 0, 100) } }
    case 'add-evidence':
      return state.evidence.includes(effect.evidenceId)
        ? state
        : { ...state, evidence: [...state.evidence, effect.evidenceId] }
    case 'add-module':
      return state.ship.modules.includes(effect.moduleId)
        ? state
        : { ...state, ship: { ...state.ship, modules: [...state.ship.modules, effect.moduleId] } }
    case 'add-scar':
      return state.ship.scars.includes(effect.scarId)
        ? state
        : { ...state, ship: { ...state.ship, scars: [...state.ship.scars, effect.scarId] } }
    case 'set-ending':
      return { ...state, ending: effect.ending }
  }
}

function mandatoryActivities(beatId: string): CampaignActivity[] {
  return beatById(beatId)?.activities.filter((activity) => activity.mandatory) ?? []
}

function reduceAccepted(state: GameState, action: GameAction): Transition {
  switch (action.type) {
    case 'campaign/started': {
      if (state.campaign.status !== 'not-started') return reject(state, 'The campaign has already started.')
      return {
        state: {
          ...state,
          campaign: { ...state.campaign, status: 'playing', currentBeatId: FIRST_BEAT.id },
          actionLog: [...state.actionLog, action],
        },
        events: [{ type: 'campaign-started', beatId: FIRST_BEAT.id }],
        accepted: true,
      }
    }
    case 'dialogue/moment': {
      if (state.campaign.status !== 'playing') return reject(state, 'Dialogue memories can only be recorded during the voyage.')
      const id = `${action.sceneId}:${action.choiceId}`
      if (state.dialogueMemories.some((memory) => memory.id === id)) return reject(state, 'This dialogue moment has already been remembered.')
      let nextState = action.character && action.axis && action.delta
        ? adjustRelationshipAxis(state, action.character, action.axis, action.delta)
        : state
      nextState = {
        ...nextState,
        dialogueMemories: [...nextState.dialogueMemories, {
          id,
          sceneId: action.sceneId,
          choiceId: action.choiceId,
          label: action.label,
          character: action.character,
          axis: action.axis,
          delta: action.delta,
        }],
        actionLog: [...nextState.actionLog, action],
      }
      return {
        state: nextState,
        events: [{ type: 'dialogue-moment-recorded', sceneId: action.sceneId, choiceId: action.choiceId }],
        accepted: true,
      }
    }
    case 'activity/completed': {
      const beat = beatById(action.beatId)
      if (!beat || state.campaign.currentBeatId !== beat.id)
        return reject(state, 'The activity is not part of the current beat.')
      const activity = beat.activities.find((candidate) => candidate.id === action.activityId)
      if (!activity) return reject(state, 'The activity does not exist in this beat.')
      if (state.campaign.completedActivityIds.includes(activity.id))
        return reject(state, 'The activity has already been completed.')

      let nextState: GameState = state
      const events: GameEvent[] = []
      for (const effect of action.effects ?? []) {
        nextState = applyEffect(nextState, effect)
        events.push({ type: 'effect-applied', effect })
      }
      if (action.choiceId) {
        nextState = {
          ...nextState,
          decisions: [
            ...nextState.decisions,
            {
              id: `${action.beatId}:${action.activityId}:${nextState.decisions.length + 1}`,
              beatId: action.beatId,
              activityId: action.activityId,
              choiceId: action.choiceId,
            },
          ],
        }
      }
      nextState = {
        ...nextState,
        campaign: {
          ...nextState.campaign,
          completedActivityIds: [...nextState.campaign.completedActivityIds, activity.id],
        },
        actionLog: [...nextState.actionLog, action],
      }
      return {
        state: nextState,
        events: [...events, { type: 'activity-completed', beatId: beat.id, activityId: activity.id }],
        accepted: true,
      }
    }
    case 'beat/completed': {
      if (state.campaign.currentBeatId !== action.beatId)
        return reject(state, 'Only the current beat can be completed.')
      const beat = beatById(action.beatId)
      if (!beat) return reject(state, 'The current beat is not in the campaign registry.')
      const incomplete = mandatoryActivities(beat.id).filter(
        (activity) => !state.campaign.completedActivityIds.includes(activity.id),
      )
      if (incomplete.length > 0)
        return reject(state, `Mandatory activities remain: ${incomplete.map((item) => item.id).join(', ')}`)

      const following = nextBeat(beat.id)
      const status = following ? 'playing' : 'completed'
      return {
        state: {
          ...state,
          campaign: {
            status,
            currentBeatId: following?.id ?? null,
            completedBeatIds: [...state.campaign.completedBeatIds, beat.id],
            completedActivityIds: [],
          },
          actionLog: [...state.actionLog, action],
        },
        events: [{ type: 'beat-completed', beatId: beat.id, nextBeatId: following?.id ?? null }],
        accepted: true,
      }
    }
  }
}

export function reduceGame(state: GameState, action: GameAction): Transition {
  return reduceAccepted(state, action)
}

export function replayGame(initial: GameState, actions: readonly GameAction[]): GameState {
  return actions.reduce((state, action) => reduceGame(state, action).state, initial)
}

export function campaignActivityCount(): number {
  return CAMPAIGN_BEATS.reduce((total, beat) => total + beat.activities.length, 0)
}
