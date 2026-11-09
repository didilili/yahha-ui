import type {
  ChangeEventHandler,
  ComponentPropsWithRef,
  FocusEventHandler,
  ReactNode,
  RefCallback,
} from 'react';

export type FormValue = string | boolean | null;
export type FormValues = Record<string, FormValue>;
export type FormErrors<Values extends Record<keyof Values, FormValue> = FormValues> = Partial<
  Record<Extract<keyof Values, string>, string>
>;
export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange';
export type FormFieldNames<
  Values extends Record<keyof Values, FormValue>,
  Value extends FormValue,
> = Extract<
  { [Name in keyof Values]: Values[Name] extends Value ? Name : never }[keyof Values],
  string
>;

export interface FormBindingOptions {
  /** Render the error with FormError for controls without an error prop. @default control */
  errorPlacement?: 'control' | 'external';
}
export type FormErrorBinding<Options extends FormBindingOptions> = Options extends {
  errorPlacement: 'external';
}
  ? { 'aria-invalid'?: boolean; 'aria-describedby'?: string }
  : { error?: string };

export interface FormInputBinding {
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLElement>;
  ref: RefCallback<HTMLElement>;
}
export interface FormCheckedBinding {
  name: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLElement>;
  ref: RefCallback<HTMLElement>;
}
export interface FormChoiceBinding<Value extends string | null> {
  name: string;
  value: Value;
  onValueChange: (value: string | null) => void;
  onBlur: FocusEventHandler<HTMLElement>;
  ref: RefCallback<HTMLElement>;
}

export interface FormSubmitContext {
  /** Aborted when editing, reset or unmount makes this submission obsolete. */
  signal: AbortSignal;
  /** Native successful controls, including native omission of disabled and unchecked fields. */
  formData: FormData;
}

export interface FormState<Values extends Record<keyof Values, FormValue>> {
  values: Readonly<Values>;
  errors: FormErrors<Values>;
  isSubmitting: boolean;
  isValidating: boolean;
  submitError: string | null;
  input<
    Name extends FormFieldNames<Values, string | null>,
    Options extends FormBindingOptions = { errorPlacement: 'control' },
  >(
    name: Name,
    options?: Options,
  ): FormInputBinding & FormErrorBinding<Options>;
  checked<
    Name extends FormFieldNames<Values, boolean>,
    Options extends FormBindingOptions = { errorPlacement: 'control' },
  >(
    name: Name,
    options?: Options,
  ): FormCheckedBinding & FormErrorBinding<Options>;
  choice<
    Name extends FormFieldNames<Values, string | null>,
    Options extends FormBindingOptions = { errorPlacement: 'control' },
  >(
    name: Name,
    options?: Options,
  ): FormChoiceBinding<Extract<Values[Name], string | null>> & FormErrorBinding<Options>;
  setFieldValue<Name extends Extract<keyof Values, string>>(name: Name, value: Values[Name]): void;
  setErrors(errors: FormErrors<Values>): void;
  /** Restore the first initialValues snapshot and clear feedback. */
  reset(): void;
  /** Validate active, enabled fields. Null means superseded, failed, or locked by submission. */
  validate(): Promise<FormErrors<Values> | null>;
  /** Validate and submit. False means blocked, cancelled, superseded, or failed. */
  submit(): Promise<boolean>;
}

export interface FormProps<Values extends Record<keyof Values, FormValue>> extends Omit<
  ComponentPropsWithRef<'form'>,
  'children' | 'onSubmit' | 'action'
> {
  /** Flat primitive values. Captured once, including values of unmounted or disabled fields. */
  initialValues: Values;
  children: (form: FormState<Values>) => ReactNode;
  validate?: (values: Readonly<Values>) => FormErrors<Values> | Promise<FormErrors<Values>>;
  onSubmit?: (
    values: Readonly<Values>,
    context: FormSubmitContext,
  ) => void | FormErrors<Values> | Promise<void | FormErrors<Values>>;
  onSubmitError?: (error: unknown) => void;
  validationMode?: FormValidationMode;
  /** External field errors. Editing a field clears its external error. */
  errors?: FormErrors<Values>;
}
