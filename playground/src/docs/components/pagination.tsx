import { Link } from 'yahha-ui';
import PaginationBasic from '../../examples/navigation/PaginationBasic';
import paginationBasicSource from '../../examples/navigation/PaginationBasic.tsx?raw';
import PaginationMore from '../../examples/navigation/PaginationMore';
import paginationMoreSource from '../../examples/navigation/PaginationMore.tsx?raw';
import PaginationArchive from '../../examples/navigation/PaginationArchive';
import paginationArchiveSource from '../../examples/navigation/PaginationArchive.tsx?raw';
import PaginationEmpty from '../../examples/navigation/PaginationEmpty';
import paginationEmptySource from '../../examples/navigation/PaginationEmpty.tsx?raw';
import PaginationLinks from '../../examples/navigation/PaginationLinks';
import paginationLinksSource from '../../examples/navigation/PaginationLinks.tsx?raw';
import PaginationAppearance from '../../examples/navigation/PaginationAppearance';
import paginationAppearanceSource from '../../examples/navigation/PaginationAppearance.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('pagination', {
  importCode: "import { Pagination } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于文章列表、搜索结果等内容的分页。默认通过按钮更新当前列表；需要复制页码地址或在新标签打开时，使用
          getPageHref 提供真实链接。数据切片、请求和网址更新由调用方处理。
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
          description: '通过页码按钮切换列表，每页显示三篇文章。',
          component: PaginationBasic,
          source: paginationBasicSource,
        },
        {
          id: 'more',
          title: '多页码与省略',
          description: '以 80 页总数观察省略页码与当前页窗口，不加载文章数据。',
          component: PaginationMore,
          source: paginationMoreSource,
        },
        {
          id: 'empty',
          title: '空列表',
          description: '空列表隐藏数字页码，翻页按钮不可用。',
          component: PaginationEmpty,
          source: paginationEmptySource,
        },
        {
          id: 'appearance',
          title: '普通与圈选',
          description: '两组分页同步当前页；普通当前页保留边框与底色，circled 增加不规则圈选。',
          component: PaginationAppearance,
          source: paginationAppearanceSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看翻页焦点与地址同步',
      content: <p>阅读位置示例重复使用三条本地摘要模拟 80 页；链接示例将当前页码保留在网址中。</p>,
      examples: [
        {
          id: 'archive',
          title: '翻页后的阅读位置',
          description: '翻页后聚焦本页标题，从更新后的内容继续阅读。',
          component: PaginationArchive,
          source: paginationArchiveSource,
          toc: false,
        },
        {
          id: 'links',
          title: '链接分页与地址同步',
          description: '用真实链接翻页，支持浏览器返回和新标签页打开。',
          toc: false,
          component: PaginationLinks,
          source: paginationLinksSource,
        },
      ],
    },
    {
      id: 'design',
      title: '分页状态与阅读位置',
      content: (
        <ul>
          <li>
            currentPage 从 1 开始，totalPages 是总页数，不是文章条数；在 onPageChange
            中同步当前页和对应内容。点击当前页不会重复回调。
          </li>
          <li>
            显示页码会归一化到可用范围，但不会因此触发
            onPageChange。筛选后列表缩减时，调用方需同步修正自身页码；总页数为 0
            时隐藏数字并禁用前后页按钮。
          </li>
          <li>
            页码排在前，上一页与下一页成组排在末尾；窄屏时整组换行，方向入口保持相邻，键盘顺序与视觉顺序一致。
          </li>
          <li>
            切页后的
            URL、焦点和滚动位置由调用方安排。可把焦点移到新一页的标题，让阅读从更新后的内容开始；实际组合见{' '}
            <Link href="#/guides/states?section=archive">个人博客归档</Link>。
          </li>
          <li>
            getPageHref 只生成有效页码的地址；普通主键点击与 Enter 会阻止默认跳转，仍由 onPageChange
            更新内容及网址。修饰键和中键保留浏览器原生导航，不调用回调。
            当前页普通激活不回调；不可用的前后入口不带 href，也不进入 Tab 顺序。
          </li>
          <li>链接例在网址中保存当前页，刷新或返回可恢复，并保留其他参数和片段。</li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: <p>PaginationProps 支持原生 nav 属性，children 除外。</p>,
      api: [
        {
          name: 'PaginationProps',
          rows: [
            {
              name: 'appearance',
              type: "'default' | 'circled'",
              defaultValue: "'default'",
              description:
                '普通当前页外观或不规则圈选；两者均保留当前页语义、对比与 44px 点击目标。',
            },
            {
              name: 'currentPage',
              type: 'number',
              required: true,
              description:
                '从 1 开始的受控页码。显示时取整并限制在可用范围；有页码时，非有限值按 1 处理。',
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
              description:
                '普通激活不同的可用页码后调用；点击当前页不回调。链接模式同样必需，由调用方同步网址。',
            },
            {
              name: 'getPageHref',
              type: '(page: number) => string',
              description:
                '为有效页码生成真实链接；不传时保持按钮。普通激活走 onPageChange，修饰键或中键按原生链接导航。',
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
              description: '列表、所有页码入口（按钮或链接）、省略号的附加类名。',
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
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            nav 默认命名为“文章分页”，同页多组分页应使用不同的 aria-label。每个页码有“第 N
            页”名称，当前页带 aria-current=page。
          </li>
          <li>
            原生按钮通过 Tab 聚焦、Enter / Space
            激活；第一页禁用上一页，末页禁用下一页，禁用按钮退出键盘顺序。
          </li>
          <li>
            链接通过 Tab 聚焦、Enter 激活，Space 保持浏览器的滚动行为。 Cmd / Ctrl
            点击或中键可在新标签打开；是否打开窗口等行为遵循浏览器设置。
          </li>
          <li>
            各个可见页码按钮都在 Tab 顺序中，不使用方向键切换。省略号不可操作，并对辅助技术隐藏。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '窄屏与长页码',
      content: (
        <p>
          有内容时显示首页、末页和当前页附近的页码，按钮数量不会随总页数线性增加。
          页码组在窄屏换行，按钮至少
          44×44px，多位数字保持完整并自然增宽；自定义宽度时也应避免挤压或截断页码。
        </p>
      ),
    },
  ],
});
