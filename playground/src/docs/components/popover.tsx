import { Link } from 'yahha-ui';
import PopoverBasic from '../../examples/floating/PopoverBasic';
import popoverBasicSource from '../../examples/floating/PopoverBasic.tsx?raw';
import PopoverForm from '../../examples/floating/PopoverForm';
import popoverFormSource from '../../examples/floating/PopoverForm.tsx?raw';
import { defineComponentPage } from '../page';
import { stateRows, popupRows } from '../page-helpers';

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
          title: '基本说明',
          description:
            '省略 open 时由组件维护展开状态；标题与描述自动关联到浮层，正文可以选择和复制。',
          component: PopoverBasic,
          source: popoverBasicSource,
        },
        {
          id: 'form',
          title: '修改并保存收藏夹名称',
          description:
            '打开时读取本页已保存名称，取消或关闭会放弃草稿；空白名称给出字段错误，保存后关闭并更新结果。',
          component: PopoverForm,
          source: popoverFormSource,
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
            表单验证、保存和结果反馈由调用方处理，提交不会自动关闭面板。示例在每次打开时从已保存值重建草稿，
            保存成功后更新页面并关闭；关闭浮层本身不代表保存或取消业务操作。
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
              type: "PopoverProps['initialFocus']",
              defaultValue: '首个可聚焦元素；触摸时为 Popup',
              description:
                '可传布尔值、元素 ref 或回调。回调接收打开方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回元素指定目标、true / null 使用默认行为、false / undefined 不移动焦点。',
            },
            {
              name: 'finalFocus',
              type: "PopoverProps['finalFocus']",
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
            ...popupRows('Popover', 'bottom', 'start'),
          ],
        },
      ],
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
          <p>默认使用白纸便笺与浅蓝内底边，标题下用轻纸线分隔。</p>
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
