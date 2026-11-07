import { Link } from 'yahha-ui';
import TabsBasic from '../../examples/navigation/TabsBasic';
import tabsBasicSource from '../../examples/navigation/TabsBasic.tsx?raw';
import TabsValue from '../../examples/navigation/TabsValue';
import tabsValueSource from '../../examples/navigation/TabsValue.tsx?raw';
import TabsStates from '../../examples/navigation/TabsStates';
import tabsStatesSource from '../../examples/navigation/TabsStates.tsx?raw';
import TabsControlled from '../../examples/navigation/TabsControlled';
import tabsControlledSource from '../../examples/navigation/TabsControlled.tsx?raw';
import TabsCounts from '../../examples/navigation/TabsCounts';
import tabsCountsSource from '../../examples/navigation/TabsCounts.tsx?raw';
import TabsAppearance from '../../examples/navigation/TabsAppearance';
import tabsAppearanceSource from '../../examples/navigation/TabsAppearance.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('tabs', {
  importCode: "import { Tabs } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于在同一区域切换相关内容面板，建立标签与面板的语义关联。只改变一个简短筛选值时使用{' '}
          <Link href="#/components/segmented-control">SegmentedControl</Link>
          ；填写带说明的单选答案时使用 <Link href="#/components/radio-group">RadioGroup</Link>
          ；需要收起选项时使用 <Link href="#/components/select">Select</Link>。跨页面导航使用链接。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'basic',
          title: '基础用法',
          description: '切换标签，查看对应内容面板。',
          component: TabsBasic,
          source: tabsBasicSource,
        },
        {
          id: 'appearance',
          title: '普通与墨线',
          description: '普通标签保留直线选中标记；ink 增加倾斜墨线与选中纸面。',
          component: TabsAppearance,
          source: tabsAppearanceSource,
        },
        {
          id: 'controlled-value',
          title: '受控切换',
          description: '切换标签，同步显示当前选择。',
          component: TabsValue,
          source: tabsValueSource,
        },
        {
          id: 'states',
          title: '长标签与禁用栏目',
          description: '对比长标签与暂不可用的归档栏目。',
          component: TabsStates,
          source: tabsStatesSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看数量标记与面板状态保留',
      content: (
        <p>
          明信片例保持输入非受控，预览展示当前草稿原文；再次修改后切换预览会更新内容。
          预览正文不重复播报，草稿只在当前示例，不发送或持久保存。
        </p>
      ),
      examples: [
        {
          id: 'counts',
          title: '标签数量与列表同步',
          description: '归档清单中的手记，数量标记与两个面板同步更新。',
          component: TabsCounts,
          source: tabsCountsSource,
          toc: false,
        },
        {
          id: 'controlled',
          title: '保留面板状态',
          description: '切换到预览，再返回编辑；输入内容保持不变。',
          component: TabsControlled,
          source: tabsControlledSource,
          toc: false,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与内容面板',
      content: (
        <ul>
          <li>
            value / onValueChange 管理受控选择，defaultValue
            设置非受控初始值；未指定初始值时选择首个可用项，null 可表示不选中任何面板。
          </li>
          <li>
            非受控选中项被移除或禁用后，会回退到可用项并报告变化；受控模式需由调用方在 items
            变化时维护有效 value。
          </li>
          <li>
            默认卸载未选中面板，keepMounted 保留 DOM
            和草稿等局部状态，隐藏内容不参与键盘顺序。面板中的受控输入仍由调用方维护；保留的字段不会自动禁用，仍可能参与提交和校验。
          </li>
          <li>
            面板切换不会自动移动焦点到内容中的输入；“继续填写”等操作可由调用方显式聚焦。组合示例见{' '}
            <Link href="#/guides/states?section=archive">个人博客归档</Link>。
          </li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: <p>标签和面板通过 items 配置；原生 div 属性作用于根元素。</p>,
      api: [
        {
          name: 'TabsProps',
          rows: [
            {
              name: 'appearance',
              type: "'default' | 'ink'",
              defaultValue: "'default'",
              description: '普通直线选中标记，或倾斜墨线与选中纸面；不改变选择和键盘行为。',
            },
            {
              name: 'label',
              type: 'string',
              required: true,
              description: '标签列表 tablist 的可访问名称。',
            },
            {
              name: 'items',
              type: 'TabItem[]',
              required: true,
              description: '标签及其对应内容面板。value 组内唯一。',
            },
            {
              name: 'value',
              type: 'string | null',
              description: '受控选中值；null 不选中任何面板。',
            },
            {
              name: 'defaultValue',
              type: 'string | null',
              defaultValue: '首个可用项',
              description: '非受控初始值，不与 value 同时使用。',
            },
            {
              name: 'onValueChange',
              type: '(value: string | null) => void',
              description:
                '选择变化；非受控选中项被禁用或移除时也会报告回退，无可用项时可能为 null。',
            },
            {
              name: 'activateOnFocus',
              type: 'boolean',
              defaultValue: 'false',
              description:
                '方向键聚焦时直接切换内容，适合可即时显示的面板；默认需要 Enter / Space。',
            },
            {
              name: 'keepMounted',
              type: 'boolean',
              defaultValue: 'false',
              description: '保留隐藏面板 DOM 和局部状态。',
            },
            {
              name: 'classNames',
              type: '{ list?: string; tab?: string; panel?: string }',
              description: '标签列表、各标签按钮、各内容面板的附加类名。',
            },
            {
              name: 'ref / className / style',
              type: '原生 div 属性',
              description: '指向根 div，不指向列表或当前面板。',
            },
          ],
        },
        {
          name: 'TabItem',
          rows: [
            { name: 'value', type: 'string', required: true, description: '组内唯一的稳定值。' },
            {
              name: 'label',
              type: 'ReactNode',
              required: true,
              description: '标签按钮内容，不放其他交互控件。',
            },
            {
              name: 'content',
              type: 'ReactNode',
              required: true,
              description: '对应面板的内容。',
            },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: '禁用该项激活，保留可被方向键发现的名称。',
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
            Tab 进入标签列表后，左右方向键移动焦点并在首尾循环，Home / End 移到首项或末项。默认
            Enter / Space 激活，activateOnFocus 开启后随聚焦切换；切换后焦点留在标签上，再按 Tab
            进入面板。左右方向键遵循当前 LTR / RTL 方向。
          </li>
          <li>
            label 为 tablist 提供可访问名称；组件管理 tab / tabpanel 的角色、ID
            和相互关联。标签按钮内不嵌套其他交互控件。
          </li>
          <li>
            禁用标签使用
            aria-disabled，允许方向键聚焦以读取名称，但不可激活。焦点所在标签与当前选中面板可能不同。
          </li>
          <li>
            方向优先读取 Tabs 根节点或最近容器上的显式 dir，包括 Shadow DOM 宿主与 slot
            所在的容器；未指定时继承上游 DirectionProvider。仅使用 CSS direction 或 dir="auto"
            时，请同时配置 Tabs 的显式 dir；没有原生 dir 覆盖时，也可同步 Base UI DirectionProvider
            的 direction，保证视觉顺序与键盘一致。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '长标签与面板布局',
      content: (
        <p>
          每个标签至少 44px 高，列表四周为焦点轮廓留出空间。
          长标签与标签列表可以换行。即使列表分成多行，左右方向键仍按标签顺序移动；不要把换行布局当作二维网格。
          面板中的文章、表单等内容由调用方排版，局部间距可通过 classNames.panel 调整。
        </p>
      ),
    },
  ],
});
