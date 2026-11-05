import { Link } from 'yahha-ui';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';

const page: DocPage = {
  ...guideMetadata('styling'),
  sections: [
    {
      id: 'styles',
      title: '颜色与布局',
      content: (
        <>
          <p>
            颜色优先通过 <Link href="#/components/theme-provider">ThemeProvider 的 tokens</Link>{' '}
            定制；栏宽、分栏和间距由应用容器控制，也可使用组件公开的 className /
            style。局部样式的作用元素以每页 API 说明为准，避免依赖内部 CSS Modules 类名或 DOM 层级。
          </p>
          <p>
            例如，TextField 的 className 作用于整个字段，style 和 ref 作用于 input；Dialog 的
            className / style / ref 作用于弹窗面板。Toast、EmptyState、ThemeProvider
            不接收任意原生属性。
          </p>
        </>
      ),
    },
    {
      id: 'composition',
      title: '内容通过插槽组合',
      content: (
        <>
          <p>
            Button 的图标、EmptyState 的插画和操作、Dialog 的页脚、Toast 的后续操作都由 ReactNode
            插槽传入，不绑定图标库或图片目录。插画可省略，基础用法不依赖角色素材。
          </p>
          <p>
            装饰性图标与插画插槽会从辅助技术中隐藏。可访问名称放在正文、label 或 IconButton 的
            aria-label 中。
          </p>
        </>
      ),
    },
    {
      id: 'state',
      title: '状态管理',
      content: (
        <>
          <ul>
            <li>Button 的 loading 负责禁用和视觉反馈；请求、错误恢复与重试由调用方处理。</li>
            <li>TextField 的 error 负责呈现错误；校验规则由调用方处理。</li>
            <li>SegmentedControl 和 Dialog 使用受控状态；在回调中更新 value 或 open。</li>
            <li>Toast 的计时、位置、队列与去重由调用方处理。它不会自动消失。</li>
          </ul>
        </>
      ),
    },
    {
      id: 'keyboard',
      title: '键盘与可访问性',
      content: (
        <>
          <p>
            按钮保留 Enter / Space 激活，分段单选使用原生 radio 的 Tab /
            方向键行为，弹窗管理焦点并支持
            Escape。请保留焦点样式，为所有图标操作提供准确名称，并在实际页面中检查文字对比、放大和键盘顺序。
          </p>
          <p>
            本库会响应减少动态效果的系统偏好。调用方新增的动画、图标和异步反馈也需要遵守相同约定。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '如何阅读示例与 API',
      content: (
        <>
          <p>
            接入示例时，展开代码并保存为 Example.tsx；再打开「完整接入」，保存
            App.tsx。两个文件放在同一目录，入口已包含样式导入与默认主题配置。预览与代码来自同一份
            TSX；示例自身已配置主题时，入口不会再次包裹 Provider。
          </p>
          <p>
            API 中「—」表示组件不设置该值。原生元素继承的全部属性不逐项罗列，请以对应 React
            原生类型为准；支持范围和作用目标在每页说明。
          </p>
        </>
      ),
    },
  ],
};

export default page;
