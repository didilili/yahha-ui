import {
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type RefCallback,
} from 'react';
import { flushSync } from 'react-dom';
import { FormContext } from './form-context.js';
import type { FormBindingOptions, FormErrors, FormProps, FormState, FormValue } from './types.js';

interface FieldRegistration {
  element: HTMLElement | null;
  ref: RefCallback<HTMLElement>;
}
interface NativeConstraint {
  name: string;
  message: string;
  target: HTMLElement | null;
}
type NativeControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function activeField(element: HTMLElement | null): element is HTMLElement {
  return !!element?.isConnected && !element.matches(':disabled');
}

function focusTarget(element: HTMLElement | null): HTMLElement | null {
  if (!activeField(element)) return null;
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    const style = getComputedStyle(ancestor);
    if (
      ancestor.hidden ||
      ancestor.inert ||
      style.display === 'none' ||
      style.visibility === 'hidden'
    ) {
      return null;
    }
  }
  if (element instanceof HTMLFieldSetElement) {
    return (
      Array.from(element.querySelectorAll<HTMLInputElement>('input[type="radio"]')).find(
        (radio) => !radio.matches(':disabled'),
      ) ?? null
    );
  }
  return element;
}

function submitsForm(target: EventTarget | null, form: HTMLFormElement | null): boolean {
  if (!form || !(target instanceof HTMLButtonElement || target instanceof HTMLInputElement)) {
    return false;
  }
  return (
    target.form === form &&
    !target.matches(':disabled') &&
    (target.type === 'submit' || (target instanceof HTMLInputElement && target.type === 'image'))
  );
}

function firstInDocument(elements: HTMLElement[]): HTMLElement | undefined {
  return elements.reduce<HTMLElement | undefined>((first, element) => {
    if (!first) return element;
    const position = first.compareDocumentPosition(element);
    if (
      !(position & Node.DOCUMENT_POSITION_DISCONNECTED) &&
      position & Node.DOCUMENT_POSITION_PRECEDING
    ) {
      return element;
    }
    return first;
  }, undefined);
}

function sameErrors(
  first: Record<string, string | undefined>,
  second: Record<string, string | undefined>,
) {
  const keys = Object.keys(first);
  return (
    keys.length === Object.keys(second).length && keys.every((name) => first[name] === second[name])
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : '表单操作失败，请重试。';
}

/** Flat primitive field management with explicit bindings to existing controls. */
export function Form<Values extends Record<keyof Values, FormValue>>({
  initialValues,
  children,
  validate: validateValues,
  onSubmit,
  onSubmitError,
  validationMode = 'onSubmit',
  errors: externalErrors,
  noValidate = false,
  onReset,
  ref,
  ...props
}: FormProps<Values>) {
  const [initial] = useState<Values>(() => ({ ...initialValues }));
  const valuesRef = useRef<Values>(initial);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrorsState] = useState<FormErrors<Values>>({});
  const [serverErrors, setServerErrors] = useState<FormErrors<Values>>(
    () => ({ ...externalErrors }) as FormErrors<Values>,
  );
  const [visibleErrors, setVisibleErrors] = useState<FormErrors<Values>>(() => Object.create(null));
  const serverErrorsRef = useRef(serverErrors);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isValidating, setValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState(0);
  // Entries cache stable ref callbacks; a field becomes active only when its DOM ref attaches.
  const [fields] = useState(() => new Map<string, FieldRegistration>());
  const formElement = useRef<HTMLFormElement>(null);
  const alive = useRef(true);
  const version = useRef(0);
  const locked = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const submitted = useRef(false);
  const autoValidation = useRef(false);
  const pendingFocus = useRef<{ version: number; elements: HTMLElement[] } | null>(null);
  const formId = useId();
  const latest = useRef({ validateValues, onSubmit, onSubmitError, validationMode, noValidate });
  useLayoutEffect(() => {
    latest.current = { validateValues, onSubmit, onSubmitError, validationMode, noValidate };
  }, [validateValues, onSubmit, onSubmitError, validationMode, noValidate]);
  useImperativeHandle(ref, () => formElement.current!, []);

  function activeErrors(next: FormErrors<Values>): FormErrors<Values> {
    return Object.assign(
      Object.create(null),
      Object.fromEntries(
        Object.entries(next).filter(
          ([name, message]) =>
            typeof message === 'string' &&
            message &&
            activeField(fields.get(name)?.element ?? null),
        ),
      ),
    ) as FormErrors<Values>;
  }

  function invalidate() {
    version.current += 1;
    controller.current?.abort();
    controller.current = null;
    locked.current = false;
    autoValidation.current = false;
    pendingFocus.current = null;
    if (alive.current) {
      setSubmitting(false);
      setValidating(false);
    }
  }

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      version.current += 1;
      controller.current?.abort();
      locked.current = false;
    };
  }, []);

  useEffect(() => {
    const next = { ...externalErrors } as FormErrors<Values>;
    serverErrorsRef.current = next;
    // oxlint-disable-next-line react/set-state-in-effect -- Synchronize a new external error result while allowing local edits to clear it.
    setServerErrors(next);
  }, [externalErrors]);

  function notifyFailure(error: unknown) {
    setSubmitError(errorMessage(error));
    try {
      latest.current.onSubmitError?.(error);
    } catch (notificationError) {
      setSubmitError(errorMessage(notificationError));
    }
  }

  function nativeConstraints(skipNative: boolean): NativeConstraint[] {
    const element = formElement.current;
    if (!element || skipNative) return [];
    // checkValidity dispatches native invalid events without showing browser bubbles.
    HTMLFormElement.prototype.checkValidity.call(element);
    const controls = Reflect.get(
      HTMLFormElement.prototype,
      'elements',
      element,
    ) as HTMLFormControlsCollection;
    return Array.from(controls).flatMap((control) => {
      if (!(
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
      ))
        return [];
      if (!control.willValidate || control.validity.valid) return [];
      const registered = fields.get(control.name)?.element;
      if (registered && !activeField(registered)) return [];
      const target = focusTarget(registered ?? control);
      return [{ name: control.name, message: control.validationMessage, target }];
    });
  }

  async function runValidation(attempt: number, skipNative = latest.current.noValidate) {
    const snapshot = { ...valuesRef.current };
    setValidating(true);
    try {
      const custom = await latest.current.validateValues?.(snapshot);
      if (!alive.current || attempt !== version.current) return null;
      // Restore consumer busy UI before reading enabled fields and native submission data.
      flushSync(() => setValidating(false));
      if (!alive.current || attempt !== version.current) return null;
      // Read live constraints after async validation: values or disabled DOM state may have committed.
      const native = nativeConstraints(skipNative);
      if (!alive.current || attempt !== version.current) return null;
      const nativeErrors = Object.fromEntries(native.map(({ name, message }) => [name, message]));
      const local = activeErrors({ ...nativeErrors, ...custom } as FormErrors<Values>);
      const next = activeErrors({ ...serverErrorsRef.current, ...local });
      setErrorsState(local);
      return { errors: next, native, snapshot };
    } catch (error) {
      if (alive.current && attempt === version.current) notifyFailure(error);
      return null;
    } finally {
      if (alive.current && attempt === version.current) setValidating(false);
    }
  }

  async function validate(): Promise<FormErrors<Values> | null> {
    if (locked.current) return null;
    version.current += 1;
    const result = await runValidation(version.current);
    return result?.errors ?? null;
  }

  async function submit(submitter?: HTMLElement | null): Promise<boolean> {
    if (locked.current || !alive.current || !formElement.current) return false;
    locked.current = true;
    version.current += 1;
    const attempt = version.current;
    const abortController = new AbortController();
    controller.current = abortController;
    submitted.current = true;
    setSubmitError(null);
    const skipNative =
      latest.current.noValidate ||
      ((submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) &&
        submitter.formNoValidate);
    try {
      const result = await runValidation(attempt, skipNative);
      if (!result || attempt !== version.current || !alive.current) return false;
      const blocked = Object.keys(result.errors).length > 0 || result.native.length > 0;
      if (blocked) {
        pendingFocus.current = {
          version: attempt,
          elements: [
            ...Object.keys(result.errors)
              .map((name) => focusTarget(fields.get(name)?.element ?? null))
              .filter((target): target is HTMLElement => target !== null),
            ...result.native
              .map(({ target }) => target)
              .filter((target): target is HTMLElement => target !== null),
          ],
        };
        // Commit the focus request even when errors come exclusively from the external bucket.
        setRegistrations((count) => count + 1);
        return false;
      }
      const nativeData = submitter
        ? new FormData(formElement.current, submitter)
        : new FormData(formElement.current);
      setSubmitting(true);
      const submittedErrors = await latest.current.onSubmit?.(result.snapshot, {
        signal: abortController.signal,
        formData: nativeData,
      });
      if (!alive.current || attempt !== version.current) return false;
      // Restore consumer busy UI before checking disabled fields and resolving focus targets.
      // This runs after await, while the submit lock still prevents re-entry.
      flushSync(() => setSubmitting(false));
      if (!alive.current || attempt !== version.current) return false;
      const nextServer = { ...submittedErrors } as FormErrors<Values>;
      serverErrorsRef.current = nextServer;
      setServerErrors(nextServer);
      setErrorsState({});
      const next = activeErrors(nextServer);
      if (Object.keys(next).length) {
        pendingFocus.current = {
          version: attempt,
          elements: Object.keys(next)
            .map((name) => focusTarget(fields.get(name)?.element ?? null))
            .filter((target): target is HTMLElement => target !== null),
        };
        return false;
      }
      return true;
    } catch (error) {
      if (alive.current && attempt === version.current) notifyFailure(error);
      return false;
    } finally {
      if (alive.current && attempt === version.current) {
        locked.current = false;
        setSubmitting(false);
      }
    }
  }

  function setFieldValue(name: string, value: FormValue) {
    if (!Object.hasOwn(initial, name)) throw new Error(`Unknown Form field: ${name}`);
    if (Object.is(valuesRef.current[name as Extract<keyof Values, string>], value)) return;
    invalidate();
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    setSubmitError(null);
    setErrorsState(
      (previous) =>
        Object.fromEntries(
          Object.entries(previous).filter(([key]) => key !== name),
        ) as FormErrors<Values>,
    );
    const nextServer = Object.fromEntries(
      Object.entries(serverErrorsRef.current).filter(([key]) => key !== name),
    ) as FormErrors<Values>;
    serverErrorsRef.current = nextServer;
    setServerErrors(nextServer);
    autoValidation.current =
      latest.current.validationMode === 'onChange' ||
      (latest.current.validationMode === 'onSubmit' && submitted.current);
  }

  function registration(name: string): FieldRegistration {
    if (!Object.hasOwn(initial, name)) throw new Error(`Unknown Form field: ${name}`);
    let field = fields.get(name);
    if (!field) {
      field = {
        element: null,
        ref: (element) => {
          const current = fields.get(name)!;
          if (current.element === element) return;
          current.element = element;
          if (alive.current) setRegistrations((count) => count + 1);
        },
      };
      fields.set(name, field);
    }
    return field;
  }

  function commonBinding(name: string, options?: FormBindingOptions) {
    const entry = registration(name);
    const error = visibleErrors[name as Extract<keyof Values, string>];
    return {
      name,
      ref: entry.ref,
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        const element = event.currentTarget;
        // Submission owns validation when focus moves to its submitter. Rendering a blur error
        // during pointer-down could move that button before pointer-up and cancel the click.
        if (submitsForm(event.relatedTarget, formElement.current)) return;
        if (element.contains(event.relatedTarget as Node | null)) return;
        // Composite controls can pass through focus guards while their popup closes.
        // Check the settled focus in this document before treating that as leaving the field.
        queueMicrotask(() => {
          if (!alive.current || entry.element !== element) return;
          const active = element.ownerDocument.activeElement;
          if (submitsForm(active, formElement.current)) return;
          const popupId = element.getAttribute('aria-controls');
          const popup = popupId ? element.ownerDocument.getElementById(popupId) : null;
          const focusInsidePopup =
            popup &&
            active &&
            (popup.contains(active) ||
              (active !== element.ownerDocument.body &&
                active !== element.ownerDocument.documentElement &&
                active.contains(popup)));
          if (element.contains(active) || focusInsidePopup) return;
          if (latest.current.validationMode === 'onBlur') void validate();
        });
      },
      ...(options?.errorPlacement === 'external'
        ? {
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${formId}-${encodeURIComponent(name)}-error` : undefined,
          }
        : { error }),
    };
  }

  function resetValues() {
    invalidate();
    valuesRef.current = { ...initial };
    setValues(valuesRef.current);
    setErrorsState({});
    serverErrorsRef.current = {};
    setServerErrors({});
    submitted.current = false;
    setSubmitError(null);
  }

  const synchronizeFields = useEffectEvent(() => {
    const afterCommit = activeErrors({ ...serverErrorsRef.current, ...errors });
    if (!sameErrors(visibleErrors, afterCommit)) {
      setVisibleErrors(afterCommit);
      return;
    }
    const request = pendingFocus.current;
    if (request && request.version === version.current) {
      pendingFocus.current = null;
      firstInDocument(request.elements.filter((element) => focusTarget(element)))?.focus();
    }
    if (autoValidation.current) {
      autoValidation.current = false;
      void validate();
    }
  });
  useLayoutEffect(() => {
    synchronizeFields();
  }, [errors, serverErrors, visibleErrors, values, registrations, children]);

  const state: FormState<Values> = {
    values,
    errors: visibleErrors,
    isSubmitting,
    isValidating,
    submitError,
    input: ((name: string, options?: FormBindingOptions) => ({
      ...commonBinding(name, options),
      value: values[name as Extract<keyof Values, string>] ?? '',
      onChange: (event: React.ChangeEvent<NativeControl>) =>
        setFieldValue(name, event.currentTarget.value),
    })) as FormState<Values>['input'],
    checked: ((name: string, options?: FormBindingOptions) => ({
      ...commonBinding(name, options),
      checked: values[name as Extract<keyof Values, string>],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setFieldValue(name, event.currentTarget.checked),
    })) as FormState<Values>['checked'],
    choice: ((name: string, options?: FormBindingOptions) => ({
      ...commonBinding(name, options),
      value: values[name as Extract<keyof Values, string>],
      onValueChange: (value: string | null) => setFieldValue(name, value),
    })) as FormState<Values>['choice'],
    setFieldValue,
    setErrors: (next) => {
      invalidate();
      const nextServer = { ...next };
      serverErrorsRef.current = nextServer;
      setServerErrors(nextServer);
      setErrorsState({});
    },
    reset: () => {
      const element = formElement.current;
      if (element) HTMLFormElement.prototype.reset.call(element);
    },
    validate,
    submit: () => submit(),
  };

  return (
    <FormContext.Provider
      value={{
        errors: visibleErrors,
        errorId: (name) => `${formId}-${encodeURIComponent(name)}-error`,
      }}
    >
      <form
        {...props}
        ref={formElement}
        noValidate
        aria-busy={isSubmitting || isValidating || props['aria-busy']}
        onSubmit={(event) => {
          event.preventDefault();
          void submit((event.nativeEvent as SubmitEvent).submitter);
        }}
        onReset={(event) => {
          onReset?.(event);
          if (!event.defaultPrevented) resetValues();
        }}
      >
        {/* oxlint-disable-next-line react/refs -- The render function receives stable ref callbacks and deferred event handlers; DOM refs are read only by events and layout synchronization. */}
        {children(state)}
      </form>
    </FormContext.Provider>
  );
}
