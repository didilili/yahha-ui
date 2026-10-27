import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Heading,
  IconButton,
  RadioGroup,
  SegmentedControl,
  Select,
  Text,
  TextField,
  Textarea,
  ThemeProvider,
} from 'yahha-ui';
import 'yahha-ui/style.css';

const categories = [
  { value: 'journal', label: '生活手记' },
  { value: 'reading', label: '读书笔记' },
  { value: 'photos', label: '散步相册' },
  { value: 'coming', label: '旅行专题 · 尚未开放', disabled: true },
];

/** Canonical defaults: layout belongs to the example; appearance belongs to the library. */
export default function DesignBaseline() {
  const [nickname, setNickname] = useState('小林');
  const [email, setEmail] = useState('hello@');
  const [category, setCategory] = useState<string | null>('journal');
  const [bio, setBio] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [display, setDisplay] = useState('summary');
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState('');
  const [message, setMessage] = useState('');
  const nicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nicknameError = submitted && !nicknameValid ? '昵称需要 2～12 个字符。' : undefined;
  const emailError =
    (email.length > 0 || submitted) && !emailValid
      ? '请补全邮箱，例如 hello@example.com。'
      : undefined;

  useEffect(() => {
    if (!saving) return;
    // Only simulates an async request; this example sends and stores no data.
    const timer = window.setTimeout(() => {
      setSaving(false);
      setMessage(pending);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [saving, pending]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSubmitted(true);
    setMessage('');
    if (!nicknameValid || !emailValid) {
      const name = nicknameValid ? 'email' : 'nickname';
      (event.currentTarget.elements.namedItem(name) as HTMLInputElement | null)?.focus();
      return;
    }
    setPending(
      `已在本页保存「${nickname.trim()}」的${categories.find((item) => item.value === category)?.label ?? '手记'}设置。`,
    );
    setSaving(true);
  }

  return (
    <ThemeProvider theme="chiikawa">
      <section aria-label="规范表单" style={{ display: 'grid', gap: 24 }}>
        <header style={{ display: 'grid', gap: 8 }}>
          <Heading level={3}>同一尺寸，不同职责</Heading>
          <Text size="sm" tone="muted">
            表单、按钮和菜单使用组件库默认样式。修正邮箱后可以保存，也可以试试只读、禁用和收藏。
          </Text>
        </header>
        <form
          noValidate
          onSubmit={save}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 24,
          }}
        >
          <TextField
            label="主页昵称"
            name="nickname"
            autoComplete="nickname"
            value={nickname}
            required
            onChange={(event) => {
              setNickname(event.target.value);
              setMessage('');
            }}
            error={nicknameError}
            hint="2～12 个字符，显示在手记的作者位置。"
          />
          <Select
            label="默认文章分类"
            name="category"
            value={category}
            options={categories}
            onValueChange={(value) => {
              setCategory(value);
              setMessage('');
            }}
          />
          <TextField
            label="联系邮箱"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            required
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage('');
            }}
            error={emailError}
            hint="预填的不完整邮箱用于展示错误恢复。"
          />
          <TextField
            label="站点地址 · 只读"
            name="site"
            value="weekend.example"
            readOnly
            hint="允许聚焦、选择和复制。"
          />
          <TextField label="自定义域名 · 暂未开放" value="开放后可设置" disabled />
          <Textarea
            label="简介"
            name="bio"
            rows={3}
            maxLength={160}
            value={bio}
            onChange={(event) => {
              setBio(event.target.value);
              setMessage('');
            }}
            hint="最多 160 个字符，向来访的朋友介绍一下小站。"
          />
          <RadioGroup
            label="来信频率"
            name="frequency"
            value={frequency}
            onValueChange={(value) => {
              setFrequency(value);
              setMessage('');
            }}
            options={[
              { value: 'weekly', label: '每周一封' },
              { value: 'monthly', label: '每月一封' },
              { value: 'daily', label: '每日更新 · 暂未开放', disabled: true },
            ]}
          />
          <div style={{ display: 'grid', alignContent: 'start', justifyItems: 'start', gap: 8 }}>
            <Text size="sm">列表展示</Text>
            <SegmentedControl
              label="列表展示"
              name="display"
              value={display}
              onValueChange={(value) => {
                setDisplay(value);
                setMessage('');
              }}
              options={[
                { value: 'summary', label: '文章摘要' },
                { value: 'full', label: '显示全文' },
              ]}
            />
            <Text role="status" aria-label="当前偏好预览" size="sm" tone="muted">
              当前预览：{frequency === 'weekly' ? '每周一封来信' : '每月一封来信'}；列表
              {display === 'summary' ? '显示文章摘要' : '显示全文'}。
            </Text>
          </div>
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Button type="submit" loading={saving}>
              保存设置
            </Button>
            <Button
              variant="secondary"
              disabled={saving}
              onClick={() => {
                setNickname('小林');
                setEmail('hello@');
                setCategory('journal');
                setBio('');
                setFrequency('weekly');
                setDisplay('summary');
                setSubmitted(false);
                setMessage('');
              }}
            >
              重置
            </Button>
            <IconButton
              variant="secondary"
              aria-label={saved ? '取消收藏示例' : '收藏示例'}
              aria-pressed={saved}
              onClick={() => setSaved(!saved)}
            >
              <svg
                viewBox="0 0 20 20"
                fill={saved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 3.5h10v13l-5-3-5 3z" />
              </svg>
            </IconButton>
            <Button variant="secondary" disabled>
              发布
            </Button>
          </div>
        </form>
        <div role="status" style={{ minHeight: '3em' }}>
          {message ? (
            <Alert tone="success">{message}</Alert>
          ) : (
            <Text size="sm" tone="muted">
              {saving
                ? '正在模拟保存，约 1.2 秒。'
                : saved
                  ? '已收藏示例。设置尚未保存。'
                  : '只在当前页面演示，不发送邮箱或保存到服务器。'}
            </Text>
          )}
        </div>
        <section aria-label="按钮尺寸" style={{ display: 'grid', gap: 12 }}>
          <Heading level={4}>紧凑、常规、宽松</Heading>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
            <Button size="sm">36px · 紧凑</Button>
            <Button>44px · 常规</Button>
            <Button size="lg">52px · 宽松</Button>
          </div>
          <Text size="sm" tone="muted">
            紧凑尺寸用于空间有限的辅助操作；主要触屏操作使用常规或宽松尺寸。文字换行时控件允许增高。
          </Text>
        </section>
      </section>
    </ThemeProvider>
  );
}
