import assert from 'node:assert/strict';
import { openInteractionExample, revealExample } from './reveal-example.mjs';
import { verifyHeadingShare } from './heading-examples.mjs';

/** Readers should know each example's purpose before reaching its controls. */
export async function verifyExampleHeadings(page) {
  for (const disclosure of await page.locator('.doc-disclosure').all()) {
    if ((await disclosure.getAttribute('open')) === null)
      await disclosure.locator(':scope > summary').click();
  }
  const examples = await page.locator('.example-block').evaluateAll((blocks) =>
    blocks.map((block) => {
      const title = block.querySelector('.example-title');
      const caption = block.querySelector('.example-caption');
      const preview = block.querySelector('.example-preview');
      const frame = block.querySelector('.example-frame');
      const source = block.querySelector('.example-source');
      return {
        id: block.id,
        title: title?.textContent.trim(),
        first: !!(
          title &&
          preview &&
          title.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING
        ),
        titleBottom: title?.getBoundingClientRect().bottom,
        captionBottom: caption?.getBoundingClientRect().bottom,
        previewTop: preview?.getBoundingClientRect().top,
        frameTop: frame?.getBoundingClientRect().top,
        previewBottom: preview?.getBoundingClientRect().bottom,
        sourceTop: source?.getBoundingClientRect().top,
        explanationOutside: !!frame && !frame.contains(title) && !frame.contains(caption),
        codeOutsidePreview: !!source && !preview?.contains(source),
        titleSize: title && parseFloat(getComputedStyle(title).fontSize),
        captionSize: caption && parseFloat(getComputedStyle(caption).fontSize),
      };
    }),
  );
  for (const example of examples) {
    assert(example.title, `${example.id}: visible example title.`);
    assert(example.first, `${example.id}: reading order starts with the example title.`);
    assert(
      example.titleBottom <= example.previewTop && example.captionBottom <= example.previewTop,
      `${example.id}: title and instructions appear above the live preview.`,
    );
    assert(
      example.titleSize > example.captionSize,
      `${example.id}: the title is distinguishable from supporting instructions.`,
    );
    assert(
      example.explanationOutside && example.captionBottom <= example.frameTop,
      `${example.id}: the explanation is outside the demonstration canvas.`,
    );
    assert(
      example.codeOutsidePreview && example.previewBottom <= example.sourceTop,
      `${example.id}: source controls are separate from the live demonstration.`,
    );
  }
}

export async function verifyTeachingExamples(page, baseURL) {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}#/components/icon-button`);
    const example = page.locator('#icon-button-basic');
    await revealExample(example);
    const close = example.getByRole('button', { name: '关闭提示', exact: true });
    await close.waitFor();
    assert.equal(
      await close.evaluate((node) => document.activeElement === node),
      false,
      'A demonstration must not take focus when its page opens.',
    );
    await close.focus();
    await page.keyboard.press('Enter');
    const reopen = example.getByRole('button', { name: '重新显示提示', exact: true });
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await reopen.elementHandle(),
    );
    await page.keyboard.press('Enter');
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await close.elementHandle(),
    );

    await page.goto(`${baseURL}#/components/heading`);
    const structure = page.locator('#heading-reading-layout .example-preview');
    await revealExample(structure);
    assert.deepEqual(
      await structure
        .getByRole('heading')
        .evaluateAll((headings) => headings.map((node) => node.tagName)),
      ['H2', 'H3', 'H4', 'H3'],
      'The short article example preserves the semantic heading hierarchy.',
    );
    await structure
      .getByRole('heading', {
        level: 3,
        name: '把云朵邮局里借来的铅笔、画歪的墨镜和贴到手背上的邮票，写进今天的长手记',
        exact: true,
      })
      .waitFor();
    assert.equal(
      await structure.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
      true,
    );
    await openInteractionExample(page, 'heading-reading-layout');
    const headingExample = page.locator('#heading-reading-layout');
    await verifyHeadingShare(page, headingExample.locator('.example-preview'));
    const contents = headingExample.getByRole('navigation', { name: '手记目录', exact: true });
    for (const [name, title] of [
      ['写封回信', '给远方的朋友写封回信'],
      ['长手记', '把云朵邮局里借来的铅笔、画歪的墨镜和贴到手背上的邮票，写进今天的长手记'],
    ]) {
      const link = contents.getByRole('link', { name, exact: true });
      const target = headingExample.getByRole('heading', { level: 3, name: title, exact: true });
      await link.click();
      await page.waitForFunction(
        (node) => document.activeElement === node,
        await target.elementHandle(),
      );
      for (const modifier of ['ctrlKey', 'metaKey']) {
        const intercepted = await link.evaluate((node, key) => {
          let prevented = false;
          window.addEventListener(
            'click',
            (event) => {
              prevented = event.defaultPrevented;
              event.preventDefault();
            },
            { once: true },
          );
          node.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true, [key]: true }),
          );
          return prevented;
        }, modifier);
        assert.equal(intercepted, false, `${name}: ${modifier} retains native link behavior.`);
      }
      const destination = new URL(await link.getAttribute('href'), page.url()).href;
      const opened = await page.context().newPage();
      try {
        await opened.goto(destination);
        await opened.getByRole('heading', { level: 1, name: '交互组合', exact: true }).waitFor();
        const openedTarget = opened.getByRole('heading', { level: 3, name: title, exact: true });
        await opened.waitForFunction(
          (node) => document.activeElement === node,
          await openedTarget.elementHandle(),
        );
      } finally {
        await opened.close();
      }
    }

    await page.goto(`${baseURL}#/components/tabs`);
    const controlledTabs = page.locator('#controlled-value');
    await controlledTabs.getByRole('tab', { name: '相册', exact: true }).click();
    await controlledTabs.getByText('当前栏目：相册', { exact: true }).waitFor();
    await controlledTabs.getByText('这一周拍下的树影与晚霞。', { exact: true }).waitFor();

    await page.goto(`${baseURL}#/components/dropdown-menu`);
    const menu = page.locator('#open-state');
    const trigger = menu.getByRole('button', { name: '文章操作', exact: true });
    await trigger.click();
    await menu.getByText('菜单状态：展开', { exact: true }).waitFor();
    await page.getByRole('menuitem', { name: '关闭菜单', exact: true }).click();
    await menu.getByText('菜单状态：收起', { exact: true }).waitFor();
    assert.equal(await menu.locator('.example-preview').getByRole('status').count(), 1);
    await trigger.click();
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await trigger.elementHandle(),
    );
    const basicMenu = page.locator('#basic .example-preview');
    for (const action of ['生成分享摘要', '收藏文章', '生成分享摘要']) {
      await basicMenu.getByRole('button', { name: '文章操作', exact: true }).click();
      await page.getByRole('menuitem', { name: action, exact: true }).click();
      await basicMenu
        .getByRole('status')
        .getByText(`操作结果：已选择“${action}”。`, { exact: true })
        .waitFor();
      assert.equal(await basicMenu.getByRole('status').count(), 1);
      assert.equal(await basicMenu.locator('blockquote').count(), 0);
    }

    await page.goto(`${baseURL}#/components/segmented-control?section=filtering`);
    const filtering = page.locator('#filtering');
    const articles = filtering.getByRole('list', { name: '筛选后的文章', exact: true });
    await articles.waitFor();
    assert.equal(await articles.getByRole('listitem').count(), 3);
    await filtering.getByRole('radio', { name: '随手记', exact: true }).check();
    assert.equal(await articles.getByRole('listitem').count(), 1);
    await filtering
      .getByRole('status')
      .getByText('随手记 · 1 篇文章 · 列表视图', { exact: true })
      .waitFor();
  }
  console.log(
    'Examples passed: keyboard close/reopen focus, Heading links and new-tab focus, minimal controlled Tabs/Menu, replacement of the latest action result and local article filtering at desktop/mobile widths.',
  );
}
