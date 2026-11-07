import assert from 'node:assert/strict';
import { createBasicConsumerPage, openBasicConsumer } from './browser-setup.mjs';

async function focused(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

async function verifyPairedDirections(page, nav, label) {
  const original = await nav.evaluate((node) => {
    const previous = { dir: node.getAttribute('dir'), max: node.style.maxInlineSize };
    node.style.maxInlineSize = '316px';
    return previous;
  });
  try {
    for (const direction of ['ltr', 'rtl']) {
      await nav.evaluate((node, value) => (node.dir = value), direction);
      const pair = await nav.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const targets = [...node.querySelectorAll('button, a, [role="link"]')];
        const previous = targets.find((target) => target.getAttribute('aria-label') === '上一页');
        const next = targets.find((target) => target.getAttribute('aria-label') === '下一页');
        const measure = (target) => {
          const bounds = target.getBoundingClientRect();
          return {
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
          };
        };
        return {
          previous: measure(previous),
          next: measure(next),
          root: { left: box.left, right: box.right },
          finalLabels: targets.slice(-2).map((target) => target.getAttribute('aria-label')),
        };
      });
      const text = `${label} ${direction}`;
      assert.deepEqual(
        pair.finalLabels,
        ['上一页', '下一页'],
        `${text}: visual and DOM order agree.`,
      );
      assert(
        Math.abs(pair.previous.top - pair.next.top) < 0.1,
        `${text}: previous and next stay together when the page numbers wrap.`,
      );
      for (const target of [pair.previous, pair.next]) {
        assert(
          target.width >= 44 && target.height >= 44,
          `${text}: direction targets stay full size.`,
        );
        assert(
          target.left >= pair.root.left - 1 && target.right <= pair.root.right + 1,
          `${text}: the direction pair stays inside the navigator.`,
        );
      }
      const gap =
        direction === 'ltr'
          ? pair.next.left - pair.previous.right
          : pair.previous.left - pair.next.right;
      assert(Math.abs(gap - 8) < 0.1, `${text}: paired directions retain their shared gap.`);
    }
    await nav
      .getByRole('button', { name: /^第 \d+ 页$/ })
      .last()
      .focus();
    await page.keyboard.press('Tab');
    await focused(page, nav.getByRole('button', { name: '上一页', exact: true }));
    await page.keyboard.press('Tab');
    await focused(page, nav.getByRole('button', { name: '下一页', exact: true }));
  } finally {
    await nav.evaluate((node, previous) => {
      if (previous.dir == null) node.removeAttribute('dir');
      else node.setAttribute('dir', previous.dir);
      node.style.maxInlineSize = previous.max;
    }, original);
  }
}

export async function verifyNavigationAppearance(page, theme) {
  const tabs = page.getByTestId('navigation-tabs');
  const longTab = tabs.getByRole('tab', { name: /^和朋友们一起收集/ });
  await longTab.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('End');
  await focused(page, longTab);
  await page.keyboard.press('Enter');
  assert.equal(await longTab.getAttribute('aria-selected'), 'true');
  const selected = await longTab.evaluate((node) => {
    const style = getComputedStyle(node);
    const marker = getComputedStyle(node, '::after');
    const bounds = node.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(node);
    return {
      focus: node.matches(':focus-visible') && style.outlineStyle !== 'none',
      selected: marker.opacity === '1' && parseFloat(marker.height) > 0,
      fits:
        bounds.height >= 44 &&
        [...range.getClientRects()].every(
          (line) =>
            line.left >= bounds.left - 1 &&
            line.right <= bounds.right + 1 &&
            line.top >= bounds.top - 1 &&
            line.bottom <= bounds.bottom + 1,
        ),
    };
  });
  assert(selected.focus && selected.selected, `${theme}: selected ink and keyboard focus coexist.`);
  assert(selected.fits, 'A long Chinese tab remains complete inside its touch target.');
  const disabledTab = tabs.getByRole('tab', { name: 'Disabled tab', exact: true });
  const disabledInk = await disabledTab.evaluate((node) => ({
    text: getComputedStyle(node).color,
    marker: getComputedStyle(node, '::after').backgroundColor,
  }));
  assert.equal(disabledInk.marker, disabledInk.text, `${theme}: disabled ink stays quiet.`);
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');

  const disabledSelected = page
    .getByTestId('navigation-disabled-selected-tabs')
    .getByRole('tab', { name: 'Disabled selected tab', exact: true });
  assert.equal(await disabledSelected.getAttribute('aria-selected'), 'true');
  assert.equal(await disabledSelected.getAttribute('aria-disabled'), 'true');
  const disabledSelectedInk = await disabledSelected.evaluate((node) => ({
    text: getComputedStyle(node).color,
    marker: getComputedStyle(node, '::after').backgroundColor,
    opacity: getComputedStyle(node, '::after').opacity,
  }));
  assert.equal(disabledSelectedInk.opacity, '1');
  assert.equal(
    disabledSelectedInk.marker,
    disabledSelectedInk.text,
    `${theme}: a controlled disabled selection keeps its ink marker muted.`,
  );

  const pages = page.getByTestId('navigation-numeric-pages');
  const numbers = await pages.getByRole('button', { name: /^第 \d+ 页$/ }).evaluateAll((nodes) =>
    nodes.map((node) => {
      const bounds = node.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(node);
      const text = range.getBoundingClientRect();
      return {
        label: node.textContent,
        height: bounds.height,
        width: bounds.width,
        x: Math.abs(text.x + text.width / 2 - (bounds.x + bounds.width / 2)),
        y: Math.abs(text.y + text.height / 2 - (bounds.y + bounds.height / 2)),
      };
    }),
  );
  assert.deepEqual(
    numbers.map(({ label }) => label),
    ['1', '107', '108', '109', '2000'],
  );
  for (const number of numbers) {
    assert(number.height === 44 && number.width >= 44, `${number.label}: full page target.`);
    assert(number.x <= 2 && number.y <= 2, `${number.label}: page text is optically centered.`);
  }
  assert.equal(
    await pages.getByRole('button', { name: '第 108 页' }).getAttribute('aria-current'),
    'page',
  );
  assert(
    await pages.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return [...node.querySelectorAll('button')].every((button) => {
        const target = button.getBoundingClientRect();
        return target.left >= bounds.left - 1 && target.right <= bounds.right + 1;
      });
    }),
    'Large page numbers wrap inside the available reading column.',
  );
  const edge = await pages.getByRole('button', { name: '第 107 页' }).evaluate((node) => {
    const probe = document.createElement('span');
    probe.style.borderColor = 'var(--yahha-paper-line)';
    node.append(probe);
    const expected = getComputedStyle(probe).borderColor;
    probe.remove();
    return { actual: getComputedStyle(node).borderTopColor, expected };
  });
  assert.equal(edge.actual, edge.expected, `${theme}: ordinary pages use a light paper edge.`);
  await verifyPairedDirections(page, pages, theme);

  const fullRange = page.getByTestId('navigation-full-range-pages');
  const fullRangeTargets = await fullRange.getByRole('button').evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      const root = node.closest('nav').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(node);
      const lines = [...range.getClientRects()];
      return {
        label: node.textContent,
        target: box.width >= 44 && box.height >= 44,
        fits:
          box.left >= root.left - 1 &&
          box.right <= root.right + 1 &&
          lines.length === 1 &&
          lines.every((line) => line.left >= box.left - 1 && line.right <= box.right + 1),
      };
    }),
  );
  assert(
    fullRangeTargets.some(({ label }) => label === String(Number.MAX_SAFE_INTEGER)),
    'The overflow case exercises the supported maximum page number.',
  );
  assert(
    fullRangeTargets.every(({ target, fits }) => target && fits),
    `${theme}: full-range page numbers stay complete inside their 44px targets and navigator.`,
  );

  const accordion = page.getByTestId('navigation-accordion');
  const question = accordion.getByRole('button', { name: /^如果文章的标题和问题都很长/ });
  await page.waitForFunction(
    (node) => node.getAttribute('aria-expanded') === 'true',
    await question.elementHandle(),
  );
  assert.equal(await question.getAttribute('aria-expanded'), 'true');
  const alignment = await question.evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node.firstElementChild);
    const lines = [...range.getClientRects()];
    const first = lines[0];
    const marker = node.querySelector('svg').getBoundingClientRect();
    return {
      lines: lines.length,
      offset: Math.abs(marker.y + marker.height / 2 - (first.y + first.height / 2)),
    };
  });
  assert(alignment.lines > 1, 'The long question exercises a real multiline title.');
  assert(alignment.offset <= 2, 'The disclosure glyph aligns with the first question line.');
  assert.equal(
    await accordion
      .getByRole('button', { name: 'First question', exact: true })
      .evaluate((node) => node.getBoundingClientRect().height),
    44,
    'A short accordion question keeps the standard 44px target.',
  );
  const answer = page.getByTestId('navigation-long-answer');
  await answer.waitFor({ state: 'visible' });
  for (const direction of ['ltr', 'rtl']) {
    await accordion.evaluate((node, dir) => (node.dir = dir), direction);
    const titleBounds = await question.locator('span').first().boundingBox();
    const answerBounds = await answer.boundingBox();
    const titleStart = direction === 'rtl' ? titleBounds.x + titleBounds.width : titleBounds.x;
    const answerStart = direction === 'rtl' ? answerBounds.x + answerBounds.width : answerBounds.x;
    assert(
      Math.abs(titleStart - answerStart) <= 1,
      `${theme}: ${direction} answers align with their question's reading edge.`,
    );
  }
  await accordion.evaluate((node) => node.removeAttribute('dir'));
  assert(
    await answer.evaluate((node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const bounds = node.closest('[role="region"]').getBoundingClientRect();
      return [...range.getClientRects()].every(
        (line) =>
          line.left >= bounds.left - 1 &&
          line.right <= bounds.right + 1 &&
          line.top >= bounds.top - 1 &&
          line.bottom <= bounds.bottom + 1,
      );
    }),
    'Expanded answers retain every wrapped line.',
  );
  const locked = accordion.getByRole('button', { name: 'Disabled expanded question', exact: true });
  assert(await locked.isDisabled());
  assert.equal(await locked.getAttribute('aria-expanded'), 'true');
  const resting = await locked.locator('svg').evaluate((node) => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--yahha-muted)';
    node.parentElement.append(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    const style = getComputedStyle(node);
    return {
      actual: style.backgroundColor,
      ink: style.color,
      border: style.borderTopColor,
      frame: [node.getBoundingClientRect().width, node.getBoundingClientRect().height],
      pointsUp: new DOMMatrixReadOnly(style.transform).a < 0,
      expected,
    };
  });
  assert.equal(
    resting.actual,
    'rgba(0, 0, 0, 0)',
    `${theme}: the ordinary disabled disclosure does not gain a filled knob.`,
  );
  assert.equal(
    resting.border,
    'rgba(0, 0, 0, 0)',
    `${theme}: the ordinary glyph has no knob border.`,
  );
  assert.equal(
    resting.ink,
    resting.expected,
    `${theme}: the disabled disclosure keeps readable muted ink.`,
  );
  assert.deepEqual(
    resting.frame,
    [28, 28],
    `${theme}: removing the knob preserves its glyph frame.`,
  );
  assert(resting.pointsUp, 'A disabled expanded panel keeps its open direction.');
  assert(
    await accordion
      .getByText('Disabled expanded answer remains readable', { exact: true })
      .isVisible(),
  );

  const unbrokenTabs = page.getByTestId('navigation-unbroken-tabs');
  const address = unbrokenTabs.getByRole('tab', { name: /^https:\/\/example.com\// });
  const wrappedAddress = await address.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(node);
    const lines = [...range.getClientRects()];
    return {
      lines: lines.length,
      fits: lines.every(
        (line) =>
          line.left >= box.left - 1 &&
          line.right <= box.right + 1 &&
          line.top >= box.top - 1 &&
          line.bottom <= box.bottom + 1,
      ),
    };
  });
  assert(wrappedAddress.lines > 1 && wrappedAddress.fits, 'An unbroken address wraps completely.');
  for (const group of [tabs, unbrokenTabs]) {
    const controls = group.getByRole('tab');
    const rows = await controls.evaluateAll(
      (nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().top))).size,
    );
    if (group === unbrokenTabs)
      assert(rows > 1, 'The focus check exercises a tab list with multiple rows.');
    await controls.first().focus();
    await page.keyboard.press('Home');
    for (let index = 0; index < (await controls.count()); index++) {
      const tab = controls.nth(index);
      await focused(page, tab);
      const clearance = await tab.evaluate((node) => {
        const style = getComputedStyle(node);
        const extent = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
        const box = node.getBoundingClientRect();
        const ring = {
          left: box.left - extent,
          right: box.right + extent,
          top: box.top - extent,
          bottom: box.bottom + extent,
        };
        const list = node.closest('[role="tablist"]');
        const bounds = list.getBoundingClientRect();
        return {
          visible: node.matches(':focus-visible') && style.outlineStyle !== 'none' && extent > 0,
          inside:
            ring.left >= bounds.left - 0.1 &&
            ring.right <= bounds.right + 0.1 &&
            ring.top >= bounds.top - 0.1 &&
            ring.bottom <= bounds.bottom + 0.1,
          separate: [...list.querySelectorAll('[role="tab"]')].every((other) => {
            if (other === node) return true;
            const neighbor = other.getBoundingClientRect();
            return (
              ring.right + 1 <= neighbor.left + 0.1 ||
              ring.left - 1 >= neighbor.right - 0.1 ||
              ring.bottom + 1 <= neighbor.top + 0.1 ||
              ring.top - 1 >= neighbor.bottom - 0.1
            );
          }),
        };
      });
      assert.deepEqual(
        clearance,
        { visible: true, inside: true, separate: true },
        `${theme}: wrapped tab ${index + 1} keeps its complete focus ring clear of other rows.`,
      );
      await page.keyboard.press('ArrowRight');
    }
  }
}

export async function verifyAccordionFocusInCard(page) {
  const example = page.getByTestId('navigation-clipped-accordion');
  const first = example.getByRole('button', { name: 'Subscribe to these notes', exact: true });
  if ((await first.getAttribute('aria-expanded')) !== 'true') await first.click();
  await example.getByRole('button', { name: 'Before clipped questions', exact: true }).press('Tab');
  const long = example.getByRole('button', { name: /^如果周末下雨/ });
  for (const question of [first, long]) {
    await focused(page, question);
    const visibleRing = await question.evaluate((node) => {
      const card = node.closest('[data-testid="question-card"]');
      const bounds = card.getBoundingClientRect();
      const cardStyle = getComputedStyle(card);
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const extent = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
      return {
        visible: node.matches(':focus-visible') && parseFloat(style.outlineWidth) >= 2,
        inside:
          box.left - extent >= bounds.left + parseFloat(cardStyle.borderLeftWidth) - 0.1 &&
          box.right + extent <= bounds.right - parseFloat(cardStyle.borderRightWidth) + 0.1 &&
          box.top - extent >= bounds.top + parseFloat(cardStyle.borderTopWidth) - 0.1 &&
          box.bottom + extent <= bounds.bottom - parseFloat(cardStyle.borderBottomWidth) + 0.1,
      };
    });
    assert.deepEqual(
      visibleRing,
      { visible: true, inside: true },
      "The keyboard focus ring stays within the card's clipping bounds.",
    );
    if (question === first) {
      assert.equal(await first.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Tab');
      await focused(page, example.getByRole('link', { name: 'Read subscription details' }));
      await page.keyboard.press('Tab');
    }
  }
  await page.keyboard.press('Enter');
  assert.equal(await long.getAttribute('aria-expanded'), 'true');
  assert.equal(await first.getAttribute('aria-expanded'), 'false');
  await page.keyboard.press('Tab');
  await focused(
    page,
    example.getByRole('button', { name: 'After clipped questions', exact: true }),
  );
}

export async function verifyNavigation(browser, url) {
  for (const width of [1280, 390, 320]) {
    const { page, errors } = await createBasicConsumerPage(browser, width);
    try {
      await openBasicConsumer(page, url);
      for (const theme of ['pink', 'blue', 'yellow']) {
        await page.getByRole('combobox', { name: 'Basic preview theme' }).selectOption(theme);
        await verifyNavigationAppearance(page, theme);
        await verifyAccordionFocusInCard(page);
      }
      assert.deepEqual(errors, [], 'Installed navigation consumer emitted browser errors.');
      console.log(
        `Navigation package: all themes, wrapping and keyboard focus passed at ${width}px.`,
      );
    } finally {
      await page.close();
    }
  }
}
