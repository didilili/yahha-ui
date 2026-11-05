import assert from 'node:assert/strict';

const themes = ['pink', 'blue', 'yellow'];
const sizes = ['sm', 'md', 'lg'];
const closeTo = (actual, expected, message) =>
  assert(
    Math.abs(actual - expected) < 0.1,
    `${message}: expected ${expected}, received ${actual}.`,
  );

async function square(locator, expected, label) {
  const rect = await locator.boundingBox();
  assert(rect, `${label}: must be visible.`);
  closeTo(rect.width, expected, `${label} width`);
  closeTo(rect.height, expected, `${label} height`);
}

async function verifyScope(page, scope, theme, label, forcedColors) {
  for (const [size, dimension] of [
    ['sm', 16],
    ['md', 20],
    ['lg', 24],
    ['number', 28],
  ]) {
    await square(scope.getByTestId(`standalone-${size}`), dimension, `${label} standalone ${size}`);
  }
  for (let index = 0; index < sizes.length; index++) {
    const size = sizes[index];
    await square(
      scope.getByTestId(`host-button-${size}`).locator('svg'),
      [16, 18, 20][index],
      `${label} Button ${size} glyph`,
    );
    const iconButton = scope.getByTestId(`host-icon-button-${size}`);
    await square(iconButton, [36, 44, 52][index], `${label} IconButton ${size} target`);
    await square(
      iconButton.locator(':scope > svg'),
      [18, 20, 22][index],
      `${label} IconButton ${size} glyph`,
    );
  }
  await square(scope.getByTestId('host-field').locator('svg'), 18, `${label} TextField leading`);

  const rootRef = scope.getByTestId('root-ref');
  assert.equal(await rootRef.getAttribute('data-ref-checked'), 'svg', `${label} native SVG ref`);
  assert.equal(
    await rootRef.evaluate(
      (node) => node instanceof SVGSVGElement && node.parentElement.dataset.testid === 'ref-host',
    ),
    true,
    `${label}: ref points to the original root without a wrapper.`,
  );
  assert.equal(await rootRef.locator('svg').count(), 0, `${label}: no nested SVG.`);
  for (const [testId, name] of [
    ['named-icon', `Named icon ${theme}`],
    ['labelled-icon', `Labelled icon ${theme}`],
  ]) {
    assert.equal(
      await scope.getByRole('img', { name, exact: true }).getAttribute('data-testid'),
      testId,
    );
  }
  for (const id of ['decorative-icon', 'hidden-icon']) {
    const icon = scope.getByTestId(id);
    assert.equal(await icon.getAttribute('aria-hidden'), 'true', `${label} ${id} decoration`);
    assert.equal(await icon.getAttribute('role'), null, `${label} ${id} has no image role`);
    assert.equal(await icon.getAttribute('focusable'), 'false', `${label} ${id} unfocusable`);
  }
  assert.equal(
    await scope.getByRole('img', { name: `Hidden icon ${theme}`, exact: true }).count(),
    0,
  );

  const custom = scope.getByTestId('custom-paint');
  assert.equal(await custom.getAttribute('viewBox'), '-2 0 40 16');
  assert.equal(await custom.getAttribute('preserveAspectRatio'), 'xMinYMid meet');
  assert.equal(await custom.getAttribute('fill'), 'none');
  assert.deepEqual(
    await custom
      .locator('path')
      .evaluateAll((paths) => paths.map((path) => path.getAttribute('fill'))),
    ['#d05265', '#357ca8'],
  );
  if (!forcedColors) {
    const paintedPaths = (locator) =>
      locator
        .locator('path')
        .evaluateAll((paths) => paths.map((path) => getComputedStyle(path).fill));
    assert.deepEqual(
      await paintedPaths(custom),
      await paintedPaths(scope.getByTestId('native-paint')),
      `${label}: native multi-color paint survives.`,
    );
    const expectedTones = {
      inherit: 'rgb(73, 49, 61)',
      default: 'rgb(73, 49, 61)',
      muted: 'rgb(122, 92, 109)',
      accent: { pink: 'rgb(176, 78, 120)', blue: 'rgb(56, 109, 147)', yellow: 'rgb(137, 99, 41)' }[
        theme
      ],
      success: 'rgb(80, 106, 59)',
      warning: 'rgb(137, 99, 41)',
      error: 'rgb(163, 62, 79)',
      info: 'rgb(66, 111, 144)',
    };
    for (const [tone, expected] of Object.entries(expectedTones)) {
      const actual = await scope.getByTestId(`tone-${tone}`).evaluate((node) => {
        const css = getComputedStyle(node);
        return [css.color, css.fill];
      });
      assert.deepEqual(
        actual,
        [expected, expected],
        `${label}: ${tone} colors inherit through currentColor.`,
      );
    }
    for (const [id, expected] of [
      ['inherited-color', 'rgb(35, 94, 115)'],
      ['native-color', 'rgb(105, 60, 126)'],
    ]) {
      assert.equal(
        await scope.getByTestId(id).evaluate((node) => getComputedStyle(node).color),
        expected,
        `${label}: ${id} stays native.`,
      );
    }
  } else {
    const nativeColor = await scope
      .getByTestId('native-paint')
      .evaluate((node) => getComputedStyle(node).color);
    for (const tone of [
      'inherit',
      'default',
      'muted',
      'accent',
      'success',
      'warning',
      'error',
      'info',
    ]) {
      assert.deepEqual(
        await scope.getByTestId(`tone-${tone}`).evaluate((node) => {
          const css = getComputedStyle(node);
          return [css.color, css.fill, css.stroke];
        }),
        [nativeColor, nativeColor, nativeColor],
        `${label}: ${tone} actual SVG paint follows the surrounding system foreground.`,
      );
    }
    assert.deepEqual(
      await custom
        .locator('path')
        .evaluateAll((paths) => paths.map((path) => getComputedStyle(path).fill)),
      await scope
        .getByTestId('native-paint')
        .locator('path')
        .evaluateAll((paths) => paths.map((path) => getComputedStyle(path).fill)),
      `${label}: explicit multi-color paths retain native SVG behavior.`,
    );
  }

  const toggle = scope.getByTestId('bookmark-toggle');
  const glyph = scope.getByTestId('bookmark-toggle-glyph');
  await square(toggle, 44, `${label} bookmark target`);
  await square(glyph, 20, `${label} bookmark glyph`);
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
  assert.equal(await glyph.locator('path').first().getAttribute('fill'), 'none');
  await toggle.focus();
  await page.keyboard.press('Space');
  assert.equal(
    await toggle.getAttribute('aria-pressed'),
    'true',
    `${label}: Space toggles collection.`,
  );
  assert.equal(await scope.getByRole('status').textContent(), 'Saved');
  assert.equal(await glyph.locator('path').first().getAttribute('fill'), 'currentColor');
  assert.equal(await glyph.locator('path').first().getAttribute('fill-opacity'), '0.2');
  assert.equal(await glyph.locator('path').nth(1).getAttribute('fill'), 'none');
  for (const bookmark of [glyph, scope.getByTestId('bookmark-opaque-glyph')]) {
    const fill = await bookmark.evaluate((svg) => {
      const paths = [...svg.querySelectorAll('path')].filter(
        (path) => getComputedStyle(path).fill !== 'none',
      );
      const contains = (x, y) => paths.some((path) => path.isPointInFill(new DOMPoint(x, y)));
      return { body: contains(10, 10), fold: contains(15.8, 6.3) };
    });
    assert.deepEqual(
      fill,
      { body: true, fold: false },
      `${label}: bookmark fill covers the body and leaves the folded corner empty.`,
    );
  }
  assert.equal(
    await toggle.evaluate((node) => document.activeElement === node),
    true,
    `${label}: keyboard focus stays on the button.`,
  );
  if (forcedColors) {
    const colors = await glyph.evaluate((node) => {
      const css = getComputedStyle(node);
      const background = getComputedStyle(node.closest('button')).backgroundColor;
      return { stroke: css.stroke, background };
    });
    assert.notEqual(
      colors.stroke,
      colors.background,
      `${label}: the bookmark outline remains visible.`,
    );
  }
  await page.keyboard.press('Enter');
  assert.equal(
    await toggle.getAttribute('aria-pressed'),
    'false',
    `${label}: Enter cancels collection.`,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await scope.getByTestId('host-button-sm').evaluate((node) => document.activeElement === node),
    true,
    `${label}: SVGs add no tab stop.`,
  );
}

export async function verifyIcons(browser, baseURL) {
  const url = new URL(baseURL);
  url.searchParams.set('icons', '');
  for (const { width, forcedColors, colorScheme } of [
    { width: 1440, forcedColors: false, colorScheme: 'light' },
    { width: 390, forcedColors: false, colorScheme: 'light' },
    { width: 320, forcedColors: false, colorScheme: 'light' },
    { width: 390, forcedColors: true, colorScheme: 'light' },
    { width: 390, forcedColors: true, colorScheme: 'dark' },
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
      colorScheme,
      forcedColors: forcedColors ? 'active' : 'none',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    try {
      await page.goto(url.href);
      await page.getByRole('heading', { name: 'Installed icons consumer', exact: true }).waitFor();
      for (const theme of themes) {
        const scope = page.locator(`[data-icons-theme="${theme}"]`);
        await scope.locator('[data-testid="root-ref"][data-ref-checked="svg"]').waitFor();
        await verifyScope(
          page,
          scope,
          theme,
          `${theme} ${width}px forced=${forcedColors}`,
          forcedColors,
        );
      }
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        true,
        `${width}px: the consumer layout does not overflow.`,
      );
      assert.deepEqual(errors, [], `${width}px: no runtime or console errors.`);
    } finally {
      await context.close();
    }
  }
  console.log(
    'Package icons: three presets, native SVG/ARIA/ref, standalone and host sizes, keyboard collection and forced colors passed.',
  );
}
