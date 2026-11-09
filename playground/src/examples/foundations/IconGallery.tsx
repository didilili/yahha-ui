import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
  ErrorIcon,
  ExternalLinkIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SuccessIcon,
  Text,
  TrashIcon,
  WarningIcon,
} from 'yahha-ui';

const icons = [
  { component: SearchIcon, name: 'SearchIcon', label: '搜索' },
  { component: CloseIcon, name: 'CloseIcon', label: '关闭' },
  { component: BookmarkIcon, name: 'BookmarkIcon', label: '收藏' },
  { component: CopyIcon, name: 'CopyIcon', label: '复制' },
  { component: CheckIcon, name: 'CheckIcon', label: '完成' },
  { component: PlusIcon, name: 'PlusIcon', label: '新增' },
  { component: EditIcon, name: 'EditIcon', label: '编辑' },
  { component: TrashIcon, name: 'TrashIcon', label: '删除' },
  { component: ArrowLeftIcon, name: 'ArrowLeftIcon', label: '上一页' },
  { component: ArrowRightIcon, name: 'ArrowRightIcon', label: '下一页' },
  { component: ChevronDownIcon, name: 'ChevronDownIcon', label: '展开' },
  { component: ExternalLinkIcon, name: 'ExternalLinkIcon', label: '外链' },
  { component: InfoIcon, name: 'InfoIcon', label: '信息' },
  { component: SuccessIcon, name: 'SuccessIcon', label: '成功' },
  { component: WarningIcon, name: 'WarningIcon', label: '注意' },
  { component: ErrorIcon, name: 'ErrorIcon', label: '错误' },
];

export default function IconGallery() {
  return (
    <ul
      aria-label="手绘功能图标"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 112px), 1fr))',
        gap: 24,
        padding: 0,
        margin: 0,
        listStyle: 'none',
      }}
    >
      {icons.map(({ component: Glyph, name, label }) => (
        <li key={name} style={{ display: 'grid', justifyItems: 'center', gap: 8, minWidth: 0 }}>
          <Glyph size="lg" />
          <Text size="sm">{label}</Text>
          <code style={{ fontSize: 12, overflowWrap: 'anywhere' }}>{name}</code>
        </li>
      ))}
    </ul>
  );
}
