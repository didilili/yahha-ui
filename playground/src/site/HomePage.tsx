import { useState, type Ref } from 'react';
import { version as packageVersion } from '../../../package.json';
import { ArrowDown, ArrowRight, Code2 } from 'lucide-react';
import { Badge, Button, Checkbox, Link, Popover, Surface, Tabs, Text, Input } from 'yahha-ui';
import Motif from './Motif';
import BookmarkMark from './BookmarkMark';
import HomeScenes from './HomeScenes';
import HomeTheme from './HomeTheme';
import { DecorativeRule, DecorativeTitle } from './DecorativeElements';
import FriendsWelcome from '../examples/scenes/FriendsWelcome';
import peek from '../examples/scenes/artwork/friends-preview/friends-peek.svg';
import chiikawaSticker from '../examples/scenes/artwork/decorative-elements/friends/chiikawa-sticker.svg?url';
import hachiwareSticker from '../examples/scenes/artwork/decorative-elements/friends/hachiware-sticker.svg?url';
import usagiSticker from '../examples/scenes/artwork/decorative-elements/friends/usagi-sticker.svg?url';
import './home-page.css';

export default function HomePage({ headingRef }: { headingRef?: Ref<HTMLHeadingElement> }) {
  const [name, setName] = useState('饼干保管员');
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
              来搭你的小站吧。
            </p>
            <h1 id="home-title" className="home-title" tabIndex={-1} ref={headingRef}>
              把可爱，
              <br />
              <span>搭进你的世界。</span>
            </h1>
            <p className="home-hero-description">
              一套漫画手账风的 React 组件库。
              <br className="home-desktop-break" />
              从一个按钮开始，
            </p>
            <p className="home-hero-detail">搭起自己的博客、主页或内容小站。</p>
            <div className="home-hero-actions">
              <Link className="home-primary-link" href="#/guides/getting-started">
                开始使用 <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="home-text-link" href="#/components">
                浏览组件 <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="home-local-note">
              v{packageVersion} <span aria-hidden="true">·</span> npm 安装 / 本地构建
            </p>
            <Link className="home-introduction-link" href="#/guides/introduction">
              了解项目与当前范围 <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-hero-stage">
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
          <div>
            <p>组件交互示例</p>
            {/* The route moves focus here after section navigation without adding a tab stop. */}
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <DecorativeTitle
              as="h2"
              id="home-little-site"
              className="home-garden-title"
              variant="cloud"
              tabIndex={-1}
            >
              标题编辑与收藏
            </DecorativeTitle>
          </div>
        </div>
        <p className="home-section-intro">修改手记标题、切换正文与后记，并切换收藏状态。</p>
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
                <img
                  className="home-friend-sticker home-friend-sticker--chiikawa"
                  src={chiikawaSticker}
                  width="48"
                  height="48"
                  alt=""
                  loading="lazy"
                />
                <span>生活手记</span>
              </div>
              <h3>{name.trim() || '未命名手记'}</h3>
              {showDate && <p className="home-date">生活记录 · 示例文章</p>}
              <Tabs
                appearance="ink"
                label="手记内容"
                items={[
                  {
                    value: 'body',
                    label: '正文',
                    content: (
                      <div className="home-story-note">
                        <Text>
                          最后一块饼干，要留给还没到的朋友。
                          <br />
                          乌萨奇把盘子推远了一点，又把椅子往前挪了一点。
                        </Text>
                        <img
                          className="home-friend-sticker home-friend-sticker--usagi"
                          src={usagiSticker}
                          width="48"
                          height="60"
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    ),
                  },
                  {
                    value: 'afterword',
                    label: '后记',
                    content: (
                      <Surface>
                        <Text>你带来了一袋新的。它先接过饼干，才想起来给你让座。</Text>
                      </Surface>
                    ),
                  },
                ]}
              />
              <div className="home-article-actions">
                <Button
                  variant="secondary"
                  aria-pressed={saved}
                  startIcon={<BookmarkMark size={16} filled={saved} />}
                  onClick={() => setSaved(!saved)}
                >
                  收藏手记
                </Button>
                <Popover title="示例说明" trigger={<Button variant="ghost">阅读说明</Button>}>
                  <Text>这是一篇示例手记。标题、收藏和副标题只在当前页面生效，刷新后恢复。</Text>
                </Popover>
              </div>
              <p className="home-save-status" role="status">
                {saved ? '已在当前示例中收藏。' : '点击按钮，切换收藏状态。'}
              </p>
            </article>
            <div className="home-site-settings">
              <p className="home-settings-title">
                <Code2 size={18} aria-hidden="true" />
                标题与显示设置
                <img
                  className="home-friend-sticker home-friend-sticker--hachiware"
                  src={hachiwareSticker}
                  width="48"
                  height="48"
                  alt=""
                  loading="lazy"
                />
              </p>
              <Input
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
                这个示例使用了 <Link href="#/components/button">Button</Link>、
                <Link href="#/components/input">Input</Link>、
                <Link href="#/components/checkbox">Checkbox</Link>、
                <Link href="#/components/badge">Badge</Link>、
                <Link href="#/components/tabs">Tabs</Link> 和{' '}
                <Link href="#/components/popover">Popover</Link>。
              </p>
              <Link href="#/guides/reading?section=reading-example">
                查看阅读与收藏示例 <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <p className="home-demo-caption">修改与收藏仅在当前页面生效，刷新后恢复。</p>
        <p className="home-demo-caption">
          <Link href="#/guides/recipes">
            查看组合示例：阅读、归档、编辑与状态反馈 <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
        <DecorativeRule variant="flower" className="home-garden-rule" />
      </section>

      <HomeScenes />
      <HomeTheme />

      <section className="home-next-stop" aria-labelledby="home-next-title">
        <div className="home-next-picture">
          <img src={peek} width="440" height="170" alt="" />
        </div>
        <div>
          <h2 id="home-next-title">安装与接入</h2>
          <p>在已有 React 项目中安装组件，或运行最小项目。组合示例提供可复制的接入代码。</p>
          <nav className="home-next-links" aria-label="开始搭建">
            <Link href="#/guides/getting-started">
              安装与接入 <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="#/guides/getting-started?section=starter-project">
              运行最小项目 <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="#/guides/recipes">
              查看组合代码 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
