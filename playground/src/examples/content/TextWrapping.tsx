import { Link, Text } from 'yahha-ui';

const paragraphReference = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/p';

export default function TextWrapping() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: '32ch' }}>
      <Text>
        我把这次散步的记录存成
        PersonalJournalWithAVeryLongUnbrokenTitle，留给下个周末，和没赶上散步的朋友一起看。
      </Text>
      <Text>
        段落参考：
        <Link href={paragraphReference} external>
          {paragraphReference}（新标签页）
        </Link>
      </Text>
    </div>
  );
}
