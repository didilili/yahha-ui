import { Link } from 'yahha-ui';
import DialogBasic from '../../examples/feedback/DialogBasic';
import dialogBasicSource from '../../examples/feedback/DialogBasic.tsx?raw';
import DialogForm from '../../examples/feedback/DialogForm';
import dialogFormSource from '../../examples/feedback/DialogForm.tsx?raw';
import DialogExternal from '../../examples/feedback/DialogExternal';
import dialogExternalSource from '../../examples/feedback/DialogExternal.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('dialog', {
  importCode: "import { Dialog } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于需要集中完成的简短编辑、确认或补充说明。Dialog
            是模态弹窗，打开后将焦点保留在当前任务内；普通阅读内容优先放在页面。围绕触发位置展开、允许继续操作页面的轻量交互使用{' '}
            <Link href="#/components/popover">Popover</Link>。
          </p>
          <p>
            Dialog 使用受控状态，调用方必须保存 open 并响应 onOpenChange。title
            提供弹窗名称，应包含能说明当前任务的文字。
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
          title: '基本用法',
          description: '传入触发按钮，用同一份受控状态管理打开与关闭；关闭后焦点回到触发按钮。',
          component: DialogBasic,
          source: dialogBasicSource,
        },
        {
          id: 'form',
          title: '修改并保存站点标题',
          description:
            '打开后填写标题，保存后仅在本页显示结果；取消或关闭会放弃草稿，再次打开仍是上次保存的标题。',
          component: DialogForm,
          source: dialogFormSource,
        },
        {
          id: 'external',
          title: '外部按钮打开与焦点返回',
          description:
            '外部按钮打开阅读提醒，点击弹窗外部不会关闭。使用“返回阅读”、Escape 或关闭按钮收起后，焦点回到外部按钮。',
          component: DialogExternal,
          source: dialogExternalSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与反馈',
      content: (
        <>
          <p>
            触发器与关闭操作发出 onOpenChange 请求，调用方更新 open 后才改变打开状态。 footer
            中的按钮需自行关闭弹窗或提交表单，提交不会自动关闭。
          </p>
          <p>
            编辑时由调用方区分草稿与已保存值，并决定取消、保存成功和失败时如何处理输入。组合示例见{' '}
            <Link href="#/guides/states?section=article-actions">文章编辑与管理</Link>
            ，菜单打开编辑弹窗后通过 finalFocus 返回保留的菜单按钮。
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
              defaultValue: '首个可聚焦元素；触摸时为 Popup',
              description:
                '可传布尔值、元素 ref 或回调。回调接收打开方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回元素指定目标、true / null 使用默认行为、false / undefined 不移动焦点。',
            },
            {
              name: 'finalFocus',
              type: "DialogProps['finalFocus']",
              defaultValue: '触发器或先前聚焦元素',
              description:
                '可传布尔值、元素 ref 或回调。回调接收关闭方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回值约定同 initialFocus；false 不返回焦点。',
            },
            {
              name: 'portalContainer',
              type: "DialogProps['portalContainer']",
              defaultValue: 'body',
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
              description: '关闭按钮的可访问名称。',
            },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于弹窗 Popup div；不透传其余 div 原生属性。',
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
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            触发按钮可用 Enter / Space 打开。打开后 Tab / Shift+Tab
            在弹窗内循环，页面其他内容暂不可操作，页面滚动被锁定。Escape、关闭按钮或点击外部请求关闭；
            disablePointerDismissal 只阻止外部点击关闭。
          </li>
          <li>
            默认聚焦首个可聚焦元素，通常是内置关闭按钮；触摸打开时聚焦弹窗本身，避免自动唤起键盘。
            短表单可用 initialFocus 指定输入框；设为 false 时需自行安排进入弹窗的焦点。
          </li>
          <li>
            关闭后默认返回触发器或先前聚焦元素。省略 trigger、从外部状态打开时，建议通过 finalFocus
            指定仍然存在的返回位置。
          </li>
          <li>
            title 作为可访问名称，description 作为补充描述。illustration
            插槽对辅助技术隐藏，只放装饰内容。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '内容布局与 Portal',
      content: (
        <>
          <p>
            长标题自动换行，内容超出可用高度时整个弹窗滚动，footer
            不固定在底部。复杂表单或长篇正文更适合独立页面，避免把必要操作埋在长滚动区中。
          </p>
          <p>
            弹窗文字与布局方向跟随 Portal 目标；仅设置触发器所在容器的 dir，不会影响 body
            中的弹窗。需要局部 RTL 时，可使用带 dir="rtl" 的 portalContainer。
          </p>
          <p>
            Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。
            自定义 portalContainer 时，需检查容器的层叠与裁切，确保遮罩和弹窗都能正确覆盖页面。
          </p>
        </>
      ),
    },
  ],
});
