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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Avatar name=" " />
          <Text size="sm" tone="muted">
            空姓名
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Avatar name="把散步写成手记的作者库米" fallback="米" />
          <Text size="sm" tone="muted">
            自定义回退
          </Text>
        </div>
      </div>
    </div>
  );
}
