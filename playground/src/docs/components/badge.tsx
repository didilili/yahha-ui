import BadgeTones from '../../examples/foundations/BadgeTones';
import badgeTonesSource from '../../examples/foundations/BadgeTones.tsx?raw';
import BadgeContent from '../../examples/foundations/BadgeContent';
import badgeContentSource from '../../examples/foundations/BadgeContent.tsx?raw';
import BadgeStatus from '../../examples/foundations/BadgeStatus';
import badgeStatusSource from '../../examples/foundations/BadgeStatus.tsx?raw';
import BadgeAppearance from '../../examples/foundations/BadgeAppearance';
import badgeAppearanceSource from '../../examples/foundations/BadgeAppearance.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('badge', {
  importCode: "import { Badge } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用简短文字展示分类、标签或当前状态，例如“随笔”“草稿”“已发布”。需要点击筛选或跳转的分类入口，使用按钮或链接。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'badge-tones',
          title: '语义颜色',
          description: '使用相同文字对比普通、强调和成功三种颜色。',
          component: BadgeTones,
          source: badgeTonesSource,
        },
        {
          id: 'badge-content',
          title: '行内与长文本',
          description: '分别查看正文中的行内标记，以及中文和连续长词的换行。',
          component: BadgeContent,
          source: badgeContentSource,
        },
        {
          id: 'badge-appearance',
          title: '普通与印章',
          description: '对比相同语义颜色的普通标记与印章；只有成功色印章附带小勾。',
          component: BadgeAppearance,
          source: badgeAppearanceSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看表单与状态组合',
      content: (
        <p>
          修改摘要后，上一次检查结果会清除；再次检查时，分类与结果分别显示。
          本例只检查摘要是否为空，校验和预览由示例管理，不会保存或发布内容。
        </p>
      ),
      examples: [
        {
          id: 'badge-status',
          title: '表单校验状态组合',
          description: '根据摘要检查结果切换标记。',
          component: BadgeStatus,
          source: badgeStatusSource,
          toc: false,
        },
      ],
    },
    {
      id: 'design',
      title: '用文字表达分类与状态',
      content: (
        <p>
          用“草稿”“已发布”等明确文案表达状态。默认使用普通实线标记，success
          保留绿色语义；appearance="stamp" 增加虚线轮廓，仅 success
          印章附带辅助小勾。标记适合短标签；长文案虽然可以换行，详细原因仍适合放在相邻正文中。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'BadgeProps',
          rows: [
            {
              name: 'appearance',
              type: "'default' | 'stamp'",
              defaultValue: "'default'",
              description:
                '普通实线标记或虚线印章；印章可搭配任意 tone，只有 success 印章显示小勾。',
            },
            {
              name: 'tone',
              type: "'neutral' | 'accent' | 'success'",
              defaultValue: "'neutral'",
              description: '标记的语义颜色。success 不随配色预设改变。',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: '状态或分类内容，应能独立表达含义。',
            },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 span。',
            },
            { name: 'ref', type: 'Ref<HTMLSpanElement>', description: '指向根 span。' },
            {
              name: '其余原生属性',
              type: "ComponentPropsWithRef<'span'>",
              description: '透传 span 属性，包括 aria-*、data-* 和事件；不会自动增加交互语义。',
            },
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: '更新标记与状态播报',
      content: (
        <p>
          分类和既有状态通常直接显示即可。需要通知检查等操作结果时，可像示例一样由外层 role="status"
          承担温和播报；Badge 本身不会自动播报，同一结果只保留一处播报。
        </p>
      ),
    },
  ],
});
