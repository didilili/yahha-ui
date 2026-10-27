import assert from 'node:assert/strict';

const textGeometry = (node) => {
  const box = node.getBoundingClientRect();
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const lines = [];
  for (let text = walker.nextNode(); text; text = walker.nextNode()) {
    if (!text.textContent.trim() || text.parentElement.closest('[aria-hidden="true"]')) continue;
    const range = document.createRange();
    range.selectNodeContents(text);
    lines.push(
      ...[...range.getClientRects()].map(({ top, bottom, left, right, height }) => ({
        top,
        bottom,
        left,
        right,
        height,
      })),
    );
  }
  return {
    lines,
    height: box.height,
    complete:
      lines.length > 0 &&
      lines.every(
        (line) =>
          line.left >= box.left - 1 &&
          line.right <= box.right + 1 &&
          line.top >= box.top - 1 &&
          line.bottom <= box.bottom + 1,
      ),
  };
};

async function painted(popup) {
  await popup
    .page()
    .waitForFunction(
      (node) =>
        node.isConnected &&
        !node.hasAttribute('data-starting-style') &&
        !node.hasAttribute('data-ending-style') &&
        getComputedStyle(node).opacity === '1',
      await popup.elementHandle(),
    );
}

export async function verifyOverlayClose(popup, label) {
  await painted(popup);
  const title = popup.getByRole('heading');
  const text = await title.evaluate(textGeometry);
  const close = popup.getByRole('button', { name: /^关闭/ });
  const box = await close.boundingBox();
  assert(box.width >= 44 && box.height >= 44, `${label}: closing retains a 44px target.`);
  assert(text.complete, `${label}: every title line stays inside its heading.`);
  assert(
    Math.abs(box.y + box.height / 2 - (text.lines[0].top + text.lines[0].height / 2)) <= 2,
    `${label}: close aligns with the title's first rendered line.`,
  );
  assert(
    text.lines.every(
      (line) =>
        line.right <= box.x ||
        line.left >= box.x + box.width ||
        line.bottom <= box.y ||
        line.top >= box.y + box.height,
    ),
    `${label}: title text does not collide with closing.`,
  );
}

async function verifyTooltip(page, label) {
  const tooltip = page.locator('.basic-tooltip');
  await tooltip.waitFor();
  // Base UI mounts a measurable popup before its opening paint and final positioning settle.
  await page.waitForFunction(
    (node) => {
      const arrow = node.nextElementSibling;
      if (!arrow) return false;
      return (
        node.dataset.side &&
        node.dataset.side === arrow.dataset.side &&
        [node, arrow].every((element) => {
          const box = element.getBoundingClientRect();
          return (
            !element.hasAttribute('data-starting-style') &&
            getComputedStyle(element).opacity === '1' &&
            box.width > 0 &&
            box.height > 0
          );
        })
      );
    },
    await tooltip.elementHandle(),
  );
  const text = await tooltip.evaluate(textGeometry);
  assert(
    text.lines.length > 1 && text.complete,
    `${label}: the complete tooltip wraps inside its paper.`,
  );
  const arrow = await tooltip.evaluate((node) => {
    const arrow = node.nextElementSibling,
      box = arrow.getBoundingClientRect();
    const popup = node.getBoundingClientRect(),
      css = getComputedStyle(arrow);
    const ink = getComputedStyle(arrow, '::before');
    let unclipped = true;
    for (let parent = arrow.parentElement; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent),
        clip = parent.getBoundingClientRect();
      if (/(hidden|clip|auto|scroll)/.test(style.overflowX))
        unclipped &&= box.left >= clip.left && box.right <= clip.right;
      if (/(hidden|clip|auto|scroll)/.test(style.overflowY))
        unclipped &&= box.top >= clip.top && box.bottom <= clip.bottom;
    }
    const side = arrow.dataset.side;
    const edge = {
      top: [box.top, popup.bottom],
      bottom: [box.bottom, popup.top],
      left: [box.left, popup.right],
      right: [box.right, popup.left],
    }[side];
    return {
      side,
      display: css.display,
      visibility: css.visibility,
      opacity: css.opacity,
      attributes: Object.fromEntries([...arrow.attributes].map(({ name, value }) => [name, value])),
      unclipped,
      outside: edge && Math.abs(edge[0] - edge[1]) <= 6,
      visible:
        css.display !== 'none' &&
        css.visibility !== 'hidden' &&
        Number(css.opacity) > 0 &&
        box.width > 0 &&
        box.height > 0 &&
        ink.content !== 'none',
      borders: ['Top', 'Right', 'Bottom', 'Left'].map((side) =>
        Number(parseFloat(ink[`border${side}Width`]) > 0),
      ),
    };
  });
  assert(
    arrow.visible && arrow.unclipped && arrow.outside,
    `${label}: the sibling arrow paints beyond the tooltip edge without clipping: ${JSON.stringify(arrow)}.`,
  );
  const edges = {
    top: [0, 1, 1, 0],
    bottom: [1, 0, 0, 1],
    left: [1, 1, 0, 0],
    right: [0, 0, 1, 1],
  };
  assert.deepEqual(
    arrow.borders,
    edges[arrow.side],
    `${label}: arrow ink faces its actual placement.`,
  );
}

export async function verifyOverlayAppearance(page, theme) {
  const label = `${theme} ${page.viewportSize().width}px`;
  const menuTrigger = page.getByRole('button', { name: 'Basic actions', exact: true });
  await menuTrigger.click();
  const menu = page.getByRole('menu');
  await menu.waitFor();
  const items = menu.getByRole('menuitem');
  let previous;
  for (const item of await items.all()) {
    const text = await item.evaluate(textGeometry);
    assert(
      text.complete && text.height >= 44,
      `${label}: menu rows contain every line and a 44px target.`,
    );
    if (previous)
      assert(previous <= text.lines[0].top, `${label}: adjacent menu labels stay separate.`);
    previous = text.lines.at(-1).bottom;
  }
  const first = items.first();
  await first.focus();
  const text = await first.evaluate(textGeometry);
  assert(text.lines.length > 1, `${label}: the menu exercises a multiline action.`);
  const mark = await first.evaluate((node) => {
    const box = node.getBoundingClientRect(),
      css = getComputedStyle(node, '::before');
    return {
      center: box.top + parseFloat(css.top) + parseFloat(css.height) / 2,
      opacity: css.opacity,
    };
  });
  assert.equal(mark.opacity, '1', `${label}: keyboard highlighting paints the short ink mark.`);
  assert(
    Math.abs(mark.center - (text.lines[0].top + text.lines[0].height / 2)) <= 2,
    `${label}: the short ink mark follows the first line of a multiline action.`,
  );
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'hidden' });

  await page.getByRole('button', { name: 'Open basic popover', exact: true }).click();
  const popover = page.getByRole('dialog', { name: /^Basic popover:/ });
  await popover.waitFor();
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await popover.getByRole('textbox', { name: 'Popover note', exact: true }).elementHandle(),
  );
  await verifyOverlayClose(popover, label);
  const form = popover.getByTestId('overlay-note-form');
  assert(
    (await popover.getByRole('heading').evaluate(textGeometry)).lines.length > 1,
    `${label}: the note title exercises natural wrapping.`,
  );
  assert(
    await form.evaluate((node) => {
      const form = node.getBoundingClientRect(),
        popup = node.closest('[role="dialog"]').getBoundingClientRect();
      // Base UI's hidden autofill/submission input is not part of the visible form layout.
      const controls = [...node.querySelectorAll('input, button')].filter(
        (control) => control.getAttribute('aria-hidden') !== 'true' && control.type !== 'hidden',
      );
      return (
        node.scrollWidth <= node.clientWidth + 1 &&
        form.left >= popup.left &&
        form.right <= popup.right &&
        controls.length === 3 &&
        controls.every((control) => {
          const box = control.getBoundingClientRect();
          return (
            box.left >= form.left - 1 &&
            box.right <= form.right + 1 &&
            box.top >= form.top - 1 &&
            box.bottom <= form.bottom + 1
          );
        })
      );
    }),
    `${label}: the complete small form fits its note paper and natural flow.`,
  );
  await popover.getByRole('button', { name: '关闭浮层', exact: true }).click();
  await popover.waitFor({ state: 'hidden' });

  const help = page.getByRole('button', { name: 'Read article help', exact: true });
  await page.keyboard.press('Tab');
  await help.focus();
  await verifyTooltip(page, label);
  await page.keyboard.press('Escape');
  await page.locator('.basic-tooltip').waitFor({ state: 'hidden' });
  await help.evaluate((node) => node.scrollIntoView({ block: 'start' }));
  await help.blur();
  await help.focus();
  await page.waitForFunction(
    () => document.querySelector('.basic-tooltip')?.dataset.side === 'bottom',
  );
  await verifyTooltip(page, `${label} top-edge collision`);
  await page.keyboard.press('Escape');
  await page.locator('.basic-tooltip').waitFor({ state: 'hidden' });
  console.log(
    `Browser overlay geometry passed: ${label}, multiline menu/note, form, and tooltip arrow.`,
  );
}

export async function verifyShortOverlays(browser, url) {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 280 },
      reducedMotion: 'reduce',
    });
    try {
      await page.goto(`${url}?basics`);
      const trigger = page.getByRole('button', { name: 'Basic actions', exact: true });
      await trigger.click();
      const menu = page.getByRole('menu');
      await menu.waitFor();
      assert(
        await menu.evaluate((node) => node.scrollHeight > node.clientHeight),
        'The short action menu scrolls.',
      );
      await page.waitForFunction(
        (node) => document.activeElement === node,
        await menu.elementHandle(),
      );
      await page.keyboard.press('End');
      const save = menu.getByRole('menuitem', { name: 'Save article', exact: true });
      await page.waitForFunction(
        (node) => {
          const box = node.getBoundingClientRect(),
            menu = node.closest('[role="menu"]').getBoundingClientRect();
          return (
            document.activeElement === node && box.top >= menu.top && box.bottom <= menu.bottom
          );
        },
        await save.elementHandle(),
      );
      await page.keyboard.press('Enter');
      await menu.waitFor({ state: 'hidden' });
      await page.waitForFunction(
        (node) => document.activeElement === node,
        await trigger.elementHandle(),
      );
      assert.equal(await page.getByLabel('Basic action result').innerText(), 'Saved article');
      for (const [name, title, closeName] of [
        ['Open basic popover', /^Basic popover:/, '关闭浮层'],
        ['Open nested controls', 'Nested basic controls', '关闭弹窗'],
      ]) {
        const trigger = page.getByRole('button', { name, exact: true });
        await trigger.click();
        const popup = page.getByRole('dialog', { name: title });
        await popup.waitFor();
        await painted(popup);
        await page.waitForFunction(
          (node) => node.contains(document.activeElement),
          await popup.elementHandle(),
        );
        assert(
          await popup.evaluate((node) => {
            const box = node.getBoundingClientRect();
            return (
              box.top >= 0 && box.bottom <= innerHeight + 1 && node.scrollHeight > node.clientHeight
            );
          }),
          `${width}×280: the note/dialog fits and scrolls.`,
        );
        await popup.getByRole('combobox').focus();
        await popup.evaluate((node) => {
          node.scrollTop = node.scrollHeight;
        });
        const close = popup.getByRole('button', { name: closeName, exact: true });
        await close.focus();
        const target = await close.evaluate((node) => {
          const box = node.getBoundingClientRect(),
            x = box.x + box.width / 2,
            y = box.y + box.height / 2;
          return {
            x,
            y,
            hit:
              box.width >= 44 &&
              box.height >= 44 &&
              x > 0 &&
              y > 0 &&
              x < innerWidth &&
              y < innerHeight &&
              node.contains(document.elementFromPoint(x, y)),
          };
        });
        assert(
          target.hit,
          `${width}×280: closing is a visible 44px pointer target after scrolling.`,
        );
        await page.mouse.click(target.x, target.y);
        await popup.waitFor({ state: 'hidden' });
        await page.waitForFunction(
          (node) => document.activeElement === node,
          await trigger.elementHandle(),
        );
      }
      console.log(
        `Browser short overlays passed: ${width}×280, scroll, close targets, and focus return.`,
      );
    } finally {
      await page.close();
    }
  }
}
