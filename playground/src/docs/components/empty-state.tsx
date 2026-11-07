import EmptyBasic from '../../examples/feedback/EmptyBasic';
import emptyBasicSource from '../../examples/feedback/EmptyBasic.tsx?raw';
import EmptySearch from '../../examples/feedback/EmptySearch';
import emptySearchSource from '../../examples/feedback/EmptySearch.tsx?raw';
import EmptyAppearance from '../../examples/feedback/EmptyAppearance';
import emptyAppearanceSource from '../../examples/feedback/EmptyAppearance.tsx?raw';
import EmptyScene from '../../examples/scenes/EmptyScene';
import emptySceneSource from '../../examples/scenes/EmptyScene.tsx?raw';
import emptyCollectionArtwork from '../../examples/scenes/artwork/little-days-empty-collection.svg?no-inline';
import emptySearchArtwork from '../../examples/scenes/artwork/little-days-search-empty.svg?no-inline';
import { defineComponentPage } from '../page';

export default defineComponentPage('empty-state', {
  importCode: "import { EmptyState } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于首次使用、列表为空或搜索无结果等已确认没有内容的情况。加载和请求失败应分别使用对应状态。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'basic',
          title: '空状态与引导操作',
          description: '创建示例文章，或恢复初始空态；不实际发布。',
          component: EmptyBasic,
          source: emptyBasicSource,
        },
        {
          id: 'search',
          title: '搜索无结果与清空条件',
          description: '搜索本地文章，无结果时可清空条件恢复列表。',
          component: EmptySearch,
          source: emptySearchSource,
        },
        {
          id: 'motif',
          title: '普通与小纸页空态',
          description: '使用相同标题与说明对比；默认没有插画，小纸页由 motif="paper" 显式启用。',
          component: EmptyAppearance,
          source: emptyAppearanceSource,
        },
      ],
    },
    {
      id: 'illustrations',
      kind: 'integration',
      title: '按场景选用道具插画',
      content: (
        <p>
          普通空态默认没有插画；可用 motif="paper" 加入小纸页，或通过 illustration
          插槽选择空收藏口袋或搜索纸条。插画用于补充情境，原因和下一步仍由文字与操作说明。
        </p>
      ),
      examples: [
        {
          id: 'empty-illustrations',
          title: '纸页、收藏与搜索',
          description: '切换场景后，可以创建内容、浏览文章或清空搜索；示例状态仅保留在当前页面。',
          component: EmptyScene,
          source: emptySceneSource,
          themeScope: 'explicit',
          assets: [
            { name: 'little-days-empty-collection.svg', href: emptyCollectionArtwork },
            { name: 'little-days-search-empty.svg', href: emptySearchArtwork },
          ],
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
              name: 'motif',
              type: "'none' | 'paper'",
              defaultValue: "'none'",
              description:
                '内置装饰。仅 illustration 未提供时，paper 显示小纸页；none 不生成插画区。',
            },
            {
              name: 'illustration',
              type: 'ReactNode',
              description:
                '自定义装饰优先于 motif；null 或 false 明确隐藏全部插画。插槽带 aria-hidden，必要信息仍需写进标题或说明。',
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
