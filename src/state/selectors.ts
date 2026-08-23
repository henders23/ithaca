import { CAMPAIGN_BEATS, beatById } from '../campaign/beats.js'
import type { CampaignBeat } from '../campaign/types.js'
import type { GameState, StoryFlag } from './types.js'

export function currentBeat(state: GameState): CampaignBeat | null {
  return beatById(state.campaign.currentBeatId)
}

export function campaignProgress(state: GameState): number {
  return state.campaign.completedBeatIds.length / CAMPAIGN_BEATS.length
}

export function hasFlag(state: GameState, flag: StoryFlag): boolean {
  return state.flags.includes(flag)
}

export function unresolvedMandatoryActivities(state: GameState): string[] {
  const beat = currentBeat(state)
  if (!beat) return []
  return beat.activities
    .filter((activity) => activity.mandatory && !state.campaign.completedActivityIds.includes(activity.id))
    .map((activity) => activity.id)
}

