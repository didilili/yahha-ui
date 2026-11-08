import { Button } from 'yahha-ui';

export default function ButtonLoadingVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>三墨点（默认）</span>
        <Button loading>保存草稿</Button>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>小花饼</span>
        <Button loading loadingVariant="biscuit">
          保存草稿
        </Button>
      </div>
    </div>
  );
}
