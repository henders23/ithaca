import { describe, expect, it } from 'vitest'
import { CAMPAIGN_BEATS } from '../src/campaign/beats.js'
import { validateCampaign } from '../src/state/validate.js'

describe('campaign registry', () => {
  it('contains all 32 beats in strict order', () => {
    expect(CAMPAIGN_BEATS).toHaveLength(32)
    expect(CAMPAIGN_BEATS.map((beat) => beat.order)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    )
  })

  it('preserves the planned act shape', () => {
    expect([1, 2, 3, 4].map((act) => CAMPAIGN_BEATS.filter((beat) => beat.act === act).length))
      .toEqual([8, 9, 10, 5])
  })

  it('contains nine mandatory and four conditional battles', () => {
    const combats = CAMPAIGN_BEATS.flatMap((beat) => beat.activities)
      .filter((activity) => activity.kind === 'combat')
    expect(combats.filter((activity) => activity.kind === 'combat' && !activity.conditional)).toHaveLength(9)
    expect(combats.filter((activity) => activity.kind === 'combat' && activity.conditional)).toHaveLength(4)
  })

  it('passes structural validation', () => {
    expect(validateCampaign()).toEqual({ valid: true, errors: [] })
  })
})

