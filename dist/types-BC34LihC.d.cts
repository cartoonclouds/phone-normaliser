import { CountryCode, E164Number, NumberType } from "libphonenumber-js";

//#region src/utils/phone/constants.d.ts
/** Ordered ISO codes to try when parsing numbers without a country hint. */
declare const DEFAULT_REGION_FALLBACKS: ReadonlyArray<CountryCode>;
/** Guard rails for phone number length validation when callers provide none. */
declare const DEFAULT_MIN_LENGTH = 8;
/** Guard rails for phone number length validation when callers provide none. */
declare const DEFAULT_MAX_LENGTH = 15;
/** Maps common unicode digits/symbols to ASCII counterparts before parsing. */
declare const SYMBOL_TRANSLITERATION_MAP: Record<string, string>;
/** Opinionated starter blocklist that callers can extend or replace. */
declare const DEFAULT_BLOCKLIST: PhoneBlockConfig;
/** All validation result codes surfaced by validatePhone(). */
declare const PhoneValidationCodes: Readonly<{
  readonly VALID: "VALID";
  readonly EMPTY: "EMPTY";
  readonly INVALID_FORMAT: "INVALID_FORMAT";
  readonly BLOCKLISTED: "BLOCKLISTED";
  readonly COUNTRY_NOT_ALLOWED: "COUNTRY_NOT_ALLOWED";
  readonly TOO_SHORT: "TOO_SHORT";
  readonly TOO_LONG: "TOO_LONG";
  readonly EXTENSION_NOT_ALLOWED: "EXTENSION_NOT_ALLOWED";
  readonly UNKNOWN_REGION: "UNKNOWN_REGION";
}>;
/** Union helper for strongly typed validation codes. */
type PhoneValidationCode = (typeof PhoneValidationCodes)[keyof typeof PhoneValidationCodes];
/** Machine-readable change codes produced by normalisePhone(). */
declare const PhoneChangeCodes: Readonly<{
  readonly NORMALISED_SYMBOLS: "normalised_symbols";
  readonly STRIPPED_EXTENSION: "stripped_extension";
  readonly APPLIED_DEFAULT_COUNTRY: "applied_default_country";
  readonly FORMATTED_OUTPUT: "formatted_output";
  readonly BLOCKED_BY_LIST: "blocked_by_list";
  readonly COUNTRY_NOT_ALLOWED: "country_not_allowed";
  readonly INVALID_SHAPE: "invalid_shape";
}>;
/** Union helper for strongly typed change codes. */
type PhoneChangeCode = (typeof PhoneChangeCodes)[keyof typeof PhoneChangeCodes];
//#endregion
//#region src/utils/phone/types.d.ts
/**
 * Supported phone number output encodings.
 */
type PhoneFormat = 'E.164' | 'INTERNATIONAL' | 'NATIONAL' | 'RFC3966';
/**
 * Return signature for string transforms that track whether they changed the input.
 */
type PhoneFixResult = {
  /** Transformed string output. */
  out: string;
  /** Flag indicating if the input was changed. */
  changed: boolean;
};
/**
 * Block/allow constraints that gate normalisation/validation.
 */
type PhoneBlockConfig = {
  /** Exact phone numbers to block/allow. */
  exact?: Array<E164Number | string>;
  /** Prefixes that identify blocked numbers. */
  prefixes?: string[];
  /** Countries associated with blocked numbers. */
  countries?: Array<CountryCode>;
  /** Regex patterns that identify blocked numbers. */
  patterns?: string[];
  /** Length-based rules for blocking numbers. */
  lengths?: {
    /** Minimum length of blocked numbers. */
    min?: number;
    /** Maximum length of blocked numbers. */
    max?: number;
  };
  /** Exact phone numbers to explicitly allow. */
  allow?: {
    /** Exact phone numbers to allow. */
    exact?: Array<E164Number | string>;
  };
};
/**
 * Configuration bag for standalone validation checks.
 */
type PhoneValidationOptions = {
  /** Blocklist rules to enforce during validation. */
  blocklist?: PhoneBlockConfig;
  /** Default country code for parsing numbers without a prefix. */
  defaultCountry?: CountryCode;
  /** Fallback country codes for parsing ambiguous numbers. */
  fallbackCountries?: Array<CountryCode>;
  /** List of allowed country codes for the number. */
  allowedCountries?: Array<CountryCode>;
  /** Whether to consider extensions during validation. */
  allowExtensions?: boolean;
  /** Minimum length for valid phone numbers. */
  minLength?: number;
  /** Maximum length for valid phone numbers. */
  maxLength?: number;
};
/**
 * Extends validation options with normalisation-specific toggles.
 */
type PhoneNormOptions = PhoneValidationOptions & {
  /** Whether normalisation is enabled. */
  enabled?: boolean;
  /** Whether to strip extensions during normalisation. */
  stripExtensions?: boolean;
  /** Desired output format for normalised numbers. */
  format?: PhoneFormat;
  /** Map of symbols to transliterate before parsing. */
  symbolMap?: Record<string, string>;
};
/**
 * Structured result returned by normalisePhone().
 */
type PhoneNormResult = {
  /** Normalised phone number or null if invalid. */
  phone: string | null;
  /** Whether the phone number is valid. */
  valid: boolean;
  /** Detected country code or null if undetermined. */
  country: CountryCode | null;
  /** Low-level change codes applied during normalisation. */
  changeCodes: PhoneChangeCode[];
  /** Human-readable reasons for changes applied. */
  changes: string[];
  /** Metadata about the normalised phone number. */
  metadata: {
    /** E.164 formatted phone number or null if unavailable. */
    e164: E164Number | null;
    /** International formatted phone number or null if unavailable. */
    international: string | null;
    /** National formatted phone number or null if unavailable. */
    national: string | null;
    /** Detected number type or null if undetermined. */
    type: NumberType | null;
    /** Extracted extension or null if unavailable. */
    extension: string | null;
  };
};
/**
 * Single validation outcome emitted by validatePhone().
 */
type ValidationResult = {
  /** Whether the phone number passed validation. */
  isValid: boolean;
  /** Validation code indicating the result. */
  validationCode: PhoneValidationCode;
  /** Human-readable message explaining the validation result. */
  validationMessage: string;
};
/** Convenience alias for arrays of validation results. */
type ValidationResults = ValidationResult[];
/** Options accepted by the usePhone composable. */
type UsePhoneOptions = PhoneNormOptions & {
  /** Whether to auto-format the bound input value. */
  autoFormat?: boolean;
};
/** Minimal configuration required by resolvePhoneNumber(). */
type ResolvePhoneConfig = {
  /** Default country code for parsing numbers without a prefix. */
  defaultCountry?: CountryCode;
  /** Fallback country codes for parsing ambiguous numbers. */
  fallbackCountries?: Array<CountryCode>;
};
//#endregion
export { PhoneValidationCode as _, PhoneNormResult as a, UsePhoneOptions as c, DEFAULT_BLOCKLIST as d, DEFAULT_MAX_LENGTH as f, PhoneChangeCodes as g, PhoneChangeCode as h, PhoneNormOptions as i, ValidationResult as l, DEFAULT_REGION_FALLBACKS as m, PhoneFixResult as n, PhoneValidationOptions as o, DEFAULT_MIN_LENGTH as p, PhoneFormat as r, ResolvePhoneConfig as s, PhoneBlockConfig as t, ValidationResults as u, PhoneValidationCodes as v, SYMBOL_TRANSLITERATION_MAP as y };
//# sourceMappingURL=types-BC34LihC.d.cts.map