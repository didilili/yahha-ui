import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [
    react(),
    {
      // Keep this inside the portable example: test-blog copies only examples/blog/.
      name: 'yahha-font-notices',
      async generateBundle() {
        for (const name of ['OFL-wenkai.txt', 'OFL-marker.txt']) {
          this.emitFile({
            type: 'asset',
            fileName: `notices/${name}`,
            source: await readFile(new URL(`./src/assets/${name}`, import.meta.url), 'utf8'),
          });
        }
        // Resolve the installed library so this also works in an exported blog.
        for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
          this.emitFile({
            type: 'asset',
            fileName: `notices/${name}`,
            source: await readFile(new URL(`../${name}`, import.meta.resolve('yahha-ui')), 'utf8'),
          });
        }
      },
    },
  ],
  resolve: { dedupe: ['react', 'react-dom'] },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: (path) => (path.endsWith('.woff2') ? false : undefined),
  },
});
