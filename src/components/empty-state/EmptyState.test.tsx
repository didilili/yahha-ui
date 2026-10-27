import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { EmptyState } from './EmptyState.js';

afterEach(cleanup);

describe('EmptyState', () => {
  it('keeps numeric zero artwork decorative and numeric description in its paragraph', () => {
    render(<EmptyState title="没有记录" description={0} illustration={0} />);

    expect(screen.getByText('0', { selector: '[aria-hidden="true"]' })).toBeTruthy();
    expect(screen.getByText('0', { selector: 'p' })).toBeTruthy();
  });

  it('hides decorative artwork while exposing the content and a working keyboard action', async () => {
    const user = userEvent.setup();
    function Example() {
      const [created, setCreated] = useState(false);
      return created ? (
        <p>第一条心愿已经创建。</p>
      ) : (
        <EmptyState
          title="还没有心愿"
          description="从一件想做的小事开始。"
          illustration={<img src="/decoration.png" alt="角色在等待" />}
          action={<Button onClick={() => setCreated(true)}>写下第一条</Button>}
        />
      );
    }

    render(<Example />);
    expect(screen.getByRole('heading', { level: 3, name: '还没有心愿' })).toBeTruthy();
    expect(screen.getByText('从一件想做的小事开始。')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('img', { hidden: true }).getAttribute('alt')).toBe('角色在等待');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '写下第一条' }));
    await user.keyboard('{Enter}');
    expect(screen.getByText('第一条心愿已经创建。')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '还没有心愿' })).toBeNull();
  });
});
