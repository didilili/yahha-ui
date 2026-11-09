import { Link } from 'yahha-ui';
import PopoverBasic from '../../examples/floating/PopoverBasic';
import popoverBasicSource from '../../examples/floating/PopoverBasic.tsx?raw';
import PopoverForm from '../../examples/floating/PopoverForm';
import popoverFormSource from '../../examples/floating/PopoverForm.tsx?raw';
import PopoverCollection from '../../examples/floating/PopoverCollection';
import popoverCollectionSource from '../../examples/floating/PopoverCollection.tsx?raw';
import { defineComponentPage } from '../page';
import { stateRows, popupRows, popupFocusTypeSource } from '../page-helpers';

export default defineComponentPage('popover', {
  importCode: "import { Popover } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于围绕触发位置展开的说明、阅读偏好和短表单，内容可包含链接、按钮和输入框。Popover
            是非模态 dialog，用户仍可操作页面；title 必须包含有意义的文字，触发器使用按钮。
          </p>
          <p>
            只需短文字提示时使用 <Link href="#/components/tooltip">Tooltip</Link>
            ；需要集中完成独立任务或较长编辑时使用 <Link href="#/components/dialog">Dialog</Link>。
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
          title: '基础用法',
          description: '打开并关闭补充说明面板。',
          component: PopoverBasic,
          source: popoverBasicSource,
        },
        {
          id: 'form',
          title: '原生表单中的保存与取消',
          description: '打开时建立名称草稿，确认后更新本地值并关闭，取消后保留已保存值。',
          component: PopoverForm,
          source: popoverFormSource,
        },
        {
          id: 'popover-collection',
          title: '内嵌选择器与分层关闭',
          description:
            '在面板内展开 Select，按 Escape 逐层关闭；确认才更新本例的收藏位置，取消不会保存选择。',
          component: PopoverCollection,
          source: popoverCollectionSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与反馈',
      content: (
        <>
          <p>
            省略 open 时由组件维护展开状态，可通过 defaultOpen 设置初始状态；传入 open
            后由调用方响应 onOpenChange。disabled 只禁用触发器，受控 open 或 defaultOpen
            仍能显示面板。
          </p>
          <p>
            原生表单示例由调用方校验名称和保存草稿，每次打开时从已保存值重建草稿，保存成功后更新页面并关闭。
            使用 <Link href="#/components/form?section=form-submission">Form 管理校验与提交</Link>
            时，打开、关闭和草稿保留仍由应用决定，提交成功后再更新 open。
          </p>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: (
        <p>
          仅支持下列属性，不透传其余 div 原生属性。initialFocus 与 finalFocus 的完整签名见{' '}
          <Link href="#/components/popover?section=focus-types">焦点参数类型</Link>。
        </p>
      ),
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
              description: '标题下的补充说明，关联为 dialog 的可访问描述。',
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
              type: 'PopupFocusTarget',
              defaultValue: '首个可聚焦元素；触摸打开时聚焦面板本身',
              description:
                '可传布尔值、元素 ref 或回调。回调接收打开方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回元素指定目标、true / null 使用默认行为、false / undefined 不移动焦点。',
            },
            {
              name: 'finalFocus',
              type: 'PopupFocusTarget',
              defaultValue: '触发器或先前聚焦元素',
              description:
                '可传布尔值、元素 ref 或回调。回调接收关闭方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回值约定同 initialFocus；false 不返回焦点。',
            },
            {
              name: 'closeLabel',
              type: 'string',
              defaultValue: '"关闭浮层"',
              description: '内置关闭按钮的可访问名称。',
            },
            ...popupRows('bottom', 'start'),
          ],
        },
      ],
    },
    {
      id: 'focus-types',
      kind: 'api',
      title: '焦点参数类型',
      content: (
        <>
          <p>
            initialFocus 与 finalFocus 共用下列值类型，回调分别接收打开、关闭时的交互方式。
            RefObject 来自 React。
          </p>
          <div className="source-code">
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Allow keyboard scrolling of the full type signature. */}
            <pre tabIndex={0} role="region" aria-label="焦点参数的 TypeScript 类型">
              <code>{popupFocusTypeSource}</code>
            </pre>
          </div>
        </>
      ),
    },
    {
      id: 'keyboard',
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            点击触发器或用 Enter / Space 打开。关闭按钮、Escape、点击外部以及焦点移出触发器和面板时
            请求关闭；受控模式下仍需调用方更新 open。
          </li>
          <li>
            不锁定页面滚动，Tab / Shift+Tab 可以离开面板继续操作页面。Escape
            或关闭按钮通常返回触发器； 已通过 Tab
            或点击转移到外部的焦点不会被默认回焦抢走。需要固定返回位置时使用 finalFocus。
          </li>
          <li>
            默认聚焦首个可聚焦元素，通常是内置关闭按钮；触摸打开时聚焦浮层本身，避免自动唤起键盘。
            短表单可用 initialFocus 指定输入框，设为 false 时保留当前焦点。
          </li>
          <li>
            title 作为 dialog 的可访问名称，description 作为补充描述。自定义触发器须转发 button
            属性、事件和 ref。
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
            默认向下展开并与触发器起点对齐，空间不足时自动避让，距视口边缘保留 12px。
            长标题和正文可换行，超出可用高度时面板滚动；大表单和长篇正文宜放在页面或 Dialog 中。
          </p>
          <p>
            浮层跟随触发器自身或最近容器的显式 dir，文字、关闭按钮与 start
            等逻辑定位一起调整；未指定时继承 Base UI DirectionProvider。仅设置 CSS direction 或
            dir="auto" 时，请在触发器上同时设置明确的 dir。
          </p>
          <p>
            Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。
            自定义 portalContainer 时，需检查容器的层叠与裁切，确保面板可见且可操作。
          </p>
        </>
      ),
    },
  ],
});
