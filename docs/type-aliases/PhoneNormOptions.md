[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: PhoneNormOptions

> **PhoneNormOptions** = [`PhoneValidationOptions`](PhoneValidationOptions.md) & `object`

Defined in: [utils/phone/types.ts:69](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L69)

Extends validation options with normalisation-specific toggles.

## Type Declaration

### enabled?

> `optional` **enabled**: `boolean`

Whether normalisation is enabled.

### format?

> `optional` **format**: [`PhoneFormat`](PhoneFormat.md)

Desired output format for normalised numbers.

### stripExtensions?

> `optional` **stripExtensions**: `boolean`

Whether to strip extensions during normalisation.

### symbolMap?

> `optional` **symbolMap**: `Record`\<`string`, `string`\>

Map of symbols to transliterate before parsing.
