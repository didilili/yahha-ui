import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fontNotices } from './scripts/font-notices.ts';
import { docsSearchIndex } from './scripts/docs-search.ts';

export default defineConfig({
  root: fileURLToPath(new URL('./playground', import.meta.url)),
  base: './',
  plugins: [
    react(),
    fontNotices(new URL('./playground/src/assets/', import.meta.url)),
    docsSearchIndex(new URL('./docs/components/', import.meta.url)),
  ],
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
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
    assetsInlineLimit: (path) => (path.endsWith('.woff2') ? false : undefined),
  },
});
