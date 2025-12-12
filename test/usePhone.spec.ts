import { describe, expect, it } from 'vitest'
import { effectScope, nextTick } from 'vue'

import { usePhone } from '../src/composables/usePhone'

describe('usePhone', () => {
  it('auto formats values when enabled', () => {
    const scope = effectScope()

    scope.run(() => {
      const composable = usePhone('415-555-2671', {
        autoFormat: true,
        defaultCountry: 'US',
      })

      expect(composable.phone.value).toBe('+14155552671')
      composable.apply()
      expect(composable.value.value).toBe('+14155552671')
    })

    scope.stop()
  })

  it('exposes change messages', () => {
    const scope = effectScope()

    scope.run(() => {
      const composable = usePhone('0044 7911 123456', {
        defaultCountry: 'GB',
      })

      expect(composable.valid.value).toBe(true)
      expect(composable.changes.value.length).toBeGreaterThanOrEqual(0)
    })

    scope.stop()
  })

  it('reactively auto-formats when the bound value changes', async () => {
    const scope = effectScope()

    await scope.run(async () => {
      const composable = usePhone('', {
        autoFormat: true,
        defaultCountry: 'US',
      })

      composable.value.value = '4155552671'
      await nextTick()

      expect(composable.value.value).toBe('+14155552671')
    })

    scope.stop()
  })

  it('validate() toggles state based on the latest input', () => {
    const scope = effectScope()

    scope.run(() => {
      const composable = usePhone('', {
        defaultCountry: 'US',
      })

      composable.value.value = 'not-a-phone'
      expect(composable.validate()).toBe(false)
      expect(composable.valid.value).toBe(false)

      composable.value.value = '+14155552671'
      expect(composable.validate()).toBe(true)
      expect(composable.valid.value).toBe(true)
    })

    scope.stop()
  })
})
