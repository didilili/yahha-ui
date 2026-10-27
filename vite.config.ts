import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: fileURLToPath(new URL('./playground', import.meta.url)),
  base: './',
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^yahha-ui\/style\.css$/,
        replacement: fileURLToPath(new URL('./src/theme/theme.module.css', import.meta.url)),
      },
      {
        find: /^yahha-ui$/,
        replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      },
    ],
  },
  build: { outDir: '../demo-dist', emptyOutDir: true },
});
