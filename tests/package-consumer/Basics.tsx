import { useRef, useState } from 'react';
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
  Heading,
  Image,
  IconButton,
  Link,
  Pagination,
  Popover,
  RadioGroup,
  Select,
  SegmentedControl,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  Text,
  TextField,
  Textarea,
  ThemeProvider,
  Tooltip,
  type ThemeName,
} from 'yahha-ui';
import './basics.css';

const options = [
  { value: 'life', label: 'Life notes' },
  { value: 'locked', label: 'Locked option', disabled: true },
  { value: 'reading', label: 'Reading notes' },
  { value: 'long', label: 'W'.repeat(100) },
];
const picture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180"><rect width="300" height="180" fill="#d7eaf5"/></svg>',
  );

export function Basics() {
  const [theme, setTheme] = useState<ThemeName>('chiikawa');
  const [radio, setRadio] = useState('first');
  const [submitted, setSubmitted] = useState('');
  const [page, setPage] = useState(1);
  const [numericPage, setNumericPage] = useState(108);
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState('data:text/plain,unavailable');
  const [authorSource, setAuthorSource] = useState('data:text/plain,unavailable');
  const popoverInput = useRef<HTMLInputElement>(null);
  return (
    <ThemeProvider theme={theme}>
      <main className="basics">
        <Heading level={1}>Basic component consumer</Heading>
        <label>
          Preview theme{' '}
          <select
            aria-label="Basic preview theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemeName)}
          >
            {(['chiikawa', 'hachiware', 'usagi'] as const).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <form
          id="basics-form"
          className="basics-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
          }}
          onReset={() => setRadio('first')}
        >
          <Select
            label="Basic category"
            name="category"
            defaultValue="life"
            required
            options={options}
            classNames={{ popup: 'basic-select-popup' }}
          />
          <Textarea
            label="Basic comment"
            name="comment"
            defaultValue="Initial draft"
            hint="A public message"
            error={undefined}
            required
          />
          <Checkbox label="Basic agreement" name="agree" value="yes" defaultChecked />
          <Switch label="Basic subscription" name="subscribe" value="yes" defaultChecked />
          <RadioGroup
            label="Basic reading mode"
            name="mode"
            value={radio}
            onValueChange={setRadio}
            options={[
              { value: 'first', label: 'First mode' },
              { value: 'locked', label: 'Locked mode', disabled: true },
              { value: 'last', label: 'Last mode' },
            ]}
          />
          <div className="basics-actions">
            <Button type="submit">Submit basics</Button>
            <Button type="reset" variant="secondary">
              Reset basics
            </Button>
          </div>
        </form>
        <output aria-label="Basic submitted data">{submitted}</output>
        <fieldset disabled>
          <legend>Disabled controls</legend>
          <Select label="Disabled basic select" options={options} />
          <Checkbox label="Disabled basic checkbox" defaultChecked />
          <Switch label="Disabled basic switch" defaultChecked />
          <Textarea label="Disabled basic textarea" />
        </fieldset>
        <Select label="Readonly basic select" defaultValue="life" readOnly options={options} />
        <Select
          label="Required basic select"
          name="externalCategory"
          form="basics-form"
          options={options}
        />
        <Tabs
          data-testid="navigation-tabs"
          label="Basic tabs"
          keepMounted
          items={[
            {
              value: 'notes',
              label: 'Notes tab',
              content: <input aria-label="Kept tab draft" defaultValue="Draft stays" />,
            },
            {
              value: 'disabled',
              label: 'Disabled tab',
              disabled: true,
              content: 'Hidden disabled content',
            },
            { value: 'archive', label: 'Archive tab', content: <Text>Archive panel</Text> },
            {
              value: 'long',
              label: '和朋友们一起收集生活里值得慢慢阅读的小小故事与周末手记',
              content: <Text>Long Chinese tab panel</Text>,
            },
          ]}
        />
        <Tabs
          data-testid="navigation-disabled-selected-tabs"
          label="Controlled disabled tabs"
          value="locked"
          items={[
            {
              value: 'locked',
              label: 'Disabled selected tab',
              content: 'Disabled selected tab content',
              disabled: true,
            },
          ]}
        />
        <Accordion
          data-testid="navigation-accordion"
          multiple
          defaultValue={['long', 'locked-open']}
          items={[
            { value: 'one', title: 'First question', content: <Text>First answer</Text> },
            { value: 'two', title: 'Second question', content: <Text>Second answer</Text> },
            {
              value: 'disabled',
              title: 'Disabled question',
              content: 'Hidden answer',
              disabled: true,
            },
            {
              value: 'long',
              title:
                '如果文章的标题和问题都很长，朋友们还能在小屏幕上完整阅读每一行内容，并且清楚地找到展开与收起的入口吗？让我们一起检查多行标题的排版。',
              content: (
                <Text data-testid="navigation-long-answer">
                  可以，展开后的回答保留完整的阅读空间。无论问题有多少行，圆扣都跟随首行；这段较长的回答也应该自然换行，最后一句仍然可以完整阅读。
                </Text>
              ),
            },
            {
              value: 'locked-open',
              title: 'Disabled expanded question',
              content: <Text>Disabled expanded answer remains readable</Text>,
              disabled: true,
            },
          ]}
        />
        <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
        <output aria-label="Basic current page">{page}</output>
        <Pagination
          data-testid="navigation-numeric-pages"
          aria-label="Large article archive"
          currentPage={numericPage}
          totalPages={2000}
          onPageChange={setNumericPage}
        />
        <div className="basics-actions">
          <DropdownMenu
            trigger={<Button>Basic actions</Button>}
            items={[
              {
                id: 'copy',
                label: 'Copy article title while keeping this complete, longer action readable',
                onSelect: () => setMessage('Copied article title'),
              },
              {
                id: 'locked',
                label: 'Unavailable action',
                disabled: true,
                onSelect: () => setMessage('Incorrect action'),
              },
              ...Array.from({ length: 3 }, (_, index) => ({
                id: `long-${index}`,
                label: `Reading action ${index + 1}: keep every line of this longer explanation separate from the next action`,
                onSelect: () => setMessage(`Reading action ${index + 1}`),
              })),
              { id: 'save', label: 'Save article', onSelect: () => setMessage('Saved article') },
            ]}
          />
          <Popover
            title="Basic popover: keep this longer note title readable on a narrow screen"
            description="Edit a short note"
            initialFocus={popoverInput}
            trigger={<Button>Open basic popover</Button>}
          >
            <form
              data-testid="overlay-note-form"
              style={{ display: 'grid', gap: 16, minWidth: 0 }}
              onSubmit={(event) => event.preventDefault()}
            >
              <TextField
                ref={popoverInput}
                label="Popover note"
                hint="Keep this small note readable beside its category and action."
              />
              <Select
                label="Popover category"
                defaultValue="life"
                options={options}
                classNames={{ popup: 'nested-select-popup' }}
              />
              <Button type="submit">Keep note</Button>
            </form>
          </Popover>
          <Tooltip
            trigger={<Button aria-label="Read article help">Read article help</Button>}
            content="Read article help: this longer plain-text explanation wraps naturally, stays inside its paper, and leaves the arrow visible beside the trigger."
            delay={0}
            className="basic-tooltip"
          />
        </div>
        <output aria-label="Basic action result">{message}</output>
        <ThemeProvider
          theme="usagi"
          tokens={{ line: '#846973', fieldBackground: '#fff4fa', ink: '#442b37' }}
        >
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Nested basic controls"
            trigger={<Button>Open nested controls</Button>}
          >
            <Select
              label="Dialog category"
              defaultValue="life"
              options={options}
              classNames={{ popup: 'dialog-select-popup' }}
            />
            <Text>
              Keep the category and this reading note together. On a short screen the note can
              scroll, and the close action remains reachable without losing the selected category.
            </Text>
          </Dialog>
        </ThemeProvider>
        <section className="basics-content">
          <Button hidden data-testid="hidden-button">
            Hidden button
          </Button>
          <IconButton hidden data-testid="hidden-icon-button" aria-label="Hidden icon button">
            ×
          </IconButton>
          <Avatar hidden data-testid="hidden-avatar" name="Hidden author" />
          <Badge hidden data-testid="hidden-badge">
            Hidden badge
          </Badge>
          <SegmentedControl
            hidden
            data-testid="hidden-segments"
            label="Hidden segments"
            value="life"
            onValueChange={() => {}}
            options={options}
          />
          <TextField hidden data-testid="hidden-input" label="Hidden field input" />
          <Textarea hidden data-testid="hidden-textarea" label="Hidden field textarea" />
          <Select
            hidden
            data-testid="hidden-select"
            label="Hidden field select"
            options={options}
          />
          <Divider hidden data-testid="hidden-divider" />
          <Divider hidden data-testid="hidden-divider-vertical" orientation="vertical" />
          <Alert hidden data-testid="hidden-alert" title="Hidden alert">
            Hidden note
          </Alert>
          <Spinner hidden data-testid="hidden-spinner" label="Hidden loading" />
          <Skeleton hidden data-testid="hidden-skeleton" />
          <Heading level={2}>Reading components</Heading>
          <Text>
            Words remain readable beside{' '}
            <Link href="#content" external={false}>
              an article link
            </Link>
            .
          </Text>
          <div
            data-testid="reading-flow"
            style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: '65ch' }}
          >
            <Heading level={3} data-testid="reading-long-title">
              把一路发现的小小事情写成一篇能慢慢读完的生活手记，也为下一次重读留一点空白
            </Heading>
            <Text size="lg" data-testid="reading-summary">
              摘要介绍这一篇手记，正文继续保持自己的阅读节奏。
            </Text>
            <Text data-testid="reading-copy">
              连续正文中的中文与标点应当自然换行，
              <Link href="https://example.com/reading" external data-testid="reading-long-link">
                这是一段需要完整保留的跨行阅读链接，可以继续了解作者记录的散步与读书故事
              </Link>
              ，阅读结束后仍能回到自己的位置。
            </Text>
            <Text size="sm" data-testid="reading-caption">
              <Link
                href="https://example.com/PersonalReadingJournalWithAVeryLongUnbrokenAddress"
                external
                data-testid="reading-url"
              >
                https://example.com/PersonalReadingJournalWithAVeryLongUnbrokenAddress
              </Link>
            </Text>
          </div>
          <Divider data-testid="reading-divider" />
          <div className="basics-actions">
            <Avatar size="sm" name="小林" data-testid="reading-avatar-sm" />
            <Avatar name="Hachi" data-testid="reading-avatar-md" />
            <Avatar size="lg" name="乌萨奇" data-testid="reading-avatar-lg" />
            <Avatar
              name="Missing picture"
              src={authorSource}
              data-testid="reading-avatar-recovery"
            />
          </div>
          <Button onClick={() => setAuthorSource(picture)}>Recover author picture</Button>
          <Image
            src={source}
            alt="Basic article cover"
            aspectRatio="5 / 3"
            fallback={'Unavailable ' + 'W'.repeat(100)}
            className="basic-image"
          />
          <Image
            src={source}
            alt="Reading preview"
            aspectRatio="16 / 9"
            className="reading-fallback-image"
          />
          <Button onClick={() => setSource(picture)}>Recover basic picture</Button>
          <Alert tone="warning" title="Reading note">
            This persistent note does not disappear.
          </Alert>
          <div data-testid="basic-skeleton" aria-busy="true">
            <Skeleton variant="rect" height={80} />
          </div>
          <Spinner label="Loading basic content" />
        </section>
      </main>
    </ThemeProvider>
  );
}
