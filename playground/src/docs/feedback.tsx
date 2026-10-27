import { Link } from 'yahha-ui';
import type { DocPage } from './types';
import DialogBasic from '../examples/feedback/DialogBasic';
import dialogBasicSource from '../examples/feedback/DialogBasic.tsx?raw';
import DialogForm from '../examples/feedback/DialogForm';
import dialogFormSource from '../examples/feedback/DialogForm.tsx?raw';
import DialogExternal from '../examples/feedback/DialogExternal';
import dialogExternalSource from '../examples/feedback/DialogExternal.tsx?raw';
import EmptyBasic from '../examples/feedback/EmptyBasic';
import emptyBasicSource from '../examples/feedback/EmptyBasic.tsx?raw';
import EmptySearch from '../examples/feedback/EmptySearch';
import emptySearchSource from '../examples/feedback/EmptySearch.tsx?raw';
import ToastBasic from '../examples/feedback/ToastBasic';
import toastBasicSource from '../examples/feedback/ToastBasic.tsx?raw';
import ToastTones from '../examples/feedback/ToastTones';
import toastTonesSource from '../examples/feedback/ToastTones.tsx?raw';
import ToastTimer from '../examples/feedback/ToastTimer';
import toastTimerSource from '../examples/feedback/ToastTimer.tsx?raw';

export const feedbackPages: DocPage[] = [
  {
    id: 'dialog',
    name: 'Dialog',
    chinese: '弹窗',
    group: '浮层与反馈',
    description: '需要用户暂时集中注意力时，显示一段独立内容或简短表单。',
    importCode: "import { Dialog } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <>
            <p>
              用于简短编辑、确认和补充说明。普通阅读内容优先放在页面内，避免频繁打断阅读。 Dialog
              是受控模态弹窗，调用方必须保存 open 并响应
              onOpenChange。围绕触发位置展开的轻量交互可使用
              <Link href="#/components/popover">Popover</Link>。
            </p>
            <p>
              组件基于 Base UI 管理焦点、遮罩、Escape 与关闭行为。示例不需要角色插画或业务服务。
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
            title: '基本用法',
            description: '传入一个触发按钮。打开与关闭都通过同一份受控状态更新。',
            component: DialogBasic,
            source: dialogBasicSource,
          },
          {
            id: 'form',
            title: '表单、底部操作与初始焦点',
            description:
              '通过 initialFocus 聚焦输入框，底部保存按钮通过 form 关联表单。空白名称显示错误；保存去除首尾空格，取消或关闭后重开仍是已保存名称。',
            component: DialogForm,
            source: dialogFormSource,
          },
          {
            id: 'external',
            title: '外部控制与焦点返回',
            description:
              '省略 trigger，通过外部状态打开。finalFocus 指定返回位置；disablePointerDismissal 仅禁用点击外部关闭。',
            component: DialogExternal,
            source: dialogExternalSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与交互',
        content: (
          <>
            <p>
              信笺轮廓用标题、正文和底部操作组织当前任务，标题与页脚使用 paper-line
              轻纸分隔线。关闭按钮为 44×44px，无 illustration 时与标题第一行对齐，有 illustration
              时位于弹窗上角；标题字号为桌面 24px / 手机
              20px。长标题自然换行，长内容可滚动。示例中取消会放弃草稿，成功保存才更新页面；保存失败时应保留输入并说明原因。
            </p>
            <p>
              组合使用可查看
              <Link href="#/guides/states?section=article-actions">文章编辑与管理</Link>
              ：菜单打开编辑弹窗，内部分类和写作便笺逐层关闭。finalFocus
              指向保留的菜单按钮，保存和关闭不会把焦点丢回页面起点。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'DialogProps',
            rows: [
              {
                name: 'open',
                type: 'boolean',
                required: true,
                description: '是否打开弹窗。组件不提供 defaultOpen 或内部非受控状态。',
              },
              {
                name: 'onOpenChange',
                type: '(open: boolean) => void',
                required: true,
                description: '打开或关闭请求发生时调用；调用方更新 open 才会改变可见状态。',
              },
              {
                name: 'title',
                type: 'ReactNode',
                required: true,
                description: '弹窗标题，同时提供弹窗的可访问名称，应包含有意义的文字。',
              },
              {
                name: 'trigger',
                type: 'ReactElement',
                description:
                  '可选触发元素。自定义组件需要把 button 原生属性、事件和 ref 传给实际元素；使用 Button 即可。',
              },
              {
                name: 'description',
                type: 'ReactNode',
                description: '标题下方的补充说明，会关联到弹窗的可访问描述。',
              },
              {
                name: 'children',
                type: 'ReactNode',
                description: '弹窗正文，适合简短内容或表单。',
              },
              {
                name: 'footer',
                type: 'ReactNode',
                description: '底部操作区。自定义按钮需自行更新状态或提交表单。',
              },
              {
                name: 'illustration',
                type: 'ReactNode',
                description: '装饰插画；整个插槽隐藏于辅助技术，不要在其中放必要信息或操作。',
              },
              {
                name: 'initialFocus',
                type: "DialogProps['initialFocus']",
                description:
                  '沿用 Base UI Popup 类型，可传布尔值、元素 ref 或交互类型回调。默认按交互方式聚焦首个可聚焦元素或 Popup；false 禁用自动移动。',
              },
              {
                name: 'finalFocus',
                type: "DialogProps['finalFocus']",
                description:
                  '沿用 Base UI Popup 类型，可传布尔值、元素 ref 或交互类型回调。默认返回触发器或先前聚焦元素；外部控制打开时建议指定 ref。',
              },
              {
                name: 'portalContainer',
                type: "DialogProps['portalContainer']",
                defaultValue: 'body（Base UI 默认容器）',
                description:
                  'Portal 挂载位置，支持元素、ShadowRoot、对应 ref 或 null。自定义容器的层叠、裁切环境由调用方负责。',
              },
              {
                name: 'disablePointerDismissal',
                type: 'boolean',
                defaultValue: 'false',
                description: '阻止点击弹窗外部关闭；Escape、关闭按钮与受控状态仍有效。',
              },
              {
                name: 'closeLabel',
                type: 'string',
                defaultValue: '"关闭弹窗"',
                description: '右上角关闭按钮的可访问名称。',
              },
              {
                name: 'className / style',
                type: 'string / CSSProperties',
                description: '作用于弹窗 Popup div，不能用于修改遮罩、触发器或 Portal 外层。',
              },
              {
                name: 'ref',
                type: 'Ref<HTMLDivElement>',
                description: '指向弹窗 Popup div。未打开时该元素通常未挂载。',
              },
            ],
          },
        ],
      },
      {
        id: 'keyboard-and-theme',
        title: '键盘、样式与 Portal',
        content: (
          <>
            <ul>
              <li>Tab / Shift+Tab 在模态弹窗中移动焦点；Escape 发出关闭请求。</li>
              <li>关闭后默认恢复焦点。关闭自动焦点移动时，调用方需自行保证键盘用户能找到弹窗。</li>
              <li>
                当前只透传 className、style 和 ref，不透传任意 div 属性，也没有遮罩或内容槽的
                classNames 配置。
              </li>
              <li>
                ThemeProvider 的主题名称和 tokens 会传入 Portal；Provider 根元素的自定义 className
                不会自动复制过去。
              </li>
            </ul>
            <p>
              description、正文、底部与插画均为可选插槽。布尔值、空字符串、null 和 undefined
              不产生对应插槽包装，数字 0 会正常显示。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    chinese: '空状态',
    group: '浮层与反馈',
    description: '当列表或搜索没有内容时，解释原因，并给出合适的下一步。',
    importCode: "import { EmptyState } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            适合首次使用、搜索无结果和内容列表为空。组件只负责展示，调用方决定何时渲染、如何筛选，以及操作按钮的行为。
            空状态与加载、网络错误含义不同，应使用准确的标题与说明。仍在等待时使用
            <Link href="#/components/spinner">Spinner</Link>，需要预留内容形状时使用
            <Link href="#/components/skeleton">Skeleton</Link>。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本用法',
            description:
              '从首次无内容开始，创建后进入内容标题，恢复空态后回到创建按钮。组件本身不管理创建状态。',
            component: EmptyBasic,
            source: emptyBasicSource,
          },
          {
            id: 'search',
            title: '搜索与恢复操作',
            description:
              '输入框实际筛选示例文章。没有结果时提供清空搜索按钮，恢复列表并将焦点返回输入框。',
            component: EmptySearch,
            source: emptySearchSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <p>
            首次无内容与筛选无结果应给出不同原因和下一步。默认显示小纸页，也可传入装饰插画；320px
            窄屏下长文本与双按钮自然换行。加载用 Spinner 或 Skeleton，失败用带恢复操作的
            Alert。创建内容、清空筛选与操作后的焦点位置由调用方管理。
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
        title: '内容与键盘',
        content: (
          <>
            <p>
              空状态本身不获取焦点，没有额外快捷键或自动播报。action 使用 Button
              或链接等原生可交互元素， 不要仅在插画或普通文字上绑定点击。标题默认是
              h3，请与页面标题层级协调。
            </p>
            <p>
              未提供插画时显示内置小纸页。其余可选插槽无默认内容；空值、空字符串和布尔值不会生成对应插槽包装，数字
              0 会正常显示。组件不负责请求、分页或数据持久化。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'toast',
    name: 'Toast',
    chinese: '提示消息',
    group: '浮层与反馈',
    description: '在页面中反馈保存、完成或失败等操作结果，支持说明与补充操作。',
    importCode: "import { Toast } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <>
            <p>
              用于不需要中断当前操作的结果提示。Toast 是受控展示组件，渲染在调用方放置的位置，
              不包含全局消息管理器、Portal、队列、屏幕定位或自动关闭功能。
            </p>
            <p>
              下方示例都将提示放在文档流中。需要固定在屏幕角落时，请给外层容器设置定位，并自行处理移动端边距与多条消息排列。
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
            title: '受控显示与关闭',
            description: 'open 为 false 时不渲染。显示不抢焦点；从提示内关闭后回到保留的触发按钮。',
            component: ToastBasic,
            source: toastBasicSource,
          },
          {
            id: 'tones',
            title: '三种反馈类型',
            description:
              'success 为默认值；info 和 error 改变视觉及图标，三者都使用礼貌播报的 status 语义。',
            component: ToastTones,
            source: toastTonesSource,
          },
          {
            id: 'timer-and-action',
            title: '调用方计时与撤销操作',
            description:
              '示例由 useEffect 实现 8 秒关闭并清理定时器；悬停或聚焦时暂停，离开后重新计时。撤销与恢复按钮都由调用方管理文章状态。',
            component: ToastTimer,
            source: toastTimerSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <p>
            白纸回执使用 30px 状态印签和 44×44px 关闭按钮，与标题第一行对齐，补充操作通过 paper-line
            细虚线分区。示例由调用方实现 8
            秒自动关闭、悬停或聚焦暂停、撤销与焦点恢复；自动关闭不移动外部焦点，提示消失后仍可通过页面上的恢复入口操作。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'ToastProps',
            rows: [
              {
                name: 'open',
                type: 'boolean',
                required: true,
                description: '是否显示，false 时返回 null。没有 defaultOpen。',
              },
              {
                name: 'onClose',
                type: '() => void',
                required: true,
                description: '点击内置关闭按钮时调用，调用方应将 open 更新为 false。',
              },
              {
                name: 'title',
                type: 'ReactNode',
                required: true,
                description: '提示标题，渲染在 p 内，适合文字或行内内容。',
              },
              {
                name: 'description',
                type: 'ReactNode',
                description: '可选说明，渲染在 p 内；无默认内容。',
              },
              {
                name: 'tone',
                type: "'success' | 'info' | 'error'",
                defaultValue: "'success'",
                description: '反馈视觉类型，决定颜色与状态图标，不改变播报优先级。',
              },
              {
                name: 'action',
                type: 'ReactNode',
                description: '补充操作插槽；行为、关闭与后续状态由调用方实现。',
              },
              {
                name: 'className',
                type: 'string',
                description: '作用于根 status div。当前不透传 ref、style 或其他原生 div 属性。',
              },
            ],
          },
        ],
      },
      {
        id: 'behavior',
        title: '播报、键盘与计时边界',
        content: (
          <>
            <ul>
              <li>
                根元素为 role="status" 并设置 aria-atomic="true"。error 也不会自动变成 alert，
                组件不会主动抢焦点。
              </li>
              <li>
                关闭按钮名称固定为“关闭提示”。关闭按钮与 action 中的交互元素按页面顺序参与
                Tab；组件不监听 Escape。
              </li>
              <li>
                没有 duration
                属性。自动关闭、暂停计时、消息去重和队列均由调用方决定；给用户足够的阅读与操作时间。
              </li>
              <li>
                含关键操作的提示应提供可持续访问的替代入口。上面的归档示例在提示消失后，仍可用“恢复文章”按钮撤销。
              </li>
            </ul>
            <p>
              description 和 action 为空值、空字符串或布尔值时不生成对应包装，数字 0
              会正常显示。组件通过 className 定制根容器，不提供内部插槽 classNames。
            </p>
          </>
        ),
      },
    ],
  },
];
