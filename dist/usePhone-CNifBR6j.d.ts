import { c as UsePhoneOptions } from "./types-MF4ky8NW.js";
import * as vue0 from "vue";

//#region src/composables/usePhone.d.ts

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
declare function usePhone(initial?: string, opts?: UsePhoneOptions): {
  value: vue0.Ref<string, string>;
  phone: vue0.ComputedRef<string | null>;
  valid: vue0.ComputedRef<boolean>;
  changes: vue0.ComputedRef<string[]>;
  apply: () => void;
  validate: () => boolean;
};
//#endregion
export { usePhone as t };
//# sourceMappingURL=usePhone-CNifBR6j.d.ts.map