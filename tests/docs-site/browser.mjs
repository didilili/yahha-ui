import assert from 'node:assert/strict';
import { verifyDocsShell } from './shell-checks.mjs';
import { verifyHome } from './home-checks.mjs';
import { verifyArtwork } from './artwork-checks.mjs';
import { verifyWelcome } from './welcome-checks.mjs';
import { verifyComponentOverview } from './overview-checks.mjs';
import { verifyExampleHeadings } from './example-teaching-checks.mjs';
import { verifyBrand } from './brand-checks.mjs';
import { verifyAdoption } from './adoption-checks.mjs';
import { verifySectionNavigation } from './section-navigation-checks.mjs';
import { verifySearch } from './search-checks.mjs';
import { verifyGuideLoading, waitForGuideReady } from './guide-loading-checks.mjs';
import { verifyTextFieldSearch, verifyTextFieldCopy } from './text-field-examples.mjs';
import { verifyTextareaDraft } from './textarea-examples.mjs';
import { verifySelectCollection, verifySelectAvailability } from './select-examples.mjs';
import { verifyCheckboxFormReset } from './checkbox-form-examples.mjs';
import { verifyCheckboxTopics } from './checkbox-topics-examples.mjs';
import { verifyCheckboxReadingList } from './checkbox-reading-list-examples.mjs';
import { verifyRadioReadingLayout } from './radio-layout-examples.mjs';
import { verifyRadioSignature } from './radio-signature-examples.mjs';
import {
  verifySwitchExamples,
  verifySwitchPreference,
  verifySwitchPreferenceUnmount,
} from './switch-preference-examples.mjs';
import { verifySegmentedContent } from './segmented-content-examples.mjs';
import { verifyBadgeSummary } from './badge-summary-examples.mjs';
import {
  verifyAvatarBasics,
  verifyAvatarAuthor,
  verifyAvatarPicture,
} from './avatar-author-examples.mjs';
import { verifyTabsPostcard } from './tabs-postcard-examples.mjs';
import { verifyPaginationLinks } from './pagination-links-examples.mjs';
import { verifyMenuDraft } from './menu-draft-examples.mjs';
import { verifyDialogDraft } from './dialog-draft-examples.mjs';
import { verifyPopoverCollection } from './popover-collection-examples.mjs';
import { verifyAlertReadingNotice } from './alert-reading-examples.mjs';
import { verifyToastReadingList } from './toast-reading-examples.mjs';
import { verifyAccordionReading, verifyAccordionBasic } from './accordion-reading-examples.mjs';
import {
  verifyImageDetail,
  verifyImageFallback,
  verifyImageAssetDownload,
} from './image-detail-examples.mjs';

export async function verifyDocs(browser, baseURL) {
  await verifyGuideLoading(browser, baseURL);
  await verifySearch(browser, baseURL);
  await verifySectionNavigation(browser, baseURL);
  await verifyAdoption(browser, baseURL);
  await verifyBrand(browser, baseURL);
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
      .getByRole('link', { name: '基础用法', exact: true })
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
    assert.equal(await page.getByText('未找到相关文档').isVisible(), true);
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
      await verifyExampleHeadings(page);
      if (id === 'text-field') {
        await verifyTextFieldSearch(page, page.locator('#text-field-search .example-preview'));
        await verifyTextFieldCopy(page, page.locator('#text-field-copy .example-preview'));
      }
      if (id === 'textarea') {
        await verifyTextareaDraft(page, page.locator('#textarea-comment-draft .example-preview'));
      }
      if (id === 'select') {
        await verifySelectCollection(page, page.locator('#select-collection .example-preview'));
        await verifySelectAvailability(
          page,
          page.locator('#select-available-collections .example-preview'),
        );
      }
      if (id === 'checkbox') {
        await verifyCheckboxFormReset(page, page.locator('#form .example-preview'));
        await verifyCheckboxTopics(page);
        await verifyCheckboxReadingList(
          page,
          page.locator('#checkbox-reading-list .example-preview'),
        );
      }
      if (id === 'radio-group') {
        await verifyRadioReadingLayout(
          page,
          page.locator('#radio-reading-layout .example-preview'),
        );
        await verifyRadioSignature(page, page.locator('#radio-comment-signature .example-preview'));
      }
      if (id === 'switch') {
        await verifySwitchExamples(page);
        await verifySwitchPreference(
          page,
          page.locator('#switch-reading-preference .example-preview'),
        );
        await verifySwitchPreferenceUnmount(
          page,
          page.locator('#switch-reading-preference .example-preview'),
        );
      }
      if (id === 'segmented-control') {
        await verifySegmentedContent(page, page.locator('#filtering .example-preview'));
      }
      if (id === 'badge') {
        await verifyBadgeSummary(page, page.locator('#badge-status .example-preview'));
      }
      if (id === 'avatar') {
        await verifyAvatarBasics(page, page.locator('#avatar-fallback .example-preview'));
        await verifyAvatarAuthor(page, page.locator('#avatar-author .example-preview'));
        await verifyAvatarPicture(page, page.locator('#avatar-picture .example-preview'));
      }
      if (id === 'image') {
        await verifyImageDetail(page, page.locator('#image-detail .example-preview'));
        await verifyImageFallback(page, page.locator('#image-failure .example-preview'));
        await verifyImageAssetDownload(page, page.locator('#image-detail'));
      }
      if (id === 'accordion') {
        await verifyAccordionReading(page, page.locator('#controlled .example-preview'));
        await verifyAccordionBasic(page, page.locator('#basic .example-preview'));
      }
      if (id === 'tabs') {
        await verifyTabsPostcard(page, page.locator('#controlled .example-preview'));
      }
      if (id === 'pagination') {
        await verifyPaginationLinks(page, page.locator('#links .example-preview'));
      }
      if (id === 'dropdown-menu') {
        await verifyMenuDraft(page, page.locator('#controlled .example-preview'));
      }
      if (id === 'dialog') {
        await verifyDialogDraft(page, page.locator('#form .example-preview'));
      }
      if (id === 'popover') {
        await verifyPopoverCollection(page, page.locator('#popover-collection .example-preview'));
      }
      if (id === 'toast') {
        await verifyToastReadingList(page, page.locator('#basic .example-preview'));
      }
      if (id === 'alert') {
        await verifyAlertReadingNotice(
          page,
          page.locator('#alert-reading-notice .example-preview'),
        );
      }
      assert.equal(
        await page.locator('.docs-sidebar .nav-group a[aria-current="page"]').count(),
        1,
      );
      const usage = page.locator('#usage');
      assert.equal(await usage.count(), 1, `${id}: one introductory usage section.`);
      assert.equal(
        await usage.evaluate((node) => {
          const examples = document.getElementById('examples');
          return (
            !!examples &&
            !!(node.compareDocumentPosition(examples) & Node.DOCUMENT_POSITION_FOLLOWING)
          );
        }),
        true,
        `${id}: usage precedes the examples in reading order.`,
      );
      const usageDescription = usage.locator('..').locator('.doc-prose');
      assert(
        (await usageDescription.innerText()).trim().length > 0,
        `${id}: usage explains its purpose.`,
      );
      if (['textarea', 'checkbox', 'radio-group', 'switch'].includes(id)) {
        await usageDescription.scrollIntoViewIfNeeded();
        assert.equal(
          await usageDescription.isVisible(),
          true,
          `${id}: the new usage guidance is visible.`,
        );
      }
      const relatedLinks = await page
        .locator('#related')
        .locator('..')
        .locator('.doc-prose')
        .getByRole('link')
        .evaluateAll((links) =>
          links.map((link) => ({ href: link.getAttribute('href'), name: link.textContent.trim() })),
        );
      assert(relatedLinks.length > 0, `${id}: related components provide navigation choices.`);
      for (const link of relatedLinks) {
        assert(link.name.length > 0, `${id}: related links have accessible text.`);
        assert(
          ids.some((target) => link.href === `#/components/${target}`),
          `${id}: related link ${link.href} points to an existing component document.`,
        );
      }
    }
    assert.equal(totalExamples, 128, 'The 30 component documents provide 128 focused examples.');

    // Reorganized chapters retain their existing deep links and keyboard destination.
    await page.goto(`${baseURL}#/components/text`);
    await page.locator('#behavior').waitFor();
    await page
      .getByRole('navigation', { name: '本页内容' })
      .locator('a[href="#/components/text?section=behavior"]')
      .click();
    await page.waitForFunction(
      () =>
        location.hash === '#/components/text?section=behavior' &&
        document.activeElement === document.getElementById('behavior'),
    );
    assert.equal(
      (await page.locator('#behavior').boundingBox()).y >= 72,
      true,
      'The retained Text chapter remains below the sticky header after TOC navigation.',
    );

    await page.goto(`${baseURL}#/components/select?section=related`);
    await page
      .locator('#related')
      .locator('..')
      .getByRole('link', { name: 'RadioGroup 单选组', exact: true })
      .click();
    const radioGroupHeading = page.getByRole('heading', {
      level: 1,
      name: 'RadioGroup 单选组',
      exact: true,
    });
    await radioGroupHeading.waitFor();
    await page.waitForFunction(
      (heading) => document.activeElement === heading,
      await radioGroupHeading.elementHandle(),
    );
    assert.equal(new URL(page.url()).hash, '#/components/radio-group');

    let guideExamples = 0;
    for (const [id, title] of [
      ['getting-started', '开始使用'],
      ['styling', '使用与定制'],
      ['reading', '阅读与收藏'],
      ['design-baseline', '设计规范'],
      ['states', '组合示例'],
      ['artwork', '图标与插画'],
    ]) {
      await page.goto(`${baseURL}#/guides/${id}`);
      await waitForGuideReady(page, title);
      guideExamples += await page.locator('.example-block').count();
      await verifyExampleHeadings(page);
    }
    assert.equal(guideExamples, 12, 'The guides must retain all twelve integration examples.');
    assert.equal(totalExamples + guideExamples, 140, 'The public site provides 140 examples.');
    await page.goto(`${baseURL}#/guides/getting-started`);
    await waitForGuideReady(page, '开始使用');
    assert.match(await page.locator('main').innerText(), /npm pack/);
    assert.match(await page.locator('main').innerText(), /yahha-ui\/style\.css/);

    // Unknown routes must have a recovery link, not silently show another page.
    await page.goto(`${baseURL}#/components/missing`);
    await page.getByRole('heading', { level: 1, name: '页面未找到', exact: true }).waitFor();
    await page.locator('.not-found').getByRole('link', { name: '开始使用', exact: true }).click();
    await waitForGuideReady(page, '开始使用');
    await page.goBack();
    await page.getByRole('heading', { level: 1, name: '页面未找到', exact: true }).waitFor();
    await page.locator('.not-found').getByRole('link', { name: '浏览组件', exact: true }).click();
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
        await verifyExampleHeadings(page);
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
