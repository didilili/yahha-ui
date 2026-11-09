import { useRef, useState } from 'react';
import { Button, Popover, Text, Input } from 'yahha-ui';

export default function PopoverForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('我的收藏');
  const [savedName, setSavedName] = useState(name);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      setName(savedName);
      setError('');
    }
    setOpen(nextOpen);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Popover
        trigger={<Button variant="secondary">重命名收藏夹</Button>}
        title="收藏夹名称"
        description="为收藏的文章取一个容易找到的名字。"
        open={open}
        onOpenChange={changeOpen}
        initialFocus={inputRef}
      >
        <form
          style={{ display: 'grid', gap: 16 }}
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) {
              setError('请输入名称，不能只填写空格。');
              inputRef.current?.focus();
              return;
            }
            setSavedName(name.trim());
            setOpen(false);
          }}
        >
          <Input
            ref={inputRef}
            label="名称"
            name="collection"
            value={name}
            required
            maxLength={30}
            hint="请输入 1–30 个字符。"
            error={error}
            onInvalid={() => setError('请输入名称，不能只填写空格。')}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button type="submit">保存名称</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              取消
            </Button>
          </div>
        </form>
      </Popover>
      <Text size="sm" tone="muted" role="status">
        当前名称：{savedName}
      </Text>
    </div>
  );
}
