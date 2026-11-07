import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Progress } from './Progress.js';

afterEach(cleanup);

describe('Progress', () => {
  it('names the read-only progress and keeps the visible label and percentage', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>进度之前</button>
        <Progress label="图片上传" value={62} />
        <button>进度之后</button>
      </>,
    );
    const progress = screen.getByRole('progressbar', { name: '图片上传' });
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('100');
    expect(progress.getAttribute('aria-valuenow')).toBe('62');
    expect(progress.textContent).toContain('图片上传');
    expect(progress.textContent).toContain('62%');
    expect(progress.hasAttribute('aria-live')).toBe(false);
    expect(progress.hasAttribute('tabindex')).toBe(false);
    expect(progress.querySelector('svg')).toBeNull();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '进度之前' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '进度之后' }));
  });

  it.each([
    [-3, 100, 0, '0%', '0%'],
    [120, 100, 100, '100%', '100%'],
    [5, 8, 5, '62%', '62.5%'],
    [99.9, 100, 99.9, '99%', '99.9%'],
  ])(
    'normalizes value %s of %s for the same semantic and visual fraction',
    (value, max, now, text, fraction) => {
      render(<Progress label="上传进度" value={value} max={max} />);
      const progress = screen.getByRole('progressbar', { name: '上传进度' });
      expect(progress.getAttribute('aria-valuenow')).toBe(String(now));
      expect(progress.getAttribute('aria-valuemax')).toBe(String(max));
      expect(progress.textContent).toContain(text);
      expect(progress.style.getPropertyValue('--progress-value')).toBe(fraction);
    },
  );

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'falls back from invalid max %s to the documented percentage range',
    (max) => {
      render(<Progress label="导出进度" value={25} max={max} />);
      const progress = screen.getByRole('progressbar', { name: '导出进度' });
      expect(progress.getAttribute('aria-valuemax')).toBe('100');
      expect(progress.getAttribute('aria-valuenow')).toBe('25');
      expect(progress.textContent).toContain('25%');
    },
  );

  it.each([undefined, null, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'omits a made-up percentage for unknown value %s',
    (value) => {
      render(<Progress label="准备导出" value={value} appearance="bookmark" />);
      const progress = screen.getByRole('progressbar', { name: '准备导出' });
      expect(progress.hasAttribute('aria-valuenow')).toBe(false);
      expect(progress.getAttribute('data-state')).toBe('indeterminate');
      expect(progress.textContent).toContain('计算中');
      expect(progress.textContent).not.toContain('%');
      expect(progress.querySelector('svg')).toBeNull();
    },
  );

  it('keeps optional bookmark progress, true completion and unknown state synchronized', () => {
    const { rerender } = render(<Progress label="上传图片" value={99.9} appearance="bookmark" />);
    const progress = screen.getByRole('progressbar', { name: '上传图片' });
    const marker = progress.querySelector('svg');
    expect(marker).not.toBeNull();
    expect(marker?.getAttribute('aria-hidden')).toBe('true');
    expect(marker?.getAttribute('focusable')).toBe('false');
    expect(progress.getAttribute('data-state')).toBe('loading');
    expect(progress.textContent).toContain('99%');
    rerender(<Progress label="上传图片" value={100} appearance="bookmark" />);
    expect(screen.getByRole('progressbar', { name: '上传图片' })).toBe(progress);
    expect(progress.getAttribute('data-state')).toBe('complete');
    expect(progress.textContent).toContain('100%');
    rerender(<Progress label="上传图片" value={null} appearance="bookmark" />);
    expect(progress.querySelector('svg')).toBeNull();
    expect(progress.hasAttribute('aria-valuenow')).toBe(false);
    rerender(<Progress label="上传图片" value={0} appearance="bookmark" />);
    expect(progress.getAttribute('aria-valuenow')).toBe('0');
    expect(progress.getAttribute('data-state')).toBe('loading');
    expect(progress.querySelector('svg')).not.toBeNull();
  });

  it.each([32, null])('uses custom visible value text without changing progress %s', (value) => {
    render(<Progress label="上传文件" value={value} valueText="已处理 2 个文件" />);
    const progress = screen.getByRole('progressbar', { name: '上传文件' });
    expect(progress.getAttribute('aria-valuetext')).toBe('已处理 2 个文件');
    expect(progress.textContent).toContain('已处理 2 个文件');
    expect(progress.textContent).not.toContain('%');
    expect(progress.getAttribute('aria-valuenow')).toBe(value === null ? null : '32');
  });

  it('forwards root native attributes, style and ref and respects explicit naming', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <Progress
        ref={ref}
        id="upload"
        label="上传文件"
        value={20}
        aria-label="上传照片"
        className="my-progress"
        style={{ maxWidth: 320 }}
        dir="rtl"
        data-testid="custom-progress"
      />,
    );
    const progress = screen.getByRole('progressbar', { name: '上传照片' });
    expect(ref.current).toBe(progress);
    expect(progress.id).toBe('upload');
    expect(progress.classList.contains('my-progress')).toBe(true);
    expect(progress.style.maxWidth).toBe('320px');
    expect(progress.getAttribute('dir')).toBe('rtl');
    expect(progress.hasAttribute('label')).toBe(false);
    expect(progress.hasAttribute('value')).toBe(false);
    expect(progress.hasAttribute('max')).toBe(false);
    expect(progress.hasAttribute('appearance')).toBe(false);
    rerender(
      <>
        <span id="progress-name">整理相册</span>
        <Progress
          ref={ref}
          label="上传文件"
          value={20}
          aria-label="上传照片"
          aria-labelledby="progress-name"
        />
      </>,
    );
    expect(screen.getByRole('progressbar', { name: '整理相册' })).toBe(ref.current);
  });
});
