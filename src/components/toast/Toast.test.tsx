import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast.js';

afterEach(cleanup);

describe('Toast', () => {
  it('lets the consumer dismiss a status message', async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          title="保存好了"
          description="可以继续编辑。"
        />
      );
    }
    render(<Example />);
    expect(screen.getByRole('status').textContent).toContain('保存好了');
    await user.click(screen.getByRole('button', { name: '关闭提示' }));
    expect(screen.queryByRole('status')).toBeNull();
  });
});
