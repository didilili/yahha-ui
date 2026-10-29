import assert from 'node:assert/strict';

export async function verifyDesktopContentsVisibility(browser, baseURL) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 280 },
    reducedMotion: 'reduce',
  });
  page.setDefaultTimeout(4000);
  try {
    for (const height of [280, 740]) {
      await page.setViewportSize({ width: 1280, height });
      await page.goto(`${baseURL}#/posts/river-evening`);
      const contents = page.getByRole('navigation', { name: '这一页的小路标', exact: true });
      const links = contents.getByRole('link');
      await links.first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await links.first().focus();
      const tab =
        process.platform === 'darwin' && browser.browserType().name() === 'webkit'
          ? 'Alt+Tab'
          : 'Tab';
      for (let index = 0; index < (await links.count()); index++) {
        if (index > 0) await page.keyboard.press(tab);
        const link = links.nth(index);
        await page.waitForFunction(
          (node) => document.activeElement === node,
          await link.elementHandle(),
        );
        await page.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        assert(
          await link.evaluate((node) => {
            const bounds = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            const outline =
              style.outlineStyle === 'none'
                ? 0
                : Math.max(0, parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset));
            return bounds.top >= outline && bounds.bottom + outline <= innerHeight;
          }),
          `1280×${height}: every contents link and its focus outline stay inside the viewport after Tab.`,
        );
      }
      if (height === 740) {
        await page.evaluate(() => scrollTo(0, 1000));
        await page.waitForFunction(
          () =>
            Math.abs(
              document.querySelector('.blog-article-sidebar').getBoundingClientRect().top - 112,
            ) <= 1,
        );
        assert.equal(
          await contents.evaluate((node) => getComputedStyle(node.parentElement).position),
          'sticky',
          'The normal desktop contents keep their sticky reading position.',
        );
      }
    }
  } finally {
    await page.close();
  }
}

export async function verifyReadingExperience(browser, baseURL) {
  await verifyDesktopContentsVisibility(browser, baseURL);
  for (const width of [320, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    page.setDefaultTimeout(4000);
    try {
      await page.goto(`${baseURL}#/posts/river-evening`);
      await page
        .getByRole('heading', { level: 1, name: '沿着河边，慢慢走', exact: true })
        .waitFor();
      const contents = page.getByRole('navigation', { name: '这一页的小路标', exact: true });
      const toggle = contents.getByRole('button', { name: '这一页的小路标', exact: true });
      await toggle.waitFor();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.equal(await contents.getByRole('link').count(), 0);
      const back = page.getByRole('link', { name: '返回手记列表', exact: true });
      assert.ok(
        (await back.boundingBox()).height >= 44,
        'The article return link has a full touch target.',
      );
      await toggle.focus();
      await toggle.press('Enter');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      const link = contents.getByRole('link').first();
      const section = new URLSearchParams((await link.getAttribute('href')).split('?')[1]).get(
        'section',
      );
      assert.ok(
        (await link.boundingBox()).height >= 44,
        'Mobile contents links have separate touch targets.',
      );
      await link.click();
      await page.waitForFunction(
        (id) => document.activeElement?.id === `article-section-${id}`,
        section,
      );
      await page.reload();
      await page.waitForFunction(
        (id) => document.activeElement?.id === `article-section-${id}`,
        section,
      );
      assert.equal(
        await toggle.getAttribute('aria-expanded'),
        'false',
        'Deep links work with collapsed contents.',
      );
      await toggle.focus();
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.waitForFunction(() => document.activeElement?.id === 'article-toc-heading');
      assert.equal(await contents.getByRole('button').count(), 0);
      assert.equal(await contents.getByRole('link').count(), 3);
      await contents.getByRole('link').first().focus();
      await page.setViewportSize({ width, height: 844 });
      await page.waitForFunction(
        () => document.activeElement?.getAttribute('aria-expanded') === 'false',
      );
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    } finally {
      await context.close();
    }
  }
  console.log(
    'Blog: mobile contents use the public Accordion, keyboard/deep links and responsive focus work, and navigation targets remain at least 44px.',
  );
}
