import { t as normalisePhone } from "./normalisePhone-C6vIMQes.js";
import { computed, ref, watch } from "vue";

//#region src/composables/usePhone.ts
/**
* Vue composable that wraps normalisePhone() with handy refs/computed state.
*
* Provides reactive phone number processing with automatic normalization, validation,
* and optional auto-formatting. Returns reactive references and helper functions
* to manage phone input state.
*
* @param {string} initial - Initial phone value (default: '')
* @param {UsePhoneOptions} opts - Configuration options
* @returns {object} Phone composable interface
* @returns {Ref<string>} returns.value - Reactive phone input value
* @returns {ComputedRef<string | null>} returns.phone - normalised phone number
* @returns {ComputedRef<boolean>} returns.valid - Whether the phone number is valid
* @returns {ComputedRef<string[]>} returns.changes - List of changes made during normalization
* @returns {ComputedRef<PhoneNormResult>} returns.result - Full normalization result
* @returns {Function} returns.apply - Apply normalised phone to the input value
* @returns {Function} returns.validate - Manually trigger validation
*/
function usePhone(initial = "", opts = {}) {
	var _opts$autoFormat;
	opts.autoFormat = (_opts$autoFormat = opts.autoFormat) !== null && _opts$autoFormat !== void 0 ? _opts$autoFormat : false;
	const isValid = ref(true);
	const value = ref(initial);
	const result = computed(() => normalisePhone(value.value, opts));
	const phone = computed(() => result.value.phone);
	const valid = computed(() => isValid.value && result.value.valid);
	const changes = computed(() => result.value.changes);
	/** Applies the formatted number back into the bound input ref. */
	function apply() {
		if (phone.value && value.value !== phone.value) value.value = phone.value;
	}
	/** Re-runs normalisePhone() and caches the latest validity. */
	function validate() {
		isValid.value = normalisePhone(value.value, opts).valid;
		return isValid.value;
	}
	watch(result, (nv) => {
		isValid.value = nv.valid;
	});
	watch(value, (nv) => {
		if (opts.autoFormat && phone.value && nv !== phone.value) value.value = phone.value;
	});
	return {
		value,
		phone,
		valid,
		changes,
		apply,
		validate
	};
}

//#endregion
export { usePhone as t };
//# sourceMappingURL=usePhone-YgkKuXvt.js.map