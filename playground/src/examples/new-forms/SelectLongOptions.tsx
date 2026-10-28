import { Select } from 'yahha-ui';

export default function SelectLongOptions() {
  return (
    <div style={{ maxWidth: 340 }}>
      <Select
        label="浏览归档分类"
        defaultValue="journal"
        options={[
          { value: 'journal', label: '日常手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'walking', label: '那些沿着河边散步时记录下来的小小发现与漫长想法' },
          { value: 'photos', label: '散步相册' },
          { value: 'letters', label: '写给朋友的信' },
          { value: 'recipes', label: '厨房里的小记录' },
          { value: 'travel', label: '旅途与见闻' },
          { value: 'favorites', label: '值得再看的收藏' },
        ]}
      />
    </div>
  );
}
