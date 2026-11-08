import { Avatar, Text } from 'yahha-ui';

export default function AvatarExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
        <Avatar name="库米" />
        <Text size="sm" tone="muted">
          姓名缩写
        </Text>
      </div>
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
  );
}
