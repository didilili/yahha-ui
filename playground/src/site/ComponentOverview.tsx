import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { Badge, Button, EmptyState, IconButton, Link, SegmentedControl, TextField } from 'yahha-ui';
import { catalogGroups, componentCatalog } from '../docs/component-catalog';
import ComponentPreview from './ComponentPreviews';
import DocScene from './DocScene';
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
  通用: { description: '把想法交给按钮，让每一次点击都有回应。', motif: 'flower' },
  排版: { description: '让标题、正文和链接，排成好读的一页。', motif: 'letter' },
  布局: { description: '用纸面和分隔线，为内容留出舒展的空间。', motif: 'cloud' },
  表单: { description: '写下想法，选好偏好，让每一次填写都有回应。', motif: 'sprout' },
  内容展示: { description: '给作者、配图与内容标记一个清楚的位置。', motif: 'cloud' },
  浮层: { description: '展开便笺，把操作和补充说明放在手边。', motif: 'letter' },
  反馈: { description: '等待时有说明，完成时有回应，遇到问题也有下一步。', motif: 'star' },
  导航: { description: '翻过一页，还有新的故事等着你。', motif: 'letter' },
  主题配置: { description: '选一组喜欢的配色，让页面与浮层保持一致。', motif: 'flower' },
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
  浮层与反馈: {
    label: '浮层与反馈（旧分类）',
    ids: ['dialog', 'popover', 'tooltip', 'alert', 'toast', 'empty-state', 'spinner', 'skeleton'],
  },
};

function readFilters() {
  const [path, query = ''] = window.location.hash.slice(1).split('?');
  if (path !== '/components') return { query: '', group: 'all' };
  const parameters = new URLSearchParams(query);
  const requested = parameters.get('group') ?? 'all';
  const group = requested;
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
            Yahha 星球 · 朋友们的组件集合
          </p>
          {/* Route navigation focuses the heading without adding another tab stop. */}
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <h1 ref={headingRef} tabIndex={-1}>
            组件总览
          </h1>
          <p className="overview-introduction">朋友们把组件摆好了，来挑几个吧。</p>
          <p className="overview-description">
            浏览漫画手账风 React 组件，查看交互示例、用法与 API。
          </p>
          <div className="overview-hero-notes">
            <Badge tone="accent">{uiCount} 个 UI 组件</Badge>
            <span className="overview-inventory-note">
              {groups.length - 1} 个分类 · ThemeProvider 主题配置
            </span>
          </div>
        </div>
        <div className="overview-friends" aria-hidden="true">
          <DocScene />
          <span>你先挑，朋友们在这里等你。</span>
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
            <p className="overview-filter-label">按分类筛选</p>
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
            找到 <strong>{matches.length}</strong> 项 / 共 {componentCatalog.length} 项
            {filters.group !== 'all' && <span> · {legacyGroup?.label ?? filters.group}</span>}
          </p>
          <p className="overview-preview-note">选择组件，查看交互示例与 API。</p>
        </div>
      </section>

      {matches.length === 0 ? (
        <EmptyState
          className="overview-empty"
          title="未找到相关组件"
          description="试试其他组件名或用途关键词，或清空筛选，看看其他可爱的伙伴。"
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
                    <span>{components.length} 项</span>
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
          <h2 id={`${overviewId}-next`}>挑好了，就一起搭起来。</h2>
          <p>接好样式，先搭一页手记，再给你的故事添个位置。</p>
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
