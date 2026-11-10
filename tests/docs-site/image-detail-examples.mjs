import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { revealExample } from './reveal-example.mjs';

const alternativeText = '冒着热气的茶杯插画';
const caption = '刚倒好的茶，还冒着热气。';
const assetName = 'little-days-tea-cup.svg';

async function requireFocus(page, node) {
  const element = await node.elementHandle();
  try {
    await page.waitForFunction((target) => document.activeElement === target, element);
  } finally {
    await element.dispose();
  }
}

async function requireLoadedImage(page, image) {
  const element = await image.elementHandle();
  try {
    await page.waitForFunction(
      (node) =>
        node.complete &&
        node.naturalWidth > 0 &&
        !node.hidden &&
        node.closest('[data-status]')?.dataset.status === 'loaded',
      element,
    );
    return await image.evaluate((node) => {
      const bounds = (element) => {
        const r = element.getBoundingClientRect();
        return {
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      };
      const frame = node.closest('[data-status]');
      return {
        tag: node.tagName,
        src: node.currentSrc,
        alt: node.alt,
        widthAttribute: node.getAttribute('width'),
        heightAttribute: node.getAttribute('height'),
        naturalWidth: node.naturalWidth,
        naturalHeight: node.naturalHeight,
        tabIndex: node.tabIndex,
        rect: bounds(node),
        frame: bounds(frame),
        frameStatus: frame.dataset.status,
        frameClientWidth: frame.clientWidth,
        frameScrollWidth: frame.scrollWidth,
        interactiveAncestor: !!node.closest('button, a, [role="button"], [role="link"]'),
      };
    });
  } finally {
    await element.dispose();
  }
}

function requireSquareImage(image) {
  assert.equal(image.tag, 'IMG');
  assert.equal(image.alt, alternativeText);
  assert.equal(image.widthAttribute, '96');
  assert.equal(image.heightAttribute, '96');
  assert.equal(image.frameStatus, 'loaded');
  assert(image.naturalWidth > 0 && image.naturalHeight > 0);
  assert(Math.abs(image.rect.width - image.rect.height) < 0.1);
  assert(Math.abs(image.frame.width - image.frame.height) < 0.1);
  assert(image.frameScrollWidth <= image.frameClientWidth + 1);
  assert.equal(image.tabIndex, -1);
  assert.equal(image.interactiveAncestor, false);
}

/** Open a local illustration through an explicit button; keep native image/figure semantics. */
export async function verifyImageDetail(page, example) {
  await revealExample(example);
  const figure = example.locator('figure');
  const thumbnail = figure.getByRole('img', { name: alternativeText, exact: true });
  const trigger = example.getByRole('button', { name: '查看热茶插画大图', exact: true });
  const dialog = page.getByRole('dialog', { name: '热茶插画', exact: true });
  const close = dialog.getByRole('button', { name: '关闭大图', exact: true });
  await trigger.waitFor();
  const originalTrigger = await trigger.elementHandle();
  const originalThumbnail = await thumbnail.elementHandle();
  let originalError;
  let result;
  let stage = 'thumbnail';
  const flows = [];
  try {
    assert.equal(await page.locator('[role="dialog"]').count(), 0);
    assert.equal(await figure.count(), 1);
    assert.equal(await figure.locator('figcaption').textContent(), caption);
    assert.equal(await trigger.getAttribute('aria-haspopup'), 'dialog');
    const thumb = await requireLoadedImage(page, thumbnail);
    requireSquareImage(thumb);
    assert(thumb.rect.width > 0 && thumb.rect.width <= 180);
    const assetURL = new URL(thumb.src, page.url());
    assert.match(assetURL.protocol, /^https?:$/);
    const response = await page.request.get(assetURL.href);
    assert.equal(response.status(), 200);
    assert.match(response.headers()['content-type'] ?? '', /^image\/svg\+xml(?:;|$)/);
    const assetBytes = await response.body();
    assert.match(assetBytes.toString(), /viewBox="0 0 96 96"/);
    assert.match(assetBytes.toString(), /data-motion="off"/);

    stage = 'image pointer does not open dialog';
    await thumbnail.click();
    assert.equal(await page.locator('[role="dialog"]').count(), 0);

    for (const [openMethod, closeMethod] of [
      ['Enter', 'Escape'],
      ['Space', 'Enter'],
      ['pointer', 'Space'],
      ['Enter', 'pointer'],
    ]) {
      stage = `open ${openMethod}, close ${closeMethod}`;
      // All background role lookups happen before opening; modal isolation hides them afterward.
      await trigger.focus();
      if (openMethod === 'pointer') await trigger.click();
      else await trigger.press(openMethod);
      await dialog.waitFor();
      assert.equal(await page.locator('[role="dialog"]').count(), 1);
      const popup = await dialog.elementHandle();
      try {
        await page.waitForFunction(
          (node) =>
            !node.hasAttribute('data-starting-style') && getComputedStyle(node).opacity === '1',
          popup,
        );
      } finally {
        await popup.dispose();
      }
      await requireFocus(page, close);
      assert.equal(await dialog.locator('figure').count(), 1);
      assert.equal(await dialog.locator('figcaption').textContent(), caption);
      const large = await requireLoadedImage(
        page,
        dialog.getByRole('img', { name: alternativeText, exact: true }),
      );
      requireSquareImage(large);
      assert.equal(large.src, thumb.src);
      assert(
        large.rect.width > thumb.rect.width + 1,
        'The full illustration is larger than its thumbnail at this viewport.',
      );
      const closeRect = await close.boundingBox();
      assert(closeRect.width >= 44 - 0.01 && closeRect.height >= 44 - 0.01);
      const geometry = await dialog.evaluate((node) => ({
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        left: node.getBoundingClientRect().left,
        right: node.getBoundingClientRect().right,
      }));
      assert(geometry.documentWidth <= geometry.viewportWidth + 1);
      assert(geometry.scrollWidth <= geometry.clientWidth + 1);
      assert(geometry.left >= -1 && geometry.right <= geometry.viewportWidth + 1);
      if (closeMethod === 'Escape') await page.keyboard.press('Escape');
      else if (closeMethod === 'pointer') await close.click();
      else await close.press(closeMethod);
      await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
      await requireFocus(page, trigger);
      assert.equal(await trigger.evaluate((node, old) => node === old, originalTrigger), true);
      assert.equal(await thumbnail.evaluate((node, old) => node === old, originalThumbnail), true);
      flows.push({
        openMethod,
        closeMethod,
        largeImage: large,
        closeRect,
        geometry,
        finalFocus: '查看热茶插画大图',
      });
    }
    result = {
      thumbnail: thumb,
      asset: {
        url: assetURL.href,
        status: response.status(),
        bytes: assetBytes.length,
        sha256: createHash('sha256').update(assetBytes).digest('hex'),
      },
      caption,
      flows,
    };
  } catch (error) {
    error.message = `ImageDetail [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      if (await page.locator('[role="dialog"]').count()) {
        await page.keyboard.press('Escape');
        await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
        await requireFocus(page, trigger);
      }
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      await originalTrigger.dispose();
      await originalThumbnail.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}

/** Preserve the existing failure/recovery example's actual 5:3 frame and accessible alternative. */
export async function verifyImageFallback(page, example) {
  const frame = example.locator('figure > [data-framed]');
  const status = example.getByRole('status');
  await frame.waitFor();
  const originalFrame = await frame.elementHandle();
  const states = [];
  let originalError;
  let result;
  let stage = 'initial failure';
  async function requireState(expected) {
    await page.waitForFunction(({ node, state }) => node.dataset.status === state, {
      node: originalFrame,
      state: expected,
    });
    assert.equal(await frame.evaluate((node, old) => node === old, originalFrame), true);
    const accessibleImage = example.getByRole('img', { name: '示例文章封面', exact: true });
    assert.equal(await accessibleImage.count(), 1);
    const box = await frame.boundingBox();
    assert(Math.abs(box.width - (box.height * 5) / 3) < 0.1);
    assert.equal(await status.count(), 1);
    assert.equal(await example.locator('[aria-live]').count(), 0);
    assert.equal(await example.locator('figcaption').textContent(), '周末手记的封面。');
    if (expected === 'error') {
      assert.equal(await accessibleImage.evaluate((node) => node.tagName), 'DIV');
      assert.equal(await frame.locator('img').evaluate((node) => node.hidden), true);
      assert.equal(await status.textContent(), '图片暂不可用，正文仍可继续阅读。');
    } else {
      const loaded = await requireLoadedImage(page, accessibleImage);
      assert.equal(loaded.alt, '示例文章封面');
      assert.equal(loaded.naturalWidth, 500);
      assert.equal(loaded.naturalHeight, 300);
      assert.equal(await status.textContent(), '图片已恢复。');
    }
    states.push({
      state: expected,
      width: box.width,
      height: box.height,
      status: await status.textContent(),
    });
  }
  try {
    await requireState('error');
    stage = 'recover';
    const restore = example.getByRole('button', { name: '恢复图片', exact: true });
    await restore.focus();
    await restore.press('Enter');
    await requireState('loaded');
    stage = 'fail again';
    const fail = example.getByRole('button', { name: '再次模拟失败', exact: true });
    await fail.focus();
    await fail.press('Space');
    await requireState('error');
    result = { states, stableFrame: true };
  } catch (error) {
    error.message = `ImageFallback [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      const fail = example.getByRole('button', { name: '再次模拟失败', exact: true });
      if (await fail.count()) await fail.click();
      await page.waitForFunction((node) => node.dataset.status === 'error', originalFrame);
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      await originalFrame.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}

/** Exercise the real documentation download and compare it with the displayed illustration bytes. */
export async function verifyImageAssetDownload(page, example) {
  await revealExample(example);
  const details = example.locator('details.example-assets');
  const summary = details.locator('summary');
  const originallyOpen = await details.evaluate((node) => node.open);
  const thumbnail = example
    .locator('.example-preview figure')
    .getByRole('img', { name: alternativeText, exact: true });
  const source = await requireLoadedImage(page, thumbnail);
  const sourceURL = new URL(source.src, page.url());
  let result;
  try {
    if (!originallyOpen) await summary.click();
    const link = details.getByRole('link', { name: `下载 ${assetName}`, exact: true });
    await link.waitFor();
    assert.equal(await link.getAttribute('download'), assetName);
    assert.equal(await details.getByText(`artwork/${assetName}`, { exact: true }).count(), 1);
    const assetURL = new URL(await link.getAttribute('href'), page.url());
    assert.match(assetURL.protocol, /^https?:$/);
    const [sourceResponse, downloadResponse] = await Promise.all([
      page.request.get(sourceURL.href),
      page.request.get(assetURL.href),
    ]);
    for (const response of [sourceResponse, downloadResponse]) {
      assert.equal(response.status(), 200);
      assert.match(response.headers()['content-type'] ?? '', /^image\/svg\+xml(?:;|$)/);
    }
    const sourceBytes = await sourceResponse.body();
    assert.deepEqual(await downloadResponse.body(), sourceBytes);
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    assert.equal(await download.failure(), null);
    assert.equal(download.suggestedFilename(), assetName);
    const downloadedPath = await download.path();
    assert(downloadedPath);
    const downloadedBytes = await readFile(downloadedPath);
    assert.deepEqual(downloadedBytes, sourceBytes);
    result = {
      sourceURL: sourceURL.href,
      downloadURL: assetURL.href,
      suggestedFilename: download.suggestedFilename(),
      bytes: downloadedBytes.length,
      sha256: createHash('sha256').update(downloadedBytes).digest('hex'),
      bothHTTP200: true,
      downloadedBytesMatchDisplayedResource: true,
    };
  } finally {
    const nowOpen = await details.evaluate((node) => node.open);
    if (nowOpen !== originallyOpen) await summary.click();
    assert.equal(await details.evaluate((node) => node.open), originallyOpen);
  }
  return result;
}
