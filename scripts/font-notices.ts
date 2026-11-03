import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import type { Plugin } from 'vite';

/** Ship project and font licenses alongside the independently deployable site. */
export function fontNotices(directory: URL): Plugin {
  return {
    name: 'yahha-font-notices',
    async generateBundle() {
      for (const name of ['OFL-wenkai.txt', 'OFL-marker.txt']) {
        this.emitFile({
          type: 'asset',
          fileName: `notices/${name}`,
          source: await readFile(new URL(name, directory), 'utf8'),
        });
      }
      for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
        const path = new URL(`../${name}`, import.meta.url);
        if (!existsSync(path)) continue;
        this.emitFile({
          type: 'asset',
          fileName: `notices/${name}`,
          source: await readFile(path, 'utf8'),
        });
      }
    },
  };
}
