import { useState } from 'react';
import { Button, Checkbox, Text } from 'yahha-ui';

export default function CheckboxForm() {
  const [result, setResult] = useState('');
  const [agreementError, setAgreementError] = useState(false);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
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
        label="我确认读取以上订阅分类"
        name="agreement"
        value="accepted"
        required
        hint="必选，请先确认已选择的订阅分类。"
        error={agreementError ? '请勾选确认后再读取订阅分类。' : undefined}
        onInvalid={(event) => {
          event.preventDefault();
          setAgreementError(true);
          event.currentTarget.focus();
        }}
        onInput={(event) => {
          if (event.currentTarget.checked) setAgreementError(false);
        }}
      />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button type="submit">读取订阅</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result && `读取结果：${result}。`}
      </Text>
    </form>
  );
}
