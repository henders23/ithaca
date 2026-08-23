export const SHIP = {
  id: 'csv-ithaca',
  name: 'CSV Ithaca',
  registry: 'CSV-141',
  className: 'Hesperia-class long-range survey cruiser',
  portraitKey: 'ships/ithaca/orthographic',
  combatSpriteKey: 'ships/ithaca/combat',
} as const

export const FACTION_IDS = [
  'commonwealth',
  'eidolon-host',
  'argus-network',
  'aerostat-concord',
  'cirene-ark',
  'mourning-archive',
  'choir-pilgrims',
  'helios-ecology',
  'calypso-preserve',
  'phaeacian-convoy',
  'earth-coalition',
] as const

export type FactionId = (typeof FACTION_IDS)[number]

export const STORY_TERMS = {
  gate: 'Tide Gate',
  pursuers: 'Eidolon Host',
  pursuer: 'Tidefather',
  archive: 'Mourning Archive',
  destination: 'Earth',
} as const

