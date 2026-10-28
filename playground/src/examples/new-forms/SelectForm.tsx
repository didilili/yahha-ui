import { useRef, useState } from 'react';
import { Button, Select, Text } from 'yahha-ui';

export default function SelectForm() {
  const [result, setResult] = useState('');
  const [invalid, setInvalid] = useState(false);
  const selectRef = useRef<HTMLButtonElement>(null);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 340 }}
      onInvalidCapture={(event) => {
        event.preventDefault();
        setInvalid(true);
        setResult('');
        selectRef.current?.focus();
      }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(`读取结果：category=${new FormData(event.currentTarget).get('category')}。`);
      }}
      onReset={() => {
        setResult('');
        setInvalid(false);
      }}
    >
      <Select
        ref={selectRef}
        label="归档分类"
        name="category"
        required
        placeholder="请选择归档分类"
        options={[
          { value: 'journal', label: '日常手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'photos', label: '散步相册' },
        ]}
        onValueChange={() => {
          setInvalid(false);
          setResult('');
        }}
        hint="必选，请选择归档分类。"
        error={invalid ? '请选择归档分类后再读取表单。' : undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          重置为未选择
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
