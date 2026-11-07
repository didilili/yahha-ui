import { createRef } from 'react';
import { Progress, type ProgressProps } from 'yahha-ui';

const root = createRef<HTMLDivElement>();
const props: ProgressProps = {
  label: 'Reading progress',
  value: 2,
  max: 3,
  valueText: '2 / 3 read',
  appearance: 'bookmark',
  ref: root,
  dir: 'rtl',
  'aria-describedby': 'reading-help',
};

export function ProgressTypes() {
  return <Progress {...props} className="reading-progress" />;
}

// @ts-expect-error A progress indicator needs a visible task label.
const missingLabel: ProgressProps = { value: 20 };
// @ts-expect-error Progress has no interactive or animal appearance.
const invalidAppearance: ProgressProps = { label: 'Reading', appearance: 'animal' };
// @ts-expect-error The progress value must be a number or null.
const invalidValue: ProgressProps = { label: 'Reading', value: '20' };
// @ts-expect-error Progress is a read-only progressbar, not a selectable role.
const invalidRole: ProgressProps = { label: 'Reading', role: 'button' };
// @ts-expect-error Managed progress values cannot conflict with the visual value.
const conflictingValue: ProgressProps = { label: 'Reading', 'aria-valuenow': 50 };
// @ts-expect-error Progress cannot receive interactive children.
const children: ProgressProps = { label: 'Reading', children: 'Read' };
void [missingLabel, invalidAppearance, invalidValue, invalidRole, conflictingValue, children];
