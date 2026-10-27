import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { Badge, Button, EmptyState, IconButton, Link, SegmentedControl, TextField } from 'yahha-ui';
import { catalogGroups, componentCatalog } from '../docs/component-catalog';
import friendsPeek from '../examples/scenes/artwork/friends-preview/friends-peek.svg';
import ComponentPreview from './ComponentPreviews';
import Motif from './Motif';
import './component-overview.css';

const groups = catalogGroups;
const groupOptions = [
  { value: 'all', label: '全部' },
  ...groups.map((group) => ({ value: group, label: group })),
];
const groupDetails: Record<
  string,
  { description: string; motif: 'flower' | 'sprout' | 'cloud' | 'star' | 'letter' }
> = {
  通用: { description: '用清楚的按钮，回应每一个小小的动作。', motif: 'flower' },
  排版: { description: '让标题、正文和链接各有清楚的位置。', motif: 'letter' },
  布局: { description: '用内容纸面与分隔线，安排阅读的节奏。', motif: 'cloud' },
  表单: { description: '写下想法，选好偏好，让每一次填写都有回应。', motif: 'sprout' },
  内容展示: { description: '展示作者、配图、状态标签与补充说明。', motif: 'cloud' },
  浮层与反馈: { description: '等待、完成和小小的提醒，都认真说明。', motif: 'star' },
  导航: { description: '翻翻栏目、切换页码，也收好常用操作。', motif: 'letter' },
  主题配置: { description: '为页面设置一致的配色，并让浮层同步主题。', motif: 'flower' },
};

// Preserve the original result sets of saved filters whose categories were split.
const legacyGroups: Record<string, { label: string; ids: readonly string[] }> = {
  基础: {
    label: '基础（旧分类）',
    ids: [
      'button',
      'icon-button',
      'badge',
      'surface',
      'theme-provider',
      'text',
      'heading',
      'link',
      'divider',
    ],
  },
  内容: { label: '内容（旧分类）', ids: ['avatar', 'image'] },
};

function readFilters() {
  const [path, query = ''] = window.location.hash.slice(1).split('?');
  if (path !== '/components') return { query: '', group: 'all' };
  const parameters = new URLSearchParams(query);
  const requested = parameters.get('group') ?? 'all';
  const group = requested === '反馈' ? '浮层与反馈' : requested;
  return {
    query: (parameters.get('q') ?? '').slice(0, 80),
    group:
      groups.some((candidate) => candidate === group) || Object.hasOwn(legacyGroups, group)
        ? group
        : 'all',
  };
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase();

export default function ComponentOverview({
  headingRef,
  onReady,
}: {
  headingRef?: Ref<HTMLHeadingElement>;
  onReady?: () => void;
}) {
  const [filters, setFilters] = useState(readFilters);
  const searchRef = useRef<HTMLInputElement>(null);
  const readyCallback = useRef(onReady);
  const overviewId = useId();
  const descriptionId = `${overviewId}-search-hint`;
  const legacyGroup = Object.hasOwn(legacyGroups, filters.group)
    ? legacyGroups[filters.group]
    : undefined;
  const filterOptions = legacyGroup
    ? [
        groupOptions[0],
        { value: filters.group, label: legacyGroup.label },
        ...groupOptions.slice(1),
      ]
    : groupOptions;
  const words = normalize(filters.query).trim().split(/\s+/).filter(Boolean);
  const matches = componentCatalog.filter((component) => {
    if (legacyGroup) {
      if (!legacyGroup.ids.includes(component.id)) return false;
    } else if (filters.group !== 'all' && component.group !== filters.group) return false;
    const text = normalize(
      `${component.name} ${component.chinese ?? ''} ${component.description} ${component.group} ${(component.aliases ?? []).join(' ')}`,
    );
    return words.every((word) => text.includes(word));
  });
  const visibleGroups = groups
    .map((group) => ({
      group,
      components: matches.filter((component) => component.group === group),
    }))
    .filter(({ components }) => components.length > 0);
  const uiCount = componentCatalog.filter((component) => component.id !== 'theme-provider').length;

  useEffect(() => {
    readyCallback.current?.();
  }, []);

  useEffect(() => {
    const readLocation = () => {
      if (window.location.hash.slice(1).split('?')[0] === '/components') setFilters(readFilters());
    };
    window.addEventListener('hashchange', readLocation);
    return () => window.removeEventListener('hashchange', readLocation);
  }, []);

  useEffect(() => {
    const [path, query = ''] = window.location.hash.slice(1).split('?');
    if (path !== '/components') return;
    const parameters = new URLSearchParams(query);
    if (filters.query.trim()) parameters.set('q', filters.query.trim());
    else parameters.delete('q');
    if (filters.group !== 'all') parameters.set('group', filters.group);
    else parameters.delete('group');
    const next = `/components${parameters.size ? `?${parameters}` : ''}`;
    if (window.location.hash.slice(1) !== next) {
      const url = new URL(window.location.href);
      url.hash = next;
      window.history.replaceState(window.history.state, '', url);
    }
  }, [filters]);

  function clearFilters() {
    setFilters({ query: '', group: 'all' });
    searchRef.current?.focus();
  }

  return (
    <div className="component-overview-page">
      <header className="overview-hero">
        <div className="overview-hero-copy">
          <p className="overview-eyebrow">
            <Motif name="flower" />
            朋友们的组件小屋
          </p>
          {/* Route navigation focuses the heading without adding another tab stop. */}
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <h1 ref={headingRef} tabIndex={-1}>
            组件总览
          </h1>
          <p className="overview-introduction">一眼找到，刚好合用的组件。</p>
          <p className="overview-description">给个人博客、主页与内容小站。</p>
          <div className="overview-hero-notes">
            <Badge>{componentCatalog.length} 个文档入口</Badge>
            <span className="overview-inventory-note">{uiCount} 个 UI 组件与主题配置 · React</span>
          </div>
        </div>
        <div className="overview-friends" aria-hidden="true">
          <img src={friendsPeek} width="440" height="170" alt="" />
          <span>今天，也一起做点喜欢的事。</span>
        </div>
      </header>

      <section className="overview-find" aria-label="查找组件">
        <div className="overview-filterbar">
          <div className="overview-search">
            <div className="overview-search-row">
              <TextField
                ref={searchRef}
                className="overview-search-control"
                classNames={{ input: 'overview-search-input' }}
                type="search"
                label="搜索组件"
                placeholder="例如：按钮、Select、表单"
                leading={<Search size={18} aria-hidden="true" />}
                value={filters.query}
                maxLength={80}
                aria-describedby={descriptionId}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, query: event.target.value }))
                }
              />
              {filters.query && (
                <IconButton
                  variant="secondary"
                  aria-label="清空组件搜索"
                  onClick={() => {
                    setFilters((current) => ({ ...current, query: '' }));
                    searchRef.current?.focus();
                  }}
                >
                  <X size={20} aria-hidden="true" />
                </IconButton>
              )}
            </div>
            <p className="overview-search-hint" id={descriptionId}>
              支持英文名、中文名和用途关键词。
            </p>
          </div>
          <div className="overview-categories">
            <p className="overview-filter-label">按分类逛逛</p>
            <SegmentedControl
              label="组件分类"
              value={filters.group}
              onValueChange={(group) => setFilters((current) => ({ ...current, group }))}
              options={filterOptions}
            />
          </div>
        </div>
        <div className="overview-result-row">
          <p
            className="overview-results"
            role="status"
            aria-label="组件筛选结果"
            aria-live="polite"
          >
            显示 <strong>{matches.length}</strong> / {componentCatalog.length} 个入口
            {filters.group !== 'all' && <span> · {legacyGroup?.label ?? filters.group}</span>}
          </p>
          <p className="overview-preview-note">先看样式，再点开示例与 API。</p>
        </div>
      </section>

      {matches.length === 0 ? (
        <EmptyState
          title="这间小屋里，还没找到它"
          description="试试组件名或用途关键词，也可以清空筛选，重新逛一逛。"
          illustration={<Motif name="cloud" />}
          action={
            <Button variant="secondary" onClick={clearFilters}>
              清空筛选
            </Button>
          }
        />
      ) : (
        <div className="overview-groups">
          {visibleGroups.map(({ group, components }) => (
            <section
              key={group}
              className={group === '主题配置' ? 'overview-configuration' : 'overview-group'}
              data-group={group}
              aria-labelledby={`${overviewId}-${groups.indexOf(group)}`}
            >
              <header className="overview-group-heading">
                <Motif name={groupDetails[group]?.motif ?? 'flower'} />
                <div>
                  <h2 id={`${overviewId}-${groups.indexOf(group)}`}>
                    {group}
                    <span>{components.length} 个入口</span>
                  </h2>
                  <p>{groupDetails[group]?.description}</p>
                </div>
              </header>
              <div className="overview-grid">
                {components.map((component) => (
                  <article
                    key={component.id}
                    className="overview-card"
                    data-component-id={component.id}
                  >
                    <div
                      className="overview-preview"
                      data-component-preview={component.id}
                      aria-hidden="true"
                      inert
                    >
                      <ComponentPreview id={component.id} />
                    </div>
                    <div className="overview-card-copy">
                      <h3>
                        <Link
                          className="overview-card-link"
                          href={`#/components/${component.id}`}
                          aria-label={`${component.name} ${component.chinese ?? ''}，查看示例与 API`}
                        >
                          <span>
                            <strong>{component.name}</strong>
                            <span className="overview-card-chinese">{component.chinese}</span>
                          </span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                      </h3>
                      <p>{component.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <aside className="overview-next" aria-labelledby={`${overviewId}-next`}>
        <Motif name="letter" />
        <div>
          <h2 id={`${overviewId}-next`}>把组件，放进一页小日常。</h2>
          <p>接好样式，读一篇文章，再把喜欢的组件用到自己的小站里。</p>
          <nav aria-label="总览相关指南">
            <Link href="#/guides/getting-started">
              安装与接入 <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="#/guides/styling?section=reading">
              阅读与组合 <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="#/guides/states?section=article-actions">
              文章编辑场景 <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="#/guides/getting-started?section=blog-example">
              完整博客示例 <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </aside>
    </div>
  );
}
