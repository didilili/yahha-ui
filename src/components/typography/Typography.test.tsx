import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Text, Heading, Link, Divider } from './Typography.js';

afterEach(cleanup);
describe('Typography', () => {
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
