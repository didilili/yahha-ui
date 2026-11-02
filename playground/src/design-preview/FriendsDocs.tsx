import { useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown, Copy, Heart, Search } from 'lucide-react';
import { Badge, Button, Checkbox, Select, TextField } from 'yahha-ui';
import previewSource from './FriendsDocs.tsx?raw';
import './friends-docs.css';
import Motif from '../site/Motif';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code and API tables need keyboard focus on narrow screens. */

const peek = new URL('../examples/scenes/artwork/friends-preview/friends-peek.svg', import.meta.url)
  .href;

const navigation = [
  { label: 'Button 按钮', id: 'button', group: '基础' },
  { label: 'IconButton 图标按钮', id: 'icon-button', group: '基础' },
  { label: 'Badge 状态标记', id: 'badge', group: '基础' },
  { label: 'Surface 内容容器', id: 'surface', group: '基础' },
  { label: 'TextField 输入框', id: 'text-field', group: '表单' },
  { label: 'Select 下拉选择器', id: 'select', group: '表单' },
  { label: 'Checkbox 复选框', id: 'checkbox', group: '表单' },
  { label: 'Dialog 对话框', id: 'dialog', group: '反馈' },
  { label: 'Toast 提示消息', id: 'toast', group: '反馈' },
  { label: 'EmptyState 空状态', id: 'empty-state', group: '反馈' },
];

function exampleSource(name: string, imports: string) {
  const start = `// example:${name}:start`;
  const end = `// example:${name}:end`;
  return `${imports}\n\n${previewSource.split(start)[1].split(end)[0].trim()}`;
}

// example:greeting:start
export function GreetingExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="fdoc-example-row">
      <Button onClick={() => setCount((value) => value + 1)}>打个招呼</Button>
      <span role="status">
        {count === 0 ? '朋友们在等你打招呼。' : `已收到 ${count} 次问候，好开心！`}
      </span>
    </div>
  );
}
// example:greeting:end

// example:sizes:start
export function SizeExample() {
  return (
    <div className="fdoc-example-row fdoc-size-row">
      <div>
        <Button size="sm">小小问候</Button>
        <span>sm · 36px</span>
      </div>
      <div>
        <Button>一起出发</Button>
        <span>md · 44px</span>
      </div>
      <div>
        <Button size="lg">今天也要开心</Button>
        <span>lg · 52px</span>
      </div>
    </div>
  );
}
// example:sizes:end

// example:form:start
export function SettingsExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string | null>('notes');
  const [share, setShare] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState('');

  return (
    <form
      className="fdoc-settings"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) {
          setError(true);
          setSaved('');
          inputRef.current?.focus();
          return;
        }
        setError(false);
        setSaved(`已记下「${name.trim()}」的设置。`);
      }}
      onReset={() => {
        setName('');
        setCategory('notes');
        setShare(true);
        setError(false);
        setSaved('已恢复初始设置。');
      }}
    >
      <div className="fdoc-settings-fields">
        <TextField
          ref={inputRef}
          label="小站昵称"
          name="nickname"
          value={name}
          required
          placeholder="给小站起个名字"
          hint="名字会显示在小站的介绍里。"
          error={error ? '先写下小站昵称，再保存吧。' : undefined}
          onChange={(event) => {
            setName(event.target.value);
            setError(false);
            setSaved('');
          }}
        />
        <Select
          label="默认内容分类"
          name="category"
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setSaved('');
          }}
          options={[
            { value: 'notes', label: '生活手记' },
            { value: 'reading', label: '阅读角落' },
            { value: 'photos', label: '散步相册' },
          ]}
        />
      </div>
      <Checkbox
        label="把新手记分享给朋友"
        name="share"
        checked={share}
        onChange={(event) => {
          setShare(event.target.checked);
          setSaved('');
        }}
      />
      <div className="fdoc-example-row">
        <Button type="submit">保存设置</Button>
        <Button type="reset" variant="secondary">
          重新填写
        </Button>
        <span role="status">{saved}</span>
      </div>
    </form>
  );
}
// example:form:end

function Demo({
  id,
  title,
  description,
  children,
  source,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  source: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copyState, setCopyState] = useState('复制代码');

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopyState('已复制');
    } catch {
      setExpanded(true);
      setCopyState('复制失败，请选择代码复制');
    }
  }

  return (
    <section className="fdoc-demo" aria-labelledby={`${id}-title`}>
      <div className="fdoc-demo-stage">{children}</div>
      <div className="fdoc-demo-note">
        <h3 id={`${id}-title`}>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="fdoc-code-tools">
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={expanded}
          aria-controls={`${id}-source`}
          endIcon={<ChevronDown size={15} aria-hidden="true" />}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '收起代码' : '查看代码'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          startIcon={
            copyState === '已复制' ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <Copy size={15} aria-hidden="true" />
            )
          }
          onClick={copy}
        >
          {copyState}
        </Button>
      </div>
      <div id={`${id}-source`} hidden={!expanded}>
        <p className="fdoc-source-note">
          源码读取自本页示例。fdoc-* 仅用于演示排版；首次接入请先导入样式并设置 ThemeProvider。
        </p>
        <pre className="fdoc-code" tabIndex={0} aria-label={`${title}源代码`}>
          <code>{source}</code>
        </pre>
      </div>
    </section>
  );
}

const greetingCode = exampleSource(
  'greeting',
  "import { useState } from 'react';\nimport { Button } from 'yahha-ui';",
);
const sizeCode = exampleSource('sizes', "import { Button } from 'yahha-ui';");
const formCode = exampleSource(
  'form',
  "import { useRef, useState } from 'react';\nimport { Button, Checkbox, Select, TextField } from 'yahha-ui';",
);

export default function FriendsDocs() {
  const [search, setSearch] = useState('');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const filtered = navigation.filter((item) =>
    item.label.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <div className="fdoc">
      <aside className="fdoc-aside" aria-label="组件导航">
        <Button
          className="fdoc-nav-toggle"
          variant="ghost"
          aria-expanded={navigationOpen}
          aria-controls="fdoc-component-browser"
          endIcon={<ChevronDown size={16} />}
          onClick={() => setNavigationOpen(!navigationOpen)}
        >
          {navigationOpen ? '收起组件目录' : '浏览与搜索组件'}
        </Button>
        <div
          id="fdoc-component-browser"
          className="fdoc-component-browser"
          data-open={navigationOpen}
        >
          <div className="fdoc-search">
            <TextField
              label="查找组件"
              type="search"
              placeholder="按钮、输入框…"
              value={search}
              leading={<Search size={17} />}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <nav className="fdoc-nav" aria-label="候选方案中的组件入口">
            {['基础', '表单', '反馈'].map((group) => {
              const items = filtered.filter((item) => item.group === group);
              if (!items.length) return null;
              return (
                <div className="fdoc-nav-group" key={group}>
                  <h2>{group}</h2>
                  {items.map((item) => (
                    <a
                      key={item.id}
                      href={item.id === 'button' ? '#fdoc-top' : `./#/components/${item.id}`}
                      aria-current={item.id === 'button' ? 'page' : undefined}
                    >
                      {item.id === 'button' && <Heart size={15} aria-hidden="true" />}
                      {item.label}
                    </a>
                  ))}
                </div>
              );
            })}
            {!filtered.length && <p role="status">没有找到，试试“按钮”或“输入框”。</p>}
          </nav>
          <div className="fdoc-side-foot">
            <Motif name="flower" />
            <p>
              和朋友一起，
              <br />
              把喜欢的东西做好。
            </p>
          </div>
        </div>
      </aside>

      <article className="fdoc-content" id="fdoc-top">
        <header className="fdoc-heading">
          <div className="fdoc-heading-copy">
            <Badge tone="accent">基础 · 一起动手</Badge>
            <h1>
              Button <span>按钮</span>
            </h1>
            <p>
              打个招呼，收藏喜欢，或认真保存。
              <br />
              让每一次小小的行动，都有清楚的回应。
            </p>
          </div>
          <img className="fdoc-peek" src={peek} alt="" width="440" height="170" />
        </header>
        <div className="fdoc-import">
          <code>import {'{ Button }'} from 'yahha-ui';</code>
          <a href="./#/guides/getting-started">
            安装与接入 <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        <section className="fdoc-intro" id="fdoc-usage">
          <h2>什么时候使用？</h2>
          <p>
            用于提交、保存、收藏等操作。页面跳转使用链接；只有图标的操作使用
            IconButton，并提供可访问名称。
          </p>
          <p className="fdoc-preview-note">
            这是文档外观候选。下方直接使用现有公开组件，尺寸与交互保持当前实现。
          </p>
        </section>

        <section className="fdoc-examples" id="fdoc-examples">
          <div className="fdoc-section-title">
            <h2>试着点一下</h2>
            <span>每一个示例，都可以亲手试试。</span>
          </div>
          <Demo
            id="fdoc-basic"
            title="先和朋友打个招呼"
            description="通过 onClick 响应操作。问候次数由示例自己维护，按钮负责清楚地传递动作。"
            source={greetingCode}
          >
            <GreetingExample />
          </Demo>
          <Demo
            id="fdoc-sizes"
            title="小事、大事，都有合适的尺寸"
            description="sm / md / lg 对应 36 / 44 / 52px 最小高度。默认使用 md；长文案可自然换行增长。"
            source={sizeCode}
          >
            <SizeExample />
          </Demo>
          <Demo
            id="fdoc-form"
            title="给小站留下一点心意"
            description="留空保存试试错误提示，再填好昵称保存。选择器、复选框和重置操作均可实际使用；演示只保存在当前页面。"
            source={formCode}
          >
            <SettingsExample />
          </Demo>
        </section>

        <section className="fdoc-api" id="fdoc-api">
          <div className="fdoc-section-title">
            <h2>API</h2>
            <span>ButtonProps</span>
          </div>
          <p>继承原生 button 属性，ref 指向原生按钮。表单提交需显式指定 type="submit"。</p>
          <div className="fdoc-table-scroll" role="region" aria-label="Button 属性表" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">属性</th>
                  <th scope="col">类型</th>
                  <th scope="col">默认值</th>
                  <th scope="col">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">variant</th>
                  <td>
                    <code>'primary' | 'secondary' | 'ghost'</code>
                  </td>
                  <td>
                    <code>'primary'</code>
                  </td>
                  <td>操作的强调程度</td>
                </tr>
                <tr>
                  <th scope="row">size</th>
                  <td>
                    <code>'sm' | 'md' | 'lg'</code>
                  </td>
                  <td>
                    <code>'md'</code>
                  </td>
                  <td>按钮的尺寸</td>
                </tr>
                <tr>
                  <th scope="row">loading</th>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>false</code>
                  </td>
                  <td>显示加载状态并禁用激活</td>
                </tr>
                <tr>
                  <th scope="row">disabled</th>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>false</code>
                  </td>
                  <td>禁用原生按钮</td>
                </tr>
                <tr>
                  <th scope="row">startIcon / endIcon</th>
                  <td>
                    <code>ReactNode</code>
                  </td>
                  <td>—</td>
                  <td>文字前后的装饰图标</td>
                </tr>
                <tr>
                  <th scope="row">type</th>
                  <td>
                    <code>'button' | 'submit' | 'reset'</code>
                  </td>
                  <td>
                    <code>'button'</code>
                  </td>
                  <td>原生按钮行为</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="fdoc-footer">
          <p>
            <Heart size={17} aria-hidden="true" />
            小小的按钮，也值得认真对待。
          </p>
          <a href="./#/components/button">
            查看完整 Button 文档 <ArrowRight size={16} aria-hidden="true" />
          </a>
        </footer>
      </article>

      <aside className="fdoc-toc" aria-label="本页目录">
        <p>这一页，一起看看</p>
        <nav>
          <a href="#fdoc-usage">什么时候使用</a>
          <a href="#fdoc-examples">代码演示</a>
          <a className="fdoc-toc-child" href="#fdoc-basic-title">
            打个招呼
          </a>
          <a className="fdoc-toc-child" href="#fdoc-sizes-title">
            三种尺寸
          </a>
          <a className="fdoc-toc-child" href="#fdoc-form-title">
            表单与恢复
          </a>
          <a href="#fdoc-api">API</a>
        </nav>
        <Motif name="flower" className="fdoc-toc-flower" />
      </aside>
    </div>
  );
}
