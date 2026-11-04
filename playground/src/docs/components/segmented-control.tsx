import { Link } from 'yahha-ui';
import SegmentedBasic from '../../examples/forms/SegmentedBasic';
import segmentedBasicSource from '../../examples/forms/SegmentedBasic.tsx?raw';
import SegmentedFiltering from '../../examples/forms/SegmentedFiltering';
import segmentedFilteringSource from '../../examples/forms/SegmentedFiltering.tsx?raw';
import SegmentedDisabled from '../../examples/forms/SegmentedDisabled';
import segmentedDisabledSource from '../../examples/forms/SegmentedDisabled.tsx?raw';
import SegmentedForm from '../../examples/forms/SegmentedForm';
import segmentedFormSource from '../../examples/forms/SegmentedForm.tsx?raw';
import SegmentedLongLabels from '../../examples/forms/SegmentedLongLabels';
import segmentedLongLabelsSource from '../../examples/forms/SegmentedLongLabels.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('segmented-control', {
  importCode: "import { SegmentedControl } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用一组紧凑的简短选项切换分类、排序等互斥值。选项需要补充说明或纵向比较时使用{' '}
          <Link href="#/components/radio-group">RadioGroup</Link>；需要收起选项时使用{' '}
          <Link href="#/components/select">Select</Link>；切换同一区域中对应的内容面板使用{' '}
          <Link href="#/components/tabs">Tabs</Link>。页面导航使用链接。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页使用本地状态和文章，不请求接口或保存设置。</p>,
      examples: [
        {
          id: 'basic',
          title: '基础用法',
          description: '切换文章类型。',
          component: SegmentedBasic,
          source: segmentedBasicSource,
        },
        {
          id: 'filtering',
          title: '筛选本地文章',
          description: '按类型筛选文章，查看列表与数量变化。',
          component: SegmentedFiltering,
          source: segmentedFilteringSource,
        },
        {
          id: 'disabled',
          title: '禁用选项与整组禁用',
          description: '对比单项与整组禁用，并切换整组可用状态。',
          component: SegmentedDisabled,
          source: segmentedDisabledSource,
        },
        {
          id: 'form',
          title: '原生表单与显式重置',
          description: '选择必选排序值后读取，或恢复为未选择；不重排文章。',
          component: SegmentedForm,
          source: segmentedFormSource,
        },
        {
          id: 'long-labels',
          title: '长标签与窄容器',
          description: '在窄栏中切换专题，查看选项如何换行排列。',
          component: SegmentedLongLabels,
          source: segmentedLongLabelsSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与表单',
      content: (
        <ul>
          <li>
            这是受控单选组：value 指定当前值，onValueChange
            返回选项值，由调用方更新。选项值须保持唯一；用空字符串表示待选择时，不再将它用作有效选项值。
          </li>
          <li>
            显式 name 提供稳定的 FormData
            字段名；省略时仍有自动生成的唯一名称。同一表单内的独立组使用不同 name，form
            可关联外部表单。
          </li>
          <li>required 使用原生必选约束。表单重置需在 onReset 中同步恢复 React 状态。</li>
          <li>
            disabled 禁用整组，单项 disabled 只禁用该项，也支持父 fieldset
            禁用。禁用项不参与操作与提交，已选项被禁用后仍保留选中标记。
          </li>
          <li>
            选择变化后的筛选、正文更新与 URL
            同步由调用方处理；需要可见的校验错误时，在组旁提供说明，并用 aria-describedby 关联。
          </li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: (
        <p>
          <code>SegmentedControlProps&lt;T&gt;</code> 的 <code>T</code>{' '}
          为字符串类型，组件只支持受控选择。未单列的原生 fieldset 属性作用于整组，不支持
          children、defaultValue 或 defaultChecked。选项由 options 提供，补充内容放在组件外。
        </p>
      ),
      api: [
        {
          name: 'SegmentedControlProps<T extends string>',
          rows: [
            {
              name: 'options',
              type: 'readonly SegmentedOption<T>[]',
              required: true,
              description: '所有选项。每项 value 必须唯一。',
            },
            {
              name: 'value',
              type: 'T',
              required: true,
              description: '当前受控值。空字符串可表示待选择；有值时应对应 options 中的一项。',
            },
            {
              name: 'onValueChange',
              type: '(value: T) => void',
              required: true,
              description: '选择变化时传入选项值。调用方需要更新 value；参数不是 DOM 事件。',
            },
            {
              name: 'label',
              type: 'string',
              required: true,
              description: '单选组的可访问名称，通过隐藏的 legend 提供。需要可见标题时在外部添加。',
            },
            {
              name: 'name',
              type: 'string',
              defaultValue: '自动生成唯一名称',
              description: '组内 radio 的共同名称。显式设置可使用稳定字段名读取 FormData。',
            },
            {
              name: 'form',
              type: 'string',
              description: '通过表单 ID 关联 fieldset 及内部所有 radio。',
            },
            {
              name: 'required',
              type: 'boolean',
              defaultValue: 'false',
              description: '将原生必选约束传给 radio。有效的受控选中值通常已经满足约束。',
            },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false（原生）',
              description: '禁用整个 fieldset 及全部 radio。禁用字段不参与提交。',
            },
            { name: 'className', type: 'string', description: '根 fieldset 的附加类名。' },
            {
              name: 'classNames',
              type: '{ options?: string; option?: string }',
              description: '选项容器与每个选项 label 的附加类名。',
            },
            { name: 'style', type: 'CSSProperties', description: '作用于根 fieldset。' },
            {
              name: 'ref',
              type: 'Ref<HTMLFieldSetElement>',
              description: '指向根 fieldset，不指向某个 radio。',
            },
            {
              name: '其他原生属性 / 事件',
              type: 'ComponentPropsWithRef<"fieldset">',
              description:
                'id、aria-*、onFocus、onBlur 等作用于 fieldset；onChange 可接收冒泡事件，状态更新仍使用 onValueChange。',
            },
          ],
        },
        {
          name: 'SegmentedOption<T extends string>',
          rows: [
            {
              name: 'value',
              type: 'T',
              required: true,
              description: '唯一选项值，作为 radio 的 value 和变化回调参数。',
            },
            {
              name: 'label',
              type: 'ReactNode',
              required: true,
              description:
                '选项内容，支持文字或简单图标组合；应包含清楚的可访问名称，不嵌套交互控件。',
            },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: '仅禁用此选项；组件级 disabled 优先。',
            },
          ],
        },
        {
          name: 'classNames',
          rows: [
            {
              name: 'options',
              type: 'string',
              description: '选项的共同容器，可用于调整组内布局。',
            },
            {
              name: 'option',
              type: 'string',
              description: '每个选项的 label，可用于调整单项布局。',
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
            Tab 进入原生单选组，方向键在可用项间移动并选择，Space 选择聚焦项；禁用项不参与选择。组内
            Tab 入口和方向键边界行为依浏览器而异。
          </li>
          <li>
            选项应有可读名称，标签内不嵌套链接或按钮。外部提示或错误通过 aria-describedby
            关联后，聚焦各选项时也能读取。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '样式定制',
      content: (
        <p>
          需要等宽选项时，可为 classNames.option 对应的类设置 <code>flex: 1 1 0</code>，再通过
          classNames.options 设置选项容器宽度。默认允许选项和长标签换行，避免用固定高度截断文字。
        </p>
      ),
    },
  ],
});
