import { useState } from 'react';
import { Button, Switch, Text } from 'yahha-ui';

export default function SwitchForm() {
  const [result, setResult] = useState('');
  return (
    <form
      style={{ display: 'grid', gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setResult(
          values.has('covers')
            ? `读取结果：covers=${String(values.get('covers'))}。`
            : '读取结果：未包含封面偏好。',
        );
      }}
      onReset={() => setResult('封面偏好已恢复为开启。')}
    >
      <Switch label="文章封面" name="covers" value="visible" defaultChecked />
      <Switch
        label="站内通知"
        name="notifications"
        value="enabled"
        defaultChecked
        disabled
        hint="此设置暂不可更改。"
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取偏好</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
