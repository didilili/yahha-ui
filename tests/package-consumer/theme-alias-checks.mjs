import assert from 'node:assert/strict';

export async function verifyThemeAliases(browser, baseURL) {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const url = new URL(baseURL);
  url.searchParams.set('theme-aliases', '');
  try {
    await page.goto(url.href);
    await page.getByRole('heading', { name: 'Theme alias consumer' }).waitFor();
    for (const [canonical, legacy, background] of [
      ['pink', 'chiikawa', 'rgb(255, 195, 217)'],
      ['blue', 'hachiware', 'rgb(215, 234, 245)'],
      ['yellow', 'usagi', 'rgb(248, 229, 167)'],
    ]) {
      const colors = [];
      for (const name of [canonical, legacy]) {
        const scope = page.locator(`.theme-alias-${name}`);
        assert.equal(
          await scope.getAttribute('data-yahha-theme'),
          canonical,
          `${name}: root normalizes its theme value.`,
        );
        const trigger = scope.getByTestId(`theme-alias-trigger-${name}`);
        await page.mouse.move(0, 0);
        colors.push(
          await trigger.evaluate((node) => {
            const style = getComputedStyle(node);
            return [style.backgroundColor, style.color, style.borderColor];
          }),
        );
        assert.equal(
          colors.at(-1)[0],
          background,
          `${name}: the installed preset keeps its accent.`,
        );
        await trigger.click();
        const dialog = page.getByRole('dialog', { name: `Theme alias ${name}`, exact: true });
        await dialog.waitFor({ state: 'visible' });
        assert.equal(
          await dialog.evaluate((node) =>
            node.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme'),
          ),
          canonical,
          `${name}: its portal carries the canonical value.`,
        );
        assert.equal(
          await dialog
            .getByTestId(`theme-alias-probe-${name}`)
            .evaluate((node) => getComputedStyle(node).backgroundColor),
          background,
          `${name}: its portal keeps the matching computed accent.`,
        );
        await dialog.getByRole('button', { name: 'Close theme alias dialog', exact: true }).click();
        await dialog.waitFor({ state: 'hidden' });
      }
      assert.deepEqual(
        colors[0],
        colors[1],
        `${canonical}/${legacy}: computed colors are identical.`,
      );
    }

    const runtime = page.locator('.theme-alias-runtime');
    assert.equal(await runtime.getAttribute('data-yahha-theme'), 'blue');
    await runtime.getByRole('button', { name: 'Open runtime alias dialog', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Runtime theme alias dialog', exact: true });
    await dialog.waitFor({ state: 'visible' });
    const select = dialog.getByRole('combobox', { name: 'Alias controlled choice', exact: true });
    await select.click();
    const listbox = page.getByRole('listbox');
    await listbox.waitFor({ state: 'visible' });
    assert.equal(
      await listbox.evaluate((node) =>
        node.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme'),
      ),
      'blue',
      'The controlled Select portal uses the canonical theme too.',
    );
    await page.getByRole('option', { name: 'Second alias choice', exact: true }).click();
    await listbox.waitFor({ state: 'hidden' });
    assert.equal(await runtime.getByTestId('theme-alias-value').textContent(), 'second');
    assert.equal(
      await dialog.evaluate((node) => getComputedStyle(node).backgroundColor),
      'rgb(250, 245, 232)',
    );
    await dialog.getByRole('button', { name: 'Update alias tokens', exact: true }).click();
    for (const spelling of ['hachiware', 'blue']) {
      await dialog.getByRole('button', { name: 'Switch alias spelling', exact: true }).click();
      assert.equal(await runtime.getByTestId('theme-alias-spelling').textContent(), spelling);
      assert.equal(await runtime.getAttribute('data-yahha-theme'), 'blue');
      assert.equal(
        await dialog.evaluate((node) =>
          node.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme'),
        ),
        'blue',
      );
      assert.equal(await runtime.getByTestId('theme-alias-value').textContent(), 'second');
      assert.match(await select.textContent(), /Second alias choice/);
      assert.equal(
        await dialog
          .getByTestId('theme-alias-runtime-probe')
          .evaluate((node) => getComputedStyle(node).backgroundColor),
        'rgb(224, 201, 242)',
        `${spelling}: the open portal retains updated custom tokens.`,
      );
      await select.click();
      await listbox.waitFor({ state: 'visible' });
      assert.equal(
        await listbox.evaluate((node) => {
          const scope = node.closest('[data-yahha-theme]');
          return `${scope?.getAttribute('data-yahha-theme')}:${getComputedStyle(node).getPropertyValue('--yahha-accent').trim()}`;
        }),
        'blue:#e0c9f2',
        'A reopened selection portal receives both normalized theme and current custom tokens.',
      );
      assert.equal(
        await page
          .getByRole('option', { name: 'Second alias choice', exact: true })
          .getAttribute('aria-selected'),
        'true',
      );
      await page.keyboard.press('Escape');
      await listbox.waitFor({ state: 'hidden' });
    }
    await dialog.getByRole('button', { name: 'Close runtime alias dialog', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    assert.deepEqual(errors, []);
    console.log(
      'Package theme aliases: six typed values, matching presets, canonical portals and controlled state/token updates passed.',
    );
  } finally {
    await page.close();
  }
}
