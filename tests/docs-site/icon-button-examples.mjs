import assert from 'node:assert/strict';

export async function revealIconButtonExample(example) {
  for (;;) {
    const handle = await example.evaluateHandle((node) => {
      let outermost = null;
      for (let parent = node.parentElement; parent; parent = parent.parentElement)
        if (parent.tagName === 'DETAILS' && !parent.open) outermost = parent;
      return outermost;
    });
    try {
      const details = handle.asElement();
      if (!details) return;
      const summary = await details.$(':scope > summary');
      assert(summary, 'The collapsed IconButton example has a summary.');
      await summary.click();
      await summary.dispose();
    } finally {
      await handle.dispose();
    }
  }
}

export async function verifyIconButtonReadingList(
  page,
  example = page.locator('#icon-button-reading-list .example-preview'),
) {
  assert.equal(await example.count(), 1, 'The reading-list example is available.');
  await revealIconButtonExample(example);
  const titles = [
    '河边散步时，记下春天',
    'WeekendReadingNotes：留给周末的阅读清单与零碎灵感',
    '去花店的路上，绕了一点远',
  ];
  const actions = titles.map((title) =>
    example.getByRole('button', { name: `收藏文章：${title}`, exact: true }),
  );
  const filter = example.getByRole('checkbox', { name: '只看收藏', exact: true });
  const showAll = example.getByRole('button', { name: '查看全部文章', exact: true });
  const focused = async (node) =>
    page.waitForFunction(
      (element) => document.activeElement === element,
      await node.elementHandle(),
    );

  assert.equal(await example.locator(':focus').count(), 0, 'Mounting does not steal focus.');
  assert.equal(await example.getByRole('status').count(), 1);
  assert.equal(await example.locator('[aria-live]').count(), 0);
  for (const [i, action] of actions.entries()) {
    assert.equal(await action.getAttribute('aria-pressed'), String(i !== 1));
    const box = await action.boundingBox();
    assert.equal(box.width, 44);
    assert.equal(box.height, 44);
  }
  await actions[1].focus();
  await actions[1].press('Space');
  assert.equal(await actions[1].getAttribute('aria-pressed'), 'true');
  assert.equal(await actions[1].getAttribute('aria-label'), `收藏文章：${titles[1]}`);
  await actions[1].press('Enter');
  assert.equal(await actions[1].getAttribute('aria-pressed'), 'false');
  assert.equal(await actions[0].getAttribute('aria-pressed'), 'true');
  assert.equal(await actions[2].getAttribute('aria-pressed'), 'true');

  await filter.focus();
  await filter.press('Space');
  assert.equal(await filter.isChecked(), true);
  assert.equal(await actions[1].count(), 0);
  await actions[0].focus();
  await actions[0].press('Enter');
  assert.equal(await actions[0].count(), 0);
  await focused(actions[2]);
  await actions[2].press('Space');
  await focused(showAll);
  assert.equal(
    await example.getByRole('heading', { name: '还没有收藏文章', exact: true }).count(),
    1,
  );
  assert.match(await example.getByRole('status').innerText(), /取消收藏/);
  await showAll.press('Enter');
  await focused(actions[0]);
  assert.equal(await filter.isChecked(), false);
  for (const action of actions) assert.equal(await action.getAttribute('aria-pressed'), 'false');

  await actions[0].press('Space');
  await actions[1].click();
  await actions[2].click();
  await filter.focus();
  await filter.press('Space');
  assert.equal(await filter.isChecked(), true);
  await actions[1].focus();
  await actions[1].press('Enter');
  await focused(actions[2]);
  await actions[2].focus();
  await actions[2].press('Enter');
  await focused(actions[0]);
  await filter.focus();
  await filter.press('Space');
  assert.equal(await filter.isChecked(), false);
  await focused(filter);
  assert.equal(await example.getByRole('button', { name: /^收藏文章：/ }).count(), 3);
  assert.equal(await example.getByRole('status').count(), 1);
  await filter.press('Space');
  await actions[0].evaluate((button) => button.click());
  await focused(filter);
  assert.equal(
    await example.getByRole('heading', { name: '还没有收藏文章', exact: true }).count(),
    1,
  );
  await filter.press('Space');
  await focused(filter);
  assert.equal(await actions[0].getAttribute('aria-pressed'), 'false');
}
