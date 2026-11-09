import { createRef, type ReactNode } from 'react';
import { IconButton, Input, TextField, type InputProps, type TextFieldProps } from 'yahha-ui';

type Equal<Left, Right> =
  (<Type>() => Type extends Left ? 1 : 2) extends <Type>() => Type extends Right ? 1 : 2
    ? true
    : false;
type Assert<Condition extends true> = Condition;
export type InputCompatibility = Assert<Equal<InputProps, TextFieldProps>>;

const trailing: ReactNode = (
  <IconButton type="button" aria-label="复制地址">
    ⧉
  </IconButton>
);
const parts: TextFieldProps['classNames'] = {
  trailing: 'field-action',
  inputWrapper: 'field-shell',
};

const inputProps: InputProps = {
  ref: createRef<HTMLInputElement>(),
  label: '公开地址',
  name: 'address',
  form: 'profile',
  classNames: parts,
  trailing,
  readOnly: true,
  value: 'https://example.com',
  onCompositionEnd: (event) => event.currentTarget.select(),
};
const compatibleProps: TextFieldProps = inputProps;
export const input = <Input {...compatibleProps} />;
export const compatibleTextField = <TextField {...inputProps} />;

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
