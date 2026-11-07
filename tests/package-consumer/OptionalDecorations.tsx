import { useState } from 'react';
import {
  Accordion,
  Badge,
  BookmarkIcon,
  Button,
  Checkbox,
  EmptyState,
  Heading,
  IconButton,
  Pagination,
  RadioGroup,
  Select,
  Tabs,
  ThemeProvider,
  Toast,
  Tooltip,
  type ThemeName,
} from 'yahha-ui';

export const decorationCases = [
  'button',
  'icon-button',
  'checkbox',
  'radio-group',
  'select',
  'heading',
  'badge',
  'tabs',
  'pagination',
  'accordion',
  'tooltip',
  'toast',
  'empty-state',
] as const;
export type DecorationCaseName = (typeof decorationCases)[number];

/** One real component, shared by the installed-package checks and local comparison. */
export function DecorationCase({
  name,
  decorated = false,
  legacy = false,
  omitDecorationProps = false,
  testMode,
}: {
  name: DecorationCaseName;
  decorated?: boolean;
  legacy?: boolean;
  omitDecorationProps?: boolean;
  testMode?: string;
}) {
  const [checked, setChecked] = useState(true);
  const [value, setValue] = useState('first');
  const [page, setPage] = useState(2);
  const [open, setOpen] = useState(true);
  const [created, setCreated] = useState(false);
  const [undone, setUndone] = useState(false);
  // The historical snapshot does not receive properties it did not support.
  const optional = <T extends object>(props: T): T | Record<string, never> =>
    legacy || omitDecorationProps ? {} : props;
  switch (name) {
    case 'button':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16 }}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Button
              key={size}
              size={size}
              loading
              {...optional({
                loadingVariant: decorated ? ('biscuit' as const) : ('dots' as const),
              })}
            >
              保存草稿
            </Button>
          ))}
          <Button
            loading
            startIcon={<BookmarkIcon />}
            {...optional({ loadingVariant: decorated ? ('biscuit' as const) : ('dots' as const) })}
          >
            收藏手记
          </Button>
        </div>
      );
    case 'icon-button':
      return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <IconButton
              key={size}
              size={size}
              aria-label={`收藏手记 ${size}`}
              loading
              {...optional({
                loadingVariant: decorated ? ('biscuit' as const) : ('dots' as const),
              })}
            >
              <BookmarkIcon />
            </IconButton>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <form style={{ display: 'grid', gap: 12 }} onReset={() => setChecked(true)}>
          <Checkbox
            label="接收每月阅读来信"
            name="updates"
            value="yes"
            checked={checked}
            onChange={(e) => setChecked(e.currentTarget.checked)}
            {...optional({ highlightSelected: decorated })}
          />
          <Checkbox
            label="订阅部分分类"
            indeterminate
            {...optional({ highlightSelected: decorated })}
          />
          <Checkbox
            label="暂不可更改的订阅"
            checked
            disabled
            {...optional({ highlightSelected: decorated })}
          />
        </form>
      );
    case 'radio-group':
      return (
        <form>
          <RadioGroup
            label="阅读来信频率"
            name="frequency"
            value={value}
            onValueChange={setValue}
            options={[
              { value: 'first', label: '每周一封' },
              { value: 'second', label: '每月一封' },
              { value: 'locked', label: '暂不可选', disabled: true },
            ]}
            {...optional({ highlightSelected: decorated })}
          />
        </form>
      );
    case 'select':
      return (
        <Select
          label="手记分类"
          value={value}
          onValueChange={(next) => setValue(next ?? 'first')}
          options={[
            { value: 'first', label: '日常小发现' },
            { value: 'second', label: '读书笔记' },
            { value: 'locked', label: '暂不可选', disabled: true },
          ]}
          {...optional({ selectedIndicator: decorated ? ('stamp' as const) : ('check' as const) })}
        />
      );
    case 'heading':
      return (
        <div style={{ display: 'grid', gap: 20 }}>
          <Heading
            level={2}
            {...optional({ decoration: decorated ? ('underline' as const) : ('none' as const) })}
          >
            今天的小发现
          </Heading>
          <p style={{ margin: 0 }}>沿着河边散步，记下想留给朋友的一件小事。</p>
        </div>
      );
    case 'badge':
      return (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Badge
            tone="success"
            {...optional({ appearance: decorated ? ('stamp' as const) : ('default' as const) })}
          >
            已完成
          </Badge>
          <Badge
            tone="accent"
            {...optional({ appearance: decorated ? ('stamp' as const) : ('default' as const) })}
          >
            新手记
          </Badge>
        </div>
      );
    case 'tabs':
      return (
        <Tabs
          label="手记内容"
          items={[
            { value: 'first', label: '正文', content: '最后一块饼干，要留给还没到的朋友。' },
            { value: 'second', label: '后记', content: '下次散步，再把面包店补进路线图。' },
            { value: 'locked', label: '暂不可用', content: '', disabled: true },
          ]}
          {...optional({ appearance: decorated ? ('ink' as const) : ('default' as const) })}
        />
      );
    case 'pagination':
      return (
        <Pagination
          currentPage={page}
          totalPages={4}
          onPageChange={setPage}
          {...optional({ appearance: decorated ? ('circled' as const) : ('default' as const) })}
        />
      );
    case 'accordion':
      return (
        <Accordion
          defaultValue={['first']}
          items={[
            {
              value: 'first',
              title: '怎样找到这篇周末手记？',
              content: '打开手记归档，按日期或分类查找。',
            },
            {
              value: 'second',
              title: '收藏之后放在哪里？',
              content: '在自己的收藏清单里继续阅读。',
            },
          ]}
          {...optional({ appearance: decorated ? ('soft' as const) : ('default' as const) })}
        />
      );
    case 'tooltip':
      return (
        <div style={{ minHeight: 160, display: 'grid', placeItems: 'center' }}>
          <Tooltip
            open
            content="收藏文章"
            trigger={
              <IconButton aria-label="收藏文章">
                <BookmarkIcon />
              </IconButton>
            }
            className={`optional-tooltip${testMode ? ` optional-tooltip-${testMode}` : ''}`}
            {...optional({ showArrow: decorated })}
          />
        </div>
      );
    case 'toast':
      return (
        <div style={{ minHeight: 150 }}>
          <Toast
            open={open}
            onClose={() => setOpen(false)}
            title={undone ? '已撤销归档' : '草稿已保存'}
            description="你的阅读笔记已经保存，可以稍后继续整理。"
            action={
              <Button variant="secondary" onClick={() => setUndone(true)}>
                撤销归档
              </Button>
            }
            {...optional({ appearance: decorated ? ('receipt' as const) : ('default' as const) })}
          />
        </div>
      );
    case 'empty-state':
      return created ? (
        <p role="status">第一篇手记已创建</p>
      ) : (
        <EmptyState
          title="还没有手记"
          description="先写下今天想记住的一件小事。"
          action={<Button onClick={() => setCreated(true)}>创建手记</Button>}
          {...optional({ motif: decorated ? ('paper' as const) : ('none' as const) })}
        />
      );
  }
}

export function OptionalDecorations() {
  const query = new URLSearchParams(location.search);
  const theme = (query.get('theme') ?? 'pink') as ThemeName;
  const direction = query.get('dir') === 'rtl' ? 'rtl' : 'ltr';
  return (
    <ThemeProvider theme={theme}>
      <main
        dir={direction}
        style={{
          maxWidth: 900,
          margin: 'auto',
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 36,
        }}
      >
        <h1>Installed optional decoration contract</h1>
        {decorationCases.map((name) => (
          <section
            key={name}
            data-testid={`optional-${name}`}
            style={{ display: 'grid', minWidth: 0, gap: 20 }}
          >
            <h2>{name}</h2>
            {(['default', 'ordinary', 'decorated'] as const).map((mode) => (
              <div
                key={mode}
                data-mode={mode}
                style={{ minWidth: 0, padding: 12, border: '1px solid #d9cbd2' }}
              >
                <p>
                  {mode === 'default'
                    ? '省略装饰属性'
                    : mode === 'decorated'
                      ? '明确开启装饰'
                      : '显式常规'}
                </p>
                <DecorationCase
                  name={name}
                  decorated={mode === 'decorated'}
                  omitDecorationProps={mode === 'default'}
                  testMode={mode}
                />
              </div>
            ))}
          </section>
        ))}
        <section data-testid="empty-custom">
          <EmptyState
            title="自定义插画"
            illustration={
              <svg aria-hidden="true" width="40" height="40">
                <circle cx="20" cy="20" r="16" />
              </svg>
            }
          />
        </section>
        <section data-testid="empty-disabled">
          <EmptyState title="显式关闭" motif="paper" illustration={false} />
        </section>
        <section data-testid="toast-nested">
          <Toast
            open
            onClose={() => {}}
            title="外层回执"
            appearance="receipt"
            className="nested-toast-outer"
            action={
              <Toast
                open
                onClose={() => {}}
                title="内层普通状态"
                className="nested-toast-inner"
                action={<Button>内层操作</Button>}
              />
            }
          />
        </section>
      </main>
    </ThemeProvider>
  );
}
