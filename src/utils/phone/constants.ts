import type { CountryCode } from 'libphonenumber-js'

import type { PhoneBlockConfig } from './types'

/** Ordered ISO codes to try when parsing numbers without a country hint. */
export const DEFAULT_REGION_FALLBACKS: ReadonlyArray<CountryCode> = [
  'GB',
  'IE',
  'US',
  'CA',
  'AU',
  'NZ',
  'DE',
  'FR',
  'SG',
  'IN',
  'ZA',
  'KE',
]

/** Guard rails for phone number length validation when callers provide none. */
export const DEFAULT_MIN_LENGTH = 8

/** Guard rails for phone number length validation when callers provide none. */
export const DEFAULT_MAX_LENGTH = 15

/** Maps common unicode digits/symbols to ASCII counterparts before parsing. */
export const SYMBOL_TRANSLITERATION_MAP: Record<string, string> = {
  '＋': '+',
  '−': '-',
  '–': '-',
  '—': '-',
  '﹣': '-',
  '（': '(',
  '）': ')',
  '【': '(',
  '】': ')',
  '　': ' ',
  '０': '0',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
}

/** Opinionated starter blocklist that callers can extend or replace. */
export const DEFAULT_BLOCKLIST: PhoneBlockConfig = {
  exact: ['+15555555555', '+18005551234', '+447700900000'],
  prefixes: ['+000', '+999', '+1234567'],
  countries: [],
  patterns: ['^(?:+?1)?1234567'],
  lengths: {
    min: DEFAULT_MIN_LENGTH,
  },
  allow: {
    exact: [],
  },
}

/** All validation result codes surfaced by validatePhone(). */
export const PhoneValidationCodes = Object.freeze({
  VALID: 'VALID',
  EMPTY: 'EMPTY',
  INVALID_FORMAT: 'INVALID_FORMAT',
  BLOCKLISTED: 'BLOCKLISTED',
  COUNTRY_NOT_ALLOWED: 'COUNTRY_NOT_ALLOWED',
  TOO_SHORT: 'TOO_SHORT',
  TOO_LONG: 'TOO_LONG',
  EXTENSION_NOT_ALLOWED: 'EXTENSION_NOT_ALLOWED',
  UNKNOWN_REGION: 'UNKNOWN_REGION',
} as const)

/** Union helper for strongly typed validation codes. */
export type PhoneValidationCode =
  (typeof PhoneValidationCodes)[keyof typeof PhoneValidationCodes]

/** Machine-readable change codes produced by normalisePhone(). */
export const PhoneChangeCodes = Object.freeze({
  NORMALISED_SYMBOLS: 'normalised_symbols',
  STRIPPED_EXTENSION: 'stripped_extension',
  APPLIED_DEFAULT_COUNTRY: 'applied_default_country',
  FORMATTED_OUTPUT: 'formatted_output',
  BLOCKED_BY_LIST: 'blocked_by_list',
  COUNTRY_NOT_ALLOWED: 'country_not_allowed',
  INVALID_SHAPE: 'invalid_shape',
} as const)

/** Union helper for strongly typed change codes. */
export type PhoneChangeCode =
  (typeof PhoneChangeCodes)[keyof typeof PhoneChangeCodes]
