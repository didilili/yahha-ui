import { Progress, Text } from 'yahha-ui';

export default function ProgressStates() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <Text size="sm" tone="muted">
          进行中
        </Text>
        <Progress label="整理进度" value={40} appearance="bookmark" />
      </div>
      <div>
        <Text size="sm" tone="muted">
          未知进度
        </Text>
        <Progress label="整理进度" value={null} valueText="正在计算" appearance="bookmark" />
      </div>
      <div>
        <Text size="sm" tone="muted">
          已完成
        </Text>
        <Progress label="整理进度" value={100} appearance="bookmark" />
      </div>
    </div>
  );
}
