import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  entry: {
    index: 'src/index.ts',
    'utils/phone/normalisePhone': 'src/utils/phone/normalisePhone.ts',
    'utils/phone/validatePhone': 'src/utils/phone/validatePhone.ts',
    'composables/usePhone': 'src/composables/usePhone.ts',
    'directives/phone': 'src/directives/phone.ts',
  },
  treeshake: true,
  minify: false,
  target: 'es2018',
  platform: 'browser',
})
