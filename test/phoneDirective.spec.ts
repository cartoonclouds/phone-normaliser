import { beforeEach, describe, expect, it, vi } from 'vitest'

import PhoneDirective, { type PhoneOpts } from '../src/directives/phone'

describe('PhoneDirective', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  function mount(value: string, options: PhoneOpts) {
    const input = document.createElement('input')
    input.value = value
    document.body.appendChild(input)
    PhoneDirective.mounted(input, { value: options })

    return input
  }

  it('auto formats values on input', () => {
    const input = mount('4155552671', {
      autoFormat: true,
      defaultCountry: 'US',
    })

    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(input.value).toBe('+14155552671')
  })

  it('updates preview elements', () => {
    const preview = document.createElement('div')
    preview.id = 'preview'
    document.body.appendChild(preview)

    mount('+44 (0) 7911 123456', {
      defaultCountry: 'GB',
      previewSelector: '#preview',
    })

    expect(preview.textContent).toBe('+447911123456')
    expect(preview.getAttribute('data-valid')).toBe('true')
  })

  it('dispatches events and callbacks when numbers are invalid', () => {
    const onnormalised = vi.fn()
    const input = mount('+14155552671', {
      blocklist: {
        exact: ['+14155552671'],
      },
      onnormalised,
    })

    const handler = vi.fn()
    input.addEventListener('directive:phone:normalised', handler)
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(handler).toHaveBeenCalled()
    expect(onnormalised).toHaveBeenCalled()
  })

  it('tears down listeners on unmount', () => {
    const input = mount('4155552671', {
      autoFormat: true,
      defaultCountry: 'US',
    })

    expect((input as any).__phone__).toBeDefined()
    PhoneDirective.beforeUnmount(input)
    expect((input as any).__phone__).toBeUndefined()
  })

  it('updates resolved options when the binding changes', () => {
    const previewOne = document.createElement('div')
    previewOne.id = 'preview-one'
    const previewTwo = document.createElement('div')
    previewTwo.id = 'preview-two'
    document.body.append(previewOne, previewTwo)

    const input = mount('07911123456', {
      defaultCountry: 'GB',
      previewSelector: '#preview-one',
    })

    PhoneDirective.updated(input, {
      value: {
        defaultCountry: 'GB',
        previewSelector: '#preview-two',
      },
    })

    expect(previewTwo.textContent).toBe('+447911123456')
    expect((input as any).__phone__.previewEl).toBe(previewTwo)
  })

  it('warns when preview targets are missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount('+14155552671', {
      defaultCountry: 'US',
      previewSelector: '#missing',
    })

    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('supports granular auto format event toggles', () => {
    const input = mount('4155552671', {
      autoFormat: true,
      defaultCountry: 'US',
      autoFormatEvents: {
        onInput: false,
        onBlur: true,
      },
    })

    input.value = '4155552671'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(input.value).toBe('4155552671')

    input.dispatchEvent(new Event('blur', { bubbles: true }))
    expect(input.value).toBe('+14155552671')
  })
})
