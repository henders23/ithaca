import { describe, expect, it } from 'vitest'
import { CANON_CHARACTERS, ITHACA_CREW } from '../src/canon/characters.js'
import { SHIP } from '../src/canon/world.js'
import { validateCanon } from '../src/state/validate.js'

describe('canon registry', () => {
  it('locks the ship and captain', () => {
    expect(SHIP.name).toBe('CSV Ithaca')
    expect(CANON_CHARACTERS.find((character) => character.id === 'alexander-vale')?.name)
      .toBe('Captain Alexander Vale')
  })

  it('keeps the seven founding shipboard characters fixed', () => {
    expect(ITHACA_CREW.map((character) => character.id)).toEqual([
      'alexander-vale',
      'helen-morozova',
      'gabriel-cross',
      'lena-mori',
      'isabella-corelli',
      'kiara-ndala',
      'elias',
    ])
  })

  it('passes canon validation', () => {
    expect(validateCanon()).toEqual({ valid: true, errors: [] })
  })
})

