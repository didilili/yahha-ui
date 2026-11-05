import { Select } from 'yahha-ui';

const collections = [
  { value: 'journal', title: 'Journal 日常手记', description: '散步、天气和日常的小事。' },
  { value: 'reading', title: 'Reading 阅读摘记', description: '读过的文章与想留下的句子。' },
  {
    value: 'archive',
    title: 'Archive 已归档',
    description: '已归档，暂不接收新手记。',
    disabled: true,
  },
];
const options = collections.map((collection) => ({
  value: collection.value,
  textValue: collection.title,
  disabled: collection.disabled,
  label: (
    <span>
      <span style={{ display: 'block' }}>{collection.title}</span>
      <span
        style={{
          display: 'block',
          fontSize: 'var(--yahha-font-size-sm, 12px)',
          fontWeight: 400,
          lineHeight: 'var(--yahha-leading-caption, 1.6)',
          color: 'var(--yahha-muted, #7a5c6d)',
        }}
      >
        {collection.description}
      </span>
    </span>
  ),
}));

export default function SelectCollection() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Select label="收藏夹" defaultValue="journal" placeholder="请选择收藏夹" options={options} />
    </div>
  );
}
