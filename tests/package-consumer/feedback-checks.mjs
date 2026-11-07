import assert from 'node:assert/strict';
import { createBasicConsumerPage, openBasicConsumer } from './browser-setup.mjs';

async function textFits(locator, label) {
  const geometry = await locator.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(node);
    return {
      inlineFits: [...range.getClientRects()].every(
        (line) => line.left >= bounds.left - 1 && line.right <= bounds.right + 1,
      ),
      // Firefox's CJK fallback font box may extend above its CSS line box while
      // the actual ink fits. Scroll geometry still detects a clipped text block.
      blockFits: node.scrollHeight <= node.clientHeight + 1,
    };
  });
  assert(geometry.inlineFits, `${label}: every text line stays inside its inline bounds.`);
  assert(geometry.blockFits, `${label}: the complete text block fits its reserved height.`);
}

export async function verifyToastMirroredSpacing(page, label) {
  for (const tone of ['success', 'info', 'error']) {
    const wrapper = page.getByTestId(`feedback-toast-${tone}`);
    const originalDirection = await wrapper.getAttribute('dir');
    const spacing = {};
    try {
      for (const direction of ['ltr', 'rtl']) {
        await wrapper.evaluate((node, value) => (node.dir = value), direction);
        spacing[direction] = await wrapper.getByRole('status').evaluate((node) => {
          const bounds = node.getBoundingClientRect();
          const stamp = node.firstElementChild.getBoundingClientRect();
          const close = node.lastElementChild.getBoundingClientRect();
          const rtl = getComputedStyle(node).direction === 'rtl';
          return {
            stampStart: rtl ? bounds.right - stamp.right : stamp.left - bounds.left,
            closeEnd: rtl ? close.left - bounds.left : bounds.right - close.right,
          };
        });
      }
      assert(
        Math.abs(spacing.rtl.stampStart - spacing.ltr.stampStart) <= 0.1 &&
          Math.abs(spacing.rtl.closeEnd - spacing.ltr.closeEnd) <= 0.1,
        `${label}: ${tone} Toast mirrors its reading-edge spacing: ${JSON.stringify(spacing)}.`,
      );
    } finally {
      await wrapper.evaluate((node, original) => {
        if (original === null) node.removeAttribute('dir');
        else node.setAttribute('dir', original);
      }, originalDirection);
    }
  }
}

export async function verifySkeletonCircleSizing(page, label) {
  const samples = page.getByTestId('skeleton-circle-sizing');
  const sizes = [
    ['block-24', 24, 24],
    ['block-32', 32, 32],
    ['block-44', 44, 44],
    ['grid-24', 24, 24],
    ['grid-32', 32, 32],
    ['flex-stretch', 44, 44],
    ['flex-center', 44, 44],
    ['custom-size', 32, 20],
    ['width-only', 32, 44],
    ['style-size', 28, 18],
    ['inline-size', 32, 44],
    ['block-size', 44, 20],
  ];
  for (const [sample, width, height] of sizes) {
    const geometry = await samples.getByTestId(`skeleton-circle-${sample}`).evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const host = node.parentElement.getBoundingClientRect();
      return {
        size: [bounds.width, bounds.height],
        fits: bounds.left >= host.left - 0.1 && bounds.right <= host.right + 0.1,
        hidden: node.getAttribute('aria-hidden'),
        tabIndex: node.tabIndex,
      };
    });
    assert.deepEqual(
      geometry.size,
      [width, height],
      `${label}: ${sample} keeps its intended circle or custom dimensions.`,
    );
    assert(geometry.fits, `${label}: ${sample} stays inside its column.`);
    assert.equal(geometry.hidden, 'true');
    assert.equal(geometry.tabIndex, -1);
  }
  await samples
    .getByRole('button', { name: 'Before skeleton circles', exact: true })
    .press(
      process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit'
        ? 'Alt+Tab'
        : 'Tab',
    );
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await samples
      .getByRole('button', { name: 'After skeleton circles', exact: true })
      .elementHandle(),
  );
}

export async function verifyFeedbackAppearance(page, label) {
  await verifyToastMirroredSpacing(page, label);
  for (const id of ['feedback-long-alert', 'feedback-untitled-alert']) {
    const alert = page.getByTestId(id);
    const geometry = await alert.evaluate((node) => {
      const icon = node.querySelector('svg').getBoundingClientRect();
      const body = node.lastElementChild;
      const first = body.firstElementChild;
      const content = first.getBoundingClientRect();
      return {
        iconWidth: icon.width,
        iconHeight: icon.height,
        firstLineOffset:
          icon.y +
          icon.height / 2 -
          (content.y + parseFloat(getComputedStyle(first).lineHeight) / 2),
        separate:
          getComputedStyle(node).direction === 'rtl'
            ? content.right <= icon.left
            : icon.right <= content.left,
        fits: node.scrollWidth <= node.clientWidth + 1,
      };
    });
    assert.equal(geometry.iconWidth, 24);
    assert.equal(geometry.iconHeight, 24);
    assert(Math.abs(geometry.firstLineOffset) <= 1, `${label}: Alert icon follows its first line.`);
    assert(geometry.separate && geometry.fits, `${label}: Alert content keeps its reading space.`);
    for (const child of await alert.locator(':scope > div > *').all()) await textFits(child, label);
  }
  assert.equal(await page.getByTestId('feedback-untitled-alert').locator('p').count(), 0);

  for (const tone of ['success', 'info', 'error']) {
    const toast = page.getByTestId(`feedback-toast-${tone}`).getByRole('status');
    const geometry = await toast.evaluate((node) => {
      const icon = node.firstElementChild.getBoundingClientRect();
      const title = node.querySelector('p');
      const heading = title.getBoundingClientRect();
      const close = node.lastElementChild.getBoundingClientRect();
      const firstLine = heading.y + parseFloat(getComputedStyle(title).lineHeight) / 2;
      const action = node.querySelector('p').parentElement.lastElementChild;
      const probe = document.createElement('span');
      probe.style.color = 'var(--yahha-paper-line)';
      node.append(probe);
      const paperLine = getComputedStyle(probe).color;
      probe.remove();
      return {
        icon: [icon.width, icon.height],
        close: [close.width, close.height],
        iconOffset: Math.abs(icon.y + icon.height / 2 - firstLine),
        closeOffset: Math.abs(close.y + close.height / 2 - firstLine),
        separate:
          getComputedStyle(node).direction === 'rtl'
            ? close.right <= heading.left + 1 && heading.right <= icon.left
            : icon.right <= heading.left && heading.right <= close.left + 1,
        fits: node.scrollWidth <= node.clientWidth + 1,
        actionLine: [
          getComputedStyle(action).borderTopStyle,
          getComputedStyle(action).borderTopColor,
        ],
        paperLine,
      };
    });
    assert.deepEqual(geometry.icon, [30, 30], `${label}: Toast keeps its status stamp.`);
    assert.deepEqual(geometry.close, [44, 44], `${label}: Toast close target remains 44px.`);
    assert(
      geometry.iconOffset < 1 && geometry.closeOffset < 1,
      `${label}: Toast controls follow the first title line.`,
    );
    assert(
      geometry.separate && geometry.fits,
      `${label}: Toast title and close target do not overlap.`,
    );
    assert.deepEqual(geometry.actionLine, ['dashed', geometry.paperLine]);
    for (const paragraph of await toast.locator('p').all()) await textFits(paragraph, label);
    await textFits(toast.getByRole('button', { name: '重新查看这篇手记和保存结果' }), label);
  }

  const empty = page.getByTestId('feedback-empty');
  const emptyBounds = await empty.evaluate((node) => node.getBoundingClientRect().toJSON());
  const buttons = empty.getByRole('button');
  for (const target of await buttons.all()) {
    const bounds = await target.evaluate((node) => node.getBoundingClientRect().toJSON());
    assert(
      bounds.height >= 44 && bounds.width >= 44,
      `${label}: EmptyState keeps full action targets.`,
    );
    assert(
      bounds.x >= emptyBounds.x && bounds.x + bounds.width <= emptyBounds.x + emptyBounds.width + 1,
      `${label}: EmptyState actions wrap inside the column.`,
    );
    await textFits(target, label);
  }
  await textFits(empty.getByRole('heading'), label);
  await textFits(empty.locator('p'), label);

  const toast = page.getByTestId('feedback-toast-success').getByRole('status');
  const close = toast.getByRole('button', { name: '关闭提示' });
  await close.scrollIntoViewIfNeeded();
  assert(
    await close.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return [
        [box.left + 2, box.y + box.height / 2],
        [box.right - 2, box.y + box.height / 2],
        [box.x + box.width / 2, box.top + 2],
        [box.x + box.width / 2, box.bottom - 2],
      ].every(([x, y]) => node.contains(document.elementFromPoint(x, y)));
    }),
    `${label}: the visible close target is reachable across its 44px bounds.`,
  );
  await toast.getByRole('button', { name: '重新查看这篇手记和保存结果' }).focus();
  // macOS WebKit's native Tab setting skips buttons; Option+Tab includes them.
  await page.keyboard.press(
    process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit'
      ? 'Alt+Tab'
      : 'Tab',
  );
  assert(await close.evaluate((node) => node === document.activeElement));
  await page.keyboard.press('Enter');
  assert.equal(
    await toast.count(),
    0,
    'The consumer can close the controlled receipt from its keyboard target.',
  );
  await page.getByRole('button', { name: 'Restore feedback receipts' }).click();
  await verifySkeletonCircleSizing(page, label);
}

async function verifyLoadingMark(page) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [size, pixels] of [
    ['sm', 16],
    ['md', 24],
    ['lg', 36],
  ]) {
    const spinner = page.getByTestId(`feedback-spinner-${size}`);
    const geometry = await spinner.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const animations = node.getAnimations({ subtree: true });
      const samples = [];
      for (const time of [0, 192, 384, 576, 780, 1200]) {
        for (const animation of animations) {
          animation.pause();
          animation.currentTime = time + animation.effect.getTiming().delay;
        }
        samples.push(
          [...node.querySelector('[aria-hidden="true"]').children].every((dot) => {
            const box = dot.getBoundingClientRect();
            return (
              box.left >= bounds.left &&
              box.right <= bounds.right &&
              box.top >= bounds.top &&
              box.bottom <= bounds.bottom
            );
          }),
        );
      }
      return {
        size: [bounds.width, bounds.height],
        count: animations.length,
        inside: samples.every(Boolean),
      };
    });
    assert.deepEqual(geometry.size, [pixels, pixels]);
    assert.equal(geometry.count, 3);
    assert(geometry.inside, `${size}: animated loading dots remain inside their reserved frame.`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await page
      .getByTestId('feedback-samples')
      .evaluate((node) => node.getAnimations({ subtree: true }).length),
    0,
    'Reduced motion keeps feedback marks static.',
  );
}

export async function verifyFeedback(browser, url) {
  for (const width of [1280, 390, 320]) {
    const { page, errors } = await createBasicConsumerPage(browser, width);
    try {
      await openBasicConsumer(page, url);
      for (const theme of ['pink', 'blue', 'yellow']) {
        await page.getByRole('combobox', { name: 'Basic preview theme' }).selectOption(theme);
        await verifyFeedbackAppearance(page, `${theme} ${width}px`);
      }
      await verifyLoadingMark(page);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
        'Feedback content must not create page overflow.',
      );
      assert.deepEqual(errors, [], 'Installed feedback consumer emitted browser errors.');
      console.log(
        `Feedback package: all themes, long content, first-line geometry and loading frames passed at ${width}px.`,
      );
    } finally {
      await page.close();
    }
  }
}
