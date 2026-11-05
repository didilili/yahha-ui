import { useState } from 'react';
import { Avatar, Badge, Heading, Image, Surface, Text } from 'yahha-ui';
import { artwork } from '../assets';
import PostPreview from '../components/PostPreview';
import FriendsWelcome from '../components/FriendsWelcome';
import { categoryLabels, formatDate, posts } from '../data/posts';
import { authorBio, authorName, siteName } from '../data/site';
import { Motif } from '../Motif';
import { archiveHref, postHref } from '../router';
import { SiteLink } from '../SiteLink';
import './home.css';

interface HomePageProps {
  savedIds: ReadonlySet<string>;
  onToggleSave: (id: string, button: HTMLButtonElement) => void;
}

const categories = [
  {
    id: 'daily',
    motif: 'flower',
    description: '煮汤、烤面包、收拾桌角，记下家里发生的事。',
    note: '从厨房记到桌边',
  },
  {
    id: 'reading',
    motif: 'star',
    description: '读过的书、夹着的纸条，还有没弄明白的问题。',
    note: '翻到哪儿，记到哪儿',
  },
  {
    id: 'walk',
    motif: 'sprout',
    description: '去河边、逛早市，回来讲讲路上的新发现。',
    note: '今天换条路走',
  },
] as const;

export default function HomePage({ savedIds, onToggleSave }: HomePageProps) {
  const [sceneRunning, setSceneRunning] = useState(false);
  const latestPosts = posts.slice(0, 3);
  const newestPost = latestPosts[0];
  const readingPost = posts.find((post) => post.category === 'reading');

  return (
    <div className="blog-home">
      <section
        className="blog-home-hero"
        aria-labelledby="blog-home-heading"
        data-motion-running={sceneRunning}
      >
        <div className="blog-home-hero-cloud blog-home-hero-cloud-one" aria-hidden="true">
          <Motif name="cloud" />
        </div>
        <div className="blog-home-hero-cloud blog-home-hero-cloud-two" aria-hidden="true">
          <Motif name="cloud" />
        </div>
        <div className="blog-home-hero-inner">
          <div className="blog-home-hero-copy">
            <div className="blog-home-eyebrow">
              <span className="blog-home-eyebrow-dot" aria-hidden="true" />
              <Text size="sm">{authorName}的生活手记</Text>
            </div>
            <Heading level={1} id="blog-home-heading">
              和朋友们，
              <br />
              把今天记下来。
            </Heading>
            <Text className="blog-home-intro">
              欢迎来翻翻我们的手记。
              <br />
              这里有读到一半的书、还没出锅的汤，
              <br className="blog-home-desktop-break" />
              还有路上遇见、回来才想起记下的事。
            </Text>
            <div className="blog-home-hero-actions">
              <SiteLink
                to={newestPost ? postHref(newestPost.id, '#/') : archiveHref({})}
                className="blog-home-reading-link"
              >
                从最新一篇读起 <span aria-hidden="true">↗</span>
              </SiteLink>
              <Text size="sm" tone="muted">
                也可以按日常、读书和散步来找。
              </Text>
            </div>
          </div>
          <div className="blog-home-hero-picture">
            <div className="blog-home-hero-art">
              <FriendsWelcome
                label={`吉伊、小八和乌萨奇聚在一起，欢迎你来到${siteName}。`}
                onRunningChange={setSceneRunning}
              />
            </div>
            <div className="blog-home-hero-note">
              <Motif name="flower" />
              <span>今天的事，趁还记得先写下来。</span>
            </div>
          </div>
        </div>
        <div className="blog-home-meadow" aria-hidden="true">
          <span className="blog-home-grass blog-home-grass-one" />
          <span className="blog-home-grass blog-home-grass-two" />
          <span className="blog-home-grass blog-home-grass-three" />
        </div>
      </section>

      <div className="blog-home-content">
        <section className="blog-home-latest" aria-labelledby="blog-home-latest-heading">
          <div className="blog-home-section-heading">
            <div>
              <Text size="sm" tone="muted" className="blog-home-section-kicker">
                这几天发生的事
              </Text>
              <Heading level={2} id="blog-home-latest-heading">
                最近写下的
              </Heading>
            </div>
            <SiteLink to={archiveHref({})} className="blog-home-all-posts">
              查看全部手记 <span aria-hidden="true">→</span>
            </SiteLink>
          </div>

          <div className="blog-home-latest-grid">
            <div className="blog-home-posts">
              {latestPosts.map((post, index) => (
                <PostPreview
                  key={post.id}
                  post={post}
                  returnTo="#/"
                  saved={savedIds.has(post.id)}
                  onToggleSave={onToggleSave}
                  compact={index > 0}
                />
              ))}
            </div>

            <aside className="blog-home-sidebar" aria-label={`关于${authorName}和最近的生活`}>
              <section id="about" className="blog-home-about" aria-labelledby="about-heading">
                <div className="blog-home-about-sticker" aria-hidden="true">
                  <Motif name="flower" />
                </div>
                <Surface className="blog-home-about-paper">
                  <div className="blog-home-author-heading">
                    <Avatar name={authorName} src={artwork.author} size="lg" />
                    <div>
                      <Badge tone="accent">这间小站的主人</Badge>
                      <Heading level={3} id="about-heading" tabIndex={-1}>
                        嗨，我是{authorName}
                      </Heading>
                    </div>
                  </div>
                  <Text>{authorBio}</Text>
                  <div className="blog-home-author-signature">
                    <span aria-hidden="true">{authorName}</span>
                    <Text size="sm" tone="muted">
                      出门遇见的，回来写给你看
                    </Text>
                  </div>
                </Surface>
              </section>

              <section className="blog-home-now" aria-labelledby="blog-home-now-heading">
                <div className="blog-home-now-heading">
                  <img
                    src={artwork.teaCup}
                    alt=""
                    width={48}
                    height={48}
                    className="blog-home-tea"
                  />
                  <Heading level={3} id="blog-home-now-heading">
                    最近的我
                  </Heading>
                  <span className="blog-home-now-line" aria-hidden="true" />
                </div>
                <div className="blog-home-now-photo">
                  <Image
                    src={artwork.reading}
                    alt="小八、吉伊和乌萨奇凑在一起，读一本绿色封面的书。"
                    aspectRatio="3 / 2"
                  />
                  <Text size="sm" className="blog-home-photo-caption">
                    书还没读完，苹果倒先吃完了。
                  </Text>
                </div>
                {readingPost && (
                  <div className="blog-home-reading-note">
                    <Text size="sm" tone="muted">
                      最近一篇读书笔记 · {formatDate(readingPost.publishedAt)}
                    </Text>
                    <SiteLink to={postHref(readingPost.id, '#/')}>
                      {readingPost.title}
                      <span aria-hidden="true"> ↗</span>
                    </SiteLink>
                  </div>
                )}
              </section>
            </aside>
          </div>
        </section>

        <section className="blog-home-categories" aria-labelledby="blog-home-categories-heading">
          <div className="blog-home-category-intro">
            <div className="blog-home-category-peek" aria-hidden="true">
              <Image src={artwork.peek} alt="" className="blog-home-peek-image" />
            </div>
            <Text size="sm" tone="muted">
              按日常、读书和散步来找
            </Text>
            <Heading level={2} id="blog-home-categories-heading">
              手记分成这三类
            </Heading>
          </div>
          <div className="blog-home-category-list">
            {categories.map((category) => (
              <SiteLink
                key={category.id}
                to={archiveHref({ category: category.id })}
                className={`blog-home-category blog-home-category-${category.id}`}
              >
                <span className="blog-home-category-motif" aria-hidden="true">
                  <Motif name={category.motif} />
                </span>
                <span className="blog-home-category-copy">
                  <span className="blog-home-category-name">
                    {categoryLabels[category.id]}
                    <span className="blog-home-category-count">
                      {posts.filter((post) => post.category === category.id).length} 篇
                    </span>
                  </span>
                  <span className="blog-home-category-description">{category.description}</span>
                </span>
                <span className="blog-home-category-note">{category.note}</span>
                <span className="blog-home-category-arrow" aria-hidden="true">
                  ↗
                </span>
              </SiteLink>
            ))}
          </div>
        </section>

        <section className="blog-home-saved" aria-labelledby="blog-home-saved-heading">
          <div className="blog-home-saved-motif" aria-hidden="true">
            <Motif name="letter" />
          </div>
          <div className="blog-home-saved-copy">
            <Heading level={3} id="blog-home-saved-heading">
              想再读的，放进收藏
            </Heading>
            <Text tone="muted">点一下手记旁的「收藏」，下次在这个浏览器里就能找到。</Text>
          </div>
          <SiteLink to={archiveHref({ savedOnly: true })} className="blog-home-saved-link">
            查看收藏 · {savedIds.size} 篇 <span aria-hidden="true">→</span>
          </SiteLink>
        </section>
      </div>
    </div>
  );
}
