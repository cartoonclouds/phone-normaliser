import { _ as PhoneValidationCode, o as PhoneValidationOptions, s as ResolvePhoneConfig, t as PhoneBlockConfig, u as ValidationResults } from "./types-MF4ky8NW.js";
import { CountryCode, PhoneNumber } from "libphonenumber-js/max";

//#region src/utils/phone/validatePhone.d.ts

/**
 * Maps PhoneValidationCode values to human-readable text.
 *
 * @param {PhoneValidationCode} code - The validation code to convert
 * @returns {string | null
 */
declare function validationCodeToReason(code: PhoneValidationCode): string | null;
/**
 * Returns true when the provided string is only whitespace.
 *
 * @param {string} raw - The raw input string to check
 * @returns {boolean} - True if the string is empty or whitespace only
 */
declare function isEmpty(raw: string): boolean;
/**
 * Cheap guard to avoid parsing obviously invalid strings.
 *
 * @param {string} raw - The raw input string to check
 * @returns {boolean} - True if the string looks like a phone number
 */
declare function looksLikePhone(raw: string): boolean;
/**
 * Evaluates the provided number against block/allow rules.
 *
 * @param {string | null | undefined} value - The phone number in E.164 format
 * @param {PhoneBlockConfig} cfg - The blocklist configuration to use
 * @param {string | null} country - The country code of the phone number
 * @returns {boolean} - True if the number is blocklisted
 */
declare function isBlockedNumber(value: string | null | undefined, cfg: PhoneBlockConfig, country: string | null): boolean;
/**
 * Attempts to parse by walking default/fallback regions.
 *
 * @param {string} raw - The raw phone number string to parse
 * @param {ResolvePhoneConfig} [config] - Configuration for default and fallback countries
 * @returns {{ phoneNumber: PhoneNumber; usedFallback?: CountryCode } | null} - Parsed phone number and optional fallback country
 */
declare function resolvePhoneNumber(raw: string, config?: ResolvePhoneConfig): {
  phoneNumber: PhoneNumber;
  usedFallback?: CountryCode;
} | null;
/**
 * Performs multi-pass validation and returns every triggered rule.
 *
 * @param {string} raw - The raw phone number string to validate
 * @param {PhoneValidationOptions} [options] - Validation options
 * @returns {ValidationResults} - Array of validation results
 */
declare function validatePhone(raw: string, options?: PhoneValidationOptions): ValidationResults;
//#endregion
export { validatePhone as a, resolvePhoneNumber as i, isEmpty as n, validationCodeToReason as o, looksLikePhone as r, isBlockedNumber as t };
//# sourceMappingURL=validatePhone-KiNdhG1w.d.ts.map