import { createRef } from 'react';
import {
  Checkbox,
  Form,
  FormError,
  Input,
  RadioGroup,
  SegmentedControl,
  Select,
  Switch,
  Textarea,
  type FormErrors,
  type FormProps,
  type FormState,
  type FormSubmitContext,
} from 'yahha-ui';

type Values = {
  nickname: string;
  biography: string;
  category: string | null;
  consent: boolean;
  frequency: string;
  notices: boolean;
  layout: string;
};

interface ProfileValues {
  nickname: string;
  optedIn: boolean;
  category: string | null;
}

const interfaceProps: FormProps<ProfileValues> = {
  initialValues: { nickname: '', optedIn: false, category: null },
  validate: (values) => (values.nickname.trim() ? {} : { nickname: 'Enter a nickname.' }),
  children: (form) => (
    <>
      <Input {...form.input('nickname')} label="Interface nickname" />
      <Checkbox {...form.checked('optedIn')} label="Interface opt-in" />
      <Select {...form.choice('category')} label="Interface category" options={[]} />
    </>
  ),
};

export const interfaceForm = <Form<ProfileValues> {...interfaceProps} />;

// @ts-expect-error Nested objects are outside the flat scalar value contract.
export type NestedValues = FormProps<{ profile: { nickname: string } }>;
// @ts-expect-error Arrays are outside the flat scalar value contract.
export type ArrayValues = FormProps<{ topics: string[] }>;
// @ts-expect-error Number values are outside the supported string/boolean/null contract.
export type NumberValues = FormProps<{ age: number }>;

const initialValues: Values = {
  nickname: '',
  biography: '',
  category: null,
  consent: false,
  frequency: 'weekly',
  notices: false,
  layout: 'list',
};

const errors: FormErrors<Values> = { nickname: 'Please enter a nickname.' };
const validate: FormProps<Values>['validate'] = async (values) =>
  values.nickname.trim() ? {} : errors;
const submit: FormProps<Values>['onSubmit'] = async (values, context: FormSubmitContext) => {
  context.signal.throwIfAborted();
  context.formData.get('nickname');
  if (!values.consent) return { consent: 'Consent is required.' };
};

export function verifyFormActions(form: FormState<Values>) {
  form.setFieldValue('nickname', 'Reader');
  form.setFieldValue('consent', true);
  form.setFieldValue('category', null);
  form.setErrors({ category: 'Choose a collection.' });
  const validation: Promise<FormErrors<Values> | null> = form.validate();
  const submission: Promise<boolean> = form.submit();
  void validation;
  void submission;
  // @ts-expect-error Field names are derived from initialValues.
  form.input('missing');
  // @ts-expect-error Boolean state cannot use a text binding.
  form.input('consent');
  // @ts-expect-error Text state cannot use a checked binding.
  form.checked('nickname');
  // @ts-expect-error Boolean state cannot use a choice binding.
  form.choice('notices');
  // @ts-expect-error Field updates retain each field's value type.
  form.setFieldValue('consent', 'yes');
  // @ts-expect-error Unknown fields cannot receive errors.
  form.setErrors({ missing: 'Unknown field.' });
  // @ts-expect-error Render values are a read-only snapshot.
  form.values.nickname = 'Mutation';
}

function Fields(form: FormState<Values>) {
  return (
    <>
      <Input {...form.input('nickname')} label="Nickname" />
      <Textarea {...form.input('biography')} label="Biography" />
      <Checkbox {...form.checked('consent')} label="Consent" />
      <Select {...form.choice('category')} label="Category" options={[]} />
      <RadioGroup {...form.choice('frequency')} label="Frequency" options={[]} />
      <Switch {...form.checked('notices', { errorPlacement: 'external' })} label="Notices" />
      <FormError name="notices" />
      <SegmentedControl
        {...form.choice('layout', { errorPlacement: 'external' })}
        label="Layout"
        options={[]}
      />
      <FormError name="layout" />
    </>
  );
}

export const typedForm = (
  <Form
    initialValues={initialValues}
    validate={validate}
    onSubmit={submit}
    errors={errors}
    validationMode="onBlur"
    ref={createRef<HTMLFormElement>()}
  >
    {Fields}
  </Form>
);
