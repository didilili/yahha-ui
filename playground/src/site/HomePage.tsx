import { useState, type Ref } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Heart } from 'lucide-react';
import { Badge, Button, Checkbox, Link, TextField } from 'yahha-ui';
import Motif from './Motif';
import { blogHref } from './site-links';
import FriendsWelcome from '../examples/scenes/FriendsWelcome';
import peek from '../examples/scenes/artwork/friends-preview/friends-peek.svg';
import './home-page.css';

export default function HomePage({ headingRef }: { headingRef?: Ref<HTMLHeadingElement> }) {
  const [name, setName] = useState('小小的生活记录');
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
              欢迎来到，朋友们的组件小屋
            </p>
            <h1 id="home-title" className="home-title" tabIndex={-1} ref={headingRef}>
              和朋友们，
              <br />
              搭一间<span>小小的网站。</span>
            </h1>
            <p className="home-hero-description">
              给个人博客、主页和小型内容站点，
              <br className="home-desktop-break" />
              一点轻盈、温柔的交互。
            </p>
            <div className="home-hero-actions">
              <Link className="home-primary-link" href="#/components">
                逛逛组件小屋 <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="home-text-link" href="#/guides/getting-started">
                开始使用 <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                className="home-text-link"
                href={blogHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                体验小小日常 <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">（新标签页打开）</span>
              </Link>
            </div>
            <p className="home-local-note">
              React · 本地试用中 <span aria-hidden="true">／</span> v0.0.1
            </p>
          </div>
          <div className="home-hero-stage">
            <div className="home-scene-note">
              今天，也一起做点喜欢的事。
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
          往下逛逛 <ArrowDown size={15} aria-hidden="true" />
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
            <p>先试着，放进一点自己的生活</p>
            {/* The route moves focus here after section navigation without adding a tab stop. */}
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <h2 id="home-little-site" tabIndex={-1}>
              小小的组件，认真地使用。
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
            <span>朋友们的内容小站</span>
            <Badge>互动示例</Badge>
          </div>
          <div className="home-site-body">
            <article className="home-sample-article">
              <div className="home-article-label">
                <Motif name="flower" />
                <span>生活手记</span>
              </div>
              <h3>{name.trim() || '还没起名字的小站'}</h3>
              {showDate && <p className="home-date">一个适合分享的晴天</p>}
              <p>
                今天也发现了喜欢的小事。
                <br />
                把它写下来，留给以后慢慢看。
              </p>
              <Button
                variant="secondary"
                aria-pressed={saved}
                startIcon={
                  <Heart aria-hidden="true" size={16} fill={saved ? 'currentColor' : 'none'} />
                }
                onClick={() => setSaved(!saved)}
              >
                {saved ? '已经收好啦' : '收好这篇手记'}
              </Button>
              <p className="home-save-status" role="status">
                {saved ? '手记留在了这个示例的小小收藏里。' : '试试收藏，让喜欢有一点回应。'}
              </p>
            </article>
            <div className="home-site-settings">
              <p className="home-settings-title">
                <Code2 size={18} aria-hidden="true" />
                用自己的组件，搭自己的小站
              </p>
              <TextField
                label="给小站起个名字"
                value={name}
                maxLength={20}
                onChange={(event) => setName(event.target.value)}
                hint="手记标题会跟着变化。"
              />
              <Checkbox
                label="显示手记的日期说明"
                checked={showDate}
                onChange={(event) => setShowDate(event.target.checked)}
              />
              <p className="home-component-note">
                这里的 Button、TextField、Checkbox、Badge 都来自现有组件库。
              </p>
            </div>
          </div>
        </div>
        <p className="home-demo-caption">示例内容仅在当前页面内变化，刷新后恢复。</p>
      </section>

      <section className="home-next-stop" aria-labelledby="home-next-title">
        <div className="home-next-picture">
          <img src={peek} width="440" height="170" alt="" />
        </div>
        <div>
          <h2 id="home-next-title">从一个喜欢的小组件开始。</h2>
          <p>按钮、输入、选择和反馈，陪你把想法一点点搭起来。</p>
        </div>
        <Link className="home-text-link" href="#/components">
          查看示例与 API <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
