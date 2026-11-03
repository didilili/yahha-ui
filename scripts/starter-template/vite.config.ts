import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'yahha-project-notices',
      async generateBundle() {
        for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
          const path = new URL(`./${name}`, import.meta.url);
          if (!existsSync(path)) continue;
          this.emitFile({
            type: 'asset',
            fileName: `notices/${name}`,
            source: await readFile(path, 'utf8'),
          });
        }
      },
    },
  ],
  base: './',
});
