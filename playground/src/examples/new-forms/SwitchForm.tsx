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
            ? `显示封面；读取到 covers=${String(values.get('covers'))}。禁用的 notifications 不会提交。`
            : '隐藏封面；没有 covers 字段。禁用的 notifications 也不会提交。',
        );
      }}
      onReset={() => setResult('已恢复初始开启；点击“读取偏好”可重新检查表单值。')}
    >
      <Switch
        label="文章封面"
        name="covers"
        value="visible"
        defaultChecked
        hint="关闭时 FormData 中没有 covers 字段。重置恢复初始开启。"
      />
      <Switch
        label="站内通知"
        name="notifications"
        value="enabled"
        defaultChecked
        disabled
        hint="开启但禁用；原生表单同样不会提交此项。"
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取偏好</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" role="status">
        {result || '尚未读取表单；这里不会保存设置或调用接口。'}
      </Text>
    </form>
  );
}
