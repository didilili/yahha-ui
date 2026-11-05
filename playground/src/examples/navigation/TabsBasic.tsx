import { Tabs } from 'yahha-ui';

export default function TabsBasic() {
  return (
    <Tabs
      label="小站栏目"
      items={[
        {
          value: 'notes',
          label: '日常随笔',
          content: (
            <article>
              <h3 style={{ marginTop: 0 }}>沿着河岸，慢慢走回家</h3>
              <p style={{ marginBottom: 0 }}>走到桥边才发现，手里还攥着面包店的小票。</p>
            </article>
          ),
        },
        {
          value: 'photos',
          label: '窗边相册',
          content: (
            <ul style={{ margin: 0, paddingLeft: 24 }}>
              <li>清晨落在书页上的阳光</li>
              <li>雨停之后的小花</li>
              <li>厨房里刚烤好的面包</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
