import ProgressBasic from '../../examples/content/ProgressBasic';
import progressBasicSource from '../../examples/content/ProgressBasic.tsx?raw';
import ProgressAppearance from '../../examples/content/ProgressAppearance';
import progressAppearanceSource from '../../examples/content/ProgressAppearance.tsx?raw';
import ProgressStates from '../../examples/content/ProgressStates';
import progressStatesSource from '../../examples/content/ProgressStates.tsx?raw';
import ProgressChecklist from '../../examples/content/ProgressChecklist';
import progressChecklistSource from '../../examples/content/ProgressChecklist.tsx?raw';
import { defineComponentPage } from '../page';
import { example } from '../page-helpers';

export default defineComponentPage('progress', {
  importCode: "import { Progress } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于有明确总量的任务，例如已读条数或处理完成数量。暂时无法确定比例时传入
          null；只有等待说明时也可使用 Spinner。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页使用受控数值演示，不模拟网络请求。</p>,
      examples: [
        example(
          'progress-basic',
          '基础用法',
          '显示当前完成比例。',
          ProgressBasic,
          progressBasicSource,
        ),
        example(
          'progress-states',
          '进度状态',
          '使用默认外观对比进行中、未知进度和已完成状态。',
          ProgressStates,
          progressStatesSource,
        ),
        example(
          'progress-appearance',
          '常规与纸签',
          '切换同一个数值，对比纸签端点与完成勾记。',
          ProgressAppearance,
          progressAppearanceSource,
        ),
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看清单进度示例',
      examples: [
        example(
          'progress-checklist',
          '由清单计算进度',
          '勾选已读条目，进度根据实际勾选数量更新。',
          ProgressChecklist,
          progressChecklistSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '纸签与完成状态',
      content: (
        <p>
          默认外观保留普通轨道。bookmark 使用一枚随确定进度移动的纸签，真正达到总量时改为勾记；0% 和
          100% 均保持在轨道边界内。未知进度不显示纸签或百分比，减少动效时保留静态等待片段。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'ProgressProps',
          rows: [
            {
              name: 'label',
              type: 'string',
              required: true,
              description: '可见任务名称，同时作为默认可访问名称。',
            },
            {
              name: 'value',
              type: 'number | null',
              description:
                '当前完成数量；省略、null 或非有限数字表示未知进度。有限数字限制在 0 至 max。',
            },
            {
              name: 'max',
              type: 'number',
              defaultValue: '100',
              description: '任务总量，须为有限正数；非法值回退为 100。',
            },
            {
              name: 'appearance',
              type: "'default' | 'bookmark'",
              defaultValue: "'default'",
              description: '普通轨道或可选的纸签端点，数值、语义和整体尺寸保持一致。',
            },
            {
              name: 'valueText',
              type: 'string',
              description:
                '自定义可见进度说明和 aria-valuetext，例如“2 / 3 篇”；不改变实际数值。默认显示向下取整的百分比，未知进度显示“计算中”。',
            },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 div。',
            },
            { name: 'ref', type: 'Ref<HTMLDivElement>', description: '指向根 div。' },
            {
              name: '其他原生属性 / 事件',
              type: 'ComponentPropsWithRef<"div">（排除内容、role 与进度数值属性）',
              description:
                '作用于根 div；可通过 aria-describedby 关联外部说明。role、aria-valuemin/max/now/text 由组件维护，不接受 children。',
            },
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '名称与状态语义',
      content: (
        <>
          <p>
            组件为只读的 progressbar，不创建键盘入口或自动播报。确定进度时提供 0、max
            和当前值；未知进度省略 aria-valuenow。原生 aria-label 或 aria-labelledby
            可提供更合适的名称。
          </p>
          <p>
            说明和操作放在进度条外；不要把按钮或链接放入标签。任务的开始、暂停、失败、重试和完成反馈由调用方管理，不把计时器当作真实处理百分比。
          </p>
        </>
      ),
    },
  ],
});
