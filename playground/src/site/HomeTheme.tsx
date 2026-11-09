import { useState } from 'react';
import { Badge, Button, Link, Popover, SegmentedControl, Input, ThemeProvider } from 'yahha-ui';
import { CodeBlock } from '../docs/CodeBlock';
import './home-theme.css';

const themeOptions = [
  { value: 'pink', label: '粉色' },
  { value: 'blue', label: '浅蓝' },
  { value: 'yellow', label: '浅黄' },
] as const;

type PreviewTheme = (typeof themeOptions)[number]['value'];

export default function HomeTheme() {
  const [theme, setTheme] = useState<PreviewTheme>('pink');
  const label = themeOptions.find((option) => option.value === theme)?.label;
  const source = `<ThemeProvider theme="${theme}">
  <Badge tone="accent">阅读订阅</Badge>
  <Input label="订阅邮箱" placeholder="you@example.com" />
  <Popover
    trigger={<Button>查看配色说明</Button>}
    title="配色说明"
  >
    <Badge tone="accent">${label}预设</Badge>
  </Popover>
</ThemeProvider>`;

  return (
    <section className="home-theme" aria-labelledby="home-theme">
      <header className="home-theme-heading">
        {/* Route navigation focuses this heading without adding a tab stop. */}
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <h2 id="home-theme" tabIndex={-1}>
          主题配色
        </h2>
        <p>支持粉色、浅蓝和浅黄三种配色。切换配色不改变控件尺寸、形状与交互。</p>
      </header>
      <div className="home-theme-layout">
        <ThemeProvider theme={theme} className="home-theme-preview">
          <SegmentedControl
            label="示例配色"
            value={theme}
            onValueChange={setTheme}
            options={themeOptions}
          />
          <div>
            <Badge tone="accent">阅读订阅</Badge>
          </div>
          <Input
            type="email"
            label="订阅邮箱"
            placeholder="you@example.com"
            hint="仅作组件预览，不会发送邮件或保存邮箱。"
          />
          <div className="home-theme-actions">
            <Popover
              trigger={<Button>查看配色说明</Button>}
              title="配色说明"
              description="打开的浮层也沿用当前选择的配色。"
            >
              <Badge tone="accent">{label}预设</Badge>
            </Popover>
          </div>
        </ThemeProvider>
        <div className="home-theme-code">
          <h3>当前配色代码</h3>
          <p>代码随所选配色同步更新。使用前需完成组件安装与样式导入。</p>
          <CodeBlock source={source} />
          <p className="home-theme-link">
            <Link href="#/components/theme-provider?section=theme-tokens">主题预设与颜色定制</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
