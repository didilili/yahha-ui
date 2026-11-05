import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const comment = '读到小八在面包店门口站住，我也饿了。那张路线图记得把店名补上。';
const errorMessage = '请填写昵称，或选择匿名预览。';
const resultMessage = '预览已更新，内容未发布。';

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

/** Validate the local signature task through native fields, keys, FormData and reset actions. */
export async function verifyRadioSignature(page, example) {
  await revealExample(example);
  const group = example.getByRole('group', { name: '留言署名', exact: true });
  const named = group.getByRole('radio', { name: '使用昵称', exact: true });
  const anonymous = group.getByRole('radio', { name: '匿名', exact: true });
  const input = example.getByRole('textbox', { name: '昵称', exact: true });
  const previewButton = example.getByRole('button', { name: '预览留言', exact: true });
  const reset = example.getByRole('button', { name: '重置示例', exact: true });
  const status = example.getByRole('status');
  const preview = example.getByRole('region', { name: '留言预览', exact: true });
  const error = example.getByText(errorMessage, { exact: true });
  await input.waitFor();
  const originalInput = await input.elementHandle();
  let stage = 'initial';
  let originalError;
  let anonymousTabTarget;

  async function requireFormData(signature, nickname) {
    const actual = await input.evaluate((node) => {
      const data = new FormData(node.form);
      return {
        signature: data.get('signature'),
        hasNickname: data.has('nickname'),
        nickname: data.get('nickname'),
      };
    });
    assert.deepEqual(actual, {
      signature,
      hasNickname: signature === 'nickname',
      nickname: signature === 'nickname' ? nickname : null,
    });
  }

  async function requireMode(signature, nickname) {
    await page.waitForFunction(
      ({ node, disabled }) => node.disabled === disabled && node.required === !disabled,
      { node: originalInput, disabled: signature === 'anonymous' },
    );
    assert.equal(await named.isChecked(), signature === 'nickname');
    assert.equal(await anonymous.isChecked(), signature === 'anonymous');
    assert.equal(await input.inputValue(), nickname);
    assert.equal(await input.evaluate((node, original) => node === original, originalInput), true);
    await requireFormData(signature, nickname);
  }

  async function requireNoPreview() {
    assert.equal(await preview.count(), 0);
    assert.equal(await status.count(), 1);
    assert.equal((await status.textContent()).trim(), '');
  }

  async function requirePreview(author) {
    await preview.waitFor();
    await status.getByText(resultMessage, { exact: true }).waitFor();
    assert.equal(await preview.getByText(`署名：${author}`, { exact: true }).count(), 1);
    assert.equal(await preview.getByText(comment, { exact: true }).count(), 1);
    assert.equal(await status.count(), 1);
    assert.equal(await preview.getByRole('status').count(), 0);
    assert.equal(await error.count(), 0);
  }

  async function requireInitial() {
    await requireMode('nickname', '');
    await requireNoPreview();
    assert.equal(await error.count(), 0);
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
  }

  try {
    await requireInitial();
    assert.equal(await reset.getAttribute('type'), 'reset');
    assert.equal(await input.evaluate((node) => node.closest('label') === null), true);
    assert.equal(
      await group.getByRole('textbox').count(),
      0,
      'The nickname input stays outside the radio group.',
    );

    stage = 'empty and whitespace validation';
    await previewButton.click();
    await error.waitFor();
    await requireFocus(page, input);
    assert.equal(await input.inputValue(), '');
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    await requireNoPreview();
    await input.fill('   ');
    assert.equal(await error.count(), 0, 'Editing clears the previous error.');
    await previewButton.click();
    await error.waitFor();
    await requireFocus(page, input);
    assert.equal(await input.inputValue(), '   ', 'Trim validation preserves the original draft.');
    await requireNoPreview();
    await reset.click();
    await requireInitial();

    stage = 'named preview reads the native form';
    const nickname = '  河边的读者  ';
    await input.fill(nickname);
    await requireMode('nickname', nickname);
    await previewButton.click();
    await requirePreview('河边的读者');
    await previewButton.click();
    await requirePreview('河边的读者');
    assert.equal(
      await input.inputValue(),
      nickname,
      'Preview formatting does not rewrite the input.',
    );

    stage = 'Arrow selection preserves the anonymous draft and omits it from FormData';
    await named.focus();
    await named.press('ArrowDown');
    await requireMode('anonymous', nickname);
    await requireFocus(page, anonymous);
    await requireNoPreview();
    await page.keyboard.press('Tab');
    anonymousTabTarget = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        tag: active?.tagName,
        type: active?.getAttribute('type'),
        name: active?.getAttribute('name'),
        text: active?.textContent?.trim().slice(0, 100),
      };
    });
    assert.equal(await input.evaluate((node) => document.activeElement === node), false);
    assert.equal(await group.evaluate((node) => node.contains(document.activeElement)), false);
    // Native Tab policies may skip buttons; the disabled nickname must still be skipped.
    await previewButton.focus();
    await previewButton.press('Enter');
    await requirePreview('匿名读者');
    assert.equal((await preview.textContent()).includes('河边的读者'), false);
    await previewButton.click();
    await requirePreview('匿名读者');

    stage = 'Space returns to the preserved nickname';
    await named.focus();
    await named.press('Space');
    await requireMode('nickname', nickname);
    await requireFocus(page, named);
    await requireNoPreview();
    await previewButton.click();
    await requirePreview('河边的读者');
    await input.fill('改过名字的读者');
    await requireNoPreview();
    await requireMode('nickname', '改过名字的读者');

    for (const [index, method] of ['button', 'programmatic', 'button', 'programmatic'].entries()) {
      stage = `${method} reset ${index + 1}`;
      await input.fill(`第${index + 1}次昵称草稿`);
      await anonymous.check();
      await requireMode('anonymous', `第${index + 1}次昵称草稿`);
      await previewButton.click();
      await requirePreview('匿名读者');
      if (method === 'button') await reset.click();
      else await input.evaluate((node) => node.form.reset());
      await requireInitial();
    }

    stage = 'reset also clears a validation error';
    await previewButton.click();
    await error.waitFor();
    await requireFocus(page, input);
    await input.evaluate((node) => node.form.reset());
    await requireInitial();
  } catch (failure) {
    failure.message = `RadioGroupCommentSignature [${stage}]: ${failure.message}`;
    originalError = failure;
  } finally {
    try {
      await reset.focus();
      await reset.click();
      await requireInitial();
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    } finally {
      await originalInput.dispose();
    }
  }
  if (originalError) throw originalError;
  return { anonymousTabTarget };
}
