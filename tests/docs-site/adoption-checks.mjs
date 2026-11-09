import assert from 'node:assert/strict';
import { apiRowAnchor } from '../../playground/src/docs/api-anchor.ts';
import {
  closeSearchDialog,
  openSearchDialog,
  searchField,
  visibleSearchEntry,
} from './search-dialog-helpers.mjs';

/** Follow the public documentation paths instead of testing a second copy of the UI. */
export async function verifyAdoption(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/guides/recipes`);
    await page.getByRole('heading', { level: 1, name: '场景总览', exact: true }).waitFor();
    await page.locator('main').getByRole('link', { name: '阅读与收藏', exact: true }).click();
    await page.locator('#reading-example').waitFor();
    await page.goBack();
    await page.getByRole('heading', { level: 1, name: '场景总览', exact: true }).waitFor();

    await page.goto(`${baseURL}#/`);
    const note = page.locator('.home-component-note');
    await note.getByRole('link', { name: 'Input', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: 'Input 输入框' }).waitFor();
    await page.goto(`${baseURL}#/`);
    await page.getByRole('link', { name: '查看阅读与收藏示例', exact: true }).click();
    await page.locator('#reading-example').waitFor();

    await page.goto(`${baseURL}#/components/button`);
    const sidebar = page.locator('.docs-sidebar');
    const dialog = await openSearchDialog(page);
    const search = searchField(page);
    await search.fill('initialFocus');
    const propertyAnchor = apiRowAnchor('DialogProps', 'initialFocus');
    const propertyHref = `#/components/dialog?section=${encodeURIComponent(propertyAnchor)}`;
    const result = dialog.locator(`a[href="${propertyHref}"]`);
    await result.waitFor();
    await search.press('Tab');
    // A clear button may precede the first result; use the real link for keyboard activation.
    await result.focus();
    await page.keyboard.press('Enter');
    await dialog.waitFor({ state: 'hidden' });
    await page.locator('#api').waitFor();
    await page.waitForFunction((id) => document.activeElement?.id === id, propertyAnchor);
    assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'TR');
    assert.equal(new URL(page.url()).hash, propertyHref);
    await openSearchDialog(page);
    await search.fill('portalContainer');
    const portalHref = `#/components/dialog?section=${encodeURIComponent(apiRowAnchor('DialogProps', 'portalContainer'))}`;
    assert.ok(await dialog.locator(`a[href="${portalHref}"]`).count());
    await search.fill('这条搜索没有对应内容');
    await dialog.getByText('没有匹配的文档，试试其他关键词。', { exact: true }).waitFor();
    await dialog.getByRole('button', { name: '清空搜索', exact: true }).click();
    assert.equal(await search.inputValue(), '');
    await closeSearchDialog(page);

    await page.goto(`${baseURL}#/components/input?section=text-field-customization`);
    const field = page.locator('#text-field-customization');
    await field.getByRole('textbox', { name: '手记署名', exact: true }).fill('库米');
    assert.ok((await field.locator('.yahha-example-nickname-field').boundingBox()).width <= 360);
    assert.equal(
      await field
        .locator('.yahha-example-nickname-hint')
        .evaluate((node) => getComputedStyle(node).backgroundColor),
      'rgb(255, 240, 246)',
    );
    await page.goto(`${baseURL}#/components/select?section=select-portal-customization`);
    const select = page.locator('#select-portal-customization');
    await select.getByRole('combobox', { name: '手记分类', exact: true }).click();
    const popup = page.locator('.yahha-example-archive-popup');
    await popup.waitFor();
    assert.equal(
      await popup.evaluate((node) => getComputedStyle(node).backgroundColor),
      'rgb(241, 248, 255)',
    );
    assert.equal(await popup.evaluate((node) => !!node.closest('.example-preview')), false);
    const disabledOption = page.getByRole('option', { name: '旅行记录（稍后开放）', exact: true });
    assert.equal(await disabledOption.getAttribute('aria-disabled'), 'true');
    assert.equal(
      await disabledOption.evaluate((node) => getComputedStyle(node).color),
      'rgb(122, 92, 109)',
    );
    await page.getByRole('option', { name: '散步手记', exact: true }).click();
    await popup.waitFor({ state: 'hidden' });
    assert.match(await select.getByRole('combobox').innerText(), /散步手记/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}#/components/button`);
    const toc = page.locator('.mobile-doc-toc');
    await toc.locator('summary').click();
    await toc.getByRole('link', { name: 'API', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.id === 'api');
    assert.equal(await toc.getAttribute('open'), null);
    await page.goBack();
    await page.getByRole('heading', { level: 1, name: 'Button 按钮' }).waitFor();
    assert.ok((await page.locator('.doc-title-row').boundingBox()).height < 240);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
    await openSearchDialog(page, await visibleSearchEntry(page, sidebar));
    await search.fill('initialFocus');
    await result.click();
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction((id) => document.activeElement?.id === id, propertyAnchor);
    assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'TR');
    assert.equal(await page.locator('main').getAttribute('inert'), null);
    await page.locator('.mobile-doc-toc summary').focus();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForFunction(() => !!document.activeElement?.closest('.docs-toc'));
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}
