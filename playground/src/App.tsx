import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Heart, Leaf, Sparkles, Sun } from 'lucide-react';
import { SegmentedControl, ThemeProvider, Toast, type ThemeName } from '../../src/index';
import lounge from './assets/lounge.png';
import { navigation, themeNames, themes, type Notice } from './data';
import { Art } from './shared';
import { ButtonsDemo } from './demos/ButtonsDemo';
import { FieldsDemo } from './demos/FieldsDemo';
import { ChoicesDemo } from './demos/ChoicesDemo';
import { DialogDemo } from './demos/DialogDemo';
import { EmptyDemo } from './demos/EmptyDemo';
import { FeedbackDemo } from './demos/FeedbackDemo';

export default function App() {
  const [theme, setTheme] = useState<ThemeName>('hachiware');
  const [active, setActive] = useState('buttons');
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-100px 0px -40% 0px', threshold: [0, 0.25, 0.5] },
    );
    document.querySelectorAll('.demo-section').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function notify(next: Notice) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice(next);
    noticeTimer.current = setTimeout(() => setNotice(null), 7000);
  }

  return (
    <ThemeProvider theme={theme} className="playground">
      <a className="skip-link" href="#components">
        跳到组件展示
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Chiikawa UI 首页">
            <span className="brand-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Chiikawa <span>UI</span>
          </a>
          <nav aria-label="页面导航">
            <a href="#components">组件一览</a>
            <a href="#choices">场景试用</a>
            <a href="#references">
              设计参考
              <ArrowUpRight size={13} />
            </a>
          </nav>
          <span className="preview-label">
            <span />
            本地样张
          </span>
        </div>
      </header>

      <section className="welcome" id="top">
        <div className="welcome-inner">
          <div className="welcome-copy">
            <p className="welcome-note">
              <span />
              ちいかわ · React 组件样张
            </p>
            <h1>
              Chiikawa <span>UI</span>
            </h1>
            <p className="welcome-description">
              按钮、输入框、弹窗，
              <br />
              还有一点小小的陪伴。
            </p>
            <div className="welcome-actions">
              <a className="browse-link" href="#components">
                开始逛逛
                <ArrowDown size={16} />
              </a>
              <span>每个组件，都可以试一试。</span>
            </div>
          </div>
          <div className="welcome-art">
            <span className="speech-bubble">
              一起试试看？
              <Heart size={13} />
            </span>
            <Art src={lounge} />
            <span className="art-caption">吉伊 · 小八 · 乌萨奇</span>
          </div>
        </div>
        <svg
          className="welcome-wave"
          viewBox="0 0 1440 34"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 11C180 43 300-9 480 11s300 20 480 0 300 20 480 0v23H0Z" fill="currentColor" />
        </svg>
      </section>

      <div className="theme-strip">
        <div>
          <span className="theme-label">
            <Sun size={16} />
            今天和谁一起？
          </span>
          <SegmentedControl<ThemeName>
            className="theme-picker"
            classNames={{ options: 'theme-picker-options', option: 'theme-picker-option' }}
            label="选择角色主题"
            value={theme}
            onValueChange={setTheme}
            options={themes.map((item) => ({
              ...item,
              label: (
                <>
                  <i className={`theme-dot ${item.value}`} />
                  {item.label}
                </>
              ),
            }))}
          />
          <span className="theme-current">
            现在是 <strong>{themeNames[theme]}</strong>
          </span>
        </div>
      </div>

      <main id="components" className="workspace">
        <aside className="component-directory">
          <p>组件小屋</p>
          <nav aria-label="组件目录">
            {navigation.map(({ id, label, Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? 'active' : ''}
                aria-current={active === id ? 'location' : undefined}
                onClick={() => setActive(id)}
              >
                <Icon size={17} />
                <span>{label}</span>
                {active === id && <span className="nav-dot" />}
              </a>
            ))}
          </nav>
          <div className="directory-note">
            <Leaf size={18} />
            <p>
              慢慢逛，
              <br />
              喜欢的带回去。
            </p>
          </div>
        </aside>

        <div className="component-content">
          <div className="content-intro">
            <div>
              <h2>从一次点击开始。</h2>
              <p>六种常用组件，放在同一个小世界里。</p>
            </div>
            <span className="content-flower" aria-hidden="true">
              <Sparkles size={23} />
            </span>
          </div>

          <ButtonsDemo notify={notify} />

          <FieldsDemo notify={notify} />

          <ChoicesDemo />

          <DialogDemo notify={notify} />

          <EmptyDemo />

          <FeedbackDemo notify={notify} />

          <section id="references" className="references">
            <div>
              <Leaf size={19} />
              <h2>这个小世界，从哪里来？</h2>
            </div>
            <p>参考官方站点里的配色、留白和角色场景，也参考同人作品里有回应的小动作。</p>
            <div className="reference-links">
              <a href="https://chiikawabakery.jp/" target="_blank" rel="noreferrer">
                Bakery <ArrowUpRight size={13} />
              </a>
              <a href="https://jp.chiikawa-pocket.com/ja/" target="_blank" rel="noreferrer">
                Pocket <ArrowUpRight size={13} />
              </a>
              <a href="https://chiikawapark-tokyo.jp/" target="_blank" rel="noreferrer">
                Park <ArrowUpRight size={13} />
              </a>
              <a href="https://chiikawamarket.jp/" target="_blank" rel="noreferrer">
                Market <ArrowUpRight size={13} />
              </a>
              <a href="https://www.anime-chiikawa.jp/" target="_blank" rel="noreferrer">
                动画官网 <ArrowUpRight size={13} />
              </a>
              <a href="https://chiikawa-flex.vercel.app/" target="_blank" rel="noreferrer">
                Chiikawa-Flex <ArrowUpRight size={13} />
              </a>
              <a
                href="https://phuahjinwei.github.io/Chiikawa-Hidamari/"
                target="_blank"
                rel="noreferrer"
              >
                Hidamari <ArrowUpRight size={13} />
              </a>
            </div>
            <small>独立同人组件样张 · 非官方项目</small>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <a href="#top" className="brand">
          Chiikawa <span>UI</span>
        </a>
        <p>让每一次小小的操作，多一点陪伴。</p>
        <span>React 组件样张 · 本地预览</span>
      </footer>
      {notice && (
        <div className="toast-viewport">
          <Toast
            open
            onClose={() => {
              if (noticeTimer.current) clearTimeout(noticeTimer.current);
              setNotice(null);
            }}
            {...notice}
          />
        </div>
      )}
    </ThemeProvider>
  );
}
