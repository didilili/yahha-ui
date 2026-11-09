import { Accordion } from 'yahha-ui';

export default function AccordionDisabled() {
  return (
    <Accordion
      items={[
        {
          value: 'rain',
          title: '雨天安排（确认中）',
          content: <p>确认后会补充当天的集合安排。</p>,
          disabled: true,
        },
      ]}
    />
  );
}
