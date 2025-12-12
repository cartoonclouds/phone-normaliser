import {
  type CountryCode,
  type PhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/max'

import {
  DEFAULT_BLOCKLIST,
  DEFAULT_MAX_LENGTH,
  DEFAULT_MIN_LENGTH,
  DEFAULT_REGION_FALLBACKS,
  type PhoneValidationCode,
  PhoneValidationCodes,
} from './constants'
import type {
  PhoneBlockConfig,
  PhoneValidationOptions,
  ResolvePhoneConfig,
  ValidationResults,
} from './types'

/**
 * Maps PhoneValidationCode values to human-readable text.
 *
 * @param {PhoneValidationCode} code - The validation code to convert
 * @returns {string | null
 */
export function validationCodeToReason(
  code: PhoneValidationCode
): string | null {
  switch (code) {
    case PhoneValidationCodes.EMPTY:
      return 'Phone number is empty.'
    case PhoneValidationCodes.INVALID_FORMAT:
      return 'Phone number is not in a valid format.'
    case PhoneValidationCodes.BLOCKLISTED:
      return 'Phone number is blocklisted.'
    case PhoneValidationCodes.COUNTRY_NOT_ALLOWED:
      return 'Phone number country is not permitted.'
    case PhoneValidationCodes.TOO_SHORT:
      return 'Phone number is shorter than the configured minimum length.'
    case PhoneValidationCodes.TOO_LONG:
      return 'Phone number is longer than the configured maximum length.'
    case PhoneValidationCodes.EXTENSION_NOT_ALLOWED:
      return 'Phone number contains an extension but extensions are disabled.'
    case PhoneValidationCodes.UNKNOWN_REGION:
      return 'Could not determine the phone number region.'
    case PhoneValidationCodes.VALID:
      return 'Phone number is valid.'
    default:
      console.warn(`Unknown phone validation code: ${code as string}`)

      return null
  }
}

/**
 * Returns true when the provided string is only whitespace.
 *
 * @param {string} raw - The raw input string to check
 * @returns {boolean} - True if the string is empty or whitespace only
 */
export function isEmpty(raw: string): boolean {
  const value = String(raw ?? '').trim()

  return value.length === 0
}

/**
 * Cheap guard to avoid parsing obviously invalid strings.
 *
 * @param {string} raw - The raw input string to check
 * @returns {boolean} - True if the string looks like a phone number
 */
export function looksLikePhone(raw: string): boolean {
  const digits = String(raw ?? '').replace(/\D/g, '')

  return digits.length >= 6 && digits.length <= 18
}

/**
 * Removes whitespace from E.164 strings while preserving the prefix.
 *
 * @param {string | null | undefined} value - The E.164 string to normalise
 * @returns {string | null
 */
function normaliseE164(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  return value.replace(/\s+/g, '')
}

/**
 * Evaluates the provided number against block/allow rules.
 *
 * @param {string | null | undefined} value - The phone number in E.164 format
 * @param {PhoneBlockConfig} cfg - The blocklist configuration to use
 * @param {string | null} country - The country code of the phone number
 * @returns {boolean} - True if the number is blocklisted
 */
export function isBlockedNumber(
  value: string | null | undefined,
  cfg: PhoneBlockConfig,
  country: string | null
): boolean {
  const e164 = normaliseE164(value)
  if (!e164) {
    return false
  }

  const allow =
    cfg.allow?.exact?.map((entry) => normaliseE164(entry) ?? '') ?? []
  if (allow.includes(e164)) {
    return false
  }

  const exact = cfg.exact?.map((entry) => normaliseE164(entry) ?? '') ?? []
  if (exact.includes(e164)) {
    return true
  }

  if (cfg.prefixes?.some((prefix) => e164.startsWith(prefix))) {
    return true
  }

  if (
    cfg.countries?.length &&
    country &&
    cfg.countries.includes(country as CountryCode)
  ) {
    return true
  }

  if (cfg.patterns) {
    for (const pattern of cfg.patterns) {
      try {
        const re = new RegExp(pattern)
        if (re.test(e164)) {
          return true
        }
      } catch {
        continue
      }
    }
  }

  const digitsOnly = e164.replace(/[^0-9]/g, '')
  const min = cfg.lengths?.min
  const max = cfg.lengths?.max

  if (min && digitsOnly.length < min) {
    return true
  }

  if (max && digitsOnly.length > max) {
    return true
  }

  return false
}

/**
 * Wraps libphonenumber parsing so we can ignore thrown errors.
 *
 * @param {string} raw - The raw phone number string to parse
 * @param {CountryCode} [country] - Optional country code to assist parsing
 * @returns {PhoneNumber | undefined} - Parsed phone number or undefined on failure
 */
function safeParse(
  raw: string,
  country?: CountryCode
): PhoneNumber | undefined {
  try {
    return parsePhoneNumberFromString(raw, country)
  } catch {
    return undefined
  }
}

/**
 * Attempts to parse by walking default/fallback regions.
 *
 * @param {string} raw - The raw phone number string to parse
 * @param {ResolvePhoneConfig} [config] - Configuration for default and fallback countries
 * @returns {{ phoneNumber: PhoneNumber; usedFallback?: CountryCode } | null} - Parsed phone number and optional fallback country
 */
export function resolvePhoneNumber(
  raw: string,
  config: ResolvePhoneConfig = {}
): { phoneNumber: PhoneNumber; usedFallback?: CountryCode } | null {
  const value = String(raw ?? '')

  const direct = safeParse(value)
  if (direct) {
    return { phoneNumber: direct }
  }

  const seen = new Set<string>()
  const attempts: Array<CountryCode | undefined> = []

  if (config.defaultCountry) {
    attempts.push(config.defaultCountry)
  }

  if (config.fallbackCountries?.length) {
    attempts.push(...config.fallbackCountries)
  }

  attempts.push(...DEFAULT_REGION_FALLBACKS)

  for (const attempt of attempts) {
    if (!attempt) {
      continue
    }

    if (seen.has(attempt)) {
      continue
    }

    seen.add(attempt)
    const parsed = safeParse(value, attempt)
    if (parsed) {
      return { phoneNumber: parsed, usedFallback: attempt }
    }
  }

  const lastChance = safeParse(value)
  if (lastChance) {
    return { phoneNumber: lastChance }
  }

  return null
}

/**
 * Performs multi-pass validation and returns every triggered rule.
 *
 * @param {string} raw - The raw phone number string to validate
 * @param {PhoneValidationOptions} [options] - Validation options
 * @returns {ValidationResults} - Array of validation results
 */
export function validatePhone(
  raw: string,
  options: PhoneValidationOptions = {}
): ValidationResults {
  const results: ValidationResults = []
  const blocklist = options.blocklist || DEFAULT_BLOCKLIST
  const minLength = options.minLength ?? DEFAULT_MIN_LENGTH
  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH
  const allowExtensions = options.allowExtensions ?? false

  if (isEmpty(raw)) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.EMPTY,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.EMPTY
      ) as string,
    })
  }

  if (!looksLikePhone(raw)) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.INVALID_FORMAT,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.INVALID_FORMAT
      ) as string,
    })

    return results
  }

  const resolved = resolvePhoneNumber(raw, {
    defaultCountry: options.defaultCountry,
    fallbackCountries: options.fallbackCountries,
  })

  if (!resolved) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.INVALID_FORMAT,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.INVALID_FORMAT
      ) as string,
    })

    return results
  }

  const { phoneNumber } = resolved
  const country = phoneNumber.country ?? null
  const digitsLength = (phoneNumber.nationalNumber || '').length

  if (!phoneNumber.isValid()) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.INVALID_FORMAT,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.INVALID_FORMAT
      ) as string,
    })
  }

  if (digitsLength && digitsLength < minLength) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.TOO_SHORT,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.TOO_SHORT
      ) as string,
    })
  }

  if (digitsLength && digitsLength > maxLength) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.TOO_LONG,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.TOO_LONG
      ) as string,
    })
  }

  if (
    options.allowedCountries?.length &&
    (!country || !options.allowedCountries.includes(country))
  ) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.COUNTRY_NOT_ALLOWED,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.COUNTRY_NOT_ALLOWED
      ) as string,
    })
  }

  if (!country) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.UNKNOWN_REGION,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.UNKNOWN_REGION
      ) as string,
    })
  }

  const e164 = phoneNumber.number
  if (isBlockedNumber(e164, blocklist, country)) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.BLOCKLISTED,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.BLOCKLISTED
      ) as string,
    })
  }

  if (!allowExtensions && phoneNumber.ext) {
    results.push({
      isValid: false,
      validationCode: PhoneValidationCodes.EXTENSION_NOT_ALLOWED,
      validationMessage: validationCodeToReason(
        PhoneValidationCodes.EXTENSION_NOT_ALLOWED
      ) as string,
    })
  }

  return results.length
    ? results
    : [
        {
          isValid: true,
          validationCode: PhoneValidationCodes.VALID,
          validationMessage: validationCodeToReason(
            PhoneValidationCodes.VALID
          ) as string,
        },
      ]
}
