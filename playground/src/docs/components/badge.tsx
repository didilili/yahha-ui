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
          title: '标记类型与组合',
          description: '对比三种标记、行内组合和长标签换行。',
          component: BadgeTones,
          source: badgeTonesSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看表单与状态组合',
      content: (
        <p>
          摘要例将分类与检查状态分开展示，只检查当前摘要是否为空；编辑后撤销旧检查结果。
          校验和预览由示例管理，标记不代表内容已保存或发布。
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
