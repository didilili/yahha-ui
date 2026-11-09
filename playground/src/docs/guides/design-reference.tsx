import { useState } from 'react';
import { Button, Checkbox, Heading, Text, Input, ThemeProvider, type ThemeTokens } from 'yahha-ui';
import styles from './design-reference.module.css';

const colors = [
  { token: 'ink', variable: '--yahha-ink', name: '主要文字', use: '正文、标题与操作名称' },
  { token: 'muted', variable: '--yahha-muted', name: '次要文字', use: '补充说明与辅助信息' },
  { token: 'surface', variable: '--yahha-surface', name: '内容纸面', use: '内容容器与浮层的背景' },
  {
    token: 'fieldBackground',
    variable: '--yahha-field-background',
    name: '字段纸面',
    use: '输入框的默认背景，错误和禁用另有状态背景',
  },
  { token: 'accent', variable: '--yahha-accent', name: '强调色', use: '主要操作与选中标记' },
  {
    token: 'accentHover',
    variable: '--yahha-accent-hover',
    name: '悬停强调色',
    use: '指针悬停时的强调背景',
  },
  { token: 'accentSoft', variable: '--yahha-accent-soft', name: '轻量强调', use: '较轻的强调背景' },
  {
    token: 'line',
    variable: '--yahha-line',
    name: '边框与底边',
    use: '按压底边；显式覆盖时也统一控件轮廓与轻纸边',
  },
  { token: 'focus', variable: '--yahha-focus', name: '键盘焦点', use: '键盘操作时的焦点轮廓' },
  {
    token: 'error',
    variable: '--yahha-error',
    name: '错误提示',
    use: '错误文字、字段边框与错误焦点',
  },
] as const satisfies readonly {
  token: keyof ThemeTokens;
  variable: `--yahha-${string}`;
  name: string;
  use: string;
}[];

export function DesignColorReference() {
  return (
    <ThemeProvider theme="pink" className={styles.reference}>
      <div className={styles.palette}>
        {colors.map(({ token, variable, name, use }) => (
          <figure className={styles.color} key={token}>
            <span
              className={styles.swatch}
              style={{ backgroundColor: `var(${variable})` }}
              aria-hidden="true"
            />
            <figcaption>
              <strong>{name}</strong> <code>{token}</code>
              <p className={styles.note}>{use}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </ThemeProvider>
  );
}

const headingScale = [
  { level: 1, size: 32 },
  { level: 2, size: 24 },
  { level: 3, size: 20 },
  { level: 4, size: 18 },
  { level: 5, size: 16 },
  { level: 6, size: 14 },
] as const;

const textScale = [
  { size: 'sm', pixels: 14, use: '辅助说明' },
  { size: 'md', pixels: 16, use: '正文' },
  { size: 'lg', pixels: 18, use: '较大正文' },
] as const;

const controlSizes = [
  { size: 'sm', height: 36, label: '紧凑按钮' },
  { size: 'md', height: 44, label: '常规按钮' },
  { size: 'lg', height: 52, label: '宽松按钮' },
] as const;

export function DesignTypographyReference() {
  return (
    <ThemeProvider theme="pink" className={styles.reference}>
      <div className={styles.typeRows}>
        {headingScale.map(({ level, size }) => (
          <div className={styles.typeRow} key={level}>
            <div className={styles.annotation}>
              <code>{`Heading level={${level}}`}</code>
              <span>{size}px</span>
            </div>
            {/* These are visual specimens, not headings in the document outline. */}
            <div aria-hidden="true">
              <Heading level={level}>把日常写进手记</Heading>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.typeRows}>
        {textScale.map(({ size, pixels, use }) => (
          <div className={styles.typeRow} key={size}>
            <div className={styles.annotation}>
              <code>{`Text size="${size}"`}</code>
              <span>
                {pixels}px · {use}
              </span>
            </div>
            <Text size={size}>记下今天读到的故事，留给下次打开手记时的自己。</Text>
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}

export function DesignControlReference() {
  return (
    <ThemeProvider theme="pink" className={styles.reference}>
      <div className={styles.controlSizes}>
        {controlSizes.map(({ size, height, label }) => (
          <div className={styles.controlSize} key={size}>
            <Button size={size}>{label}</Button>
            <code>{`size="${size}" · ${height}px`}</code>
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}

export function DesignStateReference() {
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState('kumi@');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <ThemeProvider theme="pink" className={styles.reference}>
      <div className={styles.states}>
        <div className={styles.state}>
          <h3 className={styles.stateTitle}>默认与键盘焦点</h3>
          <Button aria-pressed={saved} onClick={() => setSaved(!saved)}>
            收藏这篇手记
          </Button>
          <Text size="sm" role="status">
            {saved ? '已收藏。' : '尚未收藏。'}
          </Text>
          <Input label="手记标题" defaultValue="周末的散步" />
        </div>
        <div className={styles.state}>
          <h3 className={styles.stateTitle}>选中与禁用</h3>
          <Checkbox label="接收手记更新" defaultChecked />
          <Button disabled>暂不可保存</Button>
          <Input label="禁用字段" defaultValue="暂不可编辑" disabled />
        </div>
        <div className={styles.state}>
          <h3 className={styles.stateTitle}>只读</h3>
          <Input label="作者名称" defaultValue="库米" readOnly hint="可以选择和复制，不能修改。" />
        </div>
        <div className={styles.state}>
          <h3 className={styles.stateTitle}>错误与恢复</h3>
          <Input
            label="联系邮箱"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            error={validEmail ? undefined : '请填写完整邮箱，例如 kumi@example.com。'}
            hint="填写完整邮箱后，错误提示会消失。"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
