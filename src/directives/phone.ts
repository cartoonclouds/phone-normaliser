import { getDocument } from '../utils/dom/getDocument'
import {
  DEFAULT_BLOCKLIST,
  DEFAULT_REGION_FALLBACKS,
} from '../utils/phone/constants'
import { normalisePhone } from '../utils/phone/normalisePhone'
import type { PhoneNormOptions } from '../utils/phone/types'

/**
 * Public options accepted by the v-phone directive binding.
 *
 * Usage:
 * <input v-phone="{ autoFormat: true, previewSelector: '#phonePreview' }" />
 * <input v-phone="{ onnormalised: (result) => console.log(result) }" />
 */
export type PhoneOpts = PhoneNormOptions & {
  autoFormat?: boolean
  autoFormatEvents?: {
    onInput?: boolean
    onBlur?: boolean
  }
  previewSelector?: string
  onnormalised?: (r: ReturnType<typeof normalisePhone>) => void
}

/**
 * Internal element shape so we can hang directive state on inputs.
 *
 * Must be an element that has a 'value' property (e.g., HTMLHTMLInputElement, HTMLTextAreaElement).
 *
 * @property {object} __phone__ - Directive state
 * @property {Function} __phone__.onEvent - Event handler for input/blur events
 * @property {HTMLElement | null} __phone__.previewEl - The resolved preview target element
 * @property {PhoneOpts} __phone__.opts - The resolved directive options
 */
type ElWithState = HTMLInputElement & {
  __phone__?: {
    onEvent: (e: Event) => void
    previewEl?: HTMLElement | null
    opts: PhoneOpts
  }
}

/**
 * Result returned when binding values are normalised.
 *
 * @property {PhoneOpts} opts - The resolved directive options
 * @property {HTMLElement | null} previewEl - The resolved preview target element
 */
type ResolvedOpts = {
  opts: PhoneOpts
  previewEl: HTMLElement | null
  missingPreviewTarget: boolean
}

/**
 * Normalises directive binding values and resolves the preview target.
 *
 * @property {object} binding - The directive binding object
 * @property {PhoneOpts} binding.value - The directive binding value
 * @property {ElWithState} el - The host element for the directive
 * @returns {ResolvedOpts} The resolved options and preview element
 */
function resolve(
  binding: { value?: PhoneOpts },
  el: ElWithState
): ResolvedOpts {
  const value = binding.value || {}
  const doc = getDocument()

  const opts: PhoneOpts = {
    autoFormat: value.autoFormat ?? false,
    previewSelector: value.previewSelector,
    onnormalised: value.onnormalised,
    blocklist: value.blocklist || DEFAULT_BLOCKLIST,
    defaultCountry: value.defaultCountry,
    fallbackCountries: value.fallbackCountries || [...DEFAULT_REGION_FALLBACKS],
    allowedCountries: value.allowedCountries,
    format: value.format,
    stripExtensions: value.stripExtensions ?? true,
    autoFormatEvents: {
      onInput: value.autoFormatEvents?.onInput ?? true,
      onBlur: value.autoFormatEvents?.onBlur ?? true,
    },
  }

  const selector = value.previewSelector?.trim()
  let previewEl: HTMLElement | null = null
  let attemptedLookup = false

  if (selector) {
    const formRoot = el.closest('form')
    if (formRoot) {
      attemptedLookup = true
      previewEl = formRoot.querySelector(selector)
    }

    if (!previewEl && doc) {
      attemptedLookup = true
      previewEl = doc.querySelector(selector)
    }
  }

  return {
    opts,
    previewEl,
    missingPreviewTarget: Boolean(
      selector && attemptedLookup && !previewEl && doc
    ),
  }
}

/**
 * Mirrors normalised values into the optional preview element.
 *
 * @property {HTMLElement | null | undefined} target - The element to update
 * @property {string | null} phone - The normalised phone number
 * @property {boolean} valid - Whether the phone number is valid
 * @returns {void}
 */
function setPreview(
  target: HTMLElement | null | undefined,
  phone: string | null,
  valid: boolean
) {
  if (!target) {
    return
  }

  target.textContent = phone ?? ''
  target.setAttribute('data-valid', String(valid))
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
export default {
  /** Initialises listeners, preview target, and auto-format behaviour. */
  mounted(el: HTMLInputElement, binding: { value?: PhoneOpts }) {
    const input = el as ElWithState
    const { opts, previewEl, missingPreviewTarget } = resolve(binding, input)

    if (missingPreviewTarget) {
      console.warn('[v-phone] Preview element not found for selector:', {
        previewSelector: binding.value?.previewSelector,
      })
    }

    const run = (raw: string) => {
      const r = normalisePhone(raw, opts)

      if (previewEl) {
        setPreview(previewEl, r.phone, r.valid)
      }

      if (r.valid) {
        return r
      }

      input.dispatchEvent(
        new CustomEvent('directive:phone:normalised', { detail: r })
      )
      opts.onnormalised?.(r)

      return r
    }

    const onEvent = (e: Event) => {
      const raw = (e.target as HTMLInputElement).value
      const r = run(raw)

      if (opts.autoFormat && r.phone && raw !== r.phone) {
        input.value = r.phone
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    run(input.value || '')

    if (opts.autoFormatEvents?.onInput ?? true) {
      input.addEventListener('input', onEvent)
    }

    if (opts.autoFormatEvents?.onBlur ?? true) {
      input.addEventListener('blur', onEvent)
    }

    input.__phone__ = {
      onEvent,
      previewEl,
      opts,
    }
  },

  /**
   * Re-resolves options whenever the binding object changes.
   *
   * @property {HTMLInputElement} el - The host element for the directive
   * @property {object} binding - The directive binding object
   * @property {PhoneOpts} binding.value - The directive binding value
   * @returns {void}
   */
  updated(el: HTMLInputElement, binding: { value?: PhoneOpts }) {
    const input = el as ElWithState

    if (!input.__phone__) {
      return
    }

    const { opts, previewEl, missingPreviewTarget } = resolve(binding, input)
    input.__phone__.opts = opts

    if (previewEl instanceof HTMLElement) {
      input.__phone__.previewEl = previewEl
    }

    if (missingPreviewTarget) {
      console.warn('[v-phone] Preview element not found for selector:', {
        previewSelector: binding.value?.previewSelector,
      })
    }

    const r = normalisePhone(input.value || '', opts)
    setPreview(previewEl, r.phone, r.valid)
  },

  /**
   * Tears down listeners/state when the host element leaves the DOM.
   *
   * @property {HTMLInputElement} el - The host element for the directive
   * @returns {void}
   */
  beforeUnmount(el: HTMLInputElement) {
    const input = el as ElWithState

    if (!input.__phone__) {
      return
    }

    input.removeEventListener('input', input.__phone__.onEvent)
    input.removeEventListener('blur', input.__phone__.onEvent)

    delete input.__phone__
  },
}
