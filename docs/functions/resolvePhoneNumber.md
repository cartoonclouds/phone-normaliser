[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Function: resolvePhoneNumber()

> **resolvePhoneNumber**(`raw`, `config?`): \{ `phoneNumber`: `PhoneNumber`; `usedFallback?`: `CountryCode`; \} \| `null`

Defined in: [utils/phone/validatePhone.ts:190](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/utils/phone/validatePhone.ts#L190)

Attempts to parse by walking default/fallback regions.

## Parameters

### raw

`string`

The raw phone number string to parse

### config?

[`ResolvePhoneConfig`](../type-aliases/ResolvePhoneConfig.md) = `{}`

Configuration for default and fallback countries

## Returns

\{ `phoneNumber`: `PhoneNumber`; `usedFallback?`: `CountryCode`; \} \| `null`

- Parsed phone number and optional fallback country
