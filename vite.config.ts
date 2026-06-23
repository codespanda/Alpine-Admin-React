import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ command }) => ({
  // Served from https://<user>.github.io/Alpine-Admin-React/ in production.
  base: command === 'build' ? '/Alpine-Admin-React/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
