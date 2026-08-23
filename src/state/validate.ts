import { CANON_CHARACTERS, CHARACTER_IDS } from '../canon/characters.js'
import { FACTION_IDS, SHIP } from '../canon/world.js'
import { CAMPAIGN_BEATS } from '../campaign/beats.js'

export interface ValidationReport {
  valid: boolean
  errors: string[]
}

export function validateCanon(): ValidationReport {
  const errors: string[] = []
  const ids = CANON_CHARACTERS.map((character) => character.id)
  if (new Set(ids).size !== ids.length) errors.push('Character IDs must be unique.')
  if (!ids.includes('alexander-vale')) errors.push('Alexander Vale must remain the canonical captain.')
  if (SHIP.name !== 'CSV Ithaca') errors.push('The canonical ship must be the CSV Ithaca.')
  if (CANON_CHARACTERS.filter((character) => character.playable).length !== 2)
    errors.push('Exactly Vale and Elara must be marked playable in Part 1.')
  return { valid: errors.length === 0, errors }
}

export function validateCampaign(): ValidationReport {
  const errors: string[] = []
  if (CAMPAIGN_BEATS.length !== 32) errors.push('The story campaign must contain exactly 32 beats.')

  const beatIds = CAMPAIGN_BEATS.map((beat) => beat.id)
  if (new Set(beatIds).size !== beatIds.length) errors.push('Beat IDs must be unique.')

  CAMPAIGN_BEATS.forEach((beat, index) => {
    if (beat.order !== index + 1) errors.push(`Beat ${beat.id} has non-sequential order ${beat.order}.`)
    if (Array.from(beat.activities).length === 0) errors.push(`Beat ${beat.id} has no activities.`)
    if (new Set(beat.activities.map((activity) => activity.id)).size !== beat.activities.length)
      errors.push(`Beat ${beat.id} contains duplicate activity IDs.`)
    for (const character of beat.cast) {
      if (!CHARACTER_IDS.includes(character)) errors.push(`Beat ${beat.id} references unknown character ${character}.`)
    }
    for (const activity of beat.activities) {
      if (activity.kind === 'combat' && !FACTION_IDS.includes(activity.opponent))
        errors.push(`Beat ${beat.id} references unknown opponent ${activity.opponent}.`)
    }
  })

  const actCounts = [1, 2, 3, 4].map((act) => CAMPAIGN_BEATS.filter((beat) => beat.act === act).length)
  if (actCounts.join(',') !== '8,9,10,5') errors.push(`Act beat counts must be 8,9,10,5; got ${actCounts.join(',')}.`)

  const combats = CAMPAIGN_BEATS.flatMap((beat) => beat.activities.filter((activity) => activity.kind === 'combat'))
  const mandatoryCombats = combats.filter((activity) => activity.kind === 'combat' && !activity.conditional).length
  const conditionalCombats = combats.filter((activity) => activity.kind === 'combat' && activity.conditional).length
  if (mandatoryCombats !== 9) errors.push(`Expected 9 mandatory combats; got ${mandatoryCombats}.`)
  if (conditionalCombats !== 4) errors.push(`Expected 4 conditional combats; got ${conditionalCombats}.`)

  return { valid: errors.length === 0, errors }
}
