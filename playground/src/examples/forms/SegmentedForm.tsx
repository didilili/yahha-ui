import { useId, useState } from 'react';
import { Button, SegmentedControl, Text } from 'yahha-ui';

type Sort = '' | 'latest' | 'oldest' | 'popular';

export default function SegmentedForm() {
  const descriptionId = useId();
  const errorId = useId();
  const [sort, setSort] = useState<Sort>('');
  const [invalid, setInvalid] = useState(false);
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', justifyItems: 'start', gap: 16 }}
      onInvalidCapture={() => {
        setInvalid(true);
        setResult('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`提交的 sort：${data.get('sort')}`);
      }}
      onReset={(event) => {
        event.preventDefault();
        setSort('');
        setInvalid(false);
        setResult('已恢复为未选择，请重新选择排序方式。');
      }}
    >
      <Text id={descriptionId} size="sm">
        文章排序（必选）。先尝试直接应用，再选择一种排序方式。
      </Text>
      <SegmentedControl
        label="文章排序"
        aria-describedby={[descriptionId, invalid ? errorId : ''].filter(Boolean).join(' ')}
        aria-invalid={invalid || undefined}
        name="sort"
        required
        value={sort}
        onValueChange={(value) => {
          setSort(value);
          setInvalid(false);
          setResult('');
        }}
        options={[
          { value: 'latest', label: '最新' },
          { value: 'oldest', label: '最早' },
          { value: 'popular', label: '最多阅读' },
        ]}
      />
      {invalid && (
        <Text id={errorId} role="alert" size="sm">
          请选择一种文章排序方式，再应用排序。
        </Text>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">应用排序</Button>
        <Button type="reset" variant="secondary">
          恢复初始值
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {result || '表单提交读取原生 radio；重置由调用方更新受控状态。'}
      </Text>
    </form>
  );
}
