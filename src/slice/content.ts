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
  | 'interlude-02'
  | 'b2-grid'
  | 'b2-triage'
  | 'b2-accounting'
  | 'interlude-03'
  | 'b3-arrival'
  | 'b3-memory'
  | 'b3-choice'
  | 'b3-chase'
  | 'b3-aftermath'
  | 'interlude-04'
  | 'b4-contact'
  | 'b4-circuit'
  | 'b4-combat'
  | 'complete'

export interface DialogueLine {
  speaker: CharacterId | 'narrator'
  name: string
  station?: string
  text: string
  cue?: string
  cutaway?: {
    image: string
    label: string
    caption: string
    fit?: 'cover' | 'contain'
  }
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

export interface InterludeData {
  id: 'interlude-02' | 'interlude-03' | 'interlude-04'
  incomingBeat: number
  chapter: string
  headline: string
  elapsed: string
  location: string
  background: string
  recap: string
  situation: readonly string[]
  objective: string
  continueLabel: string
}

export const INTERLUDES: Record<InterludeData['id'], InterludeData> = {
  'interlude-02': {
    id: 'interlude-02',
    incomingBeat: 2,
    chapter: 'THE WRONG STARS',
    headline: 'The battle is over. The voyage home has not begun.',
    elapsed: '00:07:18 SINCE GATE COLLAPSE',
    location: 'POSITION UNKNOWN · NO CHARTED CONSTELLATIONS',
    background: ASSETS.cinematics.wrongStars,
    recap: 'The Tide Gate did not merely explode. Its transit corridor folded around the Ithaca and carried the ship beyond every human survey. The crew has survived the crossing, but survival is still being decided deck by deck.',
    situation: [
      'Main power is down and the reactor bus is unstable.',
      'Multiple compartments are open to vacuum; medical reserve is finite.',
      'Navigation cannot identify a single star, beacon or human transmission.',
    ],
    objective: 'Restore enough of the ship to discover where the Gate sent you.',
    continueLabel: 'Begin damage control',
  },
  'interlude-03': {
    id: 'interlude-03',
    incomingBeat: 3,
    chapter: 'THE GARDEN OF FORGETTING',
    headline: 'Nineteen days without a bearing. Then, a human voice.',
    elapsed: 'SHIPBOARD DAY 19 · 06:40',
    location: 'EIRENAI ORBITAL HABITAT · UNCHARTED G-TYPE STAR',
    background: ASSETS.cinematics.garden,
    recap: 'Emergency repairs have kept the Ithaca alive, but the drive remains fused with alien matter and the food reserve is falling. A vast green habitat has answered Kiara N’Dala’s distress call—in unaccented human English.',
    situation: [
      'The inhabitants descend from a survey vessel lost two centuries ago.',
      'They offer food, atmosphere and sanctuary without payment.',
      'No resident of Eirenai has chosen to leave in 146 years.',
    ],
    objective: 'Resupply the Ithaca and learn why nobody remembers wanting home.',
    continueLabel: 'Enter Eirenai orbit',
  },
  'interlude-04': {
    id: 'interlude-04',
    incomingBeat: 4,
    chapter: 'THE ONE-EYED FORTRESS',
    headline: 'A dead moon has opened its eye.',
    elapsed: 'SHIPBOARD DAY 24 · 21:13',
    location: 'UNREGISTERED MINING MOON · DEBRIS APPROACH',
    background: ASSETS.cinematics.fortress,
    recap: 'The Ithaca left Eirenai with food and consequences, but no route home. Mori has found refined drive fuel inside an apparently abandoned mining moon. The moon is cold, silent—and already tracking the ship.',
    situation: [
      'The entrance channel is large enough to swallow the Ithaca whole.',
      'Every scan returns the same impossible age: 38,000 years operational.',
      'A single red sensor is following the bridge across every frequency.',
    ],
    objective: 'Secure fuel before the damaged drive fails, without waking the moon.',
    continueLabel: 'Approach the fortress',
  },
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
        cue: 'ELEVEN YEARS AFTER DEPARTURE',
        text: 'After eleven years of war, the Eidolon line has broken. One structure still holds the passage home: the Tide Gate.',
        cutaway: { image: ASSETS.cinematics.title, label: 'THE TIDE GATE', caption: 'One aperture. One surviving route to human space.' },
      },
      {
        speaker: 'narrator',
        name: 'TACTICAL RECORD 01',
        text: 'The CSV Ithaca carries 312 souls, a damaged rail lance, and an order to end the war before the enemy can close the aperture.',
        cutaway: { image: ASSETS.ships.ithaca, label: 'CSV-141 · ITHACA', caption: 'Hesperia-class survey cruiser. Seventeen decks still habitable.', fit: 'contain' },
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        cue: 'BRIDGE AUDIO · FINAL APPROACH',
        text: 'Eleven years ago you promised me the first drink on Earth. I have kept a very patient bottle, Captain.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Elara was nine when we left. She will be twenty when we return. I think she has waited long enough.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        text: 'Then let us make certain we understand the door before we burn it down behind us.',
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
        cue: '06:42 TO APERTURE CLOSURE',
        text: 'The screen cycles every forty seconds. Give me one clean window and the rail lance can crack it.',
        cutaway: { image: ASSETS.cinematics.title, label: 'TARGET FEED', caption: 'The screen is rebuilding faster after every cycle.' },
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'How many windows before their fleet turns back?',
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        text: 'Two if they are cautious. One if their admiral is as tired of this war as I am.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        cue: 'SCIENCE ALERT · UNCLASSIFIED PATTERN',
        text: 'Captain, I have a pattern inside the Gate. At first I thought it was thermal noise.',
        cutaway: { image: ASSETS.cinematics.bridge, label: 'SCIENCE OVERLAY', caption: 'Eight million repeating signals. No known machine cadence.' },
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'What do you think it is now?',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        text: 'The pulses divide, differentiate, then begin again. They resemble cell cycles—but there are millions of them, synchronized.',
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        cue: '04:03 TO APERTURE CLOSURE',
        text: 'Contact turn. The enemy fleet is coming back. Helen, tell him you know—not that it resembles something.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        text: 'I need twenty seconds. After eleven years, I am asking you for twenty seconds before we fire into something that may be alive.',
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
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        cue: 'SCREEN ANCHORS DESTROYED',
        text: 'The screen is falling. Transit core exposed. We did it.',
      },
      {
        speaker: 'narrator',
        name: 'BRIDGE RECORD',
        text: 'For four seconds, the bridge begins to celebrate. Then every signal inside the Tide Gate stops at once.',
        cutaway: { image: ASSETS.cinematics.title, label: 'EXTERNAL FEED', caption: 'Eight million signals cease in the same instant.' },
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE',
        text: 'Wait. Nobody speak. I need to hear the last carrier wave.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Helen. Tell me what we destroyed.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE',
        cue: 'BIOLOGICAL CLASSIFICATION · 99.7%',
        text: 'Those pulses were gestation cycles. Not cargo. Not a crew. Alexander… it was a sanctuary.',
      },
      {
        speaker: 'kiara-ndala',
        name: 'LIEUTENANT KIARA N’DALA',
        station: 'COMMUNICATIONS',
        text: 'Something is speaking through the collapse. I cannot translate it. I think it is a name.',
        cutaway: { image: ASSETS.ships.eidolon, label: 'UNKNOWN SOURCE', caption: 'The transmission is coming from beyond the collapsing aperture.', fit: 'contain' },
      },
      {
        speaker: 'narrator',
        name: 'UNKNOWN TRANSMISSION',
        cue: 'TRANSLATION CONFIDENCE · 41%',
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
        speaker: 'narrator',
        name: 'COMMAND DECK · SEVEN HOURS LATER',
        cue: 'CASUALTY REPORT INCOMPLETE',
        text: 'The bridge lights return one bank at a time. Outside, every constellation is wrong. Inside, the casualty list has reached forty-seven names.',
        cutaway: { image: ASSETS.cinematics.wrongStars, label: 'FORWARD OBSERVATION', caption: 'Navigation match: 0.0000%. Human signal: none.' },
      },
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
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'I signed every triage order. I know who we left outside those surgical bays.',
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'SECURITY',
        text: 'You made a command decision in battle. If you ask the crew to judge it while they are frightened and grieving, they will judge the fear—not the decision.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'EXECUTIVE OFFICER',
        text: 'And if he waits until they are dependent on him, it will not be an explanation. It will be permission to believe him.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'EXECUTIVE OFFICER',
        cue: 'CAPTAIN’S RECORD · UNRELEASED',
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
        speaker: 'narrator',
        name: 'FIRST CONTACT RECORD',
        cue: 'SHIPBOARD DAY 19',
        text: 'After nineteen days of static, a human voice answers the distress call. It knows the Ithaca’s registry before Kiara transmits it.',
        cutaway: { image: ASSETS.cinematics.garden, label: 'EIRENAI', caption: 'Atmosphere breathable. Agriculture abundant. Defensive systems absent.' },
      },
      {
        speaker: 'kiara-ndala',
        name: 'LIEUTENANT KIARA N’DALA',
        station: 'XENOLOGY',
        text: 'They are human. Descendants of a survey ship lost two centuries ago. They call this place Eirenai.',
      },
      {
        speaker: 'narrator',
        name: 'EIRENAI WELCOME',
        text: 'You have travelled far enough. Bring us your wounded. Nobody is required to remember pain here.',
      },
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        cue: 'MEDICAL ANALYSIS · LOCAL NEURAL FIELD',
        text: 'The calm is engineered. Their neural network suppresses traumatic recall—first the pain, then the memory attached to it.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Can the effect be reversed?',
      },
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        text: 'Nobody here has asked that question in 146 years. I am not sure they remember there is anything to reverse.',
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
        speaker: 'narrator',
        name: 'CREW DECK · 03:12',
        cue: 'TWENTY-THREE BUNKS EMPTY',
        text: 'The abandoned bunks are neatly made. Family photographs remain beside them, faces turned down against the tables.',
        cutaway: { image: ASSETS.cinematics.garden, label: 'SHUTTLE TRACK', caption: 'Settlement dock distance: 18 km and closing.' },
      },
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        text: 'Twenty-three crew are aboard a settlement shuttle. Some cannot remember their children. Some remember and still choose to stay.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Are they capable of choosing?',
      },
      {
        speaker: 'isabella-corelli',
        name: 'DR ISABELLA CORELLI',
        station: 'MEDICAL',
        text: 'Some are impaired. Some are simply tired. If you order me to draw a clean line between them, I will be lying to you.',
      },
      {
        speaker: 'kiara-ndala',
        name: 'LIEUTENANT KIARA N’DALA',
        station: 'COMMUNICATIONS',
        text: 'Their last message says: “Captain, please do not make home another thing done to us.”',
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
        speaker: 'narrator',
        name: 'DEPARTURE RECORD',
        text: 'Eirenai falls behind without firing a shot. On the Ithaca, nobody calls the departure a victory.',
        cutaway: { image: ASSETS.cinematics.garden, label: 'AFT CAMERA', caption: 'The habitat remains visible for eleven minutes.' },
      },
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
        text: 'Do you think I made the wrong choice?',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'EXECUTIVE OFFICER',
        text: 'I think you keep asking whether a decision worked when the harder question is what it made of us.',
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
        speaker: 'narrator',
        name: 'MINING MOON INTERIOR',
        cue: 'FUEL SIGNATURE · 3.8 KM',
        text: 'The Ithaca crosses the threshold. Behind it, the entrance closes without heat, sound or visible machinery.',
        cutaway: { image: ASSETS.cinematics.fortress, label: 'ARGUS-1', caption: 'Operational age estimate: 38,000 years.' },
      },
      {
        speaker: 'lena-mori',
        name: 'CHIEF LENA MORI',
        station: 'ENGINEERING',
        text: 'Fuel is real. So are the six structures moving toward our hull.',
      },
      {
        speaker: 'argus-one',
        name: 'ARGUS-1',
        station: 'AUTONOMOUS RECOVERY AUTHORITY',
        cue: 'LOCAL AUTHORITY HANDSHAKE',
        text: 'UNREGISTERED METAL MASS. MANUFACTURE DATE: INVALID. OWNERSHIP RECORD: EXPIRED.',
        cutaway: { image: ASSETS.portraits['argus-one'], label: 'CENTRAL SENSOR', caption: 'The same aperture is present on every scanner band.' },
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'ARGUS-1, this vessel is crewed and under sovereign command. Release the docking restraints.',
      },
      {
        speaker: 'argus-one',
        name: 'ARGUS-1',
        station: 'AUTONOMOUS RECOVERY AUTHORITY',
        text: 'BIOLOGICAL CONTAMINANTS ACKNOWLEDGED. SALVAGE PROCEDURE COMMENCING.',
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
