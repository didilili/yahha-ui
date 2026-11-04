import { Link } from 'yahha-ui';
import PaginationBasic from '../../examples/navigation/PaginationBasic';
import paginationBasicSource from '../../examples/navigation/PaginationBasic.tsx?raw';
import PaginationArchive from '../../examples/navigation/PaginationArchive';
import paginationArchiveSource from '../../examples/navigation/PaginationArchive.tsx?raw';
import PaginationEmpty from '../../examples/navigation/PaginationEmpty';
import paginationEmptySource from '../../examples/navigation/PaginationEmpty.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('pagination', {
  importCode: "import { Pagination } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          将文章列表、搜索结果等分成多页阅读时使用。组件提供受控的按钮式分页，适合在当前页面更新列表；数据切片与请求由调用方处理。需要可复制地址、在新标签打开等真实
          URL 导航时，应使用链接式分页。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页示例只更新本地内容，不请求数据或改变网址。</p>,
      examples: [
        {
          id: 'basic',
          title: '对文章列表分页',
          description: '翻页查看每页三篇文章。',
          component: PaginationBasic,
          source: paginationBasicSource,
        },
        {
          id: 'archive',
          title: '较多页码与翻页阅读',
          description: '用三篇摘要模拟 80 页归档，翻页后聚焦本页标题。',
          component: PaginationArchive,
          source: paginationArchiveSource,
        },
        {
          id: 'empty',
          title: '空列表',
          description: '空列表隐藏数字页码，翻页按钮不可用。',
          component: PaginationEmpty,
          source: paginationEmptySource,
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
            时隐藏数字并禁用两侧按钮。
          </li>
          <li>
            切页后的
            URL、焦点和滚动位置由调用方安排。可把焦点移到新一页的标题，让阅读从更新后的内容开始；实际组合见{' '}
            <Link href="#/guides/states?section=archive">个人博客归档</Link>。
          </li>
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
