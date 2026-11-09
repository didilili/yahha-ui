import { useRef, type KeyboardEvent, type RefObject } from 'react';
import { Search, X } from 'lucide-react';
import { Button, Dialog, IconButton, Input, type DialogProps } from 'yahha-ui';
import { SearchResults } from './SearchResults';
import type { DocumentationSearchResult } from './search';
import './documentation-search-dialog.css';

export interface DocumentationSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: readonly DocumentationSearchResult[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSelect: (result: DocumentationSearchResult) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  finalFocus: DialogProps['finalFocus'];
}

export function DocumentationSearchDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  loading,
  error,
  onRetry,
  onSelect,
  inputRef,
  finalFocus,
}: DocumentationSearchDialogProps) {
  const resultRegion = useRef<HTMLDivElement>(null);
  const hasQuery = query.trim().length > 0;

  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.keyCode === 229 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    const links = Array.from(
      resultRegion.current?.querySelectorAll<HTMLAnchorElement>('.doc-search-results > li > a') ??
        [],
    );
    if (links.length === 0) return;
    const fromInput = event.target === inputRef.current;
    const index = links.findIndex((link) => link === event.target);
    if (event.key === 'Enter' && fromInput && !event.repeat) {
      event.preventDefault();
      links[0].click();
    } else if (['ArrowDown', 'ArrowUp'].includes(event.key) && (fromInput || index >= 0)) {
      event.preventDefault();
      if (event.key === 'ArrowUp' && index === 0) {
        inputRef.current?.focus();
        return;
      }
      const next = fromInput
        ? event.key === 'ArrowDown'
          ? 0
          : links.length - 1
        : Math.min(links.length - 1, Math.max(0, index + (event.key === 'ArrowDown' ? 1 : -1)));
      links[next].focus({ preventScroll: true });
      links[next].scrollIntoView({ block: 'nearest' });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="搜索文档"
      closeLabel="关闭搜索"
      initialFocus={() => {
        inputRef.current?.select();
        return inputRef.current ?? true;
      }}
      finalFocus={finalFocus}
      className="doc-search-dialog"
    >
      <div className="doc-search-dialog-content" role="search" aria-label="文档">
        <Input
          ref={inputRef}
          label="搜索文档"
          type="search"
          placeholder="搜索组件、属性或示例…"
          aria-keyshortcuts="Meta+K Control+K"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeys}
          leading={<Search size={17} aria-hidden="true" />}
          trailing={
            query ? (
              <IconButton
                variant="ghost"
                aria-label="清空搜索"
                onClick={() => {
                  onQueryChange('');
                  inputRef.current?.focus();
                }}
              >
                <X size={17} aria-hidden="true" />
              </IconButton>
            ) : undefined
          }
          classNames={{ label: 'sr-only', input: 'doc-search-dialog-input' }}
        />
        <div className="doc-search-dialog-results" ref={resultRegion}>
          {!hasQuery ? null : error ? (
            <div className="doc-search-dialog-error">
              <p className="doc-search-dialog-message" role="alert">
                搜索暂时不可用，请重试。
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  inputRef.current?.focus();
                  onRetry();
                }}
              >
                重新加载搜索
              </Button>
            </div>
          ) : loading ? (
            <p className="doc-search-dialog-message" role="status">
              正在准备搜索…
            </p>
          ) : results.length > 0 ? (
            <SearchResults
              query={query}
              results={results}
              onSelect={onSelect}
              onResultKeyDown={handleKeys}
            />
          ) : (
            <p className="doc-search-dialog-message" role="status">
              没有匹配的文档，试试其他关键词。
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
