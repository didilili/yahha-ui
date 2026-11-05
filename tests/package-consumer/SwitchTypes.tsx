import { createRef } from 'react';
import { Switch, type SwitchProps } from 'yahha-ui';

const props: SwitchProps = {
  label: '启用通知',
  loading: true,
  name: 'notifications',
  value: 'enabled',
  defaultChecked: true,
};

export const pendingSwitch = (
  <Switch
    {...props}
    ref={createRef<HTMLInputElement>()}
    aria-describedby="notification-help"
    classNames={{ input: 'notification-input' }}
    onKeyDownCapture={(event) => {
      event.currentTarget.dataset.lastKey = event.key;
    }}
  />
);

// @ts-expect-error Loading is a boolean, not a status string.
export const invalidLoading = <Switch label="启用通知" loading="pending" />;
