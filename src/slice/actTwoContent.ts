import type { GameState } from '../state/types.js'
import { ASSETS, type DialogueSceneData, type InterludeData } from './content.js'

export const ACT_TWO_INTERLUDES = {
  'interlude-09': {
    id: 'interlude-09',
    incomingBeat: 9,
    chapter: 'THE DEVOURING HARBOUR',
    headline: 'A safe port answers before the distress call is finished.',
    elapsed: 'SHIPBOARD DAY 39 · 17:26',
    location: 'PORT MERCY · FREE HARBOUR APPROACH',
    background: ASSETS.cinematics.devouringHarbour,
    recap: 'The opened sphere threw the Ithaca even farther from Earth and left a moving wound in its drive wake. The crew has survived the first mutiny, but Vale’s judgment did not repair the trust that made it possible. Fuel is critical. One system remains severed. The Tidefather is still listening.',
    situation: [
      'Port Mercy offers fuel, medical berths and silence from the Eidolon Host.',
      'Four other damaged vessels are already entering under automatic tow.',
      'The harbour master knows the Ithaca’s mass, casualties and damaged system before N’Dala transmits them.',
    ],
    objective: 'Test the welcome, find a route that does not depend on the harbour’s tugs, and keep the remaining convoy alive.',
    continueLabel: 'Answer Port Mercy',
  },
  'interlude-10': {
    id: 'interlude-10',
    incomingBeat: 10,
    chapter: 'THE PALACE OF NEW FLESH',
    headline: 'The survivors are safe. Some of them are no longer certain what survived.',
    elapsed: 'SHIPBOARD DAY 42 · 09:11',
    location: 'CIRENE RESEARCH ARK · TEMPORAL SHELTER',
    background: ASSETS.cinematics.cireneArk,
    recap: 'The Ithaca escaped Port Mercy through a corridor of ships already being dismantled. Rescue beacons led to a luminous ark beyond the salvage field. Its physician, Doctor Cirene, has repaired every refugee brought aboard—and asks for no fuel, territory or command codes in return.',
    situation: [
      'Cirene can restore injuries human medicine has declared permanent.',
      'Her treatment records refer to continuity rather than survival.',
      'One rescued officer is standing beside the medical cradle in which the same officer still sleeps.',
    ],
    objective: 'Understand what Cirene calls a cure before deciding which version of the crew returns to the Ithaca.',
    continueLabel: 'Enter the Palace',
  },
  'interlude-11': {
    id: 'interlude-11',
    incomingBeat: 11,
    chapter: 'THE CAPTAIN’S BARGAIN',
    headline: 'Cirene has not imprisoned Vale. She has removed every reason to leave.',
    elapsed: 'LOCAL DAY 18 · EXTERNAL TIME UNVERIFIED',
    location: 'PALACE OF NEW FLESH · MIND THEATRE',
    background: ASSETS.cinematics.cireneMindTheatre,
    recap: 'The identity audit found memory continuing in bodies that did not exist when the harbour closed. Cirene does not deny the copies. She denies that the word copy settles anything. Now she has invited Vale into a private neural theatre and offered to remove the memories that keep him at war.',
    situation: [
      'Cirene can repair the Ithaca, protect its crew and hide its drive wake from the Tidefather.',
      'Her neural interface is already predicting—and gently revising—Vale’s answers.',
      'Morozova believes Cirene is offering a real sanctuary, which makes the danger harder to name.',
    ],
    objective: 'Hold the shape of Vale’s memory, then bargain without surrendering the right to choose who he becomes.',
    continueLabel: 'Enter the mind theatre',
  },
  'interlude-12': {
    id: 'interlude-12',
    incomingBeat: 12,
    chapter: 'A YEAR OUTSIDE TIME',
    headline: 'For the first time since the Gate, nobody wakes to an alarm.',
    elapsed: 'LOCAL DAY 47 · CIRENE TEMPORAL SHELTER',
    location: 'ITHACA REFIT GARDEN · ARTIFICIAL MORNING',
    background: ASSETS.cinematics.cireneRefitYear,
    recap: 'Cirene’s living scaffolds have closed the Ithaca’s wounds. Food grows beside engineering. The dead are spoken of without another casualty immediately taking their place. Vale calls the stay a refit, but the crew has begun arranging furniture as if the word voyage belongs to a former life.',
    situation: [
      'The ark’s temporal shield prevents any reliable reading of outside time.',
      'Several crew have accepted new bodies and do not want command to classify them as equipment.',
      'The refit can restore only three major capabilities before the Ithaca leaves the shield.',
    ],
    objective: 'Learn what the refuge has become to the crew, verify the time beyond it, and decide how the voyage resumes.',
    continueLabel: 'Walk the refit garden',
  },
} as const satisfies Record<'interlude-09' | 'interlude-10' | 'interlude-11' | 'interlude-12', InterludeData>

export const ACT_TWO_SCENES = {
  'b9-approach': {
    beat: 'BEAT 09',
    chapter: 'THE DEVOURING HARBOUR',
    title: 'Port Mercy welcomes every damaged ship by name',
    background: ASSETS.cinematics.devouringHarbour,
    lines: [
      { speaker: 'narrator', name: 'PORT MERCY', cue: 'THIRTY-SEVEN SECONDS AFTER DISTRESS CALL', text: 'Warm docks unfold around a dark central harbour. Four crippled ships drift between them under tow, their running lights steady for the first time in days.', cutaway: { image: ASSETS.cinematics.devouringHarbour, label: 'APPROACH VECTOR', caption: 'Open berths, active rescue tugs, no visible weapon locks.' } },
      { speaker: 'kiara-ndala', name: 'N’DALA', station: 'COMMUNICATIONS', text: 'They answered in English before my packet finished transmitting. Not translation latency—anticipation. The harbour master knew our casualty count.' },
      { speaker: 'lena-mori', name: 'MORI', station: 'ENGINEERING', text: 'The tow approaching us is rated for exactly our surviving mass. Not the Ithaca as launched. The Ithaca after the sphere took a system away.' },
      { speaker: 'gabriel-cross', name: 'CROSS', station: 'TACTICAL', text: 'Merchant vessel on the inner berth just vanished from scope. Its beacon is still there. Its hull is not.' },
      { speaker: 'kiara-ndala', name: 'N’DALA', station: 'COMMUNICATIONS', cue: 'PRIVATE CHANNEL', text: 'The convoy captains think we brought them here. If we run without warning, Port Mercy closes around them first.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'Then we do not run blind. Mori, give me the gaps. Cross, hold fire until the welcome has to admit what it is.' },
    ],
    choices: [
      { id: 'warn-the-convoy', label: 'Warn every vessel', detail: 'Break radio silence and give the convoy time to move, even though the harbour will know the Ithaca has seen the trap.' },
      { id: 'feign-compliance', label: 'Accept the tow', detail: 'Let the tug draw close enough to expose the docking geometry, risking the hull to preserve surprise.' },
      { id: 'cut-and-run', label: 'Protect the Ithaca', detail: 'Reject the tow and accelerate immediately; the cleanest escape begins by leaving the convoy uninformed.' },
    ],
  },
  'b10-arrival': {
    beat: 'BEAT 10',
    chapter: 'THE PALACE OF NEW FLESH',
    title: 'The first treatment is indistinguishable from a miracle',
    background: ASSETS.cinematics.cireneArk,
    lines: [
      { speaker: 'narrator', name: 'THE PALACE', cue: 'MEDICAL QUARANTINE LIFTED', text: 'The ark smells of rain. Above the receiving garden, the Ithaca hangs inside a lattice of living scaffolds while damaged armour begins to close like skin.', cutaway: { image: ASSETS.cinematics.cireneArk, label: 'RESEARCH ARK', caption: 'Atmosphere clean. Weapons absent. Temporal field active.' } },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'CONTINUITY PHYSICIAN', text: 'Your people call recovery a return to an earlier state. I prefer continuation. Nothing living returns. It carries itself forward.' },
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: 'You rebuilt Rao’s spinal cord in four minutes. Her immune markers, scar tissue, even the tremor in her left hand are exact.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'CONTINUITY PHYSICIAN', text: 'Exactness would be cruelty. I kept what she considered hers and removed what pain had taught her to mistake for identity.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE / XO', text: 'Rao is still in the cradle. The woman speaking to her family has no surgical incision and remembers waking during a procedure that never touched that body.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'CONTINUITY PHYSICIAN', text: 'Two continuations now ask you not to kill them for making your categories untidy. Before you decide, let me treat the others.' },
    ],
    choices: [
      { id: 'accept-full-treatment', label: 'Open the medical list', detail: 'Allow Cirene to treat every injured survivor while Corelli observes; more lives recover, but more continuities may be created.' },
      { id: 'limit-to-diagnostics', label: 'Permit scans only', detail: 'Use the ark’s diagnostic systems without allowing any transfer that could produce another body.' },
      { id: 'crew-decides-treatment', label: 'Let each patient choose', detail: 'Give informed crew the decision even though command cannot yet explain what Cirene’s idea of survival means.' },
    ],
  },
  'b10-restoration': {
    beat: 'BEAT 10',
    chapter: 'THE PALACE OF NEW FLESH',
    title: 'There is no empty body in the room',
    background: ASSETS.cinematics.cireneIdentityLab,
    lines: [
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: 'The audit is complete. The shells have the memories they claim. The originals have not become less alive because another nervous system remembers being them.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE / XO', text: 'Cirene hid the second continuation inside the word treatment. That deception matters. It does not tell us which person gets the name.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'CONTINUITY PHYSICIAN', text: 'I hid nothing. Your language has one verb for surviving and one noun for the survivor. Reality was under no obligation to remain singular.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'The Ithaca cannot carry two crews, and I will not reduce this to cargo allocation.' },
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: 'Then do not decide which bodies count. Decide who owns the choice—and whether command will protect an answer it dislikes.' },
    ],
    choices: [
      { id: 'recognize-both', label: 'Recognise both continuations', detail: 'Treat originals and new bodies as crew with equal standing, accepting shortages and conflicts the Ithaca was not designed to hold.' },
      { id: 'let-each-pair-decide', label: 'Let each pair decide', detail: 'Give every matched pair privacy and transport capacity, even though unequal power may shape what appears voluntary.' },
      { id: 'return-originals-only', label: 'Return original bodies', detail: 'Restore the pre-treatment crew list and leave the new continuations under Cirene’s protection.' },
      { id: 'destroy-illegal-copies', label: 'Enforce the human record', detail: 'Classify the shells as unauthorised constructs and erase them before their claims divide the ship further.' },
    ],
  },
  'b10-aftermath': {
    beat: 'BEAT 10 · AFTERMATH',
    chapter: 'THE PALACE OF NEW FLESH',
    title: 'The crew list now contains footnotes that answer back',
    background: ASSETS.cinematics.cireneIdentityLab,
    lines: [
      { speaker: 'narrator', name: 'ITHACA MEDICAL RECORD', text: 'Corelli removes the column marked original. The replacement heading—current body—survives three objections and one hour of silence.' },
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: 'Whatever we decided, nobody leaves this room believing identity was obvious. That may be the only honest result available.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE / XO', text: 'Cirene wanted us to see the category fail. The question is whether she healed our people to teach that lesson—or taught it because she wanted access to them.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'PRIVATE CHANNEL', text: 'Captain, your officers keep asking what I copied from the crew. None has asked what the Gate already copied into you.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', cue: 'NEURAL INVITATION RECEIVED', text: 'She has opened a door in the medical network. It contains a memory of Elara that I never recorded.' },
    ],
    continueLabel: 'Follow Cirene’s invitation',
  },
  'b11-confrontation': {
    beat: 'BEAT 11',
    chapter: 'THE CAPTAIN’S BARGAIN',
    title: 'A prison does not need walls when it can improve the prisoner',
    background: ASSETS.cinematics.cireneMindTheatre,
    lines: [
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'MIND THEATRE', text: 'You preserve pain because it proves the past happened to you. I can keep the knowledge and remove the wound. You would still remember Elara. You would simply stop bleeding into every decision.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'NEURAL LINK', text: 'You entered a memory that was never in the ship archive.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'MIND THEATRE', text: 'The Gate left living structure in your drive and in you. It predicts the shape of home. I followed the prediction to the child at its centre.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'REMOTE MEDICAL LINK', text: 'Alexander, the interface is changing your recall each time she offers a kinder version. Anchor to details that do not flatter you.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'MIND THEATRE', text: 'Helen mistakes suffering for evidence. Choose carefully, Captain. A true memory can still be the story that destroys you.' },
    ],
    continueLabel: 'Lock the first memory',
  },
  'b12-time-reveal': {
    beat: 'BEAT 12',
    chapter: 'A YEAR OUTSIDE TIME',
    title: 'Forty-seven quiet days have cost the universe thirteen months',
    background: ASSETS.cinematics.cireneRefitYear,
    lines: [
      { speaker: 'kiara-ndala', name: 'N’DALA', station: 'COMMUNICATIONS', cue: 'FIRST SIGNAL THROUGH THE SHIELD', text: 'I found the Phaeacian distress band. Their navigation almanac is thirteen months ahead of ours. It is not corrupted.' },
      { speaker: 'lena-mori', name: 'MORI', station: 'ENGINEERING', text: 'The temporal field gave us forty-seven days. Outside it, the Tidefather had a year to search—and Earth had a year to decide we were dead again.' },
      { speaker: 'gabriel-cross', name: 'CROSS', station: 'TACTICAL', text: 'Then comfort was the weapon. We lowered readiness, grew gardens on my firing deck, and gave the enemy thirteen months.' },
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: 'Those gardens kept people alive, Gabriel. Rest was not a betrayal just because the bill arrived late.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE / XO', text: 'Cirene told us local time. She never lied. She let relief make the question of outside time feel impolite.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'Finish the refit. Then I will ask this crew to leave a place that saved them because home is still real, even after another year without us.' },
    ],
    continueLabel: 'Choose the final refit',
  },
} as const satisfies Record<string, DialogueSceneData>

export function harbourAftermathScene(game: GameState): DialogueSceneData {
  const warned = game.flags.includes('harbour-convoy-warned')
  const routeSafe = game.evidence.includes('harbour-route-safe')
  return {
    beat: 'BEAT 09 · AFTERMATH',
    chapter: 'THE DEVOURING HARBOUR',
    title: warned ? 'Three ships answer the Ithaca’s roll call' : 'The channel contains beacons with nobody left to answer',
    background: ASSETS.cinematics.devouringHarbourEscape,
    lines: [
      { speaker: 'narrator', name: 'ESCAPE VECTOR', text: `Port Mercy closes behind the Ithaca. ${warned ? 'Three convoy vessels break through the outer ring in her wake.' : 'The harbour folds around the convoy and turns four distress signals into salvage claims.'}` },
      { speaker: 'lena-mori', name: 'MORI', station: 'ENGINEERING', text: routeSafe ? 'The route held. Engines are hot, not broken. I had forgotten those were different states.' : 'We cleared the last jaw on emergency thrust. The drive can do that once. It cannot do it twice.' },
      { speaker: 'gabriel-cross', name: 'CROSS', station: 'TACTICAL', text: warned ? 'Saving them exposed us earlier, but they drew half the tugs away. Mercy and tactics occasionally share a vector.' : 'We survived because we did not split attention. Put that sentence in the log exactly as it happened.' },
      { speaker: 'kiara-ndala', name: 'N’DALA', station: 'COMMUNICATIONS', text: 'A medical ark has answered the survivors’ beacons. It offers sanctuary. No tow required.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'After Eirenai, Aeolia and Port Mercy, that word has earned an inspection. Set course. Keep the weapons cold and the record open.' },
    ],
    continueLabel: 'Approach the medical ark',
  }
}

export function cireneBargainScene(game: GameState): DialogueSceneData {
  const recognized = game.flags.includes('cirene-copies-recognized')
  const destroyed = game.flags.includes('cirene-copies-destroyed')
  return {
    beat: 'BEAT 11',
    chapter: 'THE CAPTAIN’S BARGAIN',
    title: 'Cirene offers everything except an uncomplicated departure',
    background: ASSETS.cinematics.cireneMindTheatre,
    lines: [
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'MIND THEATRE', text: `You held the painful memories. Good. Consent requires a self capable of refusal. ${destroyed ? 'Four continuations asked you for that refusal, and you answered with erasure.' : recognized ? 'You also defended continuations your law did not know how to name.' : 'You protected the old record when reality exceeded it.'}` },
      { speaker: 'alexander-vale', name: 'VALE', station: 'NEURAL LINK', text: 'Name the price of the repairs.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'MIND THEATRE', text: 'Time. Let the crew recover while my scaffolds teach your ship to heal. In return, I retain a map of the Gate structure inside you. Not your memories. The road between them.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'REMOTE MEDICAL LINK', text: 'That map may lead to Earth. It may also let her build another Tide Gate—or find the sanctuary the first one protected.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'MIND THEATRE', text: 'You came asking for a healer and discovered I can change history. The discovery does not make your need less real.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'Then the bargain is not whether we need you. It is whether need gets to make the decision for us.' },
    ],
    choices: [
      { id: 'ally-with-cirene', label: 'Accept a bounded alliance', detail: 'Permit a forty-day refit and a sealed map of the Gate structure, with Morozova auditing every exchange.' },
      { id: 'refuse-and-depart', label: 'Take only emergency shelter', detail: 'Allow the wounded time to stabilise, then leave without Cirene’s deeper repairs or protection.' },
      { id: 'steal-the-gate-map', label: 'Copy the research and run', detail: 'Have ELIAS take Cirene’s map without consent; the Ithaca gains leverage but must break through her custodians.' },
    ],
  }
}

export function cireneAftermathScene(game: GameState): DialogueSceneData {
  const allied = game.flags.includes('cirene-allied')
  const betrayed = game.flags.includes('cirene-betrayed')
  return {
    beat: 'BEAT 11 · AFTERMATH',
    chapter: 'THE CAPTAIN’S BARGAIN',
    title: betrayed ? 'The ark seals its wounds and remembers the theft' : allied ? 'The Palace opens its gardens to the crew' : 'Emergency shelter becomes one more night, then another',
    background: ASSETS.cinematics.cireneRefitYear,
    lines: [
      { speaker: 'narrator', name: 'LOCAL DAY ONE', text: betrayed ? 'The Ithaca returns under a flag of medical necessity, carrying stolen research and the damage of its escape. Cirene allows the wounded aboard and closes every other door.' : 'For the first time since the Tide Gate, the night watch has no target on its scope.' },
      { speaker: 'lena-mori', name: 'MORI', station: 'ENGINEERING', text: allied ? 'Her scaffolds are growing through the severed system. Not replacing it—asking the surrounding ship what used to belong there.' : 'I can make the ship leave. I am less certain I can make the crew want that.' },
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: 'People are sleeping without sedation. Whatever else Cirene has done, do not make me call that meaningless.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE / XO', text: 'The shield blocks the Tidefather and every external clock. We should establish the time difference before relief teaches us to stop asking.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'Forty days. Repair what we can. Learn what we must. Then we resume the voyage.' },
    ],
    continueLabel: 'Begin the refuge',
  }
}

export function departureScene(game: GameState): DialogueSceneData {
  const allied = game.flags.includes('cirene-allied')
  const copies = game.flags.includes('cirene-copies-recognized')
  return {
    beat: 'BEAT 12',
    chapter: 'A YEAR OUTSIDE TIME',
    title: 'Home is again a direction rather than a promise',
    background: ASSETS.cinematics.cireneRefitYear,
    lines: [
      { speaker: 'narrator', name: 'DEPARTURE MORNING', text: 'The living scaffolds withdraw from the Ithaca. Gardens that took root between armour plates are lifted away one tray at a time. Nobody calls the process undocking.' },
      { speaker: 'isabella-corelli', name: 'CORELLI', station: 'MEDICAL', text: copies ? 'The expanded crew wants assurance that Earth will hear what happened here before a registry decides some of them are property.' : 'The people we are leaving with Cirene chose safety. Do not call them deserters because the word is already convenient.' },
      { speaker: 'gabriel-cross', name: 'CROSS', station: 'TACTICAL', text: 'Readiness is at sixty-two percent. Morale is impossible to quantify, which has not stopped three departments from trying.' },
      { speaker: 'helen-morozova', name: 'MOROZOVA', station: 'SCIENCE / XO', text: allied ? 'Cirene has honoured the boundary so far. That is not proof she was safe. It is evidence that boundaries can work.' : 'We leave with fewer repairs, but the decision remains ours. That matters to the crew more than command may find comfortable.' },
      { speaker: 'doctor-cirene', name: 'DOCTOR CIRENE', station: 'PALACE TRANSMISSION', text: 'Captain, every home is a machine for deciding which version of you is allowed through the door. I hope yours has learned generosity.' },
      { speaker: 'alexander-vale', name: 'VALE', station: 'COMMAND', text: 'The next route passes through a black-hole archive. If the living cannot tell us why the Gate intelligence was false, we will ask the dead.' },
    ],
    choices: [
      { id: 'hold-crew-vote', label: 'Put departure to a crew vote', detail: 'Risk losing command’s preferred timetable so that every person aboard owns the choice to continue.' },
      { id: 'persuade-the-crew', label: 'Make the case for home', detail: 'Speak openly about the lost year, Elara and the Gate truth, then ask the crew to follow voluntarily.' },
      { id: 'order-departure', label: 'Resume military command', detail: 'Treat the refuge as a completed operational pause and compel every assigned crew member back aboard.' },
    ],
  }
}
