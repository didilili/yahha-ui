import { readFile } from 'node:fs/promises';
import type { Plugin } from 'vite';

/** Ship the existing font notices alongside each independently deployable site. */
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
    },
  };
}
