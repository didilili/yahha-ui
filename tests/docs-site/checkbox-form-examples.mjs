import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

export async function verifyCheckboxFormReset(page, example) {
  await revealExample(example);
  const journal = example.getByRole('checkbox', { name: '生活手记', exact: true });
  const agreement = example.getByRole('checkbox', { name: '我确认读取以上订阅分类', exact: true });
  const read = example.getByRole('button', { name: '读取订阅', exact: true });
  const reset = example.getByRole('button', { name: '重置', exact: true });
  const status = example.getByRole('status');
  const error = example.getByText('请勾选确认后再读取订阅分类。', { exact: true });
  await journal.waitFor();
  try {
    assert.equal(await journal.isChecked(), true);
    assert.equal(await agreement.isChecked(), false);
    assert.equal(await status.count(), 1);
    await journal.uncheck();
    await agreement.check();
    await read.click();
    await status.getByText('读取结果：未选择分类。', { exact: true }).waitFor();
    await reset.click();
    assert.equal(await journal.isChecked(), true);
    assert.equal(await agreement.isChecked(), false);
    await agreement.check();
    await read.click();
    await status.getByText('读取结果：journal。', { exact: true }).waitFor();
    await journal.uncheck();
    assert.equal(
      (await status.innerText()).trim(),
      '',
      'Editing after reset clears the old result.',
    );
    assert.deepEqual(
      await journal.evaluate((node) => new FormData(node.form).getAll('topics')),
      [],
    );
    await reset.click();
    await agreement.check();
    await reset.click();
    await read.click();
    await error.waitFor();
    assert.equal(await agreement.getAttribute('aria-invalid'), 'true');
    assert.equal(await agreement.evaluate((node) => node === document.activeElement), true);
    await agreement.focus();
    await agreement.press('Space');
    assert.equal(await agreement.isChecked(), true);
    assert.notEqual(await agreement.getAttribute('aria-invalid'), 'true');
    assert.equal(await error.count(), 0, 'Checking after reset clears the requirement error.');
    await read.click();
    await status.getByText('读取结果：journal。', { exact: true }).waitFor();
    await agreement.press('Space');
    assert.equal((await status.innerText()).trim(), '');
    await read.click();
    await error.waitFor();
    await journal.uncheck();
    assert.equal(
      await agreement.getAttribute('aria-invalid'),
      'true',
      'Changing a topic does not satisfy the separate agreement.',
    );
    await agreement.check();
    assert.notEqual(await agreement.getAttribute('aria-invalid'), 'true');
    await read.click();
    await status.getByText('读取结果：未选择分类。', { exact: true }).waitFor();
  } finally {
    await reset.click();
    assert.equal(await journal.isChecked(), true);
    assert.equal(await agreement.isChecked(), false);
    assert.equal((await status.innerText()).trim(), '');
    assert.notEqual(await agreement.getAttribute('aria-invalid'), 'true');
  }
}
