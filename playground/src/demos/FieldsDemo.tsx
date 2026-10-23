import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { Button, TextField } from '../../../src/index';
import type { Notify } from '../data';
import { DemoSection } from '../shared';

export function FieldsDemo({ notify }: { notify: Notify }) {
  const [wish, setWish] = useState('今天也想做出一点喜欢的东西');
  const [wishError, setWishError] = useState('');
  const [savedWish, setSavedWish] = useState('');

  function saveWish() {
    if (!wish.trim()) {
      setWishError('先写下一件想做的小事吧。');
      return;
    }
    setWishError('');
    setSavedWish(wish.trim());
    notify({ title: '这句话，替你收好了。', description: wish.trim(), tone: 'success' });
  }
  return (
    <DemoSection
      id="fields"
      title="写下一点小心愿。"
      component="TextField"
      description="清楚的标签、温柔的提示，写错了也有重新开始的余地。"
      code={
        '<TextField label="今天的小心愿" value={wish}\n  onChange={e => setWish(e.target.value)}\n  hint="一件很小的事情，也可以。" error={error} />'
      }
    >
      <form
        className="field-stage"
        onSubmit={(event) => {
          event.preventDefault();
          saveWish();
        }}
      >
        <div className="field-grid">
          <TextField
            label="今天的小心愿"
            value={wish}
            onChange={(event) => {
              setWish(event.target.value);
              setWishError('');
            }}
            leading={<Pencil size={16} />}
            hint="一件很小的事情，也可以。"
            error={wishError || undefined}
            placeholder="想和朋友一起做什么？"
          />
          <div className="error-sample">
            <TextField
              label="想说的话"
              placeholder="还没想好也没关系"
              error="先写一点，再按下保存吧。"
            />
            <span className="sample-label">错误状态示例</span>
          </div>
        </div>
        <div className="field-actions">
          <Button type="submit" size="sm" startIcon={<Check size={15} />}>
            收好这句话
          </Button>
          <span aria-live="polite">
            {savedWish
              ? '已经收好。想改的话，可以再写一次。'
              : '把输入清空再保存，也能试试错误提示。'}
          </span>
        </div>
      </form>
    </DemoSection>
  );
}
