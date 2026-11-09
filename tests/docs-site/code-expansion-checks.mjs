import assert from 'node:assert/strict';
import { componentCatalog } from '../../playground/src/docs/component-catalog.ts';

const allSourceToggle = (page) =>
  page.getByRole('button', { name: /^(展开|收起)全部代码$/, exact: true });

async function requireSources(page, expected) {
  const sources = page.locator('.component-source');
  const count = await sources.count();
  assert(count > 0, 'The component page has example source blocks.');
  const values = Array.isArray(expected) ? expected : Array(count).fill(expected);
  assert.equal(count, values.length);
  await page.waitForFunction((expanded) => {
    const sources = [...document.querySelectorAll('.component-source')];
    return (
      sources.length === expanded.length &&
      sources.every((source, index) => {
        const toggles = source.querySelectorAll('button[aria-expanded][aria-controls]');
        const toggle = toggles[0];
        const body = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
        return (
          toggles.length === 1 &&
          toggle.getAttribute('aria-expanded') === String(expanded[index]) &&
          body?.hidden === !expanded[index]
        );
      })
    );
  }, values);
  await page
    .getByRole('button', {
      name: values.every(Boolean) ? '收起全部代码' : '展开全部代码',
      exact: true,
    })
    .waitFor();
}

async function setupStates(page) {
  return page.locator('.example-setup').evaluateAll((details) => details.map((node) => node.open));
}

async function requireFocus(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

/** A component page provides one control beside its examples heading. */
export async function verifyCodeExpansionEntry(page) {
  const componentId = /^#\/components\/([^?]+)/.exec(new URL(page.url()).hash)?.[1];
  const component = componentCatalog.find((item) => item.id === componentId);
  assert(component, 'The expansion entry is checked on a registered component page.');
  await page
    .getByRole('heading', {
      level: 1,
      name: [component.name, component.chinese].filter(Boolean).join(' '),
      exact: true,
    })
    .waitFor();
  await page.locator('#examples').waitFor();
  assert.equal(
    await page.getByRole('button', { name: '展开全部代码', exact: true }).count(),
    1,
    'Every component page has one expand-all source control.',
  );
  assert.equal(await allSourceToggle(page).count(), 1);
  assert.equal(
    await allSourceToggle(page).evaluate((node) => !!node.parentElement.querySelector('#examples')),
    true,
    'The page-wide control appears beside the examples heading.',
  );
  await requireSources(page, false);
  assert(
    (await setupStates(page)).every((open) => !open),
    'Full setup starts independently closed.',
  );
}

/** Exercise the shared control through real source, setup, editing, clipboard and route state. */
export async function verifyCodeExpansion(page, baseURL, widths = [1440, 320, 390]) {
  const originalViewport = page.viewportSize();
  const results = [];
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseURL}#/components/input?section=examples`);
      await verifyCodeExpansionEntry(page);
      const sources = page.locator('.component-source');
      const count = await sources.count();
      assert(count > 1, 'Independent source toggles can form a mixed state.');
      const first = sources.first();
      const input = page
        .locator('#basic .example-preview')
        .getByRole('textbox', { name: '博客名称', exact: true });
      const draft = `未提交的博客名称 ${width}`;
      await input.fill(draft);
      const originalInput = await input.elementHandle();
      const importCode = page.locator('.doc-heading .source-code pre');
      const importText = await importCode.textContent();
      const setup = page.locator('#basic .example-setup');
      const entry = setup.locator('.example-entry pre');
      const entryText = await entry.textContent();
      const originalEntry = await entry.elementHandle();
      try {
        await first.getByRole('button', { name: '展开代码', exact: true }).click();
        await requireSources(page, [true, ...Array(count - 1).fill(false)]);
        await allSourceToggle(page).focus();
        await allSourceToggle(page).press('Enter');
        await requireSources(page, true);
        await requireFocus(page, allSourceToggle(page));
        await first.getByRole('button', { name: '收起代码', exact: true }).click();
        await requireSources(page, [false, ...Array(count - 1).fill(true)]);

        await setup.locator(':scope > summary').click();
        const openSetups = await setupStates(page);
        assert.equal(openSetups.filter(Boolean).length, 1);
        await allSourceToggle(page).click();
        await requireSources(page, true);
        assert.deepEqual(await setupStates(page), openSetups);
        await allSourceToggle(page).click();
        await requireSources(page, false);
        assert.deepEqual(await setupStates(page), openSetups);
        assert.equal(
          await entry.isVisible(),
          true,
          'Global source collapse leaves the open App entry visible.',
        );
        assert.equal(await entry.textContent(), entryText);
        assert.equal(
          await entry.evaluate((node, original) => node === original, originalEntry),
          true,
        );
        assert.equal(await importCode.isVisible(), true);
        assert.equal(await importCode.textContent(), importText);
        assert.equal(await input.inputValue(), draft);
        assert.equal(
          await input.evaluate((node, original) => node === original, originalInput),
          true,
          'Global expansion changes do not remount an interactive preview.',
        );
        await setup.locator(':scope > summary').click();
        const closedSetups = await setupStates(page);

        await page.evaluate(() => {
          window.__codeExpansionClipboardDescriptor = Object.getOwnPropertyDescriptor(
            navigator,
            'clipboard',
          );
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async () => {
                throw new DOMException('Denied', 'NotAllowedError');
              },
            },
          });
        });
        try {
          await first.getByRole('button', { name: '复制代码', exact: true }).click();
          const manual = first.getByRole('textbox', { name: '手动复制代码', exact: true });
          await manual.waitFor();
          await requireFocus(page, manual);
          const source = await first.locator('pre').innerText();
          assert.equal(await manual.inputValue(), source);
          assert.equal(await manual.getAttribute('readonly'), '');
          assert.deepEqual(
            await manual.evaluate((node) => [node.selectionStart, node.selectionEnd]),
            [0, source.length],
          );
          await requireSources(page, [true, ...Array(count - 1).fill(false)]);
          assert.deepEqual(await setupStates(page), closedSetups);
          await page.goto(`${baseURL}#/components/input?section=api`);
          await page.locator('#api').waitFor();
          await requireSources(page, [true, ...Array(count - 1).fill(false)]);
          assert.equal(await input.inputValue(), draft);
          assert.equal(
            await input.evaluate((node, original) => node === original, originalInput),
            true,
          );

          // Visiting another page without touching its sources must still reset page A.
          await page.goto(`${baseURL}#/components/button`);
          await verifyCodeExpansionEntry(page);
          await page.goto(`${baseURL}#/components/input`);
          await verifyCodeExpansionEntry(page);

          if (width === 1440) {
            await page.evaluate(() =>
              Object.defineProperty(navigator, 'clipboard', {
                configurable: true,
                value: {
                  writeText: () =>
                    new Promise((_, reject) => {
                      window.__rejectCodeExpansionCopy = reject;
                    }),
                },
              }),
            );
            await page
              .locator('.component-source')
              .first()
              .getByRole('button', { name: '复制代码', exact: true })
              .click();
            await page.waitForFunction(
              () => typeof window.__rejectCodeExpansionCopy === 'function',
            );
          }

          await page.goto(`${baseURL}#/components/divider`);
          await verifyCodeExpansionEntry(page);
          const chapter = page.locator('#divider-chapter .component-source');
          await chapter.waitFor();
          assert.equal(
            await chapter.evaluate((node) =>
              node.closest('.doc-section').contains(document.getElementById('examples')),
            ),
            false,
            'Divider keeps a real source example outside its main examples section.',
          );
          await allSourceToggle(page).click();
          await requireSources(page, true);
          assert.equal(
            await chapter.getByRole('button', { name: '收起代码', exact: true }).count(),
            1,
          );
          if (width === 1440) {
            await page.evaluate(() =>
              window.__rejectCodeExpansionCopy(new Error('Old page denied after navigation')),
            );
            await settle(page);
            await requireSources(page, true);
            assert.equal(
              await page.locator('.component-source .copy-fallback').count(),
              0,
              'A late clipboard rejection from page A must not change page B.',
            );
          }
          await allSourceToggle(page).click();
          await requireSources(page, false);
          assert((await setupStates(page)).every((open) => !open));
          await page.goto(`${baseURL}#/components/input`);
          await verifyCodeExpansionEntry(page);
        } finally {
          await page.evaluate(() => {
            const previous = window.__codeExpansionClipboardDescriptor;
            if (previous) Object.defineProperty(navigator, 'clipboard', previous);
            else delete navigator.clipboard;
            delete window.__codeExpansionClipboardDescriptor;
            delete window.__rejectCodeExpansionCopy;
          });
        }
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `Code controls fit the ${width}px page.`,
        );
        results.push({
          width,
          sourceCount: count,
          mixedState: true,
          setupIndependent: true,
          draftRetained: true,
          clipboardFallback: true,
          samePageSectionRetained: true,
          pageReset: true,
          dividerCustomChapter: true,
          staleClipboardRejection: width === 1440,
        });
      } finally {
        await originalInput.dispose();
        await originalEntry.dispose();
      }
    }
    return results;
  } finally {
    if (originalViewport) await page.setViewportSize(originalViewport);
  }
}
