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
      <Text>夕阳落到桥边时，大家把剩下的半块饼干分着吃，等朋友系好鞋带再一起回家。</Text>
      <Divider />
      <ul className="yahha-divider-meta" aria-label="手记信息">
        <li>
          <span>作者：库米，一位喜欢散步、阅读和记录日常生活的手记作者</span>
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
