[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: PhoneValidationOptions

> **PhoneValidationOptions** = `object`

Defined in: [utils/phone/types.ts:49](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L49)

Configuration bag for standalone validation checks.

## Properties

### allowedCountries?

> `optional` **allowedCountries**: `CountryCode`[]

Defined in: [utils/phone/types.ts:57](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L57)

List of allowed country codes for the number.

***

### allowExtensions?

> `optional` **allowExtensions**: `boolean`

Defined in: [utils/phone/types.ts:59](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L59)

Whether to consider extensions during validation.

***

### blocklist?

> `optional` **blocklist**: [`PhoneBlockConfig`](PhoneBlockConfig.md)

Defined in: [utils/phone/types.ts:51](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L51)

Blocklist rules to enforce during validation.

***

### defaultCountry?

> `optional` **defaultCountry**: `CountryCode`

Defined in: [utils/phone/types.ts:53](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L53)

Default country code for parsing numbers without a prefix.

***

### fallbackCountries?

> `optional` **fallbackCountries**: `CountryCode`[]

Defined in: [utils/phone/types.ts:55](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L55)

Fallback country codes for parsing ambiguous numbers.

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [utils/phone/types.ts:63](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L63)

Maximum length for valid phone numbers.

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [utils/phone/types.ts:61](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L61)

Minimum length for valid phone numbers.
