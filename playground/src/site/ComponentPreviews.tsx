import type { CSSProperties, ReactNode } from 'react';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Dialog,
  Divider,
  DropdownMenu,
  EmptyState,
  Heading,
  IconButton,
  Image,
  Link,
  Pagination,
  Popover,
  RadioGroup,
  SegmentedControl,
  Select,
  Skeleton,
  Spinner,
  Surface,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextField,
  ThemeProvider,
  Toast,
  Tooltip,
} from 'yahha-ui';
import welcomeArtwork from '../examples/scenes/artwork/friends-welcome.svg?no-inline';

const noop = () => {};
const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
};
const stack: CSSProperties = { display: 'grid', gap: 12, minWidth: 0 };

function BookmarkGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4h12v17l-6-4-6 4Z" />
    </svg>
  );
}

function InfoGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10h.01" />
    </svg>
  );
}

/** Visual samples only; the overview owns their inert and aria-hidden boundary. */
export default function ComponentPreview({ id }: { id: string }): ReactNode {
  switch (id) {
    case 'button':
      return (
        <div style={row}>
          <Button>打个招呼</Button>
          <Button variant="secondary">稍后再说</Button>
        </div>
      );
    case 'icon-button':
      return (
        <div style={row}>
          <IconButton aria-label="收藏手记">
            <BookmarkGlyph />
          </IconButton>
          <IconButton aria-label="查看阅读说明" variant="secondary">
            <InfoGlyph />
          </IconButton>
        </div>
      );
    case 'badge':
      return (
        <div style={row}>
          <Badge>日常</Badge>
          <Badge tone="accent">新手记</Badge>
          <Badge tone="success">已保存</Badge>
        </div>
      );
    case 'surface':
      return (
        <Surface>
          <div style={stack}>
            <Heading level={4}>草地上的空位</Heading>
            <Text size="sm" tone="muted">
              新朋友还没到，点心先给它留着。
            </Text>
          </div>
        </Surface>
      );
    case 'theme-provider':
      return (
        <ThemeProvider theme="pink">
          <div style={stack}>
            <Text size="sm" tone="muted">
              奶白、暖墨与轻粉。
            </Text>
            <div style={row}>
              <Button>一起搭小站</Button>
              <Badge tone="accent">默认主题</Badge>
            </div>
          </div>
        </ThemeProvider>
      );
    case 'text-field':
      return (
        <TextField
          label="手记标题"
          defaultValue="今天的散步小记"
          hint="给这一页，起个喜欢的名字。"
        />
      );
    case 'segmented-control':
      return (
        <SegmentedControl
          label="阅读范围"
          value="all"
          onValueChange={noop}
          options={[
            { value: 'all', label: '全部手记' },
            { value: 'saved', label: '我的收藏' },
          ]}
        />
      );
    case 'select':
      return (
        <Select
          label="文章分类"
          defaultValue="journal"
          options={[
            { value: 'journal', label: '生活手记' },
            { value: 'reading', label: '读书笔记' },
            { value: 'photos', label: '散步相册' },
          ]}
        />
      );
    case 'textarea':
      return <Textarea label="给朋友的话" rows={2} defaultValue="把小小的日常，慢慢写下来。" />;
    case 'checkbox':
      return (
        <div style={stack}>
          <Checkbox label="订阅小日常" checked onChange={noop} />
          <Checkbox label="也想看看读书笔记" checked={false} onChange={noop} />
        </div>
      );
    case 'radio-group':
      return (
        <RadioGroup
          label="来信频率"
          value="weekly"
          onValueChange={noop}
          options={[
            { value: 'weekly', label: '每周一封' },
            { value: 'monthly', label: '每月一封' },
          ]}
        />
      );
    case 'switch':
      return <Switch label="显示阅读日期" checked onChange={noop} />;
    case 'text':
      return (
        <div style={stack}>
          <Text>小星星问：还有我的位置吗？</Text>
          <Text size="sm" tone="muted">
            大家挪了挪，给它腾出一块草地。
          </Text>
        </div>
      );
    case 'heading':
      return (
        <div style={stack}>
          <Heading>给日常留一页</Heading>
          <Heading level={4}>今天，也有小小的发现。</Heading>
        </div>
      );
    case 'link':
      return <Link href="#/guides/getting-started">开始搭自己的小站 →</Link>;
    case 'divider':
      return (
        <div>
          <Text size="sm">这一页，先写到这里。</Text>
          <Divider decorative />
          <Text size="sm" tone="muted">
            下一次，再接着聊。
          </Text>
        </div>
      );
    case 'avatar':
      return (
        <div style={row}>
          <Avatar name="库米" />
          <Avatar name="小芽" />
          <Avatar name="小满" />
        </div>
      );
    case 'image':
      return (
        <Image
          src={welcomeArtwork}
          alt="朋友们一起搭小站的场景插画"
          width={760}
          height={530}
          aspectRatio="760 / 530"
          decoding="async"
        />
      );
    case 'skeleton':
      return (
        <div style={stack}>
          <Skeleton variant="circle" />
          <Skeleton width="86%" />
          <Skeleton width="64%" />
        </div>
      );
    case 'spinner':
      return (
        <div style={row}>
          <Spinner label="正在翻下一页" />
          <Text size="sm" tone="muted">
            正在翻下一页…
          </Text>
        </div>
      );
    case 'alert':
      return <Alert title="阅读提示">这里记着一些小小的日常。</Alert>;
    case 'tabs':
      return (
        <Tabs
          label="手记栏目"
          value="journal"
          onValueChange={noop}
          items={[
            { value: 'journal', label: '日常', content: <Text size="sm">沿着河边，慢慢走。</Text> },
            { value: 'reading', label: '读书', content: <Text size="sm">给周末留一页空白。</Text> },
          ]}
        />
      );
    case 'pagination':
      return <Pagination currentPage={2} totalPages={3} onPageChange={noop} />;
    case 'accordion':
      return (
        <Accordion
          value={['about']}
          onValueChange={noop}
          items={[
            {
              value: 'about',
              title: '这是怎样的小站？',
              content: <Text size="sm">把想记住的小事，留在这里。</Text>,
            },
            {
              value: 'start',
              title: '可以从哪里开始？',
              content: <Text size="sm">从一篇喜欢的手记开始。</Text>,
            },
          ]}
        />
      );
    case 'dropdown-menu':
      return (
        <DropdownMenu
          trigger={<Button variant="secondary">手记操作</Button>}
          items={[
            { id: 'edit', label: '编辑手记', onSelect: noop },
            { id: 'archive', label: '归档手记', onSelect: noop },
          ]}
        />
      );
    case 'popover':
      return (
        <Popover trigger={<Button variant="secondary">写作提示</Button>} title="给摘要留一点余地">
          <Text size="sm">先记下一两句，想好了再继续。</Text>
        </Popover>
      );
    case 'tooltip':
      return (
        <Tooltip
          content="收藏手记"
          trigger={
            <IconButton aria-label="收藏手记" variant="secondary">
              <BookmarkGlyph />
            </IconButton>
          }
        />
      );
    case 'dialog':
      return (
        <Dialog
          trigger={<Button>打开一封来信</Button>}
          open={false}
          onOpenChange={noop}
          title="有句话，想和你说"
        >
          <Text>今天，也辛苦啦。</Text>
        </Dialog>
      );
    case 'empty-state':
      return <EmptyState title="还没有收藏的手记" description="先收藏一篇喜欢的手记吧。" />;
    case 'toast':
      return <Toast open onClose={noop} title="手记已保存" description="草稿已经好好收起。" />;
    default:
      return null;
  }
}
