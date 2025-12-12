# Development Guide – @cartoonclouds/phone-normaliser

This package provides the shared phone normalisation helpers used across the GLP frontend mono-repo. The stack mirrors the email-normaliser package (tsdown + Vitest + Typedoc) but targets `libphonenumber-js`.

## Local workflow

```bash
npm install        # install deps
npm run dev        # tsdown watch build
npm run build      # production bundle + types
npm run test       # Vitest (100% coverage target)
npm run docs       # Generate markdown docs into ./docs
```

For mono-repo linking run `npm run build` and reinstall the workspace root so Vite picks up the latest dist output.

## Project layout

```
src/
  utils/phone/     # constants, types, validation + normalisation
  composables/     # usePhone
  directives/      # v-phone directive
  index.ts         # package entry + exports
```

### Key modules

- `normalisePhone.ts` – wraps libphonenumber parsing with region fallbacks, blocklists, and formatting.
- `validatePhone.ts` – standalone validation that returns structured `ValidationResult[]` entries.
- `types.ts` – single source of truth for blocklists, options, and result shapes.
- `constants.ts` – default blocklists, fallback regions, and change/validation codes.
- `usePhone.ts` and `directives/phone.ts` – Vue-facing APIs.

## Testing guidance

- Keep fixtures country-agnostic. Tests should cover US, GB, EU, and African prefixes to ensure multi-region reliability.
- Mocking is rarely required—`libphonenumber-js` is deterministic. Prefer exercising the real parser with realistic inputs.
- Directive tests live under `test/phoneDirective.spec.ts` (jsdom environment). Utilities use the Node environment for speed.

## Publishing checklist

1. `npm run lint && npm run test`
2. `npm run build` (ensures dist + types regenerate)
3. Update `package.json` version + changelog entry
4. `npm publish --access public`

Happy shipping!
