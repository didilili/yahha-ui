import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button, Heading, Link, Text, TextField } from 'yahha-ui';

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
          星球的云朵邮局，今天收到一封字歪歪的来信。小八念给大家听，吉伊找来彩色铅笔，乌萨奇把邮票排成一行。
        </Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          小节 h3
        </Text>
        <Heading level={3} id={replyId} ref={replyRef} tabIndex={-1}>
          给远方的朋友写封回信
        </Heading>
        <Text>信纸上画一张草地野餐图，给还没来过的朋友也留一个位置。邮票贴歪了，就再按一按。</Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Text size="sm" tone="muted">
            小节内标题 h4
          </Text>
          <Heading level={4}>在信里给朋友留个位置</Heading>
          <Text size="sm" tone="muted">
            “下次一起吃点心吧。”大家画了三块饼干，又添上一块。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          长标题 h3
        </Text>
        <Heading level={3} id={journalId} ref={journalRef} tabIndex={-1}>
          把云朵邮局里借来的铅笔、贴歪的邮票和分给朋友的半块饼干，写进今天的长手记
        </Heading>
        <Text>有些字擦了又写，信封也折得不太齐。寄出去之前，大家还是认认真真签上了名字。</Text>
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
          <TextField ref={addressRef} label="章节地址" readOnly value={manualCopy.address} />
        )}
      </section>
    </div>
  );
}
