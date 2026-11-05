import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const authorName = '把散步写成手记的作者库米';

async function requireFocus(page, locator) {
  const element = await locator.elementHandle();
  try {
    await page.waitForFunction((node) => document.activeElement === node, element);
  } finally {
    await element.dispose();
  }
}

async function requireNoDialog(page) {
  await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
}

async function requireSize(avatar, expected) {
  const computed = await avatar.evaluate((node) => {
    const css = getComputedStyle(node);
    return { width: parseFloat(css.width), height: parseFloat(css.height) };
  });
  assert.deepEqual(computed, { width: expected, height: expected });
  const geometry = await avatar.boundingBox();
  // Firefox's protocol bounding box can differ from its CSS size by a few millionths of a pixel.
  assert(Math.abs(geometry.width - expected) < 0.01);
  assert(Math.abs(geometry.height - expected) < 0.01);
  return geometry;
}

/** Verify the simple avatar sizes and fallback example independently of author dialogs. */
export async function verifyAvatarBasics(page, example) {
  const sizes = [];
  for (const [name, size, expected] of [
    ['小八', 'sm', 32],
    ['吉伊', 'md', 44],
    ['乌萨奇', 'lg', 64],
  ]) {
    const avatar = example.getByRole('img', { name, exact: true });
    assert.equal(await avatar.count(), 1);
    assert.equal(await avatar.getAttribute('data-size'), size);
    const geometry = await requireSize(avatar, expected);
    sizes.push({ name, size, width: geometry.width, height: geometry.height });
  }
  const anonymous = example.getByRole('img', { name: '匿名用户', exact: true });
  assert.equal(await anonymous.count(), 1);
  assert.equal(await anonymous.textContent(), '?');
  assert.equal(await anonymous.evaluate((node) => node.tabIndex), -1);

  const custom = example.getByRole('img', { name: authorName, exact: true });
  assert.equal(await custom.textContent(), '米');
  assert.equal(await custom.evaluate((node) => node.tabIndex), -1);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  return { sizes, anonymousFallback: '?', customFallback: '米' };
}

/** Keep identity display decorative and author actions on their own named button. */
export async function verifyAvatarAuthor(page, example) {
  await revealExample(example);
  const group = example.getByRole('group', { name: authorName, exact: true });
  const trigger = group.getByRole('button', { name: '查看作者介绍', exact: true });
  const authorText = group.getByText(authorName, { exact: true });
  const decorative = group.locator(`span[role="img"][aria-label="${authorName}"]`);
  const dialog = page.getByRole('dialog', { name: '关于库米', exact: true });
  const close = dialog.getByRole('button', { name: '关闭介绍', exact: true });
  let originalError;
  let result;
  let stage = 'initial identity';
  const flows = [];
  await trigger.waitFor();
  const originalTrigger = await trigger.elementHandle();
  const originalAvatar = await decorative.elementHandle();

  async function requireIdentity() {
    assert.equal(await group.count(), 1);
    assert.equal(await authorText.count(), 1);
    assert.equal(await example.getByRole('img', { name: authorName, exact: true }).count(), 0);
    assert.equal(await decorative.count(), 1);
    assert.equal(await decorative.textContent(), '米');
    assert.equal(await decorative.getAttribute('aria-hidden'), 'true');
    assert.equal(await trigger.getAttribute('aria-haspopup'), 'dialog');
    assert.equal(await trigger.getAttribute('data-variant'), 'ghost');
    assert.equal(await trigger.evaluate((node, old) => node === old, originalTrigger), true);
    assert.equal(await decorative.evaluate((node, old) => node === old, originalAvatar), true);
    const semantics = await decorative.evaluate((node) => ({
      tag: node.tagName,
      tabIndex: node.tabIndex,
      clickHandler: node.onclick !== null,
      interactiveAncestor: !!node.closest('button, a, [role="button"], [role="link"]'),
      interactiveDescendants: node.querySelectorAll('button, a, input, [tabindex]').length,
    }));
    assert.deepEqual(semantics, {
      tag: 'SPAN',
      tabIndex: -1,
      clickHandler: false,
      interactiveAncestor: false,
      interactiveDescendants: 0,
    });
    assert.equal(await group.getByRole('button').count(), 1);
    assert.equal(await group.getByRole('link').count(), 0);
    assert.equal(await group.locator('[role="status"], [role="alert"], [aria-live]').count(), 0);
  }

  try {
    await requireNoDialog(page);
    await requireIdentity();
    assert.equal(await authorText.isVisible(), true);
    const textGeometry = await authorText.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return {
        text: node.textContent,
        left: box.left,
        right: box.right,
        width: box.width,
        height: box.height,
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    assert(textGeometry.width > 0);
    assert(textGeometry.left >= -1 && textGeometry.right <= textGeometry.viewportWidth + 1);
    assert(textGeometry.scrollWidth <= textGeometry.clientWidth + 1);
    assert(textGeometry.documentWidth <= textGeometry.viewportWidth + 1);

    stage = 'decorative avatar pointer';
    await decorative.click();
    await requireNoDialog(page);

    for (const [openKey, closeMethod] of [
      ['Enter', 'Space'],
      ['Space', 'Escape'],
      ['Enter', 'Enter'],
      ['Space', 'pointer'],
    ]) {
      stage = `open with ${openKey}, close with ${closeMethod}`;
      await trigger.focus();
      await trigger.press(openKey);
      await dialog.waitFor();
      assert.equal(await page.locator('[role="dialog"]').count(), 1);
      assert.equal(await dialog.getByRole('heading', { name: '关于库米', exact: true }).count(), 1);
      assert.equal(await close.count(), 1);
      await requireFocus(page, close);
      assert.equal(await dialog.getByText('散步、阅读与日常手记。', { exact: true }).count(), 1);
      assert.equal(
        await dialog
          .getByText(
            '你好，我是库米。散步时会记下花店几点开门，也常常被面包香带着拐弯。手记里有路边的发现，偶尔也有点心的碎屑。',
            { exact: true },
          )
          .count(),
        1,
      );
      if (closeMethod === 'Escape') await page.keyboard.press('Escape');
      else if (closeMethod === 'pointer') await close.click();
      else await close.press(closeMethod);
      await requireNoDialog(page);
      await requireFocus(page, trigger);
      await requireIdentity();
      flows.push({ openKey, closeMethod, initialFocus: '关闭介绍', finalFocus: '查看作者介绍' });
    }
    result = { textGeometry, authorAvatarDecorative: true, flows };
  } catch (error) {
    error.message = `AvatarAuthor [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      if (await page.locator('[role="dialog"]').count()) {
        await page.keyboard.press('Escape');
        await requireNoDialog(page);
        await requireFocus(page, trigger);
      }
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      await originalTrigger.dispose();
      await originalAvatar.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}

/** Wait for Avatar's actual loaded state, then verify image failure and recovery on the same root. */
export async function verifyAvatarPicture(page, example) {
  const avatar = example.getByRole('img', { name: '小八', exact: true });
  const status = example.getByRole('status');
  await avatar.waitFor();
  const originalAvatar = await avatar.elementHandle();
  let originalError;
  let result;
  let stage = 'initial image ready';
  const states = [];

  async function requireLoaded() {
    await page.waitForFunction((node) => {
      const image = node.querySelector('img[data-loaded]');
      return !!(
        image &&
        image.complete &&
        image.naturalWidth > 0 &&
        getComputedStyle(image).opacity === '1'
      );
    }, originalAvatar);
    assert.equal(await avatar.locator('img').count(), 1);
    assert.equal(await avatar.locator('img').getAttribute('alt'), '');
    assert.equal(await avatar.locator('img').getAttribute('aria-hidden'), 'true');
    assert.equal(await avatar.locator('span[aria-hidden="true"]').count(), 0);
    assert.equal(await status.textContent(), '当前选择：本地图片。');
  }

  async function recordGeometry(state) {
    assert.equal(await avatar.evaluate((node, old) => node === old, originalAvatar), true);
    assert.equal(await avatar.getAttribute('data-size'), 'lg');
    assert.equal(await avatar.evaluate((node) => node.tabIndex), -1);
    // The public default lg size is 64px; verify the rendered value at every image stage.
    const geometry = await requireSize(avatar, 64);
    assert.equal(await status.count(), 1);
    assert.equal(await example.locator('[aria-live]').count(), 0);
    assert.equal(await example.getByRole('alert').count(), 0);
    states.push({
      state,
      width: geometry.width,
      height: geometry.height,
      text: await status.textContent(),
    });
  }

  try {
    await requireLoaded();
    await recordGeometry('loaded');
    stage = 'failed source falls back';
    const breakImage = example.getByRole('button', { name: '模拟图片失效', exact: true });
    await breakImage.focus();
    await breakImage.press('Enter');
    await page.waitForFunction(
      (node) => !node.querySelector('img') && node.textContent === '小八',
      originalAvatar,
    );
    assert.equal(await avatar.locator('span[aria-hidden="true"]').textContent(), '小八');
    assert.equal(await status.textContent(), '图片暂不可用，已显示姓名回退。');
    await recordGeometry('fallback');
    stage = 'restored source becomes loaded';
    const restore = example.getByRole('button', { name: '恢复头像', exact: true });
    await restore.focus();
    await restore.press('Space');
    await requireLoaded();
    await recordGeometry('restored');
    result = { states, stableRoot: true, loadedStateWaited: true };
  } catch (error) {
    error.message = `AvatarPicture [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      const restore = example.getByRole('button', { name: '恢复头像', exact: true });
      if (await restore.count()) await restore.click();
      await requireLoaded();
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      await originalAvatar.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}
