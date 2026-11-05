import { useState } from 'react';
import { Button, Select, Text } from 'yahha-ui';

const exampleCollections = [
  { value: 'journal', label: 'Journal 日常手记' },
  { value: 'reading', label: 'Reading 阅读摘记' },
];

export default function SelectAvailableCollections() {
  const [options, setOptions] = useState<typeof exampleCollections>([]);
  const [value, setValue] = useState<string | null>(null);
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 480 }}
      onSubmit={(event) => event.preventDefault()}
      onReset={() => {
        setValue(null);
        setResult('');
      }}
    >
      <Select
        label="可用收藏夹"
        name="collection"
        options={options}
        value={value}
        disabled={options.length === 0}
        placeholder={options.length === 0 ? '暂无可用收藏夹' : '请选择收藏夹'}
        hint={
          options.length === 0 ? '没有可选项，请先恢复示例选项。' : '移除选中项后，选择值同步清空。'
        }
        onValueChange={(next) => {
          if (next === value) return;
          setValue(next);
          setResult('');
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setOptions(exampleCollections);
            setValue(null);
            setResult(`已恢复 ${exampleCollections.length} 个示例选项，请选择一个。`);
          }}
        >
          恢复选项
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={value === null}
          onClick={() => {
            if (value === null) return;
            const removed = options.find((option) => option.value === value);
            const remaining = options.filter((option) => option.value !== value);
            setOptions(remaining);
            setValue(null);
            setResult(
              remaining.length > 0
                ? `已移除「${removed?.label ?? '当前收藏夹'}」，请重新选择。`
                : '已移除最后一个选项，可恢复示例选项后再选择。',
            );
          }}
        >
          移除选中项
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
