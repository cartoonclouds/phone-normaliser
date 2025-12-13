import { getConsole } from '../dom/utils'
import type { PhoneChangeCode } from './constants'
import {
  DEFAULT_BLOCKLIST,
  PhoneChangeCodes,
  SYMBOL_TRANSLITERATION_MAP,
} from './constants'
import type {
  PhoneFixResult,
  PhoneFormat,
  PhoneNormOptions,
  PhoneNormResult,
} from './types'
import { isBlockedNumber, isEmpty, resolvePhoneNumber } from './validatePhone'

/**
 * Replaces unicode digits/symbols using the provided transliteration map.
 *
 * @param value - Raw phone number string to process.
 * @param map - Mapping of unicode characters to ASCII replacements.
 * @returns Object containing the transliterated string and a change flag.
 */
function applySymbolMap(
  value: string,
  map: Record<string, string>
): PhoneFixResult {
  let out = value

  for (const [from, to] of Object.entries(map)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(escaped, 'g'), to)
  }

  return {
    out,
    changed: out !== value,
  }
}

/**
 * Removes obvious prefixes/extra whitespace prior to parsing.
 *
 * @param value - Raw phone number string to tidy.
 * @returns Object containing the tidied string and a change flag.
 */
function tidyDialString(value: string): PhoneFixResult {
  let out = value.replace(/^(tel|phone|call)[:\s]+/i, '')
  out = out.replace(/\s+/g, ' ').trim()

  return {
    out,
    changed: out !== value,
  }
}

/**
 * Pulls trailing extension notes off the raw number before validation.
 *
 * @param value - Raw phone number string to process.
 * @returns Object containing the string without extension, the extracted extension, and a change flag.
 */
function stripExtension(value: string): {
  out: string
  extension: string | null
  changed: boolean
} {
  const match = value.match(/(?:ext\.?|extension|x|#)\s*(\d{1,6})$/i)

  if (!match) {
    return {
      out: value,
      extension: null,
      changed: false,
    }
  }

  const next = value.slice(0, match.index).trim()

  return {
    out: next,
    extension: match[1] || null,
    changed: true,
  }
}

/**
 * Converts internal change codes into human-readable reasons.
 *
 * @param codes - List of phone change codes to map.
 * @returns Array of human-readable change reasons.
 */
function mapChangeCodesToReason(codes: PhoneChangeCode[]): string[] {
  const reasons: string[] = []

  for (const code of codes) {
    switch (code) {
      case PhoneChangeCodes.NORMALISED_SYMBOLS:
        reasons.push('Converted unicode digits and separators.')
        break
      case PhoneChangeCodes.STRIPPED_EXTENSION:
        reasons.push('Removed phone extension text.')
        break
      case PhoneChangeCodes.APPLIED_DEFAULT_COUNTRY:
        reasons.push('Applied default or fallback country code.')
        break
      case PhoneChangeCodes.FORMATTED_OUTPUT:
        reasons.push('Formatted using the requested output style.')
        break
      case PhoneChangeCodes.BLOCKED_BY_LIST:
        reasons.push('Phone number is blocklisted.')
        break
      case PhoneChangeCodes.COUNTRY_NOT_ALLOWED:
        reasons.push('Phone number country is not permitted.')
        break
      case PhoneChangeCodes.INVALID_SHAPE:
        reasons.push('Phone number could not be parsed.')
        break
      default:
        getConsole()?.warn(`Unknown phone change code: ${code as string}`)
        break
    }
  }

  return reasons
}

/**
 * Ensures `changes` always mirrors `changeCodes` when returning results.
 *
 * @param params - Partial phone normalization result without `changes`.
 * @returns Complete PhoneNormResult with human-readable `changes`.
 */
function buildResult(
  params: Omit<PhoneNormResult, 'changes'>
): PhoneNormResult {
  return {
    ...params,
    changes: mapChangeCodesToReason(params.changeCodes),
  }
}

/**
 * Full phone number normaliser that cleans, parses, and validates input.
 *
 * @param raw - Raw phone number string to normalise.
 * @param options - Normalisation configuration options.
 * @returns Complete phone normalization result.
 */
export function normalisePhone(
  raw: string,
  options: PhoneNormOptions = {}
): PhoneNormResult {
  const enabled = options.enabled ?? true
  const changeCodes: PhoneChangeCode[] = []
  const metadata: PhoneNormResult['metadata'] = {
    e164: null,
    international: null,
    national: null,
    type: null,
    extension: null,
  }

  if (!enabled) {
    return buildResult({
      phone: raw ?? null,
      valid: true,
      country: null,
      changeCodes,
      metadata,
    })
  }

  let working = String(raw ?? '').trim()

  if (isEmpty(working)) {
    changeCodes.push(PhoneChangeCodes.INVALID_SHAPE)

    return buildResult({
      phone: null,
      valid: false,
      country: null,
      changeCodes,
      metadata,
    })
  }

  const symbolMap = {
    ...SYMBOL_TRANSLITERATION_MAP,
    ...(options.symbolMap || {}),
  }
  const ascii = applySymbolMap(working, symbolMap)
  if (ascii.changed) {
    working = ascii.out
    changeCodes.push(PhoneChangeCodes.NORMALISED_SYMBOLS)
  }

  const tidied = tidyDialString(working)
  if (tidied.changed) {
    working = tidied.out
  }

  let extension: string | null = null
  if (options.stripExtensions ?? true) {
    const stripped = stripExtension(working)
    if (stripped.changed) {
      working = stripped.out
      extension = stripped.extension
      changeCodes.push(PhoneChangeCodes.STRIPPED_EXTENSION)
    }
  }

  const resolved = resolvePhoneNumber(working, {
    defaultCountry: options.defaultCountry,
    fallbackCountries: options.fallbackCountries,
  })

  if (!resolved) {
    changeCodes.push(PhoneChangeCodes.INVALID_SHAPE)

    return buildResult({
      phone: null,
      valid: false,
      country: null,
      changeCodes,
      metadata,
    })
  }

  const { phoneNumber, usedFallback } = resolved
  const country = phoneNumber.country ?? null

  if (usedFallback) {
    changeCodes.push(PhoneChangeCodes.APPLIED_DEFAULT_COUNTRY)
  }

  if (!phoneNumber.isValid()) {
    changeCodes.push(PhoneChangeCodes.INVALID_SHAPE)

    return buildResult({
      phone: null,
      valid: false,
      country,
      changeCodes,
      metadata,
    })
  }

  metadata.e164 = phoneNumber.number ?? null
  metadata.international = phoneNumber.formatInternational()
  metadata.national = phoneNumber.formatNational()
  metadata.extension = extension || phoneNumber.ext || null
  metadata.type = phoneNumber.getType ? (phoneNumber.getType() ?? null) : null

  const blocklist = options.blocklist || DEFAULT_BLOCKLIST
  if (isBlockedNumber(metadata.e164, blocklist, country)) {
    changeCodes.push(PhoneChangeCodes.BLOCKED_BY_LIST)

    return buildResult({
      phone: metadata.e164,
      valid: false,
      country,
      changeCodes,
      metadata,
    })
  }

  if (
    options.allowedCountries?.length &&
    (!country || !options.allowedCountries.includes(country))
  ) {
    changeCodes.push(PhoneChangeCodes.COUNTRY_NOT_ALLOWED)

    return buildResult({
      phone: metadata.e164,
      valid: false,
      country,
      changeCodes,
      metadata,
    })
  }

  const format: PhoneFormat = options.format ?? 'E.164'
  let formatted: string | null = metadata.e164

  switch (format) {
    case 'INTERNATIONAL':
      formatted = phoneNumber.formatInternational()
      break
    case 'NATIONAL':
      formatted = phoneNumber.formatNational()
      break
    // case 'RFC3966':
    //   formatted = phoneNumber.formatRFC3966()
    //   break
    default:
      formatted = metadata.e164
      break
  }

  if (format !== 'E.164') {
    changeCodes.push(PhoneChangeCodes.FORMATTED_OUTPUT)
  }

  return buildResult({
    phone: formatted ?? metadata.international ?? metadata.national,
    valid: true,
    country,
    changeCodes,
    metadata,
  })
}
