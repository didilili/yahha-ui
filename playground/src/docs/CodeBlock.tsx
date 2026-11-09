import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Code2, Copy } from 'lucide-react';
import { Alert, Button, Textarea } from 'yahha-ui';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Code blocks need keyboard focus to scroll long source lines. */

function Highlight({ source }: { source: string }) {
  // Small display-only tokenizer; React escapes all source text before rendering.
  const pattern =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:import|from|export|default|function|return|const|let|if|else|type|interface|true|false|null|undefined|async|await|new)\b|\b\d+(?:\.\d+)?\b)/g;
  return source.split(pattern).map((token, index) => {
    const kind = /^\//.test(token)
      ? 'comment'
      : /^['"`]/.test(token)
        ? 'string'
        : /^\d/.test(token)
          ? 'number'
          : /^(import|from|export|default|function|return|const|let|if|else|type|interface|true|false|null|undefined|async|await|new)$/.test(
                token,
              )
            ? 'keyword'
            : '';
    return kind ? (
      <span className={`syntax-${kind}`} key={index}>
        {token}
      </span>
    ) : (
      token
    );
  });
}

export function CodeBlock({
  source,
  language = 'tsx',
  collapsible = false,
  compact = false,
  expanded: controlledExpanded,
  onExpandedChange,
}: {
  source: string;
  language?: string;
  collapsible?: boolean;
  /** A single-line import strip; copy and manual fallback retain the same behavior. */
  compact?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const isCompact = compact && !collapsible && !source.trimEnd().includes('\n');
  const [localExpanded, setLocalExpanded] = useState(!collapsible);
  const expanded = controlledExpanded ?? localExpanded;
  function setExpanded(value: boolean) {
    if (controlledExpanded === undefined) setLocalExpanded(value);
    onExpandedChange?.(value);
  }
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [manualCopyAttempt, setManualCopyAttempt] = useState(0);
  const id = useId();
  const manual = useRef<HTMLTextAreaElement>(null);
  const manualCopyFocus = useRef<Element | null>(null);
  const copyRequest = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (copyState === 'manual') {
      const previousFocus = manualCopyFocus.current;
      manualCopyFocus.current = null;
      if (previousFocus && document.activeElement === previousFocus) {
        manual.current?.focus();
        manual.current?.select();
      }
    }
  }, [copyState, manualCopyAttempt]);
  async function copy() {
    const request = ++copyRequest.current;
    const previousFocus = document.activeElement;
    manualCopyFocus.current = null;
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(source);
      if (!mounted.current || request !== copyRequest.current) return;
      setCopyState('copied');
      timer.current = setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      if (!mounted.current || request !== copyRequest.current) return;
      manualCopyFocus.current = document.activeElement === previousFocus ? previousFocus : null;
      setCopyState('manual');
      setExpanded(true);
      // Repeat selection only while focus still belongs to the copy request.
      setManualCopyAttempt((attempt) => attempt + 1);
    }
  }
  const code = (
    <pre tabIndex={0} aria-label={`${language} 代码`}>
      <code>
        <Highlight source={source} />
      </code>
    </pre>
  );
  const fallback = copyState === 'manual' && (
    <Alert tone="warning" className="copy-fallback">
      <Textarea
        ref={manual}
        label="手动复制代码"
        hint="剪贴板不可用，可选中下方代码并按 Ctrl/Cmd + C 复制。"
        readOnly
        value={source}
        rows={6}
        className="copy-source-field"
        classNames={{ textarea: 'copy-source-input' }}
      />
    </Alert>
  );
  return (
    <div
      className={`source-code ${expanded ? 'is-expanded' : ''}${isCompact ? ' is-compact' : ''}`}
    >
      <div className="code-toolbar">
        {isCompact ? (
          code
        ) : collapsible ? (
          <Button
            type="button"
            variant="ghost"
            className="code-action"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={id}
            startIcon={<Code2 size={15} aria-hidden="true" />}
            endIcon={
              <ChevronDown size={14} aria-hidden="true" className={expanded ? 'is-rotated' : ''} />
            }
          >
            {expanded ? '收起代码' : '展开代码'}
          </Button>
        ) : (
          <span>{language}</span>
        )}
        <Button
          type="button"
          variant="ghost"
          className="code-action"
          onClick={copy}
          aria-label="复制代码"
          startIcon={
            copyState === 'copied' ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )
          }
        >
          {copyState === 'copied' ? '已复制' : '复制代码'}
        </Button>
        <span role="status" className="sr-only">
          {copyState === 'copied'
            ? '代码已复制'
            : copyState === 'manual'
              ? '无法访问剪贴板，请手动复制下方代码'
              : ''}
        </span>
      </div>
      {isCompact ? (
        fallback
      ) : (
        <div id={id} hidden={!expanded}>
          {code}
          {fallback}
        </div>
      )}
    </div>
  );
}
