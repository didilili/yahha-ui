import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import {
  cp,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));
const exec = promisify(execFile);
const usage =
  '用法：node scripts/create-starter.mjs [--example starter|blog] [--output /absolute/path/project]';

async function exists(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

async function assertEmpty(directory) {
  const entry = await exists(directory);
  if (entry && (!entry.isDirectory() || entry.isSymbolicLink()))
    throw new Error('输出位置必须是普通目录，不能是文件或符号链接。');
  if (entry && (await readdir(directory)).length) throw new Error(`拒绝覆盖非空目录：${directory}`);
}

async function run(command, args, cwd = root, environment = {}) {
  try {
    const { stdout } = await exec(command, args, {
      cwd,
      env: { ...process.env, HUSKY: '0', ...environment },
      timeout: 180_000,
      maxBuffer: 8 * 1024 * 1024,
    });
    return stdout;
  } catch (error) {
    const detail =
      error.stdout || error.stderr ? `${error.stdout ?? ''}${error.stderr ?? ''}` : error.message;
    throw new Error(`${command} 执行失败\n${detail}`, {
      cause: error,
    });
  }
}

const npm = (args, environment) =>
  process.env.npm_execpath
    ? run(process.execPath, [process.env.npm_execpath, ...args], root, environment)
    : run(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, root, environment);

async function requireZip() {
  try {
    await exec('zip', ['-v']);
  } catch {
    throw new Error(
      '导出项目需要系统 zip 命令。请先安装 zip，再重新运行；接收并运行已导出的项目不需要 zip。',
    );
  }
}

function optionsFrom(args) {
  const options = { example: 'starter', output: undefined };
  const seen = new Set();
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (
      !['--example', '--output'].includes(key) ||
      seen.has(key) ||
      !value ||
      value.startsWith('--')
    )
      throw new Error(usage);
    seen.add(key);
    options[key.slice(2)] = value;
  }
  if (!['starter', 'blog'].includes(options.example)) throw new Error(usage);
  return options;
}

async function buildDocumentationSnapshot(directory) {
  console.log('正在核对文档与字体，并生成配套静态文档…');
  await npm(['run', 'check:docs']);
  await npm(['run', 'check:fonts']);
  await npm(['exec', '--', 'vite', 'build', '--outDir', directory, '--emptyOutDir'], {
    VITE_BLOG_URL: './blog/',
  });
  await npm([
    'exec',
    '--',
    'vite',
    'build',
    '--config',
    'examples/blog/vite.config.ts',
    '--outDir',
    join(directory, 'blog'),
    '--emptyOutDir',
  ]);
}

async function latestSourceTime(directory) {
  let latest = (await stat(directory)).mtimeMs;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) latest = Math.max(latest, await latestSourceTime(path));
    else if (!entry.name.includes('.test.')) latest = Math.max(latest, (await stat(path)).mtimeMs);
  }
  return latest;
}

async function ensureLibraryBuild() {
  const outputs = ['dist/index.js', 'dist/index.d.ts', 'dist/style.css'];
  const times = await Promise.all(
    outputs.map(async (path) => (await exists(join(root, path)))?.mtimeMs ?? 0),
  );
  const inputs = ['vite.lib.config.ts', 'tsconfig.json', 'tsconfig.lib.json', 'package-lock.json'];
  const inputTimes = await Promise.all(
    inputs.map(async (path) => (await stat(join(root, path))).mtimeMs),
  );
  if (Math.min(...times) < Math.max(await latestSourceTime(join(root, 'src')), ...inputTimes)) {
    console.log('正在构建当前组件库…');
    await npm(['run', 'build:lib']);
  }
}

async function main() {
  const options = optionsFrom(process.argv.slice(2));
  await requireZip();
  const name = options.example === 'blog' ? 'yahha-ui-blog' : 'yahha-ui-starter';
  const output = options.output
    ? resolve(options.output)
    : join(await mkdtemp(join(tmpdir(), `${name}-`)), name);
  await assertEmpty(output);
  if (await exists(`${output}.zip`)) throw new Error(`压缩包已存在，拒绝覆盖：${output}.zip`);
  let ancestor = dirname(output);
  let suffix = basename(output);
  while (!(await exists(ancestor))) {
    suffix = join(basename(ancestor), suffix);
    ancestor = dirname(ancestor);
  }
  const resolvedOutput = join(await realpath(ancestor), suffix);
  const repository = await realpath(root);
  if (resolvedOutput === repository || resolvedOutput.startsWith(`${repository}${sep}`))
    throw new Error('请将最小项目导出到组件库仓库之外。');
  await mkdir(dirname(output), { recursive: true });
  const outputParent = await realpath(dirname(output));

  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
  const version = (name) => {
    const exact = lock.packages?.[`node_modules/${name}`]?.version;
    if (
      !pkg.devDependencies[name] ||
      !exact ||
      lock.packages[''].devDependencies[name] !== pkg.devDependencies[name]
    )
      throw new Error(`请先同步 package.json 与 package-lock.json：${name}`);
    return exact;
  };
  const dependencyNames = [
    'react',
    'react-dom',
    ...(options.example === 'blog' ? ['lucide-react'] : []),
  ];
  const dependencies = Object.fromEntries(dependencyNames.map((name) => [name, version(name)]));
  const devDependencies = Object.fromEntries(
    [
      '@types/node',
      '@types/react',
      '@types/react-dom',
      '@vitejs/plugin-react',
      'typescript',
      'vite',
    ].map((name) => [name, version(name)]),
  );
  await ensureLibraryBuild();
  const temporary = await mkdtemp(join(outputParent, '.yahha-starter-export-'));
  try {
    const projectParent = join(temporary, 'project');
    await mkdir(projectParent);
    const project = join(projectParent, basename(output));
    if (options.example === 'blog') {
      await cp(join(root, 'examples/blog'), project, {
        recursive: true,
        filter: (path) => !['dist', 'node_modules'].includes(basename(path)),
      });
      await mkdir(join(project, 'scripts'));
      await copyFile(
        join(root, 'scripts/starter-template/scripts/serve-documentation.mjs'),
        join(project, 'scripts/serve-documentation.mjs'),
      );
      await copyFile(
        join(root, 'scripts/starter-template/.gitignore'),
        join(project, '.gitignore'),
      );
      await copyFile(join(root, 'scripts/blog-export-readme.md'), join(project, 'README.md'));
      await copyFile(
        join(root, 'scripts/blog-export-assets-readme.md'),
        join(project, 'src/assets/README.md'),
      );
    } else {
      await cp(join(root, 'scripts/starter-template'), project, { recursive: true });
    }
    for (const path of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
      if (await exists(join(root, path))) await copyFile(join(root, path), join(project, path));
    }
    await buildDocumentationSnapshot(join(project, 'documentation'));
    const vendor = join(project, 'vendor');
    await mkdir(vendor);
    const packedOutput = await npm([
      'pack',
      '--json',
      '--ignore-scripts',
      '--pack-destination',
      vendor,
    ]);
    const [packed] = JSON.parse(packedOutput.slice(packedOutput.search(/\[\s*\{/)));
    if (packed.name !== pkg.name || packed.version !== pkg.version)
      throw new Error('安装包名称或版本与当前 package.json 不一致。');
    const unexpected = packed.files.filter(
      ({ path }) =>
        !/^(?:dist\/|package\.json$|THIRD_PARTY_NOTICES\.md$|(?:readme|licen[sc]e|changelog)(?:\.|$))/i.test(
          path,
        ),
    );
    if (unexpected.length) throw new Error('安装包包含分发白名单之外的文件。');
    const tarball = `vendor/${packed.filename}`;
    const manifest = {
      createdAt: new Date().toISOString(),
      example: options.example,
      documentation: {
        directory: 'documentation',
        entry: '#/components',
        blog: 'documentation/blog/',
      },
      library: {
        name: pkg.name,
        version: pkg.version,
        tarball,
        sha256: createHash('sha256')
          .update(await readFile(join(vendor, packed.filename)))
          .digest('hex'),
      },
      toolchain: {
        source: 'root package.json + package-lock.json',
        ...dependencies,
        ...devDependencies,
      },
    };
    const starterPackage = {
      name,
      version: '0.0.0',
      license: 'MIT',
      private: true,
      type: 'module',
      packageManager: pkg.packageManager,
      engines: pkg.engines,
      scripts: {
        dev: 'vite --host 127.0.0.1',
        typecheck: 'tsc --noEmit',
        build: 'npm run typecheck && vite build',
        preview: 'vite preview --host 127.0.0.1',
        docs: 'node scripts/serve-documentation.mjs',
      },
      dependencies: { ...dependencies, [pkg.name]: `file:./${tarball}` },
      devDependencies,
    };
    await writeFile(join(project, 'package.json'), `${JSON.stringify(starterPackage, null, 2)}\n`);
    await writeFile(
      join(project, 'starter-manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    const readme = await readFile(join(project, 'README.md'), 'utf8');
    await writeFile(
      join(project, 'README.md'),
      readme.replaceAll('{{VERSION}}', pkg.version).replaceAll('{{NODE}}', pkg.engines.node),
    );
    const archive = join(temporary, 'starter.zip');
    await run('zip', ['-q', '-r', archive, `./${basename(project)}`], projectParent);
    await assertEmpty(output);
    await copyFile(archive, `${output}.zip`, constants.COPYFILE_EXCL);
    await rename(project, output);
    console.log(
      `导出项目：${output}\n压缩包：${output}.zip\n组件版本：${pkg.version}\n运行 npm run docs 可直接阅读配套文档；运行项目先 npm install，再 npm run dev。首次安装需要网络。`,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
