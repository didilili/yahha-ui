import { useRef, useState } from 'react';
import { Button, Heading, Popover, Select, Text } from 'yahha-ui';

const collections = [
  { value: 'journal', label: '周末慢读' },
  { value: 'reading', label: '想再读一遍' },
  { value: 'archive', label: '已归档（暂不接收）', disabled: true },
];

export default function PopoverCollection() {
  const [open, setOpen] = useState(false);
  const [assigned, setAssigned] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const select = useRef<HTMLButtonElement>(null);
  const articleHeading = useRef<HTMLHeadingElement>(null);
  const assignedTitle = collections.find((item) => item.value === assigned)?.label;

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 540, minWidth: 0 }}>
      <article style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading level={3} ref={articleHeading} tabIndex={-1}>
          沿着河边，慢慢走
        </Heading>
        <Text>说好沿河散步，小八却先闻到了面包香。</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Popover
            trigger={
              <Button variant="secondary" aria-label="为这篇手记选择收藏夹">
                放进收藏夹
              </Button>
            }
            title="手记收藏位置"
            open={open}
            onOpenChange={(next) => {
              if (next) {
                setDraft(assigned);
                setInvalid(false);
              }
              setOpen(next);
            }}
            initialFocus={select}
          >
            <form
              noValidate
              style={{ display: 'grid', gap: 16, minWidth: 0 }}
              onSubmit={(event) => {
                event.preventDefault();
                const submitted = new FormData(event.currentTarget).get('collection');
                const match = collections.find(
                  (option) => option.value === submitted && !option.disabled,
                );
                if (!match) {
                  setInvalid(true);
                  select.current?.focus();
                  return;
                }
                setAssigned(match.value);
                setInvalid(false);
                setOpen(false);
              }}
            >
              <Select
                ref={select}
                label="收藏夹"
                name="collection"
                options={collections}
                value={draft}
                required
                placeholder="请选择收藏夹"
                error={invalid ? '请选择一个可用收藏夹。' : undefined}
                onValueChange={(next) => {
                  setDraft(next);
                  setInvalid(false);
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Button type="submit">放进收藏夹</Button>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  取消
                </Button>
              </div>
            </form>
          </Popover>
          <Button variant="ghost" onClick={() => articleHeading.current?.focus()}>
            继续阅读
          </Button>
        </div>
      </article>
      <Text role="status" size="sm" tone="muted">
        当前收藏位置：{assignedTitle ?? '尚未加入'}。
      </Text>
    </div>
  );
}
