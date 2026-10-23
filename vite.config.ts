import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: fileURLToPath(new URL('./playground', import.meta.url)),
  plugins: [react()],
  build: { outDir: '../demo-dist', emptyOutDir: true },
});
