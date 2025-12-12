[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Type Alias: ValidationResult

> **ValidationResult** = `object`

Defined in: [utils/phone/types.ts:112](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L112)

Single validation outcome emitted by validatePhone().

## Properties

### isValid

> **isValid**: `boolean`

Defined in: [utils/phone/types.ts:114](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L114)

Whether the phone number passed validation.

***

### validationCode

> **validationCode**: [`PhoneValidationCode`](PhoneValidationCode.md)

Defined in: [utils/phone/types.ts:116](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L116)

Validation code indicating the result.

***

### validationMessage

> **validationMessage**: `string`

Defined in: [utils/phone/types.ts:118](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/types.ts#L118)

Human-readable message explaining the validation result.
