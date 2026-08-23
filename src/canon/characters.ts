export const CHARACTER_IDS = [
  'alexander-vale',
  'helen-morozova',
  'gabriel-cross',
  'lena-mori',
  'isabella-corelli',
  'kiara-ndala',
  'elias',
  'elara-vale',
  'tidefather',
  'argus-one',
  'keeper-aeolia',
  'doctor-cirene',
  'tiresias',
  'the-choir',
  'helios',
  'calypso',
  'speaker-nausica',
] as const

export type CharacterId = (typeof CHARACTER_IDS)[number]

export type CharacterGroup = 'ithaca' | 'home' | 'eidolon' | 'encounter'

export interface CanonCharacter {
  id: CharacterId
  name: string
  station: string
  group: CharacterGroup
  storyFunction: string
  portraitKey: string
  playable?: boolean
}

export const CANON_CHARACTERS: readonly CanonCharacter[] = [
  {
    id: 'alexander-vale',
    name: 'Captain Alexander Vale',
    station: 'Command',
    group: 'ithaca',
    storyFunction: 'Player character; ingenious, secretive and responsible for the Tide Gate order.',
    portraitKey: 'characters/alexander-vale/neutral',
    playable: true,
  },
  {
    id: 'helen-morozova',
    name: 'Dr Helen Morozova',
    station: 'Science / Executive Officer',
    group: 'ithaca',
    storyFunction: 'Vale’s intellectual equal and clearest moral challenger.',
    portraitKey: 'characters/helen-morozova/neutral',
  },
  {
    id: 'gabriel-cross',
    name: 'Commander Gabriel Cross',
    station: 'Security / Weapons',
    group: 'ithaca',
    storyFunction: 'A loyal tactical officer forced to decide what loyalty permits.',
    portraitKey: 'characters/gabriel-cross/neutral',
  },
  {
    id: 'lena-mori',
    name: 'Chief Lena Mori',
    station: 'Engineering',
    group: 'ithaca',
    storyFunction: 'Makes every sacrifice of the ship tangible and personal.',
    portraitKey: 'characters/lena-mori/neutral',
  },
  {
    id: 'isabella-corelli',
    name: 'Dr Isabella Corelli',
    station: 'Medical',
    group: 'ithaca',
    storyFunction: 'Keeps individual lives visible when Vale thinks strategically.',
    portraitKey: 'characters/isabella-corelli/neutral',
  },
  {
    id: 'kiara-ndala',
    name: "Lieutenant Kiara N’Dala",
    station: 'Communications / Xenology',
    group: 'ithaca',
    storyFunction: 'Gradually turns an unknowable pursuer into someone the crew can understand.',
    portraitKey: 'characters/kiara-ndala/neutral',
  },
  {
    id: 'elias',
    name: 'ELIAS',
    station: 'Ship Service Intelligence',
    group: 'ithaca',
    storyFunction: 'The ageing witness who remembers the person Vale was before the voyage.',
    portraitKey: 'characters/elias/neutral',
  },
  {
    id: 'elara-vale',
    name: 'Elara Vale',
    station: 'Earth',
    group: 'home',
    storyFunction: 'Vale’s adult daughter and the playable centre of the homecoming act.',
    portraitKey: 'characters/elara-vale/neutral',
    playable: true,
  },
  {
    id: 'tidefather',
    name: 'The Tidefather',
    station: 'Eidolon Host',
    group: 'eidolon',
    storyFunction: 'Pursuer, grieving parent and moral counterclaim to Vale’s heroism.',
    portraitKey: 'characters/tidefather/neutral',
  },
  {
    id: 'argus-one',
    name: 'ARGUS-1',
    station: 'One-Eyed Fortress',
    group: 'encounter',
    storyFunction: 'An industrial intelligence that mistakes the Ithaca for salvage.',
    portraitKey: 'characters/argus-one/neutral',
  },
  {
    id: 'keeper-aeolia',
    name: 'Keeper Aeolia',
    station: 'Aerostat Concord',
    group: 'encounter',
    storyFunction: 'Custodian of the spatial current and an early test of trust.',
    portraitKey: 'characters/keeper-aeolia/neutral',
  },
  {
    id: 'doctor-cirene',
    name: 'Doctor Cirene',
    station: 'Palace of New Flesh',
    group: 'encounter',
    storyFunction: 'Healer, captor and advocate for abandoning the limits of the human body.',
    portraitKey: 'characters/doctor-cirene/neutral',
  },
  {
    id: 'tiresias',
    name: 'TIRESIAS',
    station: 'Mourning Archive',
    group: 'encounter',
    storyFunction: 'A blind probability intelligence that can see the cost of every route.',
    portraitKey: 'characters/tiresias/neutral',
  },
  {
    id: 'the-choir',
    name: 'The Choir',
    station: 'Signal Entity',
    group: 'encounter',
    storyFunction: 'A promise shaped precisely like each listener’s deepest need.',
    portraitKey: 'characters/the-choir/neutral',
  },
  {
    id: 'helios',
    name: 'Helios',
    station: 'Living Star',
    group: 'encounter',
    storyFunction: 'A plasma ecology whose life is mistaken for fuel.',
    portraitKey: 'characters/helios/neutral',
  },
  {
    id: 'calypso',
    name: 'Calypso',
    station: 'Preserve at the End of Time',
    group: 'encounter',
    storyFunction: 'Offers Vale the remembered home instead of the real one.',
    portraitKey: 'characters/calypso/neutral',
  },
  {
    id: 'speaker-nausica',
    name: 'Speaker Nausica',
    station: 'Phaeacian Convoy',
    group: 'encounter',
    storyFunction: 'Judges the story Vale chooses to tell about the voyage.',
    portraitKey: 'characters/speaker-nausica/neutral',
  },
] as const

export const ITHACA_CREW = CANON_CHARACTERS.filter((character) => character.group === 'ithaca')

export const RELATIONSHIP_IDS = [
  'helen-morozova',
  'gabriel-cross',
  'lena-mori',
  'isabella-corelli',
  'kiara-ndala',
  'elias',
  'elara-vale',
] as const satisfies readonly CharacterId[]

export type RelationshipId = (typeof RELATIONSHIP_IDS)[number]

