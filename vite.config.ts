import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/eat-a-rai-dee/' : '/',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
