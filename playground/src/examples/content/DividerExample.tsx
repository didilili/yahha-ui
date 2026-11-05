import { Divider, Text } from 'yahha-ui';

export default function DividerExample() {
  return (
    <div>
      <style>{`
        .yahha-divider-meta { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 0; padding: 0; list-style: none; }
        .yahha-divider-meta li { display: flex; align-items: center; gap: 16px; min-width: 0; max-width: 100%; }
        .yahha-divider-meta span { min-width: 0; overflow-wrap: anywhere; }
        @media (max-width: 480px) { .yahha-divider-meta .yahha-divider-meta-line { display: none; } }
      `}</style>
      <Text>
        夕阳落到桥边时，小八还在翻面包袋。乌萨奇举起最后一截法棍，吉伊刚好画完今天的路线。
      </Text>
      <Divider />
      <ul className="yahha-divider-meta" aria-label="手记信息">
        <li>
          <span>作者：库米，散步时常绕到面包店，回家再写手记</span>
        </li>
        <li>
          <Divider
            className="yahha-divider-meta-line"
            orientation="vertical"
            decorative
            style={{ margin: 0 }}
          />
          <span>
            发布于 <time dateTime="2026-10-18">2026 年 10 月 18 日</time>
          </span>
        </li>
        <li>
          <Divider
            className="yahha-divider-meta-line"
            orientation="vertical"
            decorative
            style={{ margin: 0 }}
          />
          <span>栏目：每个周末和朋友交换零碎灵感与阅读记录</span>
        </li>
      </ul>
    </div>
  );
}
