import { Link } from 'yahha-ui';
import TooltipBasic from '../../examples/floating/TooltipBasic';
import tooltipBasicSource from '../../examples/floating/TooltipBasic.tsx?raw';
import TooltipOptions from '../../examples/floating/TooltipOptions';
import tooltipOptionsSource from '../../examples/floating/TooltipOptions.tsx?raw';
import { defineComponentPage } from '../page';
import { stateRows, popupRows } from '../page-helpers';

export default defineComponentPage('tooltip', {
  importCode: "import { Tooltip } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于给图标操作补充简短的视觉文字。trigger
            必须自带可访问名称，用户应能直接理解并执行操作；悬停提示只作补充。content 仅接受纯文字。
          </p>
          <p>
            重要说明直接显示在页面中，需要链接、按钮或表单的内容使用{' '}
            <Link href="#/components/popover">Popover</Link>。操作结果用可见状态文字或 Toast 表达。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'basic',
          previewAlign: 'center',
          title: '图标操作的文字标签',
          description:
            'content 与 IconButton 的名称一致且保持稳定，收藏状态由 aria-pressed 与相邻文字表达。点击直接操作，不依赖悬停。',
          component: TooltipBasic,
          source: tooltipBasicSource,
        },
        {
          id: 'options',
          title: '延迟、方向与禁用提示',
          description:
            '悬停“加入稍后阅读” 0.8 秒后在下方显示提示，键盘聚焦立即显示；关闭提示后仍可点击按钮并查看回调结果，不维护阅读列表。',
          component: TooltipOptions,
          source: tooltipOptionsSource,
        },
      ],
    },
    {
      id: 'design',
      title: '显示与关闭',
      content: (
        <>
          <p>
            默认悬停 400ms
            后显示，键盘聚焦时立即显示。鼠标可以移入提示阅读文字，离开触发器与提示后收起。disabled
            只关闭提示，不改变原按钮的可用状态。
          </p>
          <p>
            每个 Tooltip 独立计算悬停延迟。从一个触发器移动到另一个时，仍按后者的 delay 等待，
            当前没有跨实例共用的延迟分组。
          </p>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: <p>仅支持下列属性，不透传其余 div 原生属性。</p>,
      api: [
        {
          name: 'TooltipProps',
          rows: [
            {
              name: 'trigger',
              type: 'ReactElement',
              required: true,
              description:
                '可聚焦按钮。必须有自身可访问名称，通常使用 Button 或带 aria-label 的 IconButton。',
            },
            {
              name: 'content',
              type: 'string',
              required: true,
              description: '简短纯文字，与 trigger 名称一致或紧密对应。不能包含链接、按钮和表单。',
            },
            ...stateRows,
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: '禁用提示，不改变 trigger 元素本身的 disabled。',
            },
            {
              name: 'delay',
              type: 'number',
              defaultValue: '400',
              description: '鼠标悬停等待时间，单位 ms；聚焦时立即展示。',
            },
            ...popupRows('Tooltip', 'top', 'center').map((row) =>
              row.name === 'sideOffset'
                ? {
                    ...row,
                    defaultValue: '12',
                    description:
                      '提示外框与触发器的间距，单位 px；默认给尖角和按钮焦点圈留出空间。',
                  }
                : row,
            ),
          ],
        },
      ],
    },
    {
      id: 'keyboard',
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>Tab 聚焦触发器时立即显示；Escape 或点击触发器收起，焦点保留在触发器。</li>
          <li>
            提示不自动通过 aria-describedby 关联到触发器，也不替代触发器自身的可访问名称。
            图标按钮仍须提供 aria-label，切换状态通过 aria-pressed 表达并保持名称稳定。
          </li>
          <li>
            触屏没有可靠的悬停入口。原生 disabled
            按钮也无法聚焦，禁用原因和重要说明应直接显示在页面中。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '定位与 Portal',
      content: (
        <>
          <p>
            默认显示在触发器上方，外框与触发器间距 12px，空间不足时自动避让，距视口边缘保留
            12px；箭头避开气泡圆角，无法准确指向时隐藏。
            文字可换行，但提示应保持简短；需要滚动阅读的说明更适合放在页面或 Popover 中。
          </p>
          <p>
            提示跟随触发器自身或最近容器的显式 dir，使文字、逻辑定位和箭头朝向保持一致；未指定时继承
            Base UI DirectionProvider。仅设置 CSS direction 或 dir="auto"
            时，请在触发器上同时设置明确的 dir。
          </p>
          <p>
            Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。
            自定义 portalContainer 时，需检查容器的层叠与裁切，避免提示被遮住。
          </p>
        </>
      ),
    },
  ],
});
