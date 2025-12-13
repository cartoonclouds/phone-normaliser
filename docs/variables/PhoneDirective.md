[**@cartoonclouds/phone-normaliser v0.1.0**](../README.md)

***

# Variable: PhoneDirective

> **PhoneDirective**: `object`

Defined in: [directives/phone.ts:146](https://gitlab.com/good-life/glp-frontend/-/blob/main/packages/phone-normaliser/src/directives/phone.ts#L146)

Vue directive hooks for v-phone.

Usage:
<input v-phone="{ autoFormat: true, previewSelector: '#phonePreview' }" />

The directive emits a 'directive:phone:normalised' event on the host element.

## Type Declaration

### beforeUnmount()

> **beforeUnmount**(`el`): `void`

Tears down listeners/state when the host element leaves the DOM.

#### Parameters

##### el

`HTMLInputElement`

The host element for the directive

#### Returns

`void`

### mounted()

> **mounted**(`el`, `binding`): `void`

Initialises listeners, preview target, and auto-format behaviour.

#### Parameters

##### el

`HTMLInputElement`

##### binding

###### value?

[`PhoneOpts`](../type-aliases/PhoneOpts.md)

#### Returns

`void`

### updated()

> **updated**(`el`, `binding`): `void`

Re-resolves options whenever the binding object changes.

#### Parameters

##### el

`HTMLInputElement`

The host element for the directive

##### binding

The directive binding object

###### value?

[`PhoneOpts`](../type-aliases/PhoneOpts.md)

#### Returns

`void`
