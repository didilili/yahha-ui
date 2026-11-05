import { useEffect, useRef, useState } from 'react';
import { Accordion, Avatar, Badge, Button, Heading, Image, Text } from 'yahha-ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { artwork } from '../assets';
import BookmarkMark from '../components/BookmarkMark';
import { categoryLabels, formatDate, posts, type Post } from '../data/posts';
import { authorName } from '../data/site';
import { postHref, postSectionHref } from '../router';
import { SiteLink } from '../SiteLink';
import './pages.css';

interface ArticlePageProps {
  post: Post;
  returnTo: string;
  savedIds: ReadonlySet<string>;
  onToggleSave: (id: string, button: HTMLButtonElement) => void;
}

const imageDescriptions = {
  reading: '小八、吉伊和乌萨奇凑在一起，读一本绿色封面的书。',
  rest: '三位朋友盖着绿色被子，安静地休息，身边放着一本笔记。',
  lounge: '三位朋友围在黄色笔记本电脑前，旁边放着绿色手记本。',
};

export default function ArticlePage({ post, returnTo, savedIds, onToggleSave }: ArticlePageProps) {
  const saved = savedIds.has(post.id);
  const nextPost = posts[(posts.findIndex((item) => item.id === post.id) + 1) % posts.length];
  const contents = useRef<HTMLElement>(null);
  const restoreContentsFocus = useRef(false);
  const [compactContents, setCompactContents] = useState(
    () => window.matchMedia('(max-width: 960px)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 960px)');
    const update = () => {
      restoreContentsFocus.current = !!contents.current?.contains(document.activeElement);
      setCompactContents(media.matches);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!restoreContentsFocus.current) return;
    restoreContentsFocus.current = false;
    contents.current
      ?.querySelector<HTMLElement>(compactContents ? 'button' : '#article-toc-heading')
      ?.focus({ preventScroll: true });
  }, [compactContents]);

  const contentsList = (
    <ol className="blog-article-toc-list">
      {post.sections.map((section) => (
        <li key={section.id}>
          <SiteLink to={postSectionHref(post.id, returnTo, section.id)}>{section.title}</SiteLink>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="blog-reading-page blog-article-page">
      <div className="blog-article-back">
        <SiteLink className="blog-reading-inline-link" to={returnTo} restoreReadingPosition>
          <ArrowLeft size={18} aria-hidden="true" />
          {returnTo === '#/' ? '返回首页' : '返回手记归档'}
        </SiteLink>
      </div>

      <article aria-labelledby="page-heading">
        <header className="blog-article-header">
          <Badge tone="accent">{categoryLabels[post.category]}</Badge>
          <Heading level={1} id="page-heading" tabIndex={-1}>
            {post.title}
          </Heading>
          <Text size="lg" tone="muted">
            {post.excerpt}
          </Text>
          <div className="blog-article-byline">
            <Avatar name={authorName} src={artwork.author} />
            <div className="blog-article-author">
              <Text size="sm">{authorName}</Text>
              <div className="blog-post-meta">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>{post.readingMinutes} 分钟阅读</span>
              </div>
            </div>
          </div>
        </header>
        <div className="blog-article-layout">
          <div className="blog-article-main">
            <figure className="blog-article-figure">
              <Image
                src={artwork[post.image]}
                alt={imageDescriptions[post.image]}
                width={1536}
                height={1024}
                aspectRatio="3 / 2"
                loading="eager"
                style={{ objectFit: 'contain' }}
              />
              <figcaption className="blog-article-caption">吉伊、小八和乌萨奇的日常。</figcaption>
            </figure>

            <div className="blog-article-prose">
              <Text>{post.intro}</Text>
              {post.sections.map((section) => (
                <section className="blog-article-section" key={section.id}>
                  <Heading level={2} id={`article-section-${section.id}`} tabIndex={-1}>
                    {section.title}
                  </Heading>
                  {section.paragraphs.map((paragraph, index) => (
                    <Text key={`${section.id}-${index}`}>{paragraph}</Text>
                  ))}
                </section>
              ))}
            </div>

            <footer className="blog-article-end">
              <ul className="blog-post-tags" aria-label="手记标签">
                {post.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
              <div className="blog-article-save-row">
                <div className="blog-article-save-copy">
                  <Heading level={2}>这篇还想再读吗？</Heading>
                  <Text tone="muted">收藏这篇手记，下次可以在当前浏览器的收藏列表里找到。</Text>
                </div>
                <Button
                  id={`save-${post.id}`}
                  variant="secondary"
                  aria-label={`收藏：${post.title}`}
                  aria-pressed={saved}
                  startIcon={<BookmarkMark />}
                  onClick={(event) => onToggleSave(post.id, event.currentTarget)}
                >
                  {saved ? '已收藏' : '收藏这篇手记'}
                </Button>
              </div>
              {nextPost && (
                <nav className="blog-article-next" aria-label="继续阅读">
                  <Text size="sm" tone="muted">
                    下一篇手记
                  </Text>
                  <Heading level={3}>
                    <SiteLink
                      className="blog-reading-inline-link"
                      to={postHref(nextPost.id, returnTo)}
                    >
                      {nextPost.title}
                      <ArrowRight size={18} aria-hidden="true" />
                    </SiteLink>
                  </Heading>
                  <Text tone="muted">{nextPost.excerpt}</Text>
                </nav>
              )}
              <Text size="sm" tone="muted">
                关于这个小站：这是使用 Yahha UI 搭建的个人博客示例，文章为示例内容。
              </Text>
            </footer>
          </div>

          <aside className="blog-article-sidebar" aria-label="这篇手记的目录">
            <nav
              ref={contents}
              className={compactContents ? undefined : 'blog-article-toc'}
              aria-label="这一页的小路标"
            >
              {compactContents ? (
                <Accordion
                  headingLevel={2}
                  items={[{ value: 'contents', title: '这一页的小路标', content: contentsList }]}
                />
              ) : (
                <>
                  <Heading level={2} id="article-toc-heading" tabIndex={-1}>
                    这一页的小路标
                  </Heading>
                  {contentsList}
                  <Text size="sm" tone="muted">
                    选择一个标题，跳到对应段落。
                  </Text>
                </>
              )}
            </nav>
          </aside>
        </div>
      </article>
    </div>
  );
}
