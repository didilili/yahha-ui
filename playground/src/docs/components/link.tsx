import LinkExample from '../../examples/content/LinkExample';
import linkSource from '../../examples/content/LinkExample.tsx?raw';
import LinkExternal from '../../examples/content/LinkExternal';
import linkExternalSource from '../../examples/content/LinkExternal.tsx?raw';
import LinkWrapping from '../../examples/content/LinkWrapping';
import linkWrappingSource from '../../examples/content/LinkWrapping.tsx?raw';
import LinkDownload from '../../examples/content/LinkDownload';
import linkDownloadSource from '../../examples/content/LinkDownload.tsx?raw';
import { defineComponentPage } from '../page';
import { nativeRows, example } from '../page-helpers';

export default defineComponentPage('link', {
  importCode: "import { Link } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: <p>用于页面跳转、文章阅读和外部资源入口；保存、收藏等操作使用 Button。</p>,
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example('link-native', '基础用法', '通过链接打开入门指南。', LinkExample, linkSource),
        example(
          'link-external',
          '外部链接',
          '用 external 在新标签页打开，组件会补充 noopener noreferrer。',
          LinkExternal,
          linkExternalSource,
        ),
        example(
          'link-wrapping',
          '长地址换行',
          '在窄栏中保留完整地址与下划线。',
          LinkWrapping,
          linkWrappingSource,
        ),
        example(
          'link-download',
          '文件下载',
          '下载 TXT 清单，或在新标签页阅读同一份文本。',
          LinkDownload,
          linkDownloadSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '让目标在正文中可辨认',
      content: (
        <p>
          链接使用墨色下划线，跨行仍可辨认；悬停加强下划线，键盘聚焦时显示清楚的轮廓。链接文字应说明目标内容，避免只写“点击这里”；长地址可以自然换行。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'LinkProps',
          rows: [
            { name: 'href', type: 'string', required: true, description: '链接目标。' },
            {
              name: 'external',
              type: 'boolean',
              defaultValue: 'false',
              description: '未指定 target 时使用 _blank；显式 target 优先。',
            },
            {
              name: 'target / rel',
              type: '原生 anchor 属性',
              description: 'target=_blank 时保留原 rel 并补充 noopener noreferrer。',
            },
            { name: 'children', type: 'ReactNode', description: '清楚描述目标的链接内容。' },
            ...nativeRows('a'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '导航与新窗口',
      content: (
        <ul>
          {[
            'Tab 聚焦时显示可见轮廓，保留原生链接的 Enter 激活、新窗口和复制地址等操作。组件不接管路由，需要客户端导航时由应用接入。',
            'external 只设置默认打开方式，不根据 href 判断是否为外部地址；外部网站也可以在当前页打开。',
            '在链接文字或相邻说明中交代新窗口行为，让用户在打开前知道会离开当前阅读环境。',
            '没有 disabled 模式。不可访问的目标应由页面提供说明或不渲染链接。',
            'download 沿用原生 anchor 属性，适用于同源、blob 和 data 地址；浏览器决定实际保存方式。示例在卸载时释放 Blob URL，该地址仅用于当前实例，不作为永久资源地址。',
          ].map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ),
    },
  ],
});
