import { useEffect, useId, useRef, useState } from 'react';
import { Alert, Button, Checkbox, Dialog, EmptyState, Text } from 'yahha-ui';

const initialItems = [
  {
    id: 'river',
    title: '沿河走到面包店的那条小路',
    summary: '说好沿河散步，小八却先闻到了面包香。',
  },
  {
    id: 'reading',
    title: 'ReadingNotesForASlowWeekend：还没读完的两页书',
    summary: '书签没动，页边却多了一只长腿麻雀。',
  },
  {
    id: 'flower',
    title: '花店门口，写给朋友的一张纸条',
    summary: '把花名写在纸条上，带回家才发现忘记问价钱。',
  },
];

export default function CheckboxReadingList() {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<string[]>([]);
  const [snapshot, setSnapshot] = useState(initialItems.slice(0, 0));
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const actionRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef(0);
  const failNext = useRef(true);
  const removedOnClose = useRef(false);
  const restoreConfirmFocus = useRef(false);
  const restoreListFocus = useRef(false);
  const descriptionId = useId();
  const allSelected = items.length > 0 && selected.length === items.length;

  useEffect(
    () => () => {
      request.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (!open || busy || !error || !restoreConfirmFocus.current) return;
    if (document.activeElement === document.body || document.activeElement === popupRef.current) {
      confirmRef.current?.focus();
    }
    restoreConfirmFocus.current = false;
  }, [open, busy, error]);

  useEffect(() => {
    if (!restoreListFocus.current) return;
    restoreListFocus.current = false;
    firstItemRef.current?.focus();
  }, [items]);

  function changeOpen(next: boolean) {
    if (!next) {
      request.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
      restoreConfirmFocus.current = false;
      removedOnClose.current = false;
      setBusy(false);
      setError('');
    }
    setOpen(next);
  }

  function restoreList() {
    if (busy) return;
    request.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    failNext.current = true;
    restoreListFocus.current = true;
    setItems(initialItems);
    setSelected([]);
    setMessage('');
  }

  function confirmRemoval() {
    if (busy || timer.current !== null || !snapshot.length) return;
    const currentRequest = ++request.current;
    const ids = new Set(snapshot.map((item) => item.id));
    setError('');
    setBusy(true);
    // Local demonstration: the first completed attempt fails; retrying keeps the same selection.
    timer.current = setTimeout(() => {
      if (currentRequest !== request.current) return;
      timer.current = null;
      setBusy(false);
      if (failNext.current) {
        failNext.current = false;
        restoreConfirmFocus.current =
          document.activeElement === document.body || document.activeElement === popupRef.current;
        setError('清单和选择仍然保留，请再次点击“确认移除”。');
        return;
      }
      setItems((current) => current.filter((item) => !ids.has(item.id)));
      setSelected([]);
      setMessage(`已从稍后阅读移除 ${ids.size} 篇，文章仍然保留。`);
      removedOnClose.current = true;
      setOpen(false);
    }, 700);
  }

  return (
    <div className="yahha-checkbox-reading-list">
      <style>{`
.yahha-checkbox-reading-list {
  display: grid;
  gap: var(--yahha-space-4, 16px);
  min-width: 0;
  max-width: 38rem;
}
.yahha-checkbox-reading-list-group {
  display: grid;
  gap: var(--yahha-space-3, 12px);
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.yahha-checkbox-reading-list-legend {
  margin-block-end: var(--yahha-space-3, 12px);
  padding: 0;
  font-weight: 600;
}
.yahha-checkbox-reading-list-list {
  display: grid;
  gap: var(--yahha-space-2, 8px);
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
.yahha-checkbox-reading-list-item {
  min-width: 0;
  padding-inline: var(--yahha-space-2, 8px);
  border-radius: var(--yahha-radius-field, 12px 16px 14px 11px);
}
.yahha-checkbox-reading-list-item[data-selected] {
  background: var(--yahha-accent-soft, #fff0f6);
}
.yahha-checkbox-reading-list-copy {
  display: grid;
  gap: var(--yahha-space-1, 4px);
  min-width: 0;
}
.yahha-checkbox-reading-list-summary {
  color: var(--yahha-muted, #7a5c6d);
  font-size: var(--yahha-font-size-sm, 12px);
  line-height: var(--yahha-leading-caption, 1.6);
}
.yahha-checkbox-reading-list-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yahha-space-3, 12px);
}
.yahha-checkbox-reading-list-snapshot {
  display: grid;
  gap: var(--yahha-space-2, 8px);
  margin: 0;
  padding-inline-start: var(--yahha-space-6, 24px);
  overflow-wrap: anywhere;
}
@media (forced-colors: active) {
  .yahha-checkbox-reading-list-item[data-selected] {
    background: Canvas;
  }
}
      `}</style>
      {items.length ? (
        <fieldset className="yahha-checkbox-reading-list-group">
          <legend className="yahha-checkbox-reading-list-legend">选择稍后阅读的手记</legend>
          <Checkbox
            label="全选当前清单"
            checked={allSelected}
            indeterminate={selected.length > 0 && !allSelected}
            disabled={busy}
            onChange={(event) => {
              setSelected(event.currentTarget.checked ? items.map((item) => item.id) : []);
              setMessage('');
            }}
          />
          <ul className="yahha-checkbox-reading-list-list" aria-label="稍后阅读清单">
            {items.map((item, index) => (
              <li
                className="yahha-checkbox-reading-list-item"
                data-selected={selected.includes(item.id) || undefined}
                key={item.id}
              >
                <Checkbox
                  ref={index === 0 ? firstItemRef : undefined}
                  label={
                    <span className="yahha-checkbox-reading-list-copy">
                      <strong>{item.title}</strong>
                      <span
                        className="yahha-checkbox-reading-list-summary"
                        id={`${descriptionId}-${item.id}`}
                      >
                        {item.summary}
                      </span>
                    </span>
                  }
                  aria-label={`选择手记：${item.title}`}
                  aria-describedby={`${descriptionId}-${item.id}`}
                  checked={selected.includes(item.id)}
                  disabled={busy}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setSelected((current) =>
                      checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                    );
                    setMessage('');
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      ) : (
        <EmptyState title="稍后阅读清单已清空" description="这里只移出了清单，文章内容仍然保留。" />
      )}
      <div className="yahha-checkbox-reading-list-actions">
        <Button
          ref={actionRef}
          type="button"
          variant="secondary"
          destructive
          disabled={!selected.length || busy}
          onClick={() => {
            const next = items.filter((item) => selected.includes(item.id));
            if (!next.length || busy) return;
            setSnapshot(next);
            setError('');
            setMessage('');
            removedOnClose.current = false;
            setOpen(true);
          }}
        >
          移除所选
        </Button>
        {items.length < initialItems.length && (
          <Button
            ref={restoreRef}
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={restoreList}
          >
            恢复示例清单
          </Button>
        )}
      </div>
      <Text role="status" size="sm" tone="muted">
        {message || `已选 ${selected.length} 篇，共 ${items.length} 篇。`}
      </Text>
      <Dialog
        ref={popupRef}
        open={open}
        onOpenChange={changeOpen}
        title="从稍后阅读移除所选手记？"
        description={`将移出本次选择的 ${snapshot.length} 篇手记，文章内容不会删除。`}
        initialFocus={cancelRef}
        finalFocus={() =>
          removedOnClose.current ? (firstItemRef.current ?? restoreRef.current) : actionRef.current
        }
        footer={
          <>
            <Button
              ref={cancelRef}
              type="button"
              variant="secondary"
              onClick={() => changeOpen(false)}
            >
              取消
            </Button>
            <Button
              ref={confirmRef}
              type="button"
              destructive
              loading={busy}
              onClick={confirmRemoval}
            >
              确认移除
            </Button>
          </>
        }
      >
        <ul className="yahha-checkbox-reading-list-snapshot" aria-label="本次将移出的手记">
          {snapshot.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
        {busy && (
          <Text size="sm" tone="muted">
            正在移出所选手记…
          </Text>
        )}
        {error && (
          <Alert tone="error" role="alert" title="模拟移除失败">
            {error}
          </Alert>
        )}
      </Dialog>
    </div>
  );
}
