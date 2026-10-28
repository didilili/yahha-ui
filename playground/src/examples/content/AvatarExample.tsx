import { Avatar, Text } from 'yahha-ui';

const sizes = [
  { name: '小八', size: 'sm', description: '小号 sm' },
  { name: '吉伊', size: 'md', description: '中号 md（默认）' },
  { name: '乌萨奇', size: 'lg', description: '大号 lg' },
] as const;

export default function AvatarExample() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'end', flexWrap: 'wrap', gap: 24 }}>
        {sizes.map(({ name, size, description }) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <Avatar name={name} size={size} />
            <Text size="sm" tone="muted">
              {description}
            </Text>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
        <Avatar name="把散步写成手记的作者小林" fallback="林" />
        <div style={{ minWidth: 0 }}>
          <Text>把散步写成手记的作者小林</Text>
          <Text size="sm" tone="muted">
            手记作者
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name=" " />
        <Text size="sm" tone="muted">
          匿名用户
        </Text>
      </div>
    </div>
  );
}
