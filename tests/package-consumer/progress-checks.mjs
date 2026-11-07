import assert from 'node:assert/strict';

function contrast(first, second) {
  const luminance = (color) => {
    const channels = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number);
    return channels.reduce((sum, channel, index) => {
      const srgb = channel / 255;
      const linear = srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
      return sum + linear * [0.2126, 0.7152, 0.0722][index];
    }, 0);
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (values[1] + 0.05) / (values[0] + 0.05);
}

async function geometry(page) {
  return page.locator('[role="progressbar"][data-testid]').evaluateAll((nodes) =>
    nodes.map((node) => {
      const header = node.firstElementChild;
      const meter = node.lastElementChild;
      const track = meter.firstElementChild;
      const fill = track.firstElementChild;
      const marker = meter.querySelector('svg');
      const box = (element) => element?.getBoundingClientRect().toJSON() ?? null;
      const trackStyle = getComputedStyle(track);
      const fillStyle = getComputedStyle(fill);
      return {
        id: node.dataset.testid,
        state: node.dataset.state,
        now: node.getAttribute('aria-valuenow'),
        max: node.getAttribute('aria-valuemax'),
        valueText: node.getAttribute('aria-valuetext'),
        direction: getComputedStyle(node).direction,
        root: box(node),
        header: box(header),
        text: box(header.lastElementChild),
        meter: box(meter),
        track: box(track),
        trackInner: track.clientWidth,
        fill: box(fill),
        marker: box(marker),
        colors: {
          track: trackStyle.backgroundColor,
          contour: trackStyle.borderTopColor,
          fill: fillStyle.backgroundColor,
          fillEdge: fillStyle.boxShadow,
        },
        animations: node.getAnimations({ subtree: true }).length,
      };
    }),
  );
}

function verifyGeometry(records, label, forcedColors = false) {
  const byId = Object.fromEntries(records.map((record) => [record.id, record]));
  const plain = byId['progress-plain'];
  const bookmark = byId['progress-bookmark'];
  assert(
    Math.abs(plain.root.height - bookmark.root.height) < 0.1,
    `${label}: appearance keeps height.`,
  );
  for (const item of records) {
    const name = `${label} ${item.id}`;
    assert.equal(item.meter.height, 28, `${name}: meter reserves the complete marker height.`);
    assert.equal(item.track.height, 12, `${name}: track stays thin and read-only.`);
    assert(
      item.text.left >= item.root.left - 1 && item.text.right <= item.root.right + 1,
      `${name}: value text stays inside the progress width.`,
    );
    if (item.marker) {
      assert(
        item.marker.left >= item.meter.left - 0.5 && item.marker.right <= item.meter.right + 0.5,
        `${name}: marker stays inside both endpoints.`,
      );
      assert(
        item.marker.top >= item.meter.top - 0.5 && item.marker.bottom <= item.meter.bottom + 0.5,
        `${name}: marker stays inside its height.`,
      );
      assert(
        item.marker.top >= item.text.bottom + 7,
        `${name}: marker cannot cover the value text.`,
      );
    }
    if (item.now !== null) {
      const fraction = Number(item.now) / Number(item.max);
      assert(
        Math.abs(item.fill.width - item.trackInner * fraction) < 1,
        `${name}: painted fill matches its semantic fraction.`,
      );
      const start =
        item.direction === 'rtl'
          ? item.track.right - 1 - item.fill.right
          : item.fill.left - item.track.left - 1;
      assert(Math.abs(start) < 0.5, `${name}: fill begins at the logical start.`);
    }
    assert(
      contrast(item.colors.contour, item.colors.track) >= 3,
      `${name}: track boundary is distinguishable from its interior.`,
    );
    if (forcedColors) {
      assert(
        contrast(item.colors.fill, item.colors.track) >= 3,
        `${name}: forced-color fill remains visible.`,
      );
      assert.equal(item.animations, 0, `${name}: forced colors keep a static result.`);
    } else {
      assert(
        item.colors.fillEdge.includes(item.colors.contour),
        `${name}: pastel fill retains an ink endpoint.`,
      );
      assert(
        contrast(item.colors.contour, item.colors.fill) >= 3,
        `${name}: fill outline identifies its endpoint without darkening the pastel body.`,
      );
    }
  }
  for (const value of [0, 1, 99.9, 100]) {
    const item = byId[`progress-case-${value}`];
    assert.equal(Number(item.now), value);
    assert.equal(item.state, value === 100 ? 'complete' : 'loading');
  }
  assert.equal(byId['progress-unknown'].now, null);
  assert.equal(byId['progress-unknown'].state, 'indeterminate');
  assert.equal(byId['progress-unknown'].marker, null);
  assert.equal(byId['progress-count'].valueText, '2 / 3 read');
  return {
    progressWidth: plain.root.width,
    progressHeight: plain.root.height,
    boundaryContrast: Number(contrast(plain.colors.contour, plain.colors.track).toFixed(2)),
    fillOutlineContrast: Number(contrast(plain.colors.contour, plain.colors.fill).toFixed(2)),
  };
}

async function verifySpinnerFrames(page, animated, label) {
  for (const variant of ['dots', 'biscuit']) {
    for (const [size, pixels] of [
      ['sm', 16],
      ['md', 24],
      ['lg', 36],
    ]) {
      const spinner = page.getByTestId(`progress-spinner-${variant}-${size}`);
      assert.equal(await spinner.getAttribute('role'), 'status');
      assert.equal((await spinner.textContent()).trim(), `${variant} ${size} waiting`);
      assert.equal(await spinner.locator('[role="progressbar"], [aria-valuenow]').count(), 0);
      const result = await spinner.evaluate((node, variant) => {
        const bounds = node.getBoundingClientRect();
        const animations = node.getAnimations({ subtree: true });
        const mark = node.firstElementChild;
        let inside = true;
        const contains = (x, y, radius = 0) =>
          x - radius >= bounds.left - 0.5 &&
          x + radius <= bounds.right + 0.5 &&
          y - radius >= bounds.top - 0.5 &&
          y + radius <= bounds.bottom + 0.5;
        for (const time of [0, 200, 400, 600, 800, 1200, 1600]) {
          for (const animation of animations) {
            animation.pause();
            animation.currentTime = time + animation.effect.getTiming().delay;
          }
          if (variant === 'dots') {
            inside &&= [...mark.children].every((dot) => {
              const box = dot.getBoundingClientRect();
              return contains(box.left, box.top) && contains(box.right, box.bottom);
            });
          } else {
            // The SVG square rotates but the actual round shell stays in-frame.
            // Sample painted shell points instead of its rotated bounding square.
            const shell = mark.querySelector('[data-biscuit-shell]');
            const transform = shell.getScreenCTM();
            const radius =
              (parseFloat(getComputedStyle(shell).strokeWidth) *
                Math.hypot(transform.a, transform.b)) /
              2;
            const length = shell.getTotalLength();
            for (let index = 0; index < 96; index++) {
              const point = shell
                .getPointAtLength((length * index) / 96)
                .matrixTransform(transform);
              inside &&= contains(point.x, point.y, radius);
            }
          }
        }
        return {
          width: bounds.width,
          height: bounds.height,
          count: animations.length,
          inside,
          named: node.textContent,
        };
      }, variant);
      assert.equal(result.width, pixels, `${label} ${variant} ${size}: width.`);
      assert.equal(result.height, pixels, `${label} ${variant} ${size}: height.`);
      assert.equal(
        result.count,
        animated ? (variant === 'dots' ? 3 : 1) : 0,
        `${label} ${variant} ${size}: expected motion mode.`,
      );
      assert(
        result.inside,
        `${label} ${variant} ${size}: painted mark remains inside its reserved frame.`,
      );
    }
  }
}

export async function verifyProgress(browser, url) {
  const result = [];
  for (const width of [1280, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto(url);
      await page.getByRole('heading', { name: 'Progress package consumer' }).waitFor();
      assert.equal(
        await page.getByTestId('progress-bookmark').getAttribute('data-ref-checked'),
        'DIV',
      );
      assert.equal(
        await page
          .getByRole('progressbar', { name: 'Custom accessible upload', exact: true })
          .count(),
        1,
      );
      assert.equal(
        await page
          .getByRole('progressbar', { name: 'Externally named progress', exact: true })
          .count(),
        1,
      );
      assert.equal(
        await page.getByTestId('progress-count').textContent(),
        'Read articles2 / 3 read',
      );
      for (const theme of ['pink', 'blue', 'yellow']) {
        await page.getByRole('combobox', { name: 'Progress theme' }).selectOption(theme);
        for (const direction of ['ltr', 'rtl']) {
          if ((await page.getByTestId('progress-direction').getAttribute('dir')) !== direction)
            await page
              .getByRole('button', { name: 'Toggle progress direction', exact: true })
              .click();
          const label = `${theme} ${direction} ${width}px`;
          const snapshot = verifyGeometry(await geometry(page), label);
          result.push({ width, theme, direction, ...snapshot });
        }
      }
      const root = await page.getByTestId('progress-bookmark').elementHandle();
      await page.getByRole('button', { name: 'Toggle unknown progress', exact: true }).click();
      const unknown = page.getByTestId('progress-bookmark');
      assert.equal(await unknown.getAttribute('aria-valuenow'), null);
      assert.equal(await unknown.getAttribute('aria-valuetext'), '计算中');
      assert.equal(await unknown.locator('svg').count(), 0);
      assert.equal(
        await unknown.evaluate((node, original) => node === original, root),
        true,
        'Unknown transition retains the ref target.',
      );
      await page.getByRole('button', { name: 'Toggle unknown progress', exact: true }).click();
      await page.getByRole('spinbutton', { name: 'Progress value' }).fill('100');
      assert.equal(await unknown.getAttribute('data-state'), 'complete');
      await page.getByRole('spinbutton', { name: 'Progress value' }).fill('99.9');
      assert.equal(await unknown.getAttribute('data-state'), 'loading');
      assert((await unknown.textContent()).includes('99%'));
      await page.getByRole('button', { name: 'Toggle progress direction', exact: true }).focus();
      await page.keyboard.press('Tab');
      assert.equal(
        await page
          .getByTestId('progress-focus-after')
          .evaluate((node) => node === document.activeElement),
        true,
        'Read-only progress and decorative marks do not add tab stops.',
      );
      await verifySpinnerFrames(page, false, `${width}px reduced motion`);
      assert.equal(
        await page
          .getByTestId('progress-unknown')
          .evaluate((node) => node.getAnimations({ subtree: true }).length),
        0,
      );
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await verifySpinnerFrames(page, true, `${width}px normal motion`);
      assert.equal(
        await page
          .getByTestId('progress-unknown')
          .evaluate((node) => node.getAnimations({ subtree: true }).length),
        1,
      );
      for (const colorScheme of ['light', 'dark']) {
        await page.emulateMedia({ forcedColors: 'active', colorScheme });
        verifyGeometry(await geometry(page), `${width}px ${colorScheme} forced colors`, true);
        await verifySpinnerFrames(page, false, `${width}px ${colorScheme} forced colors`);
      }
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `${width}px: no page overflow.`,
      );
      assert.deepEqual(
        errors,
        [],
        `${width}px: installed progress consumer emitted no browser errors.`,
      );
      console.log(
        `Progress package: ${width}px, three themes, RTL, true values, naming/ref, bookmark bounds, contrast, two loading marks and accessibility modes passed.`,
      );
    } finally {
      await page.close();
    }
  }
  return result;
}
