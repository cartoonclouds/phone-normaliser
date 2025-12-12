[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Function: isBlockedNumber()

> **isBlockedNumber**(`value`, `cfg`, `country`): `boolean`

Defined in: [utils/phone/validatePhone.ts:103](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/validatePhone.ts#L103)

Evaluates the provided number against block/allow rules.

## Parameters

### value

The phone number in E.164 format

`string` | `null` | `undefined`

### cfg

[`PhoneBlockConfig`](../type-aliases/PhoneBlockConfig.md)

The blocklist configuration to use

### country

The country code of the phone number

`string` | `null`

## Returns

`boolean`

- True if the number is blocklisted
