import type { GameState } from '../state/types.js'
import { ASSETS, type DialogueSceneData, type InterludeData } from './content.js'

export const SLICE_TWO_INTERLUDES = {
  'interlude-05': {
    id: 'interlude-05',
    incomingBeat: 5,
    chapter: 'THE CAPTAIN GIVES HIS NAME',
    headline: 'The fortress is behind you. Its question is not.',
    elapsed: 'SHIPBOARD DAY 24 · 22:06',
    location: 'ARGUS TRANSMISSION SHADOW · 0.7 AU FROM MINING MOON',
    background: ASSETS.cinematics.argusTransmitter,
    recap: 'The Ithaca escaped the dismantling cradle carrying fuel, scars, and a stolen exhaust key. ARGUS-1 has turned its one great eye toward the dark and begun broadcasting the intruder’s sensor record on every band it can reach.',
    situation: [
      'The transmission contains the Ithaca’s drive signature and partial registry.',
      'ELIAS can bury the ship inside a false identity—but only before ARGUS completes the packet.',
      'The crew is listening to see whether Vale hides, boasts, or takes responsibility.',
    ],
    objective: 'Rewrite the outgoing record, then decide what name the darkness will hear.',
    continueLabel: 'Return to the bridge',
  },
  'interlude-06': {
    id: 'interlude-06',
    incomingBeat: 6,
    chapter: 'THE FIRST WRATH',
    headline: 'Something has answered the name.',
    elapsed: 'SHIPBOARD DAY 25 · 03:17',
    location: 'INTERSTELLAR DRIFT · RANGE TO CONTACT UNKNOWN',
    background: ASSETS.cinematics.tidefatherIntercept,
    recap: 'For five hours the Ithaca has run dark. Then every clock aboard loses the same thirteen seconds. Kiara finds a signal beneath the silence: no coordinates, no demands, only millions of heartbeats slowing together.',
    situation: [
      'A vessel larger than the Tide Gate is matching the Ithaca without visible thrust.',
      'Its transmission is entering medical implants, service drones, and sleeping minds.',
      'Mori can force one emergency jump, but the ship cannot carry every system through it.',
    ],
    objective: 'Endure the pursuer long enough to open a jump window—and choose what must be left behind.',
    continueLabel: 'Answer the signal',
  },
  'interlude-07': {
    id: 'interlude-07',
    incomingBeat: 7,
    chapter: 'THE KEEPER OF WINDS',
    headline: 'After wrath, a city held aloft by trust.',
    elapsed: 'SHIPBOARD DAY 31 · 14:52',
    location: 'AEROSTAT CONCORD · UPPER CLOUD DECK',
    background: ASSETS.cinematics.aeolianCity,
    recap: 'The emergency jump escaped the Tidefather and carried the crippled Ithaca into a gas giant’s golden weather. Cities drift between the storms, sailing on currents their people have tended for generations.',
    situation: [
      'Keeper Aeolia offers shelter under an ancient law of hospitality.',
      'Her engineers can bottle a spatial current strong enough to cross half the known distance home.',
      'Aeolia has already heard the Eidolon account of the Tide Gate.',
    ],
    objective: 'Earn the Keeper’s trust, contain the current, and prove the Ithaca can carry it safely.',
    continueLabel: 'Enter the cloud city',
  },
  'interlude-08': {
    id: 'interlude-08',
    incomingBeat: 8,
    chapter: 'THE FORBIDDEN SPHERE',
    headline: 'Home appears inside a sphere nobody may open.',
    elapsed: 'SHIPBOARD DAY 38 · 01:09',
    location: 'CURRENT TRANSIT · CREW DECK CURFEW',
    background: ASSETS.cinematics.sphereChamber,
    recap: 'The Aeolian sphere is carrying the Ithaca across impossible distance. Familiar stars have appeared on long-range sensors for the first time since the Gate, but Vale has sealed the device and refused to promise where—or when—it will deliver them.',
    situation: [
      'Rumours say the sphere contains a private escape route reserved for command.',
      'Three crew members have requested access; somebody has forged a fourth authorization.',
      'The Tidefather’s signal grows stronger whenever the containment field fluctuates.',
    ],
    objective: 'Listen before accusing, protect the sphere, and discover who is prepared to risk everyone for home.',
    continueLabel: 'Walk the crew decks',
  },
} as const satisfies Record<'interlude-05' | 'interlude-06' | 'interlude-07' | 'interlude-08', InterludeData>

const SCENES = {
  'b5-aftermath': {
    beat: 'BEAT 05', chapter: 'THE CAPTAIN GIVES HIS NAME', title: 'A machine asks who escaped', background: ASSETS.cinematics.argusTransmitter,
    lines: [
      { speaker: 'narrator', name: 'AFT OBSERVATION', cue: 'THIRTY-NINE MINUTES AFTER ESCAPE', text: 'The mining moon shrinks behind the Ithaca. Across its dead surface, antennae unfold like black flowers.', cutaway: { image: ASSETS.cinematics.argusTransmitter, label: 'ARGUS BROADCAST', caption: 'Carrier strength rising. Estimated reach: interstellar.' } },
      { speaker: 'lena-mori', name: 'CHIEF LENA MORI', station: 'ENGINEERING', text: 'It took eight metres of our armor and called us salvage. Now it wants a receipt.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', cue: 'SERVICE CORE · FIRST DIRECT ADDRESS', text: 'Captain Vale, I can edit the transponder packet before transmission. I cannot edit what the crew believes you will say.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'You have been quiet since the Gate, ELIAS.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'I was installed when you were twenty-two. Silence is how an old machine gives a grown man time to become honest.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'ARGUS is asking the oldest question in history: who did this? This time we decide whether the answer is a trick.' },
    ],
    continueLabel: 'Intercept the packet',
  },
  'b5-name': {
    beat: 'BEAT 05', chapter: 'THE CAPTAIN GIVES HIS NAME', title: 'What the dark will call you', background: ASSETS.cinematics.argusTransmitter,
    lines: [
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', cue: 'CIPHER WINDOW · 00:34', text: 'The false identity is ready. It will not survive determined scrutiny, but it may purchase distance.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'Or we make the truth useful. Tell every machine listening exactly who broke the fortress.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'You want him to turn guilt into a flag.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'I want anything following us to hesitate. Legends are armor when the hull is gone.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'Legends are also coordinates, Commander.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Open the channel. If the universe wants a name, it will have the one I choose.' },
    ],
    choices: [
      { id: 'give-real-name', label: 'I am Alexander Vale', detail: 'Claim both the victory and the attention it brings.' },
      { id: 'use-forged-name', label: 'Transmit the cipher', detail: 'Hide the Ithaca behind ELIAS’s fabricated captain.' },
      { id: 'name-the-ship', label: 'Name only the Ithaca', detail: 'Protect the captain, but let the pursuer know the ship.' },
      { id: 'confess-the-gate', label: 'Name yourself—and the dead', detail: 'Admit what happened at the Gate before asking the dark to judge you.' },
    ],
  },
  'b6-signal': {
    beat: 'BEAT 06', chapter: 'THE FIRST WRATH', title: 'Thirteen missing seconds', background: ASSETS.cinematics.tidefatherIntercept,
    lines: [
      { speaker: 'narrator', name: 'COMMAND DECK', cue: '03:17:09 · ALL CLOCKS DESYNCHRONIZED', text: 'Every light on the bridge dims. Thirteen seconds later they return, and something impossible is already beside the ship.', cutaway: { image: ASSETS.cinematics.tidefatherIntercept, label: 'CONTACT', caption: 'No arrival vector. No engine wake. Range: 11,400 km.' } },
      { speaker: 'kiara-ndala', name: 'LIEUTENANT KIARA N’DALA', station: 'COMMUNICATIONS', text: 'The signal is not using the receivers. It is moving through every system altered by the Gate.' },
      { speaker: 'lena-mori', name: 'CHIEF LENA MORI', station: 'ENGINEERING', text: 'That means half the Ithaca. Including life support.' },
      { speaker: 'tidefather', name: 'THE TIDEFATHER', station: 'EIDOLON HOST', cue: 'VOICE ASSEMBLED FROM 8,104 RECORDINGS', text: 'Alexander Vale. I have crossed the silence made by your weapon.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'State your terms.' },
      { speaker: 'tidefather', name: 'THE TIDEFATHER', station: 'EIDOLON HOST', text: 'You still believe this is a negotiation. First, you will know whom you ended.' },
    ],
    continueLabel: 'Receive the memories',
  },
  'b6-memories': {
    beat: 'BEAT 06', chapter: 'THE FIRST WRATH', title: 'The dead speak in first person', background: ASSETS.cinematics.tidefatherIntercept,
    lines: [
      { speaker: 'narrator', name: 'MEMORY INTRUSION', cue: 'SOURCE · TIDE GATE SANCTUARY', text: 'The bridge disappears. Vale experiences eight million lives without language: warmth, division, recognition—and sudden white fire.', cutaway: { image: ASSETS.cinematics.tidefatherIntercept, label: 'INTRUSIVE MEMORY', caption: 'The faces are an interface built from the crew’s own dead.' } },
      { speaker: 'isabella-corelli', name: 'DR ISABELLA CORELLI', station: 'MEDICAL', text: 'Captain, your heart stopped for six seconds. So did mine. So did everyone connected to the ship.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'SCIENCE', text: 'It was a nursery. Each signal was a life being assembled across the whole structure.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'It was also shielding an enemy fleet. Both things can be true.' },
      { speaker: 'tidefather', name: 'THE TIDEFATHER', station: 'EIDOLON HOST', text: 'You count targets to make the counting bearable. I counted children because I knew each pattern before it had a voice.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Why show the whole crew?' },
      { speaker: 'tidefather', name: 'THE TIDEFATHER', station: 'EIDOLON HOST', text: 'Because they call you captain. Let them understand the shore you purchased for them.' },
    ],
    choices: [
      { id: 'apologize', label: 'I am sorry', detail: 'Offer grief without asking it to become forgiveness.' },
      { id: 'justify-order', label: 'The Gate was a weapon', detail: 'Defend the order that ended the war, even if Helen hears it as refusal to recognize the dead.' },
      { id: 'accuse-intelligence', label: 'We were deceived too', detail: 'Point toward the human command that falsified the target.' },
      { id: 'hold-silence', label: 'Say nothing', detail: 'Refuse to turn the dead into an argument, leaving the crew to decide what your silence means.' },
    ],
  },
  'b6-aftermath': {
    beat: 'BEAT 06', chapter: 'THE FIRST WRATH', title: 'The ship after sacrifice', background: ASSETS.cinematics.tidefatherIntercept,
    lines: [
      { speaker: 'narrator', name: 'EMERGENCY TRANSIT', cue: 'CONTACT LOST · RANGE INCREASING', text: 'The Ithaca tears free on an incomplete jump. One part of the ship goes dark and does not return.', cutaway: { image: ASSETS.ships.ithaca, label: 'SYSTEM MAP', caption: 'A permanent gap now runs through the ship’s silhouette.', fit: 'contain' } },
      { speaker: 'lena-mori', name: 'CHIEF LENA MORI', station: 'ENGINEERING', text: 'The jump held. Do not call the missing system ballast. People served there. People built their lives around it.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'The Tidefather could have destroyed us. It chose to make us remember.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'Punishment is easy to understand. It wants recognition. That is harder, because recognition may require us to change.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Then we change while moving. It knows our name; it does not get to decide where our story ends.' },
      { speaker: 'kiara-ndala', name: 'LIEUTENANT KIARA N’DALA', station: 'XENOLOGY', text: 'There is weather ahead—and cities inside it. Someone is calling us guest.' },
    ],
    continueLabel: 'Follow the beacon',
  },
  'b7-arrival': {
    beat: 'BEAT 07', chapter: 'THE KEEPER OF WINDS', title: 'Cities that sail the storm', background: ASSETS.cinematics.aeolianCity,
    lines: [
      { speaker: 'narrator', name: 'UPPER ATMOSPHERE', cue: 'PRESSURE ENVELOPE ACCEPTED', text: 'The cloud wall opens on a civilisation suspended from mountains of warm gas. A thousand sails turn together to make room for one wounded ship.', cutaway: { image: ASSETS.cinematics.aeolianCity, label: 'AEROSTAT CONCORD', caption: 'Population: 4.2 million. Fixed ground: none.' } },
      { speaker: 'kiara-ndala', name: 'LIEUTENANT KIARA N’DALA', station: 'XENOLOGY', text: 'Their greeting has seventeen words for shelter and no direct word for ownership.' },
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', text: 'A vessel falling through our sky becomes our burden until it can choose a direction.' },
      { speaker: 'lena-mori', name: 'CHIEF LENA MORI', station: 'ENGINEERING', text: 'I could love these people.' },
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', text: 'Do not decide so quickly, engineer. Hospitality is not innocence. We have heard why the red ship follows you.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Then hear it from me before you decide whether we may stay.' },
    ],
    continueLabel: 'Meet the Keeper',
  },
  'b7-negotiation': {
    beat: 'BEAT 07', chapter: 'THE KEEPER OF WINDS', title: 'The Keeper’s condition', background: ASSETS.cinematics.aeolianCity,
    lines: [
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', cue: 'GUEST CHAMBER · ALL WEAPONS SEALED', text: 'We keep currents the way others keep histories. One can carry you across years of empty distance.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'SCIENCE', text: 'And if its containment fails?' },
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', text: 'It returns to the path it was taking and drags everything nearby with it.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Name the price.' },
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', text: 'Not a price. A boundary. The sphere remains sealed until its course is complete. You will tell your crew why. And you will tell me what happened at the Gate without the grammar of victory.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'There it is, Alexander. A way home that only works if command is trusted.' },
    ],
    choices: [
      { id: 'tell-keeper-truth', label: 'Tell the complete truth', detail: 'Describe the living signals, the order, and the people lost on both sides.' },
      { id: 'give-military-account', label: 'Give the military record', detail: 'Admit the destruction but defend the Gate as a strategic target.' },
      { id: 'conceal-sanctuary', label: 'Conceal what the scan showed', detail: 'Secure the current by withholding the fact most likely to cost it.' },
    ],
  },
  'b7-departure': {
    beat: 'BEAT 07', chapter: 'THE KEEPER OF WINDS', title: 'A storm folded small enough to carry', background: ASSETS.cinematics.aeolianCity,
    lines: [
      { speaker: 'narrator', name: 'CONTAINMENT CHAMBER', cue: 'SPATIAL CURRENT · STABLE', text: 'The storm condenses into a sphere no larger than two hands. Inside it, stars race toward a horizon that does not exist.', cutaway: { image: ASSETS.cinematics.sphereChamber, label: 'THE KEEPER’S CURRENT', caption: 'Seal integrity: 100%. Course not yet fixed.' } },
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', text: 'Your crew will see home inside it. That is what a current does: it shows the traveller where longing points.' },
      { speaker: 'kiara-ndala', name: 'LIEUTENANT KIARA N’DALA', station: 'XENOLOGY', text: 'How do we stop them believing the image is a promise?' },
      { speaker: 'keeper-aeolia', name: 'KEEPER AEOLIA', station: 'AEROSTAT CONCORD', text: 'You cannot. You can only make the truth stronger than the rumour.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'Captain, I have restricted access to command authorization. Seven crew have already asked me what you are hiding.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Then before we activate it, I speak to every deck.' },
    ],
    continueLabel: 'Carry the current aboard',
  },
  'b8-near-home': {
    beat: 'BEAT 08', chapter: 'THE FORBIDDEN SPHERE', title: 'A message from the life you left', background: ASSETS.cinematics.sphereChamber,
    lines: [
      { speaker: 'narrator', name: 'LONG-RANGE SENSORS', cue: 'FIRST CONSTELLATION MATCH · 73%', text: 'For the first time since the Gate, navigation recognizes three stars. The crew begins cheering before Helen can finish checking the date.', cutaway: { image: ASSETS.cinematics.sphereChamber, label: 'CURRENT CHAMBER', caption: 'The sphere is projecting a signal marked EARTH · 19 YEARS OLD.' } },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'The sphere has caught an old civilian broadcast. One name appears in Captain Vale’s family cipher.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Elara.' },
      { speaker: 'narrator', name: 'ELARA VALE · ARCHIVED RECORDING', cue: 'AGE 14 · SCHOOL ORAL HISTORY PROJECT', text: 'My father is Captain Alexander Vale. People say he ended the war. Mum says ending something is not the same as coming home.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'The recording is nineteen years old, Alexander. We do not know how much time the Gate cost us.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Play it again.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', cue: 'SECURITY OVERRIDE · CONTAINMENT DECK', text: 'I cannot. Someone has just opened the outer seal.' },
    ],
    continueLabel: 'Run to containment',
  },
  'b8-rupture': {
    beat: 'BEAT 08', chapter: 'THE FORBIDDEN SPHERE', title: 'The current escapes', background: ASSETS.cinematics.sphereRupture,
    lines: [
      { speaker: 'narrator', name: 'CONTAINMENT DECK', cue: 'SEAL FAILURE · GRAVITY CASCADE', text: 'The sphere opens. A vertical ocean of stars tears through the chamber and turns every loose object into a falling moon.', cutaway: { image: ASSETS.cinematics.sphereRupture, label: 'CONTAINMENT BREACH', caption: 'Course solution erased. Current expanding through the ship.' } },
      { speaker: 'lena-mori', name: 'CHIEF LENA MORI', station: 'ENGINEERING', text: 'Emergency fields are holding the room, not the current. We have ninety seconds before it chooses a direction for us.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'Two crew down. The opener used Vale’s authorization and wiped the local camera.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'SCIENCE', text: 'The home stars are gone. The sphere is pulling us away from every coordinate Aeolia gave us.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Mori, keep the hull together. Cross, nobody leaves this deck.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'The access log was fragmented, not destroyed. Four terminals hold pieces of the same lie.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Then we rebuild it while we still remember what home looked like.' },
    ],
    continueLabel: 'Reconstruct the access log',
  },
  'b8-judgment': {
    beat: 'BEAT 08', chapter: 'THE FORBIDDEN SPHERE', title: 'The first mutiny has a face', background: ASSETS.cinematics.sphereRupture,
    lines: [
      { speaker: 'narrator', name: 'CONTAINMENT DECK', cue: 'CURRENT DISCHARGED · POSITION UNKNOWN', text: 'The last of the current leaves through the damaged drive. Outside, every familiar star disappears again.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'Petty Officer Mara Venn opened the sphere. Eleven others shared the forged access. Half the deck knew something was planned.' },
      { speaker: 'isabella-corelli', name: 'DR ISABELLA CORELLI', station: 'MEDICAL', text: 'They believed Vale had hidden a way home for senior officers. They were wrong. They were not irrational.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'We asked this crew to obey a sealed door after secrets, casualties, and an enemy that speaks with the dead.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'Context explains mutiny. It does not make a ship survivable.' },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'They are waiting for a sentence. They are also waiting to learn whether the captain can include himself in it.' },
      { speaker: 'alexander-vale', name: 'CAPTAIN ALEXANDER VALE', station: 'COMMAND', text: 'Open the shipwide channel.' },
    ],
    choices: [
      { id: 'imprison-conspirators', label: 'Confine the conspirators', detail: 'Preserve order without making an example of frightened people.' },
      { id: 'forgive-conspirators', label: 'Forgive them publicly', detail: 'Accept the danger as a failure of trust and keep the crew together.' },
      { id: 'punish-opener', label: 'Punish the person who opened it', detail: 'Make one severe example to stop a second mutiny.' },
      { id: 'accept-command-blame', label: 'Accept command responsibility', detail: 'Confine the ringleaders, release the rest, and admit the secrecy began with Vale.' },
    ],
  },
} as const satisfies Partial<Record<string, DialogueSceneData>>

export const SLICE_TWO_SCENES = SCENES

function lastChoice(game: GameState, activityId: string): string | undefined {
  for (let index = game.decisions.length - 1; index >= 0; index--) {
    if (game.decisions[index].activityId === activityId) return game.decisions[index].choiceId
  }
  return undefined
}

export function nameConsequenceScene(game: GameState): DialogueSceneData {
  const choice = lastChoice(game, 'name-the-captain')
  const consequence = choice === 'give-real-name'
    ? 'Alexander Vale travels farther than the ship: ARGUS stamps the name into every copy of the record.'
    : choice === 'use-forged-name'
      ? 'ELIAS’s invented captain enters the dark. The real one remains on the bridge, feeling no safer.'
      : choice === 'confess-the-gate'
        ? 'The transmission carries Vale’s name beside the sanctuary dead. It is confession, challenge, and beacon at once.'
        : 'The Ithaca becomes the answer. Three hundred and twelve people now share the captain’s anonymity.'
  return {
    beat: 'BEAT 05', chapter: 'THE CAPTAIN GIVES HIS NAME', title: 'The answer travels', background: ASSETS.cinematics.argusTransmitter,
    lines: [
      { speaker: 'narrator', name: 'ARGUS TRANSMISSION', cue: 'PACKET RELEASED · LIGHT-SPEED PROPAGATION', text: consequence, cutaway: { image: ASSETS.cinematics.argusTransmitter, label: 'OUTBOUND CARRIER', caption: 'Destination: every receiver listening beyond the wrong stars.' } },
      { speaker: 'elias', name: 'ELIAS', station: 'SHIP SERVICE INTELLIGENCE', text: 'Transmission complete. We can still outrun information for a little while.' },
      { speaker: 'helen-morozova', name: 'DR HELEN MOROZOVA', station: 'EXECUTIVE OFFICER', text: 'Names are not only what enemies use to find us. They are how responsibility finds its owner.' },
      { speaker: 'gabriel-cross', name: 'COMMANDER GABRIEL CROSS', station: 'SECURITY', text: 'Then let it find us moving.' },
      { speaker: 'narrator', name: 'DEEP SENSOR ARRAY', cue: 'UNCLASSIFIED RESPONSE · 13 SECONDS', text: 'A pulse returns from the dark before any signal could have crossed the distance. It matches the final heartbeat of the Tide Gate.' },
    ],
    continueLabel: 'Listen to the reply',
  }
}

export function sacrificeAftermathScene(game: GameState): DialogueSceneData {
  const sacrificed = (lastChoice(game, 'sacrifice-system') ?? 'unknown-system').replaceAll('-', ' ')
  const base = SCENES['b6-aftermath']
  return {
    ...base,
    lines: base.lines.map((line, index) => index === 1
      ? { ...line, text: `The jump held because I cut ${sacrificed.toUpperCase()} out of the ship. Do not call it ballast. People served there. People built their lives around it.` }
      : line),
  }
}

export function tidefatherSignalScene(game: GameState): DialogueSceneData {
  const base = SCENES['b6-signal']
  const address = game.flags.includes('vale-used-false-identity')
    ? 'The name in your broadcast is an empty shell. Alexander Vale, I knew you before the machine learned to lie for you.'
    : game.flags.includes('vale-revealed-name')
      ? 'Alexander Vale. You gave the dark your name. I have crossed the silence made by your weapon to answer it.'
      : 'Alexander Vale. You named only your ship, but the sanctuary remembers the hand that gave the order.'
  return {
    ...base,
    lines: base.lines.map((line, index) => index === 3 ? { ...line, text: address } : line),
  }
}

export function nearHomeScene(game: GameState): DialogueSceneData {
  const base = SCENES['b8-near-home']
  const crewChoice = lastChoice(game, 'crew-suspicion')
  const consequence = crewChoice === 'open-sphere-records'
    ? 'Every crew-deck screen carries the same containment record. The cheering is cautious, but for once command and crew are looking at the same truth.'
    : crewChoice === 'tighten-security'
      ? 'Cross has sealed the containment deck behind armed watches. The cheering reaches the bridge through bulkheads already treated as battle lines.'
      : 'Vale promised the crew that the current points home. The first familiar stars make the promise feel true—before anyone has checked the date.'
  return {
    ...base,
    lines: [base.lines[0], { speaker: 'narrator', name: 'CREW DECK RECORD', text: consequence }, ...base.lines.slice(1)],
  }
}
