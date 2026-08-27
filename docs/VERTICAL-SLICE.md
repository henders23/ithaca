# Playable vertical slice

The first twelve campaign beats form one continuous playable campaign: complete Act I and the first four beats of Act II. Dialogue, hubs, minigames and combat all write to the same deterministic campaign state; the game autosaves after every transition. A cinematic voyage interlude connects every beat with a recap, current situation, remembered consequence and explicit next objective so the player always understands why the next set piece is happening.

## Sequence

| Beat | Narrative set piece | Player action | Persistent consequence |
| --- | --- | --- | --- |
| 01 · The Burning of the Tide Gate | Vale decides whether incomplete biological telemetry is enough to stop the attack. | Dialogue choice, then real-time-with-pause combat against an Eidolon screen guardian. | Morozova/Cross trust, pursuit pressure, hull damage and the Tide Gate scar. |
| 02 · The Wrong Stars | The crippled Ithaca emerges beyond every known chart. | Eight-unit power-routing puzzle, limited-slot medical triage and the first crew reckoning. | Restored or lost systems, named survivors and whether Vale releases the Gate record. |
| 03 · The Garden of Forgetting | A human refuge offers peace by dissolving traumatic memory. | Memory-sequence reconstruction and an optional arcade shuttle pursuit. | Crew desertion, Corelli trust and chase damage. |
| 04 · The One-Eyed Fortress | ARGUS-1 begins dismantling the ship as salvage. | Dialogue exploit, waveform circuit puzzle and breakout combat against recovery cutters. | Puzzle failure adds an alerted combat phase; escape yields the ARGUS exhaust key. |
| 05 · The Captain Gives His Name | ARGUS broadcasts the identity of the ship that escaped. | Transponder-cipher puzzle and a four-way identity decision. | Vale may reveal his name, forge one, name only the ship, or transmit a confession; each changes trust and pursuit. |
| 06 · The First Wrath | The Tidefather forces the crew to experience the sanctuary’s final memories. | Dialogue response, timed survival combat and an irreversible system-sacrifice procedure. | A chosen ship system is destroyed; the crew remembers both Vale’s answer and the human cost of escape. |
| 07 · The Keeper of Winds | A civilisation of cloud cities offers a captured spatial current. | Trust negotiation, four-vane containment puzzle and a real-time storm flight. | Honesty changes crew trust; the Ithaca gains the Aeolian sphere and may take hull/engine damage during its test. |
| 08 · The Forbidden Sphere | Rumour becomes conspiracy as familiar stars appear within reach. | Four-character crew hub, gradual home revelation, rupture cutscene, causal-log puzzle and mutiny judgment. | The route home is lost, pursuit intensifies, and Vale chooses punishment, forgiveness or shared responsibility. |
| 09 · The Devouring Harbour | Port Mercy answers the distress call before it is fully transmitted, then closes around the arriving convoy. | Consequential approach dialogue, four-layer route planning and objective combat against tractor locks and salvage tugs. | Convoy survival, N’Dala/Cross trust, hull damage and the difficulty of the escape battle reflect the route. |
| 10 · The Palace of New Flesh | Cirene heals the harbour survivors while creating new bodies that remember being them. | Treatment decision, four-case identity forensics and a personhood judgment after the evidence. | Copies are recognised, left with Cirene or destroyed; Corelli, Morozova and Cirene remember the choice. |
| 11 · The Captain’s Bargain | Cirene offers to remove the wounds inside Vale’s memories and asks for the Gate map embedded between them. | Four-round neural identity lock and an alliance/refusal/theft choice; theft launches an optional custodian escape battle. | Cirene becomes ally, uneasy host or betrayed adversary; Vale’s neural integrity and Gate research persist. |
| 12 · A Year Outside Time | The crew recover inside the ark until an external carrier reveals that thirteen months passed in forty-seven local days. | Four-character refuge hub, time-reveal scene, selective living-technology refit and departure decision. | Three ship capabilities are restored, Cirene’s technology remains aboard, and the crew follows by vote, persuasion or order. |

## Controls

- Dialogue and choices: pointer or keyboard focus.
- Combat: select a subsystem, then fire a charged rail lance, kinetic salvo or ion shear. Each weapon has its own projectile, travel timing, impact, shield response and synthesized sound. Pause is available from the tactical header or the spacebar.
- Shuttle chase: `A` / `D`, left / right arrows, or the on-screen controls.
- Storm flight: the same movement controls, but the player must align with luminous current gates rather than dodge obstacles.
- Survival combat: suppress living-ship subsystems to reduce incoming pressure and endure until the jump countdown reaches zero; the Tidefather cannot be destroyed.
- Crew hub: hear at least three private perspectives before deciding how Vale answers the rumour.
- Harbour route: choose one corridor through each closing layer; live risk and convoy capacity determine combat conditions and aftermath.
- Identity forensics: reveal evidence layers, classify each body record, then audit before the story asks what the classifications mean morally.
- Neural lock: preserve one of two competing accounts across four memory anchors while the rewrite meter records convenient revisions.
- Refuge hub: hear at least three crew perspectives—including Morozova—before opening the external clock.
- Refit allocation: select exactly three living-technology growth cycles; current integrity and human consequences are visible before commitment.
- All other minigames use pointer or keyboard focus.

## Cinematic scene language

Dialogue scenes are paced as exchanges rather than briefings. The vertical slice now establishes a personal want, introduces an anomaly, lets the crew disagree about its meaning, escalates an external clock, and only then asks for a decision. Short stage cues and framed visual cutaways reveal tactical information without turning character speech into exposition.

Future beats should follow the same dramatic rhythm where appropriate:

1. Let the player inhabit a quiet objective or human relationship.
2. Introduce one incomplete or apparently harmless detail.
3. Allow different characters to interpret that detail differently.
4. Add time pressure only after the disagreement is understood.
5. Make the player decide before the full truth is available.
6. Give the consequence its own aftermath scene before the next activity.

The interface responds to both width and height. Laptop-height layouts reduce portrait scale, dialogue padding, minigame instrumentation and combat HUD density while keeping all decisions visible; smaller screens collapse image cutaways before sacrificing playable controls.

## Visual asset direction

The vertical slice uses original generated imagery rather than assets copied from `starship-explorer`. The art direction is photorealistic prestige science fiction: grounded military-NASA human engineering, steel-and-amber bridge lighting, and increasingly unfamiliar alien geometry. Cinematic backgrounds are 16:9 WebP files; recurring-character portraits are consistently framed 4:5 WebP files; combat ships are transparent PNGs.

Assets live under `public/assets/` and are compressed to keep the first load practical. Act II adds a predatory industrial harbour, an ivory-and-cyan biotechnology ark, an identity laboratory, a memory theatre, the transformed Ithaca refit garden, Doctor Cirene and two distinct combat craft. Minigames reuse these environments as dimmed diegetic backdrops and add task-specific instrumentation: animated reactor routing, patient vitals, neural reconstruction, cinematic flight HUDs, ARGUS optics, transponder masking, ship-system severance, spatial-current containment, causal evidence, route planning, continuity forensics and selective living-ship restoration.
