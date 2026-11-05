import { createRef, type ReactNode } from 'react';
import { IconButton, TextField, type TextFieldProps } from 'yahha-ui';

const trailing: ReactNode = (
  <IconButton type="button" aria-label="复制地址">
    ⧉
  </IconButton>
);
const parts: TextFieldProps['classNames'] = {
  trailing: 'field-action',
  inputWrapper: 'field-shell',
};

export const textField = (
  <TextField
    ref={createRef<HTMLInputElement>()}
    label="公开地址"
    name="address"
    form="profile"
    style={{ color: 'inherit' }}
    classNames={parts}
    trailing={trailing}
    readOnly
    value="https://example.com"
    onCompositionEnd={(event) => {
      event.currentTarget.select();
    }}
  />
);
