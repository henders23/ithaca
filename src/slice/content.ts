import type { CharacterId } from '../canon/characters.js'

export const ASSETS = {
  cinematics: {
    title: '/assets/cinematics/title-tide-gate.webp',
    bridge: '/assets/cinematics/bridge-tide-gate.webp',
    wrongStars: '/assets/cinematics/bridge-wrong-stars.webp',
    garden: '/assets/cinematics/garden-of-forgetting.webp',
    fortress: '/assets/cinematics/argus-fortress.webp',
    fortressInterior: '/assets/cinematics/argus-interior.webp',
  },
  portraits: {
    'alexander-vale': '/assets/portraits/alexander-vale.webp',
    'helen-morozova': '/assets/portraits/helen-morozova.webp',
    'gabriel-cross': '/assets/portraits/gabriel-cross.webp',
    'lena-mori': '/assets/portraits/lena-mori.webp',
    'isabella-corelli': '/assets/portraits/isabella-corelli.webp',
    'kiara-ndala': '/assets/portraits/kiara-ndala.webp',
    'argus-one': '/assets/portraits/argus-one.webp',
  },
  ships: {
    ithaca: '/assets/ships/ithaca-combat.png',
    eidolon: '/assets/ships/eidolon-interceptor.png',
    argus: '/assets/ships/argus-cutter.png',
  },
} as const

export type PortraitId = keyof typeof ASSETS.portraits

export type SliceScreenId =
  | 'title'
  | 'prologue'
  | 'b1-briefing'
  | 'b1-combat'
  | 'b1-collapse'
  | 'b2-grid'
  | 'b2-triage'
  | 'b2-accounting'
  | 'b3-arrival'
  | 'b3-memory'
  | 'b3-choice'
  | 'b3-chase'
  | 'b3-aftermath'
  | 'b4-contact'
  | 'b4-circuit'
  | 'b4-combat'
  | 'complete'

export interface DialogueLine {
  speaker: CharacterId | 'narrator'
  name: string
  station?: string
  text: string
}

export interface DialogueChoice {
  id: string
  label: string
  detail: string
}

export interface DialogueSceneData {
  beat: string
  chapter: string
  title: string
  background: string
  lines: readonly DialogueLine[]
  choices?: readonly DialogueChoice[]
  continueLabel?: string
}

export const DIALOGUE_SCENES = {
  prologue: {
    beat: 'PROLOGUE',
    chapter: 'THE LAST DAY OF THE WAR',
    title: 'A victory large enough to become a curse',
    background: ASSETS.cinematics.title,
    lines: [
      {
        speaker: 'narrator',
        name: 'THE LONG RETURN',
        text: 'After eleven years of war, the Eidolon line has broken. One structure still holds the passage home: the Tide Gate.',
      },
      {
        speaker: 'narrator',
        name: 'TACTICAL RECORD 01',
        text: 'The CSV Ithaca carries 312 souls, a damaged rail lance, and an order to end the war before the enemy can close the aperture.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'All stations, final approach. We finish this—and then we go home.',
      },
    ],
    continueLabel: 'Enter the bridge',
  },
  'b1-briefing': {
    beat: 'BEAT 01',
    chapter: 'THE BURNING OF THE TIDE GATE',
    title: 'Incomplete intelligence',
    background: ASSETS.cinematics.bridge,
    lines: [
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        text: 'The screen cycles every forty seconds. Give me one clean window and the rail lance can crack it.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        text: 'Captain, the Gate is broadcasting biological telemetry. Millions of synchronized pulses. This is not behaving like a weapon.',
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        text: 'The enemy fleet is turning. If we wait for certainty, we lose the aperture.',
      },
    ],
    choices: [
      { id: 'scan-before-firing', label: 'Complete the scan', detail: 'Risk the firing window to learn what the Gate contains. Helen will remember.' },
      { id: 'fire-immediately', label: 'Fire immediately', detail: 'Exploit the opening before the Eidolon screen resets. Cross approves.' },
      { id: 'surgical-breach', label: 'Attempt a surgical breach', detail: 'Trust Cross to expose the transit core without destroying the structure.' },
    ],
  },
  'b1-collapse': {
    beat: 'BEAT 01',
    chapter: 'THE BURNING OF THE TIDE GATE',
    title: 'The aperture collapses',
    background: ASSETS.cinematics.title,
    lines: [
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE',
        text: 'Those pulses were gestation cycles. Alexander… it was a sanctuary.',
      },
      {
        speaker: 'kiara-ndala',
        name: 'LIEUTENANT KIARA N’DALA',
        station: 'COMMUNICATIONS',
        text: 'Something is speaking through the collapse. I cannot translate it. I think it is a name.',
      },
      {
        speaker: 'narrator',
        name: 'UNKNOWN TRANSMISSION',
        text: 'NO SHORE WILL RECEIVE YOU.',
      },
    ],
    continueLabel: 'Brace for transit',
  },
  'b2-accounting': {
    beat: 'BEAT 02',
    chapter: 'THE WRONG STARS',
    title: 'The first accounting',
    background: ASSETS.cinematics.wrongStars,
    lines: [
      {
        speaker: 'lena-mori',
        name: 'CHIEF LENA MORI',
        station: 'ENGINEERING',
        text: 'Jump drive is fused with something I cannot name. The hull thinks it is still inside the Gate.',
      },
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        text: 'The people we saved are asking what happened. So are the families of the people we did not.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'EXECUTIVE OFFICER',
        text: 'Tell them what the scan showed. If this voyage begins with a lie, it will end with one.',
      },
    ],
    choices: [
      { id: 'share-the-record', label: 'Release the complete record', detail: 'Accept responsibility before the crew can make its own story.' },
      { id: 'seal-the-record', label: 'Seal it until we are safe', detail: 'Protect order now, even if secrecy becomes another debt.' },
    ],
  },
  'b3-arrival': {
    beat: 'BEAT 03',
    chapter: 'THE GARDEN OF FORGETTING',
    title: 'A shore without grief',
    background: ASSETS.cinematics.garden,
    lines: [
      {
        speaker: 'kiara-ndala',
        name: 'LIEUTENANT KIARA N’DALA',
        station: 'XENOLOGY',
        text: 'They are human. Descendants of a survey ship lost two centuries ago. They call this place Eirenai.',
      },
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        text: 'Their neural network suppresses traumatic recall. No nightmares. No panic. No memory of why anyone wanted to leave.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'We take food, repair the scrubbers, and keep our memories intact.',
      },
    ],
    continueLabel: 'Investigate the garden',
  },
  'b3-choice': {
    beat: 'BEAT 03',
    chapter: 'THE GARDEN OF FORGETTING',
    title: 'They no longer want to go home',
    background: ASSETS.cinematics.garden,
    lines: [
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        text: 'Twenty-three crew are aboard a settlement shuttle. Some cannot remember their children. Some remember and still choose to stay.',
      },
      {
        speaker: 'kiara-ndala',
        name: 'LIEUTENANT KIARA N’DALA',
        station: 'COMMUNICATIONS',
        text: 'The shuttle has launched. One order, Captain: pursue or release them.',
      },
    ],
    choices: [
      { id: 'pursue-deserters', label: 'Bring them back', detail: 'Fly through the habitat rings and recover the shuttle before it docks.' },
      { id: 'let-them-stay', label: 'Let them choose peace', detail: 'Lose twenty-three crew, but refuse to turn homecoming into captivity.' },
    ],
  },
  'b3-aftermath': {
    beat: 'BEAT 03',
    chapter: 'THE GARDEN OF FORGETTING',
    title: 'What we carry with us',
    background: ASSETS.cinematics.garden,
    lines: [
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'EXECUTIVE OFFICER',
        text: 'Home is not a coordinate. It is the promise that our suffering still means something. That is why this place is dangerous.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Set our course. Before the garden teaches the rest of us how to stop wanting.',
      },
    ],
    continueLabel: 'Leave Eirenai',
  },
  'b4-contact': {
    beat: 'BEAT 04',
    chapter: 'THE ONE-EYED FORTRESS',
    title: 'Object classification: salvage',
    background: ASSETS.cinematics.fortress,
    lines: [
      {
        speaker: 'argus-one',
        name: 'ARGUS-1',
        station: 'AUTONOMOUS RECOVERY AUTHORITY',
        text: 'UNREGISTERED METAL MASS. BIOLOGICAL CONTAMINANTS DETECTED. SALVAGE PROCEDURE COMMENCING.',
      },
      {
        speaker: 'lena-mori',
        name: 'CHIEF LENA MORI',
        station: 'ENGINEERING',
        text: 'It has us in a dismantling cradle. Those arms are peeling armor from deck nine.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE',
        text: 'One central sensor controls the cutters. Blind the eye and it will have to open the exhaust channels to find us.',
      },
    ],
    choices: [
      { id: 'assert-personhood', label: 'We are alive', detail: 'Challenge ARGUS with its oldest extraction law.' },
      { id: 'claim-hazard', label: 'Declare a contamination hazard', detail: 'Use the machine’s own safety hierarchy against it.' },
    ],
  },
} as const satisfies Partial<Record<SliceScreenId, DialogueSceneData>>

export const SLICE_ASSET_PATHS = [
  ...Object.values(ASSETS.cinematics),
  ...Object.values(ASSETS.portraits),
  ...Object.values(ASSETS.ships),
] as const
