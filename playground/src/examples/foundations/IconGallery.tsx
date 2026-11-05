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
  { component: SearchIcon, label: '搜索' },
  { component: CloseIcon, label: '关闭' },
  { component: BookmarkIcon, label: '收藏' },
  { component: CopyIcon, label: '复制' },
  { component: CheckIcon, label: '完成' },
  { component: PlusIcon, label: '新增' },
  { component: EditIcon, label: '编辑' },
  { component: TrashIcon, label: '删除' },
  { component: ArrowLeftIcon, label: '上一页' },
  { component: ArrowRightIcon, label: '下一页' },
  { component: ChevronDownIcon, label: '展开' },
  { component: ExternalLinkIcon, label: '外链' },
  { component: InfoIcon, label: '信息' },
  { component: SuccessIcon, label: '成功' },
  { component: WarningIcon, label: '注意' },
  { component: ErrorIcon, label: '错误' },
];

export default function IconGallery() {
  return (
    <ul
      aria-label="手绘功能图标"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 80px), 1fr))',
        gap: 24,
        padding: 0,
        margin: 0,
        listStyle: 'none',
      }}
    >
      {icons.map(({ component: Glyph, label }) => (
        <li key={label} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Glyph size="lg" />
          <Text size="sm">{label}</Text>
        </li>
      ))}
    </ul>
  );
}
