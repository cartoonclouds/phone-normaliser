import type { CountryCode } from 'libphonenumber-js'
import { describe, expect, it, vi } from 'vitest'

import {
  type PhoneValidationCode,
  PhoneValidationCodes,
} from '../src/utils/phone/constants'
import {
  isBlockedNumber,
  isEmpty,
  looksLikePhone,
  resolvePhoneNumber,
  validatePhone,
  validationCodeToReason,
} from '../src/utils/phone/validatePhone'

describe('validatePhone', () => {
  it('flags empty input', () => {
    const results = validatePhone('')
    const codes = results.map((r) => r.validationCode)

    expect(codes).toContain(PhoneValidationCodes.EMPTY)
  })

  it('requires minimum length', () => {
    const results = validatePhone('555123', {
      defaultCountry: 'US',
      minLength: 10,
    })

    expect(
      results.find((r) => r.validationCode === PhoneValidationCodes.TOO_SHORT)
    ).toBeDefined()
  })

  it('applies allowed country filters', () => {
    const results = validatePhone('+61491570156', {
      allowedCountries: ['US'],
    })

    expect(
      results.find(
        (r) => r.validationCode === PhoneValidationCodes.COUNTRY_NOT_ALLOWED
      )
    ).toBeDefined()
  })

  it('respects blocklists', () => {
    const results = validatePhone('+18005551234', {
      blocklist: {
        exact: ['+18005551234'],
      },
    })

    expect(
      results.find((r) => r.validationCode === PhoneValidationCodes.BLOCKLISTED)
    ).toBeDefined()
  })

  it('returns VALID when no validation rules fire', () => {
    const results = validatePhone('+14155552671')

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      isValid: true,
      validationCode: PhoneValidationCodes.VALID,
    })
  })

  it('short-circuits when the value does not look like a phone number', () => {
    const results = validatePhone('abc')

    expect(results).toHaveLength(1)
    expect(results[0].validationCode).toBe(PhoneValidationCodes.INVALID_FORMAT)
  })

  it('flags extensions when they are not allowed', () => {
    const results = validatePhone('+1 415 555 2671 ext 88', {
      defaultCountry: 'US',
      allowExtensions: false,
    })

    expect(
      results.find(
        (r) => r.validationCode === PhoneValidationCodes.EXTENSION_NOT_ALLOWED
      )
    ).toBeDefined()
  })

  it('flags unknown regions returned by libphonenumber', () => {
    const results = validatePhone('+870773111632')

    expect(
      results.find(
        (r) => r.validationCode === PhoneValidationCodes.UNKNOWN_REGION
      )
    ).toBeDefined()
  })
})

describe('validation helpers', () => {
  it('maps validation codes to human reasons and warns on unknown codes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(validationCodeToReason(PhoneValidationCodes.EMPTY)).toBe(
      'Phone number is empty.'
    )
    expect(validationCodeToReason(PhoneValidationCodes.INVALID_FORMAT)).toBe(
      'Phone number is not in a valid format.'
    )
    expect(validationCodeToReason(PhoneValidationCodes.BLOCKLISTED)).toBe(
      'Phone number is blocklisted.'
    )
    expect(
      validationCodeToReason(PhoneValidationCodes.COUNTRY_NOT_ALLOWED)
    ).toBe('Phone number country is not permitted.')
    expect(validationCodeToReason(PhoneValidationCodes.TOO_SHORT)).toBe(
      'Phone number is shorter than the configured minimum length.'
    )
    expect(validationCodeToReason(PhoneValidationCodes.TOO_LONG)).toBe(
      'Phone number is longer than the configured maximum length.'
    )
    expect(
      validationCodeToReason(PhoneValidationCodes.EXTENSION_NOT_ALLOWED)
    ).toBe('Phone number contains an extension but extensions are disabled.')
    expect(validationCodeToReason(PhoneValidationCodes.UNKNOWN_REGION)).toBe(
      'Could not determine the phone number region.'
    )
    expect(validationCodeToReason(PhoneValidationCodes.VALID)).toBe(
      'Phone number is valid.'
    )

    expect(
      validationCodeToReason('SOMETHING_ELSE' as unknown as PhoneValidationCode)
    ).toBeNull()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('detects empty and non-phone inputs', () => {
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty('123')).toBe(false)
    expect(looksLikePhone('12345')).toBe(false)
    expect(looksLikePhone('+14155552671')).toBe(true)
  })
})

describe('isBlockedNumber', () => {
  it('honours allow lists before exact matches', () => {
    const cfg = {
      exact: ['+14155552671'],
      allow: {
        exact: ['+14155552671'],
      },
    }

    expect(isBlockedNumber('+14155552671', cfg, 'US')).toBe(false)
  })

  it('blocks via exact, prefixes, countries, regex, and length rules', () => {
    const cfg = {
      exact: ['+18005551234'],
      prefixes: ['+441'],
      countries: ['GB'] as CountryCode[],
      patterns: ['[invalid', '^\\+999'],
      lengths: {
        min: 10,
        max: 12,
      },
    }

    expect(isBlockedNumber('+18005551234', cfg, 'US')).toBe(true)
    expect(isBlockedNumber('+441234567890', cfg, 'GB')).toBe(true)
    expect(isBlockedNumber('+9991234567', cfg, 'US')).toBe(true)
    expect(isBlockedNumber('+1202555', cfg, 'US')).toBe(true)
    expect(isBlockedNumber('+1202555012345', cfg, 'US')).toBe(true)
  })
})

describe('resolvePhoneNumber', () => {
  it('returns direct parses without fallback', () => {
    const result = resolvePhoneNumber('+14155552671')

    expect(result?.phoneNumber.number).toBe('+14155552671')
    expect(result?.usedFallback).toBeUndefined()
  })

  it('applies provided fallback countries when needed', () => {
    const result = resolvePhoneNumber('07911123456', {
      defaultCountry: 'GB',
    })

    expect(result?.phoneNumber.number).toBe('+447911123456')
    expect(result?.usedFallback).toBe('GB')
  })
})
