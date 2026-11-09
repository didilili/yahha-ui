import { useId, useLayoutEffect, useRef, useState, type KeyboardEventHandler } from 'react';
import { Button } from 'yahha-ui';
import type { DocumentationSearchResult } from './search';

interface SearchResultsProps {
  query: string;
  results: readonly DocumentationSearchResult[];
  onSelect: (result: DocumentationSearchResult) => void;
  onResultKeyDown?: KeyboardEventHandler<HTMLAnchorElement>;
}

/** A new query starts a new batch without changing the global search or route semantics. */
export function SearchResults({ query, ...props }: SearchResultsProps) {
  return <SearchResultList key={query} {...props} />;
}

function SearchResultList({
  results,
  onSelect,
  onResultKeyDown,
}: Omit<SearchResultsProps, 'query'>) {
  const [limit, setLimit] = useState(12);
  const prefix = useId();
  const list = useRef<HTMLOListElement>(null);
  const nextFocus = useRef<number | undefined>(undefined);
  const shown = Math.min(limit, results.length);
  const listId = `${prefix}-search-results`;

  useLayoutEffect(() => {
    if (nextFocus.current === undefined) return;
    // Continue from the newly revealed links, including when the last button disappears.
    const target = list.current?.querySelectorAll<HTMLAnchorElement>('li > a')[nextFocus.current];
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest' });
    nextFocus.current = undefined;
  }, [shown]);

  return (
    <>
      <p className="doc-search-count" role="status">
        全部文档 · 共 {results.length} 项匹配，已显示 {shown} 项
      </p>
      <ol className="doc-search-results" id={listId} ref={list}>
        {results.slice(0, shown).map((result) => {
          const metadataId = `${prefix}-search-meta-${encodeURIComponent(result.id)}`;
          const isPage = ['component', 'guide', 'overview'].includes(result.kind);
          return (
            <li key={result.id}>
              <a
                href={result.href}
                aria-label={isPage ? result.title : `${result.pageTitle} · ${result.title}`}
                aria-describedby={metadataId}
                onKeyDown={onResultKeyDown}
                onClick={(event) => {
                  const target =
                    event.currentTarget.target ||
                    document.querySelector<HTMLBaseElement>('base[target]')?.target ||
                    '_self';
                  if (
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    target.toLowerCase() !== '_self'
                  )
                    return;
                  onSelect(result);
                }}
              >
                <span className="search-result-meta" id={metadataId}>
                  {result.areaLabel} · {result.label}
                </span>
                {!isPage && <span className="search-result-page">{result.pageTitle}</span>}
                <strong>{result.title}</strong>
                <span className="search-result-description">{result.description}</span>
              </a>
            </li>
          );
        })}
      </ol>
      {shown < results.length && (
        <Button
          type="button"
          variant="secondary"
          aria-controls={listId}
          onClick={() => {
            nextFocus.current = shown;
            setLimit((current) => current + 12);
          }}
        >
          查看更多
        </Button>
      )}
    </>
  );
}
