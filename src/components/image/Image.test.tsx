import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Image } from './Image.js';

afterEach(cleanup);
describe('Image', () => {
  const invalidSource = 'data:image/png;base64,bm90IGEgcG5n';

  for (const source of [undefined, invalidSource]) {
    const failure = source ? 'an error event' : 'a missing source';

    it(`keeps a hidden image and its failure fallback hidden after ${failure}`, () => {
      const ref = createRef<HTMLImageElement>();
      const onError = vi.fn();
      const { rerender } = render(
        <Image ref={ref} hidden src={source} alt="隐藏的封面" onError={onError} />,
      );
      if (source) fireEvent.error(ref.current!);

      expect(ref.current?.parentElement?.dataset.status).toBe('error');
      expect(ref.current?.parentElement?.hidden).toBe(true);
      expect(screen.queryByRole('img', { name: '隐藏的封面' })).toBeNull();
      expect(onError).toHaveBeenCalledTimes(source ? 1 : 0);

      rerender(<Image ref={ref} hidden={false} src={source} alt="隐藏的封面" />);
      expect(ref.current?.parentElement?.hidden).toBe(false);
      expect(screen.getAllByRole('img', { name: '隐藏的封面' })).toHaveLength(1);
    });

    it(`keeps an aria-hidden image fallback out of the accessibility tree after ${failure}`, () => {
      const ref = createRef<HTMLImageElement>();
      const { rerender } = render(
        <Image ref={ref} aria-hidden="true" src={source} alt="装饰封面" />,
      );
      if (source) fireEvent.error(ref.current!);

      expect(ref.current?.parentElement?.dataset.status).toBe('error');
      expect(screen.queryByRole('img', { name: '装饰封面' })).toBeNull();

      rerender(<Image ref={ref} aria-hidden={false} src={source} alt="装饰封面" />);
      expect(screen.getAllByRole('img', { name: '装饰封面' })).toHaveLength(1);
    });

    it(`keeps an empty-alt fallback decorative even with aria-hidden=false after ${failure}`, () => {
      const ref = createRef<HTMLImageElement>();
      render(<Image ref={ref} aria-hidden={false} src={source} alt="" fallback="封面暂缺" />);
      if (source) fireEvent.error(ref.current!);

      expect(ref.current?.parentElement?.dataset.status).toBe('error');
      expect(screen.queryByRole('img')).toBeNull();
      expect(screen.getByText('封面暂缺').closest('[aria-hidden="true"]')).toBeTruthy();
    });

    it(`keeps a whitespace-alt fallback out of the accessibility tree after ${failure}`, () => {
      const ref = createRef<HTMLImageElement>();
      render(<Image ref={ref} src={source} alt={' \t '} aspectRatio="2 / 1" fallback="封面暂缺" />);
      if (source) fireEvent.error(ref.current!);

      expect(ref.current?.getAttribute('alt')).toBe(' \t ');
      expect(screen.queryByRole('img')).toBeNull();
      expect(screen.getByText('封面暂缺').closest('[tabindex]')?.getAttribute('tabindex')).toBe(
        '-1',
      );
    });
  }

  it('preserves native image visibility set by the caller', () => {
    const ref = createRef<HTMLImageElement>();
    const { rerender } = render(<Image ref={ref} hidden src="one.svg" alt="隐藏的封面" />);
    fireEvent.load(ref.current!);
    expect(screen.queryByRole('img', { name: '隐藏的封面' })).toBeNull();
    rerender(<Image ref={ref} src="one.svg" alt="隐藏的封面" />);
    expect(screen.getByRole('img', { name: '隐藏的封面' })).toBe(ref.current);
  });
  it('shows the failure fallback when no image source is available', () => {
    render(<Image alt="尚未上传的封面" />);
    expect(screen.getByText('图片暂时无法显示')).toBeTruthy();
    expect(screen.getAllByRole('img', { name: '尚未上传的封面' })).toHaveLength(1);
  });
  it('keeps the native image/ref and forwards load events', () => {
    const onLoad = vi.fn();
    const ref = createRef<HTMLImageElement>();
    render(
      <Image ref={ref} src="one.svg" alt="散步时的天空" onLoad={onLoad} width={300} height={200} />,
    );
    fireEvent.load(ref.current!);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(screen.getByRole('img', { name: '散步时的天空' })).toBe(ref.current);
    expect(ref.current?.getAttribute('width')).toBe('300');
  });
  it('provides an accessible failure fallback and retries when source changes', () => {
    const onError = vi.fn();
    const { rerender } = render(
      <Image src="bad.svg" alt="散步时的天空" onError={onError} fallback="图片暂不可用" />,
    );
    fireEvent.error(screen.getByRole('img', { name: '散步时的天空' }));
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByText('图片暂不可用')).toBeTruthy();
    expect(screen.getAllByRole('img', { name: '散步时的天空' }).length).toBe(1);
    rerender(<Image src="next.svg" alt="散步时的天空" fallback="图片暂不可用" />);
    expect(screen.queryByText('图片暂不可用')).toBe(null);
    expect(screen.getByRole('img', { name: '散步时的天空' }).getAttribute('src')).toBe('next.svg');
  });

  it.each([{ src: 'retry.svg' }, { srcSet: 'retry.svg 1x' }])(
    'retries the same failed resource after its source is cleared: %j',
    (source) => {
      const ref = createRef<HTMLImageElement>();
      const { rerender } = render(<Image ref={ref} {...source} alt="重新加载的封面" />);
      fireEvent.error(ref.current!);
      expect(ref.current?.hidden).toBe(true);
      expect(screen.getByText('图片暂时无法显示')).toBeTruthy();

      rerender(<Image ref={ref} alt="重新加载的封面" />);
      expect(screen.getByText('图片暂时无法显示')).toBeTruthy();
      rerender(<Image ref={ref} {...source} alt="重新加载的封面" />);

      expect(ref.current?.hidden).toBe(false);
      expect(ref.current?.parentElement?.dataset.status).toBe('loading');
      expect(screen.queryByText('图片暂时无法显示')).toBeNull();
      fireEvent.load(ref.current!);
      expect(ref.current?.parentElement?.dataset.status).toBe('loaded');
      expect(screen.getAllByRole('img', { name: '重新加载的封面' })).toHaveLength(1);
    },
  );
});
