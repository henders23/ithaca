import { CANON_CHARACTERS } from '../canon/characters.js'
import type { CampaignEffect, RelationshipAxis } from '../state/types.js'

/**
 * Turns the effects a choice applies into short, visible acknowledgements.
 *
 * The campaign state has always changed after every decision; the player just
 * never saw it happen. These notices are the Telltale "she will remember that"
 * beat: enough to make the choice feel witnessed, never enough to become a
 * scoreboard.
 */

export type ConsequenceTone = 'bond' | 'strain' | 'danger' | 'relief' | 'memory' | 'ship' | 'loss'

export interface ConsequenceNotice {
  id: string
  tone: ConsequenceTone
  title: string
  detail: string
}

const SHORT_NAMES: Readonly<Record<string, string>> = {
  'alexander-vale': 'VALE',
  'helen-morozova': 'MOROZOVA',
  'gabriel-cross': 'CROSS',
  'lena-mori': 'MORI',
  'isabella-corelli': 'CORELLI',
  'kiara-ndala': 'N’DALA',
  elias: 'ELIAS',
  'elara-vale': 'ELARA',
  'doctor-cirene': 'CIRENE',
  'keeper-aeolia': 'AEOLIA',
  'speaker-nausica': 'NAUSICA',
}

export function shortCharacterName(id: string): string {
  if (SHORT_NAMES[id]) return SHORT_NAMES[id]
  const canon = CANON_CHARACTERS.find((character) => character.id === id)
  const source = canon?.name ?? id
  const last = source.split(/[\s-]+/).filter(Boolean).at(-1) ?? id
  return last.toUpperCase()
}

const TRUST_WORDS: Readonly<Record<number, string>> = {
  3: 'will not forget this',
  2: 'trusts you more',
  1: 'warms a little',
  [-1]: 'cools',
  [-2]: 'loses faith',
  [-3]: 'will not forgive this',
}

const AXIS_LABEL: Readonly<Record<RelationshipAxis, string>> = {
  trust: 'Trust',
  intimacy: 'Closeness',
  respect: 'Respect',
  resentment: 'Resentment',
}

function clampDelta(delta: number) {
  return Math.max(-3, Math.min(3, Math.sign(delta) * Math.ceil(Math.abs(delta)))) as -3 | -2 | -1 | 1 | 2 | 3
}

const humanise = (id: string) => id.replaceAll(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
const SYSTEM_LABEL: Readonly<Record<string, string>> = { engines: 'DRIVE', shields: 'SHIELDS', sensors: 'SENSORS', weapons: 'WEAPONS', 'life-support': 'LIFE SUPPORT', medical: 'MEDICAL' }

const PRIORITY: Readonly<Record<ConsequenceTone, number>> = { loss: 0, bond: 1, strain: 1, danger: 2, relief: 2, ship: 3, memory: 4 }

/** Notices for a batch of effects, strongest first and capped so a scene never floods. */
export function describeEffects(effects: readonly CampaignEffect[], limit = 4): ConsequenceNotice[] {
  const notices: ConsequenceNotice[] = []
  effects.forEach((effect, index) => {
    const id = `${effect.kind}-${index}`
    switch (effect.kind) {
      case 'relationship': {
        if (!effect.delta) return
        const delta = clampDelta(effect.delta)
        notices.push({ id, tone: delta > 0 ? 'bond' : 'strain', title: shortCharacterName(effect.character), detail: TRUST_WORDS[delta] })
        return
      }
      case 'relationship-axis': {
        if (!effect.delta) return
        const rising = effect.delta > 0
        const axis = AXIS_LABEL[effect.axis]
        const harmful = effect.axis === 'resentment' ? rising : !rising
        notices.push({ id, tone: harmful ? 'strain' : 'bond', title: shortCharacterName(effect.character), detail: `${axis} ${rising ? 'rises' : 'falls'}` })
        return
      }
      case 'pursuit': {
        if (!effect.delta) return
        notices.push({
          id,
          tone: effect.delta > 0 ? 'danger' : 'relief',
          title: `PURSUIT ${effect.delta > 0 ? '+' : '−'}${Math.abs(effect.delta)}`,
          detail: effect.delta >= 12 ? 'The Host now has a name to hunt' : effect.delta > 0 ? 'The Ithaca is easier to hear' : 'The trail behind the ship fades',
        })
        return
      }
      case 'damage-hull':
        notices.push({ id, tone: 'ship', title: `HULL −${effect.amount}`, detail: 'Damage control logs new losses' })
        return
      case 'repair-hull':
        notices.push({ id, tone: 'relief', title: `HULL +${effect.amount}`, detail: 'Plating restored' })
        return
      case 'damage-system':
        notices.push({ id, tone: 'ship', title: `${SYSTEM_LABEL[effect.system] ?? effect.system.toUpperCase()} −${effect.amount}`, detail: 'System integrity falls' })
        return
      case 'repair-system':
        notices.push({ id, tone: 'relief', title: `${SYSTEM_LABEL[effect.system] ?? effect.system.toUpperCase()} +${effect.amount}`, detail: 'System integrity restored' })
        return
      case 'character-status':
        if (effect.status === 'dead') notices.push({ id, tone: 'loss', title: shortCharacterName(effect.character), detail: 'is dead. The ship will carry the name.' })
        else notices.push({ id, tone: 'ship', title: shortCharacterName(effect.character), detail: `is now ${humanise(effect.status)}` })
        return
      case 'set-flag':
        notices.push({ id, tone: 'memory', title: 'THE VOYAGE REMEMBERS', detail: humanise(effect.flag) })
        return
      case 'add-evidence':
        if (effect.evidenceId.includes(':')) return
        notices.push({ id, tone: 'memory', title: 'RECORDED', detail: humanise(effect.evidenceId) })
        return
      case 'add-module':
        notices.push({ id, tone: 'relief', title: 'ACQUIRED', detail: humanise(effect.moduleId) })
        return
      case 'add-scar':
        notices.push({ id, tone: 'ship', title: 'THE SHIP IS SCARRED', detail: humanise(effect.scarId) })
        return
      default:
        return
    }
  })
  return notices
    .sort((a, b) => PRIORITY[a.tone] - PRIORITY[b.tone])
    .slice(0, limit)
}
