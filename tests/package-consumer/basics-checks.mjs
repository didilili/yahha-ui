import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { verifyNavigationAppearance } from './navigation-checks.mjs';
import {
  verifyOverlayAppearance,
  verifyOverlayClose,
  verifyShortOverlays,
} from './overlay-checks.mjs';

async function focused(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}
async function choose(page, trigger, popupClass, label) {
  await trigger.click();
  const popup = page.locator(popupClass);
  await popup.waitFor();
  const option = popup.getByRole('option', { name: label, exact: true });
  if (popupClass === '.nested-select-popup') {
    // Playwright/CDP's automatic ancestor scrolling can hide the parent popover's anchor.
    // Keep normal stability and hit-target checks without scrolling this visible option.
    await option.click({ scroll: 'none' });
  } else await option.click();
  await popup.waitFor({ state: 'hidden' });
}

export async function verifyBadgeAppearance(page, theme) {
  const marks = await page.getByTestId('hidden-badge').evaluate((sample) => {
    const container = document.createElement('div');
    sample.parentElement.append(container);
    try {
      return ['ltr', 'rtl'].map((direction) => {
        const row = document.createElement('div');
        row.dir = direction;
        const badge = sample.cloneNode();
        badge.removeAttribute('hidden');
        badge.removeAttribute('data-testid');
        badge.dataset.tone = 'success';
        badge.textContent = 'Saved';
        row.append(badge);
        container.append(row);
        const mark = getComputedStyle(badge, '::before');
        return {
          direction: getComputedStyle(badge).direction,
          visible:
            mark.content !== 'none' &&
            parseFloat(mark.width) > 0 &&
            parseFloat(mark.height) > 0 &&
            parseFloat(mark.borderBottomWidth) > 0 &&
            (parseFloat(mark.borderLeftWidth) > 0 || parseFloat(mark.borderRightWidth) > 0),
          shape: {
            left: mark.borderLeft,
            right: mark.borderRight,
            bottom: mark.borderBottom,
            width: mark.width,
            height: mark.height,
            transform: mark.transform,
          },
        };
      });
    } finally {
      container.remove();
    }
  });
  assert.deepEqual(
    marks.map(({ direction }) => direction),
    ['ltr', 'rtl'],
  );
  assert(
    marks.every(({ visible }) => visible),
    'A success badge retains its visible check.',
  );
  assert.deepEqual(
    marks[1].shape,
    marks[0].shape,
    `${theme}: a success check keeps its shape when the badge follows RTL reading order.`,
  );
}

export async function verifyImageFallbackAppearance(page) {
  const cases = await page.locator('.reading-fallback-image').evaluate((sample) => {
    const container = document.createElement('div');
    sample.parentElement.append(container);
    try {
      return ['ltr', 'rtl'].flatMap((direction) =>
        ['16 / 9', '1 / 1'].map((aspectRatio) => {
          const row = document.createElement('div');
          row.dir = direction;
          row.style.width = '160px';
          const frame = sample.cloneNode(true);
          frame.style.aspectRatio = aspectRatio;
          row.append(frame);
          container.append(row);
          const bounds = frame.getBoundingClientRect();
          const fallback = frame.querySelector('[role="img"]');
          const fallbackBounds = fallback.getBoundingClientRect();
          const fits = (rect) =>
            rect.left >= bounds.left - 1 &&
            rect.right <= bounds.right + 1 &&
            rect.top >= bounds.top - 1 &&
            rect.bottom <= bounds.bottom + 1;
          const walker = document.createTreeWalker(fallback, NodeFilter.SHOW_TEXT);
          const textBounds = [];
          for (let text = walker.nextNode(); text; text = walker.nextNode()) {
            if (!text.textContent.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(text);
            textBounds.push(...range.getClientRects());
          }
          return {
            direction,
            aspectRatio,
            frameFits: fits(fallbackBounds),
            textFits: textBounds.length > 0 && textBounds.every(fits),
            iconFits: fits(fallback.querySelector('svg').getBoundingClientRect()),
          };
        }),
      );
    } finally {
      container.remove();
    }
  });
  for (const { direction, aspectRatio, frameFits, textFits, iconFits } of cases) {
    assert(
      frameFits && textFits && iconFits,
      `${direction} ${aspectRatio}: a 160px image keeps its failure border, icon and default explanation inside the reserved frame.`,
    );
  }
}

async function verifyReadingAppearance(page, theme) {
  for (const [size, dimension, name, initials] of [
    ['sm', 32, '库米', '库米'],
    ['md', 44, 'Hachi', 'Ha'],
    ['lg', 64, '乌萨奇', '乌萨'],
  ]) {
    const avatar = page.getByTestId(`reading-avatar-${size}`);
    assert.equal(await avatar.getAttribute('aria-label'), name);
    assert.equal(await avatar.textContent(), initials);
    const box = await avatar.boundingBox();
    assert(Math.abs(box.width - dimension) < 0.1 && Math.abs(box.height - dimension) < 0.1);
    const color = await avatar.evaluate((node) => {
      const probe = document.createElement('span');
      probe.style.background = 'var(--yahha-accent)';
      node.append(probe);
      const expected = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { actual: getComputedStyle(node).backgroundColor, expected };
    });
    assert.equal(color.actual, color.expected, `${theme}: author initials use their theme paper.`);
  }
  const divider = page.getByTestId('reading-divider');
  assert.equal(await divider.getAttribute('aria-orientation'), 'horizontal');
  const edge = await divider.evaluate((node) => {
    const probe = document.createElement('span');
    probe.style.borderColor = 'var(--yahha-paper-line)';
    node.parentElement.append(probe);
    const expected = getComputedStyle(probe).borderColor;
    probe.remove();
    const style = getComputedStyle(node);
    return { color: style.borderTopColor, width: parseFloat(style.borderTopWidth), expected };
  });
  assert.equal(edge.color, edge.expected, `${theme}: a reading divider uses the content edge.`);
  assert(edge.width > 0, 'A semantic divider keeps a visible boundary.');
}

async function verifyReadingFlow(page) {
  const flow = page.getByTestId('reading-flow');
  for (const [id, font] of [
    ['reading-copy', 16],
    ['reading-summary', 18],
    ['reading-caption', 14],
  ])
    assert.equal(
      await page.getByTestId(id).evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      font,
    );
  assert.equal(await page.getByTestId('reading-long-title').evaluate((node) => node.tagName), 'H3');
  assert(
    await flow.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(text);
        if (
          [...range.getClientRects()].some(
            (line) => line.left < bounds.left - 1 || line.right > bounds.right + 1,
          )
        )
          return false;
      }
      return true;
    }),
    'Long Chinese headings, continuous copy and unbroken links fit the reading column.',
  );
  const link = page.getByTestId('reading-long-link');
  const url = page.getByTestId('reading-url');
  assert.equal(await link.getAttribute('target'), '_blank');
  const rel = ((await link.getAttribute('rel')) ?? '').split(/\s+/);
  assert(rel.includes('noopener') && rel.includes('noreferrer'));
  assert.equal(
    await page.getByRole('link', { name: 'an article link', exact: true }).getAttribute('target'),
    null,
  );
  await link.focus();
  await page.keyboard.press('Tab');
  await focused(page, url);
  const focus = await url.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      keyboard: node.matches(':focus-visible'),
      outline: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
      decoration: style.textDecorationLine,
    };
  });
  assert(focus.keyboard && focus.outline !== 'none' && focus.width > 0);
  assert(
    focus.decoration.includes('underline'),
    'A focused body link remains identifiable as a link.',
  );

  const author = page.getByTestId('reading-avatar-recovery');
  await page.waitForFunction((node) => !node.querySelector('img'), await author.elementHandle());
  assert.equal(await author.getAttribute('aria-label'), 'Missing picture');
  assert.equal(await author.textContent(), 'Mi');
  const before = await author.boundingBox();
  await page.getByRole('button', { name: 'Recover author picture', exact: true }).click();
  await page.waitForFunction(
    (node) => {
      const image = node.querySelector('img');
      return image?.naturalWidth > 0 && getComputedStyle(image).opacity === '1';
    },
    await author.elementHandle(),
  );
  const after = await author.boundingBox();
  assert(
    Math.abs(before.width - after.width) < 0.1 && Math.abs(before.height - after.height) < 0.1,
  );
  assert.equal(await author.getAttribute('aria-label'), 'Missing picture');
}

export async function verifyBasics(browser, url) {
  for (const width of [1280, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto(`${url}?basics`);
      await page.getByRole('heading', { name: 'Basic component consumer' }).waitFor();
      const category = page.getByRole('combobox', { name: 'Basic category', exact: true });
      for (const theme of ['pink', 'blue', 'yellow']) {
        await page.getByRole('combobox', { name: 'Basic preview theme' }).selectOption(theme);
        await verifyBadgeAppearance(page, theme);
        await verifyReadingAppearance(page, theme);
        await verifyNavigationAppearance(page, theme);
        await verifyOverlayAppearance(page, theme);
        await category.click();
        const popup = page.locator('.basic-select-popup');
        await popup.waitFor();
        assert.equal(
          await popup.evaluate((node) => node.closest('[data-yahha-theme]').dataset.yahhaTheme),
          theme,
        );
        assert((await popup.boundingBox()).width <= width, 'Select popup must fit screen.');
        assert((await popup.getByRole('option').first().boundingBox()).height >= 44);
        await focused(page, popup.getByRole('option', { name: 'Life notes', exact: true }));
        await page.keyboard.press('Home');
        await page.keyboard.press('ArrowDown');
        await focused(page, popup.getByRole('option', { name: 'Locked option', exact: true }));
        await page.keyboard.press('Enter');
        assert.match(
          await category.innerText(),
          /Life notes/,
          'A disabled option cannot be selected.',
        );
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await popup.waitFor({ state: 'hidden' });
        assert.match(
          await category.innerText(),
          /Reading notes/,
          'Select keyboard navigation can choose an enabled option.',
        );
        await focused(page, category);
        await choose(page, category, '.basic-select-popup', 'Life notes');
      }
      await choose(page, category, '.basic-select-popup', 'Reading notes');
      await page.getByRole('textbox', { name: 'Basic comment', exact: true }).fill('Updated draft');
      await page.getByRole('checkbox', { name: 'Basic agreement', exact: true }).uncheck();
      await page.getByRole('switch', { name: 'Basic subscription', exact: true }).uncheck();
      const radio = page.getByRole('radio', { name: 'First mode', exact: true });
      await radio.focus();
      await page.keyboard.press('ArrowDown');
      assert(await page.getByRole('radio', { name: 'Last mode', exact: true }).isChecked());
      await page.getByRole('button', { name: 'Submit basics', exact: true }).click();
      const data = JSON.parse(await page.getByLabel('Basic submitted data').innerText());
      assert.equal(data.category, 'reading');
      assert.equal(data.comment, 'Updated draft');
      assert.equal(data.mode, 'last');
      assert(!('agree' in data));
      assert(!('subscribe' in data));
      await page.getByRole('button', { name: 'Reset basics', exact: true }).click();
      await page.waitForFunction(
        () => document.querySelector('[name="category"]').value === 'life',
      );
      assert.match(await category.innerText(), /Life notes/);
      assert.equal(
        await page.getByRole('textbox', { name: 'Basic comment', exact: true }).inputValue(),
        'Initial draft',
      );
      assert(
        await page.getByRole('checkbox', { name: 'Basic agreement', exact: true }).isChecked(),
      );
      assert(
        await page.getByRole('switch', { name: 'Basic subscription', exact: true }).isChecked(),
      );
      assert(await radio.isChecked());
      for (const name of [
        'Disabled basic select',
        'Disabled basic checkbox',
        'Disabled basic switch',
        'Disabled basic textarea',
      ])
        assert(await page.getByLabel(name, { exact: true }).isDisabled(), name);
      const inheritedDisabled = page.getByRole('combobox', {
        name: 'Disabled basic select',
        exact: true,
      });
      await inheritedDisabled.evaluate((node) => (node.closest('fieldset').disabled = false));
      await inheritedDisabled.click();
      await page.getByRole('listbox').waitFor();
      await inheritedDisabled.evaluate((node) => (node.closest('fieldset').disabled = true));
      await page.getByRole('option', { name: 'Reading notes', exact: true }).click();
      assert.match(
        await inheritedDisabled.innerText(),
        /请选择/,
        'A fieldset disabled while the popup is open must prevent value changes.',
      );
      await page.getByRole('listbox').waitFor({ state: 'hidden' });
      const readonly = page.getByRole('combobox', { name: 'Readonly basic select', exact: true });
      await readonly.click();
      await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');
      assert.match(await readonly.innerText(), /Life notes/);

      const draft = page.getByRole('textbox', { name: 'Kept tab draft' });
      await draft.fill('Retained draft');
      await page.getByRole('tab', { name: 'Archive tab', exact: true }).click();
      assert(await page.getByRole('tabpanel').getByText('Archive panel').isVisible());
      await page.getByRole('tab', { name: 'Notes tab', exact: true }).click();
      assert.equal(await draft.inputValue(), 'Retained draft');
      await page.getByRole('button', { name: 'First question', exact: true }).click();
      await page.getByRole('button', { name: 'Second question', exact: true }).click();
      assert(await page.getByText('First answer', { exact: true }).isVisible());
      assert(await page.getByText('Second answer', { exact: true }).isVisible());
      await page
        .getByRole('navigation', { name: '文章分页', exact: true })
        .getByRole('button', { name: '下一页', exact: true })
        .click();
      assert.equal(await page.getByLabel('Basic current page').innerText(), '2');
      await page.getByRole('button', { name: '第 20 页', exact: true }).click();
      assert(
        await page
          .getByRole('navigation', { name: '文章分页', exact: true })
          .getByRole('button', { name: '下一页', exact: true })
          .isDisabled(),
      );

      const menuTrigger = page.getByRole('button', { name: 'Basic actions', exact: true });
      await menuTrigger.click();
      await page.getByRole('menu').waitFor();
      await page.getByRole('menuitem', { name: 'Unavailable action', exact: true }).focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.getByLabel('Basic action result').innerText(), '');
      await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      await page.getByRole('menu').waitFor({ state: 'hidden' });
      assert.equal(await page.getByLabel('Basic action result').innerText(), 'Saved article');
      await focused(page, menuTrigger);

      const popoverTrigger = page.getByRole('button', { name: 'Open basic popover', exact: true });
      const popoverEvents = await page.evaluateHandle(() => {
        const events = [];
        const describe = (node) =>
          node instanceof Element
            ? {
                tag: node.tagName,
                role: node.getAttribute('role'),
                text: node.textContent?.slice(0, 100),
              }
            : null;
        for (const type of ['pointerdown', 'pointerup', 'click', 'focusin', 'focusout', 'scroll']) {
          document.addEventListener(
            type,
            (event) => {
              events.push({
                type,
                time: performance.now(),
                target: describe(event.target),
                relatedTarget: describe(event.relatedTarget),
                x: event.clientX,
                y: event.clientY,
                scrollY,
                anchorHidden: Boolean(document.querySelector('[data-anchor-hidden]')),
              });
              if (events.length > 80) events.shift();
            },
            true,
          );
        }
        return events;
      });
      await popoverTrigger.click();
      const popover = page.getByRole('dialog', { name: /^Basic popover:/ });
      await popover.waitFor();
      await focused(page, popover.getByRole('textbox', { name: 'Popover note' }));
      try {
        await choose(
          page,
          popover.getByRole('combobox', { name: 'Popover category' }),
          '.nested-select-popup',
          'Reading notes',
        );
        assert.match(
          await popover.getByRole('combobox', { name: 'Popover category' }).innerText(),
          /Reading notes/,
        );
      } catch (error) {
        const diagnostic = await popoverEvents.evaluate((events) => {
          const describe = (node) =>
            node && {
              html: node.outerHTML,
              box: node.getBoundingClientRect().toJSON(),
              visibility: getComputedStyle(node).visibility,
              display: getComputedStyle(node).display,
              scrollTop: node.scrollTop,
            };
          const trigger = [...document.querySelectorAll('button')].find(
            (node) => node.textContent === 'Open basic popover',
          );
          const popup = [...document.querySelectorAll('[role="dialog"]')].find((node) =>
            node.textContent.includes('Basic popover:'),
          );
          return {
            events,
            scrollY,
            active: describe(document.activeElement),
            trigger: describe(trigger),
            popover: describe(popup),
            positioner: describe(popup?.parentElement),
            select: describe(popup?.querySelector('[role="combobox"]')),
            options: describe(document.querySelector('.nested-select-popup')),
          };
        });
        console.error('Nested package Select failure:', JSON.stringify(diagnostic));
        await mkdir('test-results', { recursive: true });
        await writeFile(
          `test-results/package-popover-${width}.json`,
          JSON.stringify(diagnostic, null, 2),
        );
        await page.screenshot({ path: `test-results/package-popover-${width}.png` });
        throw error;
      }
      await popover.getByRole('button', { name: '关闭浮层', exact: true }).click();
      await popover.waitFor({ state: 'hidden' });
      await focused(page, popoverTrigger);
      await page.keyboard.press('Tab');
      await focused(page, page.getByRole('button', { name: 'Read article help', exact: true }));
      await page.locator('.basic-tooltip').waitFor();
      await page.keyboard.press('Escape');
      await page.locator('.basic-tooltip').waitFor({ state: 'hidden' });

      const dialogTrigger = page.getByRole('button', { name: 'Open nested controls', exact: true });
      await dialogTrigger.click();
      const dialog = page.getByRole('dialog', { name: 'Nested basic controls', exact: true });
      await dialog.waitFor();
      await verifyOverlayClose(dialog, `yellow ${width}px dialog`);
      const dialogSelect = dialog.getByRole('combobox', { name: 'Dialog category' });
      await dialogSelect.click();
      const nestedPopup = page.locator('.dialog-select-popup');
      await nestedPopup.waitFor();
      assert.equal(
        await nestedPopup.evaluate((node) => getComputedStyle(node).borderColor),
        'rgb(132, 105, 115)',
      );
      await nestedPopup.getByRole('option', { name: 'Reading notes', exact: true }).click();
      assert.match(await dialogSelect.innerText(), /Reading notes/);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      await focused(page, dialogTrigger);

      await verifyReadingFlow(page);
      const normalFrame = page.locator('.reading-fallback-image');
      await normalFrame.scrollIntoViewIfNeeded();
      await normalFrame.getByText('图片暂时无法显示', { exact: true }).waitFor();
      await normalFrame.getByRole('img', { name: 'Reading preview', exact: true }).waitFor();
      await verifyImageFallbackAppearance(page);
      const normalBefore = await normalFrame.boundingBox();
      assert(
        await normalFrame.evaluate((node) => {
          const bounds = node.getBoundingClientRect();
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          for (let text = walker.nextNode(); text; text = walker.nextNode()) {
            if (!text.textContent.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(text);
            if (
              [...range.getClientRects()].some(
                (line) =>
                  line.left < bounds.left - 1 ||
                  line.right > bounds.right + 1 ||
                  line.top < bounds.top - 1 ||
                  line.bottom > bounds.bottom + 1,
              )
            )
              return false;
          }
          return true;
        }),
        'The default failure explanation fits the reserved article picture.',
      );
      const frame = page.locator('.basic-image');
      await frame.getByRole('img', { name: 'Basic article cover', exact: true }).waitFor();
      assert(
        await frame
          .getByRole('img', { name: 'Basic article cover', exact: true })
          .evaluate((node) => {
            const inner = node.getBoundingClientRect(),
              outer = node.parentElement.getBoundingClientRect();
            return inner.width <= outer.width + 1 && inner.height <= outer.height + 1;
          }),
        'Image fallback must fit without a host box-sizing reset.',
      );
      await page.getByRole('button', { name: 'Recover basic picture', exact: true }).click();
      await page.waitForFunction(
        () => document.querySelector('.basic-image img')?.naturalWidth > 0,
      );
      assert(
        await frame.getByRole('img', { name: 'Basic article cover', exact: true }).isVisible(),
      );
      await page.waitForFunction(
        (node) => node.querySelector('img')?.naturalWidth > 0,
        await normalFrame.elementHandle(),
      );
      const normalAfter = await normalFrame.boundingBox();
      assert(
        Math.abs(normalBefore.width - normalAfter.width) < 0.1 &&
          Math.abs(normalBefore.height - normalAfter.height) < 0.1,
        'Loading a valid picture preserves the reserved image geometry.',
      );
      assert.equal(
        await normalFrame.getByRole('img', { name: 'Reading preview', exact: true }).count(),
        1,
      );
      for (const locator of [
        page.getByTestId('basic-skeleton'),
        page.getByText('Loading basic content').locator('..'),
      ])
        assert.equal(
          await locator.evaluate((node) => node.getAnimations({ subtree: true }).length),
          0,
        );
      assert.equal(
        await page
          .getByTestId('basic-skeleton')
          .locator('[data-variant]')
          .getAttribute('aria-hidden'),
        'true',
        'Skeleton is decorative; its content region owns the loading announcement.',
      );
      const hiddenCases = [
        ['hidden-button', 'BUTTON'],
        ['hidden-icon-button', 'BUTTON'],
        ['hidden-avatar', 'SPAN'],
        ['hidden-badge', 'SPAN'],
        ['hidden-segments', 'FIELDSET'],
        ['hidden-input', 'INPUT'],
        ['hidden-textarea', 'TEXTAREA'],
        ['hidden-select', 'BUTTON'],
        ['hidden-divider', 'HR'],
        ['hidden-divider-vertical', 'HR'],
        ['hidden-alert', 'DIV'],
        ['hidden-spinner', 'SPAN'],
        ['hidden-skeleton', 'SPAN'],
      ];
      for (const [id, tagName] of hiddenCases) {
        const hidden = await page.getByTestId(id).evaluate((node) => ({
          tagName: node.tagName,
          hidden: node.hidden,
          display: getComputedStyle(node).display,
          width: node.getBoundingClientRect().width,
          height: node.getBoundingClientRect().height,
        }));
        assert.deepEqual(
          hidden,
          { tagName, hidden: true, display: 'none', width: 0, height: 0 },
          `${id} must honor native hidden without the documentation CSS reset.`,
        );
      }
      for (const label of ['Hidden field input', 'Hidden field textarea', 'Hidden field select']) {
        assert(
          await page.getByText(label, { exact: true }).isVisible(),
          'Native field hidden attributes target only their input, textarea or trigger.',
        );
      }
      for (const [id] of hiddenCases) {
        const findable = await page.getByTestId(id).evaluate((node) => {
          // React currently types hidden as boolean; exercise the native DOM mechanism
          // without advertising a new JSX prop value in the library's API.
          node.setAttribute('hidden', 'until-found');
          const style = getComputedStyle(node);
          const result = {
            display: style.display,
            visibility: style.contentVisibility,
          };
          // Native content visibility can collapse an auto-sized fieldset. Revealing
          // the element must restore its own layout without a library override.
          node.removeAttribute('hidden');
          result.revealedHeight = node.getBoundingClientRect().height;
          node.setAttribute('hidden', '');
          return result;
        });
        assert.notEqual(
          findable.display,
          'none',
          `${id} must preserve native find-in-page expansion.`,
        );
        assert.equal(findable.visibility, 'hidden');
        assert.ok(findable.revealedHeight > 0, `${id} must become visible when revealed.`);
      }
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
        'New components must not cause page-wide overflow.',
      );
      assert.deepEqual(errors, []);
      console.log(
        `Browser: ${width}px new form submission/reset, Select/Portal layers, tabs, menus, focus, images and reduced motion passed.`,
      );
    } finally {
      await page.close();
    }
  }
  await verifyShortOverlays(browser, url);
}
