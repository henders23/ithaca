# Ithaca character voice bible

This is the writing gate for every new or revised scene. Biography establishes what a character believes; voice establishes how that person tries to survive a conversation.

## Non-negotiable scene rules

1. If a line can be reassigned without sounding wrong, rewrite it.
2. No scene may give three characters consecutive, complete moral theses.
3. At least one important exchange must contain evasion, interruption, correction, silence or a failed joke.
4. Tactical language must carry emotional pressure rather than pause the story for explanation.
5. Casualties acquire names, locations or physical consequences before they become numbers.
6. A player intervention must change the next spoken line, not only an invisible score.
7. The Tidefather speaks through kinship and memory, never like a human prosecutor.
8. Elara is an adult protagonist with evidence and interests of her own, not the reward for Vale’s return.

The executable profiles live in `src/narrative/voiceBible.ts` so the adversarial suite can verify that the rules remain part of production rather than drifting into unused documentation.

## Performance direction

- **Vale:** command clauses; operational evasion; rare fear-driven humour; silence when no task can protect him.
- **Morozova:** precise questions; bounded claims; anger expressed through shorter sentences.
- **Cross:** action verbs; concrete risk; gallows humour; loyalty shown through private disagreement.
- **Mori:** heat, metal, pressure and hands; never allows “the ship” to hide the people inside it.
- **Corelli:** names before numbers; refuses euphemism; treats everyone except herself.
- **N’Dala:** separates hearing, inference and translation; repeats alien language when certainty would be dishonest.
- **ELIAS:** remembered details, dry timing and plainly acknowledged gaps.
- **Elara:** evidence-led questions; controlled anger; rejects inherited intimacy.
- **Tidefather:** plural memory, bodily sensation and kinship; grief that has forgotten how to release its dead.

## Blind voice gate

For each signature scene, remove speaker labels and ask a reviewer to identify the speaker. The release target is 80% correct identification. A scene fails if identification depends only on plot information such as “the doctor mentions medicine”; rhythm and word choice must also carry identity.
