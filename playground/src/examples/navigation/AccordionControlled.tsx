import { useState } from 'react';
import { Accordion, Button, Text } from 'yahha-ui';

export default function AccordionControlled() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button variant="secondary" onClick={() => setValue(['reading', 'privacy'])}>
          展开可用说明
        </Button>
        <Button variant="ghost" onClick={() => setValue([])}>
          全部收起
        </Button>
      </div>
      <Text size="sm" tone="muted">
        这里只演示说明的展开与收起，不提供阅读进度同步或离线缓存。
      </Text>
      <Accordion
        multiple
        value={value}
        onValueChange={setValue}
        items={[
          {
            value: 'reading',
            title: '关于长文章、阅读进度和在手机上继续阅读的说明',
            content: (
              <div style={{ display: 'grid', gap: 12 }}>
                <Text>
                  长文章可以分成小节，先读一段，再按自己的节奏继续。需要对照其他说明时，可以让这两项同时展开。
                </Text>
                <Text>
                  本示例不会保存阅读位置，也不会在设备之间同步进度。下次阅读时，请通过实际站点提供的文章链接重新打开。
                </Text>
              </div>
            ),
          },
          {
            value: 'privacy',
            title: '会收集哪些数据？',
            content: (
              <p style={{ margin: 0 }}>
                这只是交互示例，不读取或上传个人数据。实际站点需要根据真实行为提供隐私说明。
              </p>
            ),
          },
          {
            value: 'offline',
            title: '离线阅读（准备中）',
            content: <p>暂未提供离线功能。</p>,
            disabled: true,
          },
        ]}
      />
      <p role="status" style={{ margin: 0 }}>
        已展开 {value.length} 项说明。
      </p>
    </div>
  );
}
