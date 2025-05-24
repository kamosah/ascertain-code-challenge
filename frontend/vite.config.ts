import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@components', replacement: '/src/components' },
      { find: '@views', replacement: '/src/views' },
      { find: '@ui', replacement: '/src/components/ui' },
      { find: '@layout', replacement: '/src/components/layout' },
      { find: '@queries', replacement: '/src/queries' },
      { find: '@types', replacement: '/src/types' },
      { find: '@test', replacement: '/src/test' },
    ],
  },
  // @ts-expect-error - Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
