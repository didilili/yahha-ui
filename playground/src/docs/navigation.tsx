import { Link } from 'yahha-ui';
import TabsBasic from '../examples/navigation/TabsBasic';
import tabsBasicSource from '../examples/navigation/TabsBasic.tsx?raw';
import TabsControlled from '../examples/navigation/TabsControlled';
import tabsControlledSource from '../examples/navigation/TabsControlled.tsx?raw';
import PaginationBasic from '../examples/navigation/PaginationBasic';
import paginationBasicSource from '../examples/navigation/PaginationBasic.tsx?raw';
import PaginationArchive from '../examples/navigation/PaginationArchive';
import paginationArchiveSource from '../examples/navigation/PaginationArchive.tsx?raw';
import AccordionBasic from '../examples/navigation/AccordionBasic';
import accordionBasicSource from '../examples/navigation/AccordionBasic.tsx?raw';
import AccordionControlled from '../examples/navigation/AccordionControlled';
import accordionControlledSource from '../examples/navigation/AccordionControlled.tsx?raw';
import type { DocPage } from './types';

export const navigationPages: DocPage[] = [
  {
    id: 'tabs',
    name: 'Tabs',
    chinese: '标签页',
    group: '导航',
    description: '在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。',
    importCode: "import { Tabs } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            当多个内容面板共享同一块空间时使用。Tabs
            管理标签、面板与可访问关联；只需要改变一个筛选值时，可使用
            <Link href="#/components/segmented-control">SegmentedControl</Link>
            。跨页面导航应使用链接。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本栏目与内容面板',
            description:
              '未指定 value / defaultValue 时，默认选择第一个可用项。44px 标签下方的短墨线标出当前内容，不增加选择托盘。',
            component: TabsBasic,
            source: tabsBasicSource,
          },
          {
            id: 'controlled',
            title: '受控、禁用与保留草稿',
            description:
              'keepMounted 保留草稿，外部“回到明信片”继续到输入框；手动切换保留标签焦点，当前栏目显示中文名称。归档项不可激活。',
            component: TabsControlled,
            source: tabsControlledSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与阅读',
        content: (
          <p>
            栏目保持开放，用下缘短墨线标记当前面板，不加选择托盘。操作区最小
            44px，长标签自然换行；禁用选中项的墨线跟随文字颜色，键盘焦点单独可辨。切换标签时焦点留在标签，明确的“继续填写”操作才进入输入框。组合使用见
            <Link href="#/guides/states?section=archive">个人博客归档</Link>
            ，值筛选与真正的内容面板保持区别。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        content: (
          <p>
            TabsProps 继承原生 div 属性，排除 children 和
            defaultValue。原生属性、事件、ref、className 和 style 均作用于根 div。
          </p>
        ),
        api: [
          {
            name: 'TabsProps',
            rows: [
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
                description: '方向键聚焦时直接切换内容；默认需要 Enter / Space。',
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
        title: '键盘与状态约定',
        content: (
          <ul>
            <li>
              Tab 进入标签列表；左右方向键、Home / End 移动焦点；默认 Enter / Space
              激活。activateOnFocus 开启后随聚焦切换。
            </li>
            <li>
              沿用 Base UI 的策略：禁用标签带
              aria-disabled，允许方向键聚焦但不可激活。默认选择首个可用项。
            </li>
            <li>
              Base UI 管理 tab / tabpanel 的角色、ID 与相互关联；受控模式需要调用方在 items
              变化时同步维护有效的 value。
            </li>
            <li>
              默认卸载未选中面板；keepMounted
              保留本地状态，隐藏面板不参与键盘顺序。组件不负责数据请求或路由。
            </li>
          </ul>
        ),
      },
      {
        id: 'styling',
        title: '样式入口',
        content: (
          <p>
            根 div 使用 className / style；classNames.list、tab、panel 与默认类名合并。标签至少
            44px，水平列表和长标题可自然换行。三套主题使用同一套结构。
          </p>
        ),
      },
    ],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    chinese: '分页',
    group: '导航',
    description: '在文章列表和归档中切换页码，保留首页、末页和当前页附近的页码。',
    importCode: "import { Pagination } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            当列表需要分批阅读时使用。组件只管理可用页码和按钮状态，数据切片、请求、URL
            同步、切页后的焦点与滚动由调用方处理。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '对文章列表分页',
            description:
              '通过 currentPage / onPageChange 更新本地数组的显示范围。totalPages 传总页数，不传文章条数。',
            component: PaginationBasic,
            source: paginationBasicSource,
          },
          {
            id: 'archive',
            title: '较多页码与空列表',
            description:
              '三篇本地摘要和编号模拟 80 页，翻页实际更新当前列表并继续到本页标题；省略页码、窄屏换行和零页边界一同保留。',
            component: PaginationArchive,
            source: paginationArchiveSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与阅读',
        content: (
          <p>
            普通页码使用轻纸边，当前页用圆钝墨圈标出，键盘焦点另行保留。按钮内的数字与文字居中，最小
            44×44px，长页码自然增宽，窄屏自然换行；禁用边界与不可操作的省略号保持区别。列表切片、搜索后的页码重置和切页后的阅读位置由调用方管理。
            <Link href="#/guides/states?section=archive">归档组合</Link>
            让栏目、搜索结果和页码共同变化，不只更新一行数字。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        content: (
          <p>
            PaginationProps 继承原生 nav 属性，排除 children。原生属性、事件与 ref 作用于
            nav。当前版本为按钮式受控分页，不提供链接模式。
          </p>
        ),
        api: [
          {
            name: 'PaginationProps',
            rows: [
              {
                name: 'currentPage',
                type: 'number',
                required: true,
                description: '从 1 开始的受控页码。显示时取整并限制在可用范围。',
              },
              {
                name: 'totalPages',
                type: 'number',
                required: true,
                description:
                  '总页数。取整并限制在 0 与 Number.MAX_SAFE_INTEGER 之间；非有限值按 0 处理。',
              },
              {
                name: 'onPageChange',
                type: '(page: number) => void',
                required: true,
                description: '激活不同的可用页码后调用；点击当前页不回调。',
              },
              {
                name: 'siblingCount',
                type: 'number',
                defaultValue: '1',
                description: '当前页两侧的相邻页数，取整并限制在 0–2；非有限值使用 1。',
              },
              {
                name: 'aria-label',
                type: 'string',
                defaultValue: '文章分页',
                description: 'nav 的可访问名称；多组分页应区分命名。',
              },
              {
                name: 'classNames',
                type: '{ list?: string; button?: string; ellipsis?: string }',
                description: '列表、所有按钮、省略号的附加类名。',
              },
              {
                name: 'ref / className / style',
                type: '原生 nav 属性',
                description: '作用于最外层 nav。',
              },
            ],
          },
        ],
      },
      {
        id: 'behavior',
        title: '边界与键盘',
        content: (
          <ul>
            <li>
              原生按钮使用 Tab 聚焦、Enter / Space 激活；第一页禁用上一页，末页禁用下一页。当前页带
              aria-current=page。
            </li>
            <li>总页数为 0 时不显示数字，两侧按钮禁用。非有限的当前页按第 1 页显示。</li>
            <li>显示值归一化不会触发 onPageChange；列表缩减后，调用方仍应同步修正自身页码。</li>
            <li>
              按钮数不会随总页数线性增长，省略号是对读屏隐藏的装饰。真实 URL
              导航应使用链接；本组件不模拟路由行为。
            </li>
          </ul>
        ),
      },
      {
        id: 'styling',
        title: '样式入口',
        content: (
          <p>
            className / style 作用于 nav；classNames.list、button、ellipsis 分别扩展各部位。按钮至少
            44×44px，较长页码和整体列表在窄屏自然换行。
          </p>
        ),
      },
    ],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    chinese: '折叠面板',
    group: '内容展示',
    description: '展开 FAQ 和补充说明，提供单项或多项展开，使用语义标题和按钮。',
    importCode: "import { Accordion } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            用于可按需阅读的帮助、FAQ
            和次要说明。需要始终可见的主要内容、错误信息和必要告知不宜默认收起。多个内容需要对照阅读时开启
            multiple。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '常见问题',
            description: 'defaultValue 设置初始展开项，默认一次只展开一个；再次点击可关闭。',
            component: AccordionBasic,
            source: accordionBasicSource,
          },
          {
            id: 'controlled',
            title: '受控、多项展开与禁用',
            description:
              '外部按钮展开可用说明或全部收起，当前操作保留焦点；长标题自然换行，圆扣对齐第一行。阅读与能力边界分别说明，准备中的条目不可操作。',
            component: AccordionControlled,
            source: accordionControlledSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与阅读',
        content: (
          <p>
            折叠说明用轻纸线分隔，28px 圆扣对齐问题第一行，与栏目墨线和页码圈记区分。标题的 20px
            行框与上下各 4px 留白匹配圆扣，操作区最小 44px，多行自然增高；正文保持
            16px。禁用已展开项仍保留箭头方向，圆扣使用中性底色。批量操作不强行跳进内容，关键错误和恢复入口始终可见。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        content: (
          <p>
            AccordionProps 继承原生 div 属性，排除 children 和 defaultValue。ref、className、style
            与其余原生属性作用于根 div。
          </p>
        ),
        api: [
          {
            name: 'AccordionProps',
            rows: [
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
        title: '键盘与使用约定',
        content: (
          <ul>
            <li>
              Tab / Shift+Tab 按原生顺序聚焦可用标题按钮，Enter / Space
              展开或收起；不使用方向键切换标题焦点。
            </li>
            <li>
              标题是 heading 中的原生按钮，aria-expanded、aria-controls、面板关联与 ID 由 Base UI
              管理。
            </li>
            <li>
              默认卸载关闭内容，keepMounted
              可保留当前页面的输入状态；隐藏内容不参与键盘顺序。组件不提交表单值。
            </li>
            <li>
              value 使用有效项目的字符串数组；受控模式由调用方同步维护 items
              和展开状态。标题中不能再嵌套链接或按钮。
            </li>
          </ul>
        ),
      },
      {
        id: 'styling',
        title: '样式入口',
        content: (
          <p>
            className / style 作用于根 div，classNames 提供
            item、heading、trigger、panel。标题按钮最小高度
            44px；局部样式重置标题默认间距，不影响站点其他标题。
          </p>
        ),
      },
    ],
  },
];
