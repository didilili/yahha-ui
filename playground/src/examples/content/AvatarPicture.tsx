import { useState } from 'react';
import { Avatar, Button, Text } from 'yahha-ui';

const picture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d7eaf5"/><text x="40" y="53" text-anchor="middle" font-size="40" fill="#462e31">八</text></svg>',
  );

export default function AvatarPicture() {
  const [broken, setBroken] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Avatar name="小八" src={broken ? 'data:text/plain,unavailable' : picture} size="lg" />
        <Button variant="secondary" onClick={() => setBroken(!broken)}>
          {broken ? '恢复头像' : '模拟图片失效'}
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {broken ? '图片暂不可用，已显示姓名回退。' : '当前选择：本地图片。'}
      </Text>
    </div>
  );
}
