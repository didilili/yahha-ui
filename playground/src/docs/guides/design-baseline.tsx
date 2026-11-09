import { Link } from 'yahha-ui';
import DesignBaseline from '../../examples/design/DesignBaseline';
import designBaselineSource from '../../examples/design/DesignBaseline.tsx?raw';
import DesignReading from '../../examples/design/DesignReading';
import designReadingSource from '../../examples/design/DesignReading.tsx?raw';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';
import {
  DesignColorReference,
  DesignControlReference,
  DesignStateReference,
  DesignTypographyReference,
} from './design-reference';

const page: DocPage = {
  ...guideMetadata('design-baseline'),
  sections: [
    {
      id: 'language',
      title: '设计语言',
      content: (
        <>
          <p>
            本页展示默认配色、文字层级、控件尺寸与状态的组合规范。组件继承应用字体，角色插画按需接入；基础组件不依赖这些素材。
          </p>
        </>
      ),
    },
    {
      id: 'scope',
      title: '颜色与轮廓',
      tocTitle: '颜色与用途',
      content: (
        <>
          <p>
            默认主题以纯白为内容底色、暖墨为文字与轮廓、粉色为强调色。按钮使用不对称圆角，分类标记与栏目页签保留纸签和墨线细节；内容面保持平整。
          </p>
          <DesignColorReference />
          <p>
            色样读取当前主题的 CSS 变量，名称对应公开的 ThemeTokens。覆盖方式与默认值见{' '}
            <Link href="#/components/theme-provider?section=api">ThemeProvider API</Link>。
            粉色、浅蓝与浅黄预设见
            <Link href="#/components/theme-provider?section=theme-variants">配色对照</Link>
            ；成功、警告和错误用来表达状态。
          </p>
        </>
      ),
    },
    {
      id: 'scale',
      title: '控件与文字尺寸',
      tocTitle: '字阶与尺寸',
      content: (
        <>
          <p>
            Heading 的层级决定标题语义与默认字号，Text 的尺寸用于正文和辅助说明。正文默认 16px、1.8
            倍行高；标题使用 1.45 倍行高。先选择语义层级，再安排页面中的阅读顺序。
          </p>
          <DesignTypographyReference />
          <p>
            以下 Button 只用于比较尺寸。常规单行 Button、IconButton、Input 和 Select 以 44px
            对齐；Button / IconButton 另有紧凑与宽松档，各组件支持的尺寸以其 API 为准。
          </p>
          <DesignControlReference />
          <p>
            控件文字与正文分开设置。手机或粗指针下，输入文字使用
            16px；长选项、多行标签与放大的文字允许控件增高。 Textarea 按 rows
            与内容排布，不裁成单行高度。44px 控件高度与实际点击区域是不同指标。
          </p>
        </>
      ),
    },
    {
      id: 'states',
      title: '状态与键盘操作',
      tocTitle: '状态与焦点',
      content: (
        <>
          <p>
            用 Tab 移动到收藏按钮和字段，观察真实焦点；悬停与按下由当前操作触发。可切换收藏与勾选，
            也可补全邮箱消除错误。禁用控件不能操作，只读字段仍可选择和复制。
          </p>
          <DesignStateReference />
          <p>选中、禁用与错误同时提供文字或语义信息，颜色和轮廓只作辅助。</p>
        </>
      ),
    },
    {
      id: 'constraints',
      title: '应用布局与定制',
      tocTitle: '布局与定制',
      content: (
        <>
          <p>
            主题通过公开的 ThemeTokens 定制颜色；组件尺寸、状态与交互使用各自的公开属性。
            页面栏宽、分栏与段落间距由外层容器安排。
          </p>
          <p>
            局部外观通过 className / classNames / style 定制，内部尺寸变量不是公共定制
            API。具体方式见 <Link href="#/guides/styling">使用与定制</Link>。
          </p>
          <p>
            组织方式参考{' '}
            <Link href="https://ant.design/docs/react/customize-theme/" external>
              Ant Design 主题
            </Link>{' '}
            与{' '}
            <Link href="https://www.radix-ui.com/themes/docs/theme/typography" external>
              Radix 排版
            </Link>
            。点击区域说明见{' '}
            <Link
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html"
              external
            >
              W3C 的 44×44 点击目标
            </Link>
            。
          </p>
        </>
      ),
    },
    {
      id: 'controls',
      title: '应用示例：表单与按钮',
      tocTitle: '表单组合',
      disclosure: true,
      content: (
        <p>
          示例包含邮箱校验、分类选择、设置保存，以及只读、禁用与收藏状态。Tab
          可在字段与按钮间移动焦点；本例不向服务器发送数据。
        </p>
      ),
      examples: [
        {
          id: 'design-controls',
          title: '表单状态与按钮尺寸',
          toc: false,
          description:
            '常规字段和操作对齐，加载保留宽高；紧凑与宽松档通过公开 size 使用。请求与结果均为本地演示。',
          component: DesignBaseline,
          source: designBaselineSource,
          themeScope: 'explicit',
        },
      ],
    },
    {
      id: 'reading',
      title: '应用示例：阅读与收藏',
      tocTitle: '阅读组合',
      disclosure: true,
      content: (
        <p>
          切换正文与目录、筛选已收藏手记，或收藏当前文章。正文使用默认 16px
          字号，布局由示例中的外层容器安排。
        </p>
      ),
      examples: [
        {
          id: 'design-reading',
          title: '默认组件组成的个人手记',
          toc: false,
          description:
            '组合 Tabs、SegmentedControl、Button 与空态。只需导入组件样式，无需站点字体或角色素材。',
          component: DesignReading,
          source: designReadingSource,
          themeScope: 'explicit',
        },
      ],
    },
  ],
};

export default page;
