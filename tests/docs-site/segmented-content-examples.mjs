import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const articles = [
  {
    id: 'weekend-walk',
    title: '周末散步，遇到一朵小花',
    paragraphs: ['沿着小路走走，在路边发现了一朵刚开的花。', '日记'],
  },
  {
    id: 'favorite-words',
    title: '把今天喜欢的句子记下来',
    paragraphs: ['抄到第三句才发现，前面两句漏了同一个字。', '随手记'],
  },
  {
    id: 'simple-dinner',
    title: '给自己做一顿简单的晚饭',
    paragraphs: ['用冰箱里的食材煮一碗热汤，盛好才发现汤勺还没洗。', '日记'],
  },
];
const categories = {
  all: { label: '全部内容', items: articles },
  journal: { label: '日记', items: [articles[0], articles[2]] },
  notes: { label: '随手记', items: [articles[1]] },
};

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function articleSnapshot(list) {
  return list.getByRole('listitem').evaluateAll((items) =>
    items.map((item) => ({
      id: item.getAttribute('data-article-id'),
      title: item.querySelector('h1, h2, h3, h4, h5, h6')?.textContent,
      paragraphs: [...item.querySelectorAll('p')].map((paragraph) => paragraph.textContent),
    })),
  );
}

async function layoutGeometry(page, list) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  return list.evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const boxes = [...node.children].map((item) => {
      const box = item.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    });
    const columns = [];
    for (const box of boxes) {
      if (!columns.some((x) => Math.abs(x - box.x) <= 1)) columns.push(box.x);
    }
    return {
      display: style.display,
      templateColumns: style.gridTemplateColumns,
      gap: Number.parseFloat(style.columnGap),
      contentWidth:
        node.clientWidth -
        Number.parseFloat(style.paddingLeft) -
        Number.parseFloat(style.paddingRight),
      columns: columns.length,
      bounds: { left: rect.left, right: rect.right },
      boxes,
    };
  });
}

/** Check the existing filter's two independent groups and their real article presentation. */
export async function verifySegmentedContent(page, example) {
  await revealExample(example);
  const categoryGroup = example.getByRole('group', { name: '筛选文章类型', exact: true });
  const viewGroup = example.getByRole('group', { name: '文章视图', exact: true });
  const all = categoryGroup.getByRole('radio', { name: '全部', exact: true });
  const journal = categoryGroup.getByRole('radio', { name: '日记', exact: true });
  const notes = categoryGroup.getByRole('radio', { name: '随手记', exact: true });
  const listView = viewGroup.getByRole('radio', { name: '列表', exact: true });
  const cardsView = viewGroup.getByRole('radio', { name: '卡片', exact: true });
  const list = example.getByRole('list', { name: '筛选后的文章', exact: true });
  const status = example.getByRole('status');
  let stage = 'initial';
  let originalError;
  let listGeometry;
  let cardsGeometry;
  let tabTarget;

  async function requireState(category, presentation) {
    const expected = categories[category];
    const text = `${expected.label} · ${expected.items.length} 篇文章 · ${presentation === 'cards' ? '卡片' : '列表'}视图`;
    const node = await status.elementHandle();
    try {
      await page.waitForFunction(({ element, value }) => element.textContent.trim() === value, {
        element: node,
        value: text,
      });
    } finally {
      await node.dispose();
    }
    assert.equal(await categoryGroup.getByRole('radio', { checked: true }).inputValue(), category);
    assert.equal(await viewGroup.getByRole('radio', { checked: true }).inputValue(), presentation);
    assert.equal(await list.getAttribute('data-view'), presentation);
    assert.deepEqual(await articleSnapshot(list), expected.items);
    assert.equal(await status.count(), 1);
    assert.equal(await list.getByRole('status').count(), 0);
    assert.equal(
      await example.locator('[aria-live]').count(),
      0,
      'The status is the only live result.',
    );
  }

  try {
    await all.waitFor();
    await requireState('all', 'list');
    const names = await Promise.all(
      [categoryGroup, viewGroup].map((group) =>
        group
          .getByRole('radio')
          .evaluateAll((radios) => [...new Set(radios.map((radio) => radio.name))]),
      ),
    );
    assert.equal(names[0].length, 1);
    assert.equal(names[1].length, 1);
    assert(names[0][0] && names[1][0] && names[0][0] !== names[1][0]);
    for (const option of [all, journal, notes, listView, cardsView]) {
      const target = await option.evaluate((node) => {
        const box = node.closest('label').getBoundingClientRect();
        return { width: box.width, height: box.height };
      });
      assert(target.width >= 44 && target.height >= 44, 'Each native radio retains a 44px target.');
    }

    stage = 'category Arrow changes only the category';
    await all.focus();
    await all.press('ArrowDown');
    await requireState('journal', 'list');
    await requireFocus(page, journal);
    const journalContent = await articleSnapshot(list);

    stage = 'presentation Arrow preserves the filtered content';
    await listView.focus();
    await listView.press('ArrowDown');
    await requireState('journal', 'cards');
    await requireFocus(page, cardsView);
    assert.deepEqual(await articleSnapshot(list), journalContent);
    await listView.focus();
    await listView.press('Space');
    await requireState('journal', 'list');
    await requireFocus(page, listView);
    assert.deepEqual(await articleSnapshot(list), journalContent);

    stage = 'Space selects another category without resetting presentation';
    await notes.focus();
    await notes.press('Space');
    await requireState('notes', 'list');
    await requireFocus(page, notes);
    const noteContent = await articleSnapshot(list);
    await cardsView.focus();
    await cardsView.press('Space');
    await requireState('notes', 'cards');
    await requireFocus(page, cardsView);
    assert.deepEqual(await articleSnapshot(list), noteContent);
    await journal.focus();
    await journal.press('Space');
    await requireState('journal', 'cards');
    await requireFocus(page, journal);

    stage = 'all articles show real list and grid geometry';
    await all.check();
    await requireState('all', 'cards');
    cardsGeometry = await layoutGeometry(page, list);
    assert.equal(cardsGeometry.display, 'grid');
    assert.equal(cardsGeometry.boxes.length, 3);
    if (cardsGeometry.contentWidth + 1 >= 440 + cardsGeometry.gap) {
      assert(
        cardsGeometry.columns >= 2,
        'A sufficiently wide article area uses multiple card columns.',
      );
    } else {
      assert.equal(cardsGeometry.columns, 1, 'A narrow article area keeps cards in one column.');
    }
    await listView.check();
    await requireState('all', 'list');
    listGeometry = await layoutGeometry(page, list);
    assert.equal(listGeometry.columns, 1);
    assert(listGeometry.boxes[1].y > listGeometry.boxes[0].y);
    assert(listGeometry.boxes[2].y > listGeometry.boxes[1].y);
    assert(
      cardsGeometry.columns !== listGeometry.columns ||
        Math.abs(cardsGeometry.boxes[0].height - listGeometry.boxes[0].height) > 1 ||
        Math.abs(cardsGeometry.boxes[0].width - listGeometry.boxes[0].width) > 1,
      'Changing presentation changes actual content geometry, including on a one-column phone.',
    );
    for (const geometry of [listGeometry, cardsGeometry]) {
      for (const box of geometry.boxes) {
        assert(box.x >= geometry.bounds.left - 1);
        assert(box.x + box.width <= geometry.bounds.right + 1);
      }
    }

    stage = 'native Tab leaves the category group without changing either choice';
    await all.focus();
    await page.keyboard.press('Tab');
    tabTarget = await page.evaluate(() => {
      const node = document.activeElement;
      return {
        tag: node?.tagName,
        type: node?.getAttribute('type'),
        value: node?.getAttribute('value'),
        group: node?.closest('fieldset')?.querySelector('legend')?.textContent ?? null,
        text: node?.textContent?.trim().slice(0, 100),
      };
    });
    assert.equal(
      await categoryGroup.evaluate((node) => node.contains(document.activeElement)),
      false,
    );
    await requireState('all', 'list');
  } catch (error) {
    error.message = `SegmentedFiltering [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      await all.check();
      await listView.check();
      await requireState('all', 'list');
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    }
  }
  if (originalError) throw originalError;
  return { listGeometry, cardsGeometry, tabTarget };
}
