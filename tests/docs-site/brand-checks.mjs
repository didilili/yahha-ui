import assert from 'node:assert/strict';

async function colorContent(page, source) {
  return page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let colorful = 0;
    let left = canvas.width;
    let top = canvas.height;
    let right = -1;
    let bottom = -1;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const offset = (y * canvas.width + x) * 4;
        const channels = [data[offset], data[offset + 1], data[offset + 2]];
        if (data[offset + 3] > 0 && Math.min(...channels) < 180) {
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        }
        if (data[offset + 3] > 0 && Math.max(...channels) - Math.min(...channels) > 20) {
          colorful++;
        }
      }
    }
    return {
      width: canvas.width,
      height: canvas.height,
      colorfulRatio: colorful / (canvas.width * canvas.height),
      inkWidth: Math.max(0, right - left + 1),
      inkHeight: Math.max(0, bottom - top + 1),
    };
  }, source);
}

function requireDeployedAsset(source, baseURL) {
  const url = new URL(source);
  const base = new URL(baseURL);
  assert.equal(url.origin, base.origin, 'Brand assets must load from the deployed site.');
  assert.ok(url.pathname.startsWith(base.pathname), 'Brand assets must survive nested deployment.');
  return url;
}

/** Validate displayed branding and favicon assets against the deployed website. */
export async function verifyBrand(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/`);
    const brand = page.getByRole('link', { name: 'Yahha UI 首页', exact: true });
    const logo = brand.locator('img');
    await logo.waitFor();
    await logo.evaluate((image) => image.decode());
    assert.equal(await brand.getAttribute('href'), '#/');
    assert.equal((await brand.innerText()).trim(), '', 'The approved logo has no subtitle.');

    for (const [forcedColors, colorScheme] of [
      ['none', 'light'],
      ['none', 'dark'],
      ['active', 'light'],
      ['active', 'dark'],
    ]) {
      await page.emulateMedia({ forcedColors, colorScheme });
      const screenshot = await logo.screenshot();
      const content = await colorContent(
        page,
        `data:image/png;base64,${screenshot.toString('base64')}`,
      );
      assert.ok(
        content.colorfulRatio > 0.04,
        `The F2 logo must remain visible in ${forcedColors} forced colors / ${colorScheme} mode.`,
      );
    }
    await page.emulateMedia({ forcedColors: 'none', colorScheme: 'light' });

    const source = await logo.evaluate((image) => image.currentSrc);
    requireDeployedAsset(source, baseURL);
    const logoResponse = await page.request.get(source);
    assert.equal(logoResponse.ok(), true, 'The deployed logo must be retrievable.');
    assert.ok(
      (await logoResponse.body()).length <= 512 * 1024,
      'The logo must be an independent asset, not a full candidate board larger than 512 KiB.',
    );

    const icons = await page.locator('link[rel~="icon"]').evaluateAll((elements) =>
      elements.map((element) => ({
        source: element.href,
        sizes: element.sizes.value.split(/\s+/),
      })),
    );
    for (const size of [16, 32]) {
      const icon = icons.find((candidate) => candidate.sizes.includes(`${size}x${size}`));
      assert.ok(icon, `The browser needs a declared ${size}px favicon.`);
      const url = requireDeployedAsset(icon.source, baseURL);
      assert.equal(url.hash, '', 'Favicon selection must not depend on an SVG fragment view.');
      const response = await page.request.get(icon.source);
      assert.equal(response.ok(), true, 'The declared favicon must load successfully.');
      assert.match(response.headers()['content-type'] ?? '', /^image\//);
      const content = await colorContent(page, icon.source);
      assert.equal(content.width, size, 'Favicon pixels must match their declared size.');
      assert.equal(content.height, size, 'Favicons must have a square canvas.');
      assert.ok(
        content.colorfulRatio > 0.04,
        'The favicon must contain the colored component symbol.',
      );
      assert.ok(
        content.inkWidth >= size * 0.65 && content.inkHeight >= size * 0.65,
        'The component symbol must fill the favicon instead of shrinking a horizontal wordmark.',
      );
    }

    for (const width of [1440, 960, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const bounds = await logo.boundingBox();
      const header = await page.locator('.docs-header').boundingBox();
      assert.ok(bounds && header);
      assert.ok(bounds.y >= header.y && bounds.y + bounds.height <= header.y + header.height);
      assert.ok(bounds.width > 0 && bounds.x + bounds.width <= width);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `The logo must not create horizontal overflow at ${width}px.`,
      );
      const target = await brand.boundingBox();
      assert.ok(
        target.width >= 44 && target.height >= 44,
        'The brand link needs a usable click target.',
      );
    }
    assert.deepEqual(
      errors,
      [],
      'Brand loading and viewport changes must not cause runtime errors.',
    );
  } finally {
    await context.close();
  }
}
