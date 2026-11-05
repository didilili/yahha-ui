import { Link } from 'yahha-ui';

const address = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a';

export default function LinkWrapping() {
  return (
    <div style={{ maxWidth: '32ch', minWidth: 0 }}>
      <Link href={address} external>
        {address}（新标签页）
      </Link>
    </div>
  );
}
