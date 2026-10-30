import { useState, type Ref } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Heart } from 'lucide-react';
import { Badge, Button, Checkbox, Link, TextField } from 'yahha-ui';
import Motif from './Motif';
import { blogHref } from './site-links';
import FriendsWelcome from '../examples/scenes/FriendsWelcome';
import peek from '../examples/scenes/artwork/friends-preview/friends-peek.svg';
import './home-page.css';

export default function HomePage({ headingRef }: { headingRef?: Ref<HTMLHeadingElement> }) {
  const [name, setName] = useState('给晚到的朋友留块饼干');
  const [saved, setSaved] = useState(false);
  const [showDate, setShowDate] = useState(true);
  const [sceneRunning, setSceneRunning] = useState(false);
  return (
    <div className="site-home">
      <section
        className="home-hero"
        aria-labelledby="home-title"
        data-motion-running={sceneRunning}
      >
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-welcome">
              <Motif name="flower" />
              欢迎来到 Yahha 星球。
            </p>
            <h1 id="home-title" className="home-title" tabIndex={-1} ref={headingRef}>
              一起做，
              <br />
              全宇宙最可爱的
              <br />
              <span>UI 组件库。</span>
            </h1>
            <p className="home-hero-description">
              一套漫画手账风的 React 组件库。
              <br className="home-desktop-break" />
              带上你的奇思妙想，和朋友们一起搭出喜欢的界面。
            </p>
            <div className="home-hero-actions">
              <Link className="home-primary-link" href="#/guides/getting-started">
                开始使用 <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="home-text-link" href="#/components">
                浏览组件 <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                className="home-text-link"
                href={blogHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                体验示例网站 <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">（新标签页打开）</span>
              </Link>
            </div>
            <p className="home-local-note">
              v0.0.1 <span aria-hidden="true">·</span> 早期预览
            </p>
          </div>
          <div className="home-hero-stage">
            <div className="home-scene-note">
              给你留了个位置，一起来搭吧。
              <Motif name="star" />
            </div>
            <FriendsWelcome
              label="吉伊扶着小站卡片，小八笑着招手，乌萨奇在旁惊喜地看着。"
              onRunningChange={setSceneRunning}
            />
          </div>
        </div>
        <a
          className="home-explore"
          href="#/?section=home-little-site"
          onClick={(event) => {
            if (window.location.hash === event.currentTarget.getAttribute('href')) {
              const heading = document.getElementById('home-little-site');
              heading?.focus({ preventScroll: true });
              heading?.scrollIntoView();
            }
          }}
        >
          查看交互示例 <ArrowDown size={15} aria-hidden="true" />
        </a>
        <svg
          className="home-grass-edge"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 35Q170 0 360 25T720 24T1080 27T1440 15V60H0Z" />
        </svg>
      </section>

      <section className="home-garden" aria-labelledby="home-little-site">
        <div className="home-section-heading">
          <Motif name="sprout" />
          <div>
            <p>朋友们先搭了一页手记</p>
            {/* The route moves focus here after section navigation without adding a tab stop. */}
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <h2 id="home-little-site" tabIndex={-1}>
              这次，轮到你来起名字。
            </h2>
          </div>
        </div>
        <div className="home-site-window">
          <div className="home-window-bar">
            <div aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span>Yahha 星球 · 草地手记</span>
            <Badge>交互示例</Badge>
          </div>
          <div className="home-site-body">
            <article className="home-sample-article">
              <div className="home-article-label">
                <Motif name="flower" />
                <span>生活手记</span>
              </div>
              <h3>{name.trim() || '未命名手记'}</h3>
              {showDate && <p className="home-date">草地上，还空着一个位置</p>}
              <p>
                大家数了数，还差一位朋友。
                <br />
                最后一块饼干，先替你留在盘子里。
              </p>
              <Button
                variant="secondary"
                aria-pressed={saved}
                startIcon={
                  <Heart aria-hidden="true" size={16} fill={saved ? 'currentColor' : 'none'} />
                }
                onClick={() => setSaved(!saved)}
              >
                收藏手记
              </Button>
              <p className="home-save-status" role="status">
                {saved ? '已在当前示例中收藏。' : '点击按钮，切换收藏状态。'}
              </p>
            </article>
            <div className="home-site-settings">
              <p className="home-settings-title">
                <Code2 size={18} aria-hidden="true" />
                修改内容，看看组件如何响应
              </p>
              <TextField
                label="手记标题"
                value={name}
                maxLength={20}
                onChange={(event) => setName(event.target.value)}
                hint="预览标题会实时更新"
              />
              <Checkbox
                label="显示副标题"
                checked={showDate}
                onChange={(event) => setShowDate(event.target.checked)}
              />
              <p className="home-component-note">
                这个示例使用了 Button、TextField、Checkbox 和 Badge。
              </p>
            </div>
          </div>
        </div>
        <p className="home-demo-caption">修改与收藏仅在当前页面生效，刷新后恢复。</p>
      </section>

      <section className="home-next-stop" aria-labelledby="home-next-title">
        <div className="home-next-picture">
          <img src={peek} width="440" height="170" alt="" />
        </div>
        <div>
          <h2 id="home-next-title">下一页，留给你的故事。</h2>
          <p>按钮、纸签和便笺都在这里。挑几样，搭出你的下一页。</p>
        </div>
        <Link className="home-text-link" href="#/components">
          浏览组件 <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
