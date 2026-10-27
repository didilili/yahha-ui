import { Avatar, Text } from 'yahha-ui';

const sizes = [
  { name: '小八', size: 'sm', description: '小号 · 32px' },
  { name: '吉伊', size: 'md', description: '常规 · 44px' },
  { name: '乌萨奇', size: 'lg', description: '大号 · 64px' },
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
            完整姓名放在头像旁，图形中保留简短回退。
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name=" " />
        <Text size="sm" tone="muted">
          没有填写昵称时，回退为问号，并提供“匿名用户”的名称。
        </Text>
      </div>
    </div>
  );
}
