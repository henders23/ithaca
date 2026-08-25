# Playable vertical slice

The first four campaign beats form one continuous playable episode. Dialogue, minigames and combat all write to the same deterministic campaign state; the game autosaves after every transition. A cinematic voyage interlude connects every beat with a recap, current situation, remembered consequence and explicit next objective so the player always understands why the next set piece is happening.

## Sequence

| Beat | Narrative set piece | Player action | Persistent consequence |
| --- | --- | --- | --- |
| 01 · The Burning of the Tide Gate | Vale decides whether incomplete biological telemetry is enough to stop the attack. | Dialogue choice, then real-time-with-pause combat against an Eidolon screen guardian. | Morozova/Cross trust, pursuit pressure, hull damage and the Tide Gate scar. |
| 02 · The Wrong Stars | The crippled Ithaca emerges beyond every known chart. | Eight-unit power-routing puzzle, limited-slot medical triage and the first crew reckoning. | Restored or lost systems, named survivors and whether Vale releases the Gate record. |
| 03 · The Garden of Forgetting | A human refuge offers peace by dissolving traumatic memory. | Memory-sequence reconstruction and an optional arcade shuttle pursuit. | Crew desertion, Corelli trust and chase damage. |
| 04 · The One-Eyed Fortress | ARGUS-1 begins dismantling the ship as salvage. | Dialogue exploit, waveform circuit puzzle and breakout combat against recovery cutters. | Puzzle failure adds an alerted combat phase; escape yields the ARGUS exhaust key. |

## Controls

- Dialogue and choices: pointer or keyboard focus.
- Combat: select a subsystem, then fire a charged rail lance, kinetic salvo or ion shear. Each weapon has its own projectile, travel timing, impact, shield response and synthesized sound. Pause is available from the tactical header or the spacebar.
- Shuttle chase: `A` / `D`, left / right arrows, or the on-screen controls.
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

Assets live under `public/assets/` and are compressed to keep the first load practical. Minigames reuse these environments as dimmed diegetic backdrops and add task-specific instrumentation: animated reactor routing, patient vitals, a neural reconstruction display, a cinematic chase HUD and ARGUS targeting optics.
