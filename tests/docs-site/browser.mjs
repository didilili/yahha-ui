import assert from 'node:assert/strict';
import { verifyDocsShell } from './shell-checks.mjs';
import { verifyHome } from './home-checks.mjs';
import { verifyArtwork } from './artwork-checks.mjs';
import { verifyWelcome } from './welcome-checks.mjs';
import { verifyComponentOverview } from './overview-checks.mjs';

export async function verifyDocs(browser, baseURL) {
  await verifyHome(browser, baseURL);
  await verifyComponentOverview(browser, baseURL);
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/components/button`);
    await page
      .getByRole('heading', { level: 1, name: 'Button 按钮', exact: true })
      .waitFor({ timeout: 5000 });
    await page.locator('.example-block').first().waitFor();
    assert.equal((await page.locator('.example-block').count()) >= 4, true);
    const example = page.locator('.example-block').first();
    const sourceBlock = example.locator('.component-source');
    await page
      .getByRole('navigation', { name: '本页内容' })
      .getByRole('link', { name: '基本使用', exact: true })
      .click();
    await page.waitForFunction(
      () => document.activeElement?.classList.contains('example-block'),
      undefined,
      { timeout: 3000 },
    );
    assert.equal(
      (await example.boundingBox()).y >= 72,
      true,
      'Example preview must remain below sticky header.',
    );
    await sourceBlock.getByRole('button', { name: '展开代码' }).click();
    assert.match(await sourceBlock.locator('pre').innerText(), /from ['"]yahha-ui['"]/);
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value) => {
            window.copiedExample = value;
          },
        },
      }),
    );
    await sourceBlock.getByRole('button', { name: '复制代码' }).click();
    await sourceBlock.getByText('已复制', { exact: true }).waitFor();
    assert.equal(
      await page.evaluate(() => window.copiedExample),
      await sourceBlock.locator('pre').innerText(),
    );
    // Browser permission denial must leave a usable manual-copy path.
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error('Permission denied')) },
      }),
    );
    await sourceBlock.getByRole('button', { name: '复制代码' }).click();
    await sourceBlock.getByRole('textbox', { name: '手动复制代码' }).waitFor();
    assert.equal(
      await sourceBlock.getByRole('textbox', { name: '手动复制代码' }).inputValue(),
      await sourceBlock.locator('pre').innerText(),
    );

    const search = page.getByRole('searchbox', { name: '搜索文档' });
    await search.fill('输入框');
    await page
      .locator('.docs-sidebar')
      .getByRole('link', { name: 'TextField 单行输入', exact: true })
      .click();
    await page
      .getByRole('heading', { level: 1, name: 'TextField 单行输入', exact: true })
      .waitFor();
    await search.fill('不存在的组件');
    assert.equal(await page.getByText('没有匹配的文档').isVisible(), true);
    await search.fill('');

    const ids = [
      'button',
      'icon-button',
      'badge',
      'surface',
      'theme-provider',
      'text-field',
      'segmented-control',
      'dialog',
      'empty-state',
      'toast',
      'select',
      'textarea',
      'checkbox',
      'radio-group',
      'switch',
      'text',
      'heading',
      'link',
      'divider',
      'avatar',
      'image',
      'tabs',
      'pagination',
      'accordion',
      'dropdown-menu',
      'popover',
      'tooltip',
      'skeleton',
      'spinner',
      'alert',
    ];
    let totalExamples = 0;
    for (const id of ids) {
      await page.goto(`${baseURL}#/components/${id}?section=api`);
      await page.locator('#api').waitFor();
      assert.equal((await page.locator('.api-table tbody tr').count()) > 0, true, `${id} API`);
      const examples = await page.locator('.example-block').count();
      assert.equal(examples > 0, true, `${id} examples`);
      totalExamples += examples;
      assert.equal(await page.locator('.docs-sidebar a[aria-current="page"]').count(), 1);
    }
    assert.equal(totalExamples, 74, 'The 30 component documents must retain all 74 examples.');
    let guideExamples = 0;
    for (const id of ['getting-started', 'styling', 'design-baseline', 'states', 'artwork']) {
      await page.goto(`${baseURL}#/guides/${id}`);
      await page.locator('.example-block').first().waitFor();
      guideExamples += await page.locator('.example-block').count();
    }
    assert.equal(guideExamples, 12, 'The guides must retain all twelve integration examples.');
    assert.equal(totalExamples + guideExamples, 86, 'The public site must retain all 86 examples.');
    await page.goto(`${baseURL}#/guides/getting-started`);
    await page.getByRole('heading', { level: 1, name: '开始使用', exact: true }).waitFor();
    assert.match(await page.locator('main').innerText(), /npm pack/);
    assert.match(await page.locator('main').innerText(), /yahha-ui\/style\.css/);

    // Unknown routes must have a recovery link, not silently show another page.
    await page.goto(`${baseURL}#/components/missing`);
    await page.getByRole('heading', { level: 1, name: '没有找到这篇文档', exact: true }).waitFor();
    await page.getByRole('link', { name: '返回开始使用' }).click();
    await page.getByRole('heading', { level: 1, name: '开始使用', exact: true }).waitFor();
    await page.goBack();
    await page.getByRole('heading', { level: 1, name: '没有找到这篇文档', exact: true }).waitFor();
    await page.getByRole('link', { name: '查看组件目录', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
    await page.locator('.component-overview-page').waitFor();
    assert.equal(await page.locator('[data-component-id]').count(), 30);

    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseURL}#/components/button`);
      await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
      await page.getByRole('button', { name: '打开文档目录' }).click();
      await page
        .locator('.docs-sidebar')
        .getByRole('link', { name: 'Button 按钮', exact: true })
        .click();
      await page.waitForFunction(() => document.activeElement?.tagName === 'H1');
      await page.getByRole('button', { name: '打开文档目录' }).click();
      await page
        .locator('.docs-sidebar')
        .getByRole('link', { name: 'Dialog 弹窗', exact: true })
        .click();
      await page.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
      assert.equal(
        await page.getByRole('button', { name: '打开文档目录' }).getAttribute('aria-expanded'),
        'false',
      );
      const trigger = page.locator('.example-block').first().getByRole('button').first();
      await trigger.click();
      await page.getByRole('dialog').waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      for (const id of ids) {
        await page.goto(`${baseURL}#/components/${id}`);
        await page.locator('.example-block').first().waitFor();
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
          true,
          `${id} overflow at ${width}`,
        );
      }
    }
    assert.deepEqual(errors, [], 'Documentation has browser runtime errors.');
  } finally {
    await context.close();
  }
  await verifyDocsShell(browser, baseURL);
  await verifyArtwork(browser, baseURL);
  await verifyWelcome(browser, baseURL);
}
