import { Link } from 'yahha-ui';
import type { ApiRow, DocPage } from './types';
import MenuBasic from '../examples/floating/MenuBasic';
import menuBasicSource from '../examples/floating/MenuBasic.tsx?raw';
import MenuControlled from '../examples/floating/MenuControlled';
import menuControlledSource from '../examples/floating/MenuControlled.tsx?raw';
import PopoverBasic from '../examples/floating/PopoverBasic';
import popoverBasicSource from '../examples/floating/PopoverBasic.tsx?raw';
import PopoverForm from '../examples/floating/PopoverForm';
import popoverFormSource from '../examples/floating/PopoverForm.tsx?raw';
import TooltipBasic from '../examples/floating/TooltipBasic';
import tooltipBasicSource from '../examples/floating/TooltipBasic.tsx?raw';
import TooltipOptions from '../examples/floating/TooltipOptions';
import tooltipOptionsSource from '../examples/floating/TooltipOptions.tsx?raw';

const stateRows: ApiRow[] = [
  { name: 'open', type: 'boolean', description: '受控展开状态；同时响应 onOpenChange。' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: '非受控初始状态，与 open 二选一。',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: '打开或关闭请求。受控模式需要更新 open。',
  },
];

function popupRows(name: string, side: string, align: string): ApiRow[] {
  return [
    {
      name: 'side',
      type: `${name}Props['side']`,
      defaultValue: `"${side}"`,
      description: 'top、bottom、left、right、inline-start、inline-end；空间不足时自动避让。',
    },
    {
      name: 'align',
      type: '"start" | "center" | "end"',
      defaultValue: `"${align}"`,
      description: '相对触发器的对齐方向。',
    },
    {
      name: 'sideOffset',
      type: 'number',
      defaultValue: '8',
      description: '与触发器的间距，单位 px。',
    },
    {
      name: 'portalContainer',
      type: `${name}Props['portalContainer']`,
      defaultValue: 'body',
      description: 'Base UI Portal 容器，支持元素、ShadowRoot、对应 ref 或 null。',
    },
    {
      name: 'className / style',
      type: 'string / CSSProperties',
      description: '作用于 Popup div，不作用于触发器、定位层或 Portal 外层。',
    },
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      description: '指向 Popup div，关闭卸载后为 null。',
    },
  ];
}

export const floatingPages: DocPage[] = [
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    chinese: '下拉菜单',
    group: '导航',
    description: '将文章操作或轻量工具收进一组可通过键盘操作的动作菜单。',
    importCode: "import { DropdownMenu } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <>
            <p>
              用于收藏、编辑、移出列表等动作。菜单执行操作；表单中的分类、排序和单个值选择请使用
              Select。
            </p>
            <p>
              使用 Base UI 的 Menu
              处理展开、焦点、按键与外部点击。当前为非模态单层菜单，不锁定页面滚动。
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
            title: '基本操作',
            description: '每项使用稳定 id、文字标签与 onSelect，执行后自动请求关闭菜单。',
            component: MenuBasic,
            source: menuBasicSource,
          },
          {
            id: 'controlled',
            title: '受控、禁用项与危险动作',
            description:
              '禁用项可发现但不可执行；继续编辑、移出与恢复都会更新示例状态。destructive 仅表达颜色，业务确认由调用方处理。',
            component: MenuControlled,
            source: menuControlledSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与交互',
        content: (
          <>
            <p>
              便笺轮廓容纳一组短动作。单行菜单项最小
              44px，多行自然增高，短墨记对齐文字第一行；高亮底色、内部键盘焦点、禁用与危险动作各自保留，强制颜色下禁用文字使用
              GrayText。
            </p>
            <p>
              执行结果留在页面，移出内容后保留恢复入口。菜单不是值选择器，也不承担表单编辑，较长任务交给
              Popover 或 Dialog。组合示例见
              <Link href="#/guides/states?section=article-actions">文章编辑与管理</Link>。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'DropdownMenuProps',
            rows: [
              {
                name: 'trigger',
                type: 'ReactElement',
                required: true,
                description: '原生 button 或转发原生 button 属性、事件及 ref 的组件，例如 Button。',
              },
              {
                name: 'items',
                type: 'readonly DropdownMenuItem[]',
                required: true,
                description: '单层动作列表；id 在当前菜单内唯一。',
              },
              ...stateRows,
              {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: '禁用触发器，阻止用户打开菜单。',
              },
              ...popupRows('DropdownMenu', 'bottom', 'start'),
            ],
          },
          {
            name: 'DropdownMenuItem',
            rows: [
              {
                name: 'id',
                type: 'string',
                required: true,
                description: '当前菜单内稳定、唯一的 key。',
              },
              {
                name: 'label',
                type: 'string',
                required: true,
                description: '显示文字，并供键盘按字查找使用。',
              },
              {
                name: 'onSelect',
                type: '() => void',
                required: true,
                description: '激活时执行。业务状态、异步失败与确认由调用方负责。',
              },
              {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: '禁用激活；方向键仍可聚焦该项，保持可发现性。',
              },
              {
                name: 'destructive',
                type: 'boolean',
                defaultValue: 'false',
                description: '使用错误语义文字颜色；不自动弹出确认框。',
              },
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与可访问性',
        content: (
          <>
            <ul>
              <li>Enter、Space 或方向键打开；上下方向键、Home、End 和按字查找由 Base UI 管理。</li>
              <li>菜单项采用 menuitem 语义；激活执行后关闭。Escape 关闭后，焦点返回触发器。</li>
              <li>
                触发器须有可访问名称。建议用 Button 或 IconButton，自定义组件须转发事件、属性和
                ref。
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'styling',
        title: '样式与使用边界',
        content: (
          <>
            <p>
              className、style 和 ref 只作用于 Popup div，不透传任意 div 原生属性。Portal 同步最近的
              ThemeProvider 和 tokens，不复制页面布局类。
            </p>
            <p>
              当前仅提供单层动作列表，没有值选择、多选、嵌套子菜单和链接项。导航请使用真正的链接，复杂编辑使用
              Popover 或 Dialog。
            </p>
            <p>
              菜单项至少 44px 高；长文字换行，视口边缘保留 12px
              并在必要时滚动。自定义宽度时仍应保留窄屏约束。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'popover',
    name: 'Popover',
    chinese: '浮层',
    group: '浮层与反馈',
    description: '锚定到按钮的补充面板，适合简短说明和轻量交互。',
    importCode: "import { Popover } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <>
            <p>
              用于说明、阅读偏好和短表单。可以选择文字、点击链接和填写输入框。只需短文字提示时使用
              <Link href="#/components/tooltip">Tooltip</Link>；需要锁定背景并完成独立任务时使用
              <Link href="#/components/dialog">Dialog</Link>。
            </p>
            <p>Popover 是非模态 dialog，必须提供有意义的 title；触发器应为按钮。</p>
          </>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本说明',
            description: '省略 open 时由组件维护展开状态。标题与描述自动关联到浮层。',
            component: PopoverBasic,
            source: popoverBasicSource,
          },
          {
            id: 'form',
            title: '表单与焦点控制',
            description:
              '打开时读取已保存名称，取消或关闭后放弃草稿；空白名称给出字段错误，保存后显式关闭并保留结果。',
            component: PopoverForm,
            source: popoverFormSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与交互',
        content: (
          <p>
            小便笺围绕触发位置展开，标题下使用 paper-line 轻纸分隔线，关闭按钮为
            44×44px。长标题自然换行，右侧留出关闭按钮的空间。适合短说明或短表单，不打断整页阅读。调用方应将已保存值与草稿分开，取消后重新打开时读取已保存值。较长编辑使用
            Dialog，嵌套浮层按最上层先关闭。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'PopoverProps',
            rows: [
              {
                name: 'trigger',
                type: 'ReactElement',
                required: true,
                description: '原生 button 或转发 button 属性、事件和 ref 的组件。',
              },
              {
                name: 'title',
                type: 'ReactNode',
                required: true,
                description: '可见标题，同时提供 dialog 的可访问名称，应包含文字。',
              },
              {
                name: 'description',
                type: 'ReactNode',
                description: '标题下说明，关联为可访问描述；保留数字 0。',
              },
              { name: 'children', type: 'ReactNode', description: '正文，可含表单、按钮和链接。' },
              ...stateRows,
              {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: '禁用触发器；受控 open 或 defaultOpen 仍能显示浮层。',
              },
              {
                name: 'initialFocus',
                type: "PopoverProps['initialFocus']",
                defaultValue: 'Base UI 默认行为',
                description:
                  '布尔值、元素 ref 或交互类型回调。默认首个可聚焦项，触摸打开聚焦 Popup。',
              },
              {
                name: 'finalFocus',
                type: "PopoverProps['finalFocus']",
                defaultValue: 'Base UI 默认行为',
                description: '布尔值、元素 ref 或交互类型回调；默认返回触发器或之前聚焦的元素。',
              },
              {
                name: 'closeLabel',
                type: 'string',
                defaultValue: '"关闭浮层"',
                description: '内置关闭按钮的可访问名称。',
              },
              ...popupRows('Popover', 'bottom', 'start'),
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与焦点',
        content: (
          <>
            <ul>
              <li>
                点击、Enter 或 Space 打开。关闭按钮、Escape、点击外部或焦点离开按 Base UI 行为收起。
              </li>
              <li>不锁定滚动、不困住焦点，Tab 可以离开面板。关闭后按 Base UI 规则返回触发器。</li>
              <li>
                默认首个可聚焦项包含内置关闭按钮；短表单建议用 initialFocus
                指定输入框。没有合适目标时回退到 Popup，触摸打开避免自动唤起键盘。
              </li>
              <li>
                表单提交不自动关闭，调用方在成功后显式更新 open。验证、保存和失败反馈由调用方负责。
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'styling',
        title: '样式与使用边界',
        content: (
          <>
            <p>
              Popup div 接收 className、style、ref，不透传任意 div 属性；触发器的原生属性与 ref 写在
              trigger 元素上。
            </p>
            <p>
              Portal 继承最近的主题与 tokens，保留 12px
              碰撞留白，宽度适配窄屏，长文案换行并限制高度。大表单和长篇正文请放在页面或 Dialog 中。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    chinese: '文字提示',
    group: '浮层与反馈',
    description: '悬停或聚焦时，为已有操作补充简短的视觉文字标签。',
    importCode: "import { Tooltip } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <>
            <p>
              适合给图标操作补充文字。Tooltip 是视觉标签，trigger
              必须自带可访问名称，不能让触屏或读屏用户依赖悬停才能理解操作。
            </p>
            <p>
              重要说明应直接显示或放入可点击的 <Link href="#/components/popover">Popover</Link>
              。Tooltip 的 content 只接受纯文字，不能放交互元素。
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
              '这里悬停延迟 800ms；键盘聚焦立即显示。disabled 只关闭提示，不禁用原按钮。',
            component: TooltipOptions,
            source: tooltipOptionsSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与交互',
        content: (
          <p>
            小对白轮廓与箭头标明提示对应的操作；靠近视口边缘时自动避让，箭头无法准确指向时隐藏。长文字可换行，超出可用高度时可滚动阅读。提示解释一个图标，不承载按钮或关键错误。按钮自身应具有可访问名称，让触屏用户也能直接操作；重要说明和结果应显示在页面上。开关名称保持稳定，用按下状态表达开启与关闭。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
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
                description:
                  '简短纯文字，与 trigger 名称一致或紧密对应。不能包含链接、按钮和表单。',
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
              ...popupRows('Tooltip', 'top', 'center'),
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与可访问性',
        content: (
          <>
            <ul>
              <li>Tab 聚焦触发器时立即展示；Escape 收起，焦点保留在触发器。点击触发器也会收起。</li>
              <li>
                沿用 Base UI 1.9 的视觉标签约定，不自动建立 aria-describedby，也不替代 trigger 的
                aria-label。
              </li>
              <li>
                触屏没有可靠悬停入口；重要说明用可见文本或 Popover。原生 disabled
                按钮无法聚焦，禁用原因应显示在页面中。
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'styling',
        title: '样式与使用边界',
        content: (
          <>
            <p>
              每个 Tooltip 内置 Base UI Provider
              管理延迟，不提供跨实例分组延迟。非交互文字允许悬停阅读，鼠标离开触发器与提示后收起。
            </p>
            <p>
              样式与 ref 指向 Popup，不透传任意 div 属性。Portal 同步最近的 ThemeProvider 与
              tokens；内置窄屏宽度、碰撞避让和长文字换行。
            </p>
            <p>
              本组件不提供持续提示、表单错误或成功反馈。持续说明放在页面；状态变化使用行内 status 或
              Toast。
            </p>
          </>
        ),
      },
    ],
  },
];
