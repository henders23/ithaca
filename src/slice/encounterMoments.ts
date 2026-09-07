import type { CampaignEffect, GameState } from '../state/types.js'
import type { PortraitId } from './content.js'
import type { WeaponId } from './combatRules.js'
import type { CombatBark } from './CinematicCombat.js'

/** The homecoming is voiced by people present there, even if any original officer died. */
export const HOMECOMING_BARKS: Readonly<Record<string, readonly CombatBark[]>> = {
  '28': [
    { id: 'shield-break', trigger: 'shield-break', speaker: 'NAUSICA', text: 'Your shield has gone dark. Stay inside our turn; I can still see you.' },
    { id: 'hull-40', trigger: 'hull-40', speaker: 'NAUSICA', text: 'Captain, answer. Just a word. We are still following.' },
    { id: 'adapt', trigger: 'adapt', speaker: 'NAUSICA', text: 'The hunters are splitting their fire. Keep one eye on the second track.' },
    { id: 'first-evade', trigger: 'first-evade', speaker: 'NAUSICA', text: 'Clear. The children on our forward deck cheered that turn.' },
  ],
  '31': [
    { id: 'shield-break', trigger: 'shield-break', speaker: 'ELARA', text: 'Your shields, Dad. Look at your shields.' },
    { id: 'hull-40', trigger: 'hull-40', speaker: 'ELARA', text: 'You got as far as the door. You don’t get to stop here.' },
    { id: 'adapt', trigger: 'adapt', speaker: 'ELARA', text: 'They’re firing in pairs now. I’ve marked the second launch.' },
    { id: 'disrupt', trigger: 'disrupt', speaker: 'ELARA', text: 'The archive can hear again. Keep that channel quiet.' },
  ],
  '32': [
    { id: 'shield-break', trigger: 'shield-break', speaker: 'ELARA', text: 'I can see the impacts from down here. Route power back to shields.' },
    { id: 'hull-40', trigger: 'hull-40', speaker: 'ELARA', text: 'Stay on the channel. I am not listening to another empty carrier.' },
    { id: 'adapt', trigger: 'adapt', speaker: 'ELARA', text: 'The ring has a second firing track. Watch for the volley.' },
    { id: 'first-evade', trigger: 'first-evade', speaker: 'ELARA', text: 'That missed. I saw it miss. Do that again.' },
  ],
}

export interface BattleChoice {
  id: string
  label: string
  response: string
  memory: string
  charge: number
  shield: number
  weaponLockMs: number
  enemyDelayMs: number
}

export interface EncounterMoment {
  id: string
  title: string
  speaker: PortraitId
  line: string
  threat: string
  pattern: readonly WeaponId[]
  choices: readonly [BattleChoice, BattleChoice]
}

const choice = (id: string, label: string, response: string, memory: string, charge: number, shield: number, weaponLockMs = 0, enemyDelayMs = 0): BattleChoice =>
  ({ id, label, response, memory, charge, shield, weaponLockMs, enemyDelayMs })

/** Each encounter changes the question being asked of the captain. No timed reading. */
export const ENCOUNTER_MOMENTS: Readonly<Record<string, EncounterMoment>> = {
  '01': {
    id: '01', title: 'Someone is answering the weapons.', speaker: 'kiara-ndala',
    line: 'That pulse repeats after every shot. Wait—there are pauses where an answer should go. I can keep the carrier, but I need the firing bus.',
    threat: 'Guardians alternate lance and ion fire. Their final salvo is kinetic.', pattern: ['lance', 'ion', 'lance', 'missile'],
    choices: [
      choice('keep-carrier', 'Give her the firing bus', 'I have it. There’s a voice under the defence tone. I can’t tell you whose.', 'N’Dala kept the unanswered carrier from inside the Tide Gate.', -20, 0, 4500, 0),
      choice('burn-opening', 'Keep the firing window', 'All right. I’ll keep listening on what’s left.', 'Vale held the firing window while N’Dala lost the inner carrier.', 40, -25),
    ],
  },
  '04': {
    id: '04', title: 'The machine has a blind side.', speaker: 'elias',
    line: 'Maintenance cycle. Six seconds. ARGUS will open its own exhaust doors to cool the cutter. I can make us look like waste heat. It will be an undignified exit.',
    threat: 'ARGUS fires two cutting lances, then a heavy cutter salvo.', pattern: ['lance', 'lance', 'missile'],
    choices: [
      choice('waste-heat', 'Let ELIAS take us through', 'I have classified you as a maintenance error. Please remain convincing.', 'ELIAS smuggled the captain through ARGUS as a maintenance error.', 0, 15, 3000, 5500),
      choice('cut-cradle', 'Blow the restraints now', 'Then please avoid the door marked structural. That door is structural.', 'Vale broke the cradle under fire instead of taking ELIAS’s maintenance route.', 45, -20),
    ],
  },
  '06': {
    id: '06', title: 'It knows which way you will turn.', speaker: 'lena-mori',
    line: 'Its next shot is waiting at our jump bearing. I can throw out a hot drive echo. Or I can keep the power here and pray Cross breaks the lock. Your call. Quickly—no, take a breath first.',
    threat: 'The Tidefather strips shields with ion blooms before firing kinetic tracks.', pattern: ['ion', 'ion', 'missile'],
    choices: [
      choice('drive-echo', 'Cast a false drive echo', 'There. It followed the heat. Nobody tell the drive how close that was.', 'Mori sent a false drive echo into the Tidefather’s waiting shot.', -30, 0, 1500, 6000),
      choice('hold-bearing', 'Hold the bearing and fire', 'Holding. I hope you can see something I can’t.', 'Vale held his jump bearing and trusted the guns to break pursuit.', 50, -30),
    ],
  },
  '09': {
    id: '09', title: 'The docks are learning your route.', speaker: 'lena-mori',
    line: 'Those jaws are moving before we turn. The tugs share our course. I can vent the coolant reserve across their sensors, but the guns will need time to cool themselves.',
    threat: 'Tugs alternate heavy cutters and tractor-disrupting ion shots.', pattern: ['missile', 'ion', 'missile', 'lance'],
    choices: [
      choice('white-wake', 'Leave a white wake', 'Sensors blind. Keep moving. For once the leak is supposed to be there.', 'A shuttle followed the Ithaca’s white coolant trail through the harbour jaws.', -15, 10, 4000, 6000),
      choice('ram-window', 'Force the gap before it closes', 'Weapons have the reserve. After this, Engineering gets the last word.', 'Vale spent shield reserve on a hard burst through the harbour jaws.', 50, -30),
    ],
  },
  '11': {
    id: '11', title: 'The ark turns its patients toward you.', speaker: 'isabella-corelli',
    line: 'Those lights behind the ribbons are occupied wards. Cirene knows we can see them. I can mark every bed on your sights. Give me four seconds with weapons quiet.',
    threat: 'Custodians open with repeated ion tethers; a lance follows each pair.', pattern: ['ion', 'ion', 'lance'],
    choices: [
      choice('mark-wards', 'Let Corelli mark the wards', 'Done. The beds are off your firing lines. I wish every hospital came with that switch.', 'Corelli marked the occupied wards before the escape fire resumed.', -10, 20, 4000, 4500),
      choice('cut-tethers', 'Use the existing narrow solution', 'Then hold that line. I’m watching the windows.', 'Vale kept the narrow firing solution while Corelli watched the ward windows.', 35, -15),
    ],
  },
  '20': {
    id: '20', title: 'It lets go with one hand.', speaker: 'gabriel-cross',
    line: 'Scylla just opened its outer grip. I don’t like gifts with teeth. We can coast into the shadow—or spend our shield reserve tearing through the opening.',
    threat: 'Scylla alternates kinetic grasps with ion sweeps; the second grasp comes fast.', pattern: ['missile', 'ion', 'missile'],
    choices: [
      choice('coast-shadow', 'Coast inside its shadow', 'Cold guns. Small ship. For the next few seconds, try to look unappetising.', 'Cross guided the ship into Scylla’s shadow with the guns cold.', -20, 15, 4000, 5000),
      choice('tear-grip', 'Tear through the open grip', 'All batteries. If it closes that hand, it closes on light.', 'The Ithaca burned its shield reserve to tear through Scylla’s open grip.', 50, -30),
    ],
  },
  '24': {
    id: '24', title: 'Two enemies. One shadow.', speaker: 'kiara-ndala',
    line: 'The nursery is moving across the Host’s firing line. Neither side will fire through it yet. There is a shadow behind it wide enough for us. We have to stop shooting to use it.',
    threat: 'Solar ion surges alternate with Eidolon kinetic fire.', pattern: ['ion', 'missile', 'ion', 'lance'],
    choices: [
      choice('nursery-shadow', 'Follow the nursery’s shadow', 'They’re passing over the windows. Don’t touch anything. Let them go.', 'The ship followed a living nursery through the crossfire without firing.', -25, 20, 5000, 6500),
      choice('outside-arc', 'Fight along the outer arc', 'Outer arc clear of life. Marking the Host alone.', 'Vale took the exposed outer arc and kept every nursery shoal outside the sights.', 45, -25),
    ],
  },
  '28': {
    id: '28', title: 'A host offers you their last shield.', speaker: 'speaker-nausica',
    line: 'Our escort can cover your next turn. The families behind us will feel the shield thinning. Tell me where you need us; they have already agreed to stay.',
    threat: 'Hunters use ion markers to prepare paired lance attacks.', pattern: ['ion', 'lance', 'lance'],
    choices: [
      choice('share-cover', 'Accept their cover; cool the guns', 'Turn now, Captain. We have you.', 'The Phaeacians thinned their own shelter to cover the Ithaca’s turn.', -15, 30, 3000, 4000),
      choice('take-point', 'Keep their shield with the families', 'Then we will follow your light. Come back through it.', 'The Ithaca took point while the Phaeacian shield stayed with the families.', 45, -25),
    ],
  },
  '31': {
    id: '31', title: 'They are shooting the witnesses.', speaker: 'elara-vale',
    line: 'The next volley is lined up on the public archive. I can move the witness feed through your shield lattice. Your guns go quiet while it transfers. Or you get one shot at their relay.',
    threat: 'The vanguard uses kinetic salvos after an ion erasure pulse.', pattern: ['ion', 'missile', 'missile'],
    choices: [
      choice('carry-witnesses', 'Carry the witness feed', 'Transfer complete. They’re still speaking. Now clear my sky.', 'Elara carried the witness feed through the Ithaca while its guns stayed silent.', -20, 15, 4500, 5000),
      choice('relay-burst', 'Take the shot at their relay', 'Sending you the relay bearing. One clean line. Use it.', 'Vale spent the shield reserve on Elara’s narrow relay solution.', 50, -30),
    ],
  },
  '32': {
    id: '32', title: 'Earth is inside the firing solution.', speaker: 'elara-vale',
    line: 'The Host is using the defence ring as a backstop. Every missed salvo lands at home. I can turn the ring out of your sights. You have to hold fire while I do it.',
    threat: 'The siege cycles through all three weapons. Watch the pattern, not the scale of the ship.', pattern: ['lance', 'ion', 'missile'],
    choices: [
      choice('give-elara-sky', 'Give Elara time to move the ring', 'Ring is turning. Hold. Hold. There—you have your sky.', 'Vale held fire while Elara moved Earth’s defence ring out of the sights.', -25, 25, 5000, 6000),
      choice('close-range', 'Close until every shot has a backstop', 'Close range confirmed. The ring is clear. Now stay alive long enough to come down here.', 'The Ithaca closed against the Host so Earth could no longer catch a missed shot.', 55, -35),
    ],
  },
}

export function encounterForBeat(beat: string): EncounterMoment | undefined {
  return ENCOUNTER_MOMENTS[/BEAT\s+(\d+)/i.exec(beat)?.[1] ?? '']
}

export function battleChoiceCost(choice: BattleChoice): string {
  return [
    choice.charge ? `${choice.charge > 0 ? '+' : '−'}${Math.abs(choice.charge)} charge` : '',
    choice.shield ? `${choice.shield > 0 ? '+' : '−'}${Math.abs(choice.shield)} shields` : '',
    choice.weaponLockMs ? `guns quiet ${choice.weaponLockMs / 1000}s` : '',
    choice.enemyDelayMs ? `next launch at least ${choice.enemyDelayMs / 1000}s away` : '',
  ].filter(Boolean).join(' · ')
}

export function shouldOfferMoment(elapsed: number, progress: number, answered: boolean): boolean {
  return !answered && progress < 100 && (elapsed >= 8000 || progress >= 35)
}

export interface BattleDecision { encounterId: string; choiceId: string }

export function battleMemoryEffects(result: { decision?: BattleDecision }): CampaignEffect[] {
  const decision = result.decision
  if (!decision || !ENCOUNTER_MOMENTS[decision.encounterId]?.choices.some(choice => choice.id === decision.choiceId)) return []
  return [{ kind: 'add-evidence', evidenceId: `battle-choice:${decision.encounterId}:${decision.choiceId}` }]
}

export function battleMemories(game: Pick<GameState, 'evidence'>) {
  return game.evidence.flatMap(record => {
    const [kind, beat, id] = record.split(':')
    const encounter = ENCOUNTER_MOMENTS[beat]
    const selected = encounter?.choices.find(choice => choice.id === id)
    return kind === 'battle-choice' && selected ? [{ beat, title: encounter.title, text: selected.memory }] : []
  })
}

export interface BattleResources { charge: number; shield: number; elapsed: number; weaponLockUntil: number; nextAttackAt: number }

export function applyBattleChoice<T extends BattleResources>(state: T, choice: BattleChoice): T {
  return { ...state,
    charge: Math.max(0, Math.min(100, state.charge + choice.charge)),
    shield: Math.max(0, Math.min(100, state.shield + choice.shield)),
    weaponLockUntil: Math.max(state.weaponLockUntil, state.elapsed + choice.weaponLockMs),
    nextAttackAt: Math.max(state.nextAttackAt, state.elapsed + choice.enemyDelayMs),
  }
}
