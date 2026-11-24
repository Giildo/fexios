export default {
  plugins: ['@stryker-mutator/vitest-runner'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.ts',
  },
  mutate: ['src/**/*.ts', '!src/**/__tests__/**', '!src/**/*.d.ts'],
  reporters: ['progress', 'clear-text', 'html'],
  thresholds: {
    high: 80,
    low: 60,
    break: 70,
  },
  incremental: true,
  incrementalFile: '.stryker-tmp/incremental.json',
}
