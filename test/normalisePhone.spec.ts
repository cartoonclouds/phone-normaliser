import { describe, expect, it } from 'vitest'

import { PhoneChangeCodes } from '../src/utils/phone/constants'
import { normalisePhone } from '../src/utils/phone/normalisePhone'

describe('normalisePhone', () => {
  it('normalises unicode digits and strips extensions', () => {
    const result = normalisePhone('＋44 (0) 7911 123456 ext 17', {
      defaultCountry: 'GB',
      format: 'E.164',
    })

    expect(result.phone).toBe('+447911123456')
    expect(result.metadata.extension).toBe('17')
    expect(result.changeCodes).toContain(PhoneChangeCodes.NORMALISED_SYMBOLS)
    expect(result.changeCodes).toContain(PhoneChangeCodes.STRIPPED_EXTENSION)
    expect(result.valid).toBe(true)
  })

  it('blocks numbers defined in the blocklist', () => {
    const result = normalisePhone('+14155552671', {
      blocklist: {
        exact: ['+14155552671'],
      },
    })

    expect(result.valid).toBe(false)
    expect(result.changeCodes).toContain(PhoneChangeCodes.BLOCKED_BY_LIST)
  })

  it('rejects disallowed countries', () => {
    const result = normalisePhone('+61491570156', {
      allowedCountries: ['US'],
    })

    expect(result.valid).toBe(false)
    expect(result.changeCodes).toContain(PhoneChangeCodes.COUNTRY_NOT_ALLOWED)
  })

  it('returns raw value untouched when normalisation is disabled', () => {
    const result = normalisePhone('+18005551234', {
      enabled: false,
    })

    expect(result.valid).toBe(true)
    expect(result.phone).toBe('+18005551234')
    expect(result.changeCodes).toHaveLength(0)
  })

  it('flags completely empty input as invalid shape', () => {
    const result = normalisePhone('   ')

    expect(result.valid).toBe(false)
    expect(result.phone).toBeNull()
    expect(result.changeCodes).toContain(PhoneChangeCodes.INVALID_SHAPE)
    expect(result.changes).toContain('Phone number could not be parsed.')
  })

  it('applies fallback countries and requested formatting style', () => {
    const result = normalisePhone('07911 123456', {
      defaultCountry: 'GB',
      format: 'INTERNATIONAL',
    })

    expect(result.phone).toBe('+44 7911 123456')
    expect(result.metadata.e164).toBe('+447911123456')
    expect(result.changeCodes).toContain(
      PhoneChangeCodes.APPLIED_DEFAULT_COUNTRY
    )
    expect(result.changeCodes).toContain(PhoneChangeCodes.FORMATTED_OUTPUT)
  })

  it('retains extensions when stripping is disabled', () => {
    const result = normalisePhone('+1 415 555 2671 ext 42', {
      stripExtensions: false,
    })

    expect(result.metadata.extension).toBe('42')
    expect(result.changeCodes).not.toContain(
      PhoneChangeCodes.STRIPPED_EXTENSION
    )
  })

  it('respects custom symbol maps for uncommon characters', () => {
    const result = normalisePhone('415•555•2671', {
      defaultCountry: 'US',
      symbolMap: {
        '•': '',
      },
    })

    expect(result.phone).toBe('+14155552671')
    expect(result.changeCodes).toContain(PhoneChangeCodes.NORMALISED_SYMBOLS)
  })

  it('allows explicitly permitted numbers even when blocklisted', () => {
    const result = normalisePhone('+14155552671', {
      blocklist: {
        exact: ['+14155552671'],
        allow: {
          exact: ['+14155552671'],
        },
      },
    })

    expect(result.valid).toBe(true)
    expect(result.changeCodes).not.toContain(PhoneChangeCodes.BLOCKED_BY_LIST)
  })

  it('returns invalid when parsing fails for every region', () => {
    const result = normalisePhone('not-a-phone-number')

    expect(result.valid).toBe(false)
    expect(result.phone).toBeNull()
    expect(result.changeCodes).toContain(PhoneChangeCodes.INVALID_SHAPE)
  })
})
