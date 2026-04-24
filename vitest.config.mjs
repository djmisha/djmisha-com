import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,mjs}', 'tests/**/*.property.test.{js,mjs}'],
    testTimeout: 30000,
  },
});
