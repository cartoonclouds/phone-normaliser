[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: PhoneBlockConfig

> **PhoneBlockConfig** = `object`

Defined in: [utils/phone/types.ts:23](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L23)

Block/allow constraints that gate normalisation/validation.

## Properties

### allow?

> `optional` **allow**: `object`

Defined in: [utils/phone/types.ts:40](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L40)

Exact phone numbers to explicitly allow.

#### exact?

> `optional` **exact**: (`E164Number` \| `string`)[]

Exact phone numbers to allow.

***

### countries?

> `optional` **countries**: `CountryCode`[]

Defined in: [utils/phone/types.ts:29](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L29)

Countries associated with blocked numbers.

***

### exact?

> `optional` **exact**: (`E164Number` \| `string`)[]

Defined in: [utils/phone/types.ts:25](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L25)

Exact phone numbers to block/allow.

***

### lengths?

> `optional` **lengths**: `object`

Defined in: [utils/phone/types.ts:33](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L33)

Length-based rules for blocking numbers.

#### max?

> `optional` **max**: `number`

Maximum length of blocked numbers.

#### min?

> `optional` **min**: `number`

Minimum length of blocked numbers.

***

### patterns?

> `optional` **patterns**: `string`[]

Defined in: [utils/phone/types.ts:31](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L31)

Regex patterns that identify blocked numbers.

***

### prefixes?

> `optional` **prefixes**: `string`[]

Defined in: [utils/phone/types.ts:27](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L27)

Prefixes that identify blocked numbers.
