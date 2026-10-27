import { Badge, Button, Heading, Image, Text } from 'yahha-ui';
import { artwork } from '../assets';
import { categoryLabels, formatDate, type Post } from '../data/posts';
import { postHref } from '../router';
import { SiteLink } from '../SiteLink';
import '../pages/pages.css';
import BookmarkMark from './BookmarkMark';

interface PostPreviewProps {
  post: Post;
  returnTo?: string;
  saved: boolean;
  onToggleSave: (id: string, button: HTMLButtonElement) => void;
  compact?: boolean;
}

export default function PostPreview({
  post,
  returnTo,
  saved,
  onToggleSave,
  compact = false,
}: PostPreviewProps) {
  return (
    <article className={`blog-post-preview${compact ? ' blog-post-preview--compact' : ''}`}>
      <div className="blog-post-preview-copy">
        <div className="blog-post-meta">
          <Badge>{categoryLabels[post.category]}</Badge>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>{post.readingMinutes} 分钟阅读</span>
        </div>
        <Heading level={3}>
          <SiteLink id={`post-link-${post.id}`} to={postHref(post.id, returnTo)}>
            {post.title}
          </SiteLink>
        </Heading>
        <Text tone="muted">{post.excerpt}</Text>
        <div className="blog-post-preview-bottom">
          <ul className="blog-post-tags" aria-label="手记标签">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
          <Button
            id={`save-${post.id}`}
            variant="ghost"
            aria-label={`收藏：${post.title}`}
            aria-pressed={saved}
            startIcon={<BookmarkMark />}
            onClick={(event) => onToggleSave(post.id, event.currentTarget)}
          >
            {saved ? '已收藏' : '收藏'}
          </Button>
        </div>
      </div>
      <div className="blog-post-preview-art" aria-hidden="true">
        <Image
          src={artwork[post.image]}
          alt=""
          width={1536}
          height={1024}
          aspectRatio="3 / 2"
          style={{ objectFit: 'contain' }}
        />
      </div>
    </article>
  );
}
