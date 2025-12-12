[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Function: usePhone()

> **usePhone**(`initial`, `opts`): `object`

Defined in: [composables/usePhone.ts:24](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/composables/usePhone.ts#L24)

Vue composable that wraps normalisePhone() with handy refs/computed state.

Provides reactive phone number processing with automatic normalization, validation,
and optional auto-formatting. Returns reactive references and helper functions
to manage phone input state.

## Parameters

### initial

`string` = `''`

Initial phone value (default: '')

### opts

[`UsePhoneOptions`](../type-aliases/UsePhoneOptions.md) = `{}`

Configuration options

## Returns

Phone composable interface

### apply()

> **apply**: () => `void`

Applies the formatted number back into the bound input ref.

#### Returns

`void`

### changes

> **changes**: `ComputedRef`\<`string`[]\>

### phone

> **phone**: `ComputedRef`\<`string` \| `null`\>

### valid

> **valid**: `ComputedRef`\<`boolean`\>

### validate()

> **validate**: () => `boolean`

Re-runs normalisePhone() and caches the latest validity.

#### Returns

`boolean`

### value

> **value**: `Ref`\<`string`, `string`\>
