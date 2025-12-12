[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: PhoneNormResult

> **PhoneNormResult** = `object`

Defined in: [utils/phone/types.ts:83](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L83)

Structured result returned by normalisePhone().

## Properties

### changeCodes

> **changeCodes**: [`PhoneChangeCode`](PhoneChangeCode.md)[]

Defined in: [utils/phone/types.ts:91](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L91)

Low-level change codes applied during normalisation.

***

### changes

> **changes**: `string`[]

Defined in: [utils/phone/types.ts:93](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L93)

Human-readable reasons for changes applied.

***

### country

> **country**: `CountryCode` \| `null`

Defined in: [utils/phone/types.ts:89](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L89)

Detected country code or null if undetermined.

***

### metadata

> **metadata**: `object`

Defined in: [utils/phone/types.ts:95](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L95)

Metadata about the normalised phone number.

#### e164

> **e164**: `E164Number` \| `null`

E.164 formatted phone number or null if unavailable.

#### extension

> **extension**: `string` \| `null`

Extracted extension or null if unavailable.

#### international

> **international**: `string` \| `null`

International formatted phone number or null if unavailable.

#### national

> **national**: `string` \| `null`

National formatted phone number or null if unavailable.

#### type

> **type**: `NumberType` \| `null`

Detected number type or null if undetermined.

***

### phone

> **phone**: `string` \| `null`

Defined in: [utils/phone/types.ts:85](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L85)

Normalised phone number or null if invalid.

***

### valid

> **valid**: `boolean`

Defined in: [utils/phone/types.ts:87](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L87)

Whether the phone number is valid.
