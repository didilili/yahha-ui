import assert from 'node:assert/strict';

/** Exercise the page's save/retry and native form flows without the other control suites. */
export async function verifyButtonExamples(page) {
  const states = page.locator('#button-states');
  await states.waitFor();

  for (const name of ['无前图标的异步加载', '带前图标的异步加载']) {
    const group = states.getByRole('group', { name, exact: true });
    const action = group.getByRole('button', { name: '保存草稿', exact: true });
    const before = await action.boundingBox();
    await action.focus();
    await action.press('Enter');
    assert.equal(await action.getAttribute('aria-busy'), 'true');
    assert.equal(await action.isDisabled(), true);
    const loading = await action.boundingBox();
    assert(Math.abs(before.width - loading.width) < 0.1, `${name} keeps its width.`);
    assert(Math.abs(before.height - loading.height) < 0.1, `${name} keeps its height.`);
    await page.waitForFunction((node) => !node.disabled, await action.elementHandle());
    assert.equal(await group.getByRole('status').count(), 1);

    if (name === '带前图标的异步加载') {
      assert.match(await group.getByRole('status').innerText(), /模拟保存失败/);
      await action.click();
      assert.equal(await action.isDisabled(), true);
      assert.equal(await group.getByRole('status').innerText(), '正在保存…');
      await page.waitForFunction((node) => !node.disabled, await action.elementHandle());
    }
    assert.equal(await group.getByRole('status').innerText(), '草稿已保存');
    assert.equal(await action.innerText(), '保存草稿');
  }

  const form = page.locator('#button-form form');
  const nickname = form.getByRole('textbox', { name: '怎么称呼你', exact: true });
  await nickname.fill('小八');
  await nickname.press('Enter');
  assert.equal(await form.getByRole('status').innerText(), '你好，小八！');
  await nickname.fill('乌萨奇');
  assert.equal(await form.getByRole('status').innerText(), '尚未提交');
  await form.getByRole('button', { name: '重置', exact: true }).click();
  assert.equal(await nickname.inputValue(), '');
  assert.equal(await form.getByRole('status').innerText(), '尚未提交');
}
