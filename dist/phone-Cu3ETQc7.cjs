const require_validatePhone = require('./validatePhone-DR-nxat8.cjs');
const require_normalisePhone = require('./normalisePhone-D0WSEuo0.cjs');

//#region src/directives/phone.ts
/** Safely returns the global document when running in the browser. */
function getDocument() {
	return typeof document === "undefined" ? null : document;
}
/**
* Normalises directive binding values and resolves the preview target.
*
* @property {object} binding - The directive binding object
* @property {PhoneOpts} binding.value - The directive binding value
* @property {ElWithState} el - The host element for the directive
* @returns {ResolvedOpts} The resolved options and preview element
*/
function resolve(binding, el) {
	var _value$autoFormat, _value$stripExtension, _value$autoFormatEven, _value$autoFormatEven2, _value$autoFormatEven3, _value$autoFormatEven4, _value$previewSelecto;
	const value = binding.value || {};
	const doc = getDocument();
	const opts = {
		autoFormat: (_value$autoFormat = value.autoFormat) !== null && _value$autoFormat !== void 0 ? _value$autoFormat : false,
		previewSelector: value.previewSelector,
		onnormalised: value.onnormalised,
		blocklist: value.blocklist || require_validatePhone.DEFAULT_BLOCKLIST,
		defaultCountry: value.defaultCountry,
		fallbackCountries: value.fallbackCountries || [...require_validatePhone.DEFAULT_REGION_FALLBACKS],
		allowedCountries: value.allowedCountries,
		format: value.format,
		stripExtensions: (_value$stripExtension = value.stripExtensions) !== null && _value$stripExtension !== void 0 ? _value$stripExtension : true,
		autoFormatEvents: {
			onInput: (_value$autoFormatEven = (_value$autoFormatEven2 = value.autoFormatEvents) === null || _value$autoFormatEven2 === void 0 ? void 0 : _value$autoFormatEven2.onInput) !== null && _value$autoFormatEven !== void 0 ? _value$autoFormatEven : true,
			onBlur: (_value$autoFormatEven3 = (_value$autoFormatEven4 = value.autoFormatEvents) === null || _value$autoFormatEven4 === void 0 ? void 0 : _value$autoFormatEven4.onBlur) !== null && _value$autoFormatEven3 !== void 0 ? _value$autoFormatEven3 : true
		}
	};
	const selector = (_value$previewSelecto = value.previewSelector) === null || _value$previewSelecto === void 0 ? void 0 : _value$previewSelecto.trim();
	let previewEl = null;
	let attemptedLookup = false;
	if (selector) {
		const formRoot = el.closest("form");
		if (formRoot) {
			attemptedLookup = true;
			previewEl = formRoot.querySelector(selector);
		}
		if (!previewEl && doc) {
			attemptedLookup = true;
			previewEl = doc.querySelector(selector);
		}
	}
	return {
		opts,
		previewEl,
		missingPreviewTarget: Boolean(selector && attemptedLookup && !previewEl && doc)
	};
}
/**
* Mirrors normalised values into the optional preview element.
*
* @property {HTMLElement | null | undefined} target - The element to update
* @property {string | null} phone - The normalised phone number
* @property {boolean} valid - Whether the phone number is valid
* @returns {void}
*/
function setPreview(target, phone, valid) {
	if (!target) return;
	target.textContent = phone !== null && phone !== void 0 ? phone : "";
	target.setAttribute("data-valid", String(valid));
}
/**
* Vue directive hooks for v-phone.
*
* Usage:
* <input v-phone="{ autoFormat: true, previewSelector: '#phonePreview' }" />
*
* The directive emits a 'directive:phone:normalised' event on the host element.
*
* @property {HTMLInputElement} el - The host element for the directive
* @property {object} binding - The directive binding object
* @property {PhoneOpts} binding.value - The directive binding value
*/
var phone_default = {
	mounted(el, binding) {
		var _opts$autoFormatEvent, _opts$autoFormatEvent2, _opts$autoFormatEvent3, _opts$autoFormatEvent4;
		const input = el;
		const { opts, previewEl, missingPreviewTarget } = resolve(binding, input);
		if (missingPreviewTarget) {
			var _binding$value;
			console.warn("[v-phone] Preview element not found for selector:", { previewSelector: (_binding$value = binding.value) === null || _binding$value === void 0 ? void 0 : _binding$value.previewSelector });
		}
		const run = (raw) => {
			var _opts$onnormalised;
			const r = require_normalisePhone.normalisePhone(raw, opts);
			if (previewEl) setPreview(previewEl, r.phone, r.valid);
			if (r.valid) return r;
			input.dispatchEvent(new CustomEvent("directive:phone:normalised", { detail: r }));
			(_opts$onnormalised = opts.onnormalised) === null || _opts$onnormalised === void 0 || _opts$onnormalised.call(opts, r);
			return r;
		};
		const onEvent = (e) => {
			const raw = e.target.value;
			const r = run(raw);
			if (opts.autoFormat && r.phone && raw !== r.phone) {
				input.value = r.phone;
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
			}
		};
		run(input.value || "");
		if ((_opts$autoFormatEvent = (_opts$autoFormatEvent2 = opts.autoFormatEvents) === null || _opts$autoFormatEvent2 === void 0 ? void 0 : _opts$autoFormatEvent2.onInput) !== null && _opts$autoFormatEvent !== void 0 ? _opts$autoFormatEvent : true) input.addEventListener("input", onEvent);
		if ((_opts$autoFormatEvent3 = (_opts$autoFormatEvent4 = opts.autoFormatEvents) === null || _opts$autoFormatEvent4 === void 0 ? void 0 : _opts$autoFormatEvent4.onBlur) !== null && _opts$autoFormatEvent3 !== void 0 ? _opts$autoFormatEvent3 : true) input.addEventListener("blur", onEvent);
		input.__phone__ = {
			onEvent,
			previewEl,
			opts
		};
	},
	updated(el, binding) {
		const input = el;
		if (!input.__phone__) return;
		const { opts, previewEl, missingPreviewTarget } = resolve(binding, input);
		input.__phone__.opts = opts;
		if (previewEl instanceof HTMLElement) input.__phone__.previewEl = previewEl;
		if (missingPreviewTarget) {
			var _binding$value2;
			console.warn("[v-phone] Preview element not found for selector:", { previewSelector: (_binding$value2 = binding.value) === null || _binding$value2 === void 0 ? void 0 : _binding$value2.previewSelector });
		}
		const r = require_normalisePhone.normalisePhone(input.value || "", opts);
		setPreview(previewEl, r.phone, r.valid);
	},
	beforeUnmount(el) {
		const input = el;
		if (!input.__phone__) return;
		input.removeEventListener("input", input.__phone__.onEvent);
		input.removeEventListener("blur", input.__phone__.onEvent);
		delete input.__phone__;
	}
};

//#endregion
Object.defineProperty(exports, 'phone_default', {
  enumerable: true,
  get: function () {
    return phone_default;
  }
});
//# sourceMappingURL=phone-Cu3ETQc7.cjs.map