import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from './Avatar.js';

afterEach(cleanup);
describe('Avatar', () => {
  it('provides an anonymous name and a readable fallback for a blank author', () => {
    render(<Avatar name={' \t '} />);
    expect(screen.getByRole('img', { name: '匿名用户' }).textContent).toBe('?');
  });
  it('treats a whitespace source as a missing picture', () => {
    const { container } = render(<Avatar name="小林" src={' \n '} />);
    expect(screen.getByRole('img', { name: '小林' }).textContent).toBe('小林');
    expect(container.querySelector('img')).toBeNull();
  });
  it('preserves a readable name when a picture fails and recovers on a new source', () => {
    const { container, rerender } = render(<Avatar name="小八" src="bad.svg" />);
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('img', { name: '小八' }).textContent).toContain('小八');
    expect(container.querySelector('img')).toBe(null);
    rerender(<Avatar name="小八" src="new.svg" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('new.svg');
  });

  it.each([undefined, ' \n '])('retries a failed source after clearing it to %s', (src) => {
    const { container, rerender } = render(<Avatar name="小八" src="bad.svg" />);
    const failedImage = container.querySelector('img')!;
    fireEvent.error(failedImage);
    expect(container.querySelector('img')).toBeNull();

    rerender(<Avatar name="小八" src={src} />);
    expect(container.querySelector('img')).toBeNull();
    rerender(<Avatar name="小八" src="bad.svg" />);
    const image = container.querySelector('img');
    expect(image?.getAttribute('src')).toBe('bad.svg');
    expect(image).not.toBe(failedImage);
    expect(image?.hasAttribute('data-loaded')).toBe(false);
    fireEvent.load(image!);
    fireEvent.error(failedImage);
    fireEvent.load(failedImage);
    expect(container.querySelector('img')).toBe(image);
    expect(image?.hasAttribute('data-loaded')).toBe(true);
  });

  it('ignores events from a previous source after a new picture has loaded', () => {
    const { container, rerender } = render(<Avatar name="小八" src="old.svg" />);
    const oldImage = container.querySelector('img')!;
    rerender(<Avatar name="小八" src="new.svg" />);
    const newImage = container.querySelector('img')!;
    fireEvent.load(newImage);
    expect(newImage.hasAttribute('data-loaded')).toBe(true);

    fireEvent.error(oldImage);
    fireEvent.load(oldImage);
    expect(container.querySelector('img')).toBe(newImage);
    expect(newImage.getAttribute('src')).toBe('new.svg');
    expect(newImage.hasAttribute('data-loaded')).toBe(true);
  });
});
