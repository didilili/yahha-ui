import { useState } from 'react';
import { Button, Checkbox } from 'yahha-ui';

export default function CheckboxForm() {
  const [result, setResult] = useState('');
  const [agreementError, setAgreementError] = useState(false);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(new FormData(event.currentTarget).getAll('topics').join('、') || '未选择分类');
      }}
      onReset={() => {
        setResult('');
        setAgreementError(false);
      }}
    >
      <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <legend>订阅分类</legend>
        <Checkbox label="生活手记" name="topics" value="journal" defaultChecked />
        <Checkbox label="读书笔记" name="topics" value="reading" />
      </fieldset>
      <Checkbox
        label="我已阅读订阅说明"
        name="agreement"
        value="accepted"
        required
        hint="此项使用浏览器原生必选校验；数据只在本地读取。"
        error={agreementError ? '请先阅读并勾选订阅说明，再读取订阅。' : undefined}
        onInvalid={(event) => {
          event.preventDefault();
          setAgreementError(true);
          event.currentTarget.focus();
        }}
        onChange={(event) => {
          if (event.target.checked) setAgreementError(false);
          setResult('');
        }}
      />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button type="submit">读取订阅</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <p role="status" style={{ margin: 0 }}>
        订阅分类值：{result || '尚未提交'}
      </p>
    </form>
  );
}
