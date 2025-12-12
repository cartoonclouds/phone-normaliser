import type { CountryCode, E164Number, NumberType } from 'libphonenumber-js'

import type { PhoneChangeCode, PhoneValidationCode } from './constants'

/**
 * Supported phone number output encodings.
 */
export type PhoneFormat = 'E.164' | 'INTERNATIONAL' | 'NATIONAL' | 'RFC3966'

/**
 * Return signature for string transforms that track whether they changed the input.
 */
export type PhoneFixResult = {
  /** Transformed string output. */
  out: string
  /** Flag indicating if the input was changed. */
  changed: boolean
}

/**
 * Block/allow constraints that gate normalisation/validation.
 */
export type PhoneBlockConfig = {
  /** Exact phone numbers to block/allow. */
  exact?: Array<E164Number | string>
  /** Prefixes that identify blocked numbers. */
  prefixes?: string[]
  /** Countries associated with blocked numbers. */
  countries?: Array<CountryCode>
  /** Regex patterns that identify blocked numbers. */
  patterns?: string[]
  /** Length-based rules for blocking numbers. */
  lengths?: {
    /** Minimum length of blocked numbers. */
    min?: number
    /** Maximum length of blocked numbers. */
    max?: number
  }
  /** Exact phone numbers to explicitly allow. */
  allow?: {
    /** Exact phone numbers to allow. */
    exact?: Array<E164Number | string>
  }
}

/**
 * Configuration bag for standalone validation checks.
 */
export type PhoneValidationOptions = {
  /** Blocklist rules to enforce during validation. */
  blocklist?: PhoneBlockConfig
  /** Default country code for parsing numbers without a prefix. */
  defaultCountry?: CountryCode
  /** Fallback country codes for parsing ambiguous numbers. */
  fallbackCountries?: Array<CountryCode>
  /** List of allowed country codes for the number. */
  allowedCountries?: Array<CountryCode>
  /** Whether to consider extensions during validation. */
  allowExtensions?: boolean
  /** Minimum length for valid phone numbers. */
  minLength?: number
  /** Maximum length for valid phone numbers. */
  maxLength?: number
}

/**
 * Extends validation options with normalisation-specific toggles.
 */
export type PhoneNormOptions = PhoneValidationOptions & {
  /** Whether normalisation is enabled. */
  enabled?: boolean
  /** Whether to strip extensions during normalisation. */
  stripExtensions?: boolean
  /** Desired output format for normalised numbers. */
  format?: PhoneFormat
  /** Map of symbols to transliterate before parsing. */
  symbolMap?: Record<string, string>
}

/**
 * Structured result returned by normalisePhone().
 */
export type PhoneNormResult = {
  /** Normalised phone number or null if invalid. */
  phone: string | null
  /** Whether the phone number is valid. */
  valid: boolean
  /** Detected country code or null if undetermined. */
  country: CountryCode | null
  /** Low-level change codes applied during normalisation. */
  changeCodes: PhoneChangeCode[]
  /** Human-readable reasons for changes applied. */
  changes: string[]
  /** Metadata about the normalised phone number. */
  metadata: {
    /** E.164 formatted phone number or null if unavailable. */
    e164: E164Number | null
    /** International formatted phone number or null if unavailable. */
    international: string | null
    /** National formatted phone number or null if unavailable. */
    national: string | null
    /** Detected number type or null if undetermined. */
    type: NumberType | null
    /** Extracted extension or null if unavailable. */
    extension: string | null
  }
}

/**
 * Single validation outcome emitted by validatePhone().
 */
export type ValidationResult = {
  /** Whether the phone number passed validation. */
  isValid: boolean
  /** Validation code indicating the result. */
  validationCode: PhoneValidationCode
  /** Human-readable message explaining the validation result. */
  validationMessage: string
}

/** Convenience alias for arrays of validation results. */
export type ValidationResults = ValidationResult[]

/** Options accepted by the usePhone composable. */
export type UsePhoneOptions = PhoneNormOptions & {
  /** Whether to auto-format the bound input value. */
  autoFormat?: boolean
}

/** Minimal configuration required by resolvePhoneNumber(). */
export type ResolvePhoneConfig = {
  /** Default country code for parsing numbers without a prefix. */
  defaultCountry?: CountryCode
  /** Fallback country codes for parsing ambiguous numbers. */
  fallbackCountries?: Array<CountryCode>
}
