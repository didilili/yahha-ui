import assert from 'node:assert/strict';

/** Readers should know each example's purpose before reaching its controls. */
export async function verifyExampleHeadings(page) {
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
    const close = example.getByRole('button', { name: '关闭欢迎提示', exact: true });
    await close.waitFor();
    assert.equal(
      await close.evaluate((node) => document.activeElement === node),
      false,
      'A demonstration must not take focus when its page opens.',
    );
    await close.focus();
    await page.keyboard.press('Enter');
    const reopen = example.getByRole('button', { name: '重新显示欢迎提示', exact: true });
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await reopen.elementHandle(),
    );
    await page.keyboard.press('Enter');
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await close.elementHandle(),
    );

    await page.goto(`${baseURL}#/components/tabs`);
    const controlledTabs = page.locator('#controlled-value');
    await controlledTabs.getByRole('tab', { name: '相册', exact: true }).click();
    await controlledTabs.getByText('当前栏目：相册', { exact: true }).waitFor();
    await controlledTabs.getByText('这一周拍下的树影与晚霞。', { exact: true }).waitFor();

    await page.goto(`${baseURL}#/components/dropdown-menu`);
    const menu = page.locator('#open-state');
    const trigger = menu.getByRole('button', { name: '受控文章操作', exact: true });
    await trigger.click();
    await menu.getByText('菜单状态：展开', { exact: true }).waitFor();
    await page.getByRole('menuitem', { name: '收藏到本页', exact: true }).click();
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

    await page.goto(`${baseURL}#/components/segmented-control`);
    const filtering = page.locator('#filtering');
    const articles = filtering.getByRole('list', { name: '筛选后的文章', exact: true });
    await articles.waitFor();
    assert.equal(await articles.getByRole('listitem').count(), 3);
    await filtering.getByRole('radio', { name: '随手记', exact: true }).check();
    assert.equal(await articles.getByRole('listitem').count(), 1);
    await filtering.getByRole('status').getByText('随手记 · 1 篇文章', { exact: true }).waitFor();
  }
  console.log(
    'Examples passed: keyboard close/reopen focus, minimal controlled Tabs/Menu, replacement of the latest action result and local article filtering at desktop/mobile widths.',
  );
}
