import { parsePhoneNumberFromString } from "libphonenumber-js/max";

//#region src/utils/phone/constants.ts
/** Ordered ISO codes to try when parsing numbers without a country hint. */
const DEFAULT_REGION_FALLBACKS = [
	"GB",
	"IE",
	"US",
	"CA",
	"AU",
	"NZ",
	"DE",
	"FR",
	"SG",
	"IN",
	"ZA",
	"KE"
];
/** Guard rails for phone number length validation when callers provide none. */
const DEFAULT_MIN_LENGTH = 8;
/** Guard rails for phone number length validation when callers provide none. */
const DEFAULT_MAX_LENGTH = 15;
/** Maps common unicode digits/symbols to ASCII counterparts before parsing. */
const SYMBOL_TRANSLITERATION_MAP = {
	"＋": "+",
	"−": "-",
	"–": "-",
	"—": "-",
	"﹣": "-",
	"（": "(",
	"）": ")",
	"【": "(",
	"】": ")",
	"　": " ",
	"０": "0",
	"１": "1",
	"２": "2",
	"３": "3",
	"４": "4",
	"５": "5",
	"６": "6",
	"７": "7",
	"８": "8",
	"９": "9",
	"٠": "0",
	"١": "1",
	"٢": "2",
	"٣": "3",
	"٤": "4",
	"٥": "5",
	"٦": "6",
	"٧": "7",
	"٨": "8",
	"٩": "9"
};
/** Opinionated starter blocklist that callers can extend or replace. */
const DEFAULT_BLOCKLIST = {
	exact: [
		"+15555555555",
		"+18005551234",
		"+447700900000"
	],
	prefixes: [
		"+000",
		"+999",
		"+1234567"
	],
	countries: [],
	patterns: ["^(?:+?1)?1234567"],
	lengths: { min: DEFAULT_MIN_LENGTH },
	allow: { exact: [] }
};
/** All validation result codes surfaced by validatePhone(). */
const PhoneValidationCodes = Object.freeze({
	VALID: "VALID",
	EMPTY: "EMPTY",
	INVALID_FORMAT: "INVALID_FORMAT",
	BLOCKLISTED: "BLOCKLISTED",
	COUNTRY_NOT_ALLOWED: "COUNTRY_NOT_ALLOWED",
	TOO_SHORT: "TOO_SHORT",
	TOO_LONG: "TOO_LONG",
	EXTENSION_NOT_ALLOWED: "EXTENSION_NOT_ALLOWED",
	UNKNOWN_REGION: "UNKNOWN_REGION"
});
/** Machine-readable change codes produced by normalisePhone(). */
const PhoneChangeCodes = Object.freeze({
	NORMALISED_SYMBOLS: "normalised_symbols",
	STRIPPED_EXTENSION: "stripped_extension",
	APPLIED_DEFAULT_COUNTRY: "applied_default_country",
	FORMATTED_OUTPUT: "formatted_output",
	BLOCKED_BY_LIST: "blocked_by_list",
	COUNTRY_NOT_ALLOWED: "country_not_allowed",
	INVALID_SHAPE: "invalid_shape"
});

//#endregion
//#region src/utils/phone/validatePhone.ts
/**
* Maps PhoneValidationCode values to human-readable text.
*
* @param {PhoneValidationCode} code - The validation code to convert
* @returns {string | null
*/
function validationCodeToReason(code) {
	switch (code) {
		case PhoneValidationCodes.EMPTY: return "Phone number is empty.";
		case PhoneValidationCodes.INVALID_FORMAT: return "Phone number is not in a valid format.";
		case PhoneValidationCodes.BLOCKLISTED: return "Phone number is blocklisted.";
		case PhoneValidationCodes.COUNTRY_NOT_ALLOWED: return "Phone number country is not permitted.";
		case PhoneValidationCodes.TOO_SHORT: return "Phone number is shorter than the configured minimum length.";
		case PhoneValidationCodes.TOO_LONG: return "Phone number is longer than the configured maximum length.";
		case PhoneValidationCodes.EXTENSION_NOT_ALLOWED: return "Phone number contains an extension but extensions are disabled.";
		case PhoneValidationCodes.UNKNOWN_REGION: return "Could not determine the phone number region.";
		case PhoneValidationCodes.VALID: return "Phone number is valid.";
		default:
			console.warn(`Unknown phone validation code: ${code}`);
			return null;
	}
}
/**
* Returns true when the provided string is only whitespace.
*
* @param {string} raw - The raw input string to check
* @returns {boolean} - True if the string is empty or whitespace only
*/
function isEmpty(raw) {
	return String(raw ?? "").trim().length === 0;
}
/**
* Cheap guard to avoid parsing obviously invalid strings.
*
* @param {string} raw - The raw input string to check
* @returns {boolean} - True if the string looks like a phone number
*/
function looksLikePhone(raw) {
	const digits = String(raw ?? "").replace(/\D/g, "");
	return digits.length >= 6 && digits.length <= 18;
}
/**
* Removes whitespace from E.164 strings while preserving the prefix.
*
* @param {string | null | undefined} value - The E.164 string to normalise
* @returns {string | null
*/
function normaliseE164(value) {
	if (!value) return null;
	return value.replace(/\s+/g, "");
}
/**
* Evaluates the provided number against block/allow rules.
*
* @param {string | null | undefined} value - The phone number in E.164 format
* @param {PhoneBlockConfig} cfg - The blocklist configuration to use
* @param {string | null} country - The country code of the phone number
* @returns {boolean} - True if the number is blocklisted
*/
function isBlockedNumber(value, cfg, country) {
	const e164 = normaliseE164(value);
	if (!e164) return false;
	if ((cfg.allow?.exact?.map((entry) => normaliseE164(entry) ?? "") ?? []).includes(e164)) return false;
	if ((cfg.exact?.map((entry) => normaliseE164(entry) ?? "") ?? []).includes(e164)) return true;
	if (cfg.prefixes?.some((prefix) => e164.startsWith(prefix))) return true;
	if (cfg.countries?.length && country && cfg.countries.includes(country)) return true;
	if (cfg.patterns) for (const pattern of cfg.patterns) try {
		if (new RegExp(pattern).test(e164)) return true;
	} catch {
		continue;
	}
	const digitsOnly = e164.replace(/[^0-9]/g, "");
	const min = cfg.lengths?.min;
	const max = cfg.lengths?.max;
	if (min && digitsOnly.length < min) return true;
	if (max && digitsOnly.length > max) return true;
	return false;
}
/**
* Wraps libphonenumber parsing so we can ignore thrown errors.
*
* @param {string} raw - The raw phone number string to parse
* @param {CountryCode} [country] - Optional country code to assist parsing
* @returns {PhoneNumber | undefined} - Parsed phone number or undefined on failure
*/
function safeParse(raw, country) {
	try {
		return parsePhoneNumberFromString(raw, country);
	} catch {
		return;
	}
}
/**
* Attempts to parse by walking default/fallback regions.
*
* @param {string} raw - The raw phone number string to parse
* @param {ResolvePhoneConfig} [config] - Configuration for default and fallback countries
* @returns {{ phoneNumber: PhoneNumber; usedFallback?: CountryCode } | null} - Parsed phone number and optional fallback country
*/
function resolvePhoneNumber(raw, config = {}) {
	const value = String(raw ?? "");
	const direct = safeParse(value);
	if (direct) return { phoneNumber: direct };
	const seen = /* @__PURE__ */ new Set();
	const attempts = [];
	if (config.defaultCountry) attempts.push(config.defaultCountry);
	if (config.fallbackCountries?.length) attempts.push(...config.fallbackCountries);
	attempts.push(...DEFAULT_REGION_FALLBACKS);
	for (const attempt of attempts) {
		if (!attempt) continue;
		if (seen.has(attempt)) continue;
		seen.add(attempt);
		const parsed = safeParse(value, attempt);
		if (parsed) return {
			phoneNumber: parsed,
			usedFallback: attempt
		};
	}
	const lastChance = safeParse(value);
	if (lastChance) return { phoneNumber: lastChance };
	return null;
}
/**
* Performs multi-pass validation and returns every triggered rule.
*
* @param {string} raw - The raw phone number string to validate
* @param {PhoneValidationOptions} [options] - Validation options
* @returns {ValidationResults} - Array of validation results
*/
function validatePhone(raw, options = {}) {
	const results = [];
	const blocklist = options.blocklist || DEFAULT_BLOCKLIST;
	const minLength = options.minLength ?? DEFAULT_MIN_LENGTH;
	const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;
	const allowExtensions = options.allowExtensions ?? false;
	if (isEmpty(raw)) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.EMPTY,
		validationMessage: validationCodeToReason(PhoneValidationCodes.EMPTY)
	});
	if (!looksLikePhone(raw)) {
		results.push({
			isValid: false,
			validationCode: PhoneValidationCodes.INVALID_FORMAT,
			validationMessage: validationCodeToReason(PhoneValidationCodes.INVALID_FORMAT)
		});
		return results;
	}
	const resolved = resolvePhoneNumber(raw, {
		defaultCountry: options.defaultCountry,
		fallbackCountries: options.fallbackCountries
	});
	if (!resolved) {
		results.push({
			isValid: false,
			validationCode: PhoneValidationCodes.INVALID_FORMAT,
			validationMessage: validationCodeToReason(PhoneValidationCodes.INVALID_FORMAT)
		});
		return results;
	}
	const { phoneNumber } = resolved;
	const country = phoneNumber.country ?? null;
	const digitsLength = (phoneNumber.nationalNumber || "").length;
	if (!phoneNumber.isValid()) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.INVALID_FORMAT,
		validationMessage: validationCodeToReason(PhoneValidationCodes.INVALID_FORMAT)
	});
	if (digitsLength && digitsLength < minLength) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.TOO_SHORT,
		validationMessage: validationCodeToReason(PhoneValidationCodes.TOO_SHORT)
	});
	if (digitsLength && digitsLength > maxLength) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.TOO_LONG,
		validationMessage: validationCodeToReason(PhoneValidationCodes.TOO_LONG)
	});
	if (options.allowedCountries?.length && (!country || !options.allowedCountries.includes(country))) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.COUNTRY_NOT_ALLOWED,
		validationMessage: validationCodeToReason(PhoneValidationCodes.COUNTRY_NOT_ALLOWED)
	});
	if (!country) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.UNKNOWN_REGION,
		validationMessage: validationCodeToReason(PhoneValidationCodes.UNKNOWN_REGION)
	});
	const e164 = phoneNumber.number;
	if (isBlockedNumber(e164, blocklist, country)) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.BLOCKLISTED,
		validationMessage: validationCodeToReason(PhoneValidationCodes.BLOCKLISTED)
	});
	if (!allowExtensions && phoneNumber.ext) results.push({
		isValid: false,
		validationCode: PhoneValidationCodes.EXTENSION_NOT_ALLOWED,
		validationMessage: validationCodeToReason(PhoneValidationCodes.EXTENSION_NOT_ALLOWED)
	});
	return results.length ? results : [{
		isValid: true,
		validationCode: PhoneValidationCodes.VALID,
		validationMessage: validationCodeToReason(PhoneValidationCodes.VALID)
	}];
}

//#endregion
export { validatePhone as a, DEFAULT_MAX_LENGTH as c, PhoneChangeCodes as d, PhoneValidationCodes as f, resolvePhoneNumber as i, DEFAULT_MIN_LENGTH as l, isEmpty as n, validationCodeToReason as o, SYMBOL_TRANSLITERATION_MAP as p, looksLikePhone as r, DEFAULT_BLOCKLIST as s, isBlockedNumber as t, DEFAULT_REGION_FALLBACKS as u };
//# sourceMappingURL=validatePhone-CiBuROp_.mjs.map