[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: ResolvePhoneConfig

> **ResolvePhoneConfig** = `object`

Defined in: [utils/phone/types.ts:131](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L131)

Minimal configuration required by resolvePhoneNumber().

## Properties

### defaultCountry?

> `optional` **defaultCountry**: `CountryCode`

Defined in: [utils/phone/types.ts:133](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L133)

Default country code for parsing numbers without a prefix.

***

### fallbackCountries?

> `optional` **fallbackCountries**: `CountryCode`[]

Defined in: [utils/phone/types.ts:135](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L135)

Fallback country codes for parsing ambiguous numbers.
