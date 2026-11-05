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
    let transparent = 0;
    let left = canvas.width;
    let top = canvas.height;
    let right = -1;
    let bottom = -1;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const offset = (y * canvas.width + x) * 4;
        const channels = [data[offset], data[offset + 1], data[offset + 2]];
        if (data[offset + 3] === 0) transparent++;
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
      transparentRatio: transparent / (canvas.width * canvas.height),
      cornerAlpha: [
        data[3],
        data[(canvas.width - 1) * 4 + 3],
        data[(canvas.height - 1) * canvas.width * 4 + 3],
        data[data.length - 1],
      ],
      inkWidth: Math.max(0, right - left + 1),
      inkHeight: Math.max(0, bottom - top + 1),
    };
  }, source);
}

function requireTransparency(content, label) {
  assert.ok(
    content.transparentRatio > 0.1,
    `${label} must have a genuinely transparent background, not an opaque or white canvas.`,
  );
  assert.deepEqual(content.cornerAlpha, [0, 0, 0, 0], `${label} corners must be transparent.`);
}

function requireDeployedAsset(source, baseURL) {
  const url = new URL(source);
  const base = new URL(baseURL);
  assert.equal(url.origin, base.origin, 'Brand assets must load from the deployed site.');
  assert.ok(url.pathname.startsWith(base.pathname), 'Brand assets must survive nested deployment.');
  return url;
}

async function verifyLogoAsset(page, source, baseURL) {
  requireDeployedAsset(source, baseURL);
  const logoResponse = await page.request.get(source);
  assert.equal(logoResponse.ok(), true, 'The deployed logo must be retrievable.');
  const logoContent = await colorContent(page, source);
  requireTransparency(logoContent, 'The logo');
  assert.ok(
    Math.abs(logoContent.width / logoContent.height - 847 / 280) < 0.001,
    'The logo must preserve the approved horizontal proportions.',
  );
  assert.match(
    logoResponse.headers()['content-type'] ?? '',
    /^image\/svg\+xml(?:;|$)/,
    'The displayed logo must use a scalable SVG asset.',
  );
  const logoMarkup = await logoResponse.text();
  const vector = await page.evaluate((markup) => {
    const document = new DOMParser().parseFromString(markup, 'image/svg+xml');
    return {
      valid:
        !document.querySelector('parsererror') &&
        document.documentElement.localName === 'svg' &&
        document.documentElement.namespaceURI === 'http://www.w3.org/2000/svg',
      paths: [...document.querySelectorAll('path')].filter((path) => path.getAttribute('d')?.trim())
        .length,
      raster: !!document.querySelector('image, feImage'),
      text: !!document.querySelector('text, tspan, textPath, font, font-face, foreignObject'),
    };
  }, logoMarkup);
  assert.equal(vector.valid, true, 'The logo response must contain a valid SVG document.');
  assert.ok(vector.paths > 0, 'The logo artwork and lettering must use real vector paths.');
  assert.equal(vector.raster, false, 'The SVG logo must not embed raster images.');
  assert.doesNotMatch(logoMarkup, /data:image\//i, 'The SVG logo must not wrap image data.');
  assert.equal(vector.text, false, 'The SVG logo must not depend on text or installed fonts.');
  assert.doesNotMatch(logoMarkup, /@font-face\b/i, 'The SVG logo must not load fonts.');
  assert.ok(
    (await logoResponse.body()).length <= 512 * 1024,
    'The logo must be an independent asset, not a full candidate board larger than 512 KiB.',
  );
}

async function waitForBrandIdle(page) {
  await page.waitForFunction(
    () => document.querySelector('.brand-logo')?.dataset.motionState === 'idle',
    null,
    { timeout: 5000 },
  );
}

async function motionStatus(page) {
  return page.locator('.brand-logo').evaluate((element) => ({
    state: element.dataset.motionState,
    variant: element.dataset.motionVariant,
    starts: window.__brandMotionStarts.slice(),
    animations: element
      .getAnimations({ subtree: true })
      .filter((animation) => animation.playState === 'running').length,
  }));
}

async function createMotionPage(browser, baseURL, options = {}, randomValue) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
    ...options,
  });
  await context.addInitScript(() => {
    window.__brandMotionStarts = [];
    new MutationObserver((records) => {
      for (const record of records) {
        const element = record.target;
        if (
          record.attributeName === 'data-motion-state' &&
          record.oldValue !== 'playing' &&
          element.matches('.brand-logo') &&
          element.dataset.motionState === 'playing'
        ) {
          window.__brandMotionStarts.push(element.dataset.motionVariant);
        }
      }
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-motion-state'],
    });
  });
  if (randomValue !== undefined) {
    await context.addInitScript((value) => {
      Math.random = () => value;
    }, randomValue);
  }
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseURL}#/`);
  return { context, page, errors };
}

/** Check actual entry/hover motion, interruption and reduced-motion behavior. */
export async function verifyBrandMotion(browser, baseURL) {
  // Fixed random inputs exercise the approved pool without a flaky probability test.
  const entryVariants = new Set();
  for (const value of [0.01, 0.26, 0.51, 0.99]) {
    const sample = await createMotionPage(browser, baseURL, {}, value);
    try {
      await sample.page.waitForFunction(() => window.__brandMotionStarts.length === 1, null, {
        timeout: 5000,
      });
      entryVariants.add((await motionStatus(sample.page)).starts[0]);
      assert.deepEqual(sample.errors, []);
    } finally {
      await sample.context.close();
    }
  }
  assert.deepEqual([...entryVariants].sort(), ['A', 'B', 'C', 'D']);

  const { context, page, errors } = await createMotionPage(browser, baseURL);
  try {
    const brand = page.getByRole('link', { name: 'Yahha UI 首页', exact: true });
    await page.waitForFunction(() => window.__brandMotionStarts.length === 1, null, {
      timeout: 5000,
    });
    const entry = await motionStatus(page);
    assert.ok(
      ['A', 'B', 'C', 'D'].includes(entry.starts[0]),
      'Entry must choose an approved motion.',
    );
    await waitForBrandIdle(page);
    assert.equal((await motionStatus(page)).animations, 0, 'Entry motion must finish completely.');

    // Observe a complete second animation window to catch an accidental idle loop.
    await page.waitForTimeout(1900);
    assert.equal((await motionStatus(page)).starts.length, 1, 'Entry must play once, not loop.');
    const beforeHover = await motionStatus(page);
    await brand.hover();
    await page.waitForFunction(() => window.__brandMotionStarts.length === 2, null, {
      timeout: 1000,
    });
    const hover = await motionStatus(page);
    assert.notEqual(
      hover.variant,
      beforeHover.variant,
      'A fresh hover should choose a different approved motion from the one just played.',
    );
    assert.ok(['A', 'B', 'C', 'D'].includes(hover.variant));
    assert.ok(hover.animations > 0, 'Hover must animate the displayed symbol.');
    assert.equal(
      await page.locator('.brand-logo-motion').locator('[id$="wordmark"]').count(),
      0,
      'The animated overlay must not contain or move the wordmark.',
    );

    // Rapid mouse re-entry while already playing must not restart or queue copies.
    await brand.dispatchEvent('pointerleave', { pointerType: 'mouse' });
    await brand.dispatchEvent('pointerenter', { pointerType: 'mouse' });
    await brand.dispatchEvent('pointerleave', { pointerType: 'mouse' });
    await brand.dispatchEvent('pointerenter', { pointerType: 'mouse' });
    assert.equal(
      (await motionStatus(page)).starts.length,
      2,
      'Busy hover must not stack animations.',
    );
    await waitForBrandIdle(page);
    assert.equal((await motionStatus(page)).animations, 0);
    assert.equal(
      (await motionStatus(page)).starts.length,
      2,
      'Ignored hovers must not replay later.',
    );

    // Enabling the OS preference during a live motion must restore the static original.
    await page.mouse.move(0, 0);
    await brand.hover();
    await page.waitForFunction(() => window.__brandMotionStarts.length === 3, null, {
      timeout: 1000,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await waitForBrandIdle(page);
    assert.equal(
      (await motionStatus(page)).animations,
      0,
      'Reduced motion must cancel an active run.',
    );
    await page.mouse.move(0, 0);
    await brand.hover();
    assert.equal(
      (await motionStatus(page)).starts.length,
      3,
      'Reduced motion must suppress hover.',
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.mouse.move(0, 0);
    await brand.hover();
    await page.waitForFunction(() => window.__brandMotionStarts.length === 4, null, {
      timeout: 1000,
    });
    await waitForBrandIdle(page);

    const beforeNavigation = (await motionStatus(page)).starts.length;
    const guide = page.locator('.header-links a').filter({ hasText: '开始使用' }).first();
    const destination = await guide.getAttribute('href');
    await guide.click();
    await page.waitForFunction((hash) => location.hash === hash, destination);
    assert.equal(
      (await motionStatus(page)).starts.length,
      beforeNavigation,
      'Internal hash navigation must not be treated as a new site entry.',
    );
    assert.equal(await brand.getAttribute('href'), '#/', 'Motion must preserve the home link.');
    await page.evaluate(() => {
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    });
    await page.waitForFunction(
      (count) => window.__brandMotionStarts.length === count + 1,
      beforeNavigation,
      { timeout: 1000 },
    );
    await waitForBrandIdle(page);
    assert.equal(
      (await motionStatus(page)).animations,
      0,
      'A restored page must also settle after one run.',
    );
    assert.deepEqual(errors, [], 'Brand motion must not introduce browser runtime errors.');
  } finally {
    await context.close();
  }

  const reduced = await createMotionPage(browser, baseURL, { reducedMotion: 'reduce' });
  try {
    await waitForBrandIdle(reduced.page);
    await reduced.page.getByRole('link', { name: 'Yahha UI 首页', exact: true }).hover();
    const status = await motionStatus(reduced.page);
    assert.equal(status.starts.length, 0, 'Reduced-motion entry and hover must remain static.');
    assert.equal(status.animations, 0);
    assert.deepEqual(reduced.errors, []);
  } finally {
    await reduced.context.close();
  }

  const touch = await createMotionPage(browser, baseURL, {
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  try {
    await touch.page.waitForFunction(() => window.__brandMotionStarts.length === 1, null, {
      timeout: 5000,
    });
    await waitForBrandIdle(touch.page);
    await touch.page.getByRole('link', { name: 'Yahha UI 首页', exact: true }).tap();
    const status = await motionStatus(touch.page);
    assert.equal(status.starts.length, 1, 'A touch tap must not synthesize a hover replay.');
    assert.equal(status.animations, 0);
    assert.deepEqual(touch.errors, []);
  } finally {
    await touch.context.close();
  }
}

async function compareBrandPixels(page, rest, motion) {
  return page.evaluate(
    async (sources) => {
      const frames = [];
      for (const source of sources) {
        const image = new Image();
        image.src = source;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        frames.push(context.getImageData(0, 0, canvas.width, canvas.height));
      }
      const [before, after] = frames;
      if (before.width !== after.width || before.height !== after.height) {
        throw new Error(
          'Starting or finishing brand motion changed its rendered image dimensions.',
        );
      }
      const { width, height } = before;
      const bottomRows = ({ data }) => {
        let shadowBottom = -1;
        let darkBottom = -1;
        // Inspect visible pixels, not SVG/CSS rectangles: the original bug kept identical geometry.
        for (let y = Math.floor(height * 0.7) + 1; y < height; y++) {
          for (let x = 0; x < (width * 280) / 847; x++) {
            const offset = (y * width + x) * 4;
            const minimum = Math.min(data[offset], data[offset + 1], data[offset + 2]);
            if (minimum < 245) shadowBottom = y;
            if (minimum < 160) darkBottom = y;
          }
        }
        return { shadowBottom, darkBottom };
      };
      let wordmarkDiffPixels = 0;
      for (let y = 0; y < height; y++) {
        for (let x = Math.ceil((width * 280) / 847); x < width; x++) {
          const offset = (y * width + x) * 4;
          if (
            before.data[offset] !== after.data[offset] ||
            before.data[offset + 1] !== after.data[offset + 1] ||
            before.data[offset + 2] !== after.data[offset + 2] ||
            before.data[offset + 3] !== after.data[offset + 3]
          ) {
            wordmarkDiffPixels++;
          }
        }
      }
      return {
        width,
        height,
        rest: bottomRows(before),
        motion: bottomRows(after),
        wordmarkDiffPixels,
      };
    },
    [rest, motion].map((buffer) => `data:image/png;base64,${buffer.toString('base64')}`),
  );
}

/** Catch subpixel raster shifts between a resting logo and neutral motion frames. */
export async function verifyBrandAlignment(browser, baseURL) {
  const results = [];
  for (const width of [1440, 390]) {
    for (const deviceScaleFactor of [1, 2]) {
      const { context, page, errors } = await createMotionPage(browser, baseURL, {
        viewport: { width, height: 900 },
        deviceScaleFactor,
      });
      try {
        await page.waitForFunction(() => window.__brandMotionStarts.length === 1, null, {
          timeout: 5000,
        });
        await waitForBrandIdle(page);
        const logo = page.locator('.brand-logo');
        await logo.locator('img').evaluate((image) => image.decode());
        const rest = await logo.screenshot({ animations: 'allow' });
        await page.getByRole('link', { name: 'Yahha UI 首页', exact: true }).hover();
        await page.waitForFunction(
          () => document.querySelector('.brand-logo')?.dataset.motionState === 'playing',
          null,
          { timeout: 1000 },
        );
        for (const position of ['first', 'last']) {
          await logo.evaluate(async (element, frame) => {
            const animations = element.getAnimations({ subtree: true });
            if (!animations.length)
              throw new Error('Hover did not create brand motion to inspect.');
            for (const animation of animations) animation.pause();
            await Promise.all(animations.map((animation) => animation.ready));
            for (const animation of animations) {
              const duration = animation.effect.getTiming().duration;
              if (typeof duration !== 'number')
                throw new Error('Brand motion needs a finite duration.');
              animation.currentTime = frame === 'first' ? 0 : duration - 0.01;
            }
            await new Promise(requestAnimationFrame);
            await new Promise(requestAnimationFrame);
          }, position);
          const pixels = await compareBrandPixels(
            page,
            rest,
            await logo.screenshot({ animations: 'allow' }),
          );
          const label = `${width}px / DPR ${deviceScaleFactor} / ${position} neutral frame`;
          assert.ok(pixels.rest.darkBottom >= 0, `${label}: the symbol outline must be visible.`);
          assert.ok(
            pixels.rest.shadowBottom > pixels.rest.darkBottom,
            `${label}: the original shallow shadow must be included in the inspection.`,
          );
          assert.deepEqual(
            pixels.motion,
            pixels.rest,
            `${label}: visible outline and shadow must not move when motion starts or finishes.`,
          );
          assert.equal(
            pixels.wordmarkDiffPixels,
            0,
            `${label}: the static wordmark must keep identical pixels.`,
          );
          results.push({ viewportWidth: width, deviceScaleFactor, position, ...pixels });
        }
        assert.deepEqual(errors, [], 'Brand alignment checks must not cause browser errors.');
      } finally {
        await context.close();
      }
    }
  }
  return results;
}

/** Validate displayed branding and favicon assets against the deployed website. */
export async function verifyBrand(browser, baseURL) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/`);
    const brand = page.getByRole('link', { name: 'Yahha UI 首页', exact: true });
    const logo = brand.locator('img');
    await logo.waitFor();
    await logo.evaluate((image) => image.decode());
    await waitForBrandIdle(page);
    assert.equal(await brand.getAttribute('href'), '#/');
    assert.equal((await brand.innerText()).trim(), '', 'The approved logo has no subtitle.');

    const verifiedSources = new Set();
    for (const [forcedColors, colorScheme] of [
      ['none', 'light'],
      ['none', 'dark'],
      ['active', 'light'],
      ['active', 'dark'],
    ]) {
      await page.emulateMedia({ forcedColors, colorScheme });
      const expectedSource = await logo.evaluate((image) => {
        const sources = image.closest('picture')?.querySelectorAll('source') ?? [];
        const selected = [...sources].find(
          (source) => !source.media || matchMedia(source.media).matches,
        );
        return selected ? new URL(selected.srcset, document.baseURI).href : image.src;
      });
      await page.waitForFunction(
        ({ image, source }) => image.currentSrc === source,
        { image: await logo.elementHandle(), source: expectedSource },
        { timeout: 5000 },
      );
      await logo.evaluate((image) => image.decode());
      const source = await logo.evaluate((image) => image.currentSrc);
      if (!verifiedSources.has(source)) {
        await verifyLogoAsset(page, source, baseURL);
        verifiedSources.add(source);
      }
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
      requireTransparency(content, `The ${size}px favicon`);
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
  await verifyBrandMotion(browser, baseURL);
  await verifyBrandAlignment(browser, baseURL);
}
