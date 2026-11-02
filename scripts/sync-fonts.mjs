import assert from 'node:assert/strict';
import { lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function fontFiles(directory, missingAllowed = false) {
  let info;
  try {
    info = await lstat(directory);
  } catch (error) {
    if (missingAllowed && error.code === 'ENOENT') return [];
    throw error;
  }
  assert(!info.isSymbolicLink(), `Font directory must not be a symbolic link: ${directory}`);
  assert(info.isDirectory(), `Expected a font directory: ${directory}`);
  const files = [];
  async function visit(relative = '') {
    for (const entry of await readdir(join(directory, relative), { withFileTypes: true })) {
      const path = join(relative, entry.name);
      assert(!entry.isSymbolicLink(), `Font files must not be symbolic links: ${path}`);
      if (entry.isDirectory()) await visit(path);
      else {
        assert(entry.isFile(), `Expected a regular font file: ${path}`);
        files.push(path);
      }
    }
  }
  await visit();
  return files.sort();
}

export async function syncFontDirectories(source, target, { check = false } = {}) {
  const sourceFiles = await fontFiles(source);
  assert(sourceFiles.includes('manifest.json'), 'Canonical fonts require manifest.json.');
  const targetFiles = await fontFiles(target, true);
  const sourceSet = new Set(sourceFiles);
  const targetSet = new Set(targetFiles);
  const changes = [];
  for (const path of sourceFiles) {
    const bytes = await readFile(join(source, path));
    const same = targetSet.has(path) && bytes.equals(await readFile(join(target, path)));
    if (same) continue;
    changes.push(`${targetSet.has(path) ? 'changed' : 'missing'}: ${path}`);
    if (!check) {
      await mkdir(dirname(join(target, path)), { recursive: true });
      await writeFile(join(target, path), bytes);
    }
  }
  for (const path of targetFiles) {
    if (sourceSet.has(path)) continue;
    changes.push(`extra: ${path}`);
    if (!check) await rm(join(target, path));
  }
  if (check) assert(changes.length === 0, `Blog fonts are out of sync:\n${changes.join('\n')}`);
  return { files: sourceFiles.length, changes: changes.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    assert(
      process.argv.slice(2).every((argument) => argument === '--check'),
      'Only --check is supported.',
    );
    const root = fileURLToPath(new URL('..', import.meta.url));
    const result = await syncFontDirectories(
      join(root, 'playground/src/assets/fonts'),
      join(root, 'examples/blog/src/assets/fonts'),
      { check: process.argv.includes('--check') },
    );
    console.log(
      `Font copies ${process.argv.includes('--check') ? 'checked' : 'synchronized'}: ${result.files} files.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
