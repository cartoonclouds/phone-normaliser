import { computed, ref, watch } from 'vue'

import { normalisePhone } from '../utils/phone/normalisePhone'
import type { PhoneNormResult, UsePhoneOptions } from '../utils/phone/types'

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
export function usePhone(initial = '', opts: UsePhoneOptions = {}) {
  opts.autoFormat = opts.autoFormat ?? false

  const isValid = ref(true)
  const value = ref<string>(initial)
  const result = computed<PhoneNormResult>(() =>
    normalisePhone(value.value, opts)
  )
  const phone = computed(() => result.value.phone)
  const valid = computed(() => isValid.value && result.value.valid)
  const changes = computed(() => result.value.changes)

  /** Applies the formatted number back into the bound input ref. */
  function apply() {
    if (phone.value && value.value !== phone.value) {
      value.value = phone.value
    }
  }

  /** Re-runs normalisePhone() and caches the latest validity. */
  function validate(): boolean {
    const next = normalisePhone(value.value, opts)
    isValid.value = next.valid

    return isValid.value
  }

  watch(result, (nv) => {
    isValid.value = nv.valid
  })

  watch(value, (nv) => {
    if (opts.autoFormat && phone.value && nv !== phone.value) {
      value.value = phone.value
    }
  })

  return {
    value,
    phone,
    valid,
    changes,
    apply,
    validate,
  }
}
