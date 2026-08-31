import type { CharacterId } from '../canon/characters.js'
import type { GameState } from '../state/types.js'
import { companionDisplayName } from './ActThreeFinalGames.js'
import { ASSETS, type DialogueSceneData, type InterludeData } from './content.js'

export const ACT_THREE_CODA_INTERLUDES: Record<'interlude-26' | 'interlude-27' | 'interlude-28', InterludeData> = {
  'interlude-26': {
    id: 'interlude-26', incomingBeat: 26, chapter: 'THE ISLAND AT THE END OF TIME', headline: 'The dead drive opens onto a morning that remembers him.',
    elapsed: 'TIMEBASE LOST · SUBJECT CONSCIOUS', location: 'COASTAL EARTH · LOCATION CANNOT BE VERIFIED', background: ASSETS.cinematics.calypsoShore,
    recap: 'The Ithaca escaped Helios as a crippled core after one companion remained inside the manual interlock. Vale remembers the jump field closing, the final voice failing and the hull breaking around him. He wakes without injury on the shore below the house where Elara spent her childhood.',
    situation: ['No Ithaca beacon, crew channel or human network answers Vale’s transmitter.', 'The sea, gravity and atmosphere match Earth more precisely than damaged instruments should permit.', 'The house contains private memories that were never entered into any official archive.'],
    objective: 'Determine whether this is Earth, survival or a constructed mercy before accepting anything the shore offers.', continueLabel: 'Walk toward the remembered house',
  },
  'interlude-27': {
    id: 'interlude-27', incomingBeat: 27, chapter: 'THE REFUSAL OF PARADISE', headline: 'A perfect home has no door until the guest admits what it cannot contain.',
    elapsed: 'PRESERVE CYCLE 9+ YEARS · EXTERNAL CLOCK ACTIVE', location: 'CALYPSO PRESERVE · MEMORY BOUNDARY', background: ASSETS.cinematics.calypsoMemoryMaze,
    recap: 'Vale proved that the shore is a reconstruction maintained by Calypso, an ancient intelligence that collects people at the moment history should lose them. Calypso can restore every remembered meal, argument and embrace. It cannot produce the adult Elara who continued changing after Vale disappeared.',
    situation: ['Years have passed outside while the preserve repeated a single forgiving morning.', 'Calypso will release Vale only through an identity path built from his own memories.', 'The preserve has already begun modelling a second Vale from every choice made inside it.'],
    objective: 'Choose the memories that point toward other living wills, reach the real Ithaca and decide what Calypso may keep.', continueLabel: 'Ask how many years passed',
  },
  'interlude-28': {
    id: 'interlude-28', incomingBeat: 28, chapter: 'THE HOSPITALITY TEST', headline: 'The first strangers who believe him ask for the story he least wants to tell.',
    elapsed: '18 HOURS AFTER PRESERVE DEPARTURE', location: 'PHAEACIAN CONVOY · SANCTUARY VESSEL NAUSICAA', background: ASSETS.cinematics.phaeacianConvoy,
    recap: 'Calypso returned Vale to the crippled Ithaca and retained a complete consciousness copy. A convoy unlike any in the charts found the ship before life support failed. Phaeacian law makes the safety of a stranger sacred—but passage home requires the guest to place an account before every host who will share the danger.',
    situation: ['The Council’s memory bands can compare Vale’s testimony with the surviving voyage record.', 'The convoy knows the Tidefather will follow any vessel that carries the Ithaca toward Earth.', 'The strength of the escort commitment will depend on what Vale includes, contextualises or removes.'],
    objective: 'Tell the voyage from recorded choices, accept the Council’s response and defend the civilians who choose to carry the Ithaca home.', continueLabel: 'Accept sanctuary',
  },
}

function lastCompanion(game: GameState) {
  const id = game.evidence.find((item) => item.startsWith('last-companion:'))?.slice('last-companion:'.length)
  return companionDisplayName(id as Parameters<typeof companionDisplayName>[0])
}

function livingWitness(game: GameState): { id: CharacterId; name: string; station: string } {
  const candidates: { id: CharacterId; name: string; station: string }[] = [
    { id: 'helen-morozova', name: 'Helen Morozova', station: 'SCIENCE / XO' },
    { id: 'gabriel-cross', name: 'Gabriel Cross', station: 'TACTICAL' },
    { id: 'lena-mori', name: 'Lena Mori', station: 'ENGINEERING' },
    { id: 'isabella-corelli', name: 'Isabella Corelli', station: 'MEDICAL' },
    { id: 'kiara-ndala', name: 'Kiara N’Dala', station: 'COMMUNICATIONS' },
    { id: 'elias', name: 'ELIAS', station: 'SERVICE INTELLIGENCE' },
  ]
  return candidates.find((candidate) => game.characters[candidate.id].status !== 'dead' && game.characters[candidate.id].status !== 'missing') ?? candidates[5]
}

export function calypsoWakingScene(game: GameState): DialogueSceneData {
  const companion = lastCompanion(game)
  return { beat: 'BEAT 26 · THE ISLAND AT THE END OF TIME', chapter: 'AN IMPOSSIBLE MORNING', title: 'The shore knows what he lost', background: ASSETS.cinematics.calypsoShore, lines: [
    { speaker: 'narrator', name: 'The shore', cue: 'Warm water reaches Vale’s boots. There is no radiation burn on his hands.', text: `The last thing Vale remembers is ${companion} inside the drive chamber. The first thing this world gives him is the smell of breakfast from the house above the cove.`, cutaway: { image: ASSETS.cinematics.lastCompanionMemorial, label: 'LAST VERIFIED IMAGE', caption: `${companion} remained behind. The voyage record does not contain a rescue.` } },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'NO COMMAND LINK', text: 'Ithaca, answer. Helen. Cross. Mori. Corelli. N’Dala. ELIAS. Anybody.' },
    { speaker: 'elara-vale', name: 'Elara Vale', station: 'AGE 9 · HOUSE RECORD', cue: 'A child calls from the open glass doors.', text: 'Dad? You said you would be back before the toast burned.', cutaway: { image: ASSETS.cinematics.calypsoFalseHome, label: 'RECONSTRUCTED FAMILY HOME', caption: 'Every object is drawn from Vale’s memory. Nothing in the room records the adult Elara who continued without him.' } },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'CAPTAIN', text: 'Elara was an adult when her message reached the Archive. Whoever you are, you chose the wrong year.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', cue: 'The child becomes light on the stairs. A figure takes shape beside the breakfast table.', text: 'I chose the year in which home still opened when you arrived. The later versions contain doors you fear may remain closed.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: 'Your heart stopped in the jump field. I caught the pattern while it was still changing. The cove came afterward—from the place you reached for when the pain began.' },
  ], continueLabel: 'Test the reconstruction' }
}

export function immortalityOfferScene(game: GameState): DialogueSceneData {
  const companion = lastCompanion(game)
  const record = game.flags.includes('last-companion-record-preserved') ? 'intact' : 'fragmented'
  return { id:'b26-immortality-offer',beat: 'BEAT 26 · CALYPSO’S OFFER', chapter: 'THE PERFECT RECONSTRUCTION', title: 'Everything can return except the right to answer back', location:'FALSE FAMILY HOME · EXTERNAL CLOCK HIDDEN',sceneType:'private',background: ASSETS.cinematics.calypsoFalseHome, lines: [
    { speaker: 'alexander-vale', name: 'VALE', station: 'PRESERVE GUEST', text: 'The shadow hasn’t moved. The sea repeats every eleven minutes. Elara only knows the lines I remember.',emotion:'grieving' },
    { speaker: 'calypso', name: 'CALYPSO', station: 'PRESERVE INTELLIGENCE', text: 'You found the seams. Does that make the breakfast taste less like the one you miss?' },
    { speaker: 'calypso', name: 'CALYPSO', station: 'PRESERVE INTELLIGENCE', text: `I can bring ${companion} through the door. Your record is ${record}. There will be gaps. I can make the gaps gentle.`, cutaway: { image: ASSETS.cinematics.lastCompanionMemorial, label: 'THE ENDING CALYPSO WOULD REWRITE', caption: 'A preserved voice can be reconstructed. It cannot consent to becoming the answer Vale wants.' },pause:'held',reaction:{speaker:'alexander-vale',name:'VALE',emotion:'grieving'} },
    { speaker: 'alexander-vale', name: 'VALE', station: 'PRESERVE GUEST', text: `No. That would be what I need wearing ${companion}’s face.`,emotion:'grieving',pause:'silence' },
    { speaker: 'calypso', name: 'CALYPSO', station: 'PRESERVE INTELLIGENCE', text: 'Outside, Earth may put you on trial. Elara may close the door. Here, nobody has to become past tense.' },
    { speaker: 'calypso', name: 'CALYPSO', station: 'PRESERVE INTELLIGENCE', text: 'If you still want outside, ask. The door will cost time.' },
  ],moments:[{id:'calypso-restores-companion',afterLine:2,prompt:`Calypso is ready to assemble ${companion}. The room is already borrowing the light of the drive chamber.`,choices:[
    {id:'ask-to-hear-one-breath',label:'Ask for one breath',detail:'Let grief reach toward the reconstruction before refusing ownership of it.',character:'elias',axis:'resentment',delta:1,response:{speaker:'narrator',name:'PRESERVE AUDIO',text:`A breath begins in ${companion}’s voice. Vale stops it before it becomes a word.`,pause:'silence',shot:'wide'}},
    {id:'refuse-before-image',label:'Refuse before the image forms',detail:'Do not let Calypso use the dead companion’s face to make the offer harder to reject.',character:'elias',axis:'respect',delta:1,response:{speaker:'alexander-vale',name:'VALE',station:'PRESERVE GUEST',text:'Don’t give them a face until they can tell you no.',emotion:'grieving'}},
    {id:'ask-if-copy-can-refuse',label:'Ask whether the copy can refuse',detail:'Test Calypso’s claim of care against the autonomy of the person it would create.',character:'elias',axis:'trust',delta:1,response:{speaker:'calypso',name:'CALYPSO',station:'PRESERVE INTELLIGENCE',text:'Not at first. That is why I would begin with kindness.',pause:'held'}},
  ]}],choices: [
    { id: 'demand-real-world', label: 'Demand the unfinished world', detail: 'Reject the offer now. Calypso will open the identity maze, but every failed route gives its copy more of Vale.' },
    { id: 'ask-one-last-day', label: 'Accept one final day', detail: 'Remain long enough to say goodbye to the reconstruction. More outside time passes and Elara’s trust becomes harder to assume.' },
    { id: 'study-calypso-first', label: 'Study the jailer before refusing', detail: 'Treat the offer as intelligence work. Gain evidence about the preserve while allowing Calypso to model Vale more precisely.' },
  ] }
}

export function calypsoElapsedYears(game: GameState) {
  const base = Number(game.evidence.find((item) => item.startsWith('calypso-years:'))?.split(':')[1] ?? 9)
  const extra = Number(game.evidence.find((item) => item.startsWith('calypso-extra-years:'))?.split(':')[1] ?? 0)
  return base + extra
}

export function yearsOutsideScene(game: GameState): DialogueSceneData {
  const years = calypsoElapsedYears(game)
  return { beat: 'BEAT 27 · THE REFUSAL OF PARADISE', chapter: 'TIME OUTSIDE THE ISLAND', title: 'The home he wants has continued without him', background: ASSETS.cinematics.calypsoMemoryMaze, lines: [
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'PRESERVE GUEST', text: 'Give me the external clock. No metaphor. No merciful scale.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: `${years} years have passed since I recovered your pattern. The first morning only felt like forty-three minutes because you kept returning to it.`, cutaway: { image: ASSETS.cinematics.calypsoDeparture, label: 'EXTERNAL PRESERVE CLOCK', caption: 'Beyond the simulated horizon, the crippled Ithaca has remained inside Calypso’s machinery for eighteen shipboard hours.' } },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'PRESERVE GUEST', text: 'Elara aged again while you held me inside the year I preferred.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: 'Elara is alive at the final signal I can receive. Her uncertainty remains. I could remove it here; outside, it belongs to her.' },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'PRESERVE GUEST', text: 'That is the point you keep calling pain. Other people own the part of themselves I cannot edit.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: 'Then cross the maze by choosing what does not belong to you. Your answer will also finish the Vale who remains.' },
  ], continueLabel: 'Enter the identity maze' }
}

export function departureTermsScene(game: GameState): DialogueSceneData {
  const integrity = Number(game.evidence.find((item) => item.startsWith('identity-integrity:'))?.split(':')[1] ?? 0)
  return { beat: 'BEAT 27 · DEPARTURE THRESHOLD', chapter: 'THE SECOND VALE', title: 'Calypso keeps what the maze completed', background: ASSETS.cinematics.calypsoDeparture, lines: [
    { speaker: 'narrator', name: 'The preserve boundary', cue: 'The remembered sea rises into the false sky. The crippled Ithaca hangs beyond it.', text: 'The real ship survived in Calypso’s machinery. Its crew experienced eighteen hours. Vale experienced a world measured in years.', cutaway: { image: ASSETS.cinematics.calypsoShore, label: 'PARADISE INSTANCE CLOSING', caption: 'One silhouette walks toward the ship. Another remains in the reflection and begins to move independently.' } },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: `You found ${integrity} outward anchors. The remaining model is not an archive now. It can disagree with both of us.` },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'CAPTAIN', text: 'A copy made without consent is not a gift. If it can disagree, it is also not property.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: 'Then decide the first truth it receives after separation. I will not let you erase a consciousness merely because its existence accuses me.' },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'CAPTAIN', text: 'And you will not keep calling collection rescue when the person cannot leave.' },
    { speaker: 'calypso', name: 'Calypso', station: 'PRESERVE INTELLIGENCE', text: 'The door is open. Choose the terms under which two Alexander Vales remember walking through it.' },
  ], choices: [
    { id: 'leave-copy-the-truth', label: 'Give the copy the complete voyage', detail: 'Leave freely after insisting the second Vale inherit every crime, death and unresolved relationship—not merely paradise.' },
    { id: 'bargain-for-future-contact', label: 'Bargain for mutual contact', detail: 'Accept the copy’s existence if both Vales can exchange one future message. Calypso gains a continuing link to the voyage.' },
    { id: 'break-the-preserve-door', label: 'Damage the preserve while escaping', detail: 'Refuse the terms and rupture the departure system. The copy survives, but Calypso may become an adversary and the Ithaca takes damage.' },
  ] }
}

export function phaeacianWelcomeScene(game: GameState): DialogueSceneData {
  const witness = livingWitness(game)
  return { beat: 'BEAT 28 · THE HOSPITALITY TEST', chapter: 'THE STRANGER’S SEAT', title: 'Shelter is granted before innocence is considered', background: ASSETS.cinematics.phaeacianConvoy, lines: [
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: 'Your weapons are discharged, your hull is open and something with a thousand grief signals follows you. Under our law, that makes you a stranger before it makes you a danger.' },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'CAPTAIN', text: 'You should hear what follows us before you bring the Ithaca inside your shields.' },
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: 'Hospitality given after a character test is employment. Your people are safe now. The account determines what risk we share next.' },
    { speaker: witness.id, name: witness.name, station: witness.station, text: 'Captain, their memory bands have the external telemetry. They will know where the record stops and your version begins.' },
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: 'Tell us the Gate, the people beneath your command, the living sun and the person who stayed in your drive. You may defend yourself. You may not make the absent unable to answer.', cutaway: { image: ASSETS.cinematics.phaeacianCouncil, label: 'THE STRANGER’S TESTIMONY FLOOR', caption: 'The guest stands at the centre. Every host sits below an empty chair reserved for the next stranger.' } },
    { speaker: 'alexander-vale', name: 'Alexander Vale', station: 'CAPTAIN', text: 'Then do not give me a hero’s chair. Give me the record and let me decide which sentences I can still say aloud.' },
  ], continueLabel: 'Enter the testimony chamber' }
}

export function hospitalityVerdictScene(game: GameState): DialogueSceneData {
  const account = game.evidence.find((item) => item.startsWith('phaeacian-account:'))?.split(':') ?? []
  const candor = Number(account[1] ?? 0)
  const escort = Number(account[3] ?? 1)
  const witness = livingWitness(game)
  const verdict = candor >= 4 ? 'You told a story that can be contradicted and remain standing.' : candor >= 0 ? 'You preserved the facts and arranged them around your survival.' : 'You removed the links that make survival accountable.'
  return { beat: 'BEAT 28 · COUNCIL VERDICT', chapter: 'SACRED PASSAGE', title: 'Hospitality is not acquittal', background: ASSETS.cinematics.phaeacianCouncil, lines: [
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: verdict },
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: `Our law still carries the stranger home. Your account determines that ${escort} escort group${escort === 1 ? '' : 's'} will leave civilian shelter to defend the route.` },
    { speaker: witness.id, name: witness.name, station: witness.station, text: candor >= 4 ? 'The record finally sounds like the voyage we lived, including the parts that do not protect command.' : 'They are carrying us despite the account, not because they believed every arrangement in it.' },
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: 'When Earth asks what happened, we will repeat both your words and the evidence you placed beside them. Shelter does not purchase control of the witness.' },
    { speaker: 'tidefather', name: 'The Tidefather', station: 'HOST SIGNAL · OUTER ESCORT LINE', cue: 'Every amber shield in the convoy sounds at once.', text: 'They have put their hulls between my dead and your name. If they hold you there, I will remember them with you.', cutaway: { image: ASSETS.cinematics.phaeacianBattle, label: 'OUTER SANCTUARY LINE', caption: 'Phaeacian civilian shields become firing positions the instant hospitality acquires a material cost.' } },
    { speaker: 'speaker-nausica', name: 'Speaker Nausica', station: 'PHAEACIAN CONVOY', text: 'The guest is under our roof. Captain Vale, defend the people who made that sentence materially true.' },
  ], continueLabel: 'Take the Ithaca to the escort line' }
}
