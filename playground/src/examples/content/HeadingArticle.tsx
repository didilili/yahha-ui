import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button, Heading, Link, Text, Input } from 'yahha-ui';

export default function HeadingArticle({ hrefPrefix = '#' }: { hrefPrefix?: string }) {
  const replyId = 'heading-article-reply';
  const journalId = 'heading-article-journal';
  const replyRef = useRef<HTMLHeadingElement>(null);
  const journalRef = useRef<HTMLHeadingElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const copyRequest = useRef(0);
  const [copyMessage, setCopyMessage] = useState('');
  const [manualCopy, setManualCopy] = useState<{
    address: string;
    request: number;
    restoreFocus: boolean;
  } | null>(null);

  useEffect(
    () => () => {
      copyRequest.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (!manualCopy?.restoreFocus || manualCopy.request !== copyRequest.current) return;
    addressRef.current?.focus();
    addressRef.current?.select();
  }, [manualCopy]);

  async function copySectionAddress() {
    const request = ++copyRequest.current;
    setCopyMessage('');
    setManualCopy(null);
    const address = new URL(`${hrefPrefix}${journalId}`, window.location.href).href;

    try {
      await navigator.clipboard.writeText(address);
      if (request !== copyRequest.current) return;
      setCopyMessage('章节地址已复制。');
    } catch {
      if (request !== copyRequest.current) return;
      setCopyMessage('未能复制，请选中下方地址手动复制。');
      setManualCopy({ address, request, restoreFocus: document.activeElement === copyRef.current });
    }
  }

  function focusHeading(event: MouseEvent<HTMLAnchorElement>, heading: HTMLHeadingElement | null) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !heading
    )
      return;
    event.preventDefault();
    heading.scrollIntoView({ block: 'center' });
    heading.focus({ preventScroll: true });
  }

  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <nav aria-label="手记目录" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Link
          href={`${hrefPrefix}${replyId}`}
          onClick={(event) => focusHeading(event, replyRef.current)}
        >
          写封回信
        </Link>
        <Link
          href={`${hrefPrefix}${journalId}`}
          onClick={(event) => focusHeading(event, journalRef.current)}
        >
          长手记
        </Link>
      </nav>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          章节 h2
        </Text>
        <Heading level={2}>云朵邮局的第一封来信</Heading>
        <Text>
          Yahha
          星球的云朵邮局今天收到一封信。小八读着读着笑出了声：朋友寄来的照片里，乌萨奇的耳朵刚好挡住了整张脸。
        </Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          小节 h3
        </Text>
        <Heading level={3} id={replyId} ref={replyRef} tabIndex={-1}>
          给远方的朋友写封回信
        </Heading>
        <Text>
          吉伊想重画一张合照，画到乌萨奇时，把耳朵缩短了些。乌萨奇凑过来看，又替自己添上一副墨镜。
        </Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Text size="sm" tone="muted">
            小节内标题 h4
          </Text>
          <Heading level={4}>这回总能看清脸了</Heading>
          <Text size="sm" tone="muted">
            小八把回信读了一遍，读到“下次再拍一张”时，乌萨奇已经摆好了姿势。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          长标题 h3
        </Text>
        <Heading level={3} id={journalId} ref={journalRef} tabIndex={-1}>
          把云朵邮局里借来的铅笔、画歪的墨镜和贴到手背上的邮票，写进今天的长手记
        </Heading>
        <Text>
          信封封好以后，才发现邮票还贴在乌萨奇手背上。它举着手看了一会儿，像是在等谁把自己寄出去。
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href={`${hrefPrefix}${journalId}`}>本节永久链接</Link>
          <Button ref={copyRef} variant="ghost" onClick={copySectionAddress}>
            复制本节地址
          </Button>
        </div>
        <Text size="sm" tone="muted" role="status">
          {copyMessage}
        </Text>
        {manualCopy && (
          <Input ref={addressRef} label="章节地址" readOnly value={manualCopy.address} />
        )}
      </section>
    </div>
  );
}
