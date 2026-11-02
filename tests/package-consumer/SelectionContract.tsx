import { useState } from 'react';
import {
  Checkbox,
  RadioGroup,
  SegmentedControl,
  Switch,
  type RadioGroupProps,
  type SegmentedControlProps,
} from 'yahha-ui';

type ExpectFalse<T extends false> = T;

/** Option-driven groups must reject children instead of silently discarding caller content. */
export type SelectionChildrenContract = [
  ExpectFalse<'children' extends keyof RadioGroupProps<string> ? true : false>,
  ExpectFalse<'children' extends keyof SegmentedControlProps<string> ? true : false>,
];

const options = [
  { value: 'first', label: 'First selection', description: 'First option detail' },
  { value: 'locked', label: 'Locked selection', disabled: true },
  { value: 'last', label: 'Last selection', description: 'Last option detail' },
];

export function SelectionContract({ idPrefix }: { idPrefix: string }) {
  const [radio, setRadio] = useState('');
  const [segment, setSegment] = useState('first');
  return (
    <div data-selection-contract style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Checkbox label="Selection checkbox" data-testid="selection-checkbox" defaultChecked />
      <Checkbox label="Mixed selection" data-testid="selection-mixed" indeterminate />
      <Checkbox
        label="Disabled selection"
        data-testid="selection-disabled"
        disabled
        defaultChecked
      />
      <Switch label="Selection switch" data-testid="selection-switch" defaultChecked />
      <Switch
        label="Disabled switch"
        data-testid="selection-switch-disabled"
        disabled
        defaultChecked
      />
      <p id={`${idPrefix}-selection-help`} style={{ margin: 0 }}>
        Additional selection context
      </p>
      <RadioGroup
        label="Selection radio group"
        data-testid="selection-radio"
        options={options}
        value={radio}
        onValueChange={setRadio}
        aria-describedby={`${idPrefix}-selection-help`}
        hint="Group selection hint"
        error={radio ? undefined : 'Choose one selection'}
        classNames={{
          legend: 'selection-radio-legend',
          hint: 'selection-radio-hint',
          error: 'selection-radio-error',
        }}
      />
      <RadioGroup
        label="Locked reading preference"
        data-testid="selection-radio-locked"
        options={options}
        value="locked"
        onValueChange={() => {}}
      />
      <SegmentedControl
        label="Selection segments"
        data-testid="selection-segments"
        aria-describedby={`${idPrefix}-selection-help`}
        options={options}
        value={segment}
        onValueChange={setSegment}
        classNames={{ options: 'selection-tray' }}
      />
      <Checkbox
        label={'订阅我喜欢的生活手记和阅读来信，长说明自然换行，方框仍与第一行对齐。'.repeat(3)}
        data-testid="selection-long"
        hint="你可以随时调整订阅内容。"
        classNames={{ text: 'selection-long-text', hint: 'selection-long-hint' }}
      />
      <Switch
        label={'在文章页面显示照片与阅读说明，长标题保持完整并自然换行。'.repeat(3)}
        data-testid="selection-switch-long"
        hint="关闭配图后仍然保留文章正文。"
        classNames={{ text: 'selection-switch-long-text', hint: 'selection-switch-long-hint' }}
      />
      <SegmentedControl
        label="Long reading scope"
        data-testid="selection-segments-long"
        options={[
          { value: 'first', label: '慢慢阅读全部生活手记与小小的读书记录' },
          { value: 'last', label: 'PersonalReadingJournalWithAnUnbrokenCategoryName'.repeat(2) },
        ]}
        value="first"
        onValueChange={() => {}}
      />
    </div>
  );
}
