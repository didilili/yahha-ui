import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Text, Heading, Link, Divider } from './Typography.js';

afterEach(cleanup);
describe('Typography', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    'changes heading decoration without changing level %s, text or native ref',
    (level) => {
      const ref = createRef<HTMLHeadingElement>();
      const { rerender } = render(
        <Heading level={level} ref={ref} id="chapter">
          章节标题
        </Heading>,
      );
      const heading = screen.getByRole('heading', { level, name: '章节标题' });
      expect(heading.getAttribute('data-decoration')).toBe('none');
      rerender(
        <Heading level={level} decoration="underline" ref={ref} id="chapter">
          章节标题
        </Heading>,
      );
      expect(ref.current).toBe(heading);
      expect(screen.getByRole('heading', { level, name: '章节标题' })).toBe(heading);
      expect(heading.getAttribute('data-decoration')).toBe('underline');
      expect(heading.hasAttribute('decoration')).toBe(false);
      expect(heading.id).toBe('chapter');
    },
  );

  it('preserves heading hierarchy and native text semantics', () => {
    render(
      <>
        <Heading level={1}>阅读手记</Heading>
        <Text>慢慢读。</Text>
        <Divider aria-label="下一节" />
      </>,
    );
    expect(screen.getByRole('heading', { level: 1, name: '阅读手记' }).tagName).toBe('H1');
    expect(screen.getByText('慢慢读。').tagName).toBe('P');
    expect(screen.getByRole('separator', { name: '下一节' })).toBeTruthy();
  });
  it('keeps external links safe while preserving caller rel and native ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="https://example.com" target="_blank" rel="author">
        作者主页
      </Link>,
    );
    expect(ref.current).toBe(screen.getByRole('link', { name: '作者主页' }));
    expect(ref.current?.rel.split(' ')).toEqual(
      expect.arrayContaining(['author', 'noopener', 'noreferrer']),
    );
  });
});
