import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const articleTitles = ['周末的散步记录', '给小花换一个花盆', 'Weekend reading notes'];

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function requireFocus(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

// These events exercise the example's state handling; they are not native macOS IME evidence.
async function syntheticInput(input, value, isComposing) {
  await input.evaluate(
    (node, options) => {
      const view = node.ownerDocument.defaultView;
      const setter = Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value').set;
      setter.call(node, options.value);
      node.dispatchEvent(
        new view.InputEvent('input', {
          bubbles: true,
          inputType: options.isComposing ? 'insertCompositionText' : 'insertText',
          data: options.value,
          isComposing: options.isComposing,
        }),
      );
    },
    { value, isComposing },
  );
}

async function syntheticComposition(input, type, value, data = '') {
  await input.evaluate(
    (node, options) => {
      const view = node.ownerDocument.defaultView;
      if (options.value !== null) {
        const setter = Object.getOwnPropertyDescriptor(
          view.HTMLInputElement.prototype,
          'value',
        ).set;
        setter.call(node, options.value);
      }
      node.dispatchEvent(
        new view.CompositionEvent(options.type, { bubbles: true, data: options.data }),
      );
    },
    { type, value, data },
  );
}

export async function verifyTextFieldSearch(page, example) {
  await revealExample(example);
  const input = example.getByRole('textbox', { name: '搜索本地手记', exact: true });
  const clear = example.getByRole('button', { name: '清空手记搜索', exact: true });
  const status = example.getByRole('status');
  const list = example.getByRole('list', { name: '匹配的手记', exact: true });
  await input.waitFor();

  async function requireResults(query, titles) {
    const summary = `${query ? `“${query}”：` : ''}找到 ${titles.length} 篇手记。`;
    await status.getByText(summary, { exact: true }).waitFor();
    assert.equal(await status.count(), 1, 'Search has one result announcement.');
    assert.equal(await clear.getAttribute('aria-label'), '清空手记搜索');
    if (titles.length) {
      assert.deepEqual(await list.getByRole('listitem').allTextContents(), titles);
    } else {
      assert.equal(await list.count(), 0);
      assert.equal(
        await example
          .getByText('没有匹配的手记，可以换个关键词或清空搜索。', { exact: true })
          .count(),
        1,
      );
    }
  }

  assert.equal(await input.inputValue(), '');
  assert.equal(await clear.isDisabled(), true);
  await requireResults('', articleTitles);

  await syntheticComposition(input, 'compositionstart', null);
  await syntheticInput(input, 'zhou', true);
  await settle(page);
  assert.equal(await input.inputValue(), 'zhou');
  assert.equal(
    await clear.isDisabled(),
    false,
    'Synthetic composition updates React editing state as well as the DOM value.',
  );
  await requireResults('', articleTitles);
  await syntheticComposition(input, 'compositionend', '', '');
  await settle(page);
  assert.equal(await input.inputValue(), '');
  assert.equal(await clear.isDisabled(), true);
  await requireResults('', articleTitles);

  await input.fill('weekend');
  await requireResults('weekend', [articleTitles[2]]);
  await input.fill('散步');
  await requireResults('散步', [articleTitles[0]]);
  await clear.focus();
  await clear.press('Enter');
  await requireFocus(page, input);
  assert.equal(await input.inputValue(), '');
  assert.equal(await clear.isDisabled(), true);
  await requireResults('', articleTitles);

  await input.fill('没有这篇手记');
  await requireResults('没有这篇手记', []);
  await input.fill('weekend');
  await requireResults('weekend', [articleTitles[2]]);

  await syntheticComposition(input, 'compositionstart', null);
  await syntheticInput(input, 'san', true);
  await settle(page);
  assert.equal(
    await input.inputValue(),
    'san',
    'Editing text updates during synthetic composition.',
  );
  await requireResults('weekend', [articleTitles[2]]);
  await syntheticInput(input, 'sanbu', true);
  await settle(page);
  assert.equal(await input.inputValue(), 'sanbu');
  await requireResults('weekend', [articleTitles[2]]);

  // The complete input value deliberately differs from event.data.
  await syntheticComposition(input, 'compositionend', '散步', 'Weekend reading notes');
  await requireResults('散步', [articleTitles[0]]);
  assert.equal(await input.inputValue(), '散步');
  await syntheticInput(input, '散步', false);
  await settle(page);
  await requireResults('散步', [articleTitles[0]]);

  // A canceled session restores the existing value; ending composition is not a submission.
  await syntheticComposition(input, 'compositionstart', null);
  await syntheticInput(input, 'quxiao', true);
  await settle(page);
  assert.equal(await input.inputValue(), 'quxiao');
  await requireResults('散步', [articleTitles[0]]);
  await syntheticComposition(input, 'compositionend', '散步', '');
  await requireResults('散步', [articleTitles[0]]);
  assert.equal(await input.inputValue(), '散步');

  await clear.focus();
  await clear.press('Enter');
  await requireFocus(page, input);
  await requireResults('', articleTitles);
  assert.equal(await input.inputValue(), '');
  await input.fill('花盆');
  await requireResults('花盆', [articleTitles[1]]);
}

async function setClipboardMode(page, mode) {
  await page.evaluate((nextMode) => {
    const probe = window.__yahhaTextFieldCopyProbe;
    probe.writes = [];
    probe.pending = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value:
        nextMode === 'unavailable'
          ? undefined
          : {
              writeText: (text) => {
                probe.writes.push(text);
                if (nextMode === 'denied')
                  return Promise.reject(new DOMException('Denied', 'NotAllowedError'));
                if (nextMode === 'pending')
                  return new Promise((resolve, reject) => probe.pending.push({ resolve, reject }));
                return Promise.resolve();
              },
            },
    });
  }, mode);
}

async function settleClipboardRequest(page, index, outcome) {
  await page.evaluate(
    ({ requestIndex, result }) => {
      const pending = window.__yahhaTextFieldCopyProbe.pending[requestIndex];
      if (result === 'resolve') pending.resolve();
      else pending.reject(new DOMException('Denied', 'NotAllowedError'));
    },
    { requestIndex: index, result: outcome },
  );
  await settle(page);
}

export async function verifyTextFieldCopy(page, example, nativeClipboard = false) {
  await revealExample(example);
  const input = example.getByRole('textbox', { name: '示例订阅地址', exact: true });
  const copy = example.getByRole('button', { name: '复制示例订阅地址', exact: true });
  const status = example.getByRole('status');
  const success = '示例地址已复制。';
  const failure = '未能复制，请选中地址后使用系统复制。';
  await input.waitFor();
  const address = await input.inputValue();
  assert.equal(address, 'https://example.com/notes/feed.xml');
  assert.equal(await copy.getAttribute('type'), 'button');

  async function requireMessage(message) {
    await status.getByText(message, { exact: true }).waitFor();
    assert.equal(await status.count(), 1, 'Copy has one result announcement.');
    assert.equal(await copy.getAttribute('aria-label'), '复制示例订阅地址');
    assert.equal(await input.getAttribute('readonly'), '');
    assert.equal(await input.inputValue(), address);
  }

  async function requireSelectedAddress() {
    await requireFocus(page, input);
    assert.deepEqual(await input.evaluate((node) => [node.selectionStart, node.selectionEnd]), [
      0,
      address.length,
    ]);
  }

  async function beginPendingRequest(expectedCount) {
    await copy.focus();
    await copy.press('Enter');
    await page.waitForFunction(
      (count) => window.__yahhaTextFieldCopyProbe.pending.length === count,
      expectedCount,
    );
  }

  await page.evaluate(() => {
    window.__yahhaTextFieldCopyProbe = {
      descriptor: Object.getOwnPropertyDescriptor(navigator, 'clipboard'),
      writes: [],
      pending: [],
      focusProbe: null,
    };
  });

  try {
    assert.equal(await status.count(), 1);
    if (!nativeClipboard) await setClipboardMode(page, 'success');
    await copy.focus();
    await copy.press('Enter');
    await requireMessage(success);
    assert.equal(
      nativeClipboard
        ? await page.evaluate(() => navigator.clipboard.readText())
        : await page.evaluate(() => window.__yahhaTextFieldCopyProbe.writes.at(-1)),
      address,
    );

    await setClipboardMode(page, 'denied');
    await copy.focus();
    await copy.press('Space');
    await requireMessage(failure);
    await requireSelectedAddress();

    await setClipboardMode(page, 'unavailable');
    await copy.focus();
    await copy.press('Enter');
    await requireMessage(failure);
    await requireSelectedAddress();

    await setClipboardMode(page, 'pending');
    await beginPendingRequest(1);
    // This native test-only control avoids relying on the documentation shell or other components.
    await page.evaluate(() => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'TextField copy focus probe';
      document.body.append(button);
      window.__yahhaTextFieldCopyProbe.focusProbe = button;
      button.focus({ preventScroll: true });
    });
    await settleClipboardRequest(page, 0, 'reject');
    await requireMessage(failure);
    assert.equal(
      await page.evaluate(
        () => document.activeElement === window.__yahhaTextFieldCopyProbe.focusProbe,
      ),
      true,
      'A delayed denial must not steal focus from a different control.',
    );

    await setClipboardMode(page, 'pending');
    await beginPendingRequest(1);
    await input.focus();
    await input.evaluate((node) => node.setSelectionRange(2, 7));
    await settleClipboardRequest(page, 0, 'reject');
    await requireMessage(failure);
    await requireFocus(page, input);
    assert.deepEqual(
      await input.evaluate((node) => [node.selectionStart, node.selectionEnd]),
      [2, 7],
      'A delayed denial must not replace the selection the reader made.',
    );

    await setClipboardMode(page, 'pending');
    await beginPendingRequest(1);
    await beginPendingRequest(2);
    await settleClipboardRequest(page, 1, 'reject');
    await requireMessage(failure);
    await requireSelectedAddress();
    await settleClipboardRequest(page, 0, 'resolve');
    await requireMessage(failure);
    await requireSelectedAddress();

    await setClipboardMode(page, 'pending');
    await beginPendingRequest(1);
    await beginPendingRequest(2);
    await settleClipboardRequest(page, 1, 'resolve');
    await requireMessage(success);
    await requireFocus(page, copy);
    await settleClipboardRequest(page, 0, 'reject');
    await requireMessage(success);
    await requireFocus(page, copy);
    assert.deepEqual(await page.evaluate(() => window.__yahhaTextFieldCopyProbe.writes), [
      address,
      address,
    ]);
    return address;
  } finally {
    await page.evaluate(() => {
      const probe = window.__yahhaTextFieldCopyProbe;
      probe.focusProbe?.remove();
      if (probe.descriptor) Object.defineProperty(navigator, 'clipboard', probe.descriptor);
      else delete navigator.clipboard;
      delete window.__yahhaTextFieldCopyProbe;
    });
  }
}
