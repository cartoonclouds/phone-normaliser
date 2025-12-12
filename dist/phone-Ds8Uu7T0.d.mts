import { i as PhoneNormOptions } from "./types-CobluScz.mjs";
import { t as normalisePhone } from "./normalisePhone-BMpuQhry.mjs";

//#region src/directives/phone.d.ts

/**
 * Public options accepted by the v-phone directive binding.
 *
 * Usage:
 * <input v-phone="{ autoFormat: true, previewSelector: '#phonePreview' }" />
 * <input v-phone="{ onnormalised: (result) => console.log(result) }" />
 */
type PhoneOpts = PhoneNormOptions & {
  autoFormat?: boolean;
  autoFormatEvents?: {
    onInput?: boolean;
    onBlur?: boolean;
  };
  previewSelector?: string;
  onnormalised?: (r: ReturnType<typeof normalisePhone>) => void;
};
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
declare const _default: {
  /** Initialises listeners, preview target, and auto-format behaviour. */
  mounted(el: HTMLInputElement, binding: {
    value?: PhoneOpts;
  }): void;
  /**
   * Re-resolves options whenever the binding object changes.
   *
   * @property {HTMLInputElement} el - The host element for the directive
   * @property {object} binding - The directive binding object
   * @property {PhoneOpts} binding.value - The directive binding value
   * @returns {void}
   */
  updated(el: HTMLInputElement, binding: {
    value?: PhoneOpts;
  }): void;
  /**
   * Tears down listeners/state when the host element leaves the DOM.
   *
   * @property {HTMLInputElement} el - The host element for the directive
   * @returns {void}
   */
  beforeUnmount(el: HTMLInputElement): void;
};
//#endregion
export { _default as n, PhoneOpts as t };
//# sourceMappingURL=phone-Ds8Uu7T0.d.mts.map