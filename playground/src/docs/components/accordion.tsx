import AccordionBasic from '../../examples/navigation/AccordionBasic';
import accordionBasicSource from '../../examples/navigation/AccordionBasic.tsx?raw';
import AccordionControlled from '../../examples/navigation/AccordionControlled';
import accordionControlledSource from '../../examples/navigation/AccordionControlled.tsx?raw';
import AccordionStates from '../../examples/navigation/AccordionStates';
import accordionStatesSource from '../../examples/navigation/AccordionStates.tsx?raw';
import AccordionAppearance from '../../examples/navigation/AccordionAppearance';
import accordionAppearanceSource from '../../examples/navigation/AccordionAppearance.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('accordion', {
  importCode: "import { Accordion } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于按需展开 FAQ 和补充说明。需要对照阅读时开启
          multiple；多个栏目轮流占用同一内容区域时使用 <a href="#/components/tabs">Tabs</a>
          。主要内容、错误信息和必要告知应始终可见。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'basic',
          title: '单项展开与收起',
          description: '默认展开一项，展开另一项时收起前一项。',
          component: AccordionBasic,
          source: accordionBasicSource,
        },
        {
          id: 'states',
          title: '多项展开、受控与禁用',
          description: '分别查看受控多项展开与不可用的条目。',
          component: AccordionStates,
          source: accordionStatesSource,
        },
        {
          id: 'appearance',
          title: '普通与柔和纸面',
          description: '普通外观保留箭头与展开反馈；soft 增加圆形箭头底座与更明显的展开纸面。',
          component: AccordionAppearance,
          source: accordionAppearanceSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看筛选与多项展开示例',
      content: <p>筛选和展开状态仅保留在当前示例。</p>,
      examples: [
        {
          id: 'controlled',
          title: '筛选与多项展开',
          description: '搜索标题并展开当前可用项；筛掉的展开项会收起。',
          component: AccordionControlled,
          source: accordionControlledSource,
          toc: false,
        },
      ],
    },
    {
      id: 'design',
      title: '展开状态与内容保留',
      content: (
        <ul>
          <li>
            value / onValueChange 管理受控展开项，defaultValue
            设置非受控初始展开项；默认可全部收起，一次展开一项，multiple 允许同时展开多项。
          </li>
          <li>
            单项模式只使用值数组的第一项。从多项切回单项时，非受控状态保留第一项；受控状态需由调用方同步维护数组和有效的项目值。
          </li>
          <li>
            默认卸载关闭内容，keepMounted
            可保留输入草稿等局部状态，隐藏内容不参与键盘顺序。保留的表单字段不会自动禁用，仍可能参与提交和校验。
          </li>
          <li>
            可禁用单项或整组，已展开内容仍保持可见。外部“全部展开”等操作保留当前操作位置，需要进入具体内容时再显式移动焦点。
          </li>
          <li>
            筛选例从同一份数据计算可见条目与可展开值，并清理被隐藏的展开项。
            清空搜索恢复说明列表，不会重新打开已被筛走的项目；批量展开只作用当前可见且可用的说明。
          </li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: <p>内容通过 items 配置；原生 div 属性作用于根元素。</p>,
      api: [
        {
          name: 'AccordionProps',
          rows: [
            {
              name: 'appearance',
              type: "'default' | 'soft'",
              defaultValue: "'default'",
              description: '普通箭头或圆形底座与展开纸面；不改变展开状态、标题层级及整行点击区域。',
            },
            {
              name: 'items',
              type: 'AccordionItem[]',
              required: true,
              description: '每项包含唯一 value、title、content 和可选 disabled。',
            },
            {
              name: 'value',
              type: 'string[]',
              description: '受控展开项，不与 defaultValue 同时使用。',
            },
            {
              name: 'defaultValue',
              type: 'string[]',
              defaultValue: '[]',
              description: '非受控初始展开项。',
            },
            {
              name: 'onValueChange',
              type: '(value: string[]) => void',
              description: '展开或关闭后的值数组。',
            },
            {
              name: 'multiple',
              type: 'boolean',
              defaultValue: 'false',
              description: '允许同时展开多项；单项模式只使用传入值数组第一项。',
            },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: '禁用整个面板组，不强行关闭已展开内容。',
            },
            {
              name: 'keepMounted',
              type: 'boolean',
              defaultValue: 'false',
              description: '关闭时保留 DOM 和表单等局部状态。',
            },
            {
              name: 'headingLevel',
              type: '2 | 3 | 4 | 5 | 6',
              defaultValue: '3',
              description: '标题的语义层级，按所在页面的标题结构选择。',
            },
            {
              name: 'classNames',
              type: '{ item?: string; heading?: string; trigger?: string; panel?: string }',
              description: '各部位附加类名，与默认类名合并。',
            },
            {
              name: 'ref / className / style',
              type: '原生 div 属性',
              description: '作用于最外层 div。',
            },
          ],
        },
        {
          name: 'AccordionItem',
          rows: [
            { name: 'value', type: 'string', required: true, description: '组内唯一的稳定值。' },
            {
              name: 'title',
              type: 'ReactNode',
              required: true,
              description: '标题按钮内容，不放其他交互元素。',
            },
            { name: 'content', type: 'ReactNode', required: true, description: '展开后的内容。' },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: '禁用本项操作，保留可见标题。',
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
            标题是 heading 中的原生按钮；headingLevel
            应匹配所在页面的标题结构。标题内不嵌套链接或其他按钮。
          </li>
          <li>
            Tab / Shift+Tab 按顺序聚焦可用标题按钮，Enter / Space
            展开或收起；当前实现不使用方向键切换标题焦点。
          </li>
          <li>键盘焦点轮廓收进标题行；组合有内容裁切的大圆角容器时，仍需保留适当内间距。</li>
          <li>
            组件管理展开状态与标题、面板之间的语义关联。禁用标题按钮退出 Tab
            顺序，展开或收起不会自动把焦点移入正文。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '长标题与正文',
      content: (
        <p>
          标题自动换行，正文不按固定高度截断。为折叠区设置宽度或局部样式时，保留整行标题的点击区域；
          链接、复制按钮和表单放在正文中，避免嵌入标题按钮。
        </p>
      ),
    },
  ],
});
