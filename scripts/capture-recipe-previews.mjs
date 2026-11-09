import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4175/';
const output = fileURLToPath(new URL('../playground/src/assets/recipes/', import.meta.url));
const examples = [
  { name: 'reading', page: 'reading', id: 'reading-example' },
  { name: 'archive', page: 'states', id: 'scene-blog-archive' },
  { name: 'editing', page: 'states', id: 'scene-article-actions' },
  { name: 'loading', page: 'states', id: 'scene-loading' },
  { name: 'empty', page: 'states', id: 'scene-empty' },
  { name: 'not-found', page: 'states', id: 'scene-not-found' },
];

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1494, height: 1600 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  });
  for (const example of examples) {
    await page.goto(`${baseURL}#/guides/${example.page}?section=${example.id}`);
    const preview = page.locator(`#${example.id} .example-preview`);
    await preview.waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (example.name === 'reading')
      await preview.getByRole('switch', { name: '显示文章配图', exact: true }).uncheck();
    if (example.name === 'loading') {
      await preview.locator('.story-loading-content[data-state="success"]').waitFor();
      await preview.getByRole('combobox', { name: '下次加载结果', exact: true }).click();
      await page.getByRole('option', { name: '加载失败', exact: true }).click();
      await preview.getByRole('button', { name: '重新加载文章', exact: true }).click();
      await preview.locator('.story-loading-content[data-state="error"]').waitFor();
    }
    // Only the exported frame changes: component layout, text and controls stay intact.
    await preview.evaluate((node, name) => {
      Object.assign(node.style, {
        width: '960px',
        height: '600px',
        minHeight: '600px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      });
      if (name === 'reading') {
        node.style.paddingBlock = '32px';
        const content = node.querySelector('.reading-example');
        const article = node.querySelector('.reading-article');
        content.style.transform = `translateY(-${article.offsetTop - content.offsetTop}px)`;
      } else if (name !== 'archive') {
        node.style.display = 'grid';
        node.style.alignItems = 'center';
        if (name === 'loading') node.style.paddingBlock = '8px';
      }
    }, example.name);
    await preview
      .locator('img')
      .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
    await preview.scrollIntoViewIfNeeded();
    await preview.evaluate((node) => {
      const box = node.getBoundingClientRect();
      node.style.transform = `translate(${Math.round(box.x) - box.x}px, ${Math.round(box.y) - box.y}px)`;
    });
    await preview.screenshot({
      path: `${output}/${example.name}.png`,
      animations: 'disabled',
    });
    console.log(`Captured ${example.name}.png (960 × 600)`);
  }
} finally {
  await browser.close();
}
