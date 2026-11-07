import assert from 'node:assert/strict';

const modes = ['default', 'ordinary', 'decorated'];
const near = (actual, expected, label) =>
  assert(Math.abs(actual - expected) < 0.1, `${label}: ${actual} must equal ${expected}.`);
const transparent = (color) => color === 'transparent' || /(?:, 0\)|\/ 0\))$/.test(color);
const sample = (page, name, mode) =>
  page.getByTestId(`optional-${name}`).locator(`[data-mode="${mode}"]`);

/** Computed output from the installed CSS, never development module class names. */
async function paintedCases(page) {
  return page.evaluate(() => {
    const paint = (node, pseudo) => {
      const css = getComputedStyle(node, pseudo);
      const box = node.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        font: css.fontSize,
        line: css.lineHeight,
        background: css.backgroundColor,
        shadow: css.boxShadow,
        border: css.borderTopStyle,
        borderColor: css.borderTopColor,
        borderWidth: css.borderTopWidth,
        radius: css.borderRadius,
        content: css.content,
        opacity: css.opacity,
        transform: css.transform,
        padding: [css.paddingInlineStart, css.paddingInlineEnd],
      };
    };
    const result = {};
    for (const section of document.querySelectorAll('[data-testid^="optional-"]')) {
      const name = section.dataset.testid.slice('optional-'.length);
      result[name] = {};
      for (const scope of section.querySelectorAll('[data-mode]')) {
        const query = (selector) => scope.querySelector(selector);
        let value;
        if (name === 'button' || name === 'icon-button') {
          value = [...scope.querySelectorAll('button')].map((node) => ({
            ...paint(node),
            mark: paint(node.querySelector('[data-loading-mark]')),
            biscuit: Boolean(node.querySelector('[data-loading-mark="biscuit"] svg')),
            dots: node.querySelector('[data-loading-mark="dots"]')?.children.length ?? 0,
            disabled: node.disabled,
            busy: node.getAttribute('aria-busy'),
          }));
        } else if (name === 'checkbox' || name === 'radio-group') {
          value = [...scope.querySelectorAll('input')].map((node) => ({
            input: paint(node),
            row: paint(node.closest('label')),
            mark: paint(node, name === 'checkbox' ? '::before' : '::after'),
            secondMark: name === 'checkbox' ? paint(node, '::after') : null,
            checked: node.checked,
            mixed: node.indeterminate,
            disabled: node.disabled,
          }));
        } else if (name === 'heading') {
          value = { heading: paint(query('h2')), decoration: paint(query('h2'), '::after') };
        } else if (name === 'badge') {
          value = [...scope.querySelectorAll('[data-tone]')].map((node) => ({
            body: paint(node),
            tick: paint(node, '::before'),
          }));
        } else if (name === 'tabs') {
          const tab = query('[role="tab"][aria-selected="true"]');
          value = { tab: paint(tab), underline: paint(tab, '::after') };
        } else if (name === 'pagination') {
          value = paint(query('[aria-current="page"]'));
        } else if (name === 'accordion') {
          value = { trigger: paint(query('button')), chevron: paint(query('button svg')) };
        } else if (name === 'toast') {
          const toast = query('[role="status"]');
          const action = toast.querySelector('button').parentElement;
          value = {
            body: paint(toast),
            icon: paint(toast.firstElementChild),
            action: paint(action),
          };
        } else if (name === 'empty-state') {
          const motif = query('[aria-hidden="true"]');
          value = { motif: motif ? paint(motif, '::before') : null, title: paint(query('h3')) };
        } else if (name === 'select') {
          value = paint(query('[role="combobox"]'));
        } else if (name === 'tooltip') {
          const popup = document.querySelector(`.optional-tooltip-${scope.dataset.mode}`);
          value = {
            body: paint(popup),
            arrow: popup.nextElementSibling ? paint(popup.nextElementSibling) : null,
          };
        }
        result[name][scope.dataset.mode] = value;
      }
    }
    return result;
  });
}

function verifyPaint(cases, label) {
  assert.equal(Object.keys(cases).length, 13, `${label}: all thirteen public APIs render.`);
  for (const [name, variants] of Object.entries(cases)) {
    if (name !== 'tooltip')
      assert.deepEqual(
        variants.default,
        variants.ordinary,
        `${label} ${name}: omitted props equal explicit ordinary defaults.`,
      );
  }
  for (const name of ['button', 'icon-button']) {
    for (let index = 0; index < cases[name].ordinary.length; index++) {
      const plain = cases[name].ordinary[index];
      const decorated = cases[name].decorated[index];
      const target = [36, 44, 52, 44][index];
      near(plain.height, target, `${label} ${name} target`);
      near(decorated.height, plain.height, `${label} ${name} unchanged height`);
      near(decorated.width, plain.width, `${label} ${name} unchanged width`);
      assert.equal(plain.dots, 3);
      assert.equal(plain.biscuit, false);
      assert.equal(decorated.biscuit, true);
      assert.equal(decorated.dots, 0);
      assert.equal(plain.disabled, true);
      assert.equal(decorated.busy, 'true');
      near(plain.mark.width, decorated.mark.width, `${label} ${name} loading frame`);
      assert.deepEqual(plain.padding, decorated.padding);
    }
  }
  for (const name of ['checkbox', 'radio-group']) {
    const plain = cases[name].ordinary;
    const decorated = cases[name].decorated;
    for (let index = 0; index < plain.length; index++) {
      const off = plain[index];
      const on = decorated[index];
      assert(transparent(off.row.background), `${label} ${name}: ordinary rows are clear.`);
      const selected = off.checked || off.mixed;
      assert.equal(transparent(on.row.background), !selected || off.disabled);
      near(off.row.height, on.row.height, `${label} ${name} row height`);
      near(off.input.width, 22, `${label} ${name} native mark frame`);
      assert.equal(off.input.background, on.input.background);
      assert.equal(off.mark.opacity, on.mark.opacity);
      if (name === 'radio-group') assert.equal(off.row.shadow, 'none');
    }
  }
  assert.equal(cases.heading.ordinary.decoration.content, 'none');
  assert.notEqual(cases.heading.decorated.decoration.content, 'none');
  assert.equal(cases.heading.ordinary.heading.font, cases.heading.decorated.heading.font);
  for (let index = 0; index < 2; index++) {
    assert.equal(cases.badge.ordinary[index].body.border, 'solid');
    assert.equal(cases.badge.decorated[index].body.border, 'dashed');
    assert.equal(
      cases.badge.ordinary[index].body.background,
      cases.badge.decorated[index].body.background,
    );
  }
  assert.equal(cases.badge.ordinary[0].tick.content, 'none');
  assert.notEqual(cases.badge.decorated[0].tick.content, 'none');
  near(Number(cases.tabs.ordinary.underline.opacity), 1, `${label} ordinary tabs retain selection`);
  assert.notEqual(
    cases.tabs.ordinary.underline.transform,
    cases.tabs.decorated.underline.transform,
  );
  assert(transparent(cases.tabs.ordinary.tab.background));
  assert(!transparent(cases.tabs.decorated.tab.background));
  assert.notEqual(cases.pagination.ordinary.radius, cases.pagination.decorated.radius);
  assert.equal(cases.pagination.ordinary.background, cases.pagination.decorated.background);
  near(cases.pagination.ordinary.height, 44, `${label} pagination target`);
  assert(transparent(cases.accordion.ordinary.chevron.borderColor));
  assert(!transparent(cases.accordion.decorated.chevron.borderColor));
  assert.equal(cases.accordion.ordinary.chevron.shadow, 'none');
  near(
    cases.accordion.ordinary.chevron.width,
    cases.accordion.decorated.chevron.width,
    `${label} disclosure frame`,
  );
  near(cases.toast.ordinary.icon.width, 21, `${label} ordinary status icon`);
  near(cases.toast.decorated.icon.width, 30, `${label} receipt stamp`);
  assert.equal(cases.toast.ordinary.icon.borderWidth, '0px');
  assert.equal(cases.toast.decorated.icon.borderWidth, '2px');
  assert.equal(cases.toast.ordinary.action.border, 'none');
  assert.equal(cases.toast.decorated.action.border, 'dashed');
  assert.equal(cases['empty-state'].ordinary.motif, null);
  assert.notEqual(cases['empty-state'].decorated.motif, null);
  assert.equal(
    cases.tooltip.ordinary.arrow,
    null,
    `${label} explicit showArrow=false omits arrow DOM.`,
  );
  near(cases.tooltip.default.arrow.width, 10, `${label} tooltip default compatibility arrow`);
  near(cases.tooltip.decorated.arrow.width, 10, `${label} explicit tooltip arrow`);
  assert.equal(cases.tooltip.default.body.background, cases.tooltip.ordinary.body.background);
}

async function verifySelect(page, mode, theme) {
  const field = sample(page, 'select', mode);
  const trigger = field.getByRole('combobox');
  await trigger.focus();
  await trigger.press('Enter');
  const selected = page.getByRole('option', { name: '日常小发现', exact: true });
  await selected.waitFor();
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await selected.elementHandle(),
  );
  const paint = await selected.evaluate((node) => {
    const svg = node.querySelector('svg');
    const css = getComputedStyle(svg);
    return {
      border: css.borderTopWidth,
      background: css.backgroundColor,
      shadow: css.boxShadow,
      hidden: svg.getAttribute('aria-hidden'),
      selected: node.getAttribute('aria-selected'),
      theme: node.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme'),
    };
  });
  assert.equal(paint.selected, 'true');
  assert.equal(paint.hidden, 'true');
  assert.equal(paint.theme, theme);
  if (mode === 'decorated') {
    assert.equal(paint.border, '1px');
    assert(!transparent(paint.background));
    assert.notEqual(paint.shadow, 'none');
  } else {
    assert.equal(paint.border, '0px');
    assert(transparent(paint.background));
    assert.equal(paint.shadow, 'none');
  }
  await page.keyboard.press('End');
  await page.waitForFunction(
    () => document.activeElement?.getAttribute('aria-disabled') === 'true',
  );
  await page.keyboard.press('Enter');
  assert.equal(
    await trigger.getAttribute('aria-expanded'),
    'true',
    'Disabled selection cannot commit.',
  );
  await page.keyboard.press('ArrowUp');
  await page.waitForFunction(() => document.activeElement?.textContent?.includes('读书笔记'));
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    (node) => node.textContent.includes('读书笔记') && document.activeElement === node,
    await trigger.elementHandle(),
  );
}

async function verifyActions(page, mode, direction) {
  const choices = sample(page, 'checkbox', mode);
  const checkbox = choices.getByRole('checkbox', { name: '接收每月阅读来信' });
  const values = () => choices.locator('form').evaluate((form) => [...new FormData(form)]);
  assert.deepEqual(await values(), [['updates', 'yes']]);
  await checkbox.focus();
  await checkbox.press('Space');
  assert.equal(await checkbox.isChecked(), false);
  assert.deepEqual(await values(), []);
  const mixed = choices.getByRole('checkbox', { name: '订阅部分分类' });
  await mixed.click();
  assert.equal(await mixed.evaluate((node) => node.indeterminate), true);
  await choices.locator('form').evaluate((form) => form.reset());
  await page.waitForFunction((node) => node.checked, await checkbox.elementHandle());
  assert.deepEqual(await values(), [['updates', 'yes']]);
  assert.equal(
    await choices.getByRole('checkbox', { name: '暂不可更改的订阅' }).isDisabled(),
    true,
  );
  const radios = sample(page, 'radio-group', mode);
  await radios.getByRole('radio', { name: '每周一封' }).focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await radios.getByRole('radio', { name: '每月一封' }).isChecked(), true);
  assert.deepEqual(await radios.locator('form').evaluate((form) => [...new FormData(form)]), [
    ['frequency', 'second'],
  ]);
  const tabs = sample(page, 'tabs', mode);
  const firstTab = tabs.getByRole('tab', { name: '正文', exact: true });
  const nextTab = tabs.getByRole('tab', { name: '后记', exact: true });
  await firstTab.focus();
  await page.keyboard.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
  assert.equal(
    await firstTab.getAttribute('aria-selected'),
    'true',
    'Arrow focus keeps manual activation.',
  );
  assert.equal(await nextTab.evaluate((node) => document.activeElement === node), true);
  await page.keyboard.press('Enter');
  assert.equal(await nextTab.getAttribute('aria-selected'), 'true');
  assert.equal(
    await tabs.getByRole('tabpanel', { name: '后记', exact: true }).textContent(),
    '下次散步，再把面包店补进路线图。',
  );
  const pagination = sample(page, 'pagination', mode);
  await pagination.getByRole('button', { name: '下一页' }).click();
  assert.equal(
    await pagination.getByRole('button', { name: '第 3 页' }).getAttribute('aria-current'),
    'page',
  );
  const disclosure = sample(page, 'accordion', mode);
  const first = disclosure.getByRole('button', { name: '怎样找到这篇周末手记？' });
  await first.focus();
  await first.press('Space');
  assert.equal(await first.getAttribute('aria-expanded'), 'false');
  const second = disclosure.getByRole('button', { name: '收藏之后放在哪里？' });
  await second.focus();
  await second.press('Enter');
  assert.equal(await second.getAttribute('aria-expanded'), 'true');
  const toast = sample(page, 'toast', mode);
  await toast.getByRole('button', { name: '撤销归档' }).click();
  assert((await toast.getByRole('status').textContent()).includes('已撤销归档'));
  await toast.getByRole('button', { name: '关闭提示' }).click();
  assert.equal(await toast.getByRole('status').count(), 0);
  const empty = sample(page, 'empty-state', mode);
  await empty.getByRole('button', { name: '创建手记' }).click();
  assert.equal(await empty.getByRole('status').textContent(), '第一篇手记已创建');
}

export async function verifyOptionalDecorations(browser, url) {
  for (const width of [1280, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      for (const theme of ['pink', 'blue', 'yellow'])
        for (const direction of ['ltr', 'rtl']) {
          const target = new URL(url);
          target.search = new URLSearchParams({
            'optional-decorations': '',
            theme,
            dir: direction,
          }).toString();
          await page.goto(target.href);
          await page
            .getByRole('heading', { name: 'Installed optional decoration contract' })
            .waitFor();
          await page.locator('.optional-tooltip-decorated').waitFor({ state: 'attached' });
          const label = `${theme} ${width}px ${direction}`;
          verifyPaint(await paintedCases(page), label);
          assert.equal(
            await page
              .locator(
                '[appearance],[loadingvariant],[highlightselected],[selectedindicator],[decoration],[motif],[showarrow]',
              )
              .count(),
            0,
            `${label}: public props do not leak to DOM.`,
          );
          assert(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            `${label}: examples fit the viewport.`,
          );
          assert.equal(await page.getByTestId('empty-custom').locator('svg').count(), 1);
          assert.equal(
            await page.getByTestId('empty-disabled').locator('[aria-hidden="true"]').count(),
            0,
          );
          const nested = await page.getByTestId('toast-nested').evaluate((scope) => {
            const outer = scope.querySelector('.nested-toast-outer');
            const inner = scope.querySelector('.nested-toast-inner');
            const icon = getComputedStyle(inner.firstElementChild);
            const action = getComputedStyle(inner.children[1].lastElementChild);
            return {
              outer: outer.firstElementChild.getBoundingClientRect().width,
              inner: inner.firstElementChild.getBoundingClientRect().width,
              border: icon.borderTopWidth,
              tray: action.borderTopStyle,
              background: action.backgroundColor,
              shadow: icon.boxShadow,
            };
          });
          near(nested.outer, 30, `${label} outer receipt stamp`);
          near(nested.inner, 21, `${label} nested ordinary status icon`);
          assert.equal(nested.border, '0px');
          assert.equal(nested.tray, 'none');
          assert(transparent(nested.background));
          assert.equal(nested.shadow, 'none');
          for (const mode of modes) {
            try {
              await verifySelect(page, mode, theme);
              await verifyActions(page, mode, direction);
            } catch (error) {
              throw new Error(`${label} ${mode}: ${error.message}`, { cause: error });
            }
          }
          assert.deepEqual(errors, [], `${label}: no browser runtime errors.`);
        }
    } finally {
      await page.close();
    }
  }
  console.log(
    'Installed optional decorations passed: thirteen APIs, omitted/default/opt-in paint, native interaction, all themes, both directions and viewport sizes.',
  );
}
