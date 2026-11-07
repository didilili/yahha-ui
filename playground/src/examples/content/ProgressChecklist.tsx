import { useState } from 'react';
import { Button, Checkbox, Progress } from 'yahha-ui';

const articles = ['雨天的读书笔记', '沿着河边，慢慢走', '周末散步的小发现'];

export default function ProgressChecklist() {
  const [read, setRead] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Progress
        label="阅读清单"
        value={read.length}
        max={articles.length}
        valueText={`${read.length} / ${articles.length} 篇`}
        appearance="bookmark"
      />
      <fieldset style={{ display: 'grid', gap: 12, margin: 0, padding: 0, border: 0 }}>
        <legend>标记已读文章</legend>
        {articles.map((title) => (
          <Checkbox
            key={title}
            label={title}
            checked={read.includes(title)}
            onChange={(event) => {
              const checked = event.target.checked;
              setRead((current) =>
                checked ? [...current, title] : current.filter((article) => article !== title),
              );
            }}
          />
        ))}
      </fieldset>
      <div>
        <Button variant="secondary" disabled={read.length === 0} onClick={() => setRead([])}>
          重置已读标记
        </Button>
      </div>
    </div>
  );
}
