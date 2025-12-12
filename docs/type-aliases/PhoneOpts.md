[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: PhoneOpts

> **PhoneOpts** = [`PhoneNormOptions`](PhoneNormOptions.md) & `object`

Defined in: [directives/phone.ts:15](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/directives/phone.ts#L15)

Public options accepted by the v-phone directive binding.

Usage:
<input v-phone="{ autoFormat: true, previewSelector: '#phonePreview' }" />
<input v-phone="{ onnormalised: (result) => console.log(result) }" />

## Type Declaration

### autoFormat?

> `optional` **autoFormat**: `boolean`

### autoFormatEvents?

> `optional` **autoFormatEvents**: `object`

#### autoFormatEvents.onBlur?

> `optional` **onBlur**: `boolean`

#### autoFormatEvents.onInput?

> `optional` **onInput**: `boolean`

### onnormalised()?

> `optional` **onnormalised**: (`r`) => `void`

#### Parameters

##### r

`ReturnType`\<*typeof* [`normalisePhone`](../functions/normalisePhone.md)\>

#### Returns

`void`

### previewSelector?

> `optional` **previewSelector**: `string`
