import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const notes = [
  {
    key: 'preparation',
    title: '参加周末读书会前，需要带些什么？',
    body: [
      '带一本愿意分享的书，以及记录喜欢段落的小本子。',
      '不需要准备完整讲稿，挑一段想读给大家听的文字就好。',
    ],
  },
  {
    key: 'meeting',
    title: '到达后在哪里集合？',
    body: ['先到书店门口的小桌签到，再一起去窗边的阅读区。请提前十分钟到达。'],
  },
  {
    key: 'rain',
    title: '雨天安排（确认中）',
    body: ['确认后会补充当天的集合安排。'],
    disabled: true,
  },
];

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function requireSettledMotion(page, locator) {
  await settle(page);
  const node = await locator.elementHandle();
  try {
    await node.evaluate(async (element) => {
      const animations = element.getAnimations({ subtree: true });
      await Promise.allSettled(animations.map((animation) => animation.finished));
    });
    await page.waitForFunction(
      (element) =>
        !element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running' || animation.pending),
      node,
    );
  } finally {
    await node.dispose();
  }
}

// These synthetic events exercise React state handling, not a native operating-system IME.
async function composition(input, type, value = null, data = '') {
  await input.evaluate(
    (node, options) => {
      const view = node.ownerDocument.defaultView;
      if (options.value !== null)
        Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value').set.call(
          node,
          options.value,
        );
      node.dispatchEvent(
        new view.CompositionEvent(options.type, { bubbles: true, data: options.data }),
      );
    },
    { type, value, data },
  );
}

async function composingInput(input, value, isComposing = true) {
  await input.evaluate(
    (node, options) => {
      const view = node.ownerDocument.defaultView;
      Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value').set.call(
        node,
        options.value,
      );
      node.dispatchEvent(
        new view.InputEvent('input', {
          bubbles: true,
          inputType: options.isComposing ? 'insertCompositionText' : 'insertText',
          data: options.value,
          isComposing: options.isComposing,
        }),
      );
    },
    { value, isComposing },
  );
}

async function tabTarget(page) {
  return page.evaluate(() => {
    const node = document.activeElement;
    return {
      tag: node.tagName,
      type: node.getAttribute('type'),
      text: node.textContent?.trim().slice(0, 120),
      label: node.getAttribute('aria-label'),
      disabled: 'disabled' in node ? node.disabled : null,
    };
  });
}

/** Reconcile open values with title filtering, without resurrecting previously hidden panels. */
export async function verifyAccordionReading(page, example) {
  await revealExample(example);
  const input = example.getByRole('textbox', { name: '搜索说明标题', exact: true });
  const clear = example.getByRole('button', { name: '清空搜索', exact: true });
  const expand = example.getByRole('button', { name: '展开可用说明', exact: true });
  const collapse = example.getByRole('button', { name: '全部收起', exact: true });
  const status = example.getByRole('status');
  const all = notes.map((note) => note.key);
  const snapshots = [],
    tabTargets = [];
  let stage = 'initial';
  let originalError, result;
  await input.waitFor();
  const originalInput = await input.elementHandle();
  const trigger = (key) =>
    example.getByRole('button', {
      name: notes.find((note) => note.key === key).title,
      exact: true,
    });

  async function requireRows(keys, opened) {
    const message = `找到 ${keys.length} 条说明 · 已展开 ${opened.length} 项。`;
    await status.getByText(message, { exact: true }).waitFor();
    assert.equal(await status.count(), 1);
    assert.equal(await example.locator('[aria-live]').count(), 0);
    assert.equal(await example.getByRole('alert').count(), 0);
    assert.deepEqual(
      await example.locator('button[aria-expanded]').allTextContents(),
      keys.map((key) => notes.find((note) => note.key === key).title),
    );
    const geometry = [];
    for (const note of notes) {
      const row = trigger(note.key);
      if (keys.includes(note.key)) {
        assert.equal(await row.getAttribute('aria-expanded'), String(opened.includes(note.key)));
        assert.equal(await row.isDisabled(), !!note.disabled);
        // The rotating chevron changes scroll bounds transiently; measure the settled layout.
        await requireSettledMotion(page, row);
        const box = await row.boundingBox();
        const bounds = await row.evaluate((node) => ({
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
          viewportWidth: innerWidth,
        }));
        assert(box.height >= 44 - 0.01);
        assert(box.x >= -1);
        assert(box.x + box.width <= bounds.viewportWidth + 1);
        assert(bounds.scrollWidth <= bounds.clientWidth + 1);
        geometry.push({ key: note.key, width: box.width, height: box.height, ...bounds });
      } else assert.equal(await row.count(), 0);
      for (const text of note.body) {
        await example
          .getByText(text, { exact: true })
          .waitFor({ state: opened.includes(note.key) ? 'visible' : 'hidden' });
      }
    }
    assert.equal(await input.evaluate((node, old) => node === old, originalInput), true);
    assert.equal(
      await expand.isDisabled(),
      !keys.some((key) => !notes.find((note) => note.key === key).disabled),
    );
    assert.equal(await collapse.isDisabled(), false);
    if (!keys.length)
      assert.equal(
        await example.getByRole('heading', { name: '没有匹配的说明', exact: true }).count(),
        1,
      );
    else
      assert.equal(
        await example.getByRole('heading', { name: '没有匹配的说明', exact: true }).count(),
        0,
      );
    const documentGeometry = await page.evaluate(() => ({
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert(documentGeometry.documentWidth <= documentGeometry.viewportWidth + 1);
    const snapshot = {
      stage,
      editingValue: await input.inputValue(),
      visible: keys,
      opened,
      prunedByVisibility: (snapshots.at(-1)?.opened ?? []).filter((key) => !keys.includes(key)),
      status: message,
      geometry,
      ...documentGeometry,
    };
    snapshots.push(snapshot);
    return snapshot;
  }

  async function clearSearch(keys, opened, key = 'Enter') {
    await clear.focus();
    await clear.press(key);
    await requireFocus(page, input);
    assert.equal(await input.inputValue(), '');
    await requireRows(keys, opened);
  }

  try {
    assert.equal(await input.inputValue(), '');
    await requireRows(all, []);
    stage = 'open two then retain only matching meeting';
    await expand.focus();
    await expand.press('Enter');
    await requireRows(all, ['preparation', 'meeting']);
    await requireFocus(page, expand);
    await input.fill('集合');
    await requireRows(['meeting'], ['meeting']);
    await requireFocus(page, input);
    await clearSearch(all, ['meeting']);

    stage = 'keyboard panel toggle retains focus';
    await trigger('meeting').focus();
    await trigger('meeting').press('Space');
    await requireRows(all, []);
    await requireFocus(page, trigger('meeting'));
    await trigger('meeting').press('Enter');
    await requireRows(all, ['meeting']);
    await requireFocus(page, trigger('meeting'));
    await collapse.focus();
    await collapse.press('Space');
    await requireRows(all, []);
    await requireFocus(page, collapse);

    stage = 'batch expand affects only visible enabled preparation';
    await input.fill('参加');
    await requireRows(['preparation'], []);
    await expand.focus();
    await expand.press('Space');
    await requireRows(['preparation'], ['preparation']);
    await requireFocus(page, expand);
    await clearSearch(all, ['preparation'], 'Space');
    await collapse.focus();
    await collapse.press('Enter');
    await requireRows(all, []);

    stage = 'rain-only has no expandable option';
    await input.fill('雨天');
    await requireRows(['rain'], []);
    await clearSearch(all, []);
    stage = 'zero matches keeps recovery available';
    await input.fill('不存在的说明');
    await requireRows([], []);
    assert.equal(
      await example.getByText('换个关键词，或清空搜索查看全部说明。', { exact: true }).count(),
      1,
    );
    await clearSearch(all, [], 'Space');

    stage = 'native Tab observation';
    await input.fill('集合');
    await requireRows(['meeting'], []);
    await input.focus();
    await input.press('Tab');
    tabTargets.push({ from: '搜索说明标题', target: await tabTarget(page) });
    assert.notEqual(tabTargets.at(-1).target.disabled, true);
    await expand.focus();
    await expand.press('Enter');
    await requireRows(['meeting'], ['meeting']);
    await requireFocus(page, expand);
    await expand.press('Tab');
    tabTargets.push({ from: '展开可用说明', target: await tabTarget(page) });
    assert.notEqual(tabTargets.at(-1).target.disabled, true);

    stage = 'synthetic preedit does not filter or prune open values';
    await input.focus();
    await composition(input, 'compositionstart');
    await composingInput(input, 'can');
    await settle(page);
    assert.equal(await input.inputValue(), 'can');
    await requireRows(['meeting'], ['meeting']);
    await composingInput(input, 'canjia');
    await settle(page);
    assert.equal(await input.inputValue(), 'canjia');
    await requireRows(['meeting'], ['meeting']);
    stage = 'synthetic compositionend uses current value rather than event data';
    await composition(input, 'compositionend', '参加', '雨天');
    await requireRows(['preparation'], []);
    assert.equal(await input.inputValue(), '参加');
    await composingInput(input, '参加', false);
    await settle(page);
    await requireRows(['preparation'], []);
    await clearSearch(all, []);

    stage = 'synthetic cancellation retains existing matching open value';
    await input.fill('集合');
    await requireRows(['meeting'], []);
    await expand.focus();
    await expand.press('Enter');
    await requireRows(['meeting'], ['meeting']);
    await input.focus();
    await composition(input, 'compositionstart');
    await composingInput(input, 'quxiao');
    await settle(page);
    assert.equal(await input.inputValue(), 'quxiao');
    await requireRows(['meeting'], ['meeting']);
    await composition(input, 'compositionend', '集合', '');
    await requireRows(['meeting'], ['meeting']);
    assert.equal(await input.inputValue(), '集合');
    await clearSearch(all, ['meeting']);
    result = {
      snapshots,
      tabTargets,
      syntheticComposition: 'State-machine events only; not native IME evidence.',
    };
  } catch (error) {
    error.message = `AccordionReading [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      stage = 'cleanup';
      await clear.focus();
      await clear.press('Enter');
      await requireFocus(page, input);
      await collapse.focus();
      await collapse.press('Enter');
      await requireRows(all, []);
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      await originalInput.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}

/** Keep the original single-open FAQ behavior and restore its RSS default for repeated calls. */
export async function verifyAccordionBasic(page, example) {
  const entries = [
    {
      key: 'rss',
      title: '如何订阅这个小站？',
      body: '把本站的 RSS 地址添加到你的阅读器，有新文章时就能看到更新。',
    },
    {
      key: 'comments',
      title: '我可以给文章留言吗？',
      body: '可以在文章下方分享想法。联系表单适合需要单独回复的内容。',
    },
    {
      key: 'frequency',
      title: '多久更新一次？',
      body: '没有固定频率。遇到值得记下的小事，就会慢慢写出来。',
    },
  ];
  const button = (key) =>
    example.getByRole('button', {
      name: entries.find((entry) => entry.key === key).title,
      exact: true,
    });
  const states = [];
  let originalError, result;
  async function requireState(open) {
    for (const entry of entries) {
      assert.equal(
        await button(entry.key).getAttribute('aria-expanded'),
        String(entry.key === open),
      );
      await example
        .getByText(entry.body, { exact: true })
        .waitFor({ state: entry.key === open ? 'visible' : 'hidden' });
      const box = await button(entry.key).boundingBox();
      assert(box.height >= 44 - 0.01);
    }
    states.push({ open });
  }
  try {
    await button('rss').waitFor();
    await requireState('rss');
    await button('comments').focus();
    await button('comments').press('Enter');
    await requireState('comments');
    await requireFocus(page, button('comments'));
    await button('comments').press('Space');
    await requireState(null);
    await requireFocus(page, button('comments'));
    await button('rss').focus();
    await button('rss').press('Space');
    await requireState('rss');
    await requireFocus(page, button('rss'));
    result = { states, singleOpen: true };
  } catch (error) {
    error.message = `AccordionBasic: ${error.message}`;
    originalError = error;
  } finally {
    try {
      if ((await button('rss').getAttribute('aria-expanded')) !== 'true') {
        await button('rss').focus();
        await button('rss').press('Enter');
      }
      await requireState('rss');
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    }
  }
  if (originalError) throw originalError;
  return result;
}
