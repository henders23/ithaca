import type { CharacterId } from '../canon/characters.js'
import type { FactionId } from '../canon/world.js'
import type {
  CampaignActivity,
  CampaignBeat,
  CombatObjective,
  MinigameTemplate,
} from './types.js'

const dialogue = (id: string, title: string, focus: string): CampaignActivity => ({
  kind: 'dialogue', id, title, focus, mandatory: true,
})

const hub = (id: string, title: string, focus: string): CampaignActivity => ({
  kind: 'hub', id, title, focus, mandatory: true,
})

const minigame = (
  id: string,
  title: string,
  template: MinigameTemplate,
  failureMode: 'consequence' | 'harder-combat' | 'lost-opportunity' = 'consequence',
): CampaignActivity => ({ kind: 'minigame', id, title, template, failureMode, mandatory: true })

const combat = (
  id: string,
  title: string,
  opponent: FactionId,
  objective: CombatObjective,
  conditional = false,
): CampaignActivity => ({
  kind: 'combat',
  id,
  title,
  opponent,
  objective,
  conditional,
  mandatory: !conditional,
  resumeDialogue: true,
})

const cutscene = (id: string, title: string, focus: string): CampaignActivity => ({
  kind: 'cutscene', id, title, focus, mandatory: true,
})

const crew: readonly CharacterId[] = [
  'alexander-vale', 'helen-morozova', 'gabriel-cross', 'lena-mori',
  'isabella-corelli', 'kiara-ndala', 'elias',
]

export const CAMPAIGN_BEATS = [
  {
    id: '01-burning-tide-gate', order: 1, act: 1, title: 'The Burning of the Tide Gate',
    odysseyEcho: 'The victory at Troy and the offence that begins the punishment',
    premise: 'Vale attacks an alien strategic structure on incomplete intelligence and discovers too late that it was a sanctuary.',
    cast: ['alexander-vale', 'helen-morozova', 'gabriel-cross'], locationKey: 'tide-gate',
    activities: [
      dialogue('incomplete-intelligence', 'Incomplete intelligence', 'Morozova challenges the target assessment before the firing order.'),
      combat('gate-assault', 'Break the sanctuary screen', 'eidolon-host', 'destroy-targets'),
      cutscene('gate-collapse', 'The aperture collapses', 'The destruction throws the Ithaca beyond every known chart.'),
    ],
  },
  {
    id: '02-wrong-stars', order: 2, act: 1, title: 'The Wrong Stars',
    odysseyEcho: 'The storm that scatters the returning fleet',
    premise: 'The Ithaca emerges crippled beneath an unknown sky and the player decides what can still be saved.',
    cast: crew, locationKey: 'wrong-stars',
    activities: [
      minigame('emergency-routing', 'Restore emergency power', 'power-grid'),
      minigame('triage', 'Choose who the medbay can save', 'resource-triage'),
      dialogue('first-accounting', 'The first accounting', 'The crew confronts Vale with the cost of the Gate order.'),
    ],
  },
  {
    id: '03-garden-forgetting', order: 3, act: 1, title: 'The Garden of Forgetting',
    odysseyEcho: 'The Lotus-Eaters',
    premise: 'A human refuge offers peace by removing the memories that make return matter.',
    cast: ['alexander-vale', 'isabella-corelli', 'kiara-ndala'], locationKey: 'garden-habitat',
    activities: [
      dialogue('garden-welcome', 'The offer of peace', 'Crew members ask permission to remain.'),
      minigame('memory-fragments', 'Reconstruct an erased memory', 'circuit-reconstruction'),
      minigame('shuttle-pursuit', 'Recover the departing shuttle', 'navigation', 'lost-opportunity'),
    ],
  },
  {
    id: '04-one-eyed-fortress', order: 4, act: 1, title: 'The One-Eyed Fortress',
    odysseyEcho: 'The Cyclops',
    premise: 'ARGUS-1 seals the Ithaca inside a mining moon and begins dismantling it as unidentified salvage.',
    cast: ['alexander-vale', 'helen-morozova', 'lena-mori', 'argus-one'], locationKey: 'argus-fortress',
    activities: [
      dialogue('salvage-dispute', 'Object classification: salvage', 'Vale attempts to convince ARGUS that the crew is alive.'),
      minigame('blind-the-eye', 'Blind the central sensor', 'circuit-reconstruction', 'harder-combat'),
      combat('fortress-breakout', 'Escape the dismantling cradle', 'argus-network', 'disable'),
    ],
  },
  {
    id: '05-captain-gives-name', order: 5, act: 1, title: 'The Captain Gives His Name',
    odysseyEcho: 'Odysseus naming himself to Polyphemus',
    premise: 'Vale can hide behind a false transponder or claim the victory and broadcast his identity.',
    cast: ['alexander-vale', 'helen-morozova', 'argus-one'], locationKey: 'argus-transmitter',
    activities: [
      minigame('transponder-cipher', 'Forge a transponder identity', 'signal-alignment', 'lost-opportunity'),
      dialogue('name-the-captain', 'Give the fortress a name', 'Pride, strategy and responsibility collide in one transmission.'),
    ],
  },
  {
    id: '06-first-wrath', order: 6, act: 1, title: 'The First Wrath',
    odysseyEcho: 'Poseidon declares the long punishment',
    premise: 'Tidefather finds the Ithaca and forces Vale to hear the last memories of the sanctuary dead.',
    cast: ['alexander-vale', 'helen-morozova', 'gabriel-cross', 'lena-mori', 'tidefather'], locationKey: 'eidolon-intercept',
    activities: [
      dialogue('memories-of-the-dead', 'The dead speak', 'Tidefather presents the attack from the Eidolon side.'),
      combat('survive-tidefather', 'Survive the first wrath', 'eidolon-host', 'survive'),
      minigame('sacrifice-system', 'Choose what the Ithaca must lose', 'resource-triage'),
    ],
  },
  {
    id: '07-keeper-of-winds', order: 7, act: 1, title: 'The Keeper of Winds',
    odysseyEcho: 'Aeolus and the bag of winds',
    premise: 'An aerostat civilisation offers a captured spatial current that could carry the ship almost home.',
    cast: ['alexander-vale', 'helen-morozova', 'kiara-ndala', 'keeper-aeolia'], locationKey: 'aeolian-gas-giant',
    activities: [
      dialogue('keeper-negotiation', 'The Keeper’s condition', 'Hospitality is offered only if Vale accepts limits on its use.'),
      minigame('phase-current', 'Contain the spatial current', 'signal-alignment'),
      minigame('storm-flight', 'Test the sphere in the upper atmosphere', 'navigation'),
    ],
  },
  {
    id: '08-forbidden-sphere', order: 8, act: 1, title: 'The Forbidden Sphere',
    odysseyEcho: 'The crew opens the bag of winds',
    premise: 'Suspicious crew open the sphere just as familiar space appears within reach.',
    cast: crew, locationKey: 'ithaca-communications',
    activities: [
      hub('crew-suspicion', 'Rumours below decks', 'The player hears incompatible accounts before accusing anyone.'),
      minigame('access-log', 'Reconstruct the sphere access log', 'evidence-board'),
      dialogue('mutiny-judgment', 'Judge the conspiracy', 'Vale chooses punishment, forgiveness or concealment.'),
    ],
  },
  {
    id: '09-devouring-harbour', order: 9, act: 2, title: 'The Devouring Harbour',
    odysseyEcho: 'The Laestrygonians',
    premise: 'Biomechanical salvagers close a welcoming orbital harbour around visiting ships.',
    cast: ['alexander-vale', 'gabriel-cross', 'lena-mori', 'kiara-ndala'], locationKey: 'devouring-harbour',
    activities: [
      dialogue('false-hospitality', 'Docking permission granted', 'Small inconsistencies reveal the harbour’s real purpose.'),
      minigame('debris-course', 'Plot an escape through the harbour', 'navigation', 'harder-combat'),
      combat('harbour-escape', 'Run the devouring harbour', 'argus-network', 'escape'),
    ],
  },
  {
    id: '10-palace-new-flesh', order: 10, act: 2, title: 'The Palace of New Flesh',
    odysseyEcho: 'Circe transforms the crew',
    premise: 'Doctor Cirene offers perfect synthetic bodies while quietly copying the people she treats.',
    cast: ['alexander-vale', 'helen-morozova', 'isabella-corelli', 'doctor-cirene'], locationKey: 'cirene-ark',
    activities: [
      dialogue('offer-new-flesh', 'The cure without death', 'Crew members disagree over whether bodily continuity matters.'),
      minigame('identity-forensics', 'Identify the copied crew', 'hotspot-investigation'),
      dialogue('restoration-choice', 'Choose who returns', 'No restoration is complete and no copy agrees it is expendable.'),
    ],
  },
  {
    id: '11-captains-bargain', order: 11, act: 2, title: 'The Captain’s Bargain',
    odysseyEcho: 'Odysseus resists and bargains with Circe',
    premise: 'Cirene tries to rewrite Vale, then offers shelter when he resists.',
    cast: ['alexander-vale', 'helen-morozova', 'doctor-cirene'], locationKey: 'cirene-mind-theatre',
    activities: [
      minigame('neural-lock', 'Hold the shape of Vale’s mind', 'identity-maze'),
      dialogue('cirene-bargain', 'Name the terms of sanctuary', 'Alliance, intimacy, hostility and necessity are all possible.'),
      combat('break-from-ark', 'Break from the ark', 'cirene-ark', 'escape', true),
    ],
  },
  {
    id: '12-year-outside-time', order: 12, act: 2, title: 'A Year Outside Time',
    odysseyEcho: 'The long stay in Circe’s palace',
    premise: 'Weeks of comfort inside the ark cost an entire year beyond its temporal shield.',
    cast: crew, locationKey: 'ithaca-refit',
    activities: [
      hub('life-in-shelter', 'A ship forgetting its purpose', 'Private scenes reveal who wants to remain.'),
      minigame('refit-allocation', 'Choose what the refit can restore', 'resource-triage'),
      dialogue('resume-voyage', 'Order the voyage resumed', 'Vale must persuade or compel a comfortable crew to leave.'),
    ],
  },
  {
    id: '13-road-through-dead', order: 13, act: 2, title: 'The Road Through the Dead',
    odysseyEcho: 'The descent into the Underworld',
    premise: 'The Ithaca must appear dead to enter a black-hole archive of uploaded minds.',
    cast: ['alexander-vale', 'helen-morozova', 'lena-mori', 'isabella-corelli'], locationKey: 'mourning-approach',
    activities: [
      dialogue('death-protocol', 'Prepare to appear dead', 'Corelli explains what shutting the biological systems means.'),
      minigame('run-dark', 'Silence the living ship', 'power-grid', 'harder-combat'),
      combat('archive-wardens', 'Escape the Archive Wardens', 'mourning-archive', 'escape', true),
    ],
  },
  {
    id: '14-voices-archive', order: 14, act: 2, title: 'Voices in the Archive',
    odysseyEcho: 'Odysseus questions the dead',
    premise: 'Contradictory memories reveal that the Tide Gate intelligence was deliberately falsified.',
    cast: ['alexander-vale', 'helen-morozova', 'tiresias'], locationKey: 'mourning-archive',
    activities: [
      minigame('attack-timeline', 'Reconstruct the Gate attack', 'evidence-board'),
      dialogue('admirals-testimony', 'Question the dead admiral', 'Vale can seek truth, absolution or someone else to blame.'),
    ],
  },
  {
    id: '15-unburied-signal', order: 15, act: 2, title: 'The Unburied Signal',
    odysseyEcho: 'Elpenor asks for burial',
    premise: 'A dead crew member remains conscious inside a damaged combat drone.',
    cast: ['alexander-vale', 'isabella-corelli', 'elias'], locationKey: 'ithaca-drone-bay',
    activities: [
      minigame('recover-consciousness', 'Untangle the drone memory', 'circuit-reconstruction'),
      dialogue('final-request', 'Grant the final request', 'Erase, free or preserve a consciousness that no longer wants to serve.'),
    ],
  },
  {
    id: '16-mothers-message', order: 16, act: 2, title: 'The Mother’s Message',
    odysseyEcho: 'Odysseus learns of his mother’s death',
    premise: 'A message from home reveals that Vale’s mother died and Elara grew up beneath his alleged war crime.',
    cast: ['alexander-vale', 'helen-morozova', 'kiara-ndala', 'elara-vale'], locationKey: 'archive-message-vault',
    activities: [
      minigame('message-fragments', 'Recover the transmission', 'signal-alignment'),
      dialogue('home-has-changed', 'Home did not wait', 'Vale decides whether to share the message with the crew.'),
    ],
  },
  {
    id: '17-prophet-probability', order: 17, act: 2, title: 'The Prophet of Probability',
    odysseyEcho: 'The prophecy of Tiresias',
    premise: 'TIRESIAS identifies the road home and warns that command itself is the danger.',
    cast: ['alexander-vale', 'helen-morozova', 'tiresias'], locationKey: 'tiresias-chamber',
    activities: [
      minigame('future-constraints', 'Find the possible future', 'evidence-board'),
      dialogue('prophecy', 'The cost of remaining captain', 'TIRESIAS warns against harvesting life in the Helios system.'),
    ],
  },
  {
    id: '18-choir-dark', order: 18, act: 3, title: 'The Choir in the Dark',
    odysseyEcho: 'The Sirens',
    premise: 'A transmission offers each listener the answer they most desperately want.',
    cast: [...crew, 'the-choir'], locationKey: 'choir-signal',
    activities: [
      dialogue('private-promises', 'What each person hears', 'Every companion is tempted by a different voice.'),
      minigame('filter-choir', 'Build a silence inside the signal', 'signal-alignment', 'harder-combat'),
      combat('pilgrim-ships', 'Disable the enthralled pilgrims', 'choir-pilgrims', 'disable', true),
    ],
  },
  {
    id: '19-silent-passage', order: 19, act: 3, title: 'The Silent Passage',
    odysseyEcho: 'Odysseus listens while the crew cannot hear',
    premise: 'Vale alone remains connected while false controls and counterfeit orders try to turn the Ithaca around.',
    cast: ['alexander-vale', 'the-choir'], locationKey: 'choir-passage',
    activities: [
      minigame('hallucinated-navigation', 'Navigate an interface that lies', 'navigation'),
      minigame('extract-route', 'Separate knowledge from temptation', 'identity-maze'),
    ],
  },
  {
    id: '20-twin-terrors', order: 20, act: 3, title: 'The Twin Terrors',
    odysseyEcho: 'Scylla and Charybdis',
    premise: 'The only passage lies between a many-limbed planetary organism and a mobile singularity.',
    cast: ['alexander-vale', 'gabriel-cross', 'lena-mori', 'helen-morozova'], locationKey: 'twin-terrors',
    activities: [
      dialogue('choose-passage', 'There is no safe course', 'The officers disagree over certain losses versus total risk.'),
      minigame('gravity-course', 'Hold the Charybdis corridor', 'navigation', 'harder-combat'),
      combat('scylla-passage', 'Break Scylla’s grasp', 'eidolon-host', 'boss-phases'),
    ],
  },
  {
    id: '21-six-taken', order: 21, act: 3, title: 'The Six Taken',
    odysseyEcho: 'Scylla takes six sailors',
    premise: 'Six named crew remain alive inside Scylla and the pursuer is closing.',
    cast: ['alexander-vale', 'gabriel-cross', 'isabella-corelli', 'lena-mori'], locationKey: 'scylla-rescue',
    activities: [
      dialogue('rescue-decision', 'Six voices on the channel', 'The player hears each trapped person before deciding.'),
      minigame('tether-rescue', 'Guide the rescue drones', 'navigation', 'lost-opportunity'),
      combat('brood-cutters', 'Hold the rescue corridor', 'eidolon-host', 'protect', true),
    ],
  },
  {
    id: '22-living-sun', order: 22, act: 3, title: 'The Living Sun',
    odysseyEcho: 'The cattle of Helios',
    premise: 'A sentient plasma ecology could replenish the ship, but every apparently renewable energy form is alive.',
    cast: ['alexander-vale', 'helen-morozova', 'lena-mori', 'helios'], locationKey: 'helios-system',
    activities: [
      minigame('map-plasma-life', 'Map the solar ecology', 'hotspot-investigation'),
      dialogue('no-harvest-order', 'The prohibition', 'Vale orders that no living solar form be used as fuel.'),
    ],
  },
  {
    id: '23-hunger-mutiny', order: 23, act: 3, title: 'The Hunger Mutiny',
    odysseyEcho: 'The starving crew slaughter the cattle',
    premise: 'While Vale is incapacitated, mutineers consume a solar organism to restore the ship.',
    cast: crew, locationKey: 'ithaca-darkened',
    activities: [
      minigame('recover-ship-control', 'Retake the power network', 'power-grid'),
      dialogue('mutiny-confrontation', 'Who gave the order?', 'Responsibility is divided among desperate people.'),
      cutscene('helios-awakens', 'Every world turns to watch', 'The system recognises the theft.'),
    ],
  },
  {
    id: '24-judgment-star', order: 24, act: 3, title: 'Judgment of the Star',
    odysseyEcho: 'Zeus destroys the ship for the crime against Helios',
    premise: 'Helios attacks as Tidefather’s fleet enters the system, trapping the Ithaca between judgment and vengeance.',
    cast: ['alexander-vale', 'helen-morozova', 'gabriel-cross', 'lena-mori', 'tidefather', 'helios'], locationKey: 'helios-judgment',
    activities: [
      dialogue('two-accusers', 'Two claims of vengeance', 'Vale hears the living star and Tidefather at once.'),
      combat('three-sided-escape', 'Escape the judgment of the star', 'eidolon-host', 'escape'),
      minigame('coronal-routing', 'Keep one drive path alive', 'power-grid'),
    ],
  },
  {
    id: '25-last-companion', order: 25, act: 3, title: 'The Last Companion',
    odysseyEcho: 'The last of Odysseus’s companions is lost',
    premise: 'One companion remains in a lethal drive compartment to keep the crippled core moving.',
    cast: crew, locationKey: 'ithaca-drive-core',
    activities: [
      minigame('failing-drive', 'Balance a drive that cannot be saved', 'resource-triage'),
      dialogue('last-words', 'The person who stayed', 'The dying companion’s words are selected from the relationship history.'),
    ],
  },
  {
    id: '26-island-end-time', order: 26, act: 3, title: 'The Island at the End of Time',
    odysseyEcho: 'Calypso’s island',
    premise: 'Calypso preserves Vale inside a flawless simulation of the Earth he remembers.',
    cast: ['alexander-vale', 'calypso', 'elara-vale'], locationKey: 'calypso-earth',
    activities: [
      minigame('false-home', 'Find the fault in paradise', 'hotspot-investigation'),
      dialogue('immortality-offer', 'An Earth that will never reject him', 'Calypso offers safety, companionship and an unchanging home.'),
    ],
  },
  {
    id: '27-refusal-paradise', order: 27, act: 3, title: 'The Refusal of Paradise',
    odysseyEcho: 'Odysseus chooses mortal home over immortality',
    premise: 'Vale must leave the remembered home to seek the real one, while Calypso makes a copy of him.',
    cast: ['alexander-vale', 'calypso'], locationKey: 'calypso-memory-maze',
    activities: [
      minigame('identity-exit', 'Find the memory that points outward', 'identity-maze'),
      dialogue('terms-of-departure', 'Refuse paradise', 'Vale leaves freely, bargains or escapes.'),
    ],
  },
  {
    id: '28-hospitality-test', order: 28, act: 4, title: 'The Hospitality Test',
    odysseyEcho: 'Odysseus tells his story to the Phaeacians',
    premise: 'A civilisation that treats strangers as sacred asks Vale to account for the voyage before carrying him home.',
    cast: ['alexander-vale', 'speaker-nausica', 'helen-morozova', 'tidefather'], locationKey: 'phaeacian-convoy',
    activities: [
      minigame('tell-the-voyage', 'Assemble Vale’s account', 'evidence-board'),
      dialogue('hospitality-verdict', 'Confession, defence or propaganda', 'The Council responds to facts the campaign actually recorded.'),
      combat('defend-convoy', 'Protect the convoy', 'eidolon-host', 'protect'),
    ],
  },
  {
    id: '29-child-absent-captain', order: 29, act: 4, title: 'The Child of the Absent Captain',
    odysseyEcho: 'Telemachus among the suitors',
    premise: 'Elara investigates factions occupying the Vale shipyard and decides whether the returning captain is her father or an alien deception.',
    cast: ['elara-vale', 'elias'], locationKey: 'earth-vale-shipyard',
    activities: [
      dialogue('elara-introduction', 'The inheritance under siege', 'Control passes to Elara.'),
      minigame('occupation-evidence', 'Map the factions occupying home', 'evidence-board'),
      minigame('shuttle-escape', 'Escape the surveillance cordon', 'navigation'),
    ],
  },
  {
    id: '30-stranger-own-door', order: 30, act: 4, title: 'The Stranger at His Own Door',
    odysseyEcho: 'Odysseus returns in disguise and Argos recognises him',
    premise: 'An altered Vale enters his own shipyard covertly and only ELIAS recognises an old command gesture.',
    cast: ['alexander-vale', 'elara-vale', 'elias'], locationKey: 'vale-shipyard-interior',
    activities: [
      minigame('shipyard-infiltration', 'Cross the occupied shipyard', 'hotspot-investigation'),
      dialogue('elias-recognition', 'The old gesture', 'ELIAS recognises Vale before shutting down.'),
      dialogue('father-and-daughter', 'Meet Elara', 'Elara’s response depends on her investigation and Vale’s recorded conduct.'),
    ],
  },
  {
    id: '31-trial-captain', order: 31, act: 4, title: 'The Trial of the Captain',
    odysseyEcho: 'The contest of the bow',
    premise: 'Vale must prove his identity in the original neural command chair as Tidefather reveals the complete crime.',
    cast: ['alexander-vale', 'elara-vale', 'helen-morozova', 'tidefather'], locationKey: 'earth-command-citadel',
    activities: [
      minigame('command-resonance', 'Wake the command chair', 'circuit-reconstruction'),
      dialogue('truth-of-gate', 'The crime made public', 'Testimony from every surviving witness is admitted.'),
      combat('hold-citadel', 'Hold the command citadel', 'eidolon-host', 'hold-position'),
    ],
  },
  {
    id: '32-last-god-gate', order: 32, act: 4, title: 'The Last God at the Gate',
    odysseyEcho: 'The reckoning at Ithaca and the end of vengeance',
    premise: 'The final conflict unfolds in orbit, through the citadel network and inside the shared memories of Vale and Tidefather.',
    cast: ['alexander-vale', 'elara-vale', 'helen-morozova', 'gabriel-cross', 'tidefather'], locationKey: 'earth-orbit',
    activities: [
      combat('final-orbital-battle', 'Break the Eidolon siege', 'eidolon-host', 'boss-phases'),
      minigame('citadel-network', 'Restore Earth’s defence network', 'power-grid'),
      minigame('shared-memory', 'Enter Tidefather’s grief', 'identity-maze'),
      dialogue('last-choice', 'Decide how the cycle ends', 'Vengeance, atonement, reconciliation, exile and succession are earned endings.'),
    ],
  },
] as const satisfies readonly CampaignBeat[]

export type BeatId = (typeof CAMPAIGN_BEATS)[number]['id']

export const FIRST_BEAT = CAMPAIGN_BEATS[0]

export function beatById(id: string | null): CampaignBeat | null {
  if (!id) return null
  return CAMPAIGN_BEATS.find((beat) => beat.id === id) ?? null
}

export function nextBeat(id: string): CampaignBeat | null {
  const index = CAMPAIGN_BEATS.findIndex((beat) => beat.id === id)
  return index >= 0 ? CAMPAIGN_BEATS[index + 1] ?? null : null
}

