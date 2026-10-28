import BadgeTones from '../../examples/foundations/BadgeTones';
import badgeTonesSource from '../../examples/foundations/BadgeTones.tsx?raw';
import BadgeStatus from '../../examples/foundations/BadgeStatus';
import badgeStatusSource from '../../examples/foundations/BadgeStatus.tsx?raw';
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
          title: '标记类型、行内组合与长标签',
          description: '比较普通、强调和成功标记，再展示正文行内组合与窄栏中的长标签。',
          component: BadgeTones,
          source: badgeTonesSource,
        },
        {
          id: 'badge-status',
          title: '展示动态状态',
          description:
            '操作由外部 Button 触发，状态文字由调用方更新。外层 role="status" 提供温和播报。',
          component: BadgeStatus,
          source: badgeStatusSource,
        },
      ],
    },
    {
      id: 'design',
      title: '用文字表达分类与状态',
      content: (
        <p>
          用“草稿”“已发布”等明确文案表达状态，颜色和小勾只作辅助。纸签适合短标签；长文案虽然可以换行，详细原因仍适合放在相邻正文中。
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
              name: 'tone',
              type: "'neutral' | 'accent' | 'success'",
              defaultValue: "'neutral'",
              description: '标记的语义颜色。success 不随角色主题改变。',
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
          分类和既有状态通常直接显示即可。需要通知保存、发布等操作结果时，可像示例一样由外层
          role="status" 承担温和播报；Badge 本身不会自动播报，同一结果只保留一处播报。
        </p>
      ),
    },
  ],
});
