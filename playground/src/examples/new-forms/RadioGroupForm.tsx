import { useState } from 'react';
import { Button, RadioGroup, Text } from 'yahha-ui';

export default function RadioGroupForm() {
  const [frequency, setFrequency] = useState('');
  const [result, setResult] = useState('');
  const [hasError, setHasError] = useState(false);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(String(new FormData(event.currentTarget).get('frequency')));
      }}
      onReset={(event) => {
        event.preventDefault();
        setFrequency('');
        setResult('');
        setHasError(false);
      }}
    >
      <RadioGroup
        label="订阅频率"
        name="frequency"
        required
        value={frequency}
        onValueChange={(value) => {
          setFrequency(value);
          setHasError(false);
          setResult('');
        }}
        onInvalid={() => setHasError(true)}
        hint="必选，请选择一种来信频率。"
        error={hasError ? '请选择一种订阅频率，再读取表单。' : undefined}
        options={[
          { value: 'weekly', label: '每周' },
          { value: 'monthly', label: '每月' },
        ]}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result && `读取结果：frequency=${result}。`}
      </Text>
    </form>
  );
}
