import { Link } from 'yahha-ui';
import MenuBasic from '../../examples/floating/MenuBasic';
import menuBasicSource from '../../examples/floating/MenuBasic.tsx?raw';
import MenuOpen from '../../examples/floating/MenuOpen';
import menuOpenSource from '../../examples/floating/MenuOpen.tsx?raw';
import MenuTriggerRecovery from '../../examples/floating/MenuTriggerRecovery';
import menuTriggerRecoverySource from '../../examples/floating/MenuTriggerRecovery.tsx?raw';
import { defineComponentPage } from '../page';
import { stateRows, popupRows } from '../page-helpers';

export default defineComponentPage('dropdown-menu', {
  importCode: "import { DropdownMenu } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于收纳收藏、编辑、移出列表等一组动作。每项通过 onSelect
            执行操作；表单中的分类、排序和单个值选择使用{' '}
            <Link href="#/components/select">Select</Link>，页面跳转使用链接。
          </p>
          <p>
            当前提供非模态的单层动作菜单，允许继续操作页面且不锁定滚动。需要填写内容的任务使用{' '}
            <Link href="#/components/popover">Popover</Link> 或{' '}
            <Link href="#/components/dialog">Dialog</Link>。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: (
        <p>示例只更新本页状态，不连接后台；基础例会显示选中的操作，不实际收藏或生成摘要。</p>
      ),
      examples: [
        {
          id: 'basic',
          previewAlign: 'center',
          title: '基础用法',
          description: '选择菜单项后显示当前操作。',
          component: MenuBasic,
          source: menuBasicSource,
        },
        {
          id: 'open-state',
          previewAlign: 'center',
          title: '受控展开状态',
          description: '打开或关闭菜单，查看展开状态。',
          component: MenuOpen,
          source: menuOpenSource,
        },
        {
          id: 'controlled',
          title: '触发器移除后的焦点恢复',
          description:
            '菜单含禁用发布项与危险移出项；移出手记和菜单入口后回焦恢复按钮，恢复后返回菜单入口。',
          tocTitle: '焦点恢复、禁用项与危险项',
          component: MenuTriggerRecovery,
          source: menuTriggerRecoverySource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与反馈',
      content: (
        <>
          <p>
            每个菜单项使用稳定、唯一的 id 和清楚的文字标签。激活时执行 onSelect 并请求关闭；使用受控
            open 时，调用方需要响应 onOpenChange。
          </p>
          <p>
            业务确认、异步执行和失败处理由调用方负责，destructive
            只改变危险动作的文字颜色。结果应留在页面，移出内容等操作可保留恢复入口。完整的{' '}
            <Link href="#/guides/interactions?section=controlled">草稿编辑、移出与恢复</Link>
            保留未提交的编辑内容；菜单与弹窗的组合见{' '}
            <Link href="#/guides/states?section=article-actions">文章编辑与管理</Link>。
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
            ...popupRows('bottom', 'start'),
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
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            聚焦触发器后，Enter / Space 或上下方向键打开菜单。上下方向键移动焦点并在首尾循环，Home /
            End 移到首项或末项，也可输入标签的起始字符查找项目；Enter / Space 执行聚焦的动作。
          </li>
          <li>
            Escape 关闭后返回触发器；Tab / Shift+Tab 离开菜单，点击外部也会请求关闭。
            禁用项仍可通过方向键聚焦，但不能执行。
          </li>
          <li>
            触发器的可访问名称也是菜单名称，菜单项使用 menuitem 语义。仅有图标的触发器应提供
            aria-label；自定义组件须转发 button 属性、事件和 ref。
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
            长标签可以换行，面板超出可用高度时滚动；自定义宽度时保留窄屏约束。
          </p>
          <p>
            菜单跟随触发器自身或最近容器的显式 dir，文字方向与 start / inline-start
            等逻辑定位保持一致；未指定时继承 Base UI DirectionProvider。仅设置 CSS direction 或
            dir="auto" 时，请在触发器上同时设置明确的 dir。
          </p>
          <p>
            Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。
            自定义 portalContainer 时，需检查容器的层叠与裁切，确保菜单可见且可操作。
          </p>
        </>
      ),
    },
  ],
});
