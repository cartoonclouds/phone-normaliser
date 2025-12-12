import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/utils/phone/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 97, // One unreachable branch due to defensive programming
        statements: 100,
      },
    },
  },
})
