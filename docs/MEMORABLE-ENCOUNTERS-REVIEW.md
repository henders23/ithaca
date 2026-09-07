# Memorable encounters — implementation and adversarial review

Scope: improve the existing complete campaign's excitement, character specificity and continuity. This is a focused release, not a claim of measured “10×” improvement or AAA production quality.

## What changed

All ten combat encounters have an authored command-channel interruption. The player can read at their own pace, compare two explicit tactical costs, hear the character's reply and deliberately resume the battle. Enemy weapon sequences differ by opponent. Existing target weaknesses, ion disruption, power routing, projectiles, shield bracing and survival objectives remain active.

Orders change charge, shields, gun availability and the earliest next enemy launch. These values are clamped; no choice silently repairs hull. A delayed launch cannot erase an airborne projectile. The selected order appears in the result and the Journey Log, and is persisted through the existing deterministic activity effects.

The opening carrier decision changes both N’Dala's immediate report and the public trial. Venting coolant in the harbour can give one shuttle a route out even after the captain initially abandoned the convoy. Elara recalls how the final orbital battle was handled. These are specific callbacks, not a generic morality score.

Refuge conversations plant Mori's leaking kettle, Morozova's blue notebook tabs, Corelli's follow-up sheet and Cross's unopened bottle. Farewells use private requests and unfinished thoughts; Cross can recall the player's opening bottle exchange. Memorial dialogue describes everyday reactions to absence. Homecoming combat chatter uses Elara and Nausica so the chosen dead companion cannot speak again.

## Adversarial findings and fixes

| Failure sought | Finding and resolution |
| --- | --- |
| Leave the battle paused with a shot in flight | Wall-clock callbacks could still hit. Impacts, volleys, regrowth and victory now use simulation time. Pause, background visibility and the Journey Log hold that clock. |
| Follow the printed dodge instruction | The cue could arrive too early and vanish on launch. It now tracks impact time through flight and offers brace when the burn is cooling. |
| Read a tactical interruption slowly | The clock holds through both the choice and response; the player resumes explicitly. Guns visibly count down any required hold. |
| Lose and retry after selecting an order | Retry clears the decision, delayed impacts, cooldowns and effects. Only a completed battle writes the campaign memory. |
| Change a relationship inside a scene built from state | Recreated scene objects rewound dialogue. Progress now resets on scene identity; text reveal depends on the current text and position. |
| Press Skip while text is appearing | A pending timer could hide already revealed words. Skip now cancels that timer. |
| Reload and select a different response | Restored dialogue choices remain selected. New records include a moment ID, and the reducer rejects an alternate response to the same moment. Legacy records remain readable. |
| Press Enter on Transcript | The scene could also advance. Native controls are isolated from scene shortcuts; transcript focus is contained and Escape closes it. |
| Open the log during autoplay | The underlying conversation now waits. Closing the log resumes from the same line. |
| Hear an officer after their death | Homecoming barks no longer use the default pre-loss crew. Memorial and trial speaker continuity is checked for all five companion deaths. |

## Verification

- `npm test`: 137 tests across 15 files, including 30 React/DOM interaction tests.
- All ten **actual campaign combat configurations**, with **both** choices: engage, reach the interruption, choose, resume, fire through the visible controls, complete, save the battle memory, and replay the resulting action log. The tests do not inject victory or manipulate combat internals.
- Focused tests cover airborne pause, hidden documents, the impact cue and keyboard burn, reading time, weapon hold, retry, journal suspension, text skip, scene recreation, reload, duplicate rejection, transcript input and autoplay.
- Story tests cover early/late callbacks, absent evidence, both harbour outcomes, all companion deaths, portrait existence and reserve clamping.
- `npm run build`: TypeScript and Vite production build. The existing single-bundle size warning remains; the output is about 202 kB gzip of JavaScript.
- `git diff --check`: clean.

## Limits and next evidence needed

This was a source review plus automated interaction testing, not an independent human playtest. The cloud browser rejected access to the local preview (`ERR_BLOCKED_BY_CLIENT`), so this release has **no new screenshot-based viewport sign-off**. The new command panel has bounded height, scrolling, smaller portrait framing on phones, visible costs and reduced-motion rules; those rules still need rendered laptop and phone inspection.

The interaction tests prove the battle branches can complete from their fixture conditions. They do not measure excitement, long-session pacing, performance on low-end hardware, or every possible accumulated hull state. A useful next playtest asks players to explain a dilemma before choosing, recall a crew member's private detail later, and identify where attention drops. Do not replace that evidence with a self-assigned numeric quality score.
