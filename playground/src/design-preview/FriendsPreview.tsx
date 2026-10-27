import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Code2, ExternalLink, Heart, Menu, X } from 'lucide-react';
import { Badge, Button, Checkbox, IconButton, TextField, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';
import FriendsDocs from './FriendsDocs';
import CharacterStudy from './CharacterStudy';
import Motif from './Motif';
import hero from '../examples/scenes/artwork/friends-preview/friends-hero.svg';
import peek from '../examples/scenes/artwork/friends-preview/friends-peek.svg';
import motifs from '../examples/scenes/artwork/friends-preview/motifs.svg';

type View = 'home' | 'components' | 'artwork' | 'characters' | 'compare';
const titles: Record<View, string> = {
  home: '和朋友们，搭一间小小的网站',
  components: 'Button 按钮 · 文档候选',
  artwork: '小图案与朋友们',
  characters: '人物重绘与表情校准',
  compare: '当前页面与视觉候选',
};
const views: { id: View; label: string }[] = [
  { id: 'home', label: '小站首页' },
  { id: 'components', label: '组件文档' },
  { id: 'characters', label: '人物重绘' },
  { id: 'artwork', label: 'SVG 小图案' },
  { id: 'compare', label: '前后对比' },
];

function currentView(): View {
  const key = new URLSearchParams(window.location.search).get('view');
  return views.some(({ id }) => id === key) ? (key as View) : 'home';
}

function Home() {
  const [name, setName] = useState('小小的生活记录');
  const [saved, setSaved] = useState(false);
  const [showDate, setShowDate] = useState(true);
  return (
    <>
      <section className="fp-hero" aria-labelledby="fp-home-title">
        <div className="fp-hero-inner">
          <div className="fp-hero-copy">
            <p className="fp-welcome">
              <Motif name="flower" />
              欢迎来到，朋友们的组件小屋
            </p>
            <h1 id="fp-home-title">
              和朋友们，
              <br />
              搭一间<span>小小的网站。</span>
            </h1>
            <p className="fp-hero-description">
              给个人博客、主页和小型内容站点，
              <br className="fp-desktop-break" />
              一点轻盈、温柔的交互。
            </p>
            <div className="fp-hero-actions">
              <Button
                size="lg"
                endIcon={<ArrowRight size={18} />}
                onClick={() => {
                  window.location.assign('./friends.html?view=components');
                }}
              >
                逛逛组件小屋
              </Button>
              <a className="fp-text-link" href="./#/guides/getting-started">
                开始使用 <ArrowRight size={16} />
              </a>
            </div>
            <p className="fp-local-note">
              React · 本地试用中 <span aria-hidden="true">／</span> v0.0.1
            </p>
          </div>
          <div className="fp-hero-stage">
            <div className="fp-scene-note">
              今天，也一起做点喜欢的事。
              <Motif name="star" />
            </div>
            <img
              src={hero}
              width="760"
              height="530"
              alt="吉伊扶着小站卡片，小八笑着招手，乌萨奇在旁惊喜地看着。"
              fetchPriority="high"
            />
          </div>
        </div>
        <a
          className="fp-explore"
          href="#little-site"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById('little-site')?.scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            });
          }}
        >
          往下逛逛 <ArrowDown size={15} />
        </a>
        <svg
          className="fp-grass-edge"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 35Q170 0 360 25T720 24T1080 27T1440 15V60H0Z" />
        </svg>
      </section>

      <section className="fp-garden" id="little-site" aria-labelledby="fp-site-title">
        <div className="fp-section-heading">
          <Motif name="sprout" />
          <div>
            <p>先试着，放进一点自己的生活</p>
            <h2 id="fp-site-title">小小的组件，认真地使用。</h2>
          </div>
        </div>
        <div className="fp-site-window">
          <div className="fp-window-bar">
            <div aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span>朋友们的内容小站</span>
            <Badge>互动示例</Badge>
          </div>
          <div className="fp-site-body">
            <article className="fp-sample-article">
              <div className="fp-article-label">
                <Motif name="flower" />
                <span>生活手记</span>
              </div>
              <h3>{name.trim() || '还没起名字的小站'}</h3>
              {showDate && <p className="fp-date">一个适合分享的晴天</p>}
              <p>
                今天也发现了喜欢的小事。
                <br />
                把它写下来，留给以后慢慢看。
              </p>
              <Button
                variant="secondary"
                aria-pressed={saved}
                startIcon={<Heart size={16} fill={saved ? 'currentColor' : 'none'} />}
                onClick={() => setSaved(!saved)}
              >
                {saved ? '已经收好啦' : '收好这篇手记'}
              </Button>
              <p className="fp-save-status" role="status">
                {saved ? '手记留在了这个示例的小小收藏里。' : '试试收藏，让喜欢有一点回应。'}
              </p>
            </article>
            <div className="fp-site-settings">
              <p className="fp-settings-title">
                <Code2 size={18} />
                用自己的组件，搭自己的小站
              </p>
              <TextField
                label="给小站起个名字"
                value={name}
                maxLength={20}
                onChange={(event) => setName(event.target.value)}
                hint="左边的标题会跟着变化。"
              />
              <Checkbox
                label="显示手记的日期说明"
                checked={showDate}
                onChange={(event) => setShowDate(event.target.checked)}
              />
              <p className="fp-component-note">
                这里的 Button、TextField、Checkbox、Badge 都来自现有组件库。
              </p>
            </div>
          </div>
        </div>
        <p className="fp-demo-caption">示例内容仅在当前页面内变化，刷新后恢复。</p>
      </section>

      <section className="fp-next-stop" aria-labelledby="fp-next-title">
        <div className="fp-next-picture">
          <img src={peek} width="440" height="160" alt="" />
        </div>
        <div>
          <h2 id="fp-next-title">从一个喜欢的小组件开始。</h2>
          <p>按钮、输入、选择和反馈，陪你把想法一点点搭起来。</p>
        </div>
        <a className="fp-text-link" href="?view=components">
          查看示例与 API <ArrowRight size={18} />
        </a>
      </section>
    </>
  );
}

function Artwork() {
  const [background, setBackground] = useState<'sky' | 'cream'>('sky');
  return (
    <section className="fp-artwork" aria-labelledby="fp-art-title">
      <div className="fp-art-title">
        <Motif name="flower" />
        <h1 id="fp-art-title">小图案，也要像一家人。</h1>
        <p>本轮手工绘制的 SVG 候选：角色、场景、道具，共用一套暖墨轮廓。</p>
      </div>
      <div className="fp-art-board" data-background={background}>
        <div className="fp-art-board-head">
          <span>三人一起搭建小站 · 主场景</span>
          <div>
            <Button
              size="sm"
              variant={background === 'sky' ? 'primary' : 'secondary'}
              aria-pressed={background === 'sky'}
              onClick={() => setBackground('sky')}
            >
              天空底
            </Button>
            <Button
              size="sm"
              variant={background === 'cream' ? 'primary' : 'secondary'}
              aria-pressed={background === 'cream'}
              onClick={() => setBackground('cream')}
            >
              奶白底
            </Button>
          </div>
        </div>
        <img
          className="fp-art-hero"
          src={hero}
          width="760"
          height="530"
          alt="三人一起搭建小站的透明底 SVG 场景。"
        />
        <a href={hero} download="friends-hero.svg" className="fp-text-link">
          下载主场景 SVG <ArrowDown size={16} />
        </a>
      </div>
      <div className="fp-art-pair">
        <div>
          <h2>页头与卡片边缘的陪伴</h2>
          <img src={peek} width="440" height="160" alt="三位朋友从下方探头的 SVG 图案。" />
          <a href={peek} download="friends-peek.svg" className="fp-text-link">
            下载探头图案 <ArrowDown size={16} />
          </a>
        </div>
        <div>
          <h2>花草、信封与生活小物</h2>
          <img
            src={motifs}
            width="800"
            height="240"
            alt="统一画风的小花、草芽、云、星光、信封、小旗、脚印和小食图案。"
          />
          <a href={motifs} download="motifs.svg" className="fp-text-link">
            下载图案样张 <ArrowDown size={16} />
          </a>
        </div>
      </div>
      <p className="fp-art-disclosure">
        以上为本库视觉探索绘制的候选素材，非官方素材。尚未设为组件默认外观，也未加入组件库分发产物。
      </p>
    </section>
  );
}

function ComparisonFrame({
  title,
  src,
  viewport,
}: {
  title: string;
  src: string;
  viewport: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  useEffect(() => {
    const target = container.current;
    if (!target) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  const scale = Math.min(1, width / viewport);
  return (
    <section className="fp-comparison-side">
      <div className="fp-comparison-title">
        <h2>{title}</h2>
        <a href={src} target="_blank" rel="noreferrer">
          独立打开 <ExternalLink size={14} />
        </a>
      </div>
      <div
        ref={container}
        className="fp-frame-viewport"
        style={{ height: Math.round(1140 * scale) }}
      >
        <iframe
          title={title}
          src={src}
          style={{
            width: viewport,
            height: 1140,
            transform: `scale(${scale})`,
            left: Math.max(0, (width - viewport * scale) / 2),
          }}
        />
      </div>
    </section>
  );
}

function Compare() {
  const [scope, setScope] = useState<'home' | 'components'>('home');
  const [viewport, setViewport] = useState(1440);
  return (
    <section className="fp-comparison" aria-labelledby="fp-compare-title">
      <p className="fp-review-label">
        <Check size={15} />
        同样的视口，直接看差别
      </p>
      <h1 id="fp-compare-title">当前页面与本轮视觉候选</h1>
      <p>
        左侧是现在的正式文档，右侧是本轮独立候选。两侧按相同宽度渲染后缩放展示，可以分别滚动与操作。
      </p>
      <div className="fp-compare-controls">
        <div>
          <Button
            size="sm"
            aria-pressed={scope === 'home'}
            variant={scope === 'home' ? 'primary' : 'secondary'}
            onClick={() => setScope('home')}
          >
            介绍与首页
          </Button>
          <Button
            size="sm"
            aria-pressed={scope === 'components'}
            variant={scope === 'components' ? 'primary' : 'secondary'}
            onClick={() => setScope('components')}
          >
            Button 文档
          </Button>
        </div>
        <div>
          <Button
            size="sm"
            aria-pressed={viewport === 1440}
            variant={viewport === 1440 ? 'primary' : 'secondary'}
            onClick={() => setViewport(1440)}
          >
            桌面 1440px
          </Button>
          <Button
            size="sm"
            aria-pressed={viewport === 390}
            variant={viewport === 390 ? 'primary' : 'secondary'}
            onClick={() => setViewport(390)}
          >
            手机 390px
          </Button>
        </div>
      </div>
      <div className="fp-comparison-grid">
        <ComparisonFrame
          title="修改前 · 当前正式页面"
          src={`./#/${scope === 'home' ? 'guides/introduction' : 'components/button'}`}
          viewport={viewport}
        />
        <ComparisonFrame
          title="本轮候选 · 朋友们的小站"
          src={`./friends.html?embedded=1&view=${scope}`}
          viewport={viewport}
        />
      </div>
      <p className="fp-comparison-note">
        本轮比较的是首页构图、文档外壳和 SVG 场景。现有公共组件保持原样，未宣称完成全组件视觉改版。
      </p>
    </section>
  );
}

export default function FriendsPreview() {
  const [view] = useState<View>(currentView);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const isEmbedded = new URLSearchParams(window.location.search).has('embedded');
  useEffect(() => {
    document.title = `${titles[view]} · Yahha UI 视觉候选`;
  }, [view]);
  return (
    <ThemeProvider theme="chiikawa">
      <div className="fp-shell" data-view={view}>
        <a
          className="fp-skip"
          href="#fp-main"
          onClick={(event) => {
            event.preventDefault();
            mainRef.current?.focus();
          }}
        >
          跳到正文
        </a>
        {!isEmbedded && (
          <div className="fp-review-bar">
            <span>本轮视觉候选 · 独立预览</span>
            <a href="?view=compare">
              与当前页面对比 <ArrowRight size={13} />
            </a>
          </div>
        )}
        <header className="fp-header">
          <a className="fp-logo" href="?view=home" aria-label="Yahha UI 视觉候选首页">
            <img src={peek} width="440" height="170" alt="" />
            <span>
              Yahha <b>UI</b>
              <small>朋友们的组件小屋</small>
            </span>
          </a>
          <IconButton
            className="fp-mobile-menu"
            aria-label={menuOpen ? '关闭导航' : '打开导航'}
            aria-expanded={menuOpen}
            aria-controls="fp-nav"
            variant="secondary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </IconButton>
          <nav id="fp-nav" className="fp-nav" data-open={menuOpen} aria-label="视觉候选导航">
            {views.map(({ id, label }) => (
              <a
                key={id}
                href={`?${isEmbedded ? 'embedded=1&' : ''}view=${id}`}
                aria-current={view === id ? 'page' : undefined}
              >
                {label}
                {view === id && <Motif name="flower" />}
              </a>
            ))}
          </nav>
        </header>
        <main id="fp-main" ref={mainRef} tabIndex={-1}>
          {view === 'home' ? (
            <Home />
          ) : view === 'components' ? (
            <FriendsDocs />
          ) : view === 'artwork' ? (
            <Artwork />
          ) : view === 'characters' ? (
            <CharacterStudy />
          ) : (
            <Compare />
          )}
        </main>
        <footer className="fp-footer">
          <Motif name="sprout" />
          <p>小小的网站，也可以住着喜欢的朋友。</p>
          <a href="./#/guides/introduction">
            返回当前正式文档 <ArrowRight size={15} />
          </a>
          <span>Yahha UI · 视觉探索，尚未替换默认站点</span>
        </footer>
      </div>
    </ThemeProvider>
  );
}
