const require_validatePhone = require('./validatePhone-DcyPx7Wi.cjs');
const require_normalisePhone = require('./normalisePhone-DByPLWb9.cjs');

//#region src/directives/phone.ts
/**
* Normalises directive binding values and resolves the preview target.
*
* @property {object} binding - The directive binding object
* @property {PhoneOpts} binding.value - The directive binding value
* @property {ElWithState} el - The host element for the directive
* @returns {ResolvedOpts} The resolved options and preview element
*/
function resolve(binding, el) {
	const value = binding.value || {};
	return {
		opts: {
			autoFormat: value.autoFormat ?? false,
			previewSelector: value.previewSelector,
			onnormalised: value.onnormalised,
			blocklist: value.blocklist || require_validatePhone.DEFAULT_BLOCKLIST,
			defaultCountry: value.defaultCountry,
			fallbackCountries: value.fallbackCountries || [...require_validatePhone.DEFAULT_REGION_FALLBACKS],
			allowedCountries: value.allowedCountries,
			format: value.format,
			stripExtensions: value.stripExtensions ?? true,
			autoFormatEvents: {
				onInput: value.autoFormatEvents?.onInput ?? true,
				onBlur: value.autoFormatEvents?.onBlur ?? true
			}
		},
		previewEl: value.previewSelector ? el.closest("form")?.querySelector(value.previewSelector) ?? document.querySelector(value.previewSelector) : null
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
	target.textContent = phone ?? "";
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
		const input = el;
		const { opts, previewEl } = resolve(binding, input);
		if (!previewEl && Boolean(binding?.value?.previewSelector)) console.warn("[v-phone] Preview element not found for selector:", { previewSelector: binding.value?.previewSelector });
		const run = (raw) => {
			const r = require_normalisePhone.normalisePhone(raw, opts);
			if (previewEl) setPreview(previewEl, r.phone, r.valid);
			if (r.valid) return r;
			input.dispatchEvent(new CustomEvent("directive:phone:normalised", { detail: r }));
			opts.onnormalised?.(r);
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
		if (opts.autoFormatEvents?.onInput ?? true) input.addEventListener("input", onEvent);
		if (opts.autoFormatEvents?.onBlur ?? true) input.addEventListener("blur", onEvent);
		input.__phone__ = {
			onEvent,
			previewEl,
			opts
		};
	},
	updated(el, binding) {
		const input = el;
		if (!input.__phone__) return;
		const { opts, previewEl } = resolve(binding, input);
		input.__phone__.opts = opts;
		if (previewEl instanceof HTMLElement) input.__phone__.previewEl = previewEl;
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
//# sourceMappingURL=phone-B_BzYQK7.cjs.map