import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  Alert,
  Badge,
  Button,
  BookmarkIcon,
  Dialog,
  DropdownMenu,
  Heading,
  IconButton,
  Popover,
  Select,
  Text,
  Textarea,
  Input,
  Toast,
  Tooltip,
} from 'yahha-ui';

const initialArticle = {
  title: '沿着河边，慢慢走',
  category: '日常',
  summary: '说好沿河散步，小八却先闻到了面包香。',
};

export default function ArticleActions() {
  const [article, setArticle] = useState(initialArticle);
  const [draft, setDraft] = useState(initialArticle);
  const [open, setOpen] = useState(false);
  const [archived, setArchived] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failNext, setFailNext] = useState(true);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [message, setMessage] = useState('示例手记仅在当前页面保留，刷新后恢复。');
  const [notice, setNotice] = useState<string | null>(null);
  const [announceInline, setAnnounceInline] = useState(true);
  const menuButton = useRef<HTMLButtonElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const saveButton = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreSaveFocus = useRef(false);
  const formId = useId();

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (saving || !error || !restoreSaveFocus.current) return;
    if (document.activeElement === document.body || document.activeElement === popup.current) {
      saveButton.current?.focus();
    }
    restoreSaveFocus.current = false;
  }, [saving, error]);

  function changeOpen(next: boolean) {
    if (!next) restoreSaveFocus.current = false;
    if (!next && timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
      setSaving(false);
    }
    setOpen(next);
  }

  function edit() {
    setNotice(null);
    setDraft(article);
    setError('');
    setTitleError('');
    setFailNext(true);
    setOpen(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const next = { ...draft, title: draft.title.trim(), summary: draft.summary.trim() };
    if (!next.title) {
      setTitleError('请输入文章标题，不能只填写空格。');
      titleInput.current?.focus();
      return;
    }
    setTitleError('');
    setError('');
    setSaving(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setSaving(false);
      if (failNext) {
        setFailNext(false);
        setError('输入内容仍然保留，请再按一次“保存手记”。');
        restoreSaveFocus.current =
          document.activeElement === document.body || document.activeElement === popup.current;
        return;
      }
      setArticle(next);
      const result = `已保存：${next.title}`;
      setMessage(result);
      setAnnounceInline(false);
      setNotice(result);
      setOpen(false);
    }, 700);
  }

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 660, margin: 'auto' }}>
      <article aria-label="示例手记" style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Badge tone="accent">{article.category}</Badge>
          <Badge>{archived ? '已归档' : '阅读列表'}</Badge>
        </div>
        <Heading level={3}>{article.title}</Heading>
        <Text>{article.summary || '这篇手记暂时没有摘要，仍可编辑和收藏。'}</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <DropdownMenu
            trigger={
              <Button ref={menuButton} variant="secondary">
                手记操作
              </Button>
            }
            items={[
              { id: 'edit', label: '编辑手记', onSelect: edit },
              {
                id: 'archive',
                label: archived ? '恢复到阅读列表' : '归档手记',
                onSelect: () => {
                  setNotice(null);
                  setAnnounceInline(true);
                  setArchived(!archived);
                  setMessage(
                    archived
                      ? '已恢复到阅读列表，收藏状态保留。'
                      : '手记已归档，可以从同一菜单恢复。',
                  );
                },
              },
            ]}
          />
          <Tooltip
            content="收藏手记"
            trigger={
              <IconButton
                variant="secondary"
                aria-label="收藏手记"
                aria-pressed={saved}
                onClick={() => {
                  setNotice(null);
                  setAnnounceInline(true);
                  setSaved(!saved);
                  setMessage(saved ? '已取消收藏，手记仍然保留。' : '手记已收藏，再次点击可取消。');
                }}
              >
                <BookmarkIcon filled={saved} />
              </IconButton>
            }
          />
          <Text size="sm" tone="muted">
            {saved ? '已收藏' : '可收藏这篇手记'}
          </Text>
        </div>
      </article>
      <Toast
        open={notice !== null}
        title="手记已保存"
        description={notice}
        onClose={() => {
          setNotice(null);
          menuButton.current?.focus();
        }}
      />
      {notice === null && (
        <Text role={announceInline ? 'status' : undefined} aria-atomic="true">
          {message}
        </Text>
      )}
      <Text size="sm" tone="muted">
        在“手记操作”中编辑或归档。编辑内可以选择分类、查看写作提示；收藏操作不依赖悬停。
      </Text>
      <Dialog
        ref={popup}
        open={open}
        onOpenChange={changeOpen}
        title="编辑这篇手记"
        description="取消或关闭会放弃本次草稿。只有保存成功才更新页面中的手记。"
        initialFocus={titleInput}
        finalFocus={menuButton}
        footer={
          <>
            <Button variant="secondary" onClick={() => changeOpen(false)}>
              取消编辑
            </Button>
            <Button ref={saveButton} type="submit" form={formId} loading={saving}>
              保存手记
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={submit} style={{ display: 'grid', gap: 20 }}>
          <Input
            ref={titleInput}
            label="文章标题"
            name="title"
            required
            maxLength={60}
            value={draft.title}
            disabled={saving}
            hint="请输入 1–60 个字符。"
            error={titleError}
            onChange={(event) => {
              setDraft({ ...draft, title: event.target.value });
              setTitleError('');
            }}
          />
          <Select
            label="文章分类"
            name="category"
            value={draft.category}
            disabled={saving}
            options={['日常', '读书', '散步'].map((value) => ({ value, label: value }))}
            onValueChange={(category) => {
              if (category !== null) setDraft({ ...draft, category });
            }}
          />
          <Textarea
            label="文章摘要"
            name="summary"
            rows={3}
            maxLength={160}
            value={draft.summary}
            disabled={saving}
            hint="可留空，最多 160 个字符。"
            onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
          />
          <div>
            <Popover
              trigger={
                <Button size="sm" variant="ghost">
                  写作提示
                </Button>
              }
              title="摘要写什么"
            >
              <Text>概括这篇手记最想说的一件事，详细经过留在正文。</Text>
              <Text size="sm" tone="muted">
                此弹出面板可单独关闭，正在编辑的草稿仍会保留。
              </Text>
            </Popover>
          </div>
          <Text size="sm" tone="muted">
            本例每次打开编辑后，首次保存会用 700
            毫秒计时器模拟失败；再次保存成功。关闭会取消等待，数据不上传服务器。
          </Text>
          {error && (
            <Alert role="alert" tone="error" title="保存失败">
              {error}
            </Alert>
          )}
        </form>
      </Dialog>
    </div>
  );
}
