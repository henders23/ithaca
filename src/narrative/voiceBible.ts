import type { CharacterId } from '../canon/characters.js'

export interface CharacterVoice {
  character: CharacterId
  rhythm: string
  underPressure: string
  humour: string
  evasion: string
  concreteLanguage: readonly string[]
  neverSays: readonly string[]
  privateNeed: string
}

/**
 * A production constraint, not character lore. Writers and adversarial tests use
 * this to stop the whole crew sounding like the same polished moral philosopher.
 */
export const CHARACTER_VOICES = {
  'alexander-vale': {
    character: 'alexander-vale', rhythm: 'Short command clauses; personal admissions arrive late and without decoration.',
    underPressure: 'Turns feelings into tasks, then becomes dangerously quiet when no task remains.',
    humour: 'Dry and rare; surfaces when he is frightened.', evasion: 'Answers the operational question beside the personal one.',
    concreteLanguage: ['bearing', 'window', 'order', 'home', 'again'], neverSays: ['As your captain', 'The lesson is', 'We must acknowledge'],
    privateNeed: 'To believe Elara can recognise him without being required to forgive him.',
  },
  'helen-morozova': {
    character: 'helen-morozova', rhythm: 'Precise questions followed by the smallest defensible claim.',
    underPressure: 'Anger shortens her sentences; she attacks the premise rather than raising her voice.',
    humour: 'Exact, surgical understatement.', evasion: 'Refuses false certainty rather than hiding uncertainty.',
    concreteLanguage: ['evidence', 'confidence', 'pattern', 'show me', 'not yet'], neverSays: ['Science says', 'Obviously', 'Trust the data'],
    privateNeed: 'To remain Vale’s equal without becoming the conscience he can outsource responsibility to.',
  },
  'gabriel-cross': {
    character: 'gabriel-cross', rhythm: 'Action verbs, concrete risks and clipped tactical estimates.',
    underPressure: 'Gets funnier until somebody is hurt; then becomes brutally literal.',
    humour: 'Gallows humour shared with people he loves.', evasion: 'Offers to act before anyone can ask whether he is afraid.',
    concreteLanguage: ['hold', 'fire', 'door', 'seconds', 'mine'], neverSays: ['Our shared humanity', 'The moral calculus', 'History will judge'],
    privateNeed: 'To protect Vale without becoming the weapon Vale uses to avoid doubt.',
  },
  'lena-mori': {
    character: 'lena-mori', rhythm: 'Physical detail, unfinished clauses and the vocabulary of repair.',
    underPressure: 'Names the heat, weight and person behind every abstract sacrifice.',
    humour: 'Irritated affection for machines and the people who misuse them.', evasion: 'Keeps working while speaking so nobody can see her stop.',
    concreteLanguage: ['hot', 'seal', 'metal', 'hands', 'hold'], neverSays: ['Acceptable losses', 'Merely mechanical', 'Optimal sacrifice'],
    privateNeed: 'To have command admit that keeping a ship alive and keeping its people alive are different jobs.',
  },
  'isabella-corelli': {
    character: 'isabella-corelli', rhythm: 'Names first, diagnosis second; warmth without softness.',
    underPressure: 'Refuses euphemisms and makes the room hear the human noun.',
    humour: 'Exhausted, intimate and occasionally inappropriate.', evasion: 'Treats everyone except herself.',
    concreteLanguage: ['name', 'body', 'sleep', 'pain', 'tell them'], neverSays: ['Collateral', 'Resources', 'Medically insignificant'],
    privateNeed: 'To stop being asked to make command decisions look clean after they reach medical.',
  },
  'kiara-ndala': {
    character: 'kiara-ndala', rhythm: 'Careful revisions: what she heard, what she inferred, what remains untranslatable.',
    underPressure: 'Pauses more, not less; repeats alien wording when human certainty would distort it.',
    humour: 'Quiet observations about language behaving badly.', evasion: 'Corrects her confidence figure before admitting what a voice did to her.',
    concreteLanguage: ['I hear', 'closest word', 'confidence', 'voice', 'again'], neverSays: ['It definitely means', 'Universal translator', 'Just noise'],
    privateNeed: 'To understand the pursuer without being accused of joining it.',
  },
  elias: {
    character: 'elias', rhythm: 'Economical, dry and specific; one remembered detail does the work of a speech.',
    underPressure: 'Reports a memory fault plainly and continues.', humour: 'Perfect timing without signalling the joke.',
    evasion: 'Cannot lie convincingly to people whose habits he remembers.', concreteLanguage: ['I remember', 'you used to', 'record', 'gesture', 'missing'],
    neverSays: ['As an artificial intelligence', 'My programming', 'Human emotion'], privateNeed: 'To remain a witness even as remembering begins to cost him other memories.',
  },
  'elara-vale': {
    character: 'elara-vale', rhythm: 'Clipped adult speech; questions are evidence requests, not invitations to sentiment.',
    underPressure: 'Rejects Vale’s heroic register and becomes quieter when he finally sounds like her father.',
    humour: 'Sharper than Vale remembers and never used to rescue him.', evasion: 'Discusses public proof when the private answer still hurts.',
    concreteLanguage: ['which year', 'prove it', 'I was there', 'your record', 'ask me'], neverSays: ['Daddy', 'I always knew', 'All is forgiven'],
    privateNeed: 'To choose a relationship with Vale rather than inherit one from his legend.',
  },
  tidefather: {
    character: 'tidefather', rhythm: 'Kinship, sensation and inherited memory; no human courtroom rhetoric.',
    underPressure: 'Individual memories become plural and time ceases to be linear.', humour: 'None.',
    evasion: 'Cannot separate justice from possession until the final encounter.', concreteLanguage: ['warmth', 'unmade', 'shore', 'carried', 'remembered'],
    neverSays: ['War criminal', 'Your species', 'Justice demands'], privateNeed: 'To keep the dead present without admitting that vengeance is also consuming their future.',
  },
} as const satisfies Partial<Record<CharacterId, CharacterVoice>>

export const DIALOGUE_ANTI_PATTERNS = [
  'A character states the scene theme in a complete aphorism.',
  'Three speakers deliver equally polished moral positions in turn.',
  'A line uses “not X but Y” where behaviour could reveal the contrast.',
  'A captain explains responsibility instead of making a costly response.',
  'A crew member discusses casualties without a name, body, place or task.',
] as const

export function voiceProfile(id: CharacterId) {
  return CHARACTER_VOICES[id as keyof typeof CHARACTER_VOICES]
}
