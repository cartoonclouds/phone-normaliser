import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_REGION_FALLBACKS } from '../src/utils/phone/constants'
import { resolvePhoneNumber } from '../src/utils/phone/validatePhone'

const { parseMock } = vi.hoisted(() => ({
  parseMock: vi.fn(),
}))

vi.mock('libphonenumber-js/max', () => ({
  parsePhoneNumberFromString: parseMock,
}))

describe('resolvePhoneNumber internals', () => {
  beforeEach(() => {
    parseMock.mockReset()
  })

  it('performs a last-chance parse when every region fails', () => {
    const fakeNumber = { number: '+19998887777' } as const
    let calls = 0

    parseMock.mockImplementation(() => {
      calls += 1
      if (calls === DEFAULT_REGION_FALLBACKS.length + 2) {
        return fakeNumber
      }

      return undefined
    })

    const result = resolvePhoneNumber('+19998887777')

    expect(result?.phoneNumber).toBe(fakeNumber)
    expect(parseMock).toHaveBeenCalledTimes(DEFAULT_REGION_FALLBACKS.length + 2)
  })

  it('swallows parser errors and returns null', () => {
    parseMock.mockImplementation(() => {
      throw new Error('explode')
    })

    expect(resolvePhoneNumber('bad-input')).toBeNull()
  })
})
