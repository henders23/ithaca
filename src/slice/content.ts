import { isAlienCharacter } from '../canon/characters.js'
import type { CharacterId, RelationshipId } from '../canon/characters.js'
import type { RelationshipAxis } from '../state/types.js'

export const ASSETS = {
  cinematics: {
    title: '/assets/cinematics/title-tide-gate.webp',
    bridge: '/assets/cinematics/bridge-tide-gate.webp',
    wrongStars: '/assets/cinematics/bridge-wrong-stars.webp',
    garden: '/assets/cinematics/garden-of-forgetting.webp',
    fortress: '/assets/cinematics/argus-fortress.webp',
    fortressInterior: '/assets/cinematics/argus-interior.webp',
    argusTransmitter: '/assets/cinematics/argus-transmitter.webp',
    tidefatherIntercept: '/assets/cinematics/tidefather-intercept.webp',
    aeolianCity: '/assets/cinematics/aeolian-city.webp',
    sphereChamber: '/assets/cinematics/sphere-chamber.webp',
    sphereRupture: '/assets/cinematics/sphere-rupture.webp',
    devouringHarbour: '/assets/cinematics/devouring-harbour.webp',
    devouringHarbourEscape: '/assets/cinematics/devouring-harbour-escape.webp',
    cireneArk: '/assets/cinematics/cirene-ark.webp',
    cireneIdentityLab: '/assets/cinematics/cirene-identity-lab.webp',
    cireneMindTheatre: '/assets/cinematics/cirene-mind-theatre.webp',
    cireneRefitYear: '/assets/cinematics/cirene-refit-year.webp',
    mourningArchiveApproach: '/assets/cinematics/mourning-archive-approach.webp',
    mourningArchiveInterior: '/assets/cinematics/mourning-archive-interior.webp',
    elaraFragmentedMessage: '/assets/cinematics/elara-fragmented-message.webp',
    tiresiasObservatory: '/assets/cinematics/tiresias-observatory.webp',
    choirInDark: '/assets/cinematics/choir-in-dark.webp',
    silentPassage: '/assets/cinematics/silent-passage.webp',
    twinTerrors: '/assets/cinematics/twin-terrors.webp',
    scyllaRescue: '/assets/cinematics/scylla-rescue.webp',
    heliosArrival: '/assets/cinematics/helios-arrival.webp',
    heliosEcology: '/assets/cinematics/helios-ecology.webp',
    hungerMutiny: '/assets/cinematics/hunger-mutiny.webp',
    heliosJudgment: '/assets/cinematics/helios-judgment.webp',
    failingDrive: '/assets/cinematics/failing-drive.webp',
    lastCompanionMemorial: '/assets/cinematics/last-companion-memorial.webp',
    calypsoShore: '/assets/cinematics/calypso-shore.webp',
    calypsoFalseHome: '/assets/cinematics/calypso-false-home.webp',
    calypsoMemoryMaze: '/assets/cinematics/calypso-memory-maze.webp',
    calypsoDeparture: '/assets/cinematics/calypso-departure.webp',
    phaeacianConvoy: '/assets/cinematics/phaeacian-convoy.webp',
    phaeacianCouncil: '/assets/cinematics/phaeacian-council.webp',
    phaeacianBattle: '/assets/cinematics/phaeacian-battle.webp',
    earthShipyard: '/assets/cinematics/earth-shipyard.webp',
    shipyardRecognition: '/assets/cinematics/shipyard-recognition.webp',
    commandCitadel: '/assets/cinematics/command-citadel.webp',
    earthOrbitSiege: '/assets/cinematics/earth-orbit-siege.webp',
    sharedMemory: '/assets/cinematics/shared-memory.webp',
    earthEpilogue: '/assets/cinematics/earth-epilogue.webp',
  },
  portraits: {
    'alexander-vale': '/assets/portraits/alexander-vale.webp',
    'helen-morozova': '/assets/portraits/helen-morozova.webp',
    'gabriel-cross': '/assets/portraits/gabriel-cross.webp',
    'lena-mori': '/assets/portraits/lena-mori.webp',
    'isabella-corelli': '/assets/portraits/isabella-corelli.webp',
    'kiara-ndala': '/assets/portraits/kiara-ndala.webp',
    'argus-one': '/assets/portraits/argus-one.webp',
    elias: '/assets/portraits/elias.webp',
    tidefather: '/assets/portraits/tidefather.webp',
    'keeper-aeolia': '/assets/portraits/keeper-aeolia.webp',
    'doctor-cirene': '/assets/portraits/doctor-cirene.webp',
    'elara-vale': '/assets/portraits/elara-vale.webp',
    tiresias: '/assets/portraits/tiresias.webp',
    helios: '/assets/portraits/helios.webp',
    calypso: '/assets/portraits/calypso.webp',
    'speaker-nausica': '/assets/portraits/speaker-nausica.webp',
  },
  ships: {
    ithaca: '/assets/ships/ithaca-combat.png',
    eidolon: '/assets/ships/eidolon-interceptor.png',
    argus: '/assets/ships/argus-cutter.png',
    tidefather: '/assets/ships/tidefather-capital-ui.webp',
    scylla: '/assets/ships/scylla-combat.webp',
    salvageTug: '/assets/ships/salvage-tug.webp',
    cireneCustodian: '/assets/ships/cirene-custodian.webp',
  },
} as const

export type PortraitId = keyof typeof ASSETS.portraits

export type PortraitEmotion = 'neutral' | 'guarded' | 'angry' | 'frightened' | 'wounded' | 'stressed' | 'exhausted' | 'grieving'

/** Identity-locked performance variants. Missing emotions deliberately fall back to neutral. */
export const PORTRAIT_VARIANTS: Readonly<Partial<Record<PortraitId, Partial<Record<PortraitEmotion, string>>>>> = {
  'alexander-vale': { grieving: '/assets/portraits/alexander-vale-grieving.webp' },
  'helen-morozova': { angry: '/assets/portraits/helen-morozova-angry.webp', guarded: '/assets/portraits/helen-morozova-angry.webp' },
  'gabriel-cross': { wounded: '/assets/portraits/gabriel-cross-wounded.webp', exhausted: '/assets/portraits/gabriel-cross-wounded.webp' },
  'lena-mori': { stressed: '/assets/portraits/lena-mori-stressed.webp', angry: '/assets/portraits/lena-mori-stressed.webp' },
  'isabella-corelli': { exhausted: '/assets/portraits/isabella-corelli-exhausted.webp', angry: '/assets/portraits/isabella-corelli-exhausted.webp' },
  'kiara-ndala': { frightened: '/assets/portraits/kiara-ndala-frightened.webp' },
  'elara-vale': { angry: '/assets/portraits/elara-vale-angry.webp', guarded: '/assets/portraits/elara-vale-angry.webp' },
}

export function portraitFor(id: PortraitId, emotion: PortraitEmotion = 'neutral') {
  return PORTRAIT_VARIANTS[id]?.[emotion] ?? ASSETS.portraits[id]
}

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
  | 'interlude-05'
  | 'b5-aftermath'
  | 'b5-cipher'
  | 'b5-name'
  | 'b5-consequence'
  | 'interlude-06'
  | 'b6-signal'
  | 'b6-memories'
  | 'b6-combat'
  | 'b6-sacrifice'
  | 'b6-aftermath'
  | 'interlude-07'
  | 'b7-arrival'
  | 'b7-negotiation'
  | 'b7-current'
  | 'b7-flight'
  | 'b7-departure'
  | 'interlude-08'
  | 'b8-rumours'
  | 'b8-near-home'
  | 'b8-rupture'
  | 'b8-log'
  | 'b8-judgment'
  | 'act-one-complete'
  | 'interlude-09'
  | 'b9-approach'
  | 'b9-course'
  | 'b9-combat'
  | 'b9-aftermath'
  | 'interlude-10'
  | 'b10-arrival'
  | 'b10-forensics'
  | 'b10-restoration'
  | 'b10-aftermath'
  | 'interlude-11'
  | 'b11-confrontation'
  | 'b11-neural'
  | 'b11-bargain'
  | 'b11-combat'
  | 'b11-aftermath'
  | 'interlude-12'
  | 'b12-refuge'
  | 'b12-time-reveal'
  | 'b12-refit'
  | 'b12-departure'
  | 'act-two-slice-complete'
  | 'interlude-13'
  | 'b13-protocol'
  | 'b13-run-dark'
  | 'b13-wardens'
  | 'interlude-14'
  | 'b14-evidence'
  | 'b14-testimony'
  | 'interlude-15'
  | 'b15-memory'
  | 'b15-request'
  | 'interlude-16'
  | 'b16-message'
  | 'b16-aftermath'
  | 'interlude-17'
  | 'b17-futures'
  | 'b17-prophecy'
  | 'act-two-complete'
  | 'interlude-18' | 'b18-promises' | 'b18-filter' | 'b18-aftermath'
  | 'interlude-19' | 'b19-navigation' | 'b19-extract' | 'b19-aftermath'
  | 'interlude-20' | 'b20-choice' | 'b20-course' | 'b20-combat'
  | 'interlude-21' | 'b21-voices' | 'b21-rescue' | 'b21-aftermath' | 'act-three-slice-complete'
  | 'interlude-22' | 'b22-arrival' | 'b22-ecology' | 'b22-prohibition'
  | 'interlude-23' | 'b23-crisis' | 'b23-control' | 'b23-confrontation' | 'b23-awakens'
  | 'interlude-24' | 'b24-two-accusers' | 'b24-combat' | 'b24-routing' | 'b24-aftermath'
  | 'interlude-25' | 'b25-volunteers' | 'b25-drive' | 'b25-last-words' | 'b25-memorial' | 'act-three-complete'
  | 'interlude-26' | 'b26-waking' | 'b26-false-home' | 'b26-offer'
  | 'interlude-27' | 'b27-years' | 'b27-identity' | 'b27-departure'
  | 'interlude-28' | 'b28-welcome' | 'b28-account' | 'b28-verdict' | 'b28-combat' | 'act-four-opening-complete'
  | 'interlude-29' | 'b29-introduction' | 'b29-evidence' | 'b29-escape'
  | 'interlude-30' | 'b30-infiltration' | 'b30-recognition' | 'b30-reunion'
  | 'interlude-31' | 'b31-resonance' | 'b31-truth' | 'b31-combat'
  | 'interlude-32' | 'b32-orbit' | 'b32-network' | 'b32-memory' | 'b32-contact' | 'b32-ending' | 'campaign-complete'

export interface DialogueLine {
  speaker: CharacterId | 'narrator'
  name: string
  station?: string
  text: string
  cue?: string
  emotion?: PortraitEmotion
  shot?: 'close' | 'medium' | 'wide' | 'comms' | 'reaction'
  pause?: 'short' | 'held' | 'silence'
  reaction?: {
    speaker: CharacterId
    name: string
    emotion?: PortraitEmotion
  }
  cutaway?: {
    image: string
    label: string
    caption: string
    fit?: 'cover' | 'contain'
  }
}

export interface DialogueMomentChoice {
  id: string
  label: string
  detail: string
  response: DialogueLine
  character?: RelationshipId
  axis?: RelationshipAxis
  delta?: number
}

export interface DialogueMoment {
  id: string
  /** Zero-based source-line index after which the player may intervene. */
  afterLine: number
  prompt: string
  choices: readonly DialogueMomentChoice[]
}

export interface DialogueChoice {
  id: string
  label: string
  detail: string
}

export interface DialogueSceneData {
  id?: string
  beat: string
  chapter: string
  title: string
  location?: string
  sceneType?: 'briefing' | 'private' | 'confrontation' | 'memory' | 'aftermath' | 'transmission'
  background: string
  lines: readonly DialogueLine[]
  choices?: readonly DialogueChoice[]
  moments?: readonly DialogueMoment[]
  continueLabel?: string
}

export interface InterludeData {
  id: `interlude-${string}`
  incomingBeat: number
  chapter: string
  headline: string
  /** Authored but no longer shown: the masthead and location line were cut as chrome. */
  elapsed: string
  location: string
  background: string
  recap: string
  situation: readonly string[]
  objective: string
  continueLabel: string
}

export const INTERLUDES: Record<'interlude-02' | 'interlude-03' | 'interlude-04', InterludeData> = {
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
    id: 'prologue-last-day',
    beat: 'PROLOGUE',
    chapter: 'THE LAST DAY OF THE WAR',
    title: 'A victory large enough to become a curse',
    location: 'TIDE GATE APPROACH · BRIDGE WATCH',
    sceneType: 'briefing',
    background: ASSETS.cinematics.title,
    lines: [
      {
        speaker: 'narrator',
        name: 'THE LONG RETURN',
        cue: 'ELEVEN YEARS AFTER DEPARTURE',
        text: 'Eleven years after leaving Earth, the Ithaca can see the way home. The Tide Gate is closing.',
        cutaway: { image: ASSETS.cinematics.title, label: 'THE TIDE GATE', caption: 'One aperture. One surviving route to human space.' },
      },
      {
        speaker: 'narrator',
        name: 'TACTICAL RECORD 01',
        text: 'Three hundred and twelve people are awake for final approach. Nobody has said what they will do first on Earth.',
        cutaway: { image: ASSETS.ships.ithaca, label: 'CSV-141 · ITHACA', caption: 'Hesperia-class survey cruiser. Seventeen decks still habitable.', fit: 'contain' },
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        cue: 'BRIDGE AUDIO · FINAL APPROACH',
        text: 'Bottle’s still there.',
        shot: 'close',
        reaction: { speaker: 'alexander-vale', name: 'VALE' },
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Elara was nine when we left. She’ll be twenty now.',
        pause: 'held',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        text: 'Then look at the door, Alexander. Not through it.',
        emotion: 'guarded',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'All stations. Final approach. Let’s go home.',
      },
    ],
    moments: [{
      id: 'cross-bottle', afterLine: 2, prompt: 'Cross is trying to make this feel ordinary. What does Vale give him back?', choices: [
        { id: 'share-the-joke', label: 'Share the old joke', detail: 'Meet fear with the private language of an eleven-year friendship.', character: 'gabriel-cross', axis: 'intimacy', delta: 1, response: { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'Still tastes like coolant?', shot: 'close' } },
        { id: 'ask-if-he-kept-it', label: 'Ask if he really kept it', detail: 'Let Cross admit what the promise has meant to him.', character: 'gabriel-cross', axis: 'trust', delta: 1, response: { speaker: 'gabriel-cross', name: 'CROSS', station: 'WEAPONS', text: 'Checked it every year. Stupid, really.', emotion: 'neutral', pause: 'short' } },
        { id: 'look-at-elara', label: 'Look at Elara’s photograph', detail: 'Say nothing; Cross will understand which promise matters more.', character: 'gabriel-cross', axis: 'resentment', delta: 1, response: { speaker: 'narrator', name: 'BRIDGE RECORD', text: 'Vale turns the photograph beside his chair face up. Cross watches him do it.', shot: 'reaction', pause: 'held' } },
      ],
    }],
    continueLabel: 'Enter the bridge',
  },
  'b1-briefing': {
    id: 'b1-incomplete-intelligence',
    beat: 'BEAT 01',
    chapter: 'THE BURNING OF THE TIDE GATE',
    title: 'Incomplete intelligence',
    location: 'CSV ITHACA · SIX MINUTES TO GATE CLOSURE',
    sceneType: 'confrontation',
    background: ASSETS.cinematics.bridge,
    lines: [
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        cue: '06:42 TO APERTURE CLOSURE',
        text: 'Screen cycles every forty seconds. Give me one clean window and I can crack it.',
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
        text: 'Two if they’re careful. One if they’re tired.',
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        cue: 'SCIENCE ALERT · UNCLASSIFIED PATTERN',
        text: 'There’s a pattern inside the Gate. I called it heat noise. I was wrong.',
        emotion: 'guarded',
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
        text: 'They divide. Differentiate. Begin again. Cell cycles—or something close enough that I need you to stop.',
        emotion: 'angry',
      },
      {
        speaker: 'gabriel-cross',
        name: 'COMMANDER GABRIEL CROSS',
        station: 'WEAPONS',
        cue: '04:03 TO APERTURE CLOSURE',
        text: 'Contact turn. Helen, do you know?',
        reaction: { speaker: 'helen-morozova', name: 'MOROZOVA', emotion: 'angry' },
      },
      {
        speaker: 'helen-morozova',
        name: 'DR HELEN MOROZOVA',
        station: 'SCIENCE / EXECUTIVE OFFICER',
        text: 'No. I need twenty seconds.',
        emotion: 'angry',
        pause: 'silence',
      },
    ],
    moments: [{
      id: 'twenty-seconds', afterLine: 7, prompt: 'The firing window is closing. Answer the person before answering the problem.', choices: [
        { id: 'ask-what-she-needs', label: '“What do you need?”', detail: 'Give Morozova the authority to name a test before Vale gives an order.', character: 'helen-morozova', axis: 'trust', delta: 1, response: { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE', text: 'Hold the target steady. And don’t let Cross fire because I sound afraid.', emotion: 'angry', shot: 'close' } },
        { id: 'keep-cross-ready', label: 'Keep Cross on the window', detail: 'Acknowledge Morozova without surrendering the tactical opening.', character: 'gabriel-cross', axis: 'respect', delta: 1, response: { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'Cross, hold the window. Helen—start.', reaction: { speaker: 'gabriel-cross', name: 'CROSS' } } },
        { id: 'let-silence-answer', label: 'Say nothing', detail: 'Make both officers wait inside Vale’s silence before the final order.', character: 'helen-morozova', axis: 'resentment', delta: 1, response: { speaker: 'narrator', name: 'BRIDGE RECORD', text: 'Four seconds pass. Cross’s thumb stays over the firing key.', pause: 'silence', shot: 'wide' } },
      ],
    }],
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
        text: 'Twenty-three people looked at that garden and stopped asking when. I’m frightened by how quickly you heard that as surrender.',
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
        text: 'I think you ask whether it worked because that question has a report you can sign.',
      },
      {
        speaker: 'alexander-vale',
        name: 'CAPTAIN ALEXANDER VALE',
        station: 'COMMAND',
        text: 'Set our course. Put every name in the departure record—whether they stayed or came back.',
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

/**
 * True when an Eidolon or encounter entity speaks in the scene. Those are the
 * conversations the alien theme scores; everything else stays on the voyage.
 */
export function sceneHasAlienSpeaker(scene: DialogueSceneData): boolean {
  return scene.lines.some((line) => isAlienCharacter(line.speaker))
}

const SLICE_ASSET_PATHS_WITH_ALIASES = [
  ...Object.values(ASSETS.cinematics),
  ...Object.values(ASSETS.portraits),
  ...Object.values(PORTRAIT_VARIANTS).flatMap((variants) => Object.values(variants ?? {})),
  ...Object.values(ASSETS.ships),
] as const

/** Unique preload/validation manifest; several emotional states intentionally share one performance image. */
export const SLICE_ASSET_PATHS = [...new Set(SLICE_ASSET_PATHS_WITH_ALIASES)]
