const require_validatePhone = require('./validatePhone-DR-nxat8.cjs');

//#region src/utils/phone/normalisePhone.ts
/**
* Replaces unicode digits/symbols using the provided transliteration map.
*
* @param value - Raw phone number string to process.
* @param map - Mapping of unicode characters to ASCII replacements.
* @returns Object containing the transliterated string and a change flag.
*/
function applySymbolMap(value, map) {
	let out = value;
	for (const [from, to] of Object.entries(map)) {
		const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		out = out.replace(new RegExp(escaped, "g"), to);
	}
	return {
		out,
		changed: out !== value
	};
}
/**
* Removes obvious prefixes/extra whitespace prior to parsing.
*
* @param value - Raw phone number string to tidy.
* @returns Object containing the tidied string and a change flag.
*/
function tidyDialString(value) {
	let out = value.replace(/^(tel|phone|call)[:\s]+/i, "");
	out = out.replace(/\s+/g, " ").trim();
	return {
		out,
		changed: out !== value
	};
}
/**
* Pulls trailing extension notes off the raw number before validation.
*
* @param value - Raw phone number string to process.
* @returns Object containing the string without extension, the extracted extension, and a change flag.
*/
function stripExtension(value) {
	const match = value.match(/(?:ext\.?|extension|x|#)\s*(\d{1,6})$/i);
	if (!match) return {
		out: value,
		extension: null,
		changed: false
	};
	return {
		out: value.slice(0, match.index).trim(),
		extension: match[1] || null,
		changed: true
	};
}
/**
* Converts internal change codes into human-readable reasons.
*
* @param codes - List of phone change codes to map.
* @returns Array of human-readable change reasons.
*/
function mapChangeCodesToReason(codes) {
	const reasons = [];
	for (const code of codes) switch (code) {
		case require_validatePhone.PhoneChangeCodes.NORMALISED_SYMBOLS:
			reasons.push("Converted unicode digits and separators.");
			break;
		case require_validatePhone.PhoneChangeCodes.STRIPPED_EXTENSION:
			reasons.push("Removed phone extension text.");
			break;
		case require_validatePhone.PhoneChangeCodes.APPLIED_DEFAULT_COUNTRY:
			reasons.push("Applied default or fallback country code.");
			break;
		case require_validatePhone.PhoneChangeCodes.FORMATTED_OUTPUT:
			reasons.push("Formatted using the requested output style.");
			break;
		case require_validatePhone.PhoneChangeCodes.BLOCKED_BY_LIST:
			reasons.push("Phone number is blocklisted.");
			break;
		case require_validatePhone.PhoneChangeCodes.COUNTRY_NOT_ALLOWED:
			reasons.push("Phone number country is not permitted.");
			break;
		case require_validatePhone.PhoneChangeCodes.INVALID_SHAPE:
			reasons.push("Phone number could not be parsed.");
			break;
		default:
			console.warn(`Unknown phone change code: ${code}`);
			break;
	}
	return reasons;
}
/**
* Ensures `changes` always mirrors `changeCodes` when returning results.
*
* @param params - Partial phone normalization result without `changes`.
* @returns Complete PhoneNormResult with human-readable `changes`.
*/
function buildResult(params) {
	return {
		...params,
		changes: mapChangeCodesToReason(params.changeCodes)
	};
}
/**
* Full phone number normaliser that cleans, parses, and validates input.
*
* @param raw - Raw phone number string to normalise.
* @param options - Normalisation configuration options.
* @returns Complete phone normalization result.
*/
function normalisePhone(raw, options = {}) {
	var _options$enabled, _options$stripExtensi, _phoneNumber$country, _phoneNumber$number, _phoneNumber$getType, _options$allowedCount, _options$format, _ref, _formatted;
	const enabled = (_options$enabled = options.enabled) !== null && _options$enabled !== void 0 ? _options$enabled : true;
	const changeCodes = [];
	const metadata = {
		e164: null,
		international: null,
		national: null,
		type: null,
		extension: null
	};
	if (!enabled) return buildResult({
		phone: raw !== null && raw !== void 0 ? raw : null,
		valid: true,
		country: null,
		changeCodes,
		metadata
	});
	let working = String(raw !== null && raw !== void 0 ? raw : "").trim();
	if (require_validatePhone.isEmpty(working)) {
		changeCodes.push(require_validatePhone.PhoneChangeCodes.INVALID_SHAPE);
		return buildResult({
			phone: null,
			valid: false,
			country: null,
			changeCodes,
			metadata
		});
	}
	const symbolMap = {
		...require_validatePhone.SYMBOL_TRANSLITERATION_MAP,
		...options.symbolMap || {}
	};
	const ascii = applySymbolMap(working, symbolMap);
	if (ascii.changed) {
		working = ascii.out;
		changeCodes.push(require_validatePhone.PhoneChangeCodes.NORMALISED_SYMBOLS);
	}
	const tidied = tidyDialString(working);
	if (tidied.changed) working = tidied.out;
	let extension = null;
	if ((_options$stripExtensi = options.stripExtensions) !== null && _options$stripExtensi !== void 0 ? _options$stripExtensi : true) {
		const stripped = stripExtension(working);
		if (stripped.changed) {
			working = stripped.out;
			extension = stripped.extension;
			changeCodes.push(require_validatePhone.PhoneChangeCodes.STRIPPED_EXTENSION);
		}
	}
	const resolved = require_validatePhone.resolvePhoneNumber(working, {
		defaultCountry: options.defaultCountry,
		fallbackCountries: options.fallbackCountries
	});
	if (!resolved) {
		changeCodes.push(require_validatePhone.PhoneChangeCodes.INVALID_SHAPE);
		return buildResult({
			phone: null,
			valid: false,
			country: null,
			changeCodes,
			metadata
		});
	}
	const { phoneNumber, usedFallback } = resolved;
	const country = (_phoneNumber$country = phoneNumber.country) !== null && _phoneNumber$country !== void 0 ? _phoneNumber$country : null;
	if (usedFallback) changeCodes.push(require_validatePhone.PhoneChangeCodes.APPLIED_DEFAULT_COUNTRY);
	if (!phoneNumber.isValid()) {
		changeCodes.push(require_validatePhone.PhoneChangeCodes.INVALID_SHAPE);
		return buildResult({
			phone: null,
			valid: false,
			country,
			changeCodes,
			metadata
		});
	}
	metadata.e164 = (_phoneNumber$number = phoneNumber.number) !== null && _phoneNumber$number !== void 0 ? _phoneNumber$number : null;
	metadata.international = phoneNumber.formatInternational();
	metadata.national = phoneNumber.formatNational();
	metadata.extension = extension || phoneNumber.ext || null;
	metadata.type = phoneNumber.getType ? (_phoneNumber$getType = phoneNumber.getType()) !== null && _phoneNumber$getType !== void 0 ? _phoneNumber$getType : null : null;
	const blocklist = options.blocklist || require_validatePhone.DEFAULT_BLOCKLIST;
	if (require_validatePhone.isBlockedNumber(metadata.e164, blocklist, country)) {
		changeCodes.push(require_validatePhone.PhoneChangeCodes.BLOCKED_BY_LIST);
		return buildResult({
			phone: metadata.e164,
			valid: false,
			country,
			changeCodes,
			metadata
		});
	}
	if (((_options$allowedCount = options.allowedCountries) === null || _options$allowedCount === void 0 ? void 0 : _options$allowedCount.length) && (!country || !options.allowedCountries.includes(country))) {
		changeCodes.push(require_validatePhone.PhoneChangeCodes.COUNTRY_NOT_ALLOWED);
		return buildResult({
			phone: metadata.e164,
			valid: false,
			country,
			changeCodes,
			metadata
		});
	}
	const format = (_options$format = options.format) !== null && _options$format !== void 0 ? _options$format : "E.164";
	let formatted = metadata.e164;
	switch (format) {
		case "INTERNATIONAL":
			formatted = phoneNumber.formatInternational();
			break;
		case "NATIONAL":
			formatted = phoneNumber.formatNational();
			break;
		default:
			formatted = metadata.e164;
			break;
	}
	if (format !== "E.164") changeCodes.push(require_validatePhone.PhoneChangeCodes.FORMATTED_OUTPUT);
	return buildResult({
		phone: (_ref = (_formatted = formatted) !== null && _formatted !== void 0 ? _formatted : metadata.international) !== null && _ref !== void 0 ? _ref : metadata.national,
		valid: true,
		country,
		changeCodes,
		metadata
	});
}

//#endregion
Object.defineProperty(exports, 'normalisePhone', {
  enumerable: true,
  get: function () {
    return normalisePhone;
  }
});
//# sourceMappingURL=normalisePhone-D0WSEuo0.cjs.map