import assert from 'node:assert/strict';

export async function verifyBlogArchive(page, baseURL) {
  await page.goto(`${baseURL}#/guides/states?section=archive`);
  const archive = page.locator('#scene-blog-archive .example-preview');
  await archive.getByRole('heading', { name: '手记归档', exact: true }).waitFor();
  const list = archive.getByRole('list', { name: '本页手记', exact: true });
  const pagination = archive.getByRole('navigation', { name: '手记归档分页', exact: true });
  assert.equal(await list.getByRole('listitem').count(), 3);
  await pagination.getByRole('button', { name: '第 4 页', exact: true }).click();
  const lastHeading = archive.getByRole('heading', { name: '全部手记 · 第 4 页', exact: true });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await lastHeading.elementHandle(),
  );
  assert.equal(
    await pagination.getByRole('button', { name: '下一页', exact: true }).isDisabled(),
    true,
  );
  const search = archive.getByRole('searchbox', { name: '搜索归档', exact: true });
  await search.fill('河边');
  await archive.getByRole('heading', { name: '全部手记 · 第 1 页', exact: true }).waitFor();
  assert.equal(await list.getByRole('listitem').count(), 1);
  await list.getByRole('heading', { name: '沿着河边，慢慢走', exact: true }).waitFor();
  assert.equal(
    await pagination
      .getByRole('button', { name: '第 1 页', exact: true })
      .getAttribute('aria-current'),
    'page',
  );
  assert.equal(await search.evaluate((node) => document.activeElement === node), true);
  await search.fill('这篇文章不存在');
  await archive.getByRole('heading', { name: '没有找到这篇手记', exact: true }).waitFor();
  assert.equal(
    await pagination.getByRole('button', { name: '上一页', exact: true }).isDisabled(),
    true,
  );
  assert.equal(
    await pagination.getByRole('button', { name: '下一页', exact: true }).isDisabled(),
    true,
  );
  await archive.getByRole('button', { name: '显示全部手记', exact: true }).click();
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await search.elementHandle(),
  );
  assert.equal(await search.inputValue(), '');
  assert.equal(await list.getByRole('listitem').count(), 3);
  const reading = archive.getByRole('tab', { name: '读书与摘记', exact: true });
  await reading.click();
  await archive.getByRole('heading', { name: '读书与摘记 · 第 1 页', exact: true }).waitFor();
  assert.equal(await reading.getAttribute('aria-selected'), 'true');
  assert.equal(await archive.getByRole('status').textContent(), '找到 4 篇手记，当前第 1 / 2 页。');
  await pagination.getByRole('button', { name: '下一页', exact: true }).click();
  assert.equal(await list.getByRole('listitem').count(), 1);
  const help = archive.getByRole('button', {
    name: '切换栏目或搜索后，页码会怎样变化？',
    exact: true,
  });
  await help.click();
  assert.equal(await help.getAttribute('aria-expanded'), 'true');
  const currentURL = page.url();
  await pagination.getByRole('button', { name: '上一页', exact: true }).click();
  assert.equal(page.url(), currentURL, 'Local pagination must preserve the documentation route.');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}

export async function verifyNavigationExamples(page, baseURL) {
  await page.goto(`${baseURL}#/components/tabs?section=controlled`);
  const tabs = page.locator('#controlled .example-preview');
  const draft = tabs.getByRole('textbox', { name: '明信片草稿', exact: true });
  await draft.fill('留给周末的一句问候');
  await tabs.getByRole('tab', { name: '关于这个小站与慢慢更新的日常记录', exact: true }).click();
  await tabs.getByRole('button', { name: '回到明信片', exact: true }).click();
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await draft.elementHandle(),
  );
  assert.equal(await draft.inputValue(), '留给周末的一句问候');
  await tabs.getByRole('status').getByText('当前栏目：写一张明信片', { exact: true }).waitFor();

  await page.goto(`${baseURL}#/components/accordion?section=controlled`);
  const accordion = page.locator('#controlled .example-preview');
  const expand = accordion.getByRole('button', { name: '展开可用说明', exact: true });
  await expand.click();
  assert.equal(await expand.evaluate((node) => document.activeElement === node), true);
  assert.equal(await accordion.locator('button[aria-expanded="true"]').count(), 2);
  const collapse = accordion.getByRole('button', { name: '全部收起', exact: true });
  await collapse.click();
  assert.equal(await collapse.evaluate((node) => document.activeElement === node), true);
  assert.equal(await accordion.locator('button[aria-expanded="true"]').count(), 0);
  assert.equal(
    await accordion.getByRole('button', { name: '离线阅读（准备中）', exact: true }).isDisabled(),
    true,
  );

  await page.goto(`${baseURL}#/components/pagination?section=archive`);
  const archive = page.locator('#archive .example-preview');
  const list = archive.getByRole('list', { name: '本页归档文章', exact: true });
  const before = await list.innerText();
  await archive
    .getByRole('navigation', { name: '文章归档分页', exact: true })
    .getByRole('button', { name: '下一页', exact: true })
    .click();
  const heading = archive.getByRole('heading', { name: '归档第 25 页', exact: true });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await heading.elementHandle(),
  );
  assert.equal(await list.getByRole('listitem').count(), 3);
  assert.notEqual(await list.innerText(), before);
  const empty = archive.getByRole('navigation', { name: '空列表分页', exact: true });
  assert.equal(await empty.getByRole('button', { name: '上一页', exact: true }).isDisabled(), true);
  assert.equal(await empty.getByRole('button', { name: '下一页', exact: true }).isDisabled(), true);
}
