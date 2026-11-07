import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
assert(
  args.every((argument) => argument === '--check'),
  'Only --check is supported.',
);

for (const script of [
  'generate-friends-artwork.mjs',
  'build-friends-heads.mjs',
  'sync-little-days-artwork.mjs',
  'build-friends-decorations.mjs',
]) {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL(script, import.meta.url)), ...args],
    { stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
