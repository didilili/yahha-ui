import assert from 'node:assert/strict';

const rect = (locator) =>
  locator.evaluate((node) => {
    const { x, y, width, height } = node.getBoundingClientRect();
    return [x, y, width, height];
  });
const css = (locator, property, pseudo = null) =>
  locator.evaluate(
    (node, { property, pseudo }) => getComputedStyle(node, pseudo).getPropertyValue(property),
    { property, pseudo },
  );
const noMotion = (locator) =>
  locator.evaluate((node) => node.getAnimations({ subtree: true }).length === 0);
async function finish(locator) {
  await locator.evaluate(async (node) => {
    const animations = node
      .getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSTransition);
    await Promise.all(animations.map((animation) => animation.ready));
    for (const animation of animations) animation.finish();
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}
async function midpoint(locator, property, pseudo = null, fraction = 0.5) {
  return locator.evaluate(
    async (node, { property, pseudo, fraction }) => {
      let animation;
      for (let frame = 0; frame < 8; frame++) {
        animation = node
          .getAnimations({ subtree: true })
          .find(
            (candidate) =>
              candidate instanceof CSSTransition && candidate.transitionProperty === property,
          );
        if (animation) break;
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      if (!animation) throw new Error(`Missing actual ${property} transition.`);
      await animation.ready;
      const duration = animation.effect.getTiming().duration;
      if (!(duration > 0 && Number.isFinite(duration)))
        throw new Error('Field feedback must finish.');
      animation.pause();
      animation.currentTime = duration * fraction;
      return getComputedStyle(node, pseudo).getPropertyValue(property);
    },
    { property, pseudo, fraction },
  );
}

async function verifyFieldPaint(page, scope) {
  for (const [id, errorId] of [
    ['design-field-normal', 'design-field-error'],
    ['design-area-normal', 'design-area-error'],
  ]) {
    const input = scope.getByTestId(id);
    await input.focus();
    await finish(input);
    const before = await rect(input);
    const normal = await css(input, 'background-color');
    const error = await css(scope.getByTestId(errorId), 'background-color');
    await input.evaluate((node) => node.setAttribute('aria-invalid', 'true'));
    // The two pale papers differ by only a few 8-bit channel steps; sample before
    // easing rounds to the endpoint rather than mistaking quantization for a jump.
    const entering = await midpoint(input, 'background-color', null, 0.25);
    assert.notEqual(entering, normal, `${id}: error paint must progress.`);
    assert.notEqual(entering, error, `${id}: background must interpolate with its border.`);
    assert.equal(
      await css(input, 'outline-color'),
      await css(scope.getByTestId(errorId), 'border-top-color'),
      'Error focus remains immediate and legible.',
    );
    await finish(input);
    assert.equal(await css(input, 'background-color'), error);
    await input.evaluate((node) => node.removeAttribute('aria-invalid'));
    const leaving = await midpoint(input, 'background-color', null, 0.25);
    assert.notEqual(leaving, normal, `${id}: recovery uses the same finite paint transition.`);
    assert.notEqual(leaving, error);
    await finish(input);
    assert.equal(await css(input, 'background-color'), normal);
    assert.deepEqual(
      await rect(input),
      before,
      `${id}: field state changes never displace or resize its frame.`,
    );
    assert.equal(await input.evaluate((node) => document.activeElement === node), true);
    await input.evaluate((node) => node.setAttribute('aria-invalid', 'true'));
    await midpoint(input, 'background-color', null, 0.25);
    await input.evaluate((node) => {
      node.disabled = true;
    });
    assert(await noMotion(input), `${id}: disabling cancels an in-flight field transition.`);
    await input.evaluate((node) => {
      node.disabled = false;
      node.removeAttribute('aria-invalid');
    });
    await finish(input);
  }
  const field = scope.getByTestId('design-field-normal');
  const wrap = field.locator('..');
  const leading = scope.locator('.design-leading-normal');
  await field.focus();
  await field.evaluate((node) => node.setAttribute('aria-invalid', 'true'));
  await midpoint(field, 'background-color', null, 0.25);
  await field.evaluate((node) => {
    node.disabled = true;
  });
  assert(await noMotion(wrap), 'Disabled fields cancel input and leading-icon transitions.');
  assert.equal(
    await css(leading, 'color'),
    await css(scope.getByTestId('design-field-disabled'), 'color'),
  );
  await field.evaluate((node) => {
    node.disabled = false;
    node.removeAttribute('aria-invalid');
  });
  await finish(wrap);
  await field.focus();
  await field.evaluate((node) => node.setAttribute('aria-invalid', 'true'));
  await midpoint(field, 'background-color', null, 0.25);
  // Exercise native fieldset inheritance without adding a second source fixture.
  await field.evaluate((node) => {
    const fieldset = document.createElement('fieldset');
    const wrapper = node.parentElement;
    wrapper.before(fieldset);
    fieldset.append(wrapper);
    fieldset.disabled = true;
  });
  assert.equal(await field.evaluate((node) => node.matches(':disabled')), true);
  assert(await noMotion(wrap), 'Inherited fieldset disabling cancels the leading icon too.');
  await field.evaluate((node) => {
    const wrapper = node.parentElement;
    const fieldset = wrapper.parentElement;
    fieldset.before(wrapper);
    fieldset.remove();
    node.removeAttribute('aria-invalid');
  });
  await finish(wrap);
}

async function verifyChoicePaint(page, scope) {
  const group = scope.getByTestId('selection-radio');
  const first = group.getByRole('radio', { name: 'First selection', exact: true });
  const last = group.getByRole('radio', { name: 'Last selection', exact: true });
  const firstSize = (await rect(first)).slice(2);
  await first.focus();
  await page.keyboard.press('Space');
  assert.equal(await first.isChecked(), true, 'The native value changes before feedback finishes.');
  const opacity = Number(await midpoint(first, 'opacity', '::after'));
  const scale = await midpoint(first, 'transform', '::after');
  assert(opacity > 0 && opacity < 1, 'The selected dot appears gradually.');
  const scaleValue = Number(scale.match(/^matrix\(([^,]+)/)?.[1]);
  assert(scaleValue > 0.6 && scaleValue < 1, 'The dot grows only within its final circle.');
  await finish(first);
  assert.equal(Number(await css(first, 'opacity', '::after')), 1);
  await last.check();
  assert.equal(await first.isChecked(), false);
  assert.equal(await last.isChecked(), true);
  const clearing = Number(await midpoint(first, 'opacity', '::after'));
  assert(clearing > 0 && clearing < 1, 'The previous dot clears without a blink.');
  await finish(group);
  assert.equal(Number(await css(first, 'opacity', '::after')), 0);
  assert.equal(Number(await css(last, 'opacity', '::after')), 1);
  assert.deepEqual(
    (await rect(first)).slice(2),
    firstSize,
    'Dot feedback preserves the radio circle.',
  );
  const segments = scope.getByTestId('selection-segments');
  const next = segments.getByRole('radio', { name: 'Last selection', exact: true });
  const tile = next.locator('..');
  const size = (await rect(tile)).slice(2);
  const oldShadow = await css(tile, 'box-shadow');
  await next.focus();
  await page.keyboard.press('Space');
  assert.equal(await next.isChecked(), true);
  const shadow = await midpoint(tile, 'box-shadow');
  assert.notEqual(shadow, oldShadow, 'Selected inset paint visibly progresses.');
  await finish(tile);
  assert.notEqual(
    shadow,
    await css(tile, 'box-shadow'),
    'Inset feedback lands at its final depth.',
  );
  assert.deepEqual(
    (await rect(tile)).slice(2),
    size,
    'Segment feedback does not change its height or width.',
  );
  assert.equal(await next.evaluate((node) => document.activeElement === node), true);
}

async function verifySelectPaint(page, scope) {
  const trigger = scope.getByTestId('design-select-error');
  const icon = trigger.locator('span').last();
  await trigger.scrollIntoViewIfNeeded();
  const before = await rect(trigger);
  const errorColor = await css(trigger, 'border-top-color');
  await trigger.click();
  const list = page.getByRole('listbox');
  await list.waitFor();
  const popup = list.locator('..');
  const opening = Number(await midpoint(popup, 'opacity'));
  assert(opening > 0 && opening < 1, 'Select opens with a finite opacity transition.');
  const midway = await rect(popup);
  await finish(popup);
  assert.deepEqual(await rect(popup), midway, 'Select opacity feedback does not move its paper.');
  assert.equal(await css(icon, 'color'), errorColor, 'The open arrow retains the error meaning.');
  assert.deepEqual(await rect(trigger), before, 'Opening does not move the trigger.');
  async function cancelHighlightedPaper(handle) {
    await page.keyboard.press('ArrowDown');
    assert.notEqual(
      await page
        .getByRole('option', { name: 'Next design option', exact: true })
        .getAttribute('data-highlighted'),
      null,
      'The cancellation test highlights a different option from the selected value.',
    );
    assert(
      (await trigger.textContent()).includes('First design option'),
      'Highlighting does not commit before cancellation.',
    );
    await page.keyboard.press('Escape');
    assert(
      await noMotion(handle),
      'Closing removes its paint immediately, including an unfinished entry.',
    );
    await page.keyboard.press('Enter');
    assert(
      (await trigger.textContent()).includes('First design option'),
      'Escape followed by Enter cannot commit a stale highlighted option.',
    );
    // Enter may legitimately reopen the now-focused trigger; close that new paper as well.
    if ((await trigger.getAttribute('aria-expanded')) === 'true')
      await page.keyboard.press('Escape');
    await page.getByRole('listbox').waitFor({ state: 'detached' });
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await trigger.elementHandle(),
    );
  }
  await cancelHighlightedPaper(await popup.elementHandle());
  await trigger.click();
  const entering = page.getByRole('listbox').locator('..');
  await entering.waitFor();
  await midpoint(entering, 'opacity');
  await cancelHighlightedPaper(await entering.elementHandle());
  await trigger.click();
  await page.getByRole('option', { name: 'Next design option', exact: true }).click();
  await page.getByRole('listbox').waitFor({ state: 'detached' });
  assert((await trigger.textContent()).includes('Next design option'));
  assert.equal(
    await trigger.evaluate((node) => document.activeElement === node),
    true,
    'Choosing an option returns focus.',
  );
  await trigger.click();
  const other = scope.getByTestId('design-area-normal');
  await other.click();
  await page.getByRole('listbox').waitFor({ state: 'detached' });
  assert.equal(
    await other.evaluate((node) => document.activeElement === node),
    true,
    'Outside clicks preserve the newly chosen field focus.',
  );
}

async function verifyStaticStates(page, scope) {
  for (const media of [
    { reducedMotion: 'reduce', forcedColors: 'none' },
    { reducedMotion: 'no-preference', forcedColors: 'active' },
  ]) {
    await page.emulateMedia(media);
    const area = scope.getByTestId('design-area-normal');
    await area.evaluate((node) => {
      if (node.getAttribute('aria-invalid') === 'true') node.removeAttribute('aria-invalid');
      else node.setAttribute('aria-invalid', 'true');
    });
    assert(
      await noMotion(area),
      'Reduced motion and forced colors display field changes immediately.',
    );
    const radio = scope
      .getByTestId('selection-radio')
      .getByRole('radio', { name: 'First selection', exact: true });
    await radio.check();
    assert(
      await noMotion(radio.locator('..')),
      'The radio mark and row are static in accessibility modes.',
    );
    const segment = scope
      .getByTestId('selection-segments')
      .getByRole('radio', { name: 'First selection', exact: true });
    await segment.check();
    assert(
      await noMotion(segment.locator('..')),
      'The segment inset is static in accessibility modes.',
    );
    const select = scope.getByTestId('design-select-normal');
    await select.click();
    const popup = page.getByRole('listbox').locator('..');
    await popup.waitFor();
    assert(await noMotion(popup), 'Select paper is immediate in accessibility modes.');
    assert(await noMotion(select), 'Select arrow is immediate in accessibility modes.');
    await page.keyboard.press('Escape');
    await page.getByRole('listbox').waitFor({ state: 'detached' });
  }
}

export async function verifyFieldMotion(browser, url) {
  const context = await browser.newContext({
    reducedMotion: 'no-preference',
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  await page.addInitScript(() => {
    window.__choiceMountTransitions = [];
    document.addEventListener(
      'transitionrun',
      (event) => {
        if (
          event.target.matches?.('input[type="radio"]') ||
          event.target.querySelector?.('input[type="radio"]')
        )
          window.__choiceMountTransitions.push([event.propertyName, event.pseudoElement]);
      },
      true,
    );
  });
  try {
    await page.goto(`${url}?basics`);
    await page.getByRole('radio', { name: 'First mode', exact: true }).waitFor();
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.deepEqual(
      await page.evaluate(() => window.__choiceMountTransitions),
      [],
      'An enabled initially checked radio appears without an entrance animation.',
    );
    await page.goto(`${url}?design-contract`);
    const scope = page.locator('[data-design-theme="pink"]');
    await scope.getByTestId('selection-segments').waitFor();
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.deepEqual(
      await page.evaluate(() => window.__choiceMountTransitions),
      [],
      'Initial choices appear without an entrance animation.',
    );
    await verifySelectPaint(page, scope);
    await verifyChoicePaint(page, scope);
    await verifyFieldPaint(page, scope);
    await verifyStaticStates(page, scope);
    console.log(
      'Browser: field recovery, immediate disabled paint, finite radio/segment/Select feedback, exit safety, focus ownership and accessibility modes passed.',
    );
  } finally {
    await context.close();
  }
}
