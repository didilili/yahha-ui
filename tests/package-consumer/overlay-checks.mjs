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

export async function verifyTooltipSeam(popup, label) {
  const geometry = await popup.evaluate((node) => {
    const arrow = node.nextElementSibling;
    const box = arrow.getBoundingClientRect();
    const paper = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const rtl = style.direction === 'rtl';
    const requested = arrow.dataset.side;
    const side =
      requested === 'inline-start'
        ? rtl
          ? 'right'
          : 'left'
        : requested === 'inline-end'
          ? rtl
            ? 'left'
            : 'right'
          : requested;
    const base = ['left', 'right'].includes(side)
      ? box.left + box.width / 2
      : box.top + box.height / 2;
    const borderCenter = {
      top: paper.bottom - parseFloat(style.borderBottomWidth) / 2,
      bottom: paper.top + parseFloat(style.borderTopWidth) / 2,
      left: paper.right - parseFloat(style.borderRightWidth) / 2,
      right: paper.left + parseFloat(style.borderLeftWidth) / 2,
    }[side];
    return { side, gap: Math.abs(base - borderCenter) };
  });
  assert(
    geometry.gap <= 0.75,
    `${label}: the arrow joins the popup border center without a disconnected seam: ${JSON.stringify(geometry)}.`,
  );
  return geometry;
}

export async function verifyTooltipGeometry(popup, trigger, label) {
  const anchor = await trigger.elementHandle();
  const geometry = await popup.evaluate((node, anchor) => {
    const arrow = node.nextElementSibling;
    const paper = node.getBoundingClientRect();
    const box = arrow.getBoundingClientRect();
    const style = getComputedStyle(node);
    const ink = getComputedStyle(arrow, '::before');
    const rtl = style.direction === 'rtl';
    const requested = arrow.dataset.side;
    const side =
      requested === 'inline-start'
        ? rtl
          ? 'right'
          : 'left'
        : requested === 'inline-end'
          ? rtl
            ? 'left'
            : 'right'
          : requested;
    if (
      getComputedStyle(arrow).display === 'none' ||
      getComputedStyle(arrow).visibility === 'hidden'
    ) {
      return { side, visible: false, uncentered: arrow.hasAttribute('data-uncentered') };
    }
    // Transform the actual pseudo-element border box, not the unrotated Arrow wrapper.
    const outer = (dimension, edges) =>
      parseFloat(ink[dimension]) +
      (ink.boxSizing === 'border-box'
        ? 0
        : edges.reduce(
            (sum, edge) =>
              sum + parseFloat(ink[`border${edge}Width`]) + parseFloat(ink[`padding${edge}`]),
            0,
          ));
    const width = outer('width', ['Left', 'Right']);
    const height = outer('height', ['Top', 'Bottom']);
    const [ox, oy] = ink.transformOrigin.split(' ').map(parseFloat);
    const matrix = new DOMMatrix(ink.transform);
    const corners = [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ].map(([x, y]) => {
      const point = new DOMPoint(x - ox, y - oy).matrixTransform(matrix);
      return {
        x: box.left + parseFloat(ink.left) + ox + point.x,
        y: box.top + parseFloat(ink.top) + oy + point.y,
      };
    });
    const painted = {
      left: Math.min(...corners.map((p) => p.x)),
      right: Math.max(...corners.map((p) => p.x)),
      top: Math.min(...corners.map((p) => p.y)),
      bottom: Math.max(...corners.map((p) => p.y)),
    };
    const target = anchor.getBoundingClientRect();
    const focus = getComputedStyle(anchor);
    const focusExtent =
      anchor.matches(':focus-visible') && focus.outlineStyle !== 'none'
        ? Math.max(0, parseFloat(focus.outlineOffset) + parseFloat(focus.outlineWidth))
        : 0;
    const clearance = {
      top: target.top - painted.bottom,
      bottom: painted.top - target.bottom,
      left: target.left - painted.right,
      right: painted.left - target.right,
    }[side];
    const vertical = ['left', 'right'].includes(side);
    const cornerNames = {
      top: ['BottomLeft', 'BottomRight'],
      bottom: ['TopLeft', 'TopRight'],
      left: ['TopRight', 'BottomRight'],
      right: ['TopLeft', 'BottomLeft'],
    }[side];
    const axis = vertical ? 'y' : 'x';
    const start = vertical ? paper.top : paper.left;
    const end = vertical ? paper.bottom : paper.right;
    const margins = [
      Math.min(...corners.map((p) => p[axis])) -
        start -
        parseFloat(style[`border${cornerNames[0]}Radius`]),
      end -
        Math.max(...corners.map((p) => p[axis])) -
        parseFloat(style[`border${cornerNames[1]}Radius`]),
    ];
    return { side, visible: true, clearance, focusExtent, cornerMargins: margins };
  }, anchor);
  if (!geometry.visible) {
    assert(geometry.uncentered, `${label}: only an uncentered arrow is hidden.`);
    return geometry;
  }
  assert(
    geometry.clearance >= geometry.focusExtent + 0.25,
    `${label}: painted arrow clears the trigger and its visible focus outline: ${JSON.stringify(geometry)}.`,
  );
  assert(
    geometry.cornerMargins.every((margin) => margin >= -0.5),
    `${label}: the arrow joins a straight border segment beyond both rounded corners: ${JSON.stringify(geometry)}.`,
  );
  return geometry;
}

async function verifyCompactTooltip(page, label) {
  const trigger = page.getByRole('button', { name: 'Compact help', exact: true });
  await trigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await trigger.focus();
  const popup = page.locator('.compact-tooltip');
  await popup.waitFor();
  await painted(popup);
  await verifyTooltipGeometry(popup, trigger, `${label}: compact end alignment`);
  await page.keyboard.press('Escape');
  await popup.waitFor({ state: 'hidden' });
  const edgeTrigger = page.getByRole('button', { name: 'Edge help', exact: true });
  const clampedPopup = page.locator('.clamped-tooltip');
  const original = await edgeTrigger.getAttribute('style');
  try {
    // Force viewport clamping beside a small trigger. A hidden arrow must keep its
    // measured size so repeated positioning cannot toggle between hidden and visible.
    for (const left of [17, 17.01, 17, 17.01]) {
      await edgeTrigger.evaluate((node, left) => {
        Object.assign(node.style, { position: 'fixed', left: `${left}px`, top: '180px' });
        window.dispatchEvent(new Event('resize'));
      }, left);
      await edgeTrigger.focus();
      await clampedPopup.waitFor();
      await painted(clampedPopup);
      await page.waitForTimeout(100);
      await verifyTooltipGeometry(clampedPopup, edgeTrigger, `${label}: clamped compact alignment`);
      const arrow = await clampedPopup.evaluate((node) => {
        const arrow = node.nextElementSibling;
        return {
          hidden: getComputedStyle(arrow).visibility === 'hidden',
          uncentered: arrow.hasAttribute('data-uncentered'),
          width: arrow.getBoundingClientRect().width,
        };
      });
      assert(
        arrow.uncentered && arrow.hidden && arrow.width > 0,
        `${label}: an uncentered arrow stays hidden without losing positioning geometry.`,
      );
    }
  } finally {
    await edgeTrigger.evaluate((node, original) => {
      if (original === null) node.removeAttribute('style');
      else node.setAttribute('style', original);
    }, original);
    await page.keyboard.press('Escape');
    await clampedPopup.waitFor({ state: 'hidden' });
  }
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
  await verifyTooltipSeam(tooltip, label);
  await verifyTooltipGeometry(
    tooltip,
    page.getByRole('button', { name: 'Read article help', exact: true }),
    label,
  );
}

export async function verifyNativeOverlayDirection(page, label) {
  const menuTrigger = page.getByRole('button', { name: 'Basic actions', exact: true });
  const popoverTrigger = page.getByRole('button', { name: 'Open basic popover', exact: true });
  const help = page.getByRole('button', { name: 'Read article help', exact: true });
  const originalDirection = await menuTrigger.evaluate((node) =>
    node.parentElement.getAttribute('dir'),
  );
  try {
    for (const direction of ['rtl', 'ltr']) {
      await menuTrigger.evaluate((node, dir) => (node.parentElement.dir = dir), direction);
      for (const [kind, trigger, popup] of [
        ['menu', menuTrigger, page.getByRole('menu')],
        ['popover', popoverTrigger, page.getByRole('dialog', { name: /^Basic popover:/ })],
        ['tooltip', help, page.locator('.basic-tooltip')],
      ]) {
        await page.mouse.move(0, 0);
        if (kind === 'tooltip') {
          // Re-enter with the keyboard after Escape, which suppresses the current focus session.
          await trigger.blur();
          await page.keyboard.press('Tab');
          await trigger.focus();
        } else {
          await trigger.evaluate((node) => node.scrollIntoView({ block: 'start' }));
          await trigger.click();
        }
        await popup.waitFor();
        await painted(popup);
        assert.equal(
          await popup.evaluate((node) => getComputedStyle(node).direction),
          direction,
          `${label}: ${kind} inherits its trigger's live native ${direction} direction.`,
        );
        const anchor = await trigger.boundingBox();
        const bounds = await popup.boundingBox();
        assert(
          bounds.x >= 0 && bounds.x + bounds.width <= page.viewportSize().width + 1,
          `${label}: ${kind} stays inside the viewport after its direction changes.`,
        );
        const side = await popup.evaluate((node) => node.parentElement.dataset.side);
        if (kind !== 'tooltip' && ['top', 'bottom'].includes(side)) {
          const start = direction === 'rtl' ? anchor.x + anchor.width : anchor.x;
          const left = direction === 'rtl' ? start - bounds.width : start;
          // Only compare the requested start edge when viewport collision does not clamp it.
          if (left >= 12 && left + bounds.width <= page.viewportSize().width - 12) {
            const actualStart = direction === 'rtl' ? bounds.x + bounds.width : bounds.x;
            assert(
              Math.abs(actualStart - start) <= 1,
              `${label}: ${kind} start alignment follows the ${direction} reading edge.`,
            );
          }
        }
        await page.keyboard.press('Escape');
        await popup.waitFor({ state: 'hidden' });
        await page.waitForFunction(
          (node) => document.activeElement === node,
          await trigger.elementHandle(),
        );
      }
    }
  } finally {
    await menuTrigger.evaluate((node, dir) => {
      if (dir === null) node.parentElement.removeAttribute('dir');
      else node.parentElement.setAttribute('dir', dir);
    }, originalDirection);
  }
}

export async function verifyLogicalTooltipDirection(page, label) {
  const start = page.getByRole('button', { name: 'Logical start help', exact: true });
  const original = await start.evaluate((node) => ({
    direction: node.parentElement.getAttribute('dir'),
    language: node.parentElement.getAttribute('lang'),
    documentLanguage: document.documentElement.getAttribute('lang'),
  }));
  try {
    for (const [direction, language] of [
      ['rtl', null],
      ['rtl', 'en'],
      ['ltr', 'ar'],
    ]) {
      await start.evaluate(
        (node, { direction, language }) => {
          node.parentElement.dir = direction;
          for (const element of [node.parentElement, document.documentElement]) {
            if (language === null) element.removeAttribute('lang');
            else element.setAttribute('lang', language);
          }
        },
        { direction, language },
      );
      for (const [name, selector] of [
        ['Logical start help', '.logical-start-tooltip'],
        ['Logical end help', '.logical-end-tooltip'],
      ]) {
        const trigger = page.getByRole('button', { name, exact: true });
        await page.mouse.move(0, 0);
        await trigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
        await trigger.blur();
        await page.keyboard.press('Tab');
        await trigger.focus();
        const popup = page.locator(selector);
        await popup.waitFor();
        await painted(popup);
        const geometry = await popup.evaluate((node) => {
          const arrow = node.nextElementSibling;
          const paper = node.getBoundingClientRect();
          const box = arrow.getBoundingClientRect();
          const direction = getComputedStyle(node).direction;
          const side = node.dataset.side;
          const physicalSide =
            side === 'inline-start'
              ? direction === 'rtl'
                ? 'right'
                : 'left'
              : side === 'inline-end'
                ? direction === 'rtl'
                  ? 'left'
                  : 'right'
                : side;
          const ink = getComputedStyle(arrow, '::before');
          return {
            direction,
            physicalSide,
            edgeGap:
              physicalSide === 'right'
                ? Math.abs(box.right - paper.left)
                : Math.abs(box.left - paper.right),
            borders: ['Top', 'Right', 'Bottom', 'Left'].map((side) =>
              Number(parseFloat(ink[`border${side}Width`]) > 0),
            ),
          };
        });
        assert.equal(geometry.direction, direction);
        assert(
          ['left', 'right'].includes(geometry.physicalSide) && geometry.edgeGap <= 6,
          `${label}: ${name}, dir=${direction}, lang=${language ?? 'unset'} keeps its arrow beside the actual popup edge.`,
        );
        assert.deepEqual(
          geometry.borders,
          geometry.physicalSide === 'right' ? [0, 0, 1, 1] : [1, 1, 0, 0],
          `${label}: the logical-side arrow ink points toward its trigger.`,
        );
        await verifyTooltipSeam(popup, `${label}: ${name}`);
        await verifyTooltipGeometry(popup, trigger, `${label}: ${name}`);
        await page.keyboard.press('Escape');
        await popup.waitFor({ state: 'hidden' });
        await page.waitForFunction(
          (node) => document.activeElement === node,
          await trigger.elementHandle(),
        );
      }
    }
  } finally {
    await start.evaluate((node, original) => {
      for (const [element, attribute, value] of [
        [node.parentElement, 'dir', original.direction],
        [node.parentElement, 'lang', original.language],
        [document.documentElement, 'lang', original.documentLanguage],
      ]) {
        if (value === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, value);
      }
    }, original);
  }
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
  if (theme === 'chiikawa' && [1280, 320].includes(page.viewportSize().width)) {
    await verifyCompactTooltip(page, label);
    await verifyNativeOverlayDirection(page, label);
    if (page.viewportSize().width === 1280) {
      await verifyLogicalTooltipDirection(page, label);
    }
  }
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
