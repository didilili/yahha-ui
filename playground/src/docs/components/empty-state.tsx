import EmptyBasic from '../../examples/feedback/EmptyBasic';
import emptyBasicSource from '../../examples/feedback/EmptyBasic.tsx?raw';
import EmptySearch from '../../examples/feedback/EmptySearch';
import emptySearchSource from '../../examples/feedback/EmptySearch.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('empty-state', {
  importCode: "import { EmptyState } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于已经确认没有内容的情况，例如首次使用、搜索无结果或列表为空。标题说明原因，描述和操作引导下一步；仍在加载或请求失败时，应展示对应状态，避免让用户误以为内容不存在。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'basic',
          title: '首次无内容与创建',
          description:
            '创建与恢复只改变当前示例，不发布文章；创建后聚焦内容标题，恢复空态后回到创建按钮。',
          component: EmptyBasic,
          source: emptyBasicSource,
        },
        {
          id: 'search',
          title: '搜索无结果与清空条件',
          description:
            '输入框实际筛选示例文章。没有结果时提供清空搜索按钮，恢复列表并将焦点返回输入框。',
          component: EmptySearch,
          source: emptySearchSource,
        },
      ],
    },
    {
      id: 'design',
      title: '说明原因并给出下一步',
      content: (
        <p>
          首次无内容可引导创建，筛选无结果可引导清空或修改条件。用标题说明原因，用 action
          提供下一步；长文本和多个按钮应能在窄屏换行。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'EmptyStateProps',
          rows: [
            {
              name: 'title',
              type: 'ReactNode',
              required: true,
              description: '标题，渲染为 h3；说明当前为什么没有内容。',
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: '说明文字，渲染在 p 内，适合文本或行内内容。',
            },
            {
              name: 'illustration',
              type: 'ReactNode',
              description: '装饰插画；插槽带 aria-hidden，必要信息仍需写进标题或说明。',
            },
            {
              name: 'action',
              type: 'ReactNode',
              description: '可选按钮或链接，组件不为它绑定业务操作。',
            },
            {
              name: 'className',
              type: 'string',
              description: '作用于根 div。当前不透传 ref、style 或其他原生 div 属性。',
            },
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: '恢复入口与焦点',
      content: (
        <>
          <p>
            action 使用 Button
            或链接等可交互元素，创建内容、清空筛选与后续焦点由调用方管理。例如清空搜索后回到输入框，创建成功后进入新内容的合理起点；不要把点击入口只放在装饰插画上。
          </p>
          <p>
            标题固定为
            h3，应与页面标题层级协调。空状态本身没有自动播报；筛选结果动态变化且需要通知时，可像搜索示例一样由外层
            role="status" 说明结果数量或无匹配内容。
          </p>
        </>
      ),
    },
  ],
});
